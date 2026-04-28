const sizeOf = require("image-size");
const { AppError } = require("../utils/errors");

const SUPPORTED_MIME_TYPES = new Set(["image/png", "image/jpeg", "image/jpg", "image/webp"]);

function validateUploadedFile(file, config) {
  if (!file) {
    throw new AppError("No image uploaded. Please provide one image file in field 'image'.", 400);
  }

  if (!SUPPORTED_MIME_TYPES.has(file.mimetype)) {
    throw new AppError(
      "Unsupported file type. Allowed: PNG, JPG, JPEG, WEBP.",
      400
    );
  }

  if (file.size > config.maxUploadSizeBytes) {
    throw new AppError(
      `File is too large. Maximum allowed is ${Math.floor(config.maxUploadSizeBytes / (1024 * 1024))}MB.`,
      400
    );
  }

  let dimensions;
  try {
    dimensions = sizeOf(file.path);
  } catch (error) {
    throw new AppError("Unable to read image dimensions. Please upload a valid image file.", 400);
  }

  if (!dimensions.width || !dimensions.height) {
    throw new AppError("Image dimensions are missing. Please upload a valid image.", 400);
  }

  if (dimensions.width < config.minImageWidth || dimensions.height < config.minImageHeight) {
    throw new AppError(
      `Image is too small. Minimum size is ${config.minImageWidth}x${config.minImageHeight}px.`,
      400
    );
  }

  return {
    original_name: file.originalname,
    mime_type: file.mimetype,
    size_bytes: file.size,
    width: dimensions.width,
    height: dimensions.height,
    upload_path: file.path,
    public_url: `/uploads/${file.filename}`
  };
}

module.exports = {
  validateUploadedFile,
  SUPPORTED_MIME_TYPES
};
