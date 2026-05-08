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
  console.log("[Backend] Background removal runtime: browser frontend (@imgly/background-removal)");
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
  const provider = String(config.bgRemovalProvider || "frontend").trim().toLowerCase();
  return provider || "frontend";
}

module.exports = {
  isZeaburEnvironment,
  printEnvDiagnostics,
  resolveEffectiveBgRemovalProvider
};
