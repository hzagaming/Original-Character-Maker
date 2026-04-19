const { CORE_IDENTITY_LOCKS, FORBIDDEN_DRIFT_RULES } = require("./characterProfile");

const EXPRESSION_DETAILS = {
  thinking: "不改人物的任何特征和动作，只修改人物的表情到思考表情，其他地方均不变",
  surprise: "不改人物的任何特征和动作，只修改人物的表情到惊讶表情，其他地方均不变",
  angry: "不改人物的任何特征和动作，只修改人物的表情到微微生气表情，其他地方均不变"
};

const CG_SCENE_POOL = [
  "清晨便利店门口",
  "清晨天台边缘",
  "清晨轻轨车厢",
  "清晨咖啡馆角落",
  "清晨展会后台",
  "清晨创作工作室",
  "清晨自习室窗边",
  "清晨美术教室",
  "清晨候车区座位旁",
  "清晨校园长廊",
  "清晨图书市集摊位前",
  "清晨树荫长椅上",
  "清晨海边栈道",
  "清晨商场中庭",
  "清晨地铁站台",
  "清晨老街路口",
  "清晨玻璃温室里",
  "清晨电影院外廊",
  "清晨游乐园步道",
  "清晨音乐排练室",
  "上午便利店门口",
  "上午天台边缘",
  "上午轻轨车厢",
  "上午咖啡馆角落",
  "上午展会后台",
  "上午创作工作室",
  "上午自习室窗边",
  "上午美术教室",
  "上午候车区座位旁",
  "上午校园长廊",
  "上午图书市集摊位前",
  "上午树荫长椅上",
  "上午海边栈道",
  "上午商场中庭",
  "上午地铁站台",
  "上午老街路口",
  "上午玻璃温室里",
  "上午电影院外廊",
  "上午游乐园步道",
  "上午音乐排练室",
  "正午便利店门口",
  "正午天台边缘",
  "正午轻轨车厢",
  "正午咖啡馆角落",
  "正午展会后台",
  "正午创作工作室",
  "正午自习室窗边",
  "正午美术教室",
  "正午候车区座位旁",
  "正午校园长廊",
  "正午图书市集摊位前",
  "正午树荫长椅上",
  "正午海边栈道",
  "正午商场中庭",
  "正午地铁站台",
  "正午老街路口",
  "正午玻璃温室里",
  "正午电影院外廊",
  "正午游乐园步道",
  "正午音乐排练室",
  "午后便利店门口",
  "午后天台边缘",
  "午后轻轨车厢",
  "午后咖啡馆角落",
  "午后展会后台",
  "午后创作工作室",
  "午后自习室窗边",
  "午后美术教室",
  "午后候车区座位旁",
  "午后校园长廊",
  "午后图书市集摊位前",
  "午后树荫长椅上",
  "午后海边栈道",
  "午后商场中庭",
  "午后地铁站台",
  "午后老街路口",
  "午后玻璃温室里",
  "午后电影院外廊",
  "午后游乐园步道",
  "午后音乐排练室",
  "黄昏便利店门口",
  "黄昏天台边缘",
  "黄昏轻轨车厢",
  "黄昏咖啡馆角落",
  "黄昏展会后台",
  "黄昏创作工作室",
  "黄昏自习室窗边",
  "黄昏美术教室",
  "黄昏候车区座位旁",
  "黄昏校园长廊",
  "黄昏图书市集摊位前",
  "黄昏树荫长椅上",
  "黄昏海边栈道",
  "黄昏商场中庭",
  "黄昏地铁站台",
  "黄昏老街路口",
  "黄昏玻璃温室里",
  "黄昏电影院外廊",
  "黄昏游乐园步道",
  "黄昏音乐排练室",
  "傍晚便利店门口",
  "傍晚天台边缘",
  "傍晚轻轨车厢",
  "傍晚咖啡馆角落",
  "傍晚展会后台",
  "傍晚创作工作室",
  "傍晚自习室窗边",
  "傍晚美术教室",
  "傍晚候车区座位旁",
  "傍晚校园长廊",
  "傍晚图书市集摊位前",
  "傍晚树荫长椅上",
  "傍晚海边栈道",
  "傍晚商场中庭",
  "傍晚地铁站台",
  "傍晚老街路口",
  "傍晚玻璃温室里",
  "傍晚电影院外廊",
  "傍晚游乐园步道",
  "傍晚音乐排练室",
  "夜间便利店门口",
  "夜间天台边缘",
  "夜间轻轨车厢",
  "夜间咖啡馆角落",
  "夜间展会后台",
  "夜间创作工作室",
  "夜间自习室窗边",
  "夜间美术教室",
  "夜间候车区座位旁",
  "夜间校园长廊",
  "夜间图书市集摊位前",
  "夜间树荫长椅上",
  "夜间海边栈道",
  "夜间商场中庭",
  "夜间地铁站台",
  "夜间老街路口",
  "夜间玻璃温室里",
  "夜间电影院外廊",
  "夜间游乐园步道",
  "夜间音乐排练室",
  "深夜便利店门口",
  "深夜天台边缘",
  "深夜轻轨车厢",
  "深夜咖啡馆角落",
  "深夜展会后台",
  "深夜创作工作室",
  "深夜自习室窗边",
  "深夜美术教室",
  "深夜候车区座位旁",
  "深夜校园长廊",
  "深夜图书市集摊位前",
  "深夜树荫长椅上",
  "深夜海边栈道",
  "深夜商场中庭",
  "深夜地铁站台",
  "深夜老街路口",
  "深夜玻璃温室里",
  "深夜电影院外廊",
  "深夜游乐园步道",
  "深夜音乐排练室",
  "雨后便利店门口",
  "雨后天台边缘",
  "雨后轻轨车厢",
  "雨后咖啡馆角落",
  "雨后展会后台",
  "雨后创作工作室",
  "雨后自习室窗边",
  "雨后美术教室",
  "雨后候车区座位旁",
  "雨后校园长廊",
  "雨后图书市集摊位前",
  "雨后树荫长椅上",
  "雨后海边栈道",
  "雨后商场中庭",
  "雨后地铁站台",
  "雨后老街路口",
  "雨后玻璃温室里",
  "雨后电影院外廊",
  "雨后游乐园步道",
  "雨后音乐排练室",
  "雪天便利店门口",
  "雪天天台边缘",
  "雪天轻轨车厢",
  "雪天咖啡馆角落",
  "雪天展会后台",
  "雪天创作工作室",
  "雪天自习室窗边",
  "雪天美术教室",
  "雪天候车区座位旁",
  "雪天校园长廊",
  "雪天图书市集摊位前",
  "雪天树荫长椅上",
  "雪天海边栈道",
  "雪天商场中庭",
  "雪天地铁站台",
  "雪天老街路口",
  "雪天玻璃温室里",
  "雪天电影院外廊",
  "雪天游乐园步道",
  "雪天音乐排练室"
];

function buildConsistencyRequirements(profile) {
  const traitSummary = profile?.identity?.locked_core_traits?.length
    ? profile.identity.locked_core_traits.join("、")
    : CORE_IDENTITY_LOCKS.join("、");

  return `必须始终是参考图中的同一个单人角色，锁定特征：${traitSummary}。严禁改变角色身份、年龄感、种族特征、体型比例、发型、发色、五官、耳朵、服装、配饰、手持物、线稿风格、上色方式与整体配色。`;
}

function buildNegativePrompt(profile) {
  const rules = profile?.forbidden_drift_rules?.length
    ? profile.forbidden_drift_rules
    : FORBIDDEN_DRIFT_RULES;

  return `禁止：${rules.join("、")}、多人同框、额外角色、换脸、换头、换装、换发型、换物种、体型漂移、构图错乱、肢体错位、额外手指、文字、水印、背景喧宾夺主。`;
}

function compileExpressionPrompt(profile, expressionName) {
  const detail = EXPRESSION_DETAILS[expressionName];
  if (!detail) {
    throw new Error(`Unsupported expression prompt: ${expressionName}`);
  }

  return detail;
}

function compileCgPrompt(profile, slotIndex) {
  return "自行构思一个柔和的结束cg场景，场景地点为随机，只允许修改人物的动作和表情，角色本身绝对不能变，不能新增其他人物";
}

function pickRandomScenes(count) {
  const pool = [...CG_SCENE_POOL];
  const selected = [];

  while (pool.length > 0 && selected.length < count) {
    const index = Math.floor(Math.random() * pool.length);
    selected.push(pool.splice(index, 1)[0]);
  }

  return selected;
}

function compilePromptPack(profile, cgCount = 2) {
  const cgScenes = Array.from({ length: cgCount }, (_, index) => `AI 自行构思随机场景 ${index + 1}`);

  return {
    compiler_version: "1.0.0",
    generated_at: new Date().toISOString(),
    profile_ref: profile?.character_id || null,
    requirements: buildConsistencyRequirements(profile),
    negative_prompt: buildNegativePrompt(profile),
    background_removal: {
      provider_goal: "transparent cutout"
    },
    expressions: {
      thinking: compileExpressionPrompt(profile, "thinking"),
      surprise: compileExpressionPrompt(profile, "surprise"),
      angry: compileExpressionPrompt(profile, "angry")
    },
    cg: cgScenes.map((scene, index) => ({
      scene,
      prompt: compileCgPrompt(profile, index)
    }))
  };
}

function applyPromptOverrides(promptPack, overrides) {
  if (!promptPack || !overrides || typeof overrides !== "object") {
    return promptPack;
  }

  const nextPromptPack = JSON.parse(JSON.stringify(promptPack));
  const normalize = (value) =>
    typeof value === "string" && value.trim() ? value.trim() : null;

  const thinking = normalize(overrides.thinking);
  const surprise = normalize(overrides.surprise);
  const angry = normalize(overrides.angry);
  const cg01 = normalize(overrides.cg01);
  const cg02 = normalize(overrides.cg02);

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
  pickRandomScenes
};
