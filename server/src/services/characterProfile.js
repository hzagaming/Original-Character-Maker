const path = require("path");

const CORE_IDENTITY_LOCKS = [
  "单人角色",
  "保留发型",
  "保留五官",
  "保留服装轮廓",
  "保留配饰",
  "保留配色与画风"
];

const FORBIDDEN_DRIFT_RULES = [
  "多人",
  "换装",
  "变发型",
  "变配饰",
  "角色漂移",
  "文字或水印"
];

function deriveOrientation(width, height) {
  if (width === height) {
    return "square";
  }

  return width > height ? "landscape" : "portrait";
}

function deriveAspectRatio(width, height) {
  if (!width || !height) {
    return null;
  }

  return `${width}:${height}`;
}

function normalizeNameCandidate(fileName) {
  const rawName = path.parse(fileName || "character").name;
  const cleaned = rawName
    .replace(/[_-]+/g, " ")
    .replace(/\bcopy\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();

  if (!cleaned || /^[a-f0-9]{12,}$/i.test(cleaned) || /^test\d*$/i.test(cleaned)) {
    return "Character";
  }

  return cleaned
    .split(" ")
    .map((token) => token.slice(0, 1).toUpperCase() + token.slice(1))
    .join(" ");
}

function buildSceneHints(orientation) {
  const hints = [
    "场景应贴合角色而不是套用通用模板",
    "主体始终保持为同一角色",
    "优先使用能强化角色气质的道具与光线"
  ];

  if (orientation === "portrait") {
    hints.push("竖构图输入更适合全身或半身角色 framing");
  }

  if (orientation === "landscape") {
    hints.push("横构图输入在扩展场景前需要更注意主体隔离");
  }

  return hints;
}

function createBootstrapCharacterProfile(workflow) {
  const sourceImage = workflow?.source_image || {};
  const width = sourceImage.width || null;
  const height = sourceImage.height || null;
  const orientation = deriveOrientation(width, height);
  const displayName = normalizeNameCandidate(sourceImage.original_name);

  return {
    schema_version: "1.0.0",
    profile_stage: "bootstrap",
    generated_at: new Date().toISOString(),
    workflow_id: workflow.id,
    character_id: `char_${workflow.id.replace(/^wf_/, "")}`,
    identity: {
      display_name: displayName,
      source_label: path.parse(sourceImage.original_name || "character").name,
      continuity_goal: "让同一角色在素材层和未来能力层都保持一致并可复用。",
      locked_core_traits: CORE_IDENTITY_LOCKS
    },
    source_image: {
      original_name: sourceImage.original_name || null,
      mime_type: sourceImage.mime_type || null,
      width,
      height,
      aspect_ratio: deriveAspectRatio(width, height),
      orientation,
      public_url: sourceImage.public_url || null
    },
    appearance: {
      observed: {
        hairstyle: null,
        facial_features: null,
        outfit: null,
        accessories: [],
        palette: []
      },
      notes: "当前是 bootstrap 角色卡，还没有进行视觉理解。后续角色理解步骤会补全这些字段。"
    },
    style: {
      current_style: "参考图原生画风",
      preferred_outputs: {
        expressions: "透明背景表情素材",
        cg: "16:9 横屏 CG 场景图"
      },
      transfer_targets: []
    },
    scene_design: {
      strategy: "先理解角色，再设计贴合角色的场景，不要强套通用模板。",
      starter_hints: buildSceneHints(orientation),
      forbidden_patterns: [
        "固定图书馆模板",
        "破坏角色身份的换装",
        "拥挤的多人构图"
      ]
    },
    runtime_extensions: {
      prompt_injection_ready: true,
      tts_ready: false,
      live2d_ready: false,
      needs_review: true
    },
    forbidden_drift_rules: FORBIDDEN_DRIFT_RULES
  };
}

module.exports = {
  createBootstrapCharacterProfile,
  CORE_IDENTITY_LOCKS,
  FORBIDDEN_DRIFT_RULES
};
