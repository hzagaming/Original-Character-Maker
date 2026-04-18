const path = require("path");
const fs = require("fs");
const cors = require("cors");
const express = require("express");
const multer = require("multer");
const config = require("./config");
const workflowsRouter = require("./routes/workflows");
const { formatErrorDetails } = require("./utils/errors");

const app = express();
const staticWebIndexPath = path.join(config.webDir, "index.html");
const staticAppPath = path.join(config.webDir, "app.js");
const staticStylesPath = path.join(config.webDir, "styles.css");

app.use(
  cors({
    origin: config.corsOrigin === "*" ? true : config.corsOrigin
  })
);
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/uploads", express.static(config.uploadDir));
app.use("/outputs", express.static(config.outputDir));
app.use("/api/workflows", workflowsRouter);
app.use("/api/*", (_req, res) => {
  res.status(404).json({ error: "API route not found" });
});

if (fs.existsSync(staticWebIndexPath)) {
  app.get("/app.js", (_req, res) => {
    res.sendFile(staticAppPath);
  });

  app.get("/styles.css", (_req, res) => {
    res.sendFile(staticStylesPath);
  });
}

app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api/")) {
    return next();
  }

  if (!fs.existsSync(staticWebIndexPath)) {
    return res.status(503).json({
      error: "Static web entry not found. Expected /index.html in the project root for the GitHub Pages friendly frontend."
    });
  }

  return res.sendFile(staticWebIndexPath);
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

  if (statusCode >= 500) {
    console.error(error);
  }

  return res.status(statusCode).json({
    error: detailed.message,
    details: detailed.debug
  });
});

module.exports = app;
