const express = require("express");
const fs = require("fs/promises");
const syncFs = require("fs");
const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const config = require("../config");
const { AppError } = require("../utils/errors");
const { validateUploadedFile } = require("../services/fileValidation");
const { platoEditImage, isPlatoConfigured } = require("../adapters/platoImageAdapter");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, config.uploadDir);
  },
  filename: (_req, file, callback) => {
    const ext = path.extname(file.originalname) || ".png";
    const id = uuidv4().replace(/-/g, "").slice(0, 10);
    callback(null, `char-gif-${Date.now()}-${id}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: config.maxUploadSizeBytes
  }
});

function parseGifConfig(value) {
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

router.post("/", upload.single("image"), async (req, res, next) => {
  try {
    const sourceImage = validateUploadedFile(req.file, config);
    const gifConfig = parseGifConfig(req.body?.gifConfig);
    const {
      model,
      prompt,
      negativePrompt,
      seed,
      temperature,
      topP,
      topK,
      steps,
      cfg,
      frames,
      fps,
      loop,
      duration,
      motionType,
      easing,
      reverseLoop,
      aspectRatio,
      imageSize,
      styleIntensity,
      lineArtStyle,
      colorScheme,
      backgroundType,
      lightingStyle,
      cameraAngle,
      characterMood,
      outfitDetail,
      eyeStyle,
      hairStyle,
      skinTexture,
      needCutout,
      keepPalette,
      preservePose,
      faceLock,
      detailBoost,
      extraPositiveTags,
      extraNegativeTags,
    } = gifConfig;

    if (!isPlatoConfigured(config)) {
      throw new AppError(
        "PLATO_API_KEY is not configured on the server. Please set PLATO_API_KEY in the backend .env file.",
        503,
        { provider: "plato" },
        "PLATO_NOT_CONFIGURED"
      );
    }

    const outputDir = path.join(config.outputDir, "character-gif");
    await fs.mkdir(outputDir, { recursive: true });
    const outputPath = path.join(outputDir, `output-${Date.now()}.gif`);

    // Build rich prompt from all parameters
    const parts = [prompt || "Transform this character image into an animated GIF"];
    if (motionType) parts.push(`motion: ${motionType}`);
    if (frames !== undefined) parts.push(`frames: ${frames}`);
    if (fps !== undefined) parts.push(`fps: ${fps}`);
    if (loop !== undefined) parts.push(`loop: ${loop}`);
    if (duration !== undefined) parts.push(`duration: ${duration}ms`);
    if (easing) parts.push(`easing: ${easing}`);
    if (reverseLoop) parts.push("reverse loop");
    if (aspectRatio) parts.push(`aspect ratio: ${aspectRatio}`);
    if (imageSize) parts.push(`size: ${imageSize}`);
    if (styleIntensity !== undefined) parts.push(`style intensity: ${styleIntensity}`);
    if (lineArtStyle) parts.push(`line art: ${lineArtStyle}`);
    if (colorScheme) parts.push(`color scheme: ${colorScheme}`);
    if (backgroundType) parts.push(`background: ${backgroundType}`);
    if (lightingStyle) parts.push(`lighting: ${lightingStyle}`);
    if (cameraAngle) parts.push(`camera angle: ${cameraAngle}`);
    if (characterMood) parts.push(`mood: ${characterMood}`);
    if (outfitDetail) parts.push(`outfit: ${outfitDetail}`);
    if (eyeStyle) parts.push(`eyes: ${eyeStyle}`);
    if (hairStyle) parts.push(`hair: ${hairStyle}`);
    if (skinTexture) parts.push(`skin: ${skinTexture}`);
    if (preservePose) parts.push("preserve original pose");
    if (faceLock) parts.push("keep face consistent");
    if (detailBoost) parts.push("enhance details");
    if (keepPalette) parts.push("maintain original color palette");
    if (needCutout) parts.push("transparent background");
    if (Array.isArray(extraPositiveTags) && extraPositiveTags.length > 0) {
      parts.push(...extraPositiveTags);
    }

    if (negativePrompt) {
      parts.push(`Avoid: ${negativePrompt}`);
    }
    const fullPrompt = parts.join(", ");

    const result = await platoEditImage({
      config,
      sourcePath: sourceImage.upload_path,
      sourceMimeType: sourceImage.mime_type,
      destinationPath: outputPath,
      prompt: fullPrompt,
      seed,
      negativePrompt,
      requestedModel: model || config.platoModel,
    });

    res.status(200).json({
      success: true,
      outputUrl: `/outputs/character-gif/${path.basename(result.output_path)}`,
      outputPath: result.output_path,
      requestedModel: model || config.platoModel,
      prompt: fullPrompt,
      debug: result.debug,
    });
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
