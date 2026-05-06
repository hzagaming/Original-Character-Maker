const path = require("path");
const fs = require("fs");
const cors = require("cors");
const express = require("express");
const multer = require("multer");
const config = require("./config");
const workflowsRouter = require("./routes/workflows");
const styleTransferRouter = require("./routes/styleTransfer");
const chatRouter = require("./routes/chat");
const { formatErrorDetails } = require("./utils/errors");

const app = express();
const distIndexPath = path.join(config.webDir, "index.html");
const rootIndexPath = path.join(config.webDir, "index.html");

function isAllowedCutoutAssetPath(assetPath) {
  return /^[a-zA-Z0-9/_\-.]+$/.test(assetPath) && !assetPath.includes("..");
}

function shouldServeSpaShell(req) {
  if (req.path.startsWith("/api/")) {
    return false;
  }
  if (path.extname(req.path)) {
    return false;
  }

  const accept = String(req.headers.accept || "");
  return accept.includes("text/html") || accept.includes("*/*");
}

app.use(
  cors({
    origin: (() => {
      if (config.corsOrigin === "*") return true;
      const origins = String(config.corsOrigin)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      if (origins.length === 0) return true;
      if (origins.length === 1) return origins[0];
      return origins;
    })()
  })
);
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Zeabur default health check path
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/cutout-assets/*", async (req, res, next) => {
  try {
    const assetPath = String(req.params[0] || "")
      .trim()
      .replace(/^\/+/, "")
      .replace(/^v\d+\//, "");
    if (!assetPath || !isAllowedCutoutAssetPath(assetPath)) {
      return res.status(400).json({ error: "Invalid cutout asset path." });
    }

    const upstreamUrl = `${config.cutoutAssetBaseUrl}/${assetPath}`;
    const upstreamController = new AbortController();
    const upstreamTimeout = setTimeout(() => upstreamController.abort(), 15000);
    let upstreamResponse;
    try {
      upstreamResponse = await fetch(upstreamUrl, { signal: upstreamController.signal });
    } finally {
      clearTimeout(upstreamTimeout);
    }
    if (!upstreamResponse.ok) {
      return res.status(upstreamResponse.status).json({
        error: "Failed to fetch cutout runtime asset.",
        details: {
          upstream_url: upstreamUrl,
          status: upstreamResponse.status
        }
      });
    }

    const contentType = upstreamResponse.headers.get("content-type");
    const cacheControl = upstreamResponse.headers.get("cache-control");
    const etag = upstreamResponse.headers.get("etag");

    if (contentType) {
      res.setHeader("Content-Type", contentType);
    }
    if (cacheControl) {
      res.setHeader("Cache-Control", cacheControl);
    }
    if (etag) {
      res.setHeader("ETag", etag);
    }

    const arrayBuffer = await upstreamResponse.arrayBuffer();
    return res.send(Buffer.from(arrayBuffer));
  } catch (error) {
    if (error.name === "AbortError") {
      return res.status(504).json({ error: "Upstream cutout asset request timed out." });
    }
    return next(error);
  }
});

app.use("/uploads", express.static(config.uploadDir));
app.use("/outputs", express.static(config.outputDir));
app.use("/api/workflows", workflowsRouter);
app.use("/api/style-transfer", styleTransferRouter);
app.use("/api/chat", chatRouter);
app.use("/api/*", (_req, res) => {
  res.status(404).json({ error: "API route not found" });
});

if (fs.existsSync(config.webDir)) {
  app.use(express.static(config.webDir));
}

// SPA fallback: serve index.html for all non-API routes
app.get("*", (req, res, next) => {
  if (!shouldServeSpaShell(req)) {
    return res.status(404).json({
      error: "Static asset not found",
      details: {
        path: req.path
      }
    });
  }

  if (req.path.startsWith("/api/")) {
    return next();
  }

  if (fs.existsSync(distIndexPath)) {
    return res.sendFile(distIndexPath);
  }

  if (fs.existsSync(rootIndexPath)) {
    return res.sendFile(rootIndexPath);
  }

  return res.status(503).json({
    error:
      "Static web entry not found. Run `npm run build` in the project root to generate /dist, or start the Vite dev server with `npm run dev`."
  });
});

app.use((error, _req, res, _next) => {
  if (error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      error: `File is too large. Maximum allowed is ${Math.floor(config.maxUploadSizeBytes / (1024 * 1024))}MB.`,
      details: {
        code: error.code,
        max_upload_size_bytes: config.maxUploadSizeBytes
      }
    });
  }

  const statusCode = error.statusCode || 500;
  const detailed = formatErrorDetails(error, {
    route: _req.originalUrl,
    method: _req.method
  });

  if (statusCode >= 500 && process.env.NODE_ENV === "development") {
    console.error(error);
  }

  return res.status(statusCode).json({
    error: detailed.message,
    details: detailed.debug
  });
});

module.exports = app;
