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
      "严格保持参考图中同一角色的身份、脸型、眉毛粗细、眼型、发型、服装、饰品、体型比例、配色和整体画风一致。保持角色在画面中的大小和构图稳定，不要扩图，不要延伸身体，不要新增肢体，不要改变服装，不要改变眉毛和发型。只允许为了表达情绪产生小幅上半身动作和手势。生成自然思考状态：可以轻托下巴、手指轻触脸颊、视线稍微侧移或微微低头，动作不要公式化，保持单人角色表情素材。竖屏构图，生成一张竖屏图片。",
    surprise:
      "严格保持参考图中同一角色的身份、脸型、眉毛粗细、眼型、发型、服装、饰品、体型比例、配色和整体画风一致。保持角色在画面中的大小和构图稳定，不要扩图，不要延伸身体，不要新增肢体，不要改变服装，不要改变眉毛和发型。只允许为了表达情绪产生小幅上半身动作和手势。生成惊讶状态：可以轻微睁大眼睛、肩膀轻抬、手部微微抬起或身体轻微后仰，动作自然克制，不要夸张变形。保持单人角色表情素材。竖屏构图，生成一张竖屏图片。",
    angry:
      "严格保持参考图中同一角色的身份、脸型、眉毛粗细、眼型、发型、服装、饰品、体型比例、配色和整体画风一致。保持角色在画面中的大小和构图稳定，不要扩图，不要延伸身体，不要新增肢体，不要改变服装，不要改变眉毛和发型。只允许为了表达情绪产生小幅上半身动作和手势。生成生气状态：眉眼和嘴型要明确表现不满，可以轻微前倾、抱臂或小幅握拳；愤怒程度按角色气质自然发挥，不要所有角色都只是轻微生气，也不要暴走夸张。保持单人角色表情素材。竖屏构图，生成一张竖屏图片。"
  };
  if (!config.expressionWhiteBackground) return base;
  function injectWhiteBgSuffix(prompt) {
    // 兼容 markdown 文件中有无句号的两种写法
    if (prompt.includes("生成一张竖屏图片。")) {
      return prompt.replace("生成一张竖屏图片。", WHITE_BG_SUFFIX + "生成一张竖屏图片。");
    }
    return prompt;
  }
  return {
    thinking: injectWhiteBgSuffix(base.thinking),
    surprise: injectWhiteBgSuffix(base.surprise),
    angry: injectWhiteBgSuffix(base.angry)
  };
}

function buildCgPrompt(_slotIndex, scene) {
  const template = _cgPromptTemplate || "基于参考图中的同一角色生成单人全年龄日常剧情 CG 场景。角色身份、脸型、眉毛粗细、眼型、发型、服装、饰品、体型比例、配色和整体画风必须完全一致，只允许变化场景、镜头、姿势和表情。场景为{scene}，氛围自然、有故事感，禁止新增其他人物。安全边界：禁止性感化，禁止暴露服装，禁止暧昧姿势，禁止床、浴室、擦边镜头，禁止成人暗示；镜头聚焦角色表情、动作和场景氛围。图片横屏16:9比例。";
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
