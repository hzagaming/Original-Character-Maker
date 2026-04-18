const app = require("./app");
const config = require("./config");
const { ensureDirectories } = require("./utils/fs");

async function bootstrap() {
  await ensureDirectories([config.uploadDir, config.outputDir]);

  app.listen(config.port, () => {
    console.log(`Server running at http://localhost:${config.port}`);
  });
}

bootstrap().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
