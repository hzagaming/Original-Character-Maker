const path = require("path");
const fs = require("fs/promises");
const {
  getWorkflow,
  markStepStatus,
  mergeWorkflowOutputs,
  resetWorkflowStep,
  setWorkflowOutputs,
  setWorkflowStatus
} = require("../services/workflowStore");
const {
  applyPromptOverrides,
  getExpressionPrompt,
  getPromptPack
} = require("../services/promptLoader");
const { createBootstrapCharacterProfile } = require("../services/characterProfile");
const { analyzeCharacterReference } = require("../services/characterUnderstanding");
const {
  getBackgroundRemovalRunner,
  getCgRunner,
  getExpressionRunner,
  getMimeTypeFromPath
} = require("../services/providerRegistry");
const { formatErrorDetails } = require("../utils/errors");
const { asyncPool } = require("../utils/asyncPool");
const { toPublicOutputUrl, writeWorkflowSnapshots } = require("../services/workflowArtifacts");

const EXPRESSION_STEP_MAP = {
  thinking: "expression_thinking",
  surprise: "expression_surprise",
  angry: "expression_angry"
};

const CUTOUT_STEP_MAP = {
  thinking: "cutout_expression_thinking",
  surprise: "cutout_expression_surprise",
  angry: "cutout_expression_angry"
};

const CG_STEP_CONFIG = [
  ["cg_01", "cg-01.png"],
  ["cg_02", "cg-02.png"]
];

const REDOABLE_STEP_NAMES = new Set([
  ...Object.values(EXPRESSION_STEP_MAP),
  ...CG_STEP_CONFIG.map(([stepName]) => stepName),
  ...Object.values(CUTOUT_STEP_MAP)
]);

function getAiTaskConcurrency(workflow, config) {
  return workflow?.execution_options?.ai_concurrency_enabled
    ? Math.max(1, config.imageGenConcurrency)
    : 1;
}

function getExpressionNameFromStep(stepName) {
  return Object.entries(EXPRESSION_STEP_MAP).find(([, value]) => value === stepName)?.[0] || null;
}

function getCutoutExpressionName(stepName) {
  return Object.entries(CUTOUT_STEP_MAP).find(([, value]) => value === stepName)?.[0] || null;
}

function syncFrontendCutoutSteps(workflowId) {
  const workflow = getWorkflow(workflowId);
  if (!workflow) {
    return;
  }

  for (const expressionName of Object.keys(EXPRESSION_STEP_MAP)) {
    const cutoutStepName = CUTOUT_STEP_MAP[expressionName];
    const expressionOutputUrl = workflow.outputs?.expressions?.[expressionName] || null;
    const existingCutoutUrl = workflow.outputs?.expression_cutouts?.[expressionName] || null;

    if (existingCutoutUrl) {
      continue;
    }

    if (!expressionOutputUrl) {
      markStepStatus(workflowId, cutoutStepName, "skipped", "Source expression image was not generated, so frontend cutout was not run.", {
        provider: "frontend",
        debug: {
          note: "Frontend cutout skipped because the source expression output is missing."
        }
      });
    }
  }
}

function getExpressionArtifactFromUrl(outputDir, outputUrl) {
  if (!outputUrl) {
    return null;
  }

  return {
    outputPath: path.join(outputDir, path.basename(outputUrl)),
    mimeType: getMimeTypeFromPath(outputUrl)
  };
}

function toAbsoluteWorkflowAssetUrl(config, outputUrl) {
  const normalized = String(outputUrl || "").trim();
  if (!normalized) {
    return null;
  }

  if (/^https?:\/\//i.test(normalized)) {
    return normalized;
  }

  if (!config.publicAppBaseUrl) {
    return null;
  }

  return `${config.publicAppBaseUrl}${normalized.startsWith("/") ? normalized : `/${normalized}`}`;
}

function getExpressionRemoteUrlFromWorkflow(workflowId, config, expressionName) {
  const workflow = getWorkflow(workflowId);
  const outputUrl = workflow?.outputs?.expressions?.[expressionName] || null;
  return (
    toAbsoluteWorkflowAssetUrl(config, outputUrl) ||
    workflow?.steps?.[EXPRESSION_STEP_MAP[expressionName]]?.debug?.image_url ||
    null
  );
}

function getExpressionArtifactFromWorkflow(workflowId, config, outputDir, expressionName) {
  const workflow = getWorkflow(workflowId);
  const outputUrl = workflow?.outputs?.expressions?.[expressionName];
  const artifact = getExpressionArtifactFromUrl(outputDir, outputUrl);
  if (!artifact) {
    return null;
  }

  return {
    ...artifact,
    remoteUrl: getExpressionRemoteUrlFromWorkflow(workflowId, config, expressionName)
  };
}

function clearStepOutputs(workflowId, stepName) {
  switch (stepName) {
    case "expression_thinking":
      mergeWorkflowOutputs(workflowId, { expressions: { thinking: null } });
      break;
    case "expression_surprise":
      mergeWorkflowOutputs(workflowId, { expressions: { surprise: null } });
      break;
    case "expression_angry":
      mergeWorkflowOutputs(workflowId, { expressions: { angry: null } });
      break;
    case "cg_01": {
      const next = [...(getWorkflow(workflowId)?.outputs?.cg_outputs || [null, null])];
      next[0] = null;
      mergeWorkflowOutputs(workflowId, { cg_outputs: next });
      break;
    }
    case "cg_02": {
      const next = [...(getWorkflow(workflowId)?.outputs?.cg_outputs || [null, null])];
      next[1] = null;
      mergeWorkflowOutputs(workflowId, { cg_outputs: next });
      break;
    }
    case "cutout_expression_thinking":
      mergeWorkflowOutputs(workflowId, { expression_cutouts: { thinking: null } });
      break;
    case "cutout_expression_surprise":
      mergeWorkflowOutputs(workflowId, { expression_cutouts: { surprise: null } });
      break;
    case "cutout_expression_angry":
      mergeWorkflowOutputs(workflowId, { expression_cutouts: { angry: null } });
      break;
    default:
      break;
  }
}

async function buildWorkflowRuntime(workflowId, config, precomputedCharacterProfile = null) {
  const workflow = getWorkflow(workflowId);
  if (!workflow) {
    return null;
  }

  const outputDir = path.join(config.outputDir, workflowId);
  await fs.mkdir(outputDir, { recursive: true });

  const characterProfile =
    precomputedCharacterProfile ||
    analyzeCharacterReference(workflow, createBootstrapCharacterProfile(workflow));
  const promptPack = applyPromptOverrides(
    await getPromptPack(characterProfile),
    workflow.prompt_overrides,
    characterProfile
  );
  const bgRunner = getBackgroundRemovalRunner(config);
  promptPack.expression_cutouts = {
    provider: bgRunner.provider
  };

  const bgRemovalRunner = bgRunner;
  const expressionRunner = getExpressionRunner(config);
  const cgRunner = getCgRunner(config);

  mergeWorkflowOutputs(workflowId, {
    providers: {
      remove_background: bgRemovalRunner.provider,
      expressions: expressionRunner.provider,
      cg: cgRunner.provider
    }
  });

  return {
    workflowId,
    workflow,
    config,
    outputDir,
    originalSourcePath: workflow.source_image.upload_path,
    originalSourceMimeType: workflow.source_image.mime_type,
    bgRemovalRunner,
    expressionRunner,
    cgRunner,
    characterProfile,
    promptPack
  };
}

async function runExpressionGeneration(runtime, expressionName) {
  const { workflowId, expressionRunner, originalSourcePath, originalSourceMimeType, outputDir, characterProfile, promptPack } = runtime;
  const stepName = EXPRESSION_STEP_MAP[expressionName];
  const expressionPrompt =
    promptPack?.expressions?.[expressionName] ||
    (await getExpressionPrompt(expressionName, characterProfile));

  const expressionResult = await runStep(
    workflowId,
    stepName,
    expressionRunner.provider,
    async () =>
      expressionRunner.run({
        config: runtime.config,
        sourcePath: originalSourcePath,
        sourceMimeType: originalSourceMimeType,
        destinationPath: path.join(outputDir, `expression-${expressionName}.png`),
        prompt: expressionPrompt
      }),
    async (result, outputUrl) => {
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
    await writeWorkflowSnapshots(workflowId, outputDir, characterProfile, promptPack);
    return null;
  }

  return {
    outputPath: expressionResult.output_path,
    mimeType: getMimeTypeFromPath(expressionResult.output_path),
    remoteUrl: getExpressionRemoteUrlFromWorkflow(workflowId, runtime.config, expressionName)
  };
}

async function runCgGeneration(runtime, index) {
  const { workflowId, cgRunner, originalSourcePath, originalSourceMimeType, outputDir, characterProfile, promptPack } = runtime;
  const [stepName, outputName] = CG_STEP_CONFIG[index];
  const cgPromptEntry = promptPack.cg?.[index];

  const cgResult = await runStep(
    workflowId,
    stepName,
    cgRunner.provider,
    async () =>
      cgRunner.run({
        config: runtime.config,
        sourcePath: originalSourcePath,
        sourceMimeType: originalSourceMimeType,
        destinationPath: path.join(outputDir, outputName),
        prompt: cgPromptEntry.prompt
      }),
    async (result, outputUrl) => {
      const nextCgOutputs = [...(getWorkflow(workflowId)?.outputs?.cg_outputs || [null, null])];
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
}

async function runCutoutGeneration(runtime, expressionName, artifact = null) {
  const { workflowId, bgRemovalRunner, outputDir, characterProfile, promptPack } = runtime;
  const stepName = CUTOUT_STEP_MAP[expressionName];
  const sourceArtifact = artifact || getExpressionArtifactFromWorkflow(workflowId, runtime.config, outputDir, expressionName);

  if (!sourceArtifact?.outputPath) {
    await skipStep(
      workflowId,
      outputDir,
      characterProfile,
      promptPack,
      stepName,
      bgRemovalRunner.provider,
      "Source expression image was not generated, so cutout was skipped.",
      {
        note: "Cutout skipped because the expression source asset is missing."
      }
    );
    return null;
  }

  const cutoutResult = await runStep(
    workflowId,
    stepName,
    bgRemovalRunner.provider,
    async () =>
      bgRemovalRunner.run({
        config: runtime.config,
        sourcePath: sourceArtifact.outputPath,
        sourceMimeType: sourceArtifact.mimeType,
        sourceUrl: sourceArtifact.remoteUrl || null,
        destinationPath: path.join(outputDir, `expression-${expressionName}-cutout.png`)
      }),
    async (result, outputUrl) => {
      mergeWorkflowOutputs(workflowId, {
        expression_cutouts: {
          [expressionName]: outputUrl
        },
        providers: {
          remove_background: result.provider || bgRemovalRunner.provider
        }
      });
      await writeWorkflowSnapshots(workflowId, outputDir, characterProfile, promptPack);
    },
    {
      fatal: false,
      updateCurrentStep: false
    }
  );

  if (!cutoutResult) {
    await writeWorkflowSnapshots(workflowId, outputDir, characterProfile, promptPack);
  }

  return cutoutResult;
}

async function finalizeWorkflowState(runtime) {
  const { workflowId, outputDir, characterProfile, promptPack, bgRemovalRunner, expressionRunner, cgRunner } = runtime;
  const currentWorkflow = getWorkflow(workflowId);
  const failedOrSkippedSteps = Object.entries(currentWorkflow.steps).filter(([, step]) =>
    step.status === "failed" || step.status === "skipped"
  );
  const outputs = {
    ...currentWorkflow.outputs,
    providers: {
      remove_background: currentWorkflow.outputs?.providers?.remove_background || bgRemovalRunner.provider,
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
  let runtime = null;

  try {
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
        const snapshotRuntime = await buildWorkflowRuntime(workflowId, config, characterProfile);
        await writeWorkflowSnapshots(workflowId, snapshotRuntime.outputDir, characterProfile, snapshotRuntime.promptPack);
      }
    );
    runtime = await buildWorkflowRuntime(workflowId, config, characterProfile);
    await writeWorkflowSnapshots(workflowId, runtime.outputDir, runtime.characterProfile, runtime.promptPack);

    const successfulExpressionArtifacts = {};
    const expressionTasks = Object.keys(EXPRESSION_STEP_MAP).map((expressionName) => async () => {
      const artifact = await runExpressionGeneration(runtime, expressionName);
      successfulExpressionArtifacts[expressionName] = artifact;
      return artifact;
    });

    await asyncPool(expressionTasks, getAiTaskConcurrency(workflow, config));
    const cutoutTasks = Object.keys(EXPRESSION_STEP_MAP).map((expressionName) => async () => {
      const artifact = successfulExpressionArtifacts[expressionName] || null;
      return runCutoutGeneration(runtime, expressionName, artifact);
    });
    await asyncPool(cutoutTasks, getAiTaskConcurrency(workflow, config));

    const cgTasks = CG_STEP_CONFIG.map(([, _outputName], index) => async () => runCgGeneration(runtime, index));
    await asyncPool(cgTasks, getAiTaskConcurrency(workflow, config));
    if (runtime.bgRemovalRunner.provider === "frontend") {
      syncFrontendCutoutSteps(workflowId);
    }

    await finalizeWorkflowState(runtime);
  } catch (error) {
    const currentWorkflow = getWorkflow(workflowId);
    const outputDir = runtime?.outputDir || path.join(config.outputDir, workflowId);

    if (currentWorkflow) {
      await writeWorkflowSnapshots(
        workflowId,
        outputDir,
        runtime?.characterProfile || characterProfile,
        runtime?.promptPack || null
      ).catch(() => null);
    }
  }

  return getWorkflow(workflowId);
}

async function rerunWorkflowStep(workflowId, targetStep, config) {
  const workflow = getWorkflow(workflowId);
  if (!workflow) {
    return null;
  }

  if (!REDOABLE_STEP_NAMES.has(targetStep)) {
    throw new Error(`Unsupported workflow redo step: ${targetStep}`);
  }

  let runtime = null;

  try {
    runtime = await buildWorkflowRuntime(workflowId, config);
    clearStepOutputs(workflowId, targetStep);
    resetWorkflowStep(workflowId, targetStep);
    setWorkflowStatus(workflowId, "running", targetStep, null, null);

    const expressionName = getExpressionNameFromStep(targetStep);
    if (expressionName) {
      const cutoutStep = CUTOUT_STEP_MAP[expressionName];
      clearStepOutputs(workflowId, cutoutStep);
      resetWorkflowStep(workflowId, cutoutStep);

      const artifact = await runExpressionGeneration(runtime, expressionName);
      await runCutoutGeneration(runtime, expressionName, artifact);
      await finalizeWorkflowState(runtime);
      return getWorkflow(workflowId);
    }

    const cgIndex = CG_STEP_CONFIG.findIndex(([stepName]) => stepName === targetStep);
    if (cgIndex >= 0) {
      await runCgGeneration(runtime, cgIndex);
      await finalizeWorkflowState(runtime);
      return getWorkflow(workflowId);
    }

    const cutoutExpressionName = getCutoutExpressionName(targetStep);
    if (cutoutExpressionName) {
      await runCutoutGeneration(runtime, cutoutExpressionName);
      await finalizeWorkflowState(runtime);
      return getWorkflow(workflowId);
    }
  } catch (error) {
    if (runtime) {
      await writeWorkflowSnapshots(
        workflowId,
        runtime.outputDir,
        runtime.characterProfile,
        runtime.promptPack
      ).catch(() => null);
    }
    throw error;
  }

  return getWorkflow(workflowId);
}

module.exports = {
  executeWorkflow,
  rerunWorkflowStep
};
