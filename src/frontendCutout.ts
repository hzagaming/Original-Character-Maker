import { preload, removeBackground, type Config } from '@imgly/background-removal';

export type ExpressionName = 'thinking' | 'surprise' | 'angry';

let preloaded = false;
let preloadedPublicPath = '';

function buildCutoutConfig(publicPath: string): Config {
  return {
    publicPath,
    device: 'cpu',
    model: 'isnet_fp16',
  };
}

export async function ensureCutoutModelLoaded(publicPath: string) {
  if (preloaded && preloadedPublicPath === publicPath) return;
  await preload(buildCutoutConfig(publicPath));
  preloaded = true;
  preloadedPublicPath = publicPath;
}

export async function generateCutoutPngBlob(source: Blob, publicPath: string): Promise<Blob> {
  const config = buildCutoutConfig(publicPath);
  await ensureCutoutModelLoaded(publicPath);
  const blob = await removeBackground(source, config);
  return blob;
}

