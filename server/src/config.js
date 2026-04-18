const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const projectRoot = path.resolve(__dirname, "../..");
const isWindows = process.platform === "win32";

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

module.exports = {
  projectRoot,
  port: parseInteger(process.env.PORT, 3001),
  corsOrigin: process.env.CORS_ORIGIN || "*",
  maxUploadSizeBytes: parseInteger(process.env.MAX_UPLOAD_SIZE_BYTES, 10 * 1024 * 1024),
  minImageWidth: parseInteger(process.env.MIN_IMAGE_WIDTH, 256),
  minImageHeight: parseInteger(process.env.MIN_IMAGE_HEIGHT, 256),
  imageGenConcurrency: parseInteger(process.env.IMAGE_GEN_CONCURRENCY, 2),
  rembgConcurrency: parseInteger(process.env.REMBG_CONCURRENCY, 1),
  pipelineMode: process.env.PIPELINE_MODE || "mock",
  bgRemovalProvider: process.env.BG_REMOVAL_PROVIDER || "rembg",
  expressionProvider: process.env.EXPRESSION_PROVIDER || "mock",
  cgProvider: process.env.CG_PROVIDER || "mock",
  rembgPythonPath:
    process.env.REMBG_PYTHON_PATH ||
    (isWindows ? path.resolve(projectRoot, ".venv/Scripts/python.exe") : path.resolve(projectRoot, ".venv/bin/python")),
  rembgScriptPath:
    process.env.REMBG_SCRIPT_PATH || path.resolve(projectRoot, "server/scripts/rembg_remove.py"),
  rembgModel: process.env.REMBG_MODEL || "isnet-anime",
  rembgTimeoutMs: parseInteger(process.env.REMBG_TIMEOUT_MS, 180000),
  rembgMinCoverageRatio: Number.parseFloat(process.env.REMBG_MIN_COVERAGE_RATIO || "0.01"),
  platoApiKey: process.env.PLATO_API_KEY || "",
  platoBaseUrl: process.env.PLATO_BASE_URL || "https://api.bltcy.ai/v1",
  platoModel: process.env.PLATO_MODEL || "gemini-3.1-flash-image-preview",
  platoModelFallbacks: parseStringList(process.env.PLATO_MODEL_FALLBACKS || ""),
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
  webDir: projectRoot,
  webDistDir: path.resolve(projectRoot, "dist"),
  promptsDir: path.resolve(projectRoot, "prompts")
};
