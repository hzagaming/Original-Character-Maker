const app = require("./app");
const config = require("./config");
const { ensureDirectories } = require("./utils/fs");
const { printEnvDiagnostics } = require("./utils/envCheck");

process.on("uncaughtException", (error) => {
  console.error("[Backend] FATAL uncaughtException", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  console.error("[Backend] FATAL unhandledRejection", reason);
  process.exit(1);
});

async function bootstrap() {
  console.log(`[Backend] Starting server on port ${config.port}...`);
  console.log(`[Backend] NODE_ENV=${process.env.NODE_ENV || "not-set"}`);
  await ensureDirectories([config.uploadDir, config.outputDir, config.workflowStateDir]);

  const server = app.listen(config.port, "0.0.0.0", () => {
    const addr = server.address();
    console.log(`[Backend] Server listening on ${addr.address}:${addr.port}`);
    console.log(`[Backend] CORS origin: ${config.corsOrigin}`);
    console.log(`[Backend] Upload dir: ${config.uploadDir}`);
    console.log(`[Backend] Output dir: ${config.outputDir}`);
    printEnvDiagnostics(config);
    if (!config.platoApiKey && (config.expressionProvider === "plato" || config.cgProvider === "plato")) {
      console.warn(`[Backend] WARNING: PLATO_API_KEY is not set. Workflow steps using plato provider will fail.`);
      console.warn(`[Backend] Set PLATO_API_KEY in environment variables, or switch to mock mode.`);
    }
  });
}

bootstrap().catch((error) => {
  console.error("[Backend] Failed to start server", error);
  process.exit(1);
});
