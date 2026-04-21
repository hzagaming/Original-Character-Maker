const app = require("./app");
const config = require("./config");
const { ensureDirectories } = require("./utils/fs");

const isDev = process.env.NODE_ENV === "development";

async function bootstrap() {
  await ensureDirectories([config.uploadDir, config.outputDir, config.workflowStateDir]);

  app.listen(config.port, () => {
    if (isDev) {
      console.log(`Server running at http://localhost:${config.port}`);
    }
  });
}

bootstrap().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
