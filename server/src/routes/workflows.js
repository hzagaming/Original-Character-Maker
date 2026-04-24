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

function getDependentRedoSteps(stepName) {
  if (stepName === "expression_thinking") return ["cutout_expression_thinking"];
  if (stepName === "expression_surprise") return ["cutout_expression_surprise"];
  if (stepName === "expression_angry") return ["cutout_expression_angry"];
  return [];
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
  try {
    const workflow = getWorkflow(req.params.id);
    if (!workflow) {
      throw new AppError("Workflow not found.", 404);
    }

    if (workflow.status === "running" || workflow.status === "queued") {
      throw new AppError("Workflow is still running. Please wait for it to finish before redoing a result.", 409);
    }

    const targetStep = String(req.body?.targetStep || "").trim();
    if (!targetStep) {
      throw new AppError("Missing targetStep for workflow redo.", 400);
    }
    if (!WORKFLOW_STEPS.includes(targetStep)) {
      throw new AppError(`Invalid targetStep: ${targetStep}`, 400);
    }

    const promptOverrides = parsePromptOverrides(req.body?.promptOverrides);
    const executionOptions = parseExecutionOptions(req.body);
    updateWorkflow(workflow.id, {
      prompt_overrides: promptOverrides || workflow.prompt_overrides || null,
      execution_options: {
        ...(workflow.execution_options || {}),
        ...executionOptions
      }
    });
    resetWorkflowStep(workflow.id, targetStep);
    for (const dependentStep of getDependentRedoSteps(targetStep)) {
      resetWorkflowStep(workflow.id, dependentStep);
    }
    setWorkflowStatus(workflow.id, "running", targetStep, null, null);

    setImmediate(() => {
      rerunWorkflowStep(workflow.id, targetStep, config).catch((_error) => {
        // Error is already persisted in workflow state; no need to log here
      });
    });

    res.status(202).json({
      workflow_id: workflow.id,
      status: "accepted",
      message: `Redo request accepted for ${targetStep}.`,
      workflow: getWorkflow(workflow.id)
    });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", (req, res, next) => {
  try {
    const workflow = getWorkflow(req.params.id);
    if (!workflow) {
      throw new AppError("Workflow not found.", 404);
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
      throw new AppError("Workflow not found.", 404);
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
      throw new AppError("Workflow not found.", 404);
    }

    const expressionName = String(req.params.expression || "").trim();
    if (!["thinking", "surprise", "angry"].includes(expressionName)) {
      throw new AppError("Unsupported expression cutout name.", 400, { expression: expressionName });
    }

    if (!req.file?.path) {
      throw new AppError("No cutout uploaded. Please provide one image file in field 'image'.", 400);
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

module.exports = router;
