function buildP2gHandoff({ workflow, characterProfile, promptPack }) {
  const outputs = workflow?.outputs || {};

  return {
    schema_version: "1.0.0",
    generated_at: new Date().toISOString(),
    source_workflow_id: workflow?.id || null,
    handoff_target: "p2g-workflow",
    character: {
      character_id: characterProfile?.character_id || null,
      display_name: characterProfile?.identity?.display_name || null,
      continuity_goal: characterProfile?.identity?.continuity_goal || null,
      locked_core_traits: characterProfile?.identity?.locked_core_traits || [],
      forbidden_drift_rules: characterProfile?.forbidden_drift_rules || []
    },
    assets: {
      expressions: outputs?.expressions || {},
      expression_cutouts: outputs?.expression_cutouts || {},
      cg_outputs: outputs?.cg_outputs || []
    },
    prompt_injection: {
      system_identity: [
        `角色名：${characterProfile?.identity?.display_name || "Character"}`,
        `连续性目标：${characterProfile?.identity?.continuity_goal || "保持角色一致"}`,
        `锁定特征：${(characterProfile?.identity?.locked_core_traits || []).join("、")}`,
        `禁止漂移：${(characterProfile?.forbidden_drift_rules || []).join("、")}`
      ].join("\n"),
      runtime_prompt_bundle: promptPack || null
    },
    llm_runtime: {
      ready: true,
      persona_seed: {
        scene_strategy: characterProfile?.scene_design?.strategy || null,
        scene_hints: characterProfile?.scene_design?.starter_hints || [],
        analysis: characterProfile?.analysis || null
      },
      future_fields: {
        system_prompt: null,
        memory_profile: null,
        dialogue_style: null
      }
    },
    tts_runtime: {
      ready: false,
      future_fields: {
        voice_id: null,
        tone_profile: null,
        speech_style: null
      }
    },
    integration_notes: [
      "这个文件用于把当前仓库产出的角色素材和角色设定交给 p2g 或其他上层剧情工作流消费。",
      "当前阶段提供的是角色卡、素材索引、prompt 注入结构和 LLM/TTS 占位配置。",
      "后续可以继续补 system prompt、角色记忆、语音参数和剧情阶段专用字段。"
    ]
  };
}

module.exports = {
  buildP2gHandoff
};
