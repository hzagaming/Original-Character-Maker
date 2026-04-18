const path = require("path");
const { execFile } = require("child_process");
const { AppError } = require("../utils/errors");

function execFileAsync(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    execFile(command, args, options, (error, stdout, stderr) => {
      if (error) {
        error.stdout = stdout;
        error.stderr = stderr;
        reject(error);
        return;
      }

      resolve({ stdout, stderr });
    });
  });
}

function isRembgConfigured(config) {
  return Boolean(config.rembgPythonPath && config.rembgScriptPath);
}

async function rembgRemoveBackground({ config, sourcePath, destinationPath }) {
  if (!isRembgConfigured(config)) {
    throw new Error("rembg is not configured.");
  }

  let stdout = "";
  try {
    const result = await execFileAsync(
      config.rembgPythonPath,
      [config.rembgScriptPath, sourcePath, destinationPath, config.rembgModel],
      {
        cwd: path.resolve(config.projectRoot),
        timeout: config.rembgTimeoutMs,
        maxBuffer: 10 * 1024 * 1024
      }
    );
    stdout = (result.stdout || "").trim();
  } catch (error) {
    const stderr = (error.stderr || "").trim();
    throw new AppError(stderr || error.message || "rembg background removal failed.", 500, {
      provider: "rembg",
      command: config.rembgPythonPath,
      script_path: config.rembgScriptPath,
      model: config.rembgModel,
      source_path: sourcePath,
      destination_path: destinationPath,
      timeout_ms: config.rembgTimeoutMs,
      stderr,
      stdout: (error.stdout || "").trim()
    }, "REMBG_EXECUTION_FAILED");
  }

  let metadata = {};
  if (stdout) {
    try {
      metadata = JSON.parse(stdout);
    } catch (_error) {
      metadata = {
        output_path: destinationPath,
        model: config.rembgModel,
        raw_stdout: stdout
      };
    }
  }

  return {
    provider: "rembg",
    mime_type: "image/png",
    output_path: metadata.output_path || destinationPath,
    debug: {
      model: metadata.model || config.rembgModel,
      quality: metadata.quality || null
    }
  };
}

module.exports = {
  isRembgConfigured,
  rembgRemoveBackground
};
