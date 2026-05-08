const fs = require("fs/promises");
const path = require("path");
const sharp = require("sharp");

const EXPRESSION_CANVAS_WIDTH = 1080;
const EXPRESSION_CANVAS_HEIGHT = 1920;
const EDGE_CUTOUT_THRESHOLD = 42 * 42;

async function normalizeExpressionImage(inputPath, options = {}) {
  const width = Math.max(256, Number(options.width) || EXPRESSION_CANVAS_WIDTH);
  const height = Math.max(256, Number(options.height) || EXPRESSION_CANVAS_HEIGHT);
  const parsed = path.parse(inputPath);
  const finalPath = path.join(parsed.dir, `${parsed.name}.png`);
  const normalizedPath = path.join(parsed.dir, `${parsed.name}.normalized.png`);
  const tempPath = path.join(parsed.dir, `${parsed.name}.normalized.${process.pid}.${Date.now()}.tmp.png`);

  const metadata = await sharp(inputPath).metadata();
  await sharp(inputPath, { failOn: "none" })
    .rotate()
    .resize(width, height, {
      fit: "contain",
      withoutEnlargement: false,
      background: { r: 255, g: 255, b: 255, alpha: 0 }
    })
    .png({
      compressionLevel: 9,
      adaptiveFiltering: true
    })
    .toFile(tempPath);

  await fs.rename(tempPath, normalizedPath);
  await fs.copyFile(normalizedPath, finalPath);
  await fs.rm(normalizedPath, { force: true }).catch(() => null);
  if (path.resolve(finalPath) !== path.resolve(inputPath)) {
    await fs.rm(inputPath, { force: true }).catch(() => null);
  }

  return {
    outputPath: finalPath,
    width,
    height,
    original_width: metadata.width || null,
    original_height: metadata.height || null,
    normalized: true
  };
}

function colorDistanceSquared(data, index, color) {
  const dr = data[index] - color[0];
  const dg = data[index + 1] - color[1];
  const db = data[index + 2] - color[2];
  return dr * dr + dg * dg + db * db;
}

function sampleCornerColors(data, width, height) {
  return [
    [0, 0],
    [width - 1, 0],
    [0, height - 1],
    [width - 1, height - 1]
  ].map(([x, y]) => {
    const index = (y * width + x) * 4;
    return [data[index], data[index + 1], data[index + 2]];
  });
}

async function generateEdgeColorCutout(inputPath, outputPath, options = {}) {
  const threshold = Number(options.threshold) || EDGE_CUTOUT_THRESHOLD;
  const image = sharp(inputPath, { failOn: "none" })
    .rotate()
    .ensureAlpha()
    .raw();
  const { data, info } = await image.toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  if (channels !== 4) {
    throw new Error(`Expected RGBA image for cutout, got ${channels} channels.`);
  }

  const cornerColors = sampleCornerColors(data, width, height);
  const visited = new Uint8Array(width * height);
  const queue = [];

  function enqueue(x, y) {
    if (x < 0 || y < 0 || x >= width || y >= height) return;
    const pixel = y * width + x;
    if (visited[pixel]) return;
    const index = pixel * 4;
    const isBackground = cornerColors.some((color) => colorDistanceSquared(data, index, color) <= threshold);
    if (!isBackground) return;
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

  await sharp(data, {
    raw: {
      width,
      height,
      channels: 4
    }
  })
    .png({
      compressionLevel: 9,
      adaptiveFiltering: true
    })
    .toFile(outputPath);

  return {
    outputPath,
    width,
    height,
    removed_pixels: queue.length,
    provider: "server-edge-cutout"
  };
}

module.exports = {
  EXPRESSION_CANVAS_WIDTH,
  EXPRESSION_CANVAS_HEIGHT,
  generateEdgeColorCutout,
  normalizeExpressionImage
};
