const fs = require("fs/promises");
const path = require("path");
const config = require("../config");
const {
  createBackgroundRemovalPrompt,
  compileExpressionPrompt,
  compilePromptPack
} = require("./promptCompiler");

const promptCache = new Map();

async function loadPromptFile(fileName) {
  if (promptCache.has(fileName)) {
    return promptCache.get(fileName);
  }

  const filePath = path.join(config.promptsDir, fileName);
  const content = await fs.readFile(filePath, "utf8");
  const normalized = content.trim();
  promptCache.set(fileName, normalized);
  return normalized;
}

async function ensurePromptDocsLoaded() {
  await Promise.all([
    loadPromptFile("expression-thinking.md"),
    loadPromptFile("expression-surprise.md"),
    loadPromptFile("expression-angry.md"),
    loadPromptFile("cg-generation.md")
  ]);
}

async function getExpressionPrompt(expressionName, characterProfile = null) {
  await ensurePromptDocsLoaded();
  return compileExpressionPrompt(characterProfile, expressionName);
}

async function getCgPrompts(characterProfile = null) {
  await ensurePromptDocsLoaded();
  return compilePromptPack(characterProfile).cg;
}

async function getPromptPack(characterProfile = null) {
  await ensurePromptDocsLoaded();
  return compilePromptPack(characterProfile);
}

module.exports = {
  createBackgroundRemovalPrompt,
  getCgPrompts,
  getExpressionPrompt,
  getPromptPack
};
