const fs = require("fs");
const fsp = require("fs/promises");
const path = require("path");
const Imageseg = require("@alicloud/imageseg20191230");
const OpenApiClient = require("@alicloud/openapi-client");
const TeaUtil = require("@alicloud/tea-util");
const { AppError } = require("../utils/errors");

function isAliyunImageSegConfigured(config) {
  return Boolean(config.aliyunAccessKeyId && config.aliyunAccessKeySecret);
}

function createAliyunImageSegClient(config) {
  const clientConfig = new OpenApiClient.Config({
    accessKeyId: config.aliyunAccessKeyId,
    accessKeySecret: config.aliyunAccessKeySecret
  });
  clientConfig.endpoint = config.aliyunImageSegEndpoint;
  clientConfig.regionId = config.aliyunImageSegRegionId;
  return new Imageseg.default(clientConfig);
}

function createRuntimeOptions(config) {
  return new TeaUtil.RuntimeOptions({
    connectTimeout: config.aliyunImageSegTimeoutMs,
    readTimeout: config.aliyunImageSegTimeoutMs,
    autoretry: false,
    maxAttempts: 1
  });
}

function resolveActionConfig(action) {
  switch (action) {
    case "SegmentBody":
      return {
        requestMethodName: "segmentBody",
        methodName: "segmentBodyAdvance",
        RequestUrlClass: Imageseg.SegmentBodyRequest,
        RequestClass: Imageseg.SegmentBodyAdvanceRequest
      };
    case "SegmentHDBody":
      return {
        requestMethodName: "segmentHDBody",
        methodName: "segmentHDBodyAdvance",
        RequestUrlClass: Imageseg.SegmentHDBodyRequest,
        RequestClass: Imageseg.SegmentHDBodyAdvanceRequest
      };
    case "SegmentCommonImage":
    default:
      return {
        requestMethodName: "segmentCommonImage",
        methodName: "segmentCommonImageAdvance",
        RequestUrlClass: Imageseg.SegmentCommonImageRequest,
        RequestClass: Imageseg.SegmentCommonImageAdvanceRequest
      };
  }
}

function shouldFallbackToUpload(error) {
  const message = String(error?.message || "");
  return (
    message.includes("InvalidImage.URL") ||
    message.includes("InvalidImage.Region") ||
    message.includes("InvalidImage.REGION") ||
    message.includes("InvalidImage.Download") ||
    message.includes("InvalidImage.Timeout") ||
    message.includes("Invalid according to Policy")
  );
}

async function downloadResultImage(imageUrl, destinationPath) {
  const response = await fetch(imageUrl);
  if (!response.ok) {
    throw new AppError(
      `Aliyun imageseg result download failed with status ${response.status}.`,
      502,
      {
        provider: "aliyun",
        image_url: imageUrl,
        http_status: response.status
      },
      "ALIYUN_IMAGESEG_DOWNLOAD_FAILED"
    );
  }

  const imageBuffer = Buffer.from(await response.arrayBuffer());
  await fsp.mkdir(path.dirname(destinationPath), { recursive: true });
  await fsp.writeFile(destinationPath, imageBuffer);

  return destinationPath;
}

async function callAliyunImageSegByUrl(client, runtime, config, sourceUrl) {
  const { requestMethodName, RequestUrlClass } = resolveActionConfig(config.aliyunImageSegAction);
  const request = new RequestUrlClass({
    imageURL: sourceUrl
  });

  if (config.aliyunImageSegReturnForm) {
    request.returnForm = config.aliyunImageSegReturnForm;
  }

  return client[requestMethodName](request, runtime);
}

async function callAliyunImageSegByUpload(client, runtime, config, sourcePath) {
  const { methodName, RequestClass } = resolveActionConfig(config.aliyunImageSegAction);
  const request = new RequestClass({
    imageURLObject: fs.createReadStream(sourcePath)
  });

  if (config.aliyunImageSegReturnForm) {
    request.returnForm = config.aliyunImageSegReturnForm;
  }

  return client[methodName](request, runtime);
}

async function aliyunRemoveBackground({ config, sourcePath, sourceUrl, destinationPath }) {
  if (!isAliyunImageSegConfigured(config)) {
    throw new AppError(
      "Alibaba Cloud imageseg credentials are missing.",
      500,
      {
        provider: "aliyun",
        env_keys: "ALIBABA_CLOUD_ACCESS_KEY_ID, ALIBABA_CLOUD_ACCESS_KEY_SECRET"
      },
      "ALIYUN_IMAGESEG_CREDENTIALS_MISSING"
    );
  }

  const client = createAliyunImageSegClient(config);
  const runtime = createRuntimeOptions(config);

  let response;
  let requestMode = "upload";
  try {
    if (typeof sourceUrl === "string" && /^https?:\/\//i.test(sourceUrl)) {
      requestMode = "url";
      try {
        response = await callAliyunImageSegByUrl(client, runtime, config, sourceUrl);
      } catch (error) {
        if (!shouldFallbackToUpload(error)) {
          throw error;
        }

        requestMode = "upload_fallback";
        response = await callAliyunImageSegByUpload(client, runtime, config, sourcePath);
      }
    } else {
      response = await callAliyunImageSegByUpload(client, runtime, config, sourcePath);
    }
  } catch (error) {
    throw new AppError(
      error?.message || "Aliyun imageseg request failed.",
      502,
      {
        provider: "aliyun",
        action: config.aliyunImageSegAction,
        endpoint: config.aliyunImageSegEndpoint,
        region_id: config.aliyunImageSegRegionId
      },
      "ALIYUN_IMAGESEG_REQUEST_FAILED"
    );
  }

  const imageUrl = response?.body?.data?.imageURL || null;
  if (!imageUrl) {
    throw new AppError(
      "Aliyun imageseg returned no result image URL.",
      502,
      {
        provider: "aliyun",
        action: config.aliyunImageSegAction,
        request_id: response?.body?.requestId || null
      },
      "ALIYUN_IMAGESEG_EMPTY_RESULT"
    );
  }

  const outputPath = await downloadResultImage(imageUrl, destinationPath);
  return {
    provider: "aliyun",
    mime_type: "image/png",
    output_path: outputPath,
    debug: {
      action: config.aliyunImageSegAction,
      endpoint: config.aliyunImageSegEndpoint,
      region_id: config.aliyunImageSegRegionId,
      request_mode: requestMode,
      source_url: sourceUrl || null,
      request_id: response?.body?.requestId || null,
      image_url: imageUrl
    }
  };
}

module.exports = {
  aliyunRemoveBackground,
  isAliyunImageSegConfigured
};
