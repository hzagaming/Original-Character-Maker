const path = require("path");
const fs = require("fs/promises");
const { getWorkflow, mergeWorkflowOutputs } = require("./workflowStore");
const { buildCharacterPackSnapshot } = require("./characterPack");
const { buildP2gHandoff } = require("./p2gHandoff");

function toPublicOutputUrl(workflowId, fileName) {
  return `/outputs/${workflowId}/${fileName}`;
}

async function writeJsonArtifact(workflowId, outputDir, fileName, payload) {
  await fs.writeFile(path.join(outputDir, fileName), JSON.stringify(payload, null, 2), "utf8");
  return toPublicOutputUrl(workflowId, fileName);
}

async function writeWorkflowSnapshots(workflowId, outputDir, characterProfile = null, promptPack = null) {
  const workflow = getWorkflow(workflowId);
  if (!workflow) {
    return null;
  }

  if (characterProfile) {
    const characterProfileUrl = await writeJsonArtifact(
      workflowId,
      outputDir,
      "character-profile.json",
      characterProfile
    );
    mergeWorkflowOutputs(workflowId, {
      meta_files: {
        character_profile: characterProfileUrl
      }
    });
  }

  if (promptPack) {
    const promptsUrl = await writeJsonArtifact(workflowId, outputDir, "prompts.json", promptPack);
    mergeWorkflowOutputs(workflowId, {
      meta_files: {
        prompts: promptsUrl
      }
    });
  }

  const currentWorkflow = getWorkflow(workflowId);
  const manifest = {
    workflow_id: workflowId,
    status: currentWorkflow.status,
    current_step: currentWorkflow.current_step,
    generated_at: new Date().toISOString(),
    error: currentWorkflow.error,
    error_details: currentWorkflow.error_details,
    steps: currentWorkflow.steps,
    character_profile: characterProfile,
    prompts: promptPack,
    outputs: currentWorkflow.outputs
  };

  const manifestFileName = "manifest.json";
  const manifestUrl = await writeJsonArtifact(workflowId, outputDir, manifestFileName, manifest);
  mergeWorkflowOutputs(workflowId, {
    manifest: manifestUrl
  });

  const workflowAfterManifest = getWorkflow(workflowId);
  const predictedCharacterPackUrl = toPublicOutputUrl(workflowId, "character-pack.json");
  const predictedP2gHandoffUrl = toPublicOutputUrl(workflowId, "p2g-handoff.json");

  const characterPack = buildCharacterPackSnapshot({
    workflow: {
      ...workflowAfterManifest,
      outputs: {
        ...workflowAfterManifest.outputs,
        meta_files: {
          ...(workflowAfterManifest.outputs?.meta_files || {}),
          character_pack: predictedCharacterPackUrl,
          p2g_handoff: predictedP2gHandoffUrl
        }
      }
    },
    characterProfile,
    promptPack
  });

  const characterPackUrl = await writeJsonArtifact(
    workflowId,
    outputDir,
    "character-pack.json",
    characterPack
  );
  mergeWorkflowOutputs(workflowId, {
    meta_files: {
      character_pack: characterPackUrl
    }
  });

  const workflowAfterCharacterPack = getWorkflow(workflowId);
  const p2gHandoff = buildP2gHandoff({
    workflow: {
      ...workflowAfterCharacterPack,
      outputs: {
        ...workflowAfterCharacterPack.outputs,
        meta_files: {
          ...(workflowAfterCharacterPack.outputs?.meta_files || {}),
          p2g_handoff: predictedP2gHandoffUrl
        }
      }
    },
    characterProfile,
    promptPack
  });

  const p2gHandoffUrl = await writeJsonArtifact(workflowId, outputDir, "p2g-handoff.json", p2gHandoff);
  mergeWorkflowOutputs(workflowId, {
    meta_files: {
      p2g_handoff: p2gHandoffUrl
    }
  });

  return {
    manifest,
    characterPack,
    p2gHandoff
  };
}

module.exports = {
  toPublicOutputUrl,
  writeWorkflowSnapshots
};

