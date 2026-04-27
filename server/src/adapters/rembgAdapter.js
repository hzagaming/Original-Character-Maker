const { spawn } = require("child_process");
const fs = require("fs/promises");
const path = require("path");
const { AppError } = require("../utils/errors");

function isRembgConfigured(config) {
  // rembg does not require any API keys; it just needs Python + rembg installed.
  return config.bgRemovalProvider === "rembg";
}

function runRembgCommand(sourcePath, destinationPath, timeoutMs = 120000) {
  return new Promise((resolve, reject) => {
    const proc = spawn("rembg", ["i", sourcePath, destinationPath], {
      stdio: ["ignore", "pipe", "pipe"]
    });

    let stdout = "";
    let stderr = "";
    let killed = false;

    const timer = setTimeout(() => {
      killed = true;
      proc.kill("SIGTERM");
      // Force kill after 5s if still running
      setTimeout(() => proc.kill("SIGKILL"), 5000).unref();
    }, timeoutMs);

    proc.stdout.on("data", (data) => {
      stdout += String(data);
    });

    proc.stderr.on("data", (data) => {
      stderr += String(data);
    });

    proc.on("close", (code, signal) => {
      clearTimeout(timer);
      if (killed) {
        reject(
          new AppError(
            `rembg timed out after ${timeoutMs}ms. The image may be too large or the server is under heavy load. Try again with a smaller image or check server CPU/RAM usage.`,
            504,
            { provider: "rembg", source_path: sourcePath, timeout_ms: timeoutMs },
            "REMBG_TIMEOUT"
          )
        );
        return;
      }
      if (code === 0) {
        resolve({ stdout, stderr });
      } else {
        reject(
          new AppError(
            `rembg failed (exit code ${code}). ${stderr || stdout || "No error output captured."}`,
            502,
            { provider: "rembg", source_path: sourcePath, exit_code: code },
            "REMBG_EXECUTION_FAILED"
          )
        );
      }
    });

    proc.on("error", (error) => {
      clearTimeout(timer);
      reject(
        new AppError(
          `Failed to start rembg: ${error.message}. Please ensure Python 3 and rembg are installed on the server (pip install rembg[cli]).`,
          500,
          { provider: "rembg", source_path: sourcePath },
          "REMBG_SPAWN_FAILED"
        )
      );
    });
  });
}

async function rembgRemoveBackground({ sourcePath, destinationPath }) {
  // Validate input file exists
  try {
    await fs.access(sourcePath);
  } catch {
    throw new AppError(
      `rembg cannot find source image: ${sourcePath}. The upstream step may have failed to generate the expression image.`,
      500,
      { provider: "rembg", source_path: sourcePath },
      "REMBG_SOURCE_MISSING"
    );
  }

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
      "rembg finished but no output file was produced. This may indicate an unsupported image format or a corrupted input file.",
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
