function buildAssetList(outputs) {
  return {
    expressions: [
      { id: "thinking", type: "expression", url: outputs?.expressions?.thinking || null },
      { id: "surprise", type: "expression", url: outputs?.expressions?.surprise || null },
      { id: "angry", type: "expression", url: outputs?.expressions?.angry || null }
    ],
    expression_cutouts: [
      { id: "thinking", type: "expression_cutout", url: outputs?.expression_cutouts?.thinking || null },
      { id: "surprise", type: "expression_cutout", url: outputs?.expression_cutouts?.surprise || null },
      { id: "angry", type: "expression_cutout", url: outputs?.expression_cutouts?.angry || null }
    ],
    cg: [
      { id: "cg_01", type: "cg", url: outputs?.cg_outputs?.[0] || null },
      { id: "cg_02", type: "cg", url: outputs?.cg_outputs?.[1] || null }
    ]
  };
}

function buildCharacterPackSnapshot({ workflow, characterProfile, promptPack }) {
  const outputs = workflow?.outputs || {};

  return {
    schema_version: "1.0.0",
    generated_at: new Date().toISOString(),
    workflow_id: workflow?.id || null,
    status: workflow?.status || null,
    current_step: workflow?.current_step || null,
    character_profile: characterProfile,
    prompt_bundle: promptPack,
    assets: buildAssetList(outputs),
    files: {
      manifest: outputs?.manifest || null,
      character_profile: outputs?.meta_files?.character_profile || null,
      prompts: outputs?.meta_files?.prompts || null,
      character_pack: outputs?.meta_files?.character_pack || null,
      p2g_handoff: outputs?.meta_files?.p2g_handoff || null
    },
    providers: outputs?.providers || null,
    source_image: workflow?.source_image || null,
    error: workflow?.error || null,
    error_details: workflow?.error_details || null
  };
}

module.exports = {
  buildCharacterPackSnapshot
};
