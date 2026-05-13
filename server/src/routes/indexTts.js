const express = require("express");
const fs = require("fs/promises");
const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const config = require("../config");
const { AppError } = require("../utils/errors");
const { validateUploadedFile } = require("../services/fileValidation");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, config.uploadDir);
  },
  filename: (_req, file, callback) => {
    const ext = path.extname(file.originalname) || ".wav";
    const id = uuidv4().replace(/-/g, "").slice(0, 10);
    callback(null, `it-${Date.now()}-${id}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: config.maxUploadSizeBytes
  }
});

function parseTtsConfig(value) {
  if (!value) {
    return {};
  }
  if (typeof value === "object") {
    return value;
  }
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch (_error) {
    return {};
  }
}

router.post("/", upload.single("referenceAudio"), async (req, res, next) => {
  try {
    const text = req.body?.text;
    if (!text || typeof text !== "string" || !text.trim()) {
      throw new AppError(
        "Text input is required for TTS generation.",
        400,
        { field: "text" },
        "INDEX_TTS_TEXT_MISSING"
      );
    }

    const referenceAudio = req.file ? validateUploadedFile(req.file, config) : null;
    const ttsConfig = parseTtsConfig(req.body?.ttsConfig);

    // Placeholder: since no real IndexTTS provider is configured,
    // we return a helpful error with instructions.
    throw new AppError(
      "IndexTTS backend is not yet configured. Please set up an IndexTTS provider (e.g., SiliconFlow IndexTTS-2 API) in the backend .env file and implement the adapter in server/src/adapters/.",
      503,
      { provider: "indextts", textLength: text.length, hasReferenceAudio: Boolean(referenceAudio) },
      "INDEXTTS_NOT_CONFIGURED"
    );

    /*
    // When a real provider is available, replace the throw above with:
    const outputDir = path.join(config.outputDir, "index-tts");
    await fs.mkdir(outputDir, { recursive: true });
    const outputPath = path.join(outputDir, `output-${Date.now()}.${ttsConfig.format || "wav"}`);

    // Call provider adapter here
    // const result = await indexTtsAdapter({ config, text, referenceAudioPath, destinationPath, ...ttsConfig });

    res.status(200).json({
      success: true,
      outputUrl: `/outputs/index-tts/${path.basename(outputPath)}`,
      outputPath,
      format: ttsConfig.format || "wav",
      duration: result.duration,
    });
    */
  } catch (error) {
    if (req.file?.path) {
      try {
        await fs.rm(req.file.path, { force: true });
      } catch {
        // ignore cleanup errors
      }
    }
    next(error);
  }
});

module.exports = router;
