const fs = require("fs/promises");
const path = require("path");
const { AppError } = require("../utils/errors");

function isPlatoConfigured(config) {
  return Boolean(config.platoApiKey);
}

function normalizeBaseUrl(baseUrl) {
  return baseUrl.replace(/\/+$/, "");
}

function resolvePlatoEndpoint(baseUrl) {
  const normalized = normalizeBaseUrl(baseUrl);

  if (normalized.endsWith("/chat/completions")) {
    return normalized;
  }

  return `${normalized}/chat/completions`;
}

function buildModelCandidates(config) {
  return [config.platoModel, ...(config.platoModelFallbacks || [])].filter(
    (value, index, list) => Boolean(value) && list.indexOf(value) === index,
  );
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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

function findImageDataUrl(value) {
  if (!value || typeof value !== "string") {
    return null;
  }

  const match = value.match(/data:(image\/[a-zA-Z0-9.+-]+);base64,([A-Za-z0-9+/=\n\r]+)/);
  if (!match) {
    return null;
  }

  return {
    mimeType: match[1],
    data: match[2].replace(/\s+/g, "")
  };
}

function findRemoteImageUrl(value) {
  if (!value || typeof value !== "string") {
    return null;
  }

  const markdownMatch = value.match(/!\[[^\]]*\]\((https?:\/\/[^)\s]+)\)/);
  if (markdownMatch) {
    return markdownMatch[1];
  }

  const directMatch = value.match(/https?:\/\/\S+\.(?:png|jpg|jpeg|webp)(?:\?\S*)?/i);
  if (directMatch) {
    return directMatch[0];
  }

  return null;
}

function parseEventStreamContent(rawText) {
  const contentParts = [];

  for (const line of rawText.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed.startsWith("data:")) {
      continue;
    }

    const payload = trimmed.slice(5).trim();
    if (!payload || payload === "[DONE]") {
      continue;
    }

    try {
      const parsed = JSON.parse(payload);
      const deltaContent = parsed?.choices?.[0]?.delta?.content;
      if (typeof deltaContent === "string" && deltaContent) {
        contentParts.push(deltaContent);
      }
    } catch (_error) {
      continue;
    }
  }

  return contentParts.join("");
}

function extractImagePayload(responseJson) {
  const message = responseJson?.choices?.[0]?.message;
  const messageContent =
    typeof message?.content === "string"
      ? message.content
      : Array.isArray(message?.content)
        ? message.content
            .map((item) => item?.text || item?.content || "")
            .filter(Boolean)
            .join("\n")
        : "";

  const directImage = message?.images?.find((item) => item?.image_url?.url);
  if (directImage?.image_url?.url) {
    const parsed = findImageDataUrl(directImage.image_url.url);
    if (parsed) {
      return parsed;
    }

    const remoteUrl = findRemoteImageUrl(directImage.image_url.url);
    if (remoteUrl) {
      return {
        remoteUrl
      };
    }
  }

  if (Array.isArray(message?.content)) {
    for (const item of message.content) {
      const candidateUrl =
        item?.image_url?.url ||
        item?.url ||
        item?.data ||
        (typeof item?.text === "string" ? item.text : null);

      const parsed = findImageDataUrl(candidateUrl);
      if (parsed) {
        return parsed;
      }

      const remoteUrl = findRemoteImageUrl(candidateUrl);
      if (remoteUrl) {
        return {
          remoteUrl
        };
      }
    }
  }

  if (typeof message?.content === "string") {
    const parsed = findImageDataUrl(message.content);
    if (parsed) {
      return parsed;
    }

    const remoteUrl = findRemoteImageUrl(message.content);
    if (remoteUrl) {
      return {
        remoteUrl
      };
    }
  }

  throw new Error(
    responseJson?.error?.message ||
      (messageContent
        ? `Plato did not return an image. Model response: ${messageContent}`
        : "Plato returned no image payload. Check whether the token has quota and image output is enabled.")
  );
}

async function parsePlatoResponse(response) {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("text/event-stream")) {
    const rawText = await response.text();
    const combinedContent = parseEventStreamContent(rawText);

    return {
      responseJson: {
        choices: [
          {
            message: {
              content: combinedContent,
            },
          },
        ],
      },
      rawBody: rawText,
    };
  }

  const responseJson = await response.json();
  return {
    responseJson,
    rawBody: JSON.stringify(responseJson),
  };
}

async function writeImagePayload(destinationPath, imagePayload) {
  let mimeType = imagePayload.mimeType;
  let imageBuffer;

  if (imagePayload.remoteUrl) {
    const remoteResponse = await fetch(imagePayload.remoteUrl);
    if (!remoteResponse.ok) {
      throw new AppError(
        `Plato image download failed with status ${remoteResponse.status}`,
        502,
        {
          provider: "plato",
          image_url: imagePayload.remoteUrl,
          http_status: remoteResponse.status
        },
        "PLATO_IMAGE_DOWNLOAD_FAILED"
      );
    }

    const contentType = remoteResponse.headers.get("content-type") || "";
    mimeType = contentType.startsWith("image/") ? contentType.split(";")[0] : "image/png";
    imageBuffer = Buffer.from(await remoteResponse.arrayBuffer());
  } else {
    mimeType = imagePayload.mimeType;
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
          image_url: imagePayload.remoteUrl
        }
      : null
  };
}

async function callPlatoImageEdit({
  config,
  sourcePath,
  sourceMimeType,
  destinationPath,
  prompt
}) {
  if (!isPlatoConfigured(config)) {
    throw new AppError("PLATO_API_KEY is missing.", 500, {
      provider: "plato",
      base_url: config.platoBaseUrl,
      model: config.platoModel
    }, "PLATO_API_KEY_MISSING");
  }

  if (!["image/png", "image/jpeg", "image/jpg", "image/webp"].includes(sourceMimeType)) {
    throw new AppError(
      "Plato live mode currently supports PNG, JPG, JPEG, and WEBP inputs only.",
      400,
      {
        provider: "plato",
        received_mime_type: sourceMimeType
      },
      "PLATO_UNSUPPORTED_MIME_TYPE"
    );
  }

  const imageBytes = await fs.readFile(sourcePath);
  const endpoint = resolvePlatoEndpoint(config.platoBaseUrl);
  const dataUrl = `data:${getMimeTypeFromInput(sourceMimeType)};base64,${imageBytes.toString("base64")}`;

  const candidates = buildModelCandidates(config);
  const attemptErrors = [];

  for (const modelName of candidates) {
    let response;
    let responseJson;
    let rawBody = "";
    let lastError = null;

    for (let attempt = 1; attempt <= 3; attempt += 1) {
      try {
        response = await fetch(endpoint, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${config.platoApiKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: modelName,
            messages: [
              {
                role: "user",
                content: [
                  {
                    type: "text",
                    text: prompt
                  },
                  {
                    type: "image_url",
                    image_url: {
                      url: dataUrl
                    }
                  }
                ]
              }
            ],
            modalities: ["text", "image"]
          }),
          signal: AbortSignal.timeout(config.platoTimeoutMs)
        });

        const parsed = await parsePlatoResponse(response);
        responseJson = parsed.responseJson;
        rawBody = parsed.rawBody;
        lastError = null;
        break;
      } catch (error) {
        lastError = error;
        if (attempt < 3) {
          await wait(600 * attempt);
        }
      }
    }

    if (lastError) {
      attemptErrors.push({
        model: modelName,
        code: "PLATO_NETWORK_ERROR",
        message: lastError.message,
      });
      continue;
    }

    if (!response.ok) {
      const errorMessage =
        responseJson?.error?.message || `Plato request failed with status ${response.status}`;
      const errorCode = responseJson?.error?.code || "";

      attemptErrors.push({
        model: modelName,
        code: errorCode || "PLATO_REQUEST_FAILED",
        message: errorMessage,
        http_status: response.status,
      });

      if (errorCode === "model_not_found") {
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
        },
        "PLATO_REQUEST_FAILED",
      );
    }

    if (typeof responseJson?.choices?.[0]?.message?.content === "string") {
      const messageText = responseJson.choices[0].message.content;
      if (/内容生成失败|sensitive words/i.test(messageText)) {
        attemptErrors.push({
          model: modelName,
          code: "PLATO_CONTENT_POLICY_BLOCKED",
          message: messageText,
        });
        continue;
      }
    }

    let imagePayload;

    try {
      imagePayload = extractImagePayload(responseJson);
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
        requested_model: config.platoModel,
        resolved_model: modelName,
        fallback_chain: candidates,
      },
    };
  }

  const lastAttempt = attemptErrors[attemptErrors.length - 1] || null;
  const unavailableModels = attemptErrors
    .filter((item) => item.code === "model_not_found")
    .map((item) => item.model);
  const contentBlockedModels = attemptErrors
    .filter((item) => item.code === "PLATO_CONTENT_POLICY_BLOCKED")
    .map((item) => item.model);

  throw new AppError(
    unavailableModels.length > 0
      ? `当前 API 已连接成功，但图像模型通道不可用。不可用模型：${unavailableModels.join("、")}`
      : contentBlockedModels.length > 0
        ? `当前 API 已连接成功，但图像模型请求被内容策略拦截。受影响模型：${contentBlockedModels.join("、")}`
        : "Plato image request could not produce a usable image.",
    502,
    {
      provider: "plato",
      endpoint,
      model: config.platoModel,
      attempted_models: candidates,
      attempt_errors: attemptErrors,
      hint:
        unavailableModels.length > 0
          ? "请切换到该服务商当前可用的图像模型，或为当前 key 开通对应分组 / 通道。"
          : contentBlockedModels.length > 0
            ? "当前带参考图的改图请求被上游内容策略拦截。可改用其他图像模型，或暂时回退到 mock / 本地流程保证工作流跑通。"
            : "请检查上游模型返回格式、额度和图像输出能力。",
      last_attempt: lastAttempt,
      source_path: sourcePath,
      source_mime_type: sourceMimeType,
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

module.exports = {
  isPlatoConfigured,
  platoGenerateCg,
  platoGenerateExpression,
  platoRemoveBackground
};
