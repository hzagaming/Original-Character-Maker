function inferFraming(width, height) {
  if (!width || !height) {
    return "unknown";
  }

  const ratio = width / height;
  if (ratio < 0.72) {
    return "full_or_half_body_portrait";
  }
  if (ratio <= 1.15) {
    return "half_body_or_bust";
  }
  return "wide_or_scene_heavy_reference";
}

function inferReferenceStrength(sourceImage) {
  if (!sourceImage?.width || !sourceImage?.height) {
    return "medium";
  }

  const pixels = sourceImage.width * sourceImage.height;
  if (pixels >= 1400 * 1400) {
    return "high";
  }
  if (pixels >= 900 * 900) {
    return "medium";
  }
  return "low";
}

function buildRecommendedSceneRules(sourceImage) {
  const framing = inferFraming(sourceImage?.width, sourceImage?.height);
  const rules = [
    "先保角色，再扩场景",
    "优先单人构图",
    "先保证角色识别度，再增加环境信息"
  ];

  if (framing === "full_or_half_body_portrait") {
    rules.push("输入更像立绘，CG 可优先使用全身或半身主体构图");
  } else if (framing === "half_body_or_bust") {
    rules.push("输入更像角色半身图，CG 建议避免过远镜头");
  } else if (framing === "wide_or_scene_heavy_reference") {
    rules.push("输入横向信息较多，生成时要额外约束角色身份和主体位置");
  }

  return rules;
}

function analyzeCharacterReference(workflow, baseProfile) {
  const sourceImage = workflow?.source_image || {};
  const framing = inferFraming(sourceImage.width, sourceImage.height);
  const referenceStrength = inferReferenceStrength(sourceImage);

  return {
    ...baseProfile,
    profile_stage: "heuristic-understanding",
    analysis: {
      method: "heuristic-bootstrap",
      generated_at: new Date().toISOString(),
      framing,
      reference_strength: referenceStrength,
      likely_subject_count: 1,
      scene_guidance: {
        primary_rule: "先保证角色身份稳定，再决定场景和镜头。",
        recommended_rules: buildRecommendedSceneRules(sourceImage),
        avoid_rules: [
          "不要先堆复杂背景再塞角色",
          "不要为了场景牺牲角色识别度",
          "不要用多人互动场景稀释角色主体"
        ]
      },
      production_notes: [
        "当前阶段仍然不是完整视觉理解，只是给后续 prompt compiler 提供稳定结构。",
        "后续可接入 StepFun 或其他长上下文模型，补全气质、题材、世界观和角色描述。"
      ]
    },
    scene_design: {
      ...baseProfile.scene_design,
      strategy: "先保证角色身份稳定，再根据角色理解结果扩展场景，不要反过来用场景定义角色。",
      starter_hints: buildRecommendedSceneRules(sourceImage)
    },
    runtime_extensions: {
      ...baseProfile.runtime_extensions,
      prompt_injection_ready: true,
      needs_review: referenceStrength !== "high"
    }
  };
}

module.exports = {
  analyzeCharacterReference
};
