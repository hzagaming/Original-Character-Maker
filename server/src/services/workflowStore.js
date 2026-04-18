const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const config = require("../config");

const store = new Map();

const WORKFLOW_STEPS = [
  "validate_input",
  "analyze_character",
  "expression_thinking",
  "expression_surprise",
  "expression_angry",
  "cg_01",
  "cg_02",
  "cutout_expression_thinking",
  "cutout_expression_surprise",
  "cutout_expression_angry"
];

function nowIso() {
  return new Date().toISOString();
}

function ensureStateDir() {
  fs.mkdirSync(config.workflowStateDir, { recursive: true });
}

function getSnapshotPath(id) {
  return path.join(config.workflowStateDir, `${id}.json`);
}

function makeStepMap() {
  return WORKFLOW_STEPS.reduce((acc, step) => {
    acc[step] = {
      status: "queued",
      error: null,
      debug: null,
      provider: null,
      output_url: null,
      started_at: null,
      finished_at: null
    };
    return acc;
  }, {});
}

function makeOutputShape() {
  return {
    manifest: null,
    meta_files: {
      character_profile: null,
      prompts: null,
      character_pack: null,
      p2g_handoff: null
    },
    providers: {
      remove_background: null,
      expressions: null,
      cg: null
    },
    expressions: {
      thinking: null,
      surprise: null,
      angry: null
    },
    expression_cutouts: {
      thinking: null,
      surprise: null,
      angry: null
    },
    cg_outputs: [null, null]
  };
}

function persistWorkflow(workflow) {
  ensureStateDir();
  fs.writeFileSync(getSnapshotPath(workflow.id), JSON.stringify(workflow, null, 2), "utf8");
}

function mergeOutputShape(current, patch) {
  const base = current || makeOutputShape();

  return {
    ...base,
    ...patch,
    meta_files: {
      ...base.meta_files,
      ...(patch.meta_files || {})
    },
    providers: {
      ...base.providers,
      ...(patch.providers || {})
    },
    expressions: {
      ...base.expressions,
      ...(patch.expressions || {})
    },
    expression_cutouts: {
      ...base.expression_cutouts,
      ...(patch.expression_cutouts || {})
    },
    cg_outputs: Array.isArray(patch.cg_outputs)
      ? patch.cg_outputs.map((item, index) => item || base.cg_outputs[index] || null)
      : base.cg_outputs
  };
}

function touch(workflow) {
  workflow.updated_at = nowIso();
  persistWorkflow(workflow);
  return workflow;
}

function createWorkflow({ sourceImage }) {
  const id = `wf_${uuidv4().replace(/-/g, "").slice(0, 12)}`;
  const timestamp = nowIso();

  const workflow = {
    id,
    status: "queued",
    current_step: null,
    error: null,
    error_details: null,
    created_at: timestamp,
    updated_at: timestamp,
    source_image: sourceImage,
    steps: makeStepMap(),
    outputs: makeOutputShape()
  };

  store.set(id, workflow);
  persistWorkflow(workflow);
  return workflow;
}

function loadWorkflowFromDisk(id) {
  try {
    const raw = fs.readFileSync(getSnapshotPath(id), "utf8");
    const workflow = JSON.parse(raw);
    workflow.steps = {
      ...makeStepMap(),
      ...(workflow.steps || {})
    };
    workflow.outputs = mergeOutputShape(makeOutputShape(), workflow.outputs || {});
    store.set(id, workflow);
    return workflow;
  } catch (_error) {
    return null;
  }
}

function getWorkflow(id) {
  return store.get(id) || loadWorkflowFromDisk(id) || null;
}

function setWorkflowStatus(id, status, currentStep = null, errorMessage = null, errorDetails = null) {
  const workflow = getWorkflow(id);
  if (!workflow) {
    return null;
  }

  workflow.status = status;
  workflow.current_step = currentStep;
  workflow.error = errorMessage;
  workflow.error_details = errorDetails;
  touch(workflow);
  return workflow;
}

function mergeWorkflowOutputs(id, outputsPatch) {
  const workflow = getWorkflow(id);
  if (!workflow) {
    return null;
  }

  workflow.outputs = mergeOutputShape(workflow.outputs, outputsPatch);
  touch(workflow);
  return workflow;
}

function setWorkflowOutputs(id, outputs) {
  const workflow = getWorkflow(id);
  if (!workflow) {
    return null;
  }

  workflow.outputs = mergeOutputShape(makeOutputShape(), outputs);
  touch(workflow);
  return workflow;
}

function markStepStatus(id, step, status, errorMessage = null, metadata = null) {
  const workflow = getWorkflow(id);
  if (!workflow || !workflow.steps[step]) {
    return null;
  }

  const stepRecord = workflow.steps[step];

  if (status === "running" && !stepRecord.started_at) {
    stepRecord.started_at = nowIso();
  }

  if ((status === "success" || status === "failed" || status === "skipped") && !stepRecord.started_at) {
    stepRecord.started_at = nowIso();
  }

  if (status === "success" || status === "failed" || status === "skipped") {
    stepRecord.finished_at = nowIso();
  }

  stepRecord.status = status;
  stepRecord.error = errorMessage;
  stepRecord.debug = metadata?.debug || null;
  stepRecord.provider = metadata?.provider || stepRecord.provider || null;
  stepRecord.output_url = metadata?.output_url || stepRecord.output_url || null;
  touch(workflow);
  return workflow;
}

module.exports = {
  WORKFLOW_STEPS,
  createWorkflow,
  getWorkflow,
  markStepStatus,
  mergeWorkflowOutputs,
  setWorkflowOutputs,
  setWorkflowStatus
};
