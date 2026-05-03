const { spawn } = require("child_process");
const fs = require("fs/promises");
const path = require("path");
const { AppError } = require("../utils/errors");

function isRembgConfigured(config) {
  // rembg does not require any API keys; it just needs Python + rembg installed.
  return config.bgRemovalProvider === "rembg";
}

/**
 * Try multiple ways to invoke rembg:
 * 1. "rembg" CLI (if pip installed it into PATH)
 * 2. "python -m rembg.cli" (Windows / venv standard)
 * 3. "python3 -m rembg.cli" (Unix standard)
 *
 * Node.js spawn() does NOT synchronously throw ENOENT; it emits an "error" event.
 * Therefore we must listen for "error" and fall back to the next candidate.
 */
function runRembgCommand(sourcePath, destinationPath, timeoutMs = 120000) {
  const candidates = [
    { cmd: "rembg", args: ["i", sourcePath, destinationPath] },
    { cmd: "python", args: ["-m", "rembg.cli", "i", sourcePath, destinationPath] },
    { cmd: "python3", args: ["-m", "rembg.cli", "i", sourcePath, destinationPath] },
  ];

  return new Promise((resolve, reject) => {
    let candidateIndex = 0;
    const errors = [];
    let currentProc = null;
    let timer = null;
    let killed = false;

    function cleanup() {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
    }

    function tryNext() {
      if (candidateIndex >= candidates.length) {
        cleanup();
        reject(
          new AppError(
            `Failed to start rembg. Tried ${candidates.length} ways:\n` +
              errors.map((e, i) => `  ${i + 1}. ${e}`).join("\n") +
              `\nPlease ensure Python 3 and rembg are installed (pip install "rembg[cpu]").`,
            500,
            { provider: "rembg", source_path: sourcePath },
            "REMBG_SPAWN_FAILED"
          )
        );
        return;
      }

      const { cmd, args } = candidates[candidateIndex];
      candidateIndex++;

      try {
        currentProc = spawn(cmd, args, {
          stdio: ["ignore", "pipe", "pipe"],
        });
      } catch (syncErr) {
        // Extremely rare: spawn itself threw synchronously
        errors.push(`${cmd}: ${syncErr.message}`);
        tryNext();
        return;
      }

      let stdout = "";
      let stderr = "";

      timer = setTimeout(() => {
        killed = true;
        if (currentProc) {
          currentProc.kill("SIGTERM");
          setTimeout(() => {
            if (currentProc && !currentProc.killed) {
              currentProc.kill("SIGKILL");
            }
          }, 5000).unref();
        }
      }, timeoutMs);

      currentProc.stdout.on("data", (data) => {
        stdout += String(data);
      });

      currentProc.stderr.on("data", (data) => {
        stderr += String(data);
      });

      currentProc.on("close", (code, signal) => {
        cleanup();
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

      currentProc.on("error", (error) => {
        cleanup();
        errors.push(`${cmd}: ${error.message}`);
        // Try next candidate
        tryNext();
      });
    }

    tryNext();
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
