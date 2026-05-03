const { execSync } = require("child_process");

let _rembgAvailable = null;
let _pythonAvailable = null;

function checkCommand(cmd, args = ["--version"]) {
  try {
    execSync(`${cmd} ${args.join(" ")}`, { stdio: "pipe", timeout: 5000 });
    return true;
  } catch {
    return false;
  }
}

function isPythonAvailable() {
  if (_pythonAvailable === null) {
    _pythonAvailable = checkCommand("python", ["--version"]) || checkCommand("python3", ["--version"]);
  }
  return _pythonAvailable;
}

function isRembgAvailable() {
  if (_rembgAvailable === null) {
    // Use import checks instead of --version, because rembg CLI may not support --version
    // and because we only need to know whether the Python module is importable.
    _rembgAvailable =
      checkCommand("rembg", ["--version"]) ||
      checkCommand("python3", ["-c", "import rembg.cli; print('rembg-ok')"]) ||
      checkCommand("python", ["-c", "import rembg.cli; print('rembg-ok')"]);
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
