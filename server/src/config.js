const path = require("path");
const dotenv = require("dotenv");
const fs = require("fs");

const envPath = path.resolve(__dirname, "../../.env");
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  // On Zeabur and other PaaS platforms, .env is not committed;
  // environment variables are injected via the platform UI.
  dotenv.config();
}

const projectRoot = path.resolve(__dirname, "../..");

function resolvePath(value, fallback) {
  const raw = value || fallback;
  return path.isAbsolute(raw) ? raw : path.resolve(projectRoot, raw);
}

function parseInteger(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? fallback : parsed;
}

function parseStringList(value) {
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function parsePublicBaseUrl(value, corsOrigin) {
  const explicit = String(value || "").trim().replace(/\/+$/, "");
  if (/^https?:\/\//i.test(explicit)) {
    return explicit;
  }

  const corsCandidate = String(corsOrigin || "").trim().replace(/\/+$/, "");
  if (/^https?:\/\//i.test(corsCandidate) && !corsCandidate.includes(",")) {
    return corsCandidate;
  }

  return "";
}

const corsOrigin = process.env.CORS_ORIGIN || "*";

module.exports = {
  projectRoot,
  port: parseInteger(process.env.PORT, 3001),
  corsOrigin,
  publicAppBaseUrl: parsePublicBaseUrl(
    process.env.PUBLIC_APP_BASE_URL ||
      process.env.PUBLIC_BASE_URL ||
      process.env.APP_BASE_URL || "",
    corsOrigin
  ),
  cutoutAssetBaseUrl:
    (process.env.CUTOUT_ASSET_BASE_URL || "https://staticimgly.com/@imgly/background-removal-data/1.7.0/dist").replace(/\/+$/, ""),
  maxUploadSizeBytes: parseInteger(process.env.MAX_UPLOAD_SIZE_BYTES, 10 * 1024 * 1024),
  minImageWidth: parseInteger(process.env.MIN_IMAGE_WIDTH, 256),
  minImageHeight: parseInteger(process.env.MIN_IMAGE_HEIGHT, 256),
  imageGenConcurrency: parseInteger(process.env.IMAGE_GEN_CONCURRENCY, 2),
  pipelineMode: process.env.PIPELINE_MODE || "live",
  bgRemovalProvider: process.env.BG_REMOVAL_PROVIDER || "frontend",
  aliyunAccessKeyId: process.env.ALIBABA_CLOUD_ACCESS_KEY_ID || process.env.ALIYUN_ACCESS_KEY_ID || "",
  aliyunAccessKeySecret: process.env.ALIBABA_CLOUD_ACCESS_KEY_SECRET || process.env.ALIYUN_ACCESS_KEY_SECRET || "",
  aliyunImageSegEndpoint: process.env.ALIYUN_IMAGESEG_ENDPOINT || "imageseg.cn-shanghai.aliyuncs.com",
  aliyunImageSegRegionId: process.env.ALIYUN_IMAGESEG_REGION_ID || "cn-shanghai",
  aliyunImageSegAction: process.env.ALIYUN_IMAGESEG_ACTION || "SegmentCommonImage",
  aliyunImageSegReturnForm: process.env.ALIYUN_IMAGESEG_RETURN_FORM || "",
  aliyunImageSegTimeoutMs: parseInteger(process.env.ALIYUN_IMAGESEG_TIMEOUT_MS, 120000),
  expressionProvider: process.env.EXPRESSION_PROVIDER || "plato",
  cgProvider: process.env.CG_PROVIDER || "plato",
  platoApiKey: process.env.PLATO_API_KEY || "",
  platoBaseUrl: process.env.PLATO_BASE_URL || "https://api.bltcy.ai/v1",
  platoModel: process.env.PLATO_MODEL || "gpt-image-2",
  platoModelFallbacks: parseStringList(process.env.PLATO_MODEL_FALLBACKS || ""),
  platoImageEditModels: parseStringList(process.env.PLATO_IMAGE_EDIT_MODELS || ""),
  platoTimeoutMs: parseInteger(process.env.PLATO_TIMEOUT_MS, 120000),
  allowProviderMockFallback: process.env.ALLOW_PROVIDER_MOCK_FALLBACK !== "false",
  banana2ApiKey: process.env.BANANA2_API_KEY || "",
  banana2BaseUrl: process.env.BANANA2_BASE_URL || "https://api.apiyi.com",
  banana2Model: process.env.BANANA2_MODEL || "gemini-3.1-flash-image-preview",
  banana2ImageSize: process.env.BANANA2_IMAGE_SIZE || "1K",
  banana2AspectRatio: process.env.BANANA2_ASPECT_RATIO || "1:1",
  banana2TimeoutMs: parseInteger(process.env.BANANA2_TIMEOUT_MS, 120000),
  uploadDir: resolvePath(process.env.UPLOAD_DIR, "./tmp/uploads"),
  workflowStateDir: resolvePath(process.env.WORKFLOW_STATE_DIR, "./tmp/workflows"),
  outputDir: resolvePath(process.env.OUTPUT_DIR, "./tmp/outputs"),
  webDir: path.resolve(projectRoot, "dist"),
  promptsDir: path.resolve(projectRoot, "prompts"),
  expressionWhiteBackground: process.env.EXPRESSION_WHITE_BACKGROUND === "true"
};
