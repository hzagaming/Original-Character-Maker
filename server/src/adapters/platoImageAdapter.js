const fs = require("fs/promises");
const path = require("path");
const { AppError } = require("../utils/errors");

function isPlatoConfigured(config) {
  return Boolean(config.platoApiKey);
}

function normalizeBaseUrl(baseUrl) {
  return baseUrl.replace(/\/+$/, "");
}

function resolvePlatoApiRoot(baseUrl) {
  const normalized = normalizeBaseUrl(baseUrl);

  if (normalized.endsWith("/chat/completions")) {
    return normalized.slice(0, -"/chat/completions".length);
  }

  if (normalized.endsWith("/images/edits")) {
    return normalized.slice(0, -"/images/edits".length);
  }

  return normalized;
}

function buildModelCandidates(config) {
  const explicit = Array.isArray(config.platoImageEditModels)
    ? config.platoImageEditModels.filter(Boolean)
    : [];

  if (explicit.length > 0) {
    return [...new Set(explicit)];
  }

  const primary = config.platoModel || "gpt-image-2";
  const fallbacks = ["qwen-image-edit", "nano-banana", "nano-banana-3.1-flash"].filter(
    (m) => m !== primary
  );
  return [primary, ...fallbacks];
}

function getMimeTypeFromInput(sourceMimeType) {
  if (sourceMimeType === "image/jpg") {
    return "image/jpeg";
  }

  return sourceMimeType || "image/png";
}

function getExtensionFromMimeType(mimeType) {
  if (mimeType === "image/jpeg") {
    return ".jpg";
  }

  if (mimeType === "image/webp") {
    return ".webp";
  }

  return ".png";
}

function getAspectRatioFromContext(destinationPath, prompt) {
  const outputName = path.basename(destinationPath).toLowerCase();
  const hint = String(prompt || "");

  if (outputName.startsWith("cg-") || hint.includes("横屏")) {
    return "16:9";
  }

  return "9:16";
}

function extractEditedImagePayload(responseJson) {
  const firstItem = responseJson?.data?.[0];
  const directUrl =
    firstItem?.url ||
    firstItem?.image_url ||
    firstItem?.output_url ||
    responseJson?.metadata?.output?.choices?.[0]?.message?.content?.[0]?.image;

  if (typeof directUrl === "string" && directUrl) {
    return {
      remoteUrl: directUrl,
    };
  }

  const b64Payload =
    firstItem?.b64_json ||
    firstItem?.image_base64 ||
    responseJson?.metadata?.output?.choices?.[0]?.message?.content?.[0]?.b64_json;

  if (typeof b64Payload === "string" && b64Payload) {
    return {
      mimeType: "image/png",
      data: b64Payload,
    };
  }

  throw new Error(
    responseJson?.error?.message ||
      "Plato images/edits returned no image payload. Check the image-edit channel and model availability.",
  );
}

async function writeImagePayload(destinationPath, imagePayload) {
  let mimeType = imagePayload.mimeType;
  let imageBuffer;

  if (imagePayload.remoteUrl) {
    const remoteController = new AbortController();
    const remoteTimeout = setTimeout(() => remoteController.abort(), 30000);
    try {
      const remoteResponse = await fetch(imagePayload.remoteUrl, { signal: remoteController.signal });
      clearTimeout(remoteTimeout);
      if (!remoteResponse.ok) {
        throw new AppError(
          `Plato image download failed with status ${remoteResponse.status}`,
          502,
          {
            provider: "plato",
            image_url: imagePayload.remoteUrl,
            http_status: remoteResponse.status,
          },
          "PLATO_IMAGE_DOWNLOAD_FAILED",
        );
      }

      const contentType = remoteResponse.headers.get("content-type") || "";
      mimeType = contentType.startsWith("image/") ? contentType.split(";")[0] : "image/png";
      imageBuffer = Buffer.from(await remoteResponse.arrayBuffer());
    } catch (error) {
      clearTimeout(remoteTimeout);
      throw error;
    }
  } else {
    mimeType = imagePayload.mimeType || "image/png";
    imageBuffer = Buffer.from(imagePayload.data, "base64");
  }

  const ext = getExtensionFromMimeType(mimeType);
  const parsed = path.parse(destinationPath);
  const finalPath = path.join(parsed.dir, `${parsed.name}${ext}`);

  await fs.mkdir(path.dirname(finalPath), { recursive: true });
  await fs.writeFile(finalPath, imageBuffer);

  return {
    provider: "plato",
    mime_type: mimeType,
    output_path: finalPath,
    debug: imagePayload.remoteUrl
      ? {
          image_url: imagePayload.remoteUrl,
        }
      : null,
  };
}

function isRetryableImagesEditFailure(code, message, status) {
  const normalizedCode = String(code || "").toLowerCase();
  const normalizedMessage = String(message || "").toLowerCase();

  return (
    status === 429 ||
    status === 503 ||
    normalizedCode === "model_not_found" ||
    normalizedCode === "invalid_request" ||
    normalizedMessage.includes("prompt图片未通过审核") ||
    normalizedMessage.includes("may contains sensitive words") ||
    normalizedMessage.includes("当前分组上游负载已饱和") ||
    normalizedMessage.includes("当前所选分组") ||
    normalizedMessage.includes("parameter error")
  );
}

async function callPlatoImageEdit({ config, sourcePath, sourceMimeType, destinationPath, prompt, seed, negativePrompt }) {
  if (!isPlatoConfigured(config)) {
    throw new AppError(
      "PLATO_API_KEY is missing.",
      500,
      {
        provider: "plato",
        base_url: config.platoBaseUrl,
      },
      "PLATO_API_KEY_MISSING",
    );
  }

  if (!["image/png", "image/jpeg", "image/jpg", "image/webp"].includes(sourceMimeType)) {
    throw new AppError(
      "Plato image edit currently supports PNG, JPG, JPEG, and WEBP inputs only.",
      400,
      {
        provider: "plato",
        received_mime_type: sourceMimeType,
      },
      "PLATO_UNSUPPORTED_MIME_TYPE",
    );
  }

  const imageBytes = await fs.readFile(sourcePath);
  const mimeType = getMimeTypeFromInput(sourceMimeType);
  const apiRoot = resolvePlatoApiRoot(config.platoBaseUrl);
  const endpoint = `${apiRoot}/images/edits`;
  const candidates = buildModelCandidates(config);
  const aspectRatio = getAspectRatioFromContext(destinationPath, prompt);
  const attemptErrors = [];

  for (const modelName of candidates) {
    const body = new FormData();
    body.append("model", modelName);
    body.append("prompt", prompt);
    body.append("response_format", "url");
    body.append("aspect_ratio", aspectRatio);
    body.append("image", new Blob([imageBytes], { type: mimeType }), path.basename(sourcePath));

    let response;
    let responseJson = null;
    let rawBody = "";

    try {
      response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${config.platoApiKey}`,
        },
        body,
        signal: AbortSignal.timeout(config.platoTimeoutMs),
      });

      rawBody = await response.text();
      try {
        responseJson = rawBody ? JSON.parse(rawBody) : {};
      } catch (_error) {
        responseJson = {};
      }
    } catch (error) {
      attemptErrors.push({
        model: modelName,
        code: "PLATO_NETWORK_ERROR",
        message: error.message,
      });
      continue;
    }

    if (!response.ok) {
      const errorCode = responseJson?.error?.code || responseJson?.code || "PLATO_REQUEST_FAILED";
      const errorMessage =
        responseJson?.error?.message ||
        responseJson?.message ||
        `Plato images/edits request failed with status ${response.status}`;

      attemptErrors.push({
        model: modelName,
        code: errorCode,
        message: errorMessage,
        http_status: response.status,
      });

      if (isRetryableImagesEditFailure(errorCode, errorMessage, response.status)) {
        continue;
      }

      throw new AppError(
        errorMessage,
        502,
        {
          provider: "plato",
          endpoint,
          model: modelName,
          http_status: response.status,
          response_body: rawBody,
          source_path: sourcePath,
          source_mime_type: mimeType,
        },
        "PLATO_REQUEST_FAILED",
      );
    }

    let imagePayload;

    try {
      imagePayload = extractEditedImagePayload(responseJson);
    } catch (error) {
      attemptErrors.push({
        model: modelName,
        code: "PLATO_IMAGE_PAYLOAD_MISSING",
        message: error.message,
      });
      continue;
    }

    const result = await writeImagePayload(destinationPath, imagePayload);
    return {
      ...result,
      debug: {
        ...(result.debug || {}),
        requested_prompt: prompt,
        requested_model: modelName,
        endpoint,
        aspect_ratio: aspectRatio,
        fallback_chain: candidates,
        seed: seed ?? null,
        negative_prompt: negativePrompt ?? null,
      },
    };
  }

  const lastAttempt = attemptErrors[attemptErrors.length - 1] || null;
  const unavailableModels = attemptErrors
    .filter((item) => item.code === "model_not_found" || item.code === "invalid_request")
    .map((item) => item.model);
  const blockedModels = attemptErrors
    .filter((item) => String(item.code).includes("POLICY") || String(item.message).includes("审核") || String(item.message).includes("sensitive"))
    .map((item) => item.model);

  throw new AppError(
    unavailableModels.length > 0
      ? `当前 API 已连接成功，但当前图像编辑模型通道不可用。不可用模型：${[...new Set(unavailableModels)].join("、")}`
      : blockedModels.length > 0
        ? `当前 API 已连接成功，但当前图像编辑请求被上游内容策略拦截。受影响模型：${[...new Set(blockedModels)].join("、")}`
        : "Plato image edit request could not produce a usable image.",
    502,
    {
      provider: "plato",
      endpoint,
      attempted_models: candidates,
      attempt_errors: attemptErrors,
      hint:
        unavailableModels.length > 0
          ? "当前 key 对部分图像编辑模型没有通道。建议优先使用 qwen-image-edit，或在服务商后台开通对应模型。"
          : blockedModels.length > 0
            ? "当前提示词或参考图被上游审核拦截。建议减少平台会自动改写成参数串的描述，改用更直白的图生图提示词。"
            : "请检查上游图像编辑模型的可用性、额度和返回格式。",
      last_attempt: lastAttempt,
      source_path: sourcePath,
      source_mime_type: mimeType,
      requested_prompt: prompt,
      aspect_ratio: aspectRatio,
    },
    "PLATO_IMAGE_PIPELINE_UNAVAILABLE",
  );
}

async function platoRemoveBackground(args) {
  return callPlatoImageEdit(args);
}

async function platoGenerateExpression(args) {
  return callPlatoImageEdit(args);
}

async function platoGenerateCg(args) {
  return callPlatoImageEdit(args);
}

async function platoEditImage(args) {
  return callPlatoImageEdit(args);
}

module.exports = {
  isPlatoConfigured,
  platoGenerateCg,
  platoGenerateExpression,
  platoRemoveBackground,
  platoEditImage,
};
