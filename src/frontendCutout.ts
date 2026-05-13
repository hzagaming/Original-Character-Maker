import { preload, removeBackground, type Config } from '@imgly/background-removal';

export type ExpressionName = 'thinking' | 'surprise' | 'angry';

export const DEFAULT_CUTOUT_ASSET_PUBLIC_PATH =
  'https://staticimgly.com/@imgly/background-removal-data/1.7.0/dist/';

const preloadedPublicPaths = new Set<string>();
const CUTOUT_MAX_SOURCE_EDGE = 1536;
const CUTOUT_RETRY_COUNT = 2;
const CUTOUT_RETRY_DELAY_MS = 900;

function buildCutoutConfig(publicPath: string): Config {
  const normalizedPublicPath = publicPath.endsWith('/') ? publicPath : `${publicPath}/`;
  return {
    publicPath: normalizedPublicPath,
    debug: true,
    device: 'cpu',
    model: 'isnet_quint8',
    output: {
      format: 'image/png',
      quality: 0.95,
    },
    progress: (key, current, total) => {
      if (total > 0) {
        console.info(`[Paper2Gal cutout] ${key}: ${current}/${total}`);
      } else {
        console.info(`[Paper2Gal cutout] ${key}`);
      }
    },
  };
}

export async function ensureCutoutModelLoaded(publicPath: string) {
  if (preloadedPublicPaths.has(publicPath)) return;
  await preload(buildCutoutConfig(publicPath));
  preloadedPublicPaths.add(publicPath);
}

function wait(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

async function blobToImage(blob: Blob): Promise<HTMLImageElement> {
  const url = URL.createObjectURL(blob);
  try {
    const image = new Image();
    image.decoding = 'async';
    const loaded = new Promise<HTMLImageElement>((resolve, reject) => {
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error('Failed to decode source image for cutout.'));
    });
    image.src = url;
    return await loaded;
  } finally {
    URL.revokeObjectURL(url);
  }
}

function canvasToPngBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error('Failed to encode cutout PNG.'));
      }
    }, 'image/png');
  });
}

async function prepareCutoutSource(source: Blob): Promise<Blob> {
  const image = await blobToImage(source);
  const width = image.naturalWidth || image.width;
  const height = image.naturalHeight || image.height;
  const longestEdge = Math.max(width, height);
  if (!width || !height || longestEdge <= CUTOUT_MAX_SOURCE_EDGE) {
    return source;
  }

  const scale = CUTOUT_MAX_SOURCE_EDGE / longestEdge;
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(width * scale));
  canvas.height = Math.max(1, Math.round(height * scale));
  const context = canvas.getContext('2d', { alpha: true });
  if (!context) {
    return source;
  }
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = 'high';
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  return canvasToPngBlob(canvas);
}

function colorDistanceSquared(a: Uint8ClampedArray, index: number, color: number[]) {
  const dr = a[index] - color[0];
  const dg = a[index + 1] - color[1];
  const db = a[index + 2] - color[2];
  return dr * dr + dg * dg + db * db;
}

function sampleCornerColors(data: Uint8ClampedArray, width: number, height: number) {
  const points = [
    [0, 0],
    [width - 1, 0],
    [0, height - 1],
    [width - 1, height - 1],
  ];
  return points.map(([x, y]) => {
    const index = (y * width + x) * 4;
    return [data[index], data[index + 1], data[index + 2]];
  });
}

async function generateEdgeColorFallbackCutout(source: Blob): Promise<Blob> {
  const prepared = await prepareCutoutSource(source);
  const image = await blobToImage(prepared);
  const width = image.naturalWidth || image.width;
  const height = image.naturalHeight || image.height;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d', { alpha: true, willReadFrequently: true });
  if (!context) {
    throw new Error('Canvas is not available for fallback cutout.');
  }

  context.drawImage(image, 0, 0, width, height);
  const imageData = context.getImageData(0, 0, width, height);
  const data = imageData.data;
  const cornerColors = sampleCornerColors(data, width, height);
  const threshold = 42 * 42;
  const visited = new Uint8Array(width * height);
  const queue: number[] = [];

  function enqueue(x: number, y: number) {
    if (x < 0 || y < 0 || x >= width || y >= height) return;
    const pixel = y * width + x;
    if (visited[pixel]) return;
    const index = pixel * 4;
    const matchesBackground = cornerColors.some((color) => colorDistanceSquared(data, index, color) <= threshold);
    if (!matchesBackground) return;
    visited[pixel] = 1;
    queue.push(pixel);
  }

  for (let x = 0; x < width; x += 1) {
    enqueue(x, 0);
    enqueue(x, height - 1);
  }
  for (let y = 0; y < height; y += 1) {
    enqueue(0, y);
    enqueue(width - 1, y);
  }

  for (let cursor = 0; cursor < queue.length; cursor += 1) {
    const pixel = queue[cursor];
    const x = pixel % width;
    const y = Math.floor(pixel / width);
    const index = pixel * 4;
    data[index + 3] = 0;
    enqueue(x + 1, y);
    enqueue(x - 1, y);
    enqueue(x, y + 1);
    enqueue(x, y - 1);
  }

  context.putImageData(imageData, 0, 0);
  return canvasToPngBlob(canvas);
}

export async function generateCutoutPngBlob(source: Blob, publicPath: string): Promise<Blob> {
  const config = buildCutoutConfig(publicPath);
  let preparedSource: Blob;
  try {
    preparedSource = await prepareCutoutSource(source);
  } catch (prepError) {
    console.warn('[Paper2Gal cutout] Source preparation failed, trying fallback.', prepError);
    try {
      return await generateEdgeColorFallbackCutout(source);
    } catch (fallbackError) {
      console.error('[Paper2Gal cutout] Fallback cutout failed', fallbackError);
      throw fallbackError;
    }
  }

  let lastError: unknown = null;
  for (let attempt = 0; attempt <= CUTOUT_RETRY_COUNT; attempt += 1) {
    try {
      await ensureCutoutModelLoaded(publicPath);
      return await removeBackground(preparedSource, config);
    } catch (error) {
      lastError = error;
      console.warn(`[Paper2Gal cutout] IMG.LY attempt ${attempt + 1} failed`, error);
      if (attempt < CUTOUT_RETRY_COUNT) {
        await wait(CUTOUT_RETRY_DELAY_MS * (attempt + 1));
      }
    }
  }

  try {
    console.warn('[Paper2Gal cutout] Falling back to edge-color transparent cutout.');
    return await generateEdgeColorFallbackCutout(preparedSource);
  } catch (fallbackError) {
    console.error('[Paper2Gal cutout] Fallback cutout failed', fallbackError);
    throw lastError instanceof Error ? lastError : fallbackError;
  }
}

