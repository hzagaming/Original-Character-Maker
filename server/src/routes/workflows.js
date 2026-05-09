const express = require("express");
const fs = require("fs/promises");
const syncFs = require("fs");
const multer = require("multer");
const path = require("path");
const archiver = require("archiver");
const { v4: uuidv4 } = require("uuid");
const config = require("../config");
const { AppError } = require("../utils/errors");
const { validateUploadedFile } = require("../services/fileValidation");
const {
  WORKFLOW_STEPS,
  createWorkflow,
  getWorkflow,
  markStepStatus,
  mergeWorkflowOutputs,
  resetWorkflowStep,
  setWorkflowStatus,
  updateWorkflow
} = require("../services/workflowStore");
const { executeWorkflow, rerunWorkflowStep } = require("../pipeline/executeWorkflow");
const { writeWorkflowSnapshots } = require("../services/workflowArtifacts");

const router = express.Router();
const activeRedoGroups = new Map();

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, config.uploadDir);
  },
  filename: (_req, file, callback) => {
    const ext = path.extname(file.originalname) || ".png";
    const id = uuidv4().replace(/-/g, "").slice(0, 10);
    callback(null, `${Date.now()}-${id}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: config.maxUploadSizeBytes
  }
});

function parsePromptOverrides(value) {
  if (!value) {
    return null;
  }

  if (typeof value === "object") {
    return value;
  }

  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch (_error) {
    return null;
  }
}

function parseExecutionOptions(value) {
  const raw = value?.aiConcurrencyEnabled;
  if (raw === undefined || raw === null) {
    return {};
  }
  return {
    ai_concurrency_enabled: raw === true || raw === "true" || raw === 1 || raw === "1"
  };
}

function createWorkflowNotFoundError(workflowId) {
  return new AppError(
    "Workflow not found.",
    404,
    {
      workflow_id: workflowId || null,
      possible_cause: "The workflow state is no longer available. This usually happens after a redeploy/restart when WORKFLOW_STATE_DIR is not mounted to persistent storage.",
      fix_hint: "Start a new workflow. For Zeabur, mount a volume and set WORKFLOW_STATE_DIR, OUTPUT_DIR, and UPLOAD_DIR to persistent paths if old workflow reruns/downloads must survive redeploys."
    },
    "WORKFLOW_NOT_FOUND"
  );
}

function getDependentRedoSteps(stepName) {
  if (stepName === "expression_thinking") return ["cutout_expression_thinking"];
  if (stepName === "expression_surprise") return ["cutout_expression_surprise"];
  if (stepName === "expression_angry") return ["cutout_expression_angry"];
  return [];
}

function getRedoConflictGroup(stepName) {
  if (stepName === "expression_thinking" || stepName === "cutout_expression_thinking") return "expression:thinking";
  if (stepName === "expression_surprise" || stepName === "cutout_expression_surprise") return "expression:surprise";
  if (stepName === "expression_angry" || stepName === "cutout_expression_angry") return "expression:angry";
  if (stepName === "cg_01") return "cg:01";
  if (stepName === "cg_02") return "cg:02";
  return stepName;
}

function getActiveRedoGroups(workflowId) {
  return activeRedoGroups.get(workflowId) || new Set();
}

function getActiveRedoList(workflowId) {
  return [...getActiveRedoGroups(workflowId)];
}

function hasActiveRedo(workflowId) {
  return getActiveRedoGroups(workflowId).size > 0;
}

function beginRedoJob(workflowId, targetStep) {
  const group = getRedoConflictGroup(targetStep);
  const current = getActiveRedoGroups(workflowId);
  if (current.has(group)) {
    return {
      ok: false,
      group,
      active: [...current]
    };
  }

  current.add(group);
  activeRedoGroups.set(workflowId, current);
  updateWorkflow(workflowId, {
    active_redos: [...current]
  });
  return {
    ok: true,
    group,
    active: [...current]
  };
}

function finishRedoJob(workflowId, group) {
  const current = getActiveRedoGroups(workflowId);
  current.delete(group);
  if (current.size === 0) {
    activeRedoGroups.delete(workflowId);
  } else {
    activeRedoGroups.set(workflowId, current);
  }
  updateWorkflow(workflowId, {
    active_redos: [...current]
  });
}

function getExpressionStepName(expressionName) {
  if (expressionName === "thinking") return "expression_thinking";
  if (expressionName === "surprise") return "expression_surprise";
  if (expressionName === "angry") return "expression_angry";
  return "";
}

function getCurrentExpressionVersion(workflow, expressionName) {
  const stepName = getExpressionStepName(expressionName);
  const step = stepName ? workflow.steps?.[stepName] : null;
  return step?.finished_at || step?.started_at || "";
}

function clearRedoOutputs(workflowId, stepName) {
  if (stepName === "expression_thinking") {
    mergeWorkflowOutputs(workflowId, { expressions: { thinking: null }, expression_cutouts: { thinking: null } });
    return;
  }
  if (stepName === "expression_surprise") {
    mergeWorkflowOutputs(workflowId, { expressions: { surprise: null }, expression_cutouts: { surprise: null } });
    return;
  }
  if (stepName === "expression_angry") {
    mergeWorkflowOutputs(workflowId, { expressions: { angry: null }, expression_cutouts: { angry: null } });
    return;
  }
  if (stepName === "cutout_expression_thinking") {
    mergeWorkflowOutputs(workflowId, { expression_cutouts: { thinking: null } });
    return;
  }
  if (stepName === "cutout_expression_surprise") {
    mergeWorkflowOutputs(workflowId, { expression_cutouts: { surprise: null } });
    return;
  }
  if (stepName === "cutout_expression_angry") {
    mergeWorkflowOutputs(workflowId, { expression_cutouts: { angry: null } });
    return;
  }
  if (stepName === "cg_01" || stepName === "cg_02") {
    const workflow = getWorkflow(workflowId);
    const next = [...(workflow?.outputs?.cg_outputs || [null, null])];
    next[stepName === "cg_01" ? 0 : 1] = null;
    mergeWorkflowOutputs(workflowId, { cg_outputs: next });
  }
}

function areFrontendCutoutsComplete(workflow) {
  return ["thinking", "surprise", "angry"].every((name) => {
    const step = workflow.steps?.[`cutout_expression_${name}`];
    return step?.status === "success" || step?.status === "skipped" || step?.status === "failed";
  });
}

function hasErroredFrontendCutouts(workflow) {
  return ["thinking", "surprise", "angry"].some((name) => {
    const status = workflow.steps?.[`cutout_expression_${name}`]?.status;
    return status === "skipped" || status === "failed";
  });
}

function isWaitingOnlyForFrontendCutouts(workflow) {
  if (!workflow || workflow.outputs?.providers?.remove_background !== "frontend") {
    return false;
  }

  const activeNonCutoutStep = WORKFLOW_STEPS.some((stepName) => {
    if (stepName.startsWith("cutout_expression_")) {
      return false;
    }
    const status = workflow.steps?.[stepName]?.status;
    return status === "queued" || status === "running";
  });
  if (activeNonCutoutStep) {
    return false;
  }

  return ["thinking", "surprise", "angry"].some((name) => {
    const step = workflow.steps?.[`cutout_expression_${name}`];
    return step?.provider === "frontend" && (step.status === "queued" || step.status === "idle" || step.status === "running");
  });
}

router.post("/", upload.single("image"), async (req, res, next) => {
  try {
    const sourceImage = validateUploadedFile(req.file, config);
    const promptOverrides = parsePromptOverrides(req.body?.promptOverrides);
    const executionOptions = parseExecutionOptions(req.body);
    const workflow = createWorkflow({ sourceImage, promptOverrides, executionOptions });

    setImmediate(() => {
      executeWorkflow(workflow.id, config).catch((_error) => {
        // Error is already persisted in workflow state; no need to log here
      });
    });

    res.status(202).json({
      workflow_id: workflow.id,
      status: workflow.status,
      message: "Workflow accepted and started.",
      workflow
    });
  } catch (error) {
    if (req.file?.path) {
      await fs.rm(req.file.path, { force: true }).catch(() => null);
    }
    next(error);
  }
});

router.post("/:id/rerun", express.json(), async (req, res, next) => {
  let acceptedRedoJob = null;
  let acceptedWorkflowId = null;
  try {
    const workflow = getWorkflow(req.params.id);
    if (!workflow) {
      throw createWorkflowNotFoundError(req.params.id);
    }

    if ((workflow.status === "running" || workflow.status === "queued") && !isWaitingOnlyForFrontendCutouts(workflow) && !hasActiveRedo(workflow.id)) {
      throw new AppError("Workflow is still running. Please wait for it to finish before redoing a result.", 409);
    }

    const targetStep = String(req.body?.targetStep || "").trim();
    if (!targetStep) {
      throw new AppError("Missing targetStep for workflow redo.", 400);
    }
    if (!WORKFLOW_STEPS.includes(targetStep)) {
      throw new AppError(`Invalid targetStep: ${targetStep}`, 400);
    }

    const redoJob = beginRedoJob(workflow.id, targetStep);
    if (!redoJob.ok) {
      throw new AppError("This result is already being redone. Please wait for that redo to finish.", 409, {
        target_step: targetStep,
        conflict_group: redoJob.group,
        active_redos: redoJob.active
      });
    }
    acceptedRedoJob = redoJob;
    acceptedWorkflowId = workflow.id;

    const promptOverrides = parsePromptOverrides(req.body?.promptOverrides);
    const executionOptions = parseExecutionOptions(req.body);
    updateWorkflow(workflow.id, {
      prompt_overrides: promptOverrides || workflow.prompt_overrides || null,
      execution_options: {
        ...(workflow.execution_options || {}),
        ...executionOptions
      }
    });
    clearRedoOutputs(workflow.id, targetStep);
    resetWorkflowStep(workflow.id, targetStep);
    markStepStatus(workflow.id, targetStep, "running", null, {
      provider: "redo",
      debug: {
        target_step: targetStep,
        conflict_group: redoJob.group,
        active_redos: redoJob.active,
        note: "Redo request accepted. This step is queued/running now."
      }
    });
    for (const dependentStep of getDependentRedoSteps(targetStep)) {
      clearRedoOutputs(workflow.id, dependentStep);
      resetWorkflowStep(workflow.id, dependentStep);
      markStepStatus(workflow.id, dependentStep, "queued", null, {
        provider: "redo",
        debug: {
          triggered_by: targetStep,
          conflict_group: redoJob.group,
          note: "Dependent cutout will be regenerated after the expression redo finishes."
        }
      });
    }
    setWorkflowStatus(workflow.id, "running", targetStep, null, null);

    setImmediate(() => {
      console.log(`[Backend] Redo started workflow=${workflow.id} step=${targetStep} group=${redoJob.group}`);
      rerunWorkflowStep(workflow.id, targetStep, config)
        .catch((error) => {
          console.error(`[Backend] Redo failed workflow=${workflow.id} step=${targetStep}: ${error.message}`);
        })
        .finally(() => {
          finishRedoJob(workflow.id, redoJob.group);
          console.log(`[Backend] Redo finished workflow=${workflow.id} step=${targetStep} group=${redoJob.group}`);
        });
    });

    res.status(202).json({
      workflow_id: workflow.id,
      status: "accepted",
      message: `Redo request accepted for ${targetStep}.`,
      active_redos: getActiveRedoList(workflow.id),
      workflow: getWorkflow(workflow.id)
    });
  } catch (error) {
    if (acceptedRedoJob && acceptedWorkflowId && !res.headersSent) {
      finishRedoJob(acceptedWorkflowId, acceptedRedoJob.group);
    }
    next(error);
  }
});

router.get("/:id", (req, res, next) => {
  try {
    const workflow = getWorkflow(req.params.id);
    if (!workflow) {
      throw createWorkflowNotFoundError(req.params.id);
    }

    res.json(workflow);
  } catch (error) {
    next(error);
  }
});

router.get("/:id/download", async (req, res, next) => {
  try {
    const workflow = getWorkflow(req.params.id);
    if (!workflow) {
      throw createWorkflowNotFoundError(req.params.id);
    }

    const workflowOutputDir = path.join(config.outputDir, workflow.id);
    if (!syncFs.existsSync(workflowOutputDir)) {
      throw new AppError("Workflow outputs are not available yet.", 404);
    }

    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", `attachment; filename=\"${workflow.id}-outputs.zip\"`);

    const archive = archiver("zip", {
      zlib: { level: 9 }
    });

    archive.on("error", (error) => {
      if (!res.headersSent) {
        next(error);
      }
    });

    archive.pipe(res);
    archive.directory(workflowOutputDir, false);
    await archive.finalize();
  } catch (error) {
    next(error);
  }
});

router.post("/:id/cutouts/:expression", upload.single("image"), async (req, res, next) => {
  try {
    const workflow = getWorkflow(req.params.id);
    if (!workflow) {
      throw createWorkflowNotFoundError(req.params.id);
    }

    const expressionName = String(req.params.expression || "").trim();
    if (!["thinking", "surprise", "angry"].includes(expressionName)) {
      throw new AppError("Unsupported expression cutout name.", 400, { expression: expressionName });
    }

    if (!req.file?.path) {
      throw new AppError("No cutout uploaded. Please provide one image file in field 'image'.", 400);
    }

    const submittedSourceUrl = String(req.body?.source_url || "").trim();
    const submittedSourceVersion = String(req.body?.source_version || "").trim();
    const currentSourceUrl = workflow.outputs?.expressions?.[expressionName] || "";
    if (submittedSourceUrl && currentSourceUrl && submittedSourceUrl !== currentSourceUrl) {
      throw new AppError("Stale cutout upload rejected because the source expression was regenerated.", 409, {
        submitted_source_url: submittedSourceUrl,
        current_source_url: currentSourceUrl
      });
    }
    const currentSourceVersion = getCurrentExpressionVersion(workflow, expressionName);
    if (submittedSourceVersion && currentSourceVersion && submittedSourceVersion !== currentSourceVersion) {
      throw new AppError("Stale cutout upload rejected because the source expression version changed.", 409, {
        submitted_source_version: submittedSourceVersion,
        current_source_version: currentSourceVersion
      });
    }

    const workflowOutputDir = path.join(config.outputDir, workflow.id);
    await fs.mkdir(workflowOutputDir, { recursive: true });

    const destinationName = `expression-${expressionName}-cutout.png`;
    const destinationPath = path.join(workflowOutputDir, destinationName);
    await fs.copyFile(req.file.path, destinationPath);
    await fs.unlink(req.file.path).catch(() => null);

    const outputUrl = `/outputs/${workflow.id}/${destinationName}`;
    mergeWorkflowOutputs(workflow.id, {
      expression_cutouts: {
        [expressionName]: outputUrl
      },
      providers: {
        remove_background: "frontend"
      }
    });

    const stepName = `cutout_expression_${expressionName}`;
    markStepStatus(workflow.id, stepName, "success", null, {
      provider: "frontend",
      output_url: outputUrl
    });

    const latestWorkflow = getWorkflow(workflow.id);
    if (areFrontendCutoutsComplete(latestWorkflow)) {
      const hasCutoutErrors = hasErroredFrontendCutouts(latestWorkflow);
      setWorkflowStatus(
        workflow.id,
        hasCutoutErrors ? "completed_with_errors" : "completed",
        "done",
        hasCutoutErrors ? "Browser background removal did not finish for all expressions." : null,
        {
        provider: "frontend",
        note: "Browser background removal uploads completed."
        }
      );
    }

    await writeWorkflowSnapshots(
      workflow.id,
      workflowOutputDir,
      workflow.character_profile,
      workflow.prompt_pack
    );
    res.json({
      status: "ok",
      workflow: getWorkflow(workflow.id)
    });
  } catch (error) {
    if (req.file?.path) {
      await fs.rm(req.file.path, { force: true }).catch(() => null);
    }
    next(error);
  }
});

router.post("/:id/cutouts/:expression/failed", async (req, res, next) => {
  try {
    const workflow = getWorkflow(req.params.id);
    if (!workflow) {
      throw createWorkflowNotFoundError(req.params.id);
    }

    const expressionName = String(req.params.expression || "").trim();
    if (!["thinking", "surprise", "angry"].includes(expressionName)) {
      throw new AppError("Unsupported expression cutout name.", 400, { expression: expressionName });
    }

    const submittedSourceUrl = String(req.body?.source_url || "").trim();
    const submittedSourceVersion = String(req.body?.source_version || "").trim();
    const currentSourceUrl = workflow.outputs?.expressions?.[expressionName] || "";
    if (submittedSourceUrl && currentSourceUrl && submittedSourceUrl !== currentSourceUrl) {
      return res.status(409).json({
        status: "stale",
        workflow,
        error: "Stale cutout failure report ignored because the source expression was regenerated."
      });
    }
    const currentSourceVersion = getCurrentExpressionVersion(workflow, expressionName);
    if (submittedSourceVersion && currentSourceVersion && submittedSourceVersion !== currentSourceVersion) {
      return res.status(409).json({
        status: "stale",
        workflow,
        error: "Stale cutout failure report ignored because the source expression version changed."
      });
    }

    const errorMessage = String(req.body?.error || "Browser background removal failed.").slice(0, 1000);
    const stepName = `cutout_expression_${expressionName}`;
    markStepStatus(workflow.id, stepName, "failed", errorMessage, {
      provider: "frontend",
      debug: {
        source_url: currentSourceUrl || null,
        frontend_error: errorMessage,
        note: "The browser could not generate a transparent PNG cutout."
      }
    });

    const latestWorkflow = getWorkflow(workflow.id);
    if (areFrontendCutoutsComplete(latestWorkflow)) {
      setWorkflowStatus(workflow.id, "completed_with_errors", "done", "Browser background removal did not finish for all expressions.", {
        provider: "frontend",
        note: "At least one browser-side cutout failed."
      });
    }

    const workflowOutputDir = path.join(config.outputDir, workflow.id);
    await writeWorkflowSnapshots(
      workflow.id,
      workflowOutputDir,
      latestWorkflow.character_profile,
      latestWorkflow.prompt_pack
    );

    res.json({
      status: "ok",
      workflow: getWorkflow(workflow.id)
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
