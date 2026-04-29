const config = require("../config");

const CG_SCENE_POOL = [
  "雨后安静街角的小店门口",
  "黄昏天台边缘",
  "午后图书馆窗边",
  "傍晚海边栈道",
  "清晨轻轨车厢",
  "夜晚便利店外的路灯下",
  "午后咖啡馆角落",
  "傍晚校园长廊",
  "夜间城市高层露台",
  "午后温室花房里",
  "黄昏老街巷口",
  "雨后的公交站旁"
];

let _expressionPrompts = null;
let _cgPromptTemplate = null;
let _cgScenePool = null;

function setExpressionPrompts(prompts) {
  _expressionPrompts = prompts;
}

function setCgPromptTemplate(template, scenePool) {
  _cgPromptTemplate = template;
  if (scenePool && scenePool.length > 0) {
    _cgScenePool = scenePool;
  }
}

function normalizeOverrideText(value) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

const WHITE_BG_SUFFIX = "图片背景纯白，同时画面中不要有任何除人物外的东西，";

function createDefaultExpressionPrompts() {
  const base = _expressionPrompts || {
    thinking:
      "严格保持参考图里角色的特征，同时角色的姿势不变，只把表情调整成思考状态。比例严格限制为2000x2000像素。",
    surprise:
      "严格保持参考图里角色的特征，同时角色的姿势不变，只把表情调整成惊讶状态。比例严格限制为2000x2000像素。",
    angry:
      "严格保持参考图里角色的特征，同时角色的姿势不变，只把表情调整成微微生气的状态。比例严格限制为2000x2000像素。"
  };
  if (!config.expressionWhiteBackground) return base;
  function injectWhiteBgSuffix(prompt) {
    // 兼容 markdown 文件中有无句号的两种写法
    if (prompt.includes("比例严格限制为2000x2000像素。")) {
      return prompt.replace("比例严格限制为2000x2000像素。", WHITE_BG_SUFFIX + "比例严格限制为2000x2000像素。");
    }
    return prompt.replace("比例严格限制为2000x2000像素", WHITE_BG_SUFFIX + "比例严格限制为2000x2000像素");
  }
  return {
    thinking: injectWhiteBgSuffix(base.thinking),
    surprise: injectWhiteBgSuffix(base.surprise),
    angry: injectWhiteBgSuffix(base.angry)
  };
}

function buildCgPrompt(_slotIndex, scene) {
  const template = _cgPromptTemplate || "基于参考图中的同一角色生成单人 CG 场景。角色整体画风必须完全一致，只允许变化场景、镜头、姿势和表情，场景为{scene}，尽量柔和，禁止新增其他人物。图片横屏的比例";
  const result = template.replace(/\{scene\}/g, scene);
  // 防御：如果模板中没有 {scene} 占位符，直接在末尾追加场景描述
  if (!result.includes(scene)) {
    return result + "。场景：" + scene;
  }
  return result;
}

function pickRandomScenes(count) {
  const pool = [...(_cgScenePool || CG_SCENE_POOL)];
  const selected = [];

  while (pool.length > 0 && selected.length < count) {
    const index = Math.floor(Math.random() * pool.length);
    selected.push(pool.splice(index, 1)[0]);
  }

  return selected;
}

function compileExpressionPrompt(_profile, expressionName) {
  const defaults = createDefaultExpressionPrompts();
  const prompt = defaults[expressionName];

  if (!prompt) {
    throw new Error(`Unsupported expression prompt: ${expressionName}`);
  }

  return prompt;
}

function compileCgPrompt(_profile, slotIndex, scene) {
  return buildCgPrompt(slotIndex, scene);
}

function compilePromptPack(profile, cgCount = 2) {
  const cgScenes = pickRandomScenes(cgCount);
  const expressions = createDefaultExpressionPrompts();

  return {
    compiler_version: "1.2.0",
    generated_at: new Date().toISOString(),
    profile_ref: profile?.character_id || null,
    expressions,
    cg: cgScenes.map((scene, index) => ({
      scene,
      prompt: buildCgPrompt(index, scene)
    })),
    background_removal: {
      provider_goal: "transparent cutout"
    }
  };
}

function applyPromptOverrides(promptPack, overrides) {
  if (!promptPack || !overrides || typeof overrides !== "object") {
    return promptPack;
  }

  const nextPromptPack = JSON.parse(JSON.stringify(promptPack));
  const thinking = normalizeOverrideText(overrides.thinking);
  const surprise = normalizeOverrideText(overrides.surprise);
  const angry = normalizeOverrideText(overrides.angry);
  const cg01 = normalizeOverrideText(overrides.cg01);
  const cg02 = normalizeOverrideText(overrides.cg02);

  if (thinking) {
    nextPromptPack.expressions.thinking = thinking;
  }
  if (surprise) {
    nextPromptPack.expressions.surprise = surprise;
  }
  if (angry) {
    nextPromptPack.expressions.angry = angry;
  }
  if (cg01 && nextPromptPack.cg?.[0]) {
    nextPromptPack.cg[0].prompt = cg01;
  }
  if (cg02 && nextPromptPack.cg?.[1]) {
    nextPromptPack.cg[1].prompt = cg02;
  }

  return nextPromptPack;
}

module.exports = {
  CG_SCENE_POOL,
  applyPromptOverrides,
  compileExpressionPrompt,
  compileCgPrompt,
  compilePromptPack,
  createDefaultExpressionPrompts,
  pickRandomScenes,
  setExpressionPrompts,
  setCgPromptTemplate
};
