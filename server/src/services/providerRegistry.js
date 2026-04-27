const path = require("path");
const {
  mockGenerateCg,
  mockGenerateExpression,
  mockRemoveBackground
} = require("../adapters/mockImageAdapter");
const {
  banana2GenerateCg,
  banana2GenerateExpression,
  banana2RemoveBackground,
  isBanana2Configured
} = require("../adapters/banana2ImageAdapter");
const {
  isPlatoConfigured,
  platoGenerateCg,
  platoGenerateExpression,
  platoRemoveBackground
} = require("../adapters/platoImageAdapter");
const {
  aliyunRemoveBackground,
  isAliyunImageSegConfigured
} = require("../adapters/aliyunImageSegAdapter");
const {
  rembgRemoveBackground,
  isRembgConfigured
} = require("../adapters/rembgAdapter");

function getMimeTypeFromPath(filePath) {
  const ext = path.extname(filePath).toLowerCase();

  if (ext === ".jpg" || ext === ".jpeg") {
    return "image/jpeg";
  }

  if (ext === ".webp") {
    return "image/webp";
  }

  return "image/png";
}

function getProviderLabel(provider, config) {
  if (provider === "banana2" && !isBanana2Configured(config)) {
    return "mock";
  }

  return provider;
}

function shouldFallbackToMock(error, config) {
  if (!config.allowProviderMockFallback) {
    return false;
  }

  return [
    "PLATO_REQUEST_FAILED",
    "PLATO_NETWORK_ERROR",
    "PLATO_CONTENT_POLICY_BLOCKED",
    "PLATO_IMAGE_PAYLOAD_MISSING",
    "PLATO_IMAGE_PIPELINE_UNAVAILABLE",
  ].includes(error?.code || "");
}

function withMockFallback(primaryProvider, primaryRunner, mockRunner, config) {
  return async (args) => {
    try {
      return await primaryRunner(args);
    } catch (error) {
      if (!shouldFallbackToMock(error, config)) {
        throw error;
      }

      const mockResult = await mockRunner(args);
      return {
        ...mockResult,
        debug: {
          ...(mockResult.debug || {}),
          fallback_from: primaryProvider,
          fallback_code: error.code || error.name || "UNKNOWN_ERROR",
          fallback_message: error.message,
          fallback_details: error.details || null,
        },
      };
    }
  };
}

function getBackgroundRemovalRunner(config) {
  if (config.bgRemovalProvider === "frontend") {
    return {
      provider: "frontend",
      run: async () => {
        throw new Error("Frontend background removal is handled client-side.");
      }
    };
  }

  if (config.bgRemovalProvider === "rembg" && isRembgConfigured(config)) {
    return {
      provider: "rembg",
      run: rembgRemoveBackground
    };
  }

  if (config.bgRemovalProvider === "plato" && isPlatoConfigured(config)) {
    return {
      provider: "plato",
      run: platoRemoveBackground
    };
  }

  if (config.bgRemovalProvider === "aliyun" && isAliyunImageSegConfigured(config)) {
    return {
      provider: "aliyun",
      run: aliyunRemoveBackground
    };
  }

  if (config.bgRemovalProvider === "banana2" && isBanana2Configured(config)) {
    return {
      provider: "banana2",
      run: banana2RemoveBackground
    };
  }

  return {
    provider: "mock",
    run: mockRemoveBackground
  };
}

function getExpressionRunner(config) {
  if (config.expressionProvider === "plato" && isPlatoConfigured(config)) {
    return {
      provider: "plato",
      run: platoGenerateExpression
    };
  }

  if (config.expressionProvider === "banana2" && isBanana2Configured(config)) {
    return {
      provider: "banana2",
      run: banana2GenerateExpression
    };
  }

  return {
    provider: "mock",
    run: mockGenerateExpression
  };
}

function getCgRunner(config) {
  if (config.cgProvider === "plato" && isPlatoConfigured(config)) {
    return {
      provider: "plato",
      run: platoGenerateCg
    };
  }

  if (config.cgProvider === "banana2" && isBanana2Configured(config)) {
    return {
      provider: "banana2",
      run: banana2GenerateCg
    };
  }

  return {
    provider: "mock",
    run: mockGenerateCg
  };
}

module.exports = {
  getBackgroundRemovalRunner,
  getCgRunner,
  getExpressionRunner,
  getMimeTypeFromPath,
  getProviderLabel
};
