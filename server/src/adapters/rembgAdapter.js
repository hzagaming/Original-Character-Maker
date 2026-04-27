const { spawn } = require("child_process");
const fs = require("fs/promises");
const path = require("path");
const { AppError } = require("../utils/errors");

function isRembgConfigured(config) {
  // rembg does not require any API keys; it just needs Python + rembg installed.
  return config.bgRemovalProvider === "rembg";
}

function runRembgCommand(sourcePath, destinationPath) {
  return new Promise((resolve, reject) => {
    const proc = spawn("rembg", ["i", sourcePath, destinationPath], {
      stdio: ["ignore", "pipe", "pipe"]
    });

    let stdout = "";
    let stderr = "";

    proc.stdout.on("data", (data) => {
      stdout += String(data);
    });

    proc.stderr.on("data", (data) => {
      stderr += String(data);
    });

    proc.on("close", (code) => {
      if (code === 0) {
        resolve({ stdout, stderr });
      } else {
        reject(
          new AppError(
            `rembg exited with code ${code}. ${stderr || stdout}`,
            502,
            { provider: "rembg", source_path: sourcePath, exit_code: code },
            "REMBG_EXECUTION_FAILED"
          )
        );
      }
    });

    proc.on("error", (error) => {
      reject(
        new AppError(
          `Failed to spawn rembg: ${error.message}. Is Python and rembg installed?`,
          500,
          { provider: "rembg", source_path: sourcePath },
          "REMBG_SPAWN_FAILED"
        )
      );
    });
  });
}

async function rembgRemoveBackground({ sourcePath, destinationPath }) {
  await fs.mkdir(path.dirname(destinationPath), { recursive: true });

  try {
    await runRembgCommand(sourcePath, destinationPath);
  } catch (error) {
    // If the output file was partially created, remove it.
    await fs.unlink(destinationPath).catch(() => null);
    throw error;
  }

  // Ensure the file exists after rembg finishes
  try {
    await fs.access(destinationPath);
  } catch {
    throw new AppError(
      "rembg completed but output file was not created.",
      502,
      { provider: "rembg", destination_path: destinationPath },
      "REMBG_OUTPUT_MISSING"
    );
  }

  return {
    provider: "rembg",
    mime_type: "image/png",
    output_path: destinationPath,
    debug: {
      source_path: sourcePath,
      destination_path: destinationPath
    }
  };
}

module.exports = {
  rembgRemoveBackground,
  isRembgConfigured
};
