const { spawnSync } = require("child_process");

let _rembgAvailable = null;
let _pythonAvailable = null;

function checkCommand(cmd, args = ["--version"]) {
  const result = spawnSync(cmd, args, { stdio: "pipe", timeout: 5000 });
  return result.status === 0;
}

/** Fast check: use Python's shutil.which to see if rembg binary is in PATH.
 *  This avoids loading heavy dependencies (onnxruntime) just to check existence.
 */
function checkRembgInPath() {
  for (const py of ["python3", "python"]) {
    try {
      const result = spawnSync(
        py,
        ["-c", "import shutil,sys; sys.exit(0 if shutil.which('rembg') else 1)"],
        { stdio: "pipe", timeout: 5000 }
      );
      if (result.status === 0) {
        return true;
      }
    } catch (e) {
      // Ignore spawn errors (e.g. python not found)
    }
  }
  return false;
}

function checkPythonModule(pythonCmd) {
  try {
    // Give rembg import enough time on CPU-constrained containers (e.g. Zeabur)
    const result = spawnSync(pythonCmd, ["-c", "import rembg.cli; print('rembg-ok')"], { stdio: "pipe", timeout: 120000 });
    if (result.status === 0) {
      return true;
    }
    const stdout = result.stdout ? result.stdout.toString().trim() : "";
    const stderr = result.stderr ? result.stderr.toString().trim() : "";
    console.log(`[Backend] ${pythonCmd} rembg check failed (exit=${result.status || result.signal}):`);
    console.log(`  stdout: ${stdout || '(empty)'}`);
    console.log(`  stderr: ${stderr || '(empty)'}`);
  } catch (e) {
    console.log(`[Backend] ${pythonCmd} rembg check failed (exception=${e.message})`);
  }
  return false;
}

function isPythonAvailable() {
  // Do not block startup with sync checks; trust Dockerfile installs Python.
  if (_pythonAvailable === null) {
    _pythonAvailable = true;
  }
  return _pythonAvailable;
}

function isRembgAvailable() {
  // Do not block startup with sync checks; trust Dockerfile installs rembg.
  // Actual availability is verified lazily at runtime by rembgAdapter.
  if (_rembgAvailable === null) {
    _rembgAvailable = true;
  }
  return _rembgAvailable;
}

function isZeaburEnvironment() {
  return Boolean(
    process.env.ZEABUR_ENVIRONMENT ||
    process.env.ZEABUR_SERVICE_ID ||
    process.env.ZEABUR_PROJECT_ID
  );
}

function printEnvDiagnostics(config) {
  const isZeabur = isZeaburEnvironment();
  const hasPlatoKey = Boolean(config.platoApiKey);

  console.log("\n[Backend] ===== Environment Diagnostics =====");
  if (isZeabur) {
    console.log("[Backend] Platform: Zeabur (detected)");
  }
  console.log(`[Backend] Python: assumed available (Dockerfile)`);
  console.log(`[Backend] rembg CLI: assumed available (Dockerfile)`);
  console.log(`[Backend] PLATO_API_KEY: ${hasPlatoKey ? "set" : "NOT SET"}`);
  console.log(`[Backend] EXPRESSION_PROVIDER: ${config.expressionProvider}`);
  console.log(`[Backend] CG_PROVIDER: ${config.cgProvider}`);
  console.log(`[Backend] BG_REMOVAL_PROVIDER: ${config.bgRemovalProvider}`);

  if (!hasPlatoKey && config.expressionProvider === "plato") {
    console.warn("[Backend] WARNING: expressionProvider=plato but PLATO_API_KEY is missing.");
    console.warn("[Backend]   → Set PLATO_API_KEY in Zeabur Environment Variables.");
    console.warn("[Backend]   → Or set EXPRESSION_PROVIDER=mock for testing.");
  }
  if (!hasPlatoKey && config.cgProvider === "plato") {
    console.warn("[Backend] WARNING: cgProvider=plato but PLATO_API_KEY is missing.");
    console.warn("[Backend]   → Set PLATO_API_KEY in Zeabur Environment Variables.");
    console.warn("[Backend]   → Or set CG_PROVIDER=mock for testing.");
  }
  console.log("[Backend] ===================================\n");
}

function resolveEffectiveBgRemovalProvider(config) {
  // Do not perform sync spawn checks at startup; trust Dockerfile.
  // rembgAdapter handles runtime failures gracefully.
  return config.bgRemovalProvider;
}

module.exports = {
  isPythonAvailable,
  isRembgAvailable,
  isZeaburEnvironment,
  printEnvDiagnostics,
  resolveEffectiveBgRemovalProvider
};
