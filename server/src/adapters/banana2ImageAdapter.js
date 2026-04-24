const fs = require("fs/promises");
const path = require("path");

function isBanana2Configured(config) {
  return Boolean(config.banana2ApiKey);
}

function normalizeBaseUrl(baseUrl) {
  return baseUrl.replace(/\/+$/, "").replace(/\/v1(?:beta)?$/, "");
}

function getOutputExtension(mimeType) {
  if (mimeType === "image/jpeg") {
    return ".jpg";
  }

  return ".png";
}

async function writeInlineImage(destinationPath, inlineData) {
  const mimeType = inlineData.mimeType || "image/png";
  const ext = getOutputExtension(mimeType);
  const parsed = path.parse(destinationPath);
  const finalPath = path.join(parsed.dir, `${parsed.name}${ext}`);

  await fs.mkdir(path.dirname(finalPath), { recursive: true });
  await fs.writeFile(finalPath, Buffer.from(inlineData.data, "base64"));

  return {
    provider: "banana2",
    mime_type: mimeType,
    output_path: finalPath
  };
}

function extractInlineImage(responseJson) {
  const parts = responseJson?.candidates?.flatMap((candidate) => candidate?.content?.parts || []) || [];
  const inlinePart = parts.find((part) => part?.inlineData?.data);

  if (!inlinePart) {
    const apiMessage =
      responseJson?.error?.message ||
      responseJson?.error?.status ||
      "Banana2 returned no image data.";
    throw new Error(apiMessage);
  }

  return inlinePart.inlineData;
}

async function callBanana2Edit({
  config,
  sourcePath,
  sourceMimeType,
  destinationPath,
  prompt,
  imageSize,
  aspectRatio
}) {
  if (!isBanana2Configured(config)) {
    throw new Error("BANANA2_API_KEY is missing.");
  }

  if (!["image/png", "image/jpeg", "image/jpg"].includes(sourceMimeType)) {
    throw new Error("Banana2 live mode currently supports PNG/JPEG inputs only.");
  }

  const imageBytes = await fs.readFile(sourcePath);
  const endpoint =
    `${normalizeBaseUrl(config.banana2BaseUrl)}/v1beta/models/` +
    `${config.banana2Model}:generateContent`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.banana2ApiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: sourceMimeType === "image/jpg" ? "image/jpeg" : sourceMimeType,
                data: imageBytes.toString("base64")
              }
            }
          ]
        }
      ],
      generationConfig: {
        responseModalities: ["IMAGE"],
        imageConfig: {
          aspectRatio: aspectRatio || config.banana2AspectRatio,
          imageSize: imageSize || config.banana2ImageSize
        }
      }
    }),
    signal: AbortSignal.timeout(config.banana2TimeoutMs)
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(
      `Banana2 request failed with status ${response.status}. Body: ${errorText.slice(0, 500)}`
    );
  }

  const responseJson = await response.json();

  const inlineData = extractInlineImage(responseJson);
  return writeInlineImage(destinationPath, inlineData);
}

async function banana2RemoveBackground({
  config,
  sourcePath,
  sourceMimeType,
  destinationPath,
  prompt
}) {
  return callBanana2Edit({
    config,
    sourcePath,
    sourceMimeType,
    destinationPath,
    prompt,
    imageSize: "1K",
    aspectRatio: config.banana2AspectRatio
  });
}

async function banana2GenerateExpression({
  config,
  sourcePath,
  sourceMimeType,
  destinationPath,
  prompt
}) {
  return callBanana2Edit({
    config,
    sourcePath,
    sourceMimeType,
    destinationPath,
    prompt
  });
}

async function banana2GenerateCg({
  config,
  sourcePath,
  sourceMimeType,
  destinationPath,
  prompt
}) {
  return callBanana2Edit({
    config,
    sourcePath,
    sourceMimeType,
    destinationPath,
    prompt,
    imageSize: config.banana2ImageSize,
    aspectRatio: config.banana2AspectRatio
  });
}

module.exports = {
  banana2GenerateCg,
  banana2GenerateExpression,
  banana2RemoveBackground,
  isBanana2Configured
};
