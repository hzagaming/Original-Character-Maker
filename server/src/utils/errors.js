class AppError extends Error {
  constructor(message, statusCode = 400, details = null, code = "APP_ERROR") {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.details = details;
    this.code = code;
  }
}

function flattenDetails(details, prefix = "") {
  if (!details || typeof details !== "object") {
    return [];
  }

  return Object.entries(details).flatMap(([key, value]) => {
    const label = prefix ? `${prefix}.${key}` : key;

    if (value === undefined || value === null || value === "") {
      return [];
    }

    if (Array.isArray(value)) {
      return [[label, value.join(", ")]];
    }

    if (typeof value === "object") {
      return flattenDetails(value, label);
    }

    return [[label, String(value)]];
  });
}

function formatErrorDetails(error, context = {}) {
  const baseMessage = error?.message || "Unexpected server error.";
  const detailMap = {
    ...context,
    code: error?.code || error?.name || "UNKNOWN_ERROR"
  };

  if (error?.details && typeof error.details === "object") {
    Object.assign(detailMap, error.details);
  }

  if (typeof error?.statusCode === "number") {
    detailMap.status_code = error.statusCode;
  }

  if (typeof error?.stderr === "string" && error.stderr.trim()) {
    detailMap.stderr = error.stderr.trim();
  }

  if (typeof error?.stdout === "string" && error.stdout.trim()) {
    detailMap.stdout = error.stdout.trim();
  }

  const detailLines = flattenDetails(detailMap).map(([key, value]) => `${key}: ${value}`);
  const detailMessage = detailLines.length
    ? `${baseMessage}\n${detailLines.join("\n")}`
    : baseMessage;

  return {
    message: detailMessage,
    debug: detailMap
  };
}

module.exports = {
  AppError,
  formatErrorDetails
};
