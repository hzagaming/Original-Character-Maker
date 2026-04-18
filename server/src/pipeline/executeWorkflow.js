const path = require("path");
const fs = require("fs/promises");
const {
  getWorkflow,
  markStepStatus,
  mergeWorkflowOutputs,
  setWorkflowOutputs,
  setWorkflowStatus
} = require("../services/workflowStore");
const {
  createBackgroundRemovalPrompt,
  getExpressionPrompt,
  getPromptPack
} = require("../services/promptLoader");
const { createBootstrapCharacterProfile } = require("../services/characterProfile");
const { analyzeCharacterReference } = require("../services/characterUnderstanding");
const { buildCharacterPackSnapshot } = require("../services/characterPack");
const { buildP2gHandoff } = require("../services/p2gHandoff");
const {
  getBackgroundRemovalRunner,
  getCgRunner,
  getExpressionRunner,
  getMimeTypeFromPath
} = require("../services/providerRegistry");
const { formatErrorDetails } = require("../utils/errors");
const { asyncPool } = require("../utils/asyncPool");

function toPublicOutputUrl(workflowId, fileName) {
  return `/outputs/${workflowId}/${fileName}`;
}

async function writeJsonArtifact(workflowId, outputDir, fileName, payload) {
  await fs.writeFile(path.join(outputDir, fileName), JSON.stringify(payload, null, 2), "utf8");
  return toPublicOutputUrl(workflowId, fileName);
}

async function writeWorkflowSnapshots(workflowId, outputDir, characterProfile, promptPack) {
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
  const p2gHandoffUrl = await writeJsonArtifact(
    workflowId,
    outputDir,
    "p2g-handoff.json",
    p2gHandoff
  );
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

async function runStep(workflowId, stepName, provider, runFn, onSuccess, options = {}) {
  const { fatal = true, updateCurrentStep = true } = options;
  markStepStatus(workflowId, stepName, "running", null, { provider });
  if (updateCurrentStep) {
    setWorkflowStatus(workflowId, "running", stepName, null, null);
  }

  try {
    const result = await runFn();
    const outputUrl = result?.output_path
      ? toPublicOutputUrl(workflowId, path.basename(result.output_path))
      : null;

    markStepStatus(workflowId, stepName, "success", null, {
      provider: result?.provider || provider,
      output_url: outputUrl,
      debug: result?.debug || null
    });

    if (typeof onSuccess === "function") {
      await onSuccess(result, outputUrl);
    }

    return result;
  } catch (error) {
    const detailed = formatErrorDetails(error, {
      step: stepName,
      provider,
      workflow_id: workflowId
    });

    markStepStatus(workflowId, stepName, "failed", detailed.message, {
      provider,
      debug: detailed.debug
    });

    if (fatal) {
      setWorkflowStatus(workflowId, "failed", stepName, detailed.message, detailed.debug);
      throw error;
    }

    return null;
  }
}

async function skipStep(workflowId, outputDir, characterProfile, promptPack, stepName, provider, message, debug = null) {
  markStepStatus(workflowId, stepName, "skipped", message, {
    provider,
    debug
  });
  setWorkflowStatus(workflowId, "running", stepName, null, null);
  await writeWorkflowSnapshots(workflowId, outputDir, characterProfile, promptPack);
}

async function executeWorkflow(workflowId, config) {
  const workflow = getWorkflow(workflowId);
  if (!workflow) {
    return null;
  }

  let characterProfile = null;
  let promptPack = null;

  try {
    const originalSourcePath = workflow.source_image.upload_path;
    const originalSourceMimeType = workflow.source_image.mime_type;
    const outputDir = path.join(config.outputDir, workflowId);
    const backgroundRemovalRunner = getBackgroundRemovalRunner(config);
    const expressionRunner = getExpressionRunner(config);
    const cgRunner = getCgRunner(config);

    await fs.mkdir(outputDir, { recursive: true });

    mergeWorkflowOutputs(workflowId, {
      providers: {
        remove_background: backgroundRemovalRunner.provider,
        expressions: expressionRunner.provider,
        cg: cgRunner.provider
      }
    });

    await runStep(workflowId, "validate_input", "system", async () => true);
    characterProfile = createBootstrapCharacterProfile(workflow);
    await runStep(
      workflowId,
      "analyze_character",
      "system",
      async () => {
        characterProfile = analyzeCharacterReference(workflow, characterProfile);
        return {
          debug: {
            profile_stage: characterProfile.profile_stage,
            framing: characterProfile.analysis?.framing || null,
            reference_strength: characterProfile.analysis?.reference_strength || null
          }
        };
      },
      async () => {
        await writeWorkflowSnapshots(workflowId, outputDir, characterProfile, promptPack);
      }
    );
    promptPack = await getPromptPack(characterProfile);
    promptPack.expression_cutouts = {
      provider: config.bgRemovalProvider,
      prompt: createBackgroundRemovalPrompt()
    };
    await writeWorkflowSnapshots(workflowId, outputDir, characterProfile, promptPack);

    const expressionMap = {
      thinking: "expression_thinking",
      surprise: "expression_surprise",
      angry: "expression_angry"
    };
    const successfulExpressionArtifacts = {};

    const expressionTasks = Object.entries(expressionMap).map(([expressionName, stepName]) => async () => {
      const expressionPrompt =
        promptPack?.expressions?.[expressionName] ||
        (await getExpressionPrompt(expressionName, characterProfile));

      const expressionResult = await runStep(
        workflowId,
        stepName,
        expressionRunner.provider,
        async () =>
          expressionRunner.run({
            config,
            sourcePath: originalSourcePath,
            sourceMimeType: originalSourceMimeType,
            destinationPath: path.join(outputDir, `expression-${expressionName}.png`),
            prompt: expressionPrompt
          }),
        async (result, outputUrl) => {
          successfulExpressionArtifacts[expressionName] = {
            outputPath: result.output_path,
            mimeType: getMimeTypeFromPath(result.output_path)
          };
          mergeWorkflowOutputs(workflowId, {
            expressions: {
              [expressionName]: outputUrl
            },
            providers: {
              expressions: result.provider || expressionRunner.provider
            }
          });
          await writeWorkflowSnapshots(workflowId, outputDir, characterProfile, promptPack);
        },
        {
          fatal: false,
          updateCurrentStep: false
        }
      );

      if (!expressionResult) {
        successfulExpressionArtifacts[expressionName] = null;
        await writeWorkflowSnapshots(workflowId, outputDir, characterProfile, promptPack);
      }

      return expressionResult;
    });

    await asyncPool(expressionTasks, config.imageGenConcurrency);

    const cgPromptEntries = promptPack.cg || [];

    const cgTasks = [
      ["cg_01", "cg-01.png"],
      ["cg_02", "cg-02.png"]
    ].map(([stepName, outputName], index) => async () => {
      const cgPromptEntry = cgPromptEntries[index];
      promptPack.cg[index] = cgPromptEntry;

      const cgResult = await runStep(
        workflowId,
        stepName,
        cgRunner.provider,
        async () =>
          cgRunner.run({
            config,
            sourcePath: originalSourcePath,
            sourceMimeType: originalSourceMimeType,
            destinationPath: path.join(outputDir, outputName),
            prompt: cgPromptEntry.prompt
          }),
        async (_result, outputUrl) => {
          const result = _result;
          const nextCgOutputs = getWorkflow(workflowId)?.outputs?.cg_outputs || [null, null];
          nextCgOutputs[index] = outputUrl;

          mergeWorkflowOutputs(workflowId, {
            cg_outputs: nextCgOutputs,
            providers: {
              cg: result.provider || cgRunner.provider
            }
          });
          await writeWorkflowSnapshots(workflowId, outputDir, characterProfile, promptPack);
        },
        {
          fatal: false,
          updateCurrentStep: false
        }
      );

      if (!cgResult) {
        await writeWorkflowSnapshots(workflowId, outputDir, characterProfile, promptPack);
      }

      return cgResult;
    });

    await asyncPool(cgTasks, config.imageGenConcurrency);

    const cutoutTasks = [
      ["thinking", "cutout_expression_thinking"],
      ["surprise", "cutout_expression_surprise"],
      ["angry", "cutout_expression_angry"]
    ].map(([expressionName, stepName]) => async () => {
      const sourceArtifact = successfulExpressionArtifacts[expressionName];

      if (!sourceArtifact?.outputPath) {
        await skipStep(
          workflowId,
          outputDir,
          characterProfile,
          promptPack,
          stepName,
          backgroundRemovalRunner.provider,
          `Skipped because ${expressionMap[expressionName]} failed, so no expression image was available for cutout.`,
          {
            dependency_step: expressionMap[expressionName],
            reason: "missing_expression_output"
          }
        );
        return null;
      }

      const cutoutResult = await runStep(
        workflowId,
        stepName,
        backgroundRemovalRunner.provider,
        async () =>
          backgroundRemovalRunner.run({
            config,
            sourcePath: sourceArtifact.outputPath,
            sourceMimeType: sourceArtifact.mimeType,
            destinationPath: path.join(outputDir, `expression-${expressionName}-cutout.png`),
            prompt: promptPack.expression_cutouts.prompt
          }),
        async (_result, outputUrl) => {
          const result = _result;
          mergeWorkflowOutputs(workflowId, {
            expression_cutouts: {
              [expressionName]: outputUrl
            },
            providers: {
              remove_background: result.provider || backgroundRemovalRunner.provider
            }
          });
          await writeWorkflowSnapshots(workflowId, outputDir, characterProfile, promptPack);
        },
        {
          fatal: false
        }
      );

      if (!cutoutResult) {
        await writeWorkflowSnapshots(workflowId, outputDir, characterProfile, promptPack);
      }

      return cutoutResult;
    });

    await asyncPool(cutoutTasks, config.rembgConcurrency);

    const currentWorkflow = getWorkflow(workflowId);
    const failedOrSkippedSteps = Object.entries(currentWorkflow.steps).filter(([, step]) =>
      step.status === "failed" || step.status === "skipped"
    );
    const outputs = {
      ...currentWorkflow.outputs,
      providers: {
        remove_background:
          currentWorkflow.outputs?.providers?.remove_background || backgroundRemovalRunner.provider,
        expressions: currentWorkflow.outputs?.providers?.expressions || expressionRunner.provider,
        cg: currentWorkflow.outputs?.providers?.cg || cgRunner.provider
      }
    };

    setWorkflowOutputs(workflowId, outputs);
    if (failedOrSkippedSteps.length > 0) {
      setWorkflowStatus(
        workflowId,
        "completed_with_errors",
        "done",
        `${failedOrSkippedSteps.length} steps did not finish successfully.`,
        {
          failed_steps: failedOrSkippedSteps.map(([name, step]) => ({
            step: name,
            status: step.status,
            provider: step.provider,
            error: step.error
          }))
        }
      );
    } else {
      setWorkflowStatus(workflowId, "completed", "done", null, null);
    }
    await writeWorkflowSnapshots(workflowId, outputDir, characterProfile, promptPack);
  } catch (error) {
    const currentWorkflow = getWorkflow(workflowId);
    const outputDir = path.join(config.outputDir, workflowId);

    if (currentWorkflow) {
      await writeWorkflowSnapshots(workflowId, outputDir, characterProfile, promptPack).catch(() => null);
    }
  }

  return getWorkflow(workflowId);
}

module.exports = {
  executeWorkflow
};
