const { spawnSync } = require("child_process");

let _rembgAvailable = null;
let _pythonAvailable = null;

function checkCommand(cmd, args = ["--version"]) {
  const result = spawnSync(cmd, args, { stdio: "pipe", timeout: 5000 });
  return result.status === 0;
}

function checkPythonModule(pythonCmd) {
  const result = spawnSync(pythonCmd, ["-c", "import rembg.cli; print('rembg-ok')"], { stdio: "pipe", timeout: 30000 });
  if (result.status === 0) {
    return true;
  }
  const stdout = result.stdout ? result.stdout.toString().trim() : "";
  const stderr = result.stderr ? result.stderr.toString().trim() : "";
  console.log(`[Backend] ${pythonCmd} rembg check failed (exit=${result.status || result.signal}):`);
  console.log(`  stdout: ${stdout || '(empty)'}`);
  console.log(`  stderr: ${stderr || '(empty)'}`);
  return false;
}

function isPythonAvailable() {
  if (_pythonAvailable === null) {
    _pythonAvailable = checkCommand("python", ["--version"]) || checkCommand("python3", ["--version"]);
  }
  return _pythonAvailable;
}

function isRembgAvailable() {
  if (_rembgAvailable === null) {
    _rembgAvailable =
      checkCommand("rembg", ["--version"]) ||
      checkPythonModule("python3") ||
      checkPythonModule("python");
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
  const hasPython = isPythonAvailable();
  const hasRembg = isRembgAvailable();
  const hasPlatoKey = Boolean(config.platoApiKey);

  console.log("\n[Backend] ===== Environment Diagnostics =====");
  if (isZeabur) {
    console.log("[Backend] Platform: Zeabur (detected)");
  }
  console.log(`[Backend] Python: ${hasPython ? "available" : "NOT FOUND"}`);
  console.log(`[Backend] rembg CLI: ${hasRembg ? "available" : "NOT FOUND"}`);
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
  if (config.bgRemovalProvider === "rembg" && !hasRembg) {
    console.warn("[Backend] WARNING: bgRemovalProvider=rembg but rembg CLI is not available.");
    console.warn("[Backend]   → If using Dockerfile on Zeabur: rembg should be pre-installed.");
    console.warn("[Backend]   → If using Node.js template: switch to BG_REMOVAL_PROVIDER=frontend");
    console.warn("[Backend]   → Frontend cutout will be handled by browser Canvas.");
  }
  console.log("[Backend] ===================================\n");
}

function resolveEffectiveBgRemovalProvider(config) {
  if (config.bgRemovalProvider === "rembg" && !isRembgAvailable()) {
    return "frontend";
  }
  return config.bgRemovalProvider;
}

module.exports = {
  isPythonAvailable,
  isRembgAvailable,
  isZeaburEnvironment,
  printEnvDiagnostics,
  resolveEffectiveBgRemovalProvider
};
