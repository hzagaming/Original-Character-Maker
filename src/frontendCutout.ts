import { preload, removeBackground, type Config } from '@imgly/background-removal';

export type ExpressionName = 'thinking' | 'surprise' | 'angry';

export const DEFAULT_CUTOUT_ASSET_PUBLIC_PATH =
  'https://staticimgly.com/@imgly/background-removal-data/1.7.0/dist/';

const preloadedPublicPaths = new Set<string>();

function buildCutoutConfig(publicPath: string): Config {
  return {
    publicPath,
    device: 'cpu',
    model: 'isnet_fp16',
  };
}

export async function ensureCutoutModelLoaded(publicPath: string) {
  if (preloadedPublicPaths.has(publicPath)) return;
  await preload(buildCutoutConfig(publicPath));
  preloadedPublicPaths.add(publicPath);
}

export async function generateCutoutPngBlob(source: Blob, publicPath: string): Promise<Blob> {
  const config = buildCutoutConfig(publicPath);
  await ensureCutoutModelLoaded(publicPath);
  const blob = await removeBackground(source, config);
  return blob;
}

