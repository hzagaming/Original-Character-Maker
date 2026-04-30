const app = require("./app");
const config = require("./config");
const { ensureDirectories } = require("./utils/fs");

async function bootstrap() {
  await ensureDirectories([config.uploadDir, config.outputDir, config.workflowStateDir]);

  app.listen(config.port, "0.0.0.0", () => {
    console.log(`[Backend] Server running at http://127.0.0.1:${config.port}`);
    console.log(`[Backend] CORS origin: ${config.corsOrigin}`);
    console.log(`[Backend] Upload dir: ${config.uploadDir}`);
    console.log(`[Backend] Output dir: ${config.outputDir}`);
    if (!config.platoApiKey && (config.expressionProvider === "plato" || config.cgProvider === "plato")) {
      console.warn(`[Backend] WARNING: PLATO_API_KEY is not set. Workflow steps using plato provider will fail.`);
      console.warn(`[Backend] Copy .env.example to .env and fill in PLATO_API_KEY, or switch to mock mode.`);
    }
  });
}

bootstrap().catch((error) => {
  console.error("[Backend] Failed to start server", error);
  process.exit(1);
});
