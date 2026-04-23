import { useEffect, useMemo, useRef, useState, type ChangeEvent, type KeyboardEvent as ReactKeyboardEvent, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { buildApiHeaders, buildApiUrl, detectWorkflowApiBaseIssue, ensureLocalApiProbed, getEffectiveApiBase, requiresHostedApiBase } from './apiConfig';
import { playSound } from './audioEngine';
import { generateCutoutPngBlob, type ExpressionName } from './frontendCutout';
import type { AppLanguage, SettingsState, ShortcutAction } from './types';

type SharedPageProps = {
  appSubtitle: string;
  backHome: string;
  openSettings: string;
  privacyNote: string;
  pageTitle: string;
  pageDescription: string;
  settings: SettingsState;
  language: AppLanguage;
  onBack: () => void;
  onOpenSettings: () => void;
};

type BaseLanguage = 'zh' | 'ja' | 'en' | 'ru';
type TransferStatus = 'idle' | 'running' | 'success' | 'error';
type LogLevel = 'info' | 'success' | 'error' | 'debug';

type WorkflowLog = {
  time: string;
  level: LogLevel;
  text: string;
};

type TransferError = {
  code: string;
  stage: string;
  message: string;
  hint: string;
  details: Record<string, unknown>;
};

type PaperWorkflowStepName =
  | 'validate_input'
  | 'analyze_character'
  | 'expression_thinking'
  | 'expression_surprise'
  | 'expression_angry'
  | 'cg_01'
  | 'cg_02'
  | 'cutout_expression_thinking'
  | 'cutout_expression_surprise'
  | 'cutout_expression_angry';

type PaperWorkflowStepStatus = 'queued' | 'running' | 'success' | 'failed' | 'skipped';
type PaperWorkflowStatus = 'queued' | 'running' | 'completed' | 'completed_with_errors' | 'failed';

type PaperWorkflowStep = {
  status: PaperWorkflowStepStatus;
  error: string | null;
  debug: Record<string, unknown> | null;
  provider: string | null;
  output_url: string | null;
  started_at: string | null;
  finished_at: string | null;
};

type PaperWorkflowOutputs = {
  manifest: string | null;
  meta_files: {
    character_profile: string | null;
    prompts: string | null;
    character_pack: string | null;
    p2g_handoff: string | null;
  };
  providers: {
    remove_background: string | null;
    expressions: string | null;
    cg: string | null;
  };
  expressions: {
    thinking: string | null;
    surprise: string | null;
    angry: string | null;
  };
  expression_cutouts: {
    thinking: string | null;
    surprise: string | null;
    angry: string | null;
  };
  cg_outputs: Array<string | null>;
};

type PaperPromptOverrides = {
  thinking: string;
  surprise: string;
  angry: string;
  cg01: string;
  cg02: string;
};

type PaperExecutionOptions = {
  ai_concurrency_enabled: boolean;
};

type PaperWorkflow = {
  id: string;
  status: PaperWorkflowStatus;
  current_step: string | null;
  error: string | null;
  error_details: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
  source_image?: {
    original_name?: string;
    upload_path?: string;
    mime_type?: string;
  };
  execution_options?: PaperExecutionOptions;
  steps: Partial<Record<PaperWorkflowStepName, PaperWorkflowStep>>;
  outputs: PaperWorkflowOutputs;
  prompt_overrides?: PaperPromptOverrides | null;
};

type PaperMessageType = 'info' | 'success' | 'error';

type PaperMessage = {
  type: PaperMessageType;
  text: string;
};

type StatusLabelKey = 'statusIdle' | 'statusRunning' | 'statusSuccess' | 'statusError';
type UiCopySet = {
  dirty: string;
  clean: string;
  continueEdit: string;
  confirmReturnTitle: string;
  confirmReturnDirty: string;
  confirmReturnClean: string;
  confirmReturnButton: string;
  saveDraft: string;
  saveConfig: string;
  saveDocument: string;
  reset: string;
  refreshWorkspace: string;
  refreshWorkspaceTitle: string;
  refreshWorkspaceDescription: string;
  refreshWorkspaceConfirm: string;
  copyJson: string;
  downloadJson: string;
  copyResult: string;
  copied: string;
  downloadResult: string;
  copyError: string;
  downloadError: string;
  copyDebug: string;
  downloadDebug: string;
  showDetails: string;
  hideDetails: string;
  copyText: string;
  downloadHtml: string;
  exportPack: string;
  chooseImage: string;
  replaceImage: string;
  noImage: string;
  progressTitle: string;
  resultsTitle: string;
  logsTitle: string;
  debugTitle: string;
  errorTitle: string;
  noRecentError: string;
  statusIdle: string;
  statusRunning: string;
  statusSuccess: string;
  statusError: string;
  copyLogs: string;
  downloadLogs: string;
  workflowId: string;
  promptTemplates: string;
  editorToolbar: string;
  toolbarFontGroup: string;
  toolbarStyleGroup: string;
  toolbarParagraphGroup: string;
  toolbarInsertGroup: string;
  toolbarHistoryGroup: string;
  editorHint: string;
  llmTitle: string;
  ttsTitle: string;
  exportTitle: string;
  notesTitle: string;
  operationsTitle: string;
  transfer: {
    inputTitle: string;
    paramsTitle: string;
    outputTitle: string;
    queueTitle: string;
    model: string;
    prompt: string;
    negativePrompt: string;
    temperature: string;
    topP: string;
    topK: string;
    seed: string;
    steps: string;
    strength: string;
    cfg: string;
    needCutout: string;
    keepPalette: string;
    preservePose: string;
    faceLock: string;
    detailBoost: string;
    start: string;
    stop: string;
    fileHint: string;
    resultReady: string;
    waitingResult: string;
    validationError: string;
    runtimeError: string;
    errorHintRuntime: string;
    errorHintValidation: string;
    successMessage: string;
    effectivePromptPreview: string;
    advancedParams: string;
    advancedParamsHint: string;
    aspectRatio: string;
    imageSize: string;
    styleIntensity: string;
    lineArtStyle: string;
    colorScheme: string;
    backgroundType: string;
    lightingStyle: string;
    cameraAngle: string;
    characterMood: string;
    outfitDetail: string;
    eyeStyle: string;
    hairStyle: string;
    skinTexture: string;
    addPositiveTags: string;
    addNegativeTags: string;
    redo: string;
    openDetailPanel: string;
    debugDescription: string;
  };
  imageConverter: {
    sourceTitle: string;
    settingsTitle: string;
    resultTitle: string;
    noImage: string;
    resultPlaceholder: string;
    outputFormat: string;
    quality: string;
    maxWidth: string;
    maxHeight: string;
    maintainAspect: string;
    converting: string;
    convert: string;
    download: string;
    formatLabel: string;
    qualityLabel: string;
  };
  tagPicker: {
    filterPlaceholder: string;
    close: string;
    apply: string;
  };
  errorPanel: {
    title: string;
    stage: string;
    message: string;
    hint: string;
    details: string;
    retry: string;
  };
  prompt: {
    contentTitle: string;
    templatesTitle: string;
    worldTemplate: string;
    cardTemplate: string;
    relationTemplate: string;
    speechTemplate: string;
    timelineTemplate: string;
    outlineTemplate: string;
    llmModel: string;
    llmTemp: string;
    llmTopP: string;
    llmMaxTokens: string;
    llmSystemNote: string;
    ttsVoice: string;
    ttsLanguage: string;
    ttsRate: string;
    ttsEmotion: string;
    ttsFormat: string;
    fontFamily: string;
    fontSize: string;
    blockStyle: string;
    textColor: string;
    highlightColor: string;
    clearHighlight: string;
    lineHeight: string;
    customFontButton: string;
    customFontTitle: string;
    customFontName: string;
    customFontStack: string;
    customFontApply: string;
    customInsertButton: string;
    customInsertTitle: string;
    customInsertKind: string;
    customInsertPayload: string;
    customInsertApply: string;
    customInsertCallout: string;
    customInsertDetails: string;
    customInsertImage: string;
    customInsertBadge: string;
    customInsertHtml: string;
    experimentalNote: string;
    ttsPitch: string;
    ttsVolume: string;
    ttsSampleRate: string;
    ttsReference: string;
    ttsReferenceButton: string;
    ttsReferenceHint: string;
    ttsBreathiness: string;
    ttsClarity: string;
    ttsExpressiveness: string;
    ttsSpeedVariation: string;
    ttsAdvancedParams: string;
    ttsPauseStrength: string;
    ttsToneCurve: string;
    ttsEmphasisMode: string;
    ttsToneCurveFlat: string;
    ttsToneCurveNatural: string;
    ttsToneCurveDramatic: string;
    ttsToneCurveMelodic: string;
    ttsEmphasisNormal: string;
    ttsEmphasisStrong: string;
    ttsEmphasisSubtle: string;
    ttsAudioPostProcessing: string;
    ttsNoiseReduction: string;
    ttsEqPreset: string;
    ttsCompression: string;
    ttsEqFlat: string;
    ttsEqWarm: string;
    ttsEqBright: string;
    ttsEqRadio: string;
    ttsEqClear: string;
    ttsTextPreprocessing: string;
    ttsPronunciation: string;
    ttsCustomReplacements: string;
    ttsReplacementsHint: string;
    editorReady: string;
    packageHint: string;
    exportOptionsTitle: string;
    exportOptionsHint: string;
    exportHtmlOption: string;
    exportTextOption: string;
    exportJsonOption: string;
    exportAllOption: string;
  };
  paper: {
    sourceTitle: string;
    sourceHint: string;
    settingsTitle: string;
    settingsHint: string;
    queueTitle: string;
    resultsTitle: string;
    start: string;
    starting: string;
    expressionCount: string;
    cgCount: string;
    needCutout: string;
    exportJson: string;
    resetWorkflow: string;
    resetWorkflowTitle: string;
    resetWorkflowDescription: string;
    resetWorkflowConfirm: string;
    redoWorkflow: string;
    redoCurrentResult: string;
    workflowConcurrency: string;
    workflowConcurrencyHint: string;
    hint: string;
    idleMessage: string;
    missingFile: string;
    submitted: string;
    polling: string;
    completed: string;
    completedWithErrors: string;
    failed: string;
    chooseHint: string;
    noWorkflow: string;
    noOutputs: string;
    outputsHint: string;
    manifestTitle: string;
    openManifest: string;
    openProfile: string;
    openPrompts: string;
    openCharacterPack: string;
    openP2gHandoff: string;
    openFile: string;
    downloadFile: string;
    copyAsset: string;
    downloadAll: string;
    latestError: string;
    providerCutout: string;
    providerExpressions: string;
    providerCg: string;
    sourceInfo: string;
    providerInfo: string;
    promptOverridesTitle: string;
    promptOverridesHint: string;
    logsHint: string;
    debugSummary: string;
    resultSummary: string;
    networkStartError: string;
    networkFetchError: string;
    hostedApiRequired: string;
    apiWrongEndpoint: string;
    apiWrongEndpointHint: string;
    backendResponseLabel: string;
    requestUrlLabel: string;
  };
};

const STYLE_TRANSFER_STORAGE_KEY = 'oc-maker.style-transfer';
const PROMPT_SUITE_STORAGE_KEY = 'oc-maker.prompt-suite';
const PAPER2GAL_STORAGE_KEY = 'oc-maker.paper2gal';
const IMAGE_CONVERTER_STORAGE_KEY = 'oc-maker.image-converter';
const PAPER_POLL_INTERVAL_MS = 1000;

// ─── Style Transfer Tag Libraries ───
const STYLE_TAG_CATEGORIES = [
  {
    name: 'Modern Anime Style',
    tags: ['modern anime style', 'contemporary illustration', 'digital painting', 'cel-shaded', 'soft shading', 'clean line art', 'anime screencap', 'TV anime style', 'webtoon style', 'manhwa art style'],
  },
  {
    name: 'Galgame / Visual Novel',
    tags: ['visual novel art', 'galgame character design', 'eroge style', 'bishoujo', 'moe art style', 'dating sim art', 'otome game style', 'renpy visual novel', 'ADV game art', 'nakige art style'],
  },
  {
    name: 'Game Character Types',
    tags: ['RPG protagonist', 'fantasy hero', 'school uniform', 'battle outfit', 'casual wear', 'magical girl', 'mecha pilot suit', 'maid outfit', 'gothic lolita', 'kimono traditional', 'sportswear', 'swimsuit', 'wedding dress', 'idol costume', 'knight armor'],
  },
  {
    name: 'Art Style / Rendering',
    tags: ['watercolor anime', 'oil painting style', 'pastel colors', 'neon palette', 'monochrome', 'sepia tone', 'sketch style', 'ink wash painting', 'chibi style', 'semi-realistic', 'pixiv trending', 'twitter illustration', 'doujinshi art', 'concept art', 'key visual'],
  },
  {
    name: 'Color Schemes',
    tags: ['vibrant colors', 'muted earth tones', 'cool blue palette', 'warm sunset colors', 'pastel pink', 'cyberpunk neon', 'autumn colors', 'winter cool tones', 'spring pastel', 'summer bright', 'metallic silver', 'gold accents', 'iridescent', 'holographic', 'gradient hair'],
  },
  {
    name: 'Lighting Effects',
    tags: ['dramatic lighting', 'rim light', 'ambient occlusion', 'volumetric light', 'sunset glow', 'moonlight', 'candlelight', 'neon reflection', 'god rays', 'bloom effect', 'lens flare', 'soft diffused light', 'high contrast chiaroscuro', 'backlight silhouette', 'underwater caustics'],
  },
  {
    name: 'Backgrounds',
    tags: ['simple white background', 'gradient background', 'starry sky', 'cityscape night', 'classroom', 'bedroom interior', 'fantasy landscape', 'cherry blossom park', 'beach sunset', 'rainy street', 'space station', 'medieval castle', 'japanese shrine', 'cafe interior', 'flower field'],
  },
  {
    name: 'Character Details',
    tags: ['detailed eyes', 'sparkling pupils', 'heterochromia', 'flowing hair', 'ahoge', 'twin tails', 'ponytail', 'bob cut', 'long straight hair', 'wavy hair', 'freckles', 'blush stickers', 'beauty mark', 'elf ears', 'animal ears', 'horns', 'wings', 'tail', 'glasses', 'eyepatch'],
  },
  {
    name: 'Fashion / Outfit',
    tags: ['frilly dress', 'leather jacket', 'sailor uniform', 'hoodie', 'yukata', 'qipao', 'business suit', 'nurse uniform', 'police uniform', 'witch hat', 'cape', 'scarf', 'fingerless gloves', 'thigh-high socks', 'knee-high boots', 'sneakers', 'platform shoes', 'choker', 'hair ribbon', 'hairpin'],
  },
  {
    name: 'Expression / Pose',
    tags: ['gentle smile', 'tsundere pout', 'confident grin', 'shy blush', 'surprised open mouth', 'serious expression', 'sleepy eyes', 'winking', 'peace sign', 'hand on cheek', 'crossed arms', 'hands behind back', 'sitting pose', 'leaning forward', 'dynamic action pose', 'floating pose', 'kneeling', 'lying down', 'walking', 'running'],
  },
  {
    name: 'Camera / Composition',
    tags: ['close-up portrait', 'bust shot', 'half body', 'full body', 'Dutch angle', 'bird eye view', 'worm eye view', 'over-the-shoulder', 'profile view', 'three-quarter view', 'symmetrical composition', 'rule of thirds', 'shallow depth of field', 'bokeh background', 'split composition'],
  },
] as const;

const NEGATIVE_TAG_CATEGORIES = [
  {
    name: 'Low Quality',
    tags: ['lowres', 'worst quality', 'low quality', 'normal quality', 'jpeg artifacts', 'compression artifacts', 'pixelated', 'noisy', 'grainy', 'banding'],
  },
  {
    name: 'Anatomy Errors',
    tags: ['bad anatomy', 'bad proportions', 'extra limbs', 'missing limbs', 'floating limbs', 'disconnected limbs', 'malformed limbs', 'amputee', 'fused body parts', 'conjoined'],
  },
  {
    name: 'Face Errors',
    tags: ['bad face', 'asymmetrical eyes', 'crossed eyes', 'mismatched pupils', 'long neck', 'no nose', 'no mouth', 'no ears', 'mutated face', 'uncanny valley'],
  },
  {
    name: 'Hand Errors',
    tags: ['bad hands', 'missing fingers', 'extra fingers', 'fused fingers', 'mutated hands', 'too many fingers', 'too few fingers', 'deformed hands', 'claw hands', 'blob hands'],
  },
  {
    name: 'Body Errors',
    tags: ['deformed', 'disfigured', 'malformed', 'mutation', 'gross', 'ugly', 'fat', 'skinny', 'hunchback', 'twisted torso'],
  },
  {
    name: 'Color Issues',
    tags: ['muddy colors', 'oversaturated', 'washed out', 'color bleed', 'color banding', 'clashing colors', 'neon vomit', 'grayish', 'sepia wash', 'desaturated'],
  },
  {
    name: 'Image Quality',
    tags: ['blurry', 'out of focus', 'motion blur', 'chromatic aberration', 'scan lines', 'interlaced', 'watermark', 'signature', 'text', 'logo', 'username', 'artist name'],
  },
  {
    name: 'Composition Issues',
    tags: ['cropped', 'out of frame', 'bad framing', 'tilted horizon', 'too much headroom', 'cut off head', 'cut off feet', 'awkward pose', 'stiff pose', 'unnatural pose'],
  },
  {
    name: 'Rendering Errors',
    tags: ['z-fighting', 'texture seam', 'light leak', 'shadow acne', 'floating object', 'clipping', 'invisible wall', ' LOD pop-in', 'T-posing', 'rigging error'],
  },
  {
    name: 'Content Issues',
    tags: ['duplicate', 'multiple views', 'collage', 'border', 'frame', 'panel lines', 'speech bubble', 'narration box', 'UI elements', 'HUD overlay'],
  },
] as const;

function buildInvisiblePromptSuffix(cfg: Record<string, unknown>): string {
  const parts: string[] = [];
  const push = (key: string, label: string) => {
    const val = cfg[key];
    if (val !== undefined && val !== '' && val !== false && val !== 'default') {
      parts.push(`${label}: ${val}`);
    }
  };
  push('aspectRatio', 'aspect ratio');
  push('imageSize', 'image size');
  push('styleIntensity', 'style intensity');
  push('lineArtStyle', 'line art');
  push('colorScheme', 'color scheme');
  push('backgroundType', 'background');
  push('lightingStyle', 'lighting');
  push('cameraAngle', 'camera angle');
  push('characterMood', 'mood');
  push('outfitDetail', 'outfit');
  push('eyeStyle', 'eyes');
  push('hairStyle', 'hair');
  push('skinTexture', 'skin');
  return parts.join(', ');
}

function createDefaultPaperPromptOverrides(): PaperPromptOverrides {
  return {
    thinking: '严格保持参考图里角色的特征，同时角色的姿势不变，只把表情调整成思考状态。图片背景纯白，竖屏的比例',
    surprise: '严格保持参考图里角色的特征，同时角色的姿势不变，只把表情调整成惊讶状态。图片背景纯白，竖屏的比例',
    angry: '严格保持参考图里角色的特征，同时角色的姿势不变，只把表情调整成微微生气的状态。图片背景纯白，竖屏的比例',
    cg01: '基于参考图中的同一角色生成单人 CG 场景。角色整体画风必须完全一致，只允许变化场景、镜头、姿势和表情，场景随机生成，尽量柔和，禁止新增其他人物。图片横屏的比例',
    cg02: '基于参考图中的同一角色生成单人 CG 场景。角色整体画风必须完全一致，只允许变化场景、镜头、姿势和表情，场景随机生成，尽量柔和，禁止新增其他人物。图片横屏的比例',
  };
}

const LEGACY_PAPER_PROMPT_OVERRIDES: PaperPromptOverrides = {
  thinking: '不改人物的任何特征和动作，只修改人物的表情到思考表情，其他地方均不变',
  surprise: '不改人物的任何特征和动作，只修改人物的表情到惊讶表情，其他地方均不变',
  angry: '不改人物的任何特征和动作，只修改人物的表情到微微生气表情，其他地方均不变',
  cg01: '自行构思一个柔和的结束cg场景，场景地点为随机，只允许修改人物的动作和表情，角色本身绝对不能变，不能新增其他人物',
  cg02: '自行构思一个柔和的结束cg场景，场景地点为随机，只允许修改人物的动作和表情，角色本身绝对不能变，不能新增其他人物',
};

const PREVIOUS_PAPER_PROMPT_OVERRIDES: PaperPromptOverrides = {
  thinking: '严格保持参考图里同一角色的身份、脸型、耳朵、发型、服装、饰品、体型、配色和姿势不变，只把表情调整成自然、克制的思考状态。图片背景纯白，竖屏的比例',
  surprise: '严格保持参考图里同一角色的身份、脸型、耳朵、发型、服装、饰品、体型、配色和姿势不变，只把表情调整成轻度、自然的惊讶状态。图片背景纯白，竖屏的比例',
  angry: '严格保持参考图里同一角色的身份、脸型、耳朵、发型、服装、饰品、体型、配色和姿势不变，只把表情调整成轻微生气、压着情绪的状态，不要夸张暴怒。图片背景纯白，竖屏的比例',
  cg01: '基于参考图中的同一角色生成新的单人原创 CG 场景。角色身份、发型、服装、配色、耳朵、饰品和整体画风必须完全一致，只允许变化场景、镜头、姿势和表情，场景由 AI 自行构思，禁止新增其他人物。图片横屏的比例',
  cg02: '基于参考图中的同一角色生成另一张新的单人原创 CG 场景。角色身份、发型、服装、配色、耳朵、饰品和整体画风必须完全一致，只允许变化场景、镜头、姿势和表情，场景由 AI 自行构思，禁止新增其他人物。图片横屏的比例',
};

function migratePaperPromptOverrides(value: Partial<PaperPromptOverrides> | null | undefined) {
  if (!value) {
    return createDefaultPaperPromptOverrides();
  }

  const defaults = createDefaultPaperPromptOverrides();
  return {
    thinking:
      value.thinking === LEGACY_PAPER_PROMPT_OVERRIDES.thinking || value.thinking === PREVIOUS_PAPER_PROMPT_OVERRIDES.thinking
        ? defaults.thinking
        : value.thinking || defaults.thinking,
    surprise:
      value.surprise === LEGACY_PAPER_PROMPT_OVERRIDES.surprise || value.surprise === PREVIOUS_PAPER_PROMPT_OVERRIDES.surprise
        ? defaults.surprise
        : value.surprise || defaults.surprise,
    angry:
      value.angry === LEGACY_PAPER_PROMPT_OVERRIDES.angry || value.angry === PREVIOUS_PAPER_PROMPT_OVERRIDES.angry
        ? defaults.angry
        : value.angry || defaults.angry,
    cg01:
      value.cg01 === LEGACY_PAPER_PROMPT_OVERRIDES.cg01 || value.cg01 === PREVIOUS_PAPER_PROMPT_OVERRIDES.cg01
        ? defaults.cg01
        : value.cg01 || defaults.cg01,
    cg02:
      value.cg02 === LEGACY_PAPER_PROMPT_OVERRIDES.cg02 || value.cg02 === PREVIOUS_PAPER_PROMPT_OVERRIDES.cg02
        ? defaults.cg02
        : value.cg02 || defaults.cg02,
  };
}

const PAPER_STEP_ORDER: PaperWorkflowStepName[] = [
  'validate_input',
  'analyze_character',
  'expression_thinking',
  'expression_surprise',
  'expression_angry',
  'cg_01',
  'cg_02',
  'cutout_expression_thinking',
  'cutout_expression_surprise',
  'cutout_expression_angry',
];

const uiCopy: Record<BaseLanguage, UiCopySet> = {
  zh: {
    dirty: '未保存',
    clean: '已保存',
    continueEdit: '继续编辑',
    confirmReturnTitle: '确定返回首页吗？',
    confirmReturnDirty: '你还没保存当前页面内容，返回后未保存的调整不会保留。',
    confirmReturnClean: '当前页面内容已经保存，返回首页后可以稍后继续处理。',
    confirmReturnButton: '确认返回',
    saveDraft: '保存草稿',
    saveConfig: '保存配置',
    saveDocument: '保存文档',
    reset: '重置',
    refreshWorkspace: '重刷',
    refreshWorkspaceTitle: '确定重刷当前页面吗？',
    refreshWorkspaceDescription: '这会清空当前页面的输入、结果和暂存内容，让页面回到初始状态。',
    refreshWorkspaceConfirm: '确认重刷',
    copyJson: '复制 JSON',
    downloadJson: '下载 JSON',
    copyResult: '复制结果',
    copied: '已复制',
    downloadResult: '下载结果',
    copyError: '复制错误',
    downloadError: '下载错误',
    copyDebug: '复制调试 JSON',
    downloadDebug: '下载调试 JSON',
    showDetails: '展开详情',
    hideDetails: '收起详情',
    copyText: '复制文本',
    downloadHtml: '下载 HTML',
    exportPack: '导出封装包',
    chooseImage: '选择图片文件',
    replaceImage: '更换图片',
    noImage: '当前还没有选择输入图片。',
    progressTitle: '工作流进度',
    resultsTitle: '结果与调试',
    logsTitle: '详细日志',
    debugTitle: '调试 JSON',
    errorTitle: '错误信息',
    noRecentError: '当前没有新的错误。只有在步骤失败时，错误详情才会自动展开。',
    statusIdle: '待机',
    statusRunning: '运行中',
    statusSuccess: '完成',
    statusError: '失败',
    copyLogs: '复制日志',
    downloadLogs: '下载日志',
    workflowId: '工作流 ID',
    promptTemplates: '设卡模板',
    editorToolbar: '文档工具栏',
    toolbarFontGroup: '字体',
    toolbarStyleGroup: '文字样式',
    toolbarParagraphGroup: '段落',
    toolbarInsertGroup: '插入',
    toolbarHistoryGroup: '历史',
    editorHint: '这里的文档内容会作为 OC 世界观、角色设卡和后续封装输入的主编辑区。',
    llmTitle: 'LLM 封装',
    ttsTitle: 'TTS 封装',
    exportTitle: '导出与封装',
    notesTitle: '系统备注',
    operationsTitle: '操作开关',
    transfer: {
      inputTitle: '输入图片与预览',
      paramsTitle: 'AI 参数设置',
      outputTitle: '结果概览',
      queueTitle: '执行状态',
      model: '模型',
      prompt: '风格提示词',
      negativePrompt: '负面提示词',
      temperature: 'Temperature',
      topP: 'Top P',
      topK: 'Top K',
      seed: 'Seed',
      steps: '采样步数',
      strength: '风格强度',
      cfg: 'CFG Scale',
      needCutout: '需要抠图',
      keepPalette: '保留原配色',
      preservePose: '保留姿态',
      faceLock: '锁定五官',
      detailBoost: '细节增强',
      start: '开始转画风',
      stop: '中止任务',
      fileHint: '支持 PNG / JPG / WEBP，建议上传单人立绘或清晰半身图。',
      resultReady: '结果已经生成，可以复制、下载或导出调试数据。',
      waitingResult: '运行完成后，这里会显示结果信息、错误信息和调试 JSON。',
      validationError: '未检测到输入图片文件，已在预检查阶段停止工作流。',
      runtimeError: '风格采样在高随机参数下发生发散，已终止输出并保留完整调试信息。',
      errorHintRuntime: '降低 Temperature、减小 Top P，或在重试前关闭部分较重的保留开关。',
      errorHintValidation: '在运行转画风工作流前先选择一张源图片。',
      successMessage: '风格转换成功完成，输出元数据和调试包已经生成。',
      effectivePromptPreview: '实际 Prompt 预览',
      advancedParams: '高级参数',
      advancedParamsHint: '宽高比、光照、镜头角度、情绪、服装等',
      aspectRatio: '宽高比',
      imageSize: '图像尺寸',
      styleIntensity: '风格强度',
      lineArtStyle: '线稿风格',
      colorScheme: '配色方案',
      backgroundType: '背景类型',
      lightingStyle: '光照风格',
      cameraAngle: '镜头角度',
      characterMood: '角色情绪',
      outfitDetail: '服装细节',
      eyeStyle: '眼睛风格',
      hairStyle: '发型',
      skinTexture: '皮肤质感',
      addPositiveTags: '+ 正面标签',
      addNegativeTags: '+ 负面标签',
      redo: '重做',
      openDetailPanel: '打开详情面板',
      debugDescription: '队列追踪、参数快照、日志、结果载荷和最新错误包均汇总于此。',
    },
    imageConverter: {
      sourceTitle: '源图片',
      settingsTitle: '格式设置',
      resultTitle: '结果预览',
      noImage: '当前还没有选择输入图片。',
      resultPlaceholder: '转换结果将显示在这里',
      outputFormat: '输出格式',
      quality: '质量',
      maxWidth: '最大宽度 (px)',
      maxHeight: '最大高度 (px)',
      maintainAspect: '保持宽高比',
      converting: '转换中...',
      convert: '转换',
      download: '下载',
      formatLabel: '格式',
      qualityLabel: '质量',
    },
    tagPicker: {
      filterPlaceholder: '筛选标签...',
      close: '关闭',
      apply: '应用',
    },
    errorPanel: {
      title: '错误详情',
      stage: '阶段',
      message: '消息',
      hint: '提示',
      details: '详情',
      retry: '重试',
    },
    prompt: {
      contentTitle: 'OC 设卡编辑',
      templatesTitle: '快速模板',
      worldTemplate: 'OC 世界观',
      cardTemplate: '角色设卡',
      relationTemplate: '关系网络',
      speechTemplate: '语音设定',
      timelineTemplate: '时间线',
      outlineTemplate: '阵营 / 组织',
      llmModel: 'LLM 模型',
      llmTemp: 'Temperature',
      llmTopP: 'Top P',
      llmMaxTokens: 'Max Tokens',
      llmSystemNote: '系统提示词',
      ttsVoice: '语音角色',
      ttsLanguage: '语音语言',
      ttsRate: '语速',
      ttsEmotion: '情绪标签',
      ttsFormat: '导出格式',
      fontFamily: '字体',
      fontSize: '字号',
      blockStyle: '段落样式',
      textColor: '文字颜色',
      highlightColor: '高亮颜色',
      clearHighlight: '清除高亮',
      lineHeight: '行距',
      customFontButton: '自定义字体',
      customFontTitle: '添加自定义字体',
      customFontName: '字体名称',
      customFontStack: '字体栈 / CSS 字体名',
      customFontApply: '应用字体',
      customInsertButton: '自定义插入',
      customInsertTitle: '添加自定义插入块',
      customInsertKind: '插入类型',
      customInsertPayload: '插入内容',
      customInsertApply: '插入到文档',
      customInsertCallout: '提示块',
      customInsertDetails: '折叠详情',
      customInsertImage: '图片链接',
      customInsertBadge: '标签块',
      customInsertHtml: '自定义 HTML',
      experimentalNote: '自定义文本是试验性设置，请谨慎操作，可能会造成字体无法导出或无法识别的情况。',
      ttsPitch: '音高',
      ttsVolume: '音量',
      ttsSampleRate: '采样率',
      ttsReference: '参考音频',
      ttsReferenceButton: '选择参考音频',
      ttsReferenceHint: '可选择一段参考音频，帮助后续 TTS 保持更稳定的音色方向。',
      ttsBreathiness: '气息感',
      ttsClarity: '清晰度',
      ttsExpressiveness: '表现力',
      ttsSpeedVariation: '语速变化',
      ttsAdvancedParams: '高级参数',
      ttsPauseStrength: '停顿强度',
      ttsToneCurve: '语调曲线',
      ttsEmphasisMode: '强调模式',
      ttsToneCurveFlat: '平直',
      ttsToneCurveNatural: '自然',
      ttsToneCurveDramatic: '戏剧化',
      ttsToneCurveMelodic: '旋律化',
      ttsEmphasisNormal: '正常',
      ttsEmphasisStrong: '强烈',
      ttsEmphasisSubtle: '微妙',
      ttsAudioPostProcessing: '音频后处理',
      ttsNoiseReduction: '降噪强度',
      ttsEqPreset: 'EQ 预设',
      ttsCompression: '压缩强度',
      ttsEqFlat: '平直',
      ttsEqWarm: '温暖',
      ttsEqBright: '明亮',
      ttsEqRadio: '广播',
      ttsEqClear: '清晰',
      ttsTextPreprocessing: '文本预处理',
      ttsPronunciation: '发音精校',
      ttsCustomReplacements: '自定义替换',
      ttsReplacementsHint: '每行一条，格式：原文=替换，例如：你好=您好',
      editorReady: '文档、配置和封装信息会一起进入导出包。',
      packageHint: '可以导出 HTML 文档、纯文本副本和一份完整的封装 JSON。',
      exportOptionsTitle: '导出格式',
      exportOptionsHint: '选择你现在要导出的格式。可以单独导出，也可以一次打包导出常用格式。',
      exportHtmlOption: '导出 HTML',
      exportTextOption: '导出纯文本',
      exportJsonOption: '导出封装 JSON',
      exportAllOption: '全部导出',
    },
    paper: {
      sourceTitle: '素材输入',
      sourceHint: '上传一张无背景的角色图，系统会按 p2g-character-workflow 的步骤生成角色理解、表情、CG 和透明底素材。',
      settingsTitle: '输出设置',
      settingsHint: '当前接入的是接入 ocmaker 的 paper2gal 工作流，输出数量和步骤顺序由后端工作流统一管理。',
      queueTitle: '执行控制台',
      resultsTitle: '结果与调试',
      start: '开始生成',
      starting: '正在启动...',
      resetWorkflow: '重刷',
      resetWorkflowTitle: '确定重刷当前工作流吗？',
      resetWorkflowDescription: '这会清空当前的工作流状态、输入文件名和当前页面里的 paper2gal 内容，让页面回到初始状态。',
      resetWorkflowConfirm: '确认重刷',
      redoWorkflow: '重做当前结果',
      redoCurrentResult: '重做当前结果',
      workflowConcurrency: '工作流并发',
      workflowConcurrencyHint: '默认开启表达图、CG 和抠图并行。关闭后会按顺序一个一个生成。',
      expressionCount: '表情版本数',
      cgCount: 'CG 场景数',
      needCutout: '最后执行抠图',
      exportJson: '导出工作流 JSON',
      hint: '这里显示当前工作流的请求参数、状态快照、结果入口和调试包。',
      idleMessage: '上传一张角色图开始 paper2gal 工作流。',
      missingFile: '还没有选择输入图片，无法启动 paper2gal 工作流。',
      submitted: '工作流已提交，结果会在每一步完成后逐步出现。',
      polling: '正在同步最新状态，请稍候。',
      completed: 'paper2gal 工作流已完成。',
      completedWithErrors: '工作流已结束，但部分步骤失败或被跳过。',
      failed: '工作流执行失败，请查看错误信息和调试 JSON。',
      chooseHint: '支持 PNG / JPG / WEBP，建议上传单人无背景立绘或清晰半身图。',
      noWorkflow: '还没有开始任何 paper2gal 工作流。',
      noOutputs: '暂无输出，步骤一旦成功就会立即显示。',
      outputsHint: '每一步成功后会立刻出现在这里，不用等整条流程结束。',
      manifestTitle: '结果清单',
      openManifest: '打开 manifest.json',
      openProfile: '打开 character-profile.json',
      openPrompts: '打开 prompts.json',
      openCharacterPack: '打开 character-pack.json',
      openP2gHandoff: '打开 p2g-handoff.json',
      openFile: '打开文件',
      downloadFile: '下载',
      copyAsset: '复制',
      downloadAll: '下载全部',
      latestError: '最近错误',
      providerCutout: '抠图',
      providerExpressions: '表情',
      providerCg: 'CG',
      sourceInfo: '输入信息',
      providerInfo: '执行通道',
      promptOverridesTitle: 'Prompt 自定义',
      promptOverridesHint: '下面公开当前 workflow 会使用的每一步 Prompt。你可以手动修改后再启动或重做，让角色特征保持得更稳定。',
      logsHint: '日志默认收起。需要排查时再展开，出错时也会保留完整步骤记录。',
      debugSummary: '这里会收集 workflow 快照、错误详情、provider 返回和当前接口配置，方便直接排查问题。',
      resultSummary: 'manifest、角色理解文件、prompts、character pack 和 p2g handoff 都会在这里集中展示。',
      networkStartError: '无法启动工作流：前端没有拿到后端响应。请确认后端已运行，并检查设置里的 API 地址。',
      networkFetchError: '无法获取最新工作流状态：请求没有到达后端。请检查本地服务、代理配置或浏览器控制台。',
      hostedApiRequired: '当前页面部署在静态站点上。请先在设置 -> 接口 中填写后端 API 地址，再启动 paper2gal 工作流。',
      apiWrongEndpoint: '你当前填写的是模型推理接口，不是 paper2gal 工作流后端根地址。',
      apiWrongEndpointHint:
        '这里需要填写后端根地址，例如 https://your-backend.example.com。前端会自动请求 /api/workflows，请不要填写 /v1/chat/completions、/v1/responses 这类模型接口。',
      backendResponseLabel: '后端返回',
      requestUrlLabel: '当前请求地址',
    },
  },
  ja: {
    dirty: '未保存',
    clean: '保存済み',
    continueEdit: '編集を続ける',
    confirmReturnTitle: 'ホームに戻りますか？',
    confirmReturnDirty: '現在のページ内容はまだ保存されていません。戻ると未保存の変更は失われます。',
    confirmReturnClean: '現在の内容は保存済みです。ホームに戻って後で続けられます。',
    confirmReturnButton: '戻る',
    saveDraft: '下書きを保存',
    saveConfig: '設定を保存',
    saveDocument: '文書を保存',
    reset: 'リセット',
    refreshWorkspace: '再初期化',
    refreshWorkspaceTitle: '現在のページをリセットしますか？',
    refreshWorkspaceDescription: 'このページの入力、結果、ローカル一時状態を消去して、初期状態に戻します。',
    refreshWorkspaceConfirm: 'リセットする',
    copyJson: 'JSON をコピー',
    downloadJson: 'JSON を保存',
    copyResult: '結果をコピー',
    copied: 'コピー済み',
    downloadResult: '結果を保存',
    copyError: 'エラーをコピー',
    downloadError: 'エラーを保存',
    copyDebug: 'デバッグ JSON をコピー',
    downloadDebug: 'デバッグ JSON を保存',
    showDetails: '詳細を開く',
    hideDetails: '詳細を閉じる',
    copyText: 'テキストをコピー',
    downloadHtml: 'HTML を保存',
    exportPack: '封装パックを書き出す',
    chooseImage: '画像ファイルを選択',
    replaceImage: '画像を差し替え',
    noImage: '入力画像はまだ選択されていません。',
    progressTitle: 'ワークフロー進捗',
    resultsTitle: '結果とデバッグ',
    logsTitle: '詳細ログ',
    debugTitle: 'デバッグ JSON',
    errorTitle: 'エラー情報',
    noRecentError: '現在は新しいエラーがありません。ステップ失敗時のみエラー詳細が自動展開されます。',
    statusIdle: '待機中',
    statusRunning: '実行中',
    statusSuccess: '完了',
    statusError: '失敗',
    copyLogs: 'ログをコピー',
    downloadLogs: 'ログを保存',
    workflowId: 'ワークフロー ID',
    promptTemplates: 'テンプレート',
    editorToolbar: '文書ツールバー',
    toolbarFontGroup: 'フォント',
    toolbarStyleGroup: '文字スタイル',
    toolbarParagraphGroup: '段落',
    toolbarInsertGroup: '挿入',
    toolbarHistoryGroup: '履歴',
    editorHint: 'ここで編集した文書は、OC 世界観やキャラクター設定、後続封装の元データとして使われます。',
    llmTitle: 'LLM 封装',
    ttsTitle: 'TTS 封装',
    exportTitle: '書き出しと封装',
    notesTitle: 'システムメモ',
    operationsTitle: '処理オプション',
    transfer: {
      inputTitle: '入力画像とプレビュー',
      paramsTitle: 'AI パラメータ設定',
      outputTitle: '結果概要',
      queueTitle: '実行状態',
      model: 'モデル',
      prompt: 'スタイル Prompt',
      negativePrompt: 'ネガティブ Prompt',
      temperature: 'Temperature',
      topP: 'Top P',
      topK: 'Top K',
      seed: 'Seed',
      steps: 'サンプリング数',
      strength: 'スタイル強度',
      cfg: 'CFG Scale',
      needCutout: '切り抜きを実行',
      keepPalette: '元の配色を維持',
      preservePose: 'ポーズを維持',
      faceLock: '顔パーツを固定',
      detailBoost: 'ディテール補強',
      start: '画風変換を開始',
      stop: 'タスクを中止',
      fileHint: 'PNG / JPG / WEBP 対応。単体キャラ立ち絵や鮮明な半身図を推奨します。',
      resultReady: '結果が生成されました。コピー、保存、デバッグデータの出力が可能です。',
      waitingResult: '完了後にここへ結果、エラー情報、デバッグ JSON が表示されます。',
      validationError: '入力画像が見つからないため、事前チェック段階で処理を停止しました。',
      runtimeError: '高ランダム設定のためサンプリングが発散し、出力を停止して完全なデバッグ情報を保持しました。',
      successMessage: '画風変換が正常に完了し、出力メタデータとデバッグパックを生成しました。',
      effectivePromptPreview: '実際の Prompt プレビュー',
      advancedParams: '詳細パラメータ',
      advancedParamsHint: 'アスペクト比、照明、カメラ角度、感情、服装など',
      aspectRatio: 'アスペクト比',
      imageSize: '画像サイズ',
      styleIntensity: 'スタイル強度',
      lineArtStyle: '線画スタイル',
      colorScheme: 'カラースキーム',
      backgroundType: '背景タイプ',
      lightingStyle: '照明スタイル',
      cameraAngle: 'カメラ角度',
      characterMood: 'キャラ感情',
      outfitDetail: '服装詳細',
      eyeStyle: '目のスタイル',
      hairStyle: '髪型',
      skinTexture: '肌質感',
      addPositiveTags: '+ ポジティブタグ',
      addNegativeTags: '+ ネガティブタグ',
      redo: 'やり直し',
      openDetailPanel: '詳細パネルを開く',
      errorHintRuntime: 'Temperature を下げ、Top P を小さくするか、再試行前に一部の重い保存スイッチをオフにしてください。',
      errorHintValidation: '画風変換ワークフローを実行する前にソース画像を選択してください。',
      debugDescription: 'キュートレース、パラメータスナップショット、ログ、結果ペイロード、最新のエラーパッケージがここにまとめられています。',
    },
    imageConverter: {
      sourceTitle: 'ソース画像',
      settingsTitle: 'フォーマット設定',
      resultTitle: '結果プレビュー',
      noImage: '入力画像が選択されていません。',
      resultPlaceholder: '変換結果がここに表示されます',
      outputFormat: '出力フォーマット',
      quality: '品質',
      maxWidth: '最大幅 (px)',
      maxHeight: '最大高さ (px)',
      maintainAspect: 'アスペクト比を維持',
      converting: '変換中...',
      convert: '変換',
      download: 'ダウンロード',
      formatLabel: 'フォーマット',
      qualityLabel: '品質',
    },
    tagPicker: {
      filterPlaceholder: 'タグを絞り込む...',
      close: '閉じる',
      apply: '適用',
    },
    errorPanel: {
      title: 'エラー詳細',
      stage: 'ステージ',
      message: 'メッセージ',
      hint: 'ヒント',
      details: '詳細',
      retry: '再試行',
    },
    prompt: {
      contentTitle: 'OC 設定エディタ',
      templatesTitle: 'クイックテンプレート',
      worldTemplate: 'OC 世界観',
      cardTemplate: 'キャラ設定表',
      relationTemplate: '関係ネットワーク',
      speechTemplate: '音声設定',
      timelineTemplate: 'タイムライン',
      outlineTemplate: '陣営 / 組織',
      llmModel: 'LLM モデル',
      llmTemp: 'Temperature',
      llmTopP: 'Top P',
      llmMaxTokens: 'Max Tokens',
      llmSystemNote: 'システム Prompt',
      ttsVoice: '音声キャラ',
      ttsLanguage: '音声言語',
      ttsRate: '話速',
      ttsEmotion: '感情タグ',
      ttsFormat: '出力形式',
      fontFamily: 'フォント',
      fontSize: '文字サイズ',
      blockStyle: '段落スタイル',
      textColor: '文字色',
      highlightColor: 'ハイライト',
      clearHighlight: 'ハイライト解除',
      lineHeight: '行間',
      customFontButton: 'カスタムフォント',
      customFontTitle: 'カスタムフォントを追加',
      customFontName: 'フォント名',
      customFontStack: 'フォントスタック / CSS フォント名',
      customFontApply: 'フォントを適用',
      customInsertButton: 'カスタム挿入',
      customInsertTitle: 'カスタム挿入ブロックを追加',
      customInsertKind: '挿入タイプ',
      customInsertPayload: '挿入内容',
      customInsertApply: '文書へ挿入',
      customInsertCallout: 'コールアウト',
      customInsertDetails: '折りたたみ詳細',
      customInsertImage: '画像リンク',
      customInsertBadge: 'バッジ',
      customInsertHtml: 'カスタム HTML',
      experimentalNote: 'カスタム文字設定は実験的機能です。慎重に利用してください。フォントが書き出せない、認識されない場合があります。',
      ttsPitch: 'ピッチ',
      ttsVolume: '音量',
      ttsSampleRate: 'サンプルレート',
      ttsReference: '参照音声',
      ttsReferenceButton: '参照音声を選択',
      ttsReferenceHint: '後続の TTS 音色方向を安定させるため、参照音声を 1 本紐づけられます。',
      ttsBreathiness: '息の質感',
      ttsClarity: '明瞭度',
      ttsExpressiveness: '表現力',
      ttsSpeedVariation: '速度変化',
      ttsAdvancedParams: '詳細パラメータ',
      ttsPauseStrength: '休止強度',
      ttsToneCurve: 'トーンカーブ',
      ttsEmphasisMode: '強調モード',
      ttsToneCurveFlat: 'フラット',
      ttsToneCurveNatural: 'ナチュラル',
      ttsToneCurveDramatic: 'ドラマチック',
      ttsToneCurveMelodic: 'メロディック',
      ttsEmphasisNormal: '通常',
      ttsEmphasisStrong: '強い',
      ttsEmphasisSubtle: '繊細',
      ttsAudioPostProcessing: '音声後処理',
      ttsNoiseReduction: 'ノイズ低減',
      ttsEqPreset: 'EQ プリセット',
      ttsCompression: 'コンプレッション',
      ttsEqFlat: 'フラット',
      ttsEqWarm: 'ウォーム',
      ttsEqBright: 'ブライト',
      ttsEqRadio: 'ラジオ',
      ttsEqClear: 'クリア',
      ttsTextPreprocessing: 'テキスト前処理',
      ttsPronunciation: '発音調整',
      ttsCustomReplacements: 'カスタム置換',
      ttsReplacementsHint: '1 行 1 件、形式：原文=置換、例：こんにちは=您好',
      editorReady: '文書、設定、封装情報はまとめて出力パックに含まれます。',
      packageHint: 'HTML 文書、プレーンテキスト、副次 JSON パックを書き出せます。',
      exportOptionsTitle: '書き出し形式',
      exportOptionsHint: '今すぐ書き出したい形式を選んでください。単体書き出しにも一括書き出しにも対応します。',
      exportHtmlOption: 'HTML を書き出す',
      exportTextOption: 'プレーンテキストを書き出す',
      exportJsonOption: '封装 JSON を書き出す',
      exportAllOption: '全部書き出す',
    },
    paper: {
      sourceTitle: '素材入力',
      sourceHint: '背景なしのキャラクター画像を 1 枚アップロードすると、p2g-character-workflow の手順に沿ってキャラクター理解、表情、CG、透過素材を順に生成します。',
      settingsTitle: '出力設定',
      settingsHint: '現在は ocmaker 接続用の paper2gal ワークフローに接続されており、出力数とステップ順はバックエンド側で統一管理されています。',
      queueTitle: '実行コンソール',
      resultsTitle: '結果とデバッグ',
      start: '生成開始',
      starting: '開始中...',
      resetWorkflow: '再初期化',
      resetWorkflowTitle: '現在の workflow をリセットしますか？',
      resetWorkflowDescription: '現在の workflow 状態、入力ファイル名、このページ内の paper2gal 内容を消去し、初期状態へ戻します。',
      resetWorkflowConfirm: 'リセットする',
      redoWorkflow: '結果を再生成',
      redoCurrentResult: 'この結果を再生成',
      workflowConcurrency: 'workflow 並列実行',
      workflowConcurrencyHint: '既定では表情、CG、切り抜きを並列実行します。オフにすると 1 つずつ順番に生成します。',
      expressionCount: '表情バージョン数',
      cgCount: 'CG シーン数',
      needCutout: '最後に切り抜き',
      exportJson: 'ワークフロー JSON を出力',
      hint: 'ここにはリクエスト設定、実行状態、成果物リンク、デバッグパックがまとまって表示されます。',
      idleMessage: 'キャラクター画像を 1 枚アップロードして paper2gal ワークフローを開始してください。',
      missingFile: '入力画像が選択されていないため、paper2gal ワークフローを開始できません。',
      submitted: 'ワークフローを送信しました。各ステップ完了ごとに結果が順次表示されます。',
      polling: '最新状態を同期しています。しばらくお待ちください。',
      completed: 'paper2gal ワークフローが完了しました。',
      completedWithErrors: 'ワークフローは終了しましたが、一部ステップが失敗またはスキップされました。',
      failed: 'ワークフローが失敗しました。エラー情報とデバッグ JSON を確認してください。',
      chooseHint: 'PNG / JPG / WEBP 対応。背景なしの単体キャラクター立ち絵または鮮明な半身図を推奨します。',
      noWorkflow: 'まだ paper2gal ワークフローは開始されていません。',
      noOutputs: 'まだ出力はありません。最初に成功したステップからすぐ表示されます。',
      outputsHint: '各ステップが成功すると即座にここへ表示されます。全体完了を待つ必要はありません。',
      manifestTitle: '結果マニフェスト',
      openManifest: 'manifest.json を開く',
      openProfile: 'character-profile.json を開く',
      openPrompts: 'prompts.json を開く',
      openCharacterPack: 'character-pack.json を開く',
      openP2gHandoff: 'p2g-handoff.json を開く',
      openFile: 'ファイルを開く',
      downloadFile: 'ダウンロード',
      copyAsset: 'コピー',
      downloadAll: 'すべてダウンロード',
      latestError: '最新エラー',
      providerCutout: '切り抜き',
      providerExpressions: '表情',
      providerCg: 'CG',
      sourceInfo: '入力情報',
      providerInfo: '実行プロバイダ',
      promptOverridesTitle: 'Prompt カスタム',
      promptOverridesHint: 'この workflow が使う各ステップ Prompt をここで公開し、手動で調整できます。キャラクターの一貫性を優先したい時に使ってください。',
      logsHint: 'ログは初期状態で折りたたまれています。確認が必要な時だけ開いてください。',
      debugSummary: 'workflow スナップショット、エラー詳細、provider 戻り値、現在の API 設定をここに集約し、すぐ原因を追えるようにします。',
      resultSummary: 'manifest、キャラクター理解ファイル、prompts、character pack、p2g handoff をここからまとめて確認できます。',
      networkStartError: 'ワークフローを開始できませんでした。バックエンド応答がありません。設定内の API アドレスとサーバー到達性を確認してください。',
      networkFetchError: '最新のワークフロー状態を取得できませんでした。API アドレス、バックエンド状態、ブラウザコンソールを確認してください。',
      hostedApiRequired: 'このページは静的サイトとして配置されています。paper2gal ワークフロー開始前に、設定 -> インターフェース で API アドレスを入力してください。',
      apiWrongEndpoint: '入力された URL はモデル推論エンドポイントであり、paper2gal ワークフロー backend のルート URL ではありません。',
      apiWrongEndpointHint:
        'ここには https://your-backend.example.com のような backend ルート URL を入力してください。フロントエンドが自動で /api/workflows を付与します。/v1/chat/completions や /v1/responses は入力しないでください。',
      backendResponseLabel: 'バックエンド応答',
      requestUrlLabel: '現在のリクエスト先',
    },
  },
  en: {
    dirty: 'Unsaved',
    clean: 'Saved',
    continueEdit: 'Keep editing',
    confirmReturnTitle: 'Return to the homepage?',
    confirmReturnDirty: 'This page still has unsaved changes. Returning now will discard the current draft.',
    confirmReturnClean: 'This page is already saved. You can safely go back and continue later.',
    confirmReturnButton: 'Return',
    saveDraft: 'Save draft',
    saveConfig: 'Save config',
    saveDocument: 'Save document',
    reset: 'Reset',
    refreshWorkspace: 'Refresh',
    refreshWorkspaceTitle: 'Reset this workspace?',
    refreshWorkspaceDescription: 'This clears the current input, result, and temporary saved state for this page so it goes back to its initial state.',
    refreshWorkspaceConfirm: 'Reset now',
    copyJson: 'Copy JSON',
    downloadJson: 'Download JSON',
    copyResult: 'Copy result',
    copied: 'Copied',
    downloadResult: 'Download result',
    copyError: 'Copy error',
    downloadError: 'Download error',
    copyDebug: 'Copy debug JSON',
    downloadDebug: 'Download debug JSON',
    showDetails: 'Show details',
    hideDetails: 'Hide details',
    copyText: 'Copy text',
    downloadHtml: 'Download HTML',
    exportPack: 'Export package',
    chooseImage: 'Choose image file',
    replaceImage: 'Replace image',
    noImage: 'No input image has been selected yet.',
    progressTitle: 'Workflow progress',
    resultsTitle: 'Results and debugging',
    logsTitle: 'Detailed logs',
    debugTitle: 'Debug JSON',
    errorTitle: 'Error details',
    noRecentError: 'No recent errors. Detailed error data expands automatically only when a step fails.',
    statusIdle: 'Idle',
    statusRunning: 'Running',
    statusSuccess: 'Success',
    statusError: 'Failed',
    copyLogs: 'Copy logs',
    downloadLogs: 'Download logs',
    workflowId: 'Workflow ID',
    promptTemplates: 'Templates',
    editorToolbar: 'Document toolbar',
    toolbarFontGroup: 'Font',
    toolbarStyleGroup: 'Text styles',
    toolbarParagraphGroup: 'Paragraph',
    toolbarInsertGroup: 'Insert',
    toolbarHistoryGroup: 'History',
    editorHint: 'This document is the main editing surface for the OC world sheet, character cards, and downstream wrappers.',
    llmTitle: 'LLM wrapper',
    ttsTitle: 'TTS wrapper',
    exportTitle: 'Export and packaging',
    notesTitle: 'System notes',
    operationsTitle: 'Operation toggles',
    transfer: {
      inputTitle: 'Input image and preview',
      paramsTitle: 'AI parameter settings',
      outputTitle: 'Result overview',
      queueTitle: 'Execution status',
      model: 'Model',
      prompt: 'Style prompt',
      negativePrompt: 'Negative prompt',
      temperature: 'Temperature',
      topP: 'Top P',
      topK: 'Top K',
      seed: 'Seed',
      steps: 'Sampling steps',
      strength: 'Style strength',
      cfg: 'CFG Scale',
      needCutout: 'Run cutout',
      keepPalette: 'Keep original palette',
      preservePose: 'Preserve pose',
      faceLock: 'Lock facial structure',
      detailBoost: 'Detail boost',
      start: 'Start style transfer',
      stop: 'Abort task',
      fileHint: 'Supports PNG / JPG / WEBP. A clean single-character or half-body image works best.',
      resultReady: 'The result package is ready. You can copy it, download it, or export the debug payload.',
      waitingResult: 'Results, errors, and debug JSON will appear here after the workflow finishes.',
      validationError: 'No input image was detected, so the workflow stopped during preflight validation.',
      runtimeError: 'Sampling diverged under the current high-randomness configuration. The output was stopped and the full debug package was preserved.',
      successMessage: 'Style transfer completed successfully and generated both result metadata and a debug package.',
      effectivePromptPreview: 'Effective Prompt Preview',
      advancedParams: 'Advanced Parameters',
      advancedParamsHint: 'Aspect ratio, lighting, camera angle, mood, outfit, etc.',
      aspectRatio: 'Aspect Ratio',
      imageSize: 'Image Size',
      styleIntensity: 'Style Intensity',
      lineArtStyle: 'Line Art Style',
      colorScheme: 'Color Scheme',
      backgroundType: 'Background Type',
      lightingStyle: 'Lighting Style',
      cameraAngle: 'Camera Angle',
      characterMood: 'Character Mood',
      outfitDetail: 'Outfit Detail',
      eyeStyle: 'Eye Style',
      hairStyle: 'Hair Style',
      skinTexture: 'Skin Texture',
      addPositiveTags: '+ Positive Tags',
      addNegativeTags: '+ Negative Tags',
      redo: 'Redo',
      openDetailPanel: 'Open Detail Panel',
      errorHintRuntime: 'Reduce Temperature, lower Top P, or disable one of the heavier preservation toggles before retrying.',
      errorHintValidation: 'Select a source image before running the transfer workflow.',
      debugDescription: 'Queue trace, parameter snapshot, logs, result payload, and the latest error package are bundled here.',
    },
    imageConverter: {
      sourceTitle: 'Source Image',
      settingsTitle: 'Format Settings',
      resultTitle: 'Result Preview',
      noImage: 'No image selected yet.',
      resultPlaceholder: 'Result will appear here',
      outputFormat: 'Output Format',
      quality: 'Quality',
      maxWidth: 'Max Width (px)',
      maxHeight: 'Max Height (px)',
      maintainAspect: 'Maintain Aspect Ratio',
      converting: 'Converting...',
      convert: 'Convert',
      download: 'Download',
      formatLabel: 'Format',
      qualityLabel: 'Quality',
    },
    tagPicker: {
      filterPlaceholder: 'Filter tags...',
      close: 'Close',
      apply: 'Apply',
    },
    errorPanel: {
      title: 'Error Details',
      stage: 'Stage',
      message: 'Message',
      hint: 'Hint',
      details: 'Details',
      retry: 'Retry',
    },
    prompt: {
      contentTitle: 'OC card editor',
      templatesTitle: 'Quick templates',
      worldTemplate: 'OC world bible',
      cardTemplate: 'Character sheet',
      relationTemplate: 'Relationship map',
      speechTemplate: 'Speech profile',
      timelineTemplate: 'Timeline',
      outlineTemplate: 'Faction / organization',
      llmModel: 'LLM model',
      llmTemp: 'Temperature',
      llmTopP: 'Top P',
      llmMaxTokens: 'Max tokens',
      llmSystemNote: 'System prompt',
      ttsVoice: 'Voice',
      ttsLanguage: 'Voice language',
      ttsRate: 'Speech rate',
      ttsEmotion: 'Emotion tag',
      ttsFormat: 'Export format',
      fontFamily: 'Font family',
      fontSize: 'Font size',
      blockStyle: 'Block style',
      textColor: 'Text color',
      highlightColor: 'Highlight',
      clearHighlight: 'Clear highlight',
      lineHeight: 'Line height',
      customFontButton: 'Custom font',
      customFontTitle: 'Add custom font',
      customFontName: 'Font label',
      customFontStack: 'Font stack / CSS family',
      customFontApply: 'Apply font',
      customInsertButton: 'Custom insert',
      customInsertTitle: 'Add custom insert block',
      customInsertKind: 'Insert type',
      customInsertPayload: 'Insert payload',
      customInsertApply: 'Insert into document',
      customInsertCallout: 'Callout',
      customInsertDetails: 'Details block',
      customInsertImage: 'Image link',
      customInsertBadge: 'Badge',
      customInsertHtml: 'Custom HTML',
      experimentalNote: 'Custom text settings are experimental. Use them carefully: some fonts may fail to export or render consistently.',
      ttsPitch: 'Pitch',
      ttsVolume: 'Volume',
      ttsSampleRate: 'Sample rate',
      ttsReference: 'Reference audio',
      ttsReferenceButton: 'Choose reference audio',
      ttsReferenceHint: 'Attach a short reference clip if you want the downstream TTS timbre to stay closer to the intended voice.',
      ttsBreathiness: 'Breathiness',
      ttsClarity: 'Clarity',
      ttsExpressiveness: 'Expressiveness',
      ttsSpeedVariation: 'Speed Variation',
      ttsAdvancedParams: 'Advanced Params',
      ttsPauseStrength: 'Pause Strength',
      ttsToneCurve: 'Tone Curve',
      ttsEmphasisMode: 'Emphasis Mode',
      ttsToneCurveFlat: 'Flat',
      ttsToneCurveNatural: 'Natural',
      ttsToneCurveDramatic: 'Dramatic',
      ttsToneCurveMelodic: 'Melodic',
      ttsEmphasisNormal: 'Normal',
      ttsEmphasisStrong: 'Strong',
      ttsEmphasisSubtle: 'Subtle',
      ttsAudioPostProcessing: 'Audio Post-processing',
      ttsNoiseReduction: 'Noise Reduction',
      ttsEqPreset: 'EQ Preset',
      ttsCompression: 'Compression',
      ttsEqFlat: 'Flat',
      ttsEqWarm: 'Warm',
      ttsEqBright: 'Bright',
      ttsEqRadio: 'Radio',
      ttsEqClear: 'Clear',
      ttsTextPreprocessing: 'Text Preprocessing',
      ttsPronunciation: 'Pronunciation',
      ttsCustomReplacements: 'Custom Replacements',
      ttsReplacementsHint: 'One per line, format: original=replacement, e.g. hello=hi',
      editorReady: 'The document, wrapper settings, and export info are bundled together as one authoring packet.',
      packageHint: 'You can export HTML, copy plain text, and download a full wrapper JSON package.',
      exportOptionsTitle: 'Export formats',
      exportOptionsHint: 'Choose the format you want right now. You can export one format or fire off the common bundle in one action.',
      exportHtmlOption: 'Export HTML',
      exportTextOption: 'Export plain text',
      exportJsonOption: 'Export wrapper JSON',
      exportAllOption: 'Export all',
    },
    paper: {
      sourceTitle: 'Asset input',
      sourceHint: 'Upload one character image without background and the page will follow the connected p2g-character-workflow pipeline to build understanding files, expressions, CG scenes, and transparent assets.',
      settingsTitle: 'Output settings',
      settingsHint: 'This page is now wired to the ocmaker paper2gal workflow branch, so output counts and step order are controlled by the backend pipeline.',
      queueTitle: 'Execution console',
      resultsTitle: 'Results and debugging',
      start: 'Start generation',
      starting: 'Starting...',
      resetWorkflow: 'Reset workflow',
      resetWorkflowTitle: 'Reset the current workflow?',
      resetWorkflowDescription: 'This clears the current workflow status, input filename, and the current paper2gal page content so the page goes back to its initial empty state.',
      resetWorkflowConfirm: 'Reset now',
      redoWorkflow: 'Redo this result',
      redoCurrentResult: 'Redo this result',
      workflowConcurrency: 'Workflow concurrency',
      workflowConcurrencyHint: 'Expressions, CG, and cutout run in parallel by default. Turn it off to run one step at a time.',
      expressionCount: 'Expression variants',
      cgCount: 'CG scene count',
      needCutout: 'Run cutout at the end',
      exportJson: 'Export workflow JSON',
      hint: 'This view bundles the current request payload, workflow snapshot, result links, and the full debug package.',
      idleMessage: 'Upload one character image to start the paper2gal workflow.',
      missingFile: 'No source image is selected yet, so the paper2gal workflow cannot start.',
      submitted: 'The workflow was submitted. Outputs will appear step by step as soon as each stage finishes.',
      polling: 'Syncing the latest workflow state.',
      completed: 'The paper2gal workflow completed successfully.',
      completedWithErrors: 'The workflow finished, but some steps failed or were skipped.',
      failed: 'The workflow failed. Check the error panel and debug JSON for the exact cause.',
      chooseHint: 'PNG / JPG / WEBP supported. A clean single-character image without background or a clear half-body illustration works best.',
      noWorkflow: 'No paper2gal workflow has started yet.',
      noOutputs: 'No outputs yet. The first finished step will appear immediately.',
      outputsHint: 'Outputs appear here as soon as each step succeeds. You do not need to wait for the whole pipeline to finish.',
      manifestTitle: 'Result manifest',
      openManifest: 'Open manifest.json',
      openProfile: 'Open character-profile.json',
      openPrompts: 'Open prompts.json',
      openCharacterPack: 'Open character-pack.json',
      openP2gHandoff: 'Open p2g-handoff.json',
      openFile: 'Open file',
      downloadFile: 'Download',
      copyAsset: 'Copy',
      downloadAll: 'Download all',
      latestError: 'Latest error',
      providerCutout: 'Cutout',
      providerExpressions: 'Expressions',
      providerCg: 'CG',
      sourceInfo: 'Source',
      providerInfo: 'Execution providers',
      promptOverridesTitle: 'Prompt overrides',
      promptOverridesHint: 'These are the step prompts used by the workflow. Adjust them here before starting or redoing the run if you want stricter character consistency.',
      logsHint: 'The log panel starts collapsed so the page stays readable. Expand it only when you need to inspect the step-by-step trace.',
      debugSummary: 'The workflow snapshot, error package, provider responses, and active API config are bundled here for direct debugging.',
      resultSummary: 'The manifest, character understanding files, prompts, character pack, and p2g handoff are collected here for quick access.',
      networkStartError: 'Could not start the workflow because the frontend did not receive a backend response. Check the API endpoint in Settings and make sure the server is reachable.',
      networkFetchError: 'Could not fetch the latest workflow state because the request did not reach the backend. Check the backend status, API endpoint, or browser console.',
      hostedApiRequired: 'This page is running as a static site. Open Settings -> API and enter your backend URL before starting the paper2gal workflow.',
      apiWrongEndpoint: 'The configured URL is a model inference endpoint, not the paper2gal workflow backend root.',
      apiWrongEndpointHint:
        'Enter the backend root such as https://your-backend.example.com. The frontend automatically calls /api/workflows, so do not paste /v1/chat/completions or /v1/responses here.',
      backendResponseLabel: 'Backend response',
      requestUrlLabel: 'Request URL',
    },
  },
  ru: {
    dirty: 'Не сохранено',
    clean: 'Сохранено',
    continueEdit: 'Продолжить редактирование',
    confirmReturnTitle: 'Вернуться на главную?',
    confirmReturnDirty: 'На этой странице есть несохранённые изменения. Если вернуться сейчас, текущий черновик будет потерян.',
    confirmReturnClean: 'Содержимое уже сохранено. Можно безопасно вернуться и продолжить позже.',
    confirmReturnButton: 'Вернуться',
    saveDraft: 'Сохранить черновик',
    saveConfig: 'Сохранить конфиг',
    saveDocument: 'Сохранить документ',
    reset: 'Сбросить',
    refreshWorkspace: 'Сбросить страницу',
    refreshWorkspaceTitle: 'Сбросить текущую страницу?',
    refreshWorkspaceDescription: 'Это очистит текущие входные данные, результаты и временно сохранённое локальное состояние страницы, вернув её к начальному виду.',
    refreshWorkspaceConfirm: 'Сбросить сейчас',
    copyJson: 'Скопировать JSON',
    downloadJson: 'Скачать JSON',
    copyResult: 'Скопировать результат',
    copied: 'Скопировано',
    downloadResult: 'Скачать результат',
    copyError: 'Скопировать ошибку',
    downloadError: 'Скачать ошибку',
    copyDebug: 'Скопировать debug JSON',
    downloadDebug: 'Скачать debug JSON',
    showDetails: 'Показать детали',
    hideDetails: 'Скрыть детали',
    copyText: 'Скопировать текст',
    downloadHtml: 'Скачать HTML',
    exportPack: 'Экспортировать пакет',
    chooseImage: 'Выбрать изображение',
    replaceImage: 'Заменить изображение',
    noImage: 'Входное изображение ещё не выбрано.',
    progressTitle: 'Прогресс workflow',
    resultsTitle: 'Результаты и отладка',
    logsTitle: 'Подробные логи',
    debugTitle: 'Debug JSON',
    errorTitle: 'Информация об ошибке',
    noRecentError: 'Сейчас новых ошибок нет. Подробный блок ошибки автоматически раскроется только при сбое шага.',
    statusIdle: 'Ожидание',
    statusRunning: 'Выполняется',
    statusSuccess: 'Готово',
    statusError: 'Ошибка',
    copyLogs: 'Скопировать логи',
    downloadLogs: 'Скачать логи',
    workflowId: 'ID workflow',
    promptTemplates: 'Шаблоны',
    editorToolbar: 'Панель документа',
    toolbarFontGroup: 'Шрифт',
    toolbarStyleGroup: 'Стиль текста',
    toolbarParagraphGroup: 'Абзац',
    toolbarInsertGroup: 'Вставка',
    toolbarHistoryGroup: 'История',
    editorHint: 'Этот документ служит основной зоной редактирования мира OC, карточек персонажей и последующих обёрток.',
    llmTitle: 'LLM-обёртка',
    ttsTitle: 'TTS-обёртка',
    exportTitle: 'Экспорт и упаковка',
    notesTitle: 'Системные заметки',
    operationsTitle: 'Переключатели операций',
    transfer: {
      inputTitle: 'Входное изображение и превью',
      paramsTitle: 'Настройки AI',
      outputTitle: 'Сводка результата',
      queueTitle: 'Статус выполнения',
      model: 'Модель',
      prompt: 'Style prompt',
      negativePrompt: 'Negative prompt',
      temperature: 'Temperature',
      topP: 'Top P',
      topK: 'Top K',
      seed: 'Seed',
      steps: 'Шаги сэмплинга',
      strength: 'Сила стиля',
      cfg: 'CFG Scale',
      needCutout: 'Выполнить вырезание',
      keepPalette: 'Сохранить палитру',
      preservePose: 'Сохранить позу',
      faceLock: 'Зафиксировать лицо',
      detailBoost: 'Усилить детали',
      start: 'Запустить перенос стиля',
      stop: 'Остановить задачу',
      fileHint: 'Поддерживаются PNG / JPG / WEBP. Лучше всего работает чистое изображение одного персонажа.',
      resultReady: 'Пакет результата готов. Его можно скопировать, скачать или вывести debug payload.',
      waitingResult: 'После завершения здесь появятся результат, ошибки и debug JSON.',
      validationError: 'Входное изображение не найдено, поэтому workflow остановился на этапе предварительной проверки.',
      runtimeError: 'Сэмплинг разошёлся при текущих случайных параметрах. Вывод остановлен, полный debug-пакет сохранён.',
      successMessage: 'Перенос стиля завершился успешно и сформировал метаданные результата вместе с debug-пакетом.',
      effectivePromptPreview: 'Предпросмотр Prompt',
      advancedParams: 'Расширенные параметры',
      advancedParamsHint: 'Соотношение сторон, освещение, угол камеры, настроение, одежда и т.д.',
      aspectRatio: 'Соотношение сторон',
      imageSize: 'Размер изображения',
      styleIntensity: 'Интенсивность стиля',
      lineArtStyle: 'Стиль линий',
      colorScheme: 'Цветовая схема',
      backgroundType: 'Тип фона',
      lightingStyle: 'Стиль освещения',
      cameraAngle: 'Угол камеры',
      characterMood: 'Настроение персонажа',
      outfitDetail: 'Детали одежды',
      eyeStyle: 'Стиль глаз',
      hairStyle: 'Причёска',
      skinTexture: 'Текстура кожи',
      addPositiveTags: '+ Позитивные теги',
      addNegativeTags: '+ Негативные теги',
      redo: 'Повторить',
      openDetailPanel: 'Открыть панель деталей',
      errorHintRuntime: 'Уменьшите Temperature, снизьте Top P или отключите часть тяжёлых переключателей сохранения перед повторной попыткой.',
      errorHintValidation: 'Выберите исходное изображение перед запуском рабочего процесса переноса стиля.',
      debugDescription: 'Здесь собраны трассировка очереди, снимок параметров, логи, полезная нагрузка результата и последний пакет ошибок.',
    },
    imageConverter: {
      sourceTitle: 'Исходное изображение',
      settingsTitle: 'Настройки формата',
      resultTitle: 'Предпросмотр результата',
      noImage: 'Изображение ещё не выбрано.',
      resultPlaceholder: 'Результат появится здесь',
      outputFormat: 'Формат вывода',
      quality: 'Качество',
      maxWidth: 'Макс. ширина (px)',
      maxHeight: 'Макс. высота (px)',
      maintainAspect: 'Сохранять пропорции',
      converting: 'Конвертация...',
      convert: 'Конвертировать',
      download: 'Скачать',
      formatLabel: 'Формат',
      qualityLabel: 'Качество',
    },
    tagPicker: {
      filterPlaceholder: 'Фильтровать теги...',
      close: 'Закрыть',
      apply: 'Применить',
    },
    errorPanel: {
      title: 'Детали ошибки',
      stage: 'Этап',
      message: 'Сообщение',
      hint: 'Подсказка',
      details: 'Детали',
      retry: 'Повторить',
    },
    prompt: {
      contentTitle: 'Редактор карточек OC',
      templatesTitle: 'Быстрые шаблоны',
      worldTemplate: 'Библия мира OC',
      cardTemplate: 'Карточка персонажа',
      relationTemplate: 'Карта отношений',
      speechTemplate: 'Речевая настройка',
      timelineTemplate: 'Таймлайн',
      outlineTemplate: 'Фракция / организация',
      llmModel: 'Модель LLM',
      llmTemp: 'Temperature',
      llmTopP: 'Top P',
      llmMaxTokens: 'Max tokens',
      llmSystemNote: 'System prompt',
      ttsVoice: 'Голос',
      ttsLanguage: 'Язык голоса',
      ttsRate: 'Скорость речи',
      ttsEmotion: 'Эмоция',
      ttsFormat: 'Формат экспорта',
      fontFamily: 'Шрифт',
      fontSize: 'Размер',
      blockStyle: 'Стиль блока',
      textColor: 'Цвет текста',
      highlightColor: 'Подсветка',
      clearHighlight: 'Снять подсветку',
      lineHeight: 'Межстрочный интервал',
      customFontButton: 'Свой шрифт',
      customFontTitle: 'Добавить свой шрифт',
      customFontName: 'Название шрифта',
      customFontStack: 'Стек шрифтов / CSS family',
      customFontApply: 'Применить шрифт',
      customInsertButton: 'Своя вставка',
      customInsertTitle: 'Добавить пользовательский блок',
      customInsertKind: 'Тип вставки',
      customInsertPayload: 'Содержимое вставки',
      customInsertApply: 'Вставить в документ',
      customInsertCallout: 'Выделенный блок',
      customInsertDetails: 'Сворачиваемый блок',
      customInsertImage: 'Ссылка на изображение',
      customInsertBadge: 'Бейдж',
      customInsertHtml: 'Свой HTML',
      experimentalNote: 'Пользовательские текстовые настройки являются экспериментальными. Используйте их осторожно: некоторые шрифты могут не экспортироваться или не распознаваться.',
      ttsPitch: 'Высота тона',
      ttsVolume: 'Громкость',
      ttsSampleRate: 'Частота дискретизации',
      ttsReference: 'Референс аудио',
      ttsReferenceButton: 'Выбрать референс аудио',
      ttsReferenceHint: 'Можно прикрепить короткий референс-клип, чтобы будущий TTS держал нужное направление тембра.',
      ttsBreathiness: 'Дыхание',
      ttsClarity: 'Чёткость',
      ttsExpressiveness: 'Выразительность',
      ttsSpeedVariation: 'Вариация скорости',
      ttsAdvancedParams: 'Расширенные параметры',
      ttsPauseStrength: 'Сила паузы',
      ttsToneCurve: 'Тональная кривая',
      ttsEmphasisMode: 'Режим акцента',
      ttsToneCurveFlat: 'Плоская',
      ttsToneCurveNatural: 'Естественная',
      ttsToneCurveDramatic: 'Драматичная',
      ttsToneCurveMelodic: 'Мелодичная',
      ttsEmphasisNormal: 'Обычный',
      ttsEmphasisStrong: 'Сильный',
      ttsEmphasisSubtle: 'Тонкий',
      ttsAudioPostProcessing: 'Постобработка аудио',
      ttsNoiseReduction: 'Шумоподавление',
      ttsEqPreset: 'EQ пресет',
      ttsCompression: 'Компрессия',
      ttsEqFlat: 'Плоский',
      ttsEqWarm: 'Тёплый',
      ttsEqBright: 'Яркий',
      ttsEqRadio: 'Радио',
      ttsEqClear: 'Чистый',
      ttsTextPreprocessing: 'Предобработка текста',
      ttsPronunciation: 'Произношение',
      ttsCustomReplacements: 'Пользовательские замены',
      ttsReplacementsHint: 'По одной на строку, формат: оригинал=замена, напр. привет=здравствуй',
      editorReady: 'Документ, настройки обёртки и экспортные данные собираются в один авторский пакет.',
      packageHint: 'Можно экспортировать HTML, копировать обычный текст и скачать полный JSON-пакет.',
      exportOptionsTitle: 'Форматы экспорта',
      exportOptionsHint: 'Выберите формат, который хотите выгрузить сейчас. Можно скачать один формат или сразу весь базовый набор.',
      exportHtmlOption: 'Экспортировать HTML',
      exportTextOption: 'Экспортировать обычный текст',
      exportJsonOption: 'Экспортировать wrapper JSON',
      exportAllOption: 'Экспортировать всё',
    },
    paper: {
      sourceTitle: 'Входные материалы',
      sourceHint: 'Загрузите одно изображение персонажа без фона, и страница пойдет по подключенному pipeline p2g-character-workflow: понимание персонажа, выражения, CG и прозрачные ассеты.',
      settingsTitle: 'Настройки вывода',
      settingsHint: 'Сейчас эта страница подключена к ветке paper2gal для ocmaker, поэтому число результатов и порядок шагов задаются backend-workflow.',
      queueTitle: 'Консоль выполнения',
      resultsTitle: 'Результаты и отладка',
      start: 'Начать генерацию',
      starting: 'Запуск...',
      resetWorkflow: 'Сбросить workflow',
      resetWorkflowTitle: 'Сбросить текущий workflow?',
      resetWorkflowDescription: 'Это очистит текущее состояние workflow, имя входного файла и текущие данные paper2gal на странице, вернув интерфейс в исходное пустое состояние.',
      resetWorkflowConfirm: 'Сбросить сейчас',
      redoWorkflow: 'Переделать результат',
      redoCurrentResult: 'Переделать этот результат',
      workflowConcurrency: 'Параллельный workflow',
      workflowConcurrencyHint: 'По умолчанию выражения, CG и вырезание идут параллельно. Если выключить, workflow пойдет строго по шагам.',
      expressionCount: 'Число эмоций',
      cgCount: 'Количество CG-сцен',
      needCutout: 'Вырезать фон в конце',
      exportJson: 'Экспортировать workflow JSON',
      hint: 'Здесь собраны текущий запрос, снимок workflow, ссылки на результаты и полный debug-пакет.',
      idleMessage: 'Загрузите одно изображение персонажа, чтобы начать paper2gal workflow.',
      missingFile: 'Исходное изображение еще не выбрано, поэтому paper2gal workflow нельзя запустить.',
      submitted: 'Workflow отправлен. Результаты будут появляться по мере завершения каждого шага.',
      polling: 'Синхронизируется актуальное состояние workflow.',
      completed: 'paper2gal workflow успешно завершен.',
      completedWithErrors: 'Workflow завершился, но часть шагов завершилась ошибкой или была пропущена.',
      failed: 'Workflow завершился с ошибкой. Проверьте панель ошибки и debug JSON.',
      chooseHint: 'Поддерживаются PNG / JPG / WEBP. Лучше всего подходит чистое изображение одного персонажа без фона или четкий арт по пояс.',
      noWorkflow: 'paper2gal workflow еще не запускался.',
      noOutputs: 'Пока результатов нет. Первый успешный шаг появится сразу.',
      outputsHint: 'Результаты появляются здесь сразу после успешного шага. Ждать конца всего pipeline не нужно.',
      manifestTitle: 'Манифест результата',
      openManifest: 'Открыть manifest.json',
      openProfile: 'Открыть character-profile.json',
      openPrompts: 'Открыть prompts.json',
      openCharacterPack: 'Открыть character-pack.json',
      openP2gHandoff: 'Открыть p2g-handoff.json',
      openFile: 'Открыть файл',
      downloadFile: 'Скачать',
      copyAsset: 'Копировать',
      downloadAll: 'Скачать всё',
      latestError: 'Последняя ошибка',
      providerCutout: 'Вырезание',
      providerExpressions: 'Выражения',
      providerCg: 'CG',
      sourceInfo: 'Источник',
      providerInfo: 'Провайдеры выполнения',
      promptOverridesTitle: 'Настройка prompt',
      promptOverridesHint: 'Здесь открыты step-prompt’ы текущего workflow. Их можно вручную править перед запуском или повторным прогоном, чтобы жёстче удерживать идентичность персонажа.',
      logsHint: 'Панель логов по умолчанию свернута, чтобы интерфейс оставался чище. Раскрывайте её только когда нужен пошаговый разбор.',
      debugSummary: 'Здесь собраны снимок workflow, пакет ошибки, ответы провайдеров и активная API-конфигурация для прямой отладки.',
      resultSummary: 'Здесь собраны manifest, файлы понимания персонажа, prompts, character pack и p2g handoff для быстрого доступа.',
      networkStartError: 'Не удалось запустить workflow: фронтенд не получил ответ от бэкенда. Проверьте API-адрес в настройках и доступность сервера.',
      networkFetchError: 'Не удалось получить актуальное состояние workflow: запрос не дошел до бэкенда. Проверьте состояние сервера, API endpoint и консоль браузера.',
      hostedApiRequired: 'Эта страница работает как статический сайт. Перед запуском paper2gal workflow откройте Настройки -> API и укажите URL вашего backend.',
      apiWrongEndpoint: 'Указанный URL является endpoint модели, а не корневым адресом backend paper2gal workflow.',
      apiWrongEndpointHint:
        'Здесь нужен корневой адрес backend, например https://your-backend.example.com. Фронтенд сам добавит /api/workflows, поэтому не вставляйте /v1/chat/completions или /v1/responses.',
      backendResponseLabel: 'Ответ backend',
      requestUrlLabel: 'Адрес запроса',
    },
  },
} as const;

const promptTemplates = {
  zh: [
    {
      key: 'world',
      label: 'OC 世界观',
      html: `<h1>OC 世界观总览</h1><p>在这里描述时代背景、地理结构、科技 / 魔法体系与核心冲突。</p><h2>世界规则</h2><ul><li>世界运行机制</li><li>主要势力</li><li>禁忌与边界</li></ul>`,
    },
    {
      key: 'card',
      label: '角色设卡',
      html: `<h1>角色设定卡</h1><table><tr><th>字段</th><th>内容</th></tr><tr><td>姓名</td><td>填写角色名</td></tr><tr><td>身份</td><td>填写角色定位</td></tr><tr><td>关键词</td><td>填写三到五个关键词</td></tr></table>`,
    },
    {
      key: 'relation',
      label: '关系网络',
      html: `<h1>关系网络</h1><p>列出角色之间的盟友、对立、依赖与秘密。</p><blockquote>把“公开关系”和“隐藏关系”分开写，会更利于后续 Prompt 封装。</blockquote>`,
    },
    {
      key: 'speech',
      label: '语音设定',
      html: `<h1>语音设定</h1><ul><li>常用语气词</li><li>说话速度与停顿习惯</li><li>情绪上扬时的变化</li></ul>`,
    },
    {
      key: 'timeline',
      label: '时间线',
      html: `<h1>关键时间线</h1><ol><li>角色出生与早年经历</li><li>转折事件</li><li>当前所处阶段</li><li>未来目标</li></ol>`,
    },
    {
      key: 'faction',
      label: '阵营 / 组织',
      html: `<h1>阵营 / 组织设定</h1><p>记录组织的目标、结构、资源与对外关系。</p><h2>组织层级</h2><ul><li>核心成员</li><li>外围成员</li><li>外部合作方</li></ul>`,
    },
  ],
  ja: [
    { key: 'world', label: '世界観', html: `<h1>OC 世界観</h1><p>時代背景、地理、技術 / 魔法体系、中心対立をここに整理します。</p>` },
    { key: 'card', label: 'キャラ設定表', html: `<h1>キャラクター設定表</h1><p>名前、役割、口調、外見、モチーフを書き出します。</p>` },
    { key: 'relation', label: '関係図', html: `<h1>関係図</h1><p>味方、対立、依存、秘密を関係ごとに分けて整理します。</p>` },
    { key: 'speech', label: '音声設定', html: `<h1>音声設定</h1><p>語尾、話速、感情時の変化を記録します。</p>` },
    { key: 'timeline', label: '年表', html: `<h1>年表</h1><ol><li>出生</li><li>転機</li><li>現在</li><li>今後</li></ol>` },
    { key: 'faction', label: '組織設定', html: `<h1>組織設定</h1><p>目的、階層、資源、対外関係を整理します。</p>` },
  ],
  en: [
    { key: 'world', label: 'World bible', html: `<h1>OC World Bible</h1><p>Use this space for the era, geography, systems, and central conflicts of the setting.</p>` },
    { key: 'card', label: 'Character sheet', html: `<h1>Character Sheet</h1><p>Capture identity, motifs, emotional axis, public role, and hidden agenda.</p>` },
    { key: 'relation', label: 'Relationship map', html: `<h1>Relationship Map</h1><p>Track alliances, tensions, dependencies, and concealed ties.</p>` },
    { key: 'speech', label: 'Speech profile', html: `<h1>Speech Profile</h1><p>Document cadence, filler words, emotional shifts, and verbal habits.</p>` },
    { key: 'timeline', label: 'Timeline', html: `<h1>Timeline</h1><ol><li>Origin</li><li>Turning point</li><li>Current phase</li><li>Future goal</li></ol>` },
    { key: 'faction', label: 'Faction sheet', html: `<h1>Faction / Organization</h1><p>Describe goals, structure, resources, and external relationships.</p>` },
  ],
  ru: [
    { key: 'world', label: 'Мир', html: `<h1>Библия мира OC</h1><p>Здесь фиксируются эпоха, география, системы и центральные конфликты.</p>` },
    { key: 'card', label: 'Карточка', html: `<h1>Карточка персонажа</h1><p>Запишите личность, роль, внешний образ, мотивы и скрытую цель.</p>` },
    { key: 'relation', label: 'Связи', html: `<h1>Карта отношений</h1><p>Разделите союзников, конфликты, зависимости и скрытые связи.</p>` },
    { key: 'speech', label: 'Речь', html: `<h1>Речевая настройка</h1><p>Фиксируйте ритм речи, слова-паразиты и эмоциональные сдвиги.</p>` },
    { key: 'timeline', label: 'Таймлайн', html: `<h1>Таймлайн</h1><ol><li>Происхождение</li><li>Поворотный момент</li><li>Текущая фаза</li><li>Цель</li></ol>` },
    { key: 'faction', label: 'Организация', html: `<h1>Фракция / организация</h1><p>Опишите цели, структуру, ресурсы и внешние связи.</p>` },
  ],
} as const;

const localizedUiCopy: Record<AppLanguage, UiCopySet> = {
  zh: uiCopy.zh,
  ja: uiCopy.ja,
  en: uiCopy.en,
  ru: uiCopy.ru,
  ko: {
    ...uiCopy.en,
    dirty: '저장 안 됨',
    clean: '저장됨',
    copied: '복사됨',
    continueEdit: '계속 편집',
    confirmReturnTitle: '홈으로 돌아갈까요?',
    confirmReturnDirty: '아직 저장되지 않은 내용이 있습니다. 지금 돌아가면 현재 초안이 유지되지 않습니다.',
    confirmReturnClean: '현재 내용은 저장되었습니다. 홈으로 돌아가도 나중에 이어서 작업할 수 있습니다.',
    confirmReturnButton: '돌아가기',
    saveDraft: '초안 저장',
    saveConfig: '설정 저장',
    saveDocument: '문서 저장',
    chooseImage: '이미지 파일 선택',
    replaceImage: '이미지 바꾸기',
    progressTitle: '워크플로 진행',
    resultsTitle: '결과 및 디버그',
    logsTitle: '상세 로그',
    errorTitle: '오류 정보',
    workflowId: '워크플로 ID',
    promptTemplates: '템플릿',
    editorToolbar: '문서 도구 모음',
    llmTitle: 'LLM 래퍼',
    ttsTitle: 'TTS 래퍼',
    exportTitle: '내보내기 및 패키징',
    transfer: {
      ...uiCopy.en.transfer,
      inputTitle: '입력 이미지와 미리보기',
      paramsTitle: 'AI 파라미터 설정',
      outputTitle: '결과 개요',
      queueTitle: '실행 상태',
      start: '스타일 변환 시작',
      stop: '작업 중지',
    },
    prompt: {
      ...uiCopy.en.prompt,
      contentTitle: 'OC 설정 에디터',
      templatesTitle: '빠른 템플릿',
    },
    paper: {
      ...uiCopy.en.paper,
      sourceTitle: '소재 입력',
      settingsTitle: '출력 설정',
      queueTitle: '실행 콘솔',
      start: '생성 시작',
    },
  },
  fr: {
    ...uiCopy.en,
    dirty: 'Non enregistré',
    clean: 'Enregistré',
    copied: 'Copié',
    continueEdit: 'Continuer',
    confirmReturnTitle: 'Retourner à l’accueil ?',
    confirmReturnDirty: 'Cette page contient encore des changements non enregistrés.',
    confirmReturnClean: 'Le contenu actuel est déjà enregistré.',
    confirmReturnButton: 'Retour',
    saveDraft: 'Enregistrer le brouillon',
    saveConfig: 'Enregistrer la config',
    saveDocument: 'Enregistrer le document',
    progressTitle: 'Progression du workflow',
    resultsTitle: 'Résultats et debug',
    logsTitle: 'Journaux détaillés',
    errorTitle: 'Erreur détaillée',
    prompt: {
      ...uiCopy.en.prompt,
      contentTitle: 'Éditeur de fiches OC',
    },
  },
  de: {
    ...uiCopy.en,
    dirty: 'Nicht gespeichert',
    clean: 'Gespeichert',
    copied: 'Kopiert',
    continueEdit: 'Weiter bearbeiten',
    confirmReturnTitle: 'Zur Startseite zurückkehren?',
    confirmReturnDirty: 'Diese Seite hat noch nicht gespeicherte Änderungen.',
    confirmReturnClean: 'Der aktuelle Inhalt ist bereits gespeichert.',
    confirmReturnButton: 'Zurückkehren',
    saveDraft: 'Entwurf speichern',
    saveConfig: 'Konfig speichern',
    saveDocument: 'Dokument speichern',
    progressTitle: 'Workflow-Fortschritt',
    resultsTitle: 'Ergebnisse und Debug',
    logsTitle: 'Detaillierte Logs',
    errorTitle: 'Fehlerdetails',
    prompt: {
      ...uiCopy.en.prompt,
      contentTitle: 'OC-Karteneditor',
    },
  },
  es: {
    ...uiCopy.en,
    dirty: 'Sin guardar',
    clean: 'Guardado',
    copied: 'Copiado',
    continueEdit: 'Seguir editando',
    confirmReturnTitle: '¿Volver al inicio?',
    confirmReturnDirty: 'Esta página todavía tiene cambios sin guardar.',
    confirmReturnClean: 'El contenido actual ya está guardado.',
    confirmReturnButton: 'Volver',
    saveDraft: 'Guardar borrador',
    saveConfig: 'Guardar config',
    saveDocument: 'Guardar documento',
    progressTitle: 'Progreso del flujo',
    resultsTitle: 'Resultados y depuración',
    logsTitle: 'Registros detallados',
    errorTitle: 'Detalles del error',
    prompt: {
      ...uiCopy.en.prompt,
      contentTitle: 'Editor de fichas OC',
    },
  },
  it: {
    ...uiCopy.en,
    dirty: 'Non salvato',
    clean: 'Salvato',
    copied: 'Copiato',
    continueEdit: 'Continua a modificare',
    confirmReturnTitle: 'Tornare alla home?',
    confirmReturnDirty: 'Questa pagina ha ancora modifiche non salvate.',
    confirmReturnClean: 'Il contenuto attuale è già salvato.',
    confirmReturnButton: 'Torna',
    saveDraft: 'Salva bozza',
    saveConfig: 'Salva config',
    saveDocument: 'Salva documento',
    progressTitle: 'Avanzamento workflow',
    resultsTitle: 'Risultati e debug',
    logsTitle: 'Log dettagliati',
    errorTitle: 'Dettagli errore',
    prompt: {
      ...uiCopy.en.prompt,
      contentTitle: 'Editor schede OC',
    },
  },
  pt: {
    ...uiCopy.en,
    dirty: 'Não salvo',
    clean: 'Salvo',
    copied: 'Copiado',
    continueEdit: 'Continuar editando',
    confirmReturnTitle: 'Voltar para a página inicial?',
    confirmReturnDirty: 'Esta página ainda tem alterações não salvas.',
    confirmReturnClean: 'O conteúdo atual já está salvo.',
    confirmReturnButton: 'Voltar',
    saveDraft: 'Salvar rascunho',
    saveConfig: 'Salvar config',
    saveDocument: 'Salvar documento',
    progressTitle: 'Progresso do workflow',
    resultsTitle: 'Resultados e depuração',
    logsTitle: 'Logs detalhados',
    errorTitle: 'Detalhes do erro',
    prompt: {
      ...uiCopy.en.prompt,
      contentTitle: 'Editor de fichas OC',
    },
  },
  cs: uiCopy.en,
  da: uiCopy.en,
  nl: uiCopy.en,
  el: uiCopy.en,
  hi: uiCopy.en,
  hu: uiCopy.en,
  id: uiCopy.en,
  no: uiCopy.en,
  pl: uiCopy.en,
  ro: uiCopy.en,
  sk: uiCopy.en,
  sv: uiCopy.en,
  th: uiCopy.en,
  tr: uiCopy.en,
  uk: uiCopy.ru,
  vi: uiCopy.en,
  ms: uiCopy.en,
  fi: uiCopy.en,
  bg: uiCopy.ru,
  lt: uiCopy.en,
};

const localizedPromptTemplates: Record<AppLanguage, (typeof promptTemplates)[BaseLanguage]> = {
  zh: promptTemplates.zh,
  ja: promptTemplates.ja,
  en: promptTemplates.en,
  ru: promptTemplates.ru,
  ko: promptTemplates.en,
  fr: promptTemplates.en,
  de: promptTemplates.en,
  es: promptTemplates.en,
  it: promptTemplates.en,
  pt: promptTemplates.en,
  cs: promptTemplates.en,
  da: promptTemplates.en,
  nl: promptTemplates.en,
  el: promptTemplates.en,
  hi: promptTemplates.en,
  hu: promptTemplates.en,
  id: promptTemplates.en,
  no: promptTemplates.en,
  pl: promptTemplates.en,
  ro: promptTemplates.en,
  sk: promptTemplates.en,
  sv: promptTemplates.en,
  th: promptTemplates.en,
  tr: promptTemplates.en,
  uk: promptTemplates.ru,
  vi: promptTemplates.en,
  ms: promptTemplates.en,
  fi: promptTemplates.en,
  bg: promptTemplates.ru,
  lt: promptTemplates.en,
};

const ttsLanguageOptions: Array<{ value: AppLanguage; label: string }> = [
  { value: 'zh', label: '中文' },
  { value: 'ja', label: '日本語' },
  { value: 'en', label: 'English' },
  { value: 'ru', label: 'Русский' },
  { value: 'ko', label: '한국어' },
  { value: 'fr', label: 'Français' },
  { value: 'de', label: 'Deutsch' },
  { value: 'es', label: 'Español' },
  { value: 'it', label: 'Italiano' },
  { value: 'pt', label: 'Português' },
];

const paperStepLabels: Record<BaseLanguage, Record<PaperWorkflowStepName, string>> = {
  zh: {
    validate_input: '输入校验',
    analyze_character: '角色理解',
    expression_thinking: '思考表情',
    expression_surprise: '惊讶表情',
    expression_angry: '生气表情',
    cg_01: 'CG 场景 01',
    cg_02: 'CG 场景 02',
    cutout_expression_thinking: '思考表情抠图',
    cutout_expression_surprise: '惊讶表情抠图',
    cutout_expression_angry: '生气表情抠图',
  },
  ja: {
    validate_input: '入力検証',
    analyze_character: 'キャラクター理解',
    expression_thinking: '思考表情',
    expression_surprise: '驚き表情',
    expression_angry: '怒り表情',
    cg_01: 'CG シーン 01',
    cg_02: 'CG シーン 02',
    cutout_expression_thinking: '思考表情切り抜き',
    cutout_expression_surprise: '驚き表情切り抜き',
    cutout_expression_angry: '怒り表情切り抜き',
  },
  en: {
    validate_input: 'Validate input',
    analyze_character: 'Character understanding',
    expression_thinking: 'Thinking expression',
    expression_surprise: 'Surprise expression',
    expression_angry: 'Angry expression',
    cg_01: 'CG scene 01',
    cg_02: 'CG scene 02',
    cutout_expression_thinking: 'Thinking cutout',
    cutout_expression_surprise: 'Surprise cutout',
    cutout_expression_angry: 'Angry cutout',
  },
  ru: {
    validate_input: 'Проверка входа',
    analyze_character: 'Понимание персонажа',
    expression_thinking: 'Выражение: раздумье',
    expression_surprise: 'Выражение: удивление',
    expression_angry: 'Выражение: злость',
    cg_01: 'CG-сцена 01',
    cg_02: 'CG-сцена 02',
    cutout_expression_thinking: 'Вырезание раздумья',
    cutout_expression_surprise: 'Вырезание удивления',
    cutout_expression_angry: 'Вырезание злости',
  },
};

const paperStatusLabels: Record<
  BaseLanguage,
  Record<PaperWorkflowStepStatus | PaperWorkflowStatus, string>
> = {
  zh: {
    queued: '排队中',
    running: '执行中',
    success: '成功',
    failed: '失败',
    skipped: '跳过',
    completed: '已完成',
    completed_with_errors: '完成但有错误',
  },
  ja: {
    queued: '待機中',
    running: '実行中',
    success: '成功',
    failed: '失敗',
    skipped: 'スキップ',
    completed: '完了',
    completed_with_errors: 'エラー付き完了',
  },
  en: {
    queued: 'Queued',
    running: 'Running',
    success: 'Success',
    failed: 'Failed',
    skipped: 'Skipped',
    completed: 'Completed',
    completed_with_errors: 'Completed with errors',
  },
  ru: {
    queued: 'В очереди',
    running: 'Выполняется',
    success: 'Успешно',
    failed: 'Ошибка',
    skipped: 'Пропущено',
    completed: 'Завершено',
    completed_with_errors: 'Завершено с ошибками',
  },
};

function resolveBaseLanguage(language: AppLanguage): BaseLanguage {
  if (language === 'zh' || language === 'ja' || language === 'en' || language === 'ru') {
    return language;
  }

  return 'en';
}

function readLocalState<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;

    const parsed = JSON.parse(raw) as Partial<T>;
    return { ...fallback, ...parsed };
  } catch {
    return fallback;
  }
}

function writeLocalState<T>(key: string, value: T) {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage failures when storage is unavailable.
  }
}

function useBeforeUnloadGuard(isDirty: boolean) {
  useEffect(() => {
    if (!isDirty) return;

    function handleBeforeUnload(event: BeforeUnloadEvent) {
      event.preventDefault();
      event.returnValue = '';
    }

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);
}

function timestamp() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
}

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    // Ignore clipboard failures in environments without permission.
  }
}

function downloadText(name: string, content: string, type = 'text/plain;charset=utf-8') {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = name;
  anchor.click();
  URL.revokeObjectURL(url);
}

async function parseJsonResponse(response: Response) {
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return response.json();
  }

  const text = await response.text();
  return { error: text || `Unexpected response with status ${response.status}.` };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function toCompactJson(value: unknown) {
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

function collectReadableErrorParts(value: unknown, prefix = '', depth = 0): string[] {
  if (value === null || value === undefined) {
    return [];
  }

  if (depth > 2) {
    const compact = toCompactJson(value);
    return compact ? [prefix ? `${prefix}: ${compact}` : compact] : [];
  }

  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    const text = String(value).trim();
    return text ? [prefix ? `${prefix}: ${text}` : text] : [];
  }

  if (Array.isArray(value)) {
    return value.slice(0, 8).flatMap((item, index) => collectReadableErrorParts(item, `${prefix}[${index}]`, depth + 1));
  }

  if (isRecord(value)) {
    const keys = Object.keys(value);
    const preferredOrder = ['message', 'text', 'detail', 'details', 'error', 'reason', 'hint', 'code', 'type', 'status'];
    const orderedKeys = [
      ...preferredOrder.filter((key) => keys.includes(key)),
      ...keys.filter((key) => !preferredOrder.includes(key)),
    ];

    return orderedKeys.slice(0, 10).flatMap((key) =>
      collectReadableErrorParts(value[key], prefix ? `${prefix}.${key}` : key, depth + 1),
    );
  }

  const text = String(value).trim();
  return text ? [prefix ? `${prefix}: ${text}` : text] : [];
}

function formatReadableErrorPayload(payload: unknown) {
  const parts = Array.from(new Set(collectReadableErrorParts(payload))).filter(Boolean);
  return parts.slice(0, 8).join(' ; ');
}

function normalizeFetchError(error: unknown, fallback: string) {
  if (error instanceof TypeError && String(error.message).includes('Failed to fetch')) {
    return fallback;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

function inferFileNameFromUrl(url: string, fallback = 'asset') {
  if (!url) {
    return fallback;
  }

  const clean = String(url).split('?')[0];
  const segments = clean.split('/');
  return segments[segments.length - 1] || fallback;
}

function toPaperAssetUrl(settings: SettingsState, url: string) {
  return buildApiUrl(settings, url);
}

async function copyRemoteAsset(url: string, settings: SettingsState) {
  if (!url) {
    return false;
  }

  try {
    const response = await fetchWithTimeout(toPaperAssetUrl(settings, url), {
      headers: buildApiHeaders(settings),
    });
    if (!response.ok) {
      return false;
    }

    const blob = await response.blob();
    if (navigator.clipboard && 'write' in navigator.clipboard && 'ClipboardItem' in window && blob.type.startsWith('image/')) {
      const ClipboardItemConstructor = (window as unknown as { ClipboardItem: typeof ClipboardItem }).ClipboardItem;
      await navigator.clipboard.write([new ClipboardItemConstructor({ [blob.type]: blob })]);
      return true;
    }

    return copyText(toPaperAssetUrl(settings, url));
  } catch {
    return false;
  }
}

async function downloadRemoteFile(url: string, fileName: string, settings: SettingsState, copy: UiCopySet['paper']) {
  const requestUrl = toPaperAssetUrl(settings, url);
  if (detectWorkflowApiBaseIssue(getEffectiveApiBase(settings)) === 'direct-model-endpoint') {
    throw new Error(`${copy.apiWrongEndpoint} ${copy.apiWrongEndpointHint} ${copy.requestUrlLabel}: ${requestUrl}`);
  }

  const response = await fetchWithTimeout(requestUrl, {
    headers: buildApiHeaders(settings),
  });
  if (!response.ok) {
    const payload = await parseJsonResponse(response);
    throw new Error(
      buildPaperApiErrorMessage({
        response,
        payload,
        requestUrl,
        settings,
        copy,
        fallback: copy.networkFetchError,
      }),
    );
  }

  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = objectUrl;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(objectUrl);
}

async function downloadPaperArchive(workflowId: string, settings: SettingsState, copy: UiCopySet['paper']) {
  await ensureLocalApiProbed();
  const requestUrl = buildApiUrl(settings, `/api/workflows/${workflowId}/download`);
  if (detectWorkflowApiBaseIssue(getEffectiveApiBase(settings)) === 'direct-model-endpoint') {
    throw new Error(`${copy.apiWrongEndpoint} ${copy.apiWrongEndpointHint} ${copy.requestUrlLabel}: ${requestUrl}`);
  }

  const response = await fetchWithTimeout(requestUrl, {
    headers: buildApiHeaders(settings),
  });
  if (!response.ok) {
    const payload = await parseJsonResponse(response);
    throw new Error(
      buildPaperApiErrorMessage({
        response,
        payload,
        requestUrl,
        settings,
        copy,
        fallback: copy.networkFetchError,
      }),
    );
  }

  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = objectUrl;
  anchor.download = `${workflowId}-outputs.zip`;
  anchor.click();
  URL.revokeObjectURL(objectUrl);
}

function getPaperProgress(workflow: PaperWorkflow | null) {
  if (!workflow) {
    return 0;
  }

  if (workflow.status === 'completed' || workflow.status === 'completed_with_errors' || workflow.status === 'failed') {
    return 100;
  }

  let completedSteps = 0;
  let runningSteps = 0;

  for (const stepName of PAPER_STEP_ORDER) {
    const step = workflow.steps?.[stepName];
    if (!step) {
      continue;
    }

    if (step.status === 'success' || step.status === 'failed' || step.status === 'skipped') {
      completedSteps += 1;
    } else if (step.status === 'running') {
      runningSteps += 1;
    }
  }

  const total = PAPER_STEP_ORDER.length;
  const ratio = completedSteps / total + (runningSteps > 0 ? 0.5 / total : 0);
  return Math.max(4, Math.min(96, Math.round(ratio * 100)));
}

function getPaperStatusBadgeClass(workflow: PaperWorkflow | null): TransferStatus {
  if (!workflow) {
    return 'idle';
  }

  if (workflow.status === 'completed') {
    return 'success';
  }

  if (workflow.status === 'completed_with_errors' || workflow.status === 'failed') {
    return 'error';
  }

  return 'running';
}

function buildPaperApiErrorMessage(options: {
  response: Response;
  payload: unknown;
  requestUrl: string;
  settings: SettingsState;
  copy: UiCopySet['paper'];
  fallback: string;
}) {
  const { response, payload, requestUrl, settings, copy, fallback } = options;
  const pieces: string[] = [`${fallback} (HTTP ${response.status}${response.statusText ? ` ${response.statusText}` : ''})`];
  const apiBaseIssue = detectWorkflowApiBaseIssue(getEffectiveApiBase(settings));
  const backendMessage = formatReadableErrorPayload(payload);

  if (apiBaseIssue === 'direct-model-endpoint') {
    pieces.push(copy.apiWrongEndpoint);
    pieces.push(copy.apiWrongEndpointHint);
  }

  if (backendMessage) {
    pieces.push(`${copy.backendResponseLabel}: ${backendMessage}`);
  }

  pieces.push(`${copy.requestUrlLabel}: ${requestUrl}`);
  return pieces.join(' ');
}

function derivePaperWorkflowErrorInsight(options: {
  apiBaseIssue: ReturnType<typeof detectWorkflowApiBaseIssue>;
  paper: UiCopySet['paper'];
  workflow: PaperWorkflow | null;
  latestStepError: PaperWorkflowStep | null;
}) {
  const { apiBaseIssue, paper, workflow, latestStepError } = options;

  if (apiBaseIssue === 'direct-model-endpoint') {
    return {
      possibleCause: paper.apiWrongEndpoint,
      fixHint: paper.apiWrongEndpointHint,
    };
  }

  const detailText = [
    workflow?.error || '',
    latestStepError?.error || '',
    JSON.stringify(workflow?.error_details || {}),
    JSON.stringify(latestStepError?.debug || {}),
  ]
    .filter(Boolean)
    .join('\n');

  if (/PLATO_IMAGE_PIPELINE_UNAVAILABLE|内容策略|审核拦截|sensitive words|Prompt图片未通过审核/i.test(detailText)) {
    return {
      possibleCause: '上游图像编辑通道已经连通，但当前提示词或参考图被服务商自己的审核与改写链路拦截了。',
      fixHint:
        '我已经把本地适配层切到更稳的图生图接口。如果还有失败，优先缩短 Prompt、避免平台会自动改写成参数串的句子，或切换到当前 key 真正可用的图像编辑模型。',
    };
  }

  if (/model_not_found|无可用渠道|invalid_request/i.test(detailText)) {
    return {
      possibleCause: '当前 key 在所选分组下没有开通对应图像模型通道。',
      fixHint: '请在服务商后台确认图像编辑模型可用；当前这把 key 实测 `qwen-image-edit` 更稳定，其他候选模型部分不可用。',
    };
  }

  if (/example\.com|--oref URL|Image link format error/i.test(detailText)) {
    return {
      possibleCause: '上游服务在改写参考图请求时把真实参考图降级成了占位链接，所以角色一致性会失真。',
      fixHint: '我已经改成本地直接走 `images/edits` 图生图接口，不再依赖那条容易把参考图改坏的聊天图像链路。请重跑新的 workflow，不要看旧历史结果。',
    };
  }

  return {
    possibleCause: null,
    fixHint: null,
  };
}

function normalizePaperPromptOverrides(overrides: PaperPromptOverrides): PaperPromptOverrides {
  return {
    thinking: overrides.thinking.trim(),
    surprise: overrides.surprise.trim(),
    angry: overrides.angry.trim(),
    cg01: overrides.cg01.trim(),
    cg02: overrides.cg02.trim(),
  };
}

async function fetchWithTimeout(input: RequestInfo | URL, init?: RequestInit, timeoutMs = 30000) {
  const controller = new AbortController();
  const id = window.setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(input, { ...init, signal: controller.signal });
    return response;
  } finally {
    window.clearTimeout(id);
  }
}

async function startPaperWorkflowRequest(
  file: File,
  promptOverrides: PaperPromptOverrides,
  aiConcurrencyEnabled: boolean,
  settings: SettingsState,
  copy: UiCopySet['paper'],
) {
  if (requiresHostedApiBase(settings)) {
    throw new Error(copy.hostedApiRequired);
  }

  await ensureLocalApiProbed();
  const requestUrl = buildApiUrl(settings, '/api/workflows');
  if (detectWorkflowApiBaseIssue(getEffectiveApiBase(settings)) === 'direct-model-endpoint') {
    throw new Error(`${copy.apiWrongEndpoint} ${copy.apiWrongEndpointHint} ${copy.requestUrlLabel}: ${requestUrl}`);
  }

  const formData = new FormData();
  formData.append('image', file);
  formData.append('promptOverrides', JSON.stringify(normalizePaperPromptOverrides(promptOverrides)));
  formData.append('aiConcurrencyEnabled', String(aiConcurrencyEnabled));

  const response = await fetchWithTimeout(requestUrl, {
    method: 'POST',
    body: formData,
    headers: buildApiHeaders(settings),
  }, 60000);
  const payload = await parseJsonResponse(response);

  if (!response.ok) {
    throw new Error(
      buildPaperApiErrorMessage({
        response,
        payload,
        requestUrl,
        settings,
        copy,
        fallback: copy.networkStartError,
      }),
    );
  }

  return payload.workflow as PaperWorkflow;
}

async function redoPaperWorkflowStepRequest(
  workflowId: string,
  targetStep: PaperWorkflowStepName,
  promptOverrides: PaperPromptOverrides,
  aiConcurrencyEnabled: boolean,
  settings: SettingsState,
  copy: UiCopySet['paper'],
) {
  if (requiresHostedApiBase(settings)) {
    throw new Error(copy.hostedApiRequired);
  }

  await ensureLocalApiProbed();
  const requestUrl = buildApiUrl(settings, `/api/workflows/${workflowId}/rerun`);
  if (detectWorkflowApiBaseIssue(getEffectiveApiBase(settings)) === 'direct-model-endpoint') {
    throw new Error(`${copy.apiWrongEndpoint} ${copy.apiWrongEndpointHint} ${copy.requestUrlLabel}: ${requestUrl}`);
  }

  const response = await fetchWithTimeout(requestUrl, {
    method: 'POST',
    headers: buildApiHeaders(settings, {
      'Content-Type': 'application/json',
    }),
    body: JSON.stringify({
      targetStep,
      promptOverrides: normalizePaperPromptOverrides(promptOverrides),
      aiConcurrencyEnabled,
    }),
  }, 60000);
  const payload = await parseJsonResponse(response);

  if (!response.ok) {
    throw new Error(
      buildPaperApiErrorMessage({
        response,
        payload,
        requestUrl,
        settings,
        copy,
        fallback: copy.networkStartError,
      }),
    );
  }

  return payload.workflow as PaperWorkflow;
}

async function fetchPaperWorkflowRequest(workflowId: string, settings: SettingsState, copy: UiCopySet['paper']) {
  if (requiresHostedApiBase(settings)) {
    throw new Error(copy.hostedApiRequired);
  }

  await ensureLocalApiProbed();
  const requestUrl = buildApiUrl(settings, `/api/workflows/${workflowId}`);
  if (detectWorkflowApiBaseIssue(getEffectiveApiBase(settings)) === 'direct-model-endpoint') {
    throw new Error(`${copy.apiWrongEndpoint} ${copy.apiWrongEndpointHint} ${copy.requestUrlLabel}: ${requestUrl}`);
  }

  const response = await fetchWithTimeout(requestUrl, {
    headers: buildApiHeaders(settings),
  });
  const payload = await parseJsonResponse(response);

  if (!response.ok) {
    throw new Error(
      buildPaperApiErrorMessage({
        response,
        payload,
        requestUrl,
        settings,
        copy,
        fallback: copy.networkFetchError,
      }),
    );
  }

  return payload as PaperWorkflow;
}

async function uploadFrontendCutout(options: {
  workflowId: string;
  expressionName: ExpressionName;
  sourceUrl: string;
  settings: SettingsState;
  copy: UiCopySet['paper'];
}) {
  const { workflowId, expressionName, sourceUrl, settings, copy } = options;

  if (requiresHostedApiBase(settings)) {
    throw new Error(copy.hostedApiRequired);
  }

  await ensureLocalApiProbed();
  const requestUrl = buildApiUrl(settings, `/api/workflows/${workflowId}/cutouts/${expressionName}`);
  if (detectWorkflowApiBaseIssue(getEffectiveApiBase(settings)) === 'direct-model-endpoint') {
    throw new Error(`${copy.apiWrongEndpoint} ${copy.apiWrongEndpointHint} ${copy.requestUrlLabel}: ${requestUrl}`);
  }

  const resolvedSourceUrl = sourceUrl.startsWith('/') ? buildApiUrl(settings, sourceUrl) : sourceUrl;
  const imageResponse = await fetch(resolvedSourceUrl, { credentials: 'omit' });
  if (!imageResponse.ok) {
    throw new Error(`Failed to fetch source image for cutout: ${imageResponse.status}`);
  }
  const sourceBlob = await imageResponse.blob();
  const cutoutBlob = await generateCutoutPngBlob(sourceBlob, buildApiUrl(settings, '/api/cutout-assets/v1/'));

  const form = new FormData();
  form.append('image', cutoutBlob, `expression-${expressionName}-cutout.png`);

  const response = await fetch(requestUrl, {
    method: 'POST',
    headers: buildApiHeaders(settings),
    body: form,
  });
  const payload = await parseJsonResponse(response);

  if (!response.ok) {
    throw new Error(
      buildPaperApiErrorMessage({
        response,
        payload,
        requestUrl,
        settings,
        copy,
        fallback: copy.networkFetchError,
      }),
    );
  }

  return payload.workflow as PaperWorkflow;
}

function getStatusLabelKey(status: TransferStatus): StatusLabelKey {
  switch (status) {
    case 'idle':
      return 'statusIdle';
    case 'running':
      return 'statusRunning';
    case 'success':
      return 'statusSuccess';
    case 'error':
      return 'statusError';
  }
}

function ConfirmReturnModal({
  copy,
  isDirty,
  onCancel,
  onConfirm,
}: {
  copy: UiCopySet;
  isDirty: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const [isClosing, setIsClosing] = useState(false);

  function requestClose() {
    setIsClosing(true);
    window.setTimeout(onCancel, 220);
  }

  function requestConfirm() {
    setIsClosing(true);
    window.setTimeout(onConfirm, 220);
  }

  if (typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <div className={`modal-backdrop ${isClosing ? 'closing' : 'opening'}`} role="presentation" onClick={requestClose}>
      <section
        className={`modal-card confirm-modal modal-surface ${isClosing ? 'closing' : 'opening'}`}
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
      >
        <button className="modal-close" type="button" onClick={requestClose} aria-label="Close">
          ×
        </button>
        <p className="section-label">{copy.confirmReturnTitle}</p>
        <h2>{copy.confirmReturnTitle}</h2>
        <p className="modal-description">{isDirty ? copy.confirmReturnDirty : copy.confirmReturnClean}</p>
        <div className="confirm-actions">
          <button className="secondary-button" type="button" onClick={requestClose}>
            {copy.continueEdit}
          </button>
          <button className="primary-button" type="button" onClick={requestConfirm}>
            {copy.confirmReturnButton}
          </button>
        </div>
      </section>
    </div>,
    document.body,
  );
}

function ConfirmActionModal({
  title,
  description,
  cancelLabel,
  confirmLabel,
  onCancel,
  onConfirm,
}: {
  title: string;
  description: string;
  cancelLabel: string;
  confirmLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const [isClosing, setIsClosing] = useState(false);

  function requestClose() {
    setIsClosing(true);
    window.setTimeout(onCancel, 220);
  }

  function requestConfirm() {
    setIsClosing(true);
    window.setTimeout(onConfirm, 220);
  }

  if (typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <div className={`modal-backdrop ${isClosing ? 'closing' : 'opening'}`} role="presentation" onClick={requestClose}>
      <section
        className={`modal-card confirm-modal modal-surface ${isClosing ? 'closing' : 'opening'}`}
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
      >
        <button className="modal-close" type="button" onClick={requestClose} aria-label="Close">
          ×
        </button>
        <p className="section-label">{title}</p>
        <h2>{title}</h2>
        <p className="modal-description">{description}</p>
        <div className="confirm-actions">
          <button className="secondary-button" type="button" onClick={requestClose}>
            {cancelLabel}
          </button>
          <button className="primary-button" type="button" onClick={requestConfirm}>
            {confirmLabel}
          </button>
        </div>
      </section>
    </div>,
    document.body,
  );
}

function TagPickerModal({
  open,
  title,
  categories,
  selected,
  onToggle,
  onClose,
  onApply,
  copy,
}: {
  open: boolean;
  title: string;
  categories: readonly { readonly name: string; readonly tags: readonly string[] }[];
  selected: Set<string>;
  onToggle: (tag: string) => void;
  onClose: () => void;
  onApply: () => void;
  copy: UiCopySet;
}) {
  const [filter, setFilter] = useState('');
  const filtered = filter.trim()
    ? categories.map((c) => ({ ...c, tags: c.tags.filter((t) => t.toLowerCase().includes(filter.toLowerCase())) })).filter((c) => c.tags.length > 0)
    : categories.map((c) => ({ ...c, tags: [...c.tags] }));

  if (!open) return null;

  return createPortal(
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <section className="modal-card modal-card-wide" style={{ maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
        <h2>{title}</h2>
        <input
          className="settings-input"
          type="text"
          placeholder={copy.tagPicker.filterPlaceholder}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ marginBottom: 12 }}
        />
        <div style={{ overflow: 'auto', flex: 1, gap: 16, display: 'flex', flexDirection: 'column' }}>
          {filtered.map((cat) => (
            <div key={cat.name}>
              <h4 style={{ margin: '8px 0', fontSize: 14, color: '#8aa4c0' }}>{cat.name}</h4>
              <div className="toggle-grid" style={{ gap: 6 }}>
                {cat.tags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    className={`toggle-chip ${selected.has(tag) ? 'active' : ''}`}
                    onClick={() => onToggle(tag)}
                  >
                    <span className="toggle-chip-dot" />
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="confirm-actions" style={{ marginTop: 12 }}>
          <button className="secondary-button" type="button" onClick={onClose}>
            {copy.tagPicker.close}
          </button>
          <button className="primary-button" type="button" onClick={onApply}>
            {copy.tagPicker.apply} ({selected.size})
          </button>
        </div>
      </section>
    </div>,
    document.body,
  );
}

function DraggableErrorPanel({
  error,
  onClose,
  onCopy,
  onDownload,
  onRetry,
  copy,
}: {
  error: TransferError | null;
  onClose: () => void;
  onCopy: () => void;
  onDownload: () => void;
  onRetry: () => void;
  copy: UiCopySet;
}) {
  const [pos, setPos] = useState({ x: 120, y: 120 });
  const [dragging, setDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  if (!error) return null;

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    dragOffset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
  };

  useEffect(() => {
    if (!dragging) return;
    const handleMove = (e: MouseEvent) => {
      setPos({
        x: Math.max(0, Math.min(window.innerWidth - 400, e.clientX - dragOffset.current.x)),
        y: Math.max(0, Math.min(window.innerHeight - 300, e.clientY - dragOffset.current.y)),
      });
    };
    const handleUp = () => setDragging(false);
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };
  }, [dragging]);

  return (
    <div
      className="tool-card"
      style={{
        position: 'fixed',
        left: pos.x,
        top: pos.y,
        width: 420,
        maxHeight: '70vh',
        overflow: 'auto',
        zIndex: 200,
        boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
        border: '1px solid rgba(244,90,90,0.4)',
      }}
    >
      <div
        className="tool-card-header"
        onMouseDown={handleMouseDown}
        style={{ cursor: dragging ? 'grabbing' : 'grab', userSelect: 'none' }}
      >
        <div>
          <span className="card-caption" style={{ color: '#f45a5a' }}>{copy.errorPanel.title}</span>
          <h3 style={{ color: '#f45a5a' }}>{error.code}</h3>
        </div>
        <button className="secondary-button small-button" type="button" onClick={onClose}>
          ✕
        </button>
      </div>
      <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div>
          <strong style={{ color: '#8aa4c0', fontSize: 12 }}>{copy.errorPanel.stage}</strong>
          <p style={{ margin: '4px 0 0' }}>{error.stage}</p>
        </div>
        <div>
          <strong style={{ color: '#8aa4c0', fontSize: 12 }}>{copy.errorPanel.message}</strong>
          <p style={{ margin: '4px 0 0' }}>{error.message}</p>
        </div>
        <div>
          <strong style={{ color: '#8aa4c0', fontSize: 12 }}>{copy.errorPanel.hint}</strong>
          <p style={{ margin: '4px 0 0', color: '#f59e0b' }}>{error.hint}</p>
        </div>
        <div>
          <strong style={{ color: '#8aa4c0', fontSize: 12 }}>{copy.errorPanel.details}</strong>
          <pre className="code-block" style={{ maxHeight: 160, overflow: 'auto', marginTop: 4, fontSize: 12 }}>
            {JSON.stringify(error.details, null, 2)}
          </pre>
        </div>
        <div className="mini-action-row" style={{ marginTop: 4 }}>
          <button className="secondary-button small-button" type="button" onClick={onCopy}>{copy.copyText}</button>
          <button className="secondary-button small-button" type="button" onClick={onDownload}>{copy.downloadJson}</button>
          <button className="primary-button small-button" type="button" onClick={onRetry}>{copy.errorPanel.retry}</button>
        </div>
      </div>
    </div>
  );
}

function CollapsibleCodePanel({
  title,
  description,
  code,
  actions,
  copy,
  defaultOpen = false,
  tone = 'default',
  autoOpenSignal,
}: {
  title: string;
  description: string;
  code: string;
  actions?: ReactNode;
  copy: UiCopySet;
  defaultOpen?: boolean;
  tone?: 'default' | 'error';
  autoOpenSignal?: string | null;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  useEffect(() => {
    if (autoOpenSignal) {
      setIsOpen(true);
    }
  }, [autoOpenSignal]);

  return (
    <article className={`result-panel collapsible-panel ${tone === 'error' ? 'error' : ''} ${isOpen ? 'open' : 'collapsed'}`}>
      <button className="collapsible-toggle" type="button" onClick={() => { playSound(isOpen ? 'collapse' : 'expand'); setIsOpen((current) => !current); }} aria-expanded={isOpen}>
        <div className="collapsible-copy">
          <strong>{title}</strong>
          <p>{description}</p>
        </div>
        <span className="collapsible-state">{isOpen ? copy.hideDetails : copy.showDetails}</span>
      </button>

      {isOpen ? (
        <div className="collapsible-body">
          <div className="code-block">{code}</div>
          {actions ? <div className="mini-action-row">{actions}</div> : null}
        </div>
      ) : null}
    </article>
  );
}

function ExportOptionsModal({
  copy,
  promptCopy,
  onClose,
  onExportHtml,
  onExportText,
  onExportJson,
  onExportAll,
}: {
  copy: UiCopySet;
  promptCopy: UiCopySet['prompt'];
  onClose: () => void;
  onExportHtml: () => void;
  onExportText: () => void;
  onExportJson: () => void;
  onExportAll: () => void;
}) {
  const [isClosing, setIsClosing] = useState(false);

  function requestClose() {
    setIsClosing(true);
    window.setTimeout(onClose, 220);
  }

  function handleExport(action: () => void) {
    action();
    requestClose();
  }

  if (typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <div className={`modal-backdrop ${isClosing ? 'closing' : 'opening'}`} role="presentation" onClick={requestClose}>
      <section
        className={`modal-card modal-surface export-options-modal ${isClosing ? 'closing' : 'opening'}`}
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
      >
        <button className="modal-close" type="button" onClick={requestClose} aria-label="Close">
          ×
        </button>
        <p className="section-label">{promptCopy.exportOptionsTitle}</p>
        <h2>{promptCopy.exportOptionsTitle}</h2>
        <p className="modal-description">{promptCopy.exportOptionsHint}</p>
        <div className="export-option-grid">
          <button className="secondary-button export-option-button" type="button" onClick={() => handleExport(onExportHtml)}>
            {promptCopy.exportHtmlOption}
          </button>
          <button className="secondary-button export-option-button" type="button" onClick={() => handleExport(onExportText)}>
            {promptCopy.exportTextOption}
          </button>
          <button className="secondary-button export-option-button" type="button" onClick={() => handleExport(onExportJson)}>
            {promptCopy.exportJsonOption}
          </button>
          <button className="primary-button export-option-button" type="button" onClick={() => handleExport(onExportAll)}>
            {promptCopy.exportAllOption}
          </button>
        </div>
        <div className="confirm-actions">
          <button className="secondary-button" type="button" onClick={requestClose}>
            {copy.continueEdit}
          </button>
        </div>
      </section>
    </div>,
    document.body,
  );
}

type ToolbarGroupKey = 'font' | 'style' | 'paragraph' | 'insert' | 'history';
type CustomInsertKind = 'callout' | 'details' | 'image' | 'badge' | 'html';
type EditorFontOption = { value: string; label: string; custom?: boolean };

const editorFontOptionsBase: EditorFontOption[] = [
  { value: "'Noto Sans SC', 'PingFang SC', sans-serif", label: 'Noto Sans SC' },
  { value: "'PingFang SC', 'Helvetica Neue', sans-serif", label: 'PingFang SC' },
  { value: "'Source Han Sans SC', 'Noto Sans SC', sans-serif", label: 'Source Han Sans' },
  { value: "'HarmonyOS Sans SC', 'Noto Sans SC', sans-serif", label: 'HarmonyOS Sans' },
  { value: "'IBM Plex Sans', 'Noto Sans', sans-serif", label: 'IBM Plex Sans' },
  { value: "'Inter', 'Segoe UI', sans-serif", label: 'Inter' },
  { value: "'DM Sans', 'Inter', sans-serif", label: 'DM Sans' },
  { value: "'Manrope', 'Inter', sans-serif", label: 'Manrope' },
  { value: "'Outfit', 'Inter', sans-serif", label: 'Outfit' },
  { value: "'Plus Jakarta Sans', 'Inter', sans-serif", label: 'Plus Jakarta Sans' },
  { value: "'Space Grotesk', 'Inter', sans-serif", label: 'Space Grotesk' },
  { value: "'Sora', 'Inter', sans-serif", label: 'Sora' },
  { value: "'Alegreya Sans', 'Noto Sans', sans-serif", label: 'Alegreya Sans' },
  { value: "'Nunito Sans', 'Noto Sans', sans-serif", label: 'Nunito Sans' },
  { value: "'Noto Serif SC', 'Songti SC', serif", label: 'Noto Serif SC' },
  { value: "'Songti SC', 'Noto Serif SC', serif", label: 'Songti SC' },
  { value: "'Source Han Serif SC', 'Noto Serif SC', serif", label: 'Source Han Serif' },
  { value: "'Baskerville', 'Georgia', serif", label: 'Baskerville' },
  { value: "'Cormorant Garamond', 'Times New Roman', serif", label: 'Cormorant Garamond' },
  { value: "'Playfair Display', 'Georgia', serif", label: 'Playfair Display' },
  { value: "'Merriweather', 'Georgia', serif", label: 'Merriweather' },
  { value: "'Libre Baskerville', 'Georgia', serif", label: 'Libre Baskerville' },
  { value: "'EB Garamond', 'Times New Roman', serif", label: 'EB Garamond' },
  { value: "'LXGW WenKai', 'Kaiti SC', serif", label: 'LXGW WenKai' },
  { value: "'Kaiti SC', 'STKaiti', serif", label: 'KaiTi' },
  { value: "'ZCOOL XiaoWei', 'Kaiti SC', serif", label: 'ZCOOL XiaoWei' },
  { value: "'Ma Shan Zheng', 'KaiTi', cursive", label: 'Ma Shan Zheng' },
  { value: "'Zhi Mang Xing', cursive", label: 'Zhi Mang Xing' },
  { value: "'JetBrains Mono', 'SFMono-Regular', monospace", label: 'JetBrains Mono' },
  { value: "'IBM Plex Mono', 'JetBrains Mono', monospace", label: 'IBM Plex Mono' },
  { value: "'Fira Code', 'JetBrains Mono', monospace", label: 'Fira Code' },
  { value: "'Space Mono', 'JetBrains Mono', monospace", label: 'Space Mono' },
];

const editorFontSizePresets = ['10px', '12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '40px', '48px', '64px'];
const editorLineHeightPresets = ['1', '1.15', '1.3', '1.5', '1.7', '2', '2.4', '3'];
const editorBlockStylePresets = [
  { value: 'p', label: 'P' },
  { value: 'h1', label: 'H1' },
  { value: 'h2', label: 'H2' },
  { value: 'h3', label: 'H3' },
  { value: 'h4', label: 'H4' },
  { value: 'h5', label: 'H5' },
  { value: 'h6', label: 'H6' },
  { value: 'blockquote', label: 'Quote' },
  { value: 'pre', label: 'Pre' },
];

const PLACEHOLDER_IMAGE =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MDAiIGhlaWdodD0iNDgwIiB2aWV3Qm94PSIwIDAgODAwIDQ4MCI+PHJlY3Qgd2lkdGg9IjgwMCIgaGVpZ2h0PSI0ODAiIGZpbGw9IiUyM2UwZTBlMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIyNCIgZmlsbD0iJTIzOTk5Ij5QbGFjZWhvbGRlcjwvdGV4dD48L3N2Zz4=';

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const SANITIZE_ALLOWED_TAGS = new Set([
  'p', 'br', 'span', 'div', 'b', 'strong', 'i', 'em', 'u', 's', 'strike', 'del',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'a', 'ul', 'ol', 'li', 'blockquote',
  'pre', 'code', 'img', 'figure', 'figcaption', 'hr', 'details', 'summary',
  'aside', 'table', 'thead', 'tbody', 'tr', 'td', 'th',
]);

const SANITIZE_ALLOWED_ATTRS: Record<string, Set<string>> = {
  '*': new Set(['class', 'title']),
  a: new Set(['href', 'target', 'rel']),
  img: new Set(['src', 'alt']),
};

function sanitizeHtml(raw: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(raw, 'text/html');

  function walk(node: Node): Node | null {
    if (node.nodeType === Node.TEXT_NODE) {
      return document.createTextNode(node.textContent || '');
    }

    if (node.nodeType !== Node.ELEMENT_NODE) {
      return null;
    }

    const el = node as Element;
    const tag = el.tagName.toLowerCase();

    if (!SANITIZE_ALLOWED_TAGS.has(tag)) {
      const fragment = document.createDocumentFragment();
      el.childNodes.forEach((child) => {
        const cleaned = walk(child);
        if (cleaned) fragment.appendChild(cleaned);
      });
      return fragment;
    }

    const clean = document.createElement(tag);
    const allowedAttrs = new Set([
      ...(SANITIZE_ALLOWED_ATTRS['*'] || []),
      ...(SANITIZE_ALLOWED_ATTRS[tag] || []),
    ]);

    Array.from(el.attributes).forEach((attr) => {
      const name = attr.name.toLowerCase();
      if (!allowedAttrs.has(name)) return;
      if (name.startsWith('on')) return;
      let value = attr.value;
      if ((name === 'href' || name === 'src') && /^javascript:/i.test(value)) return;
      clean.setAttribute(name, value);
    });

    el.childNodes.forEach((child) => {
      const cleaned = walk(child);
      if (cleaned) clean.appendChild(cleaned);
    });

    return clean;
  }

  const fragment = document.createDocumentFragment();
  Array.from(doc.body.childNodes).forEach((child) => {
    const cleaned = walk(child);
    if (cleaned) fragment.appendChild(cleaned);
  });

  const wrapper = document.createElement('div');
  wrapper.appendChild(fragment);
  return wrapper.innerHTML;
}

function normalizeFontSizeInput(value: string) {
  const numeric = Number.parseFloat(String(value).replace(/px/gi, '').trim());
  const safe = Number.isFinite(numeric) ? Math.min(200, Math.max(5, numeric)) : 16;
  return `${Math.round(safe)}px`;
}

function normalizeLineHeightInput(value: string) {
  const numeric = Number.parseFloat(String(value).trim());
  const safe = Number.isFinite(numeric) ? Math.min(4, Math.max(0.8, numeric)) : 1.7;
  return String(Number(safe.toFixed(2)));
}

function normalizeShortcutKeyName(key: string) {
  const lowered = key.toLowerCase();
  if (lowered === ' ') return 'space';
  if (lowered === 'esc') return 'escape';
  return lowered;
}

function matchesShortcut(event: ReactKeyboardEvent<HTMLElement>, shortcut: string) {
  const tokens = shortcut
    .split('+')
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);

  if (tokens.length === 0) {
    return false;
  }

  const modifierTokens = new Set(['ctrl', 'control', 'cmd', 'command', 'meta', 'mod', 'shift', 'alt', 'option']);
  const wantsCtrl = tokens.some((token) => ['ctrl', 'control', 'mod'].includes(token));
  const wantsMeta = tokens.some((token) => ['cmd', 'command', 'meta'].includes(token));
  const wantsShift = tokens.includes('shift');
  const wantsAlt = tokens.some((token) => ['alt', 'option'].includes(token));
  const keyToken = tokens.find((token) => !modifierTokens.has(token)) ?? '';
  const ctrlLikePressed = event.ctrlKey || event.metaKey;

  if (Boolean(wantsCtrl || wantsMeta) !== ctrlLikePressed) return false;
  if (wantsMeta && !event.metaKey) return false;
  if (wantsShift !== event.shiftKey) return false;
  if (wantsAlt !== event.altKey) return false;
  if (!keyToken) return true;

  return normalizeShortcutKeyName(event.key) === keyToken;
}

function EditorExperimentalModal({
  title,
  note,
  onClose,
  children,
}: {
  title: string;
  note: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const [isClosing, setIsClosing] = useState(false);

  function requestClose() {
    setIsClosing(true);
    window.setTimeout(onClose, 220);
  }

  if (typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <div className={`modal-backdrop ${isClosing ? 'closing' : 'opening'}`} role="presentation" onClick={requestClose}>
      <section
        className={`modal-card modal-surface editor-experimental-modal ${isClosing ? 'closing' : 'opening'}`}
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
      >
        <button className="modal-close" type="button" onClick={requestClose} aria-label="Close">
          ×
        </button>
        <h2>{title}</h2>
        {children}
        <p className="tiny-copy editor-modal-note">{note}</p>
      </section>
    </div>,
    document.body,
  );
}

export function StyleTransferPage({
  appSubtitle,
  backHome,
  openSettings,
  privacyNote,
  pageTitle,
  pageDescription,
  settings: _settings,
  language,
  onBack,
  onOpenSettings,
}: SharedPageProps) {
  const copy = localizedUiCopy[language];
  const transfer = copy.transfer;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const defaultConfig = {
    model: 'Anime Transfer XL v4',
    prompt: 'soft watercolor anime shading, cinematic key light, refined outline',
    negativePrompt: 'lowres, muddy colors, over-sharpened edges, broken anatomy',
    temperature: 0.78,
    topP: 0.92,
    topK: 48,
    seed: 240315,
    steps: 28,
    strength: 0.74,
    cfg: 6.8,
    needCutout: true,
    keepPalette: true,
    preservePose: true,
    faceLock: true,
    detailBoost: true,
    aspectRatio: '1:1',
    imageSize: '1024x1024',
    styleIntensity: 0.75,
    lineArtStyle: 'clean',
    colorScheme: 'vibrant',
    backgroundType: 'simple',
    lightingStyle: 'dramatic',
    cameraAngle: 'three-quarter',
    characterMood: 'calm',
    outfitDetail: 'school uniform',
    eyeStyle: 'detailed',
    hairStyle: 'long straight',
    skinTexture: 'smooth',
    extraPositiveTags: [] as string[],
    extraNegativeTags: [] as string[],
  };

  const [persistedState] = useState(() =>
    readLocalState(STYLE_TRANSFER_STORAGE_KEY, {
      inputFileName: '',
      config: defaultConfig,
      savedSnapshot: '',
    }),
  );
  const [inputFileName, setInputFileName] = useState(persistedState.inputFileName);
  const [inputPreviewUrl, setInputPreviewUrl] = useState('');
  const [status, setStatus] = useState<TransferStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<WorkflowLog[]>([]);
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState<TransferError | null>(null);
  const [showErrorPanel, setShowErrorPanel] = useState(false);
  const [runNonce, setRunNonce] = useState(0);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [config, setConfig] = useState({ ...defaultConfig, ...persistedState.config });
  const [isParamsOpen, setIsParamsOpen] = useState(true);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [isResultOpen, setIsResultOpen] = useState(true);
  const [isLogsOpen, setIsLogsOpen] = useState(true);
  const [isPositiveTagOpen, setIsPositiveTagOpen] = useState(false);
  const [isNegativeTagOpen, setIsNegativeTagOpen] = useState(false);
  const [tagDraft, setTagDraft] = useState<Set<string>>(new Set());
  const statusLabelKey = getStatusLabelKey(status);

  const invisibleSuffix = useMemo(() => buildInvisiblePromptSuffix(config), [config]);
  const effectivePrompt = useMemo(() => {
    const base = config.prompt;
    const tags = config.extraPositiveTags.length > 0 ? config.extraPositiveTags.join(', ') : '';
    const suffix = invisibleSuffix;
    const parts = [base, tags, suffix].filter(Boolean);
    return parts.join(', ');
  }, [config.prompt, config.extraPositiveTags, invisibleSuffix]);

  const effectiveNegativePrompt = useMemo(() => {
    const base = config.negativePrompt;
    const tags = config.extraNegativeTags.length > 0 ? config.extraNegativeTags.join(', ') : '';
    return [base, tags].filter(Boolean).join(', ');
  }, [config.negativePrompt, config.extraNegativeTags]);

  const currentSnapshot = JSON.stringify({ inputFileName, config });
  const [savedSnapshot, setSavedSnapshot] = useState(persistedState.savedSnapshot || currentSnapshot);
  const isDirty = currentSnapshot !== savedSnapshot;
  useBeforeUnloadGuard(isDirty);

  useEffect(() => {
    writeLocalState(STYLE_TRANSFER_STORAGE_KEY, { inputFileName, config, savedSnapshot });
  }, [config, inputFileName, savedSnapshot]);

  useEffect(() => {
    if (status !== 'running') return;
    const checkpoints = [
      { progress: 12, level: 'info' as const, text: 'Queue accepted. Starting preflight validation.' },
      { progress: 28, level: 'debug' as const, text: 'Input image decoded. Character framing and silhouette analysis completed.' },
      { progress: 46, level: 'info' as const, text: 'Prompt embedding compiled. Sampling plan dispatched to the selected model.' },
      { progress: 67, level: 'info' as const, text: 'High-frequency detail pass is running. Face-lock and palette preservation are being enforced.' },
      { progress: 84, level: 'debug' as const, text: 'Post-process hooks completed. Matte, color cleanup, and metadata packaging are now running.' },
      { progress: 100, level: 'success' as const, text: 'Workflow finished and the result package is ready.' },
    ];
    const shouldFail = config.temperature > 1.35 && config.topP > 0.94;
    let index = 0;
    const timer = window.setInterval(() => {
      const nextStep = checkpoints[index];
      if (!nextStep) { window.clearInterval(timer); return; }
      setProgress(nextStep.progress);
      setLogs((current) => [...current, { time: timestamp(), level: nextStep.level, text: nextStep.text }]);
      index += 1;
      if (index === checkpoints.length) {
        window.clearInterval(timer);
        if (shouldFail) {
          const runtimeError: TransferError = {
            code: 'STYLE_TRANSFER_SAMPLING_DIVERGENCE',
            stage: 'sampler/high-frequency-pass',
            message: transfer.runtimeError,
            hint: transfer.errorHintRuntime,
            details: { model: config.model, temperature: config.temperature, topP: config.topP, topK: config.topK, steps: config.steps, preservePose: config.preservePose, faceLock: config.faceLock, effectivePrompt, effectiveNegativePrompt },
          };
          setStatus('error');
          setError(runtimeError);
          setShowErrorPanel(true);
          setResult(null);
          setLogs((current) => [...current, { time: timestamp(), level: 'error', text: `${runtimeError.code}: ${runtimeError.message}` }]);
          return;
        }
        setStatus('success');
        setError(null);
        setShowErrorPanel(false);
        setResult({
          workflowId: `st-${Date.now()}`,
          input: inputFileName,
          model: config.model,
          outputName: inputFileName ? inputFileName.replace(/\.[^.]+$/, '-styled.png') : 'styled-output.png',
          steps: config.steps,
          seed: config.seed,
          cutout: config.needCutout,
          effectivePrompt,
          effectiveNegativePrompt,
          message: transfer.successMessage,
        });
      }
    }, 520);
    return () => window.clearInterval(timer);
  }, [config, inputFileName, runNonce, status, transfer.runtimeError, transfer.successMessage, effectivePrompt, effectiveNegativePrompt]);

  useEffect(() => {
    return () => { if (inputPreviewUrl) URL.revokeObjectURL(inputPreviewUrl); };
  }, [inputPreviewUrl]);

  function updateConfig<K extends keyof typeof config>(key: K, value: (typeof config)[K]) {
    setConfig((current) => ({ ...current, [key]: value }));
  }

  function handlePickFile() { fileInputRef.current?.click(); }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (inputPreviewUrl) URL.revokeObjectURL(inputPreviewUrl);
    setInputFileName(file.name);
    setInputPreviewUrl(URL.createObjectURL(file));
    setLogs((current) => [...current, { time: timestamp(), level: 'info', text: `Input file selected: ${file.name}` }]);
  }

  function startWorkflow() {
    if (!inputFileName) {
      const validationError: TransferError = {
        code: 'STYLE_TRANSFER_INPUT_MISSING',
        stage: 'preflight/input',
        message: transfer.validationError,
        hint: transfer.errorHintValidation,
        details: { fileSelected: false, status: 'stopped-before-run' },
      };
      setStatus('error');
      setProgress(0);
      setResult(null);
      setError(validationError);
      setShowErrorPanel(true);
      setLogs([{ time: timestamp(), level: 'error', text: `${validationError.code}: ${validationError.message}` }]);
      return;
    }
    setStatus('running');
    setProgress(0);
    setError(null);
    setShowErrorPanel(false);
    setResult(null);
    setLogs([
      { time: timestamp(), level: 'info', text: 'Workflow submitted to the local queue.' },
      { time: timestamp(), level: 'debug', text: `Debug context prepared for ${inputFileName}.` },
      { time: timestamp(), level: 'debug', text: `Effective prompt: ${effectivePrompt.slice(0, 200)}...` },
    ]);
    setRunNonce((current) => current + 1);
  }

  function abortWorkflow() {
    setStatus('idle');
    setProgress(0);
    setLogs((current) => [...current, { time: timestamp(), level: 'error', text: 'Workflow aborted by the user.' }]);
  }

  function saveDraft() {
    setSavedSnapshot(currentSnapshot);
    setLogs((current) => [...current, { time: timestamp(), level: 'success', text: 'Current style-transfer configuration saved locally.' }]);
  }

  function resetWorkspaceView() {
    if (inputPreviewUrl) URL.revokeObjectURL(inputPreviewUrl);
    if (fileInputRef.current) fileInputRef.current.value = '';
    const nextConfig = { ...defaultConfig };
    const nextSnapshot = JSON.stringify({ inputFileName: '', config: nextConfig });
    setIsResetOpen(false);
    setInputFileName('');
    setInputPreviewUrl('');
    setStatus('idle');
    setProgress(0);
    setLogs([]);
    setResult(null);
    setError(null);
    setShowErrorPanel(false);
    setRunNonce(0);
    setConfig(nextConfig);
    setSavedSnapshot(nextSnapshot);
  }

  const configJson = JSON.stringify({ tool: 'style-transfer', inputFileName, config }, null, 2);
  const logsText = logs.map((entry) => `[${entry.time}] [${entry.level.toUpperCase()}] ${entry.text}`).join('\n');
  const resultJson = JSON.stringify(result ?? { state: 'waiting' }, null, 2);
  const errorJson = JSON.stringify(error ?? { state: 'none' }, null, 2);
  const debugJson = JSON.stringify({ workflowId: result?.workflowId ?? `draft-${Date.now()}`, status, progress, inputFileName, config, effectivePrompt, effectiveNegativePrompt, result, error, logs }, null, 2);

  return (
    <main className="feature-shell tool-page-shell">
      <header className="feature-header fade-up delay-1">
        <button className="secondary-button small-button" type="button" onClick={() => setIsConfirmOpen(true)}>{backHome}</button>
        <div className="feature-header-meta">
          <button className="secondary-button small-button" type="button" onClick={onOpenSettings}>{openSettings}</button>
        </div>
      </header>

      <section className="tool-workbench fade-up delay-2">
        <div className="tool-header">
          <div>
            <p className="section-label">{appSubtitle}</p>
            <h2>{pageTitle}</h2>
            <p>{pageDescription}</p>
          </div>
          <div className="tool-header-actions">
            <span className={`save-indicator ${isDirty ? 'dirty' : 'clean'}`}>{isDirty ? copy.dirty : copy.clean}</span>
            <button className="secondary-button small-button" type="button" onClick={() => setIsResetOpen(true)}>{copy.refreshWorkspace}</button>
            <button className="secondary-button small-button" type="button" onClick={saveDraft}>{copy.saveConfig}</button>
            <button className="secondary-button small-button" type="button" onClick={() => copyText(configJson)}>{copy.copyJson}</button>
            <button className="secondary-button small-button" type="button" onClick={() => downloadText('style-transfer-config.json', configJson, 'application/json')}>{copy.downloadJson}</button>
          </div>
        </div>

        <div className="tool-grid transfer-grid">
          <div className="tool-column">
            {/* Input Card */}
            <section className="tool-card">
              <div className="tool-card-header" style={{ cursor: 'pointer' }} onClick={() => { playSound(isParamsOpen ? 'collapse' : 'expand'); setIsParamsOpen((v) => !v); }} role="button" tabIndex={0}>
                <div>
                  <span className="card-caption">{transfer.inputTitle}</span>
                  <h3>{transfer.inputTitle}</h3>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <button className="secondary-button small-button" type="button" onClick={(e) => { e.stopPropagation(); handlePickFile(); }}>
                    {inputFileName ? copy.replaceImage : copy.chooseImage}
                  </button>
                  <span style={{ fontSize: 12, color: '#8aa4c0' }}>{isParamsOpen ? '▲' : '▼'}</span>
                </div>
              </div>
              <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/webp" hidden onChange={handleFileChange} />
              {isParamsOpen && (
                <>
                  <p className="muted-copy">{transfer.fileHint}</p>
                  <div className="preview-surface">
                    {inputPreviewUrl ? <img className="preview-image" src={inputPreviewUrl} alt={inputFileName} /> : <div className="preview-empty">{copy.noImage}</div>}
                  </div>
                  {inputFileName && <p className="tiny-copy">{inputFileName}</p>}
                </>
              )}
            </section>

            {/* Parameters Card */}
            <section className="tool-card">
              <div className="tool-card-header" style={{ cursor: 'pointer' }} onClick={() => { playSound(isParamsOpen ? 'collapse' : 'expand'); setIsParamsOpen((v) => !v); }} role="button" tabIndex={0}>
                <div>
                  <span className="card-caption">{transfer.paramsTitle}</span>
                  <h3>{transfer.paramsTitle}</h3>
                </div>
                <span style={{ fontSize: 12, color: '#8aa4c0' }}>{isParamsOpen ? '▲' : '▼'}</span>
              </div>
              {isParamsOpen && (
                <>
                  <div className="form-grid two-column">
                    <label className="field">
                      <span>{transfer.model}</span>
                      <select className="settings-input tool-select" value={config.model} onChange={(e) => updateConfig('model', e.target.value)}>
                        <option>Anime Transfer XL v4</option>
                        <option>Painterly Diffusion Mix</option>
                        <option>Paper2Gal Bridge Preview</option>
                        <option>gpt-image-2</option>
                      </select>
                    </label>
                    <label className="field">
                      <span>{transfer.seed}</span>
                      <input className="settings-input" type="number" value={config.seed} onChange={(e) => updateConfig('seed', Number(e.target.value))} />
                    </label>
                  </div>
                  <label className="field">
                    <span>{transfer.prompt}</span>
                    <textarea className="settings-textarea" value={config.prompt} onChange={(e) => updateConfig('prompt', e.target.value)} />
                  </label>
                  <div className="mini-action-row" style={{ marginBottom: 8 }}>
                    <button className="secondary-button small-button" type="button" onClick={() => { setTagDraft(new Set(config.extraPositiveTags)); setIsPositiveTagOpen(true); }}>{transfer.addPositiveTags} ({config.extraPositiveTags.length})</button>
                    <button className="secondary-button small-button" type="button" onClick={() => { setTagDraft(new Set(config.extraNegativeTags)); setIsNegativeTagOpen(true); }}>{transfer.addNegativeTags} ({config.extraNegativeTags.length})</button>
                  </div>
                  <label className="field">
                    <span>{transfer.negativePrompt}</span>
                    <textarea className="settings-textarea compact" value={config.negativePrompt} onChange={(e) => updateConfig('negativePrompt', e.target.value)} />
                  </label>

                  {/* Effective Prompt Preview */}
                  <div className="tool-card" style={{ marginTop: 12, background: 'rgba(79,157,247,0.06)' }}>
                    <span className="card-caption">{transfer.effectivePromptPreview}</span>
                    <p className="tiny-copy" style={{ color: '#8aa4c0', marginTop: 4 }}>{effectivePrompt}</p>
                    <p className="tiny-copy" style={{ color: '#f45a5a', marginTop: 4 }}>{effectiveNegativePrompt}</p>
                  </div>

                  <div className="slider-grid">
                    <RangeField label={transfer.temperature} min={0} max={2} step={0.01} value={config.temperature} onChange={(value) => updateConfig('temperature', value)} />
                    <RangeField label={transfer.topP} min={0} max={1} step={0.01} value={config.topP} onChange={(value) => updateConfig('topP', value)} />
                    <RangeField label={transfer.topK} min={1} max={128} step={1} value={config.topK} onChange={(value) => updateConfig('topK', value)} />
                    <RangeField label={transfer.steps} min={8} max={60} step={1} value={config.steps} onChange={(value) => updateConfig('steps', value)} />
                    <RangeField label={transfer.strength} min={0.1} max={1} step={0.01} value={config.strength} onChange={(value) => updateConfig('strength', value)} />
                    <RangeField label={transfer.cfg} min={1} max={14} step={0.1} value={config.cfg} onChange={(value) => updateConfig('cfg', value)} />
                  </div>

                  <div className="toggle-grid">
                    <ToggleChip label={transfer.needCutout} checked={config.needCutout} onToggle={() => updateConfig('needCutout', !config.needCutout)} />
                    <ToggleChip label={transfer.keepPalette} checked={config.keepPalette} onToggle={() => updateConfig('keepPalette', !config.keepPalette)} />
                    <ToggleChip label={transfer.preservePose} checked={config.preservePose} onToggle={() => updateConfig('preservePose', !config.preservePose)} />
                    <ToggleChip label={transfer.faceLock} checked={config.faceLock} onToggle={() => updateConfig('faceLock', !config.faceLock)} />
                    <ToggleChip label={transfer.detailBoost} checked={config.detailBoost} onToggle={() => updateConfig('detailBoost', !config.detailBoost)} />
                  </div>

                  {/* Advanced Parameters */}
                  <div className="tool-card-section" style={{ marginTop: 12 }}>
                    <button className="collapsible-toggle" type="button" onClick={() => setIsAdvancedOpen((v) => !v)} style={{ padding: '8px 0', width: '100%', textAlign: 'left' }}>
                      <strong>{transfer.advancedParams} {isAdvancedOpen ? '▲' : '▼'}</strong>
                      <p className="muted-copy" style={{ margin: 0 }}>{transfer.advancedParamsHint}</p>
                    </button>
                    {isAdvancedOpen && (
                      <div className="form-grid two-column" style={{ marginTop: 8 }}>
                        <label className="field">
                          <span>{transfer.aspectRatio}</span>
                          <select className="settings-input tool-select" value={config.aspectRatio} onChange={(e) => updateConfig('aspectRatio', e.target.value)}>
                            <option>1:1</option><option>4:3</option><option>3:4</option><option>16:9</option><option>9:16</option><option>2:3</option><option>3:2</option>
                          </select>
                        </label>
                        <label className="field">
                          <span>{transfer.imageSize}</span>
                          <select className="settings-input tool-select" value={config.imageSize} onChange={(e) => updateConfig('imageSize', e.target.value)}>
                            <option>512x512</option><option>768x768</option><option>1024x1024</option><option>1024x1536</option><option>1536x1024</option>
                          </select>
                        </label>
                        <RangeField label={transfer.styleIntensity} min={0} max={1} step={0.05} value={config.styleIntensity} onChange={(value) => updateConfig('styleIntensity', value)} />
                        <label className="field">
                          <span>{transfer.lineArtStyle}</span>
                          <select className="settings-input tool-select" value={config.lineArtStyle} onChange={(e) => updateConfig('lineArtStyle', e.target.value)}>
                            <option>clean</option><option>sketchy</option><option>thick</option><option>thin</option><option>none</option>
                          </select>
                        </label>
                        <label className="field">
                          <span>{transfer.colorScheme}</span>
                          <select className="settings-input tool-select" value={config.colorScheme} onChange={(e) => updateConfig('colorScheme', e.target.value)}>
                            <option>vibrant</option><option>pastel</option><option>muted</option><option>monochrome</option><option>neon</option><option>warm</option><option>cool</option>
                          </select>
                        </label>
                        <label className="field">
                          <span>{transfer.backgroundType}</span>
                          <select className="settings-input tool-select" value={config.backgroundType} onChange={(e) => updateConfig('backgroundType', e.target.value)}>
                            <option>simple</option><option>gradient</option><option>detailed</option><option>transparent</option><option>blurred</option>
                          </select>
                        </label>
                        <label className="field">
                          <span>{transfer.lightingStyle}</span>
                          <select className="settings-input tool-select" value={config.lightingStyle} onChange={(e) => updateConfig('lightingStyle', e.target.value)}>
                            <option>dramatic</option><option>soft</option><option>neon</option><option>natural</option><option>studio</option><option>backlight</option>
                          </select>
                        </label>
                        <label className="field">
                          <span>{transfer.cameraAngle}</span>
                          <select className="settings-input tool-select" value={config.cameraAngle} onChange={(e) => updateConfig('cameraAngle', e.target.value)}>
                            <option>three-quarter</option><option>front</option><option>profile</option><option>low-angle</option><option>high-angle</option><option>dutch</option><option>over-shoulder</option>
                          </select>
                        </label>
                        <label className="field">
                          <span>{transfer.characterMood}</span>
                          <select className="settings-input tool-select" value={config.characterMood} onChange={(e) => updateConfig('characterMood', e.target.value)}>
                            <option>calm</option><option>happy</option><option>serious</option><option>shy</option><option>confident</option><option>surprised</option><option>angry</option><option>sad</option>
                          </select>
                        </label>
                        <label className="field">
                          <span>{transfer.outfitDetail}</span>
                          <select className="settings-input tool-select" value={config.outfitDetail} onChange={(e) => updateConfig('outfitDetail', e.target.value)}>
                            <option>school uniform</option><option>casual wear</option><option>battle outfit</option><option>maid outfit</option><option>kimono</option><option>gothic lolita</option><option>sportswear</option><option>swimsuit</option><option>wedding dress</option><option>idol costume</option>
                          </select>
                        </label>
                        <label className="field">
                          <span>{transfer.eyeStyle}</span>
                          <select className="settings-input tool-select" value={config.eyeStyle} onChange={(e) => updateConfig('eyeStyle', e.target.value)}>
                            <option>detailed</option><option>simple</option><option>sparkling</option><option>half-closed</option><option>heterochromia</option>
                          </select>
                        </label>
                        <label className="field">
                          <span>{transfer.hairStyle}</span>
                          <select className="settings-input tool-select" value={config.hairStyle} onChange={(e) => updateConfig('hairStyle', e.target.value)}>
                            <option>long straight</option><option>long wavy</option><option>short</option><option>bob cut</option><option>ponytail</option><option>twin tails</option><option>ahoge</option>
                          </select>
                        </label>
                        <label className="field">
                          <span>{transfer.skinTexture}</span>
                          <select className="settings-input tool-select" value={config.skinTexture} onChange={(e) => updateConfig('skinTexture', e.target.value)}>
                            <option>smooth</option><option>realistic</option><option>porcelain</option><option>freckled</option><option>tan</option>
                          </select>
                        </label>
                      </div>
                    )}
                  </div>

                  <div className="tool-actions-row" style={{ marginTop: 12 }}>
                    <button className="primary-button" type="button" onClick={startWorkflow}>{transfer.start}</button>
                    <button className="secondary-button" type="button" onClick={abortWorkflow}>{transfer.stop}</button>
                    <button className="secondary-button" type="button" onClick={() => setConfig((current) => ({ ...current, prompt: '', negativePrompt: '' }))}>{copy.reset}</button>
                  </div>
                </>
              )}
            </section>
          </div>

          <div className="tool-column side">
            {/* Progress & Logs */}
            <section className="tool-card">
              <div className="tool-card-header" style={{ cursor: 'pointer' }} onClick={() => { playSound(isLogsOpen ? 'collapse' : 'expand'); setIsLogsOpen((v) => !v); }} role="button" tabIndex={0}>
                <div>
                  <span className="card-caption">{copy.progressTitle}</span>
                  <h3>{copy.progressTitle}</h3>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span className={`status-badge ${status}`}>{copy[statusLabelKey]}</span>
                  <span style={{ fontSize: 12, color: '#8aa4c0' }}>{isLogsOpen ? '▲' : '▼'}</span>
                </div>
              </div>
              {isLogsOpen && (
                <>
                  <div className="progress-track"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
                  <div className="progress-meta">
                    <span>{copy.workflowId}</span>
                    <strong>{result?.workflowId?.toString() ?? `draft-${status}`}</strong>
                  </div>
                  <div className="log-stack">
                    <div className="log-stack-header">
                      <strong>{copy.logsTitle}</strong>
                      <div className="mini-action-row">
                        <button className="secondary-button small-button" type="button" onClick={() => copyText(logsText)}>{copy.copyLogs}</button>
                        <button className="secondary-button small-button" type="button" onClick={() => downloadText('style-transfer-logs.txt', logsText)}>{copy.downloadLogs}</button>
                      </div>
                    </div>
                    {logs.length > 0 ? logs.map((log) => (
                      <div key={`${log.time}-${log.text}`} className={`log-entry ${log.level}`}>
                        <span>{log.time}</span><p>{log.text}</p>
                      </div>
                    )) : <div className="log-empty">{transfer.waitingResult}</div>}
                  </div>
                </>
              )}
            </section>

            {/* Results */}
            <section className="tool-card">
              <div className="tool-card-header" style={{ cursor: 'pointer' }} onClick={() => { playSound(isResultOpen ? 'collapse' : 'expand'); setIsResultOpen((v) => !v); }} role="button" tabIndex={0}>
                <div>
                  <span className="card-caption">{copy.resultsTitle}</span>
                  <h3>{copy.resultsTitle}</h3>
                </div>
                <span style={{ fontSize: 12, color: '#8aa4c0' }}>{isResultOpen ? '▲' : '▼'}</span>
              </div>
              {isResultOpen && (
                <div className="result-grid">
                  <CollapsibleCodePanel title={transfer.outputTitle} description={result ? transfer.resultReady : transfer.waitingResult} code={resultJson} copy={copy} actions={<>
                    <button className="secondary-button small-button" type="button" onClick={() => copyText(resultJson)}>{copy.copyResult}</button>
                    <button className="secondary-button small-button" type="button" onClick={() => downloadText('style-transfer-result.json', resultJson, 'application/json')}>{copy.downloadResult}</button>
                    {status === 'success' && <button className="primary-button small-button" type="button" onClick={startWorkflow}>{transfer.redo}</button>}
                  </>} />
                  <CollapsibleCodePanel title={copy.errorTitle} description={error ? error.message : copy.noRecentError} code={errorJson} copy={copy} tone={error ? 'error' : 'default'} defaultOpen={Boolean(error)} autoOpenSignal={error?.message ?? null} actions={error ? <>
                    <button className="secondary-button small-button" type="button" onClick={() => copyText(errorJson)}>{copy.copyError}</button>
                    <button className="secondary-button small-button" type="button" onClick={() => downloadText('style-transfer-error.json', errorJson, 'application/json')}>{copy.downloadError}</button>
                    <button className="secondary-button small-button" type="button" onClick={() => setShowErrorPanel(true)}>{transfer.openDetailPanel}</button>
                  </> : null} />
                  <CollapsibleCodePanel title={copy.debugTitle} description={transfer.debugDescription} code={debugJson} copy={copy} actions={<>
                    <button className="secondary-button small-button" type="button" onClick={() => copyText(debugJson)}>{copy.copyDebug}</button>
                    <button className="secondary-button small-button" type="button" onClick={() => downloadText('style-transfer-debug.json', debugJson, 'application/json')}>{copy.downloadDebug}</button>
                  </>} />
                </div>
              )}
            </section>
          </div>
        </div>
      </section>

      <footer className="home-footer fade-up delay-3">
        <div className="notice-banner">{privacyNote}</div>
      </footer>

      {isConfirmOpen && <ConfirmReturnModal copy={copy} isDirty={isDirty} onCancel={() => setIsConfirmOpen(false)} onConfirm={onBack} />}
      {isResetOpen && <ConfirmActionModal title={copy.refreshWorkspaceTitle} description={copy.refreshWorkspaceDescription} cancelLabel={copy.continueEdit} confirmLabel={copy.refreshWorkspaceConfirm} onCancel={() => setIsResetOpen(false)} onConfirm={resetWorkspaceView} />}

      <TagPickerModal
        open={isPositiveTagOpen}
        title={transfer.addPositiveTags.replace('+ ', '')}
        categories={STYLE_TAG_CATEGORIES}
        selected={tagDraft}
        onToggle={(tag) => setTagDraft((prev) => { const next = new Set(prev); if (next.has(tag)) next.delete(tag); else next.add(tag); return next; })}
        onClose={() => setIsPositiveTagOpen(false)}
        onApply={() => { updateConfig('extraPositiveTags', Array.from(tagDraft)); setIsPositiveTagOpen(false); }}
        copy={copy}
      />
      <TagPickerModal
        open={isNegativeTagOpen}
        title={transfer.addNegativeTags.replace('+ ', '')}
        categories={NEGATIVE_TAG_CATEGORIES}
        selected={tagDraft}
        onToggle={(tag) => setTagDraft((prev) => { const next = new Set(prev); if (next.has(tag)) next.delete(tag); else next.add(tag); return next; })}
        onClose={() => setIsNegativeTagOpen(false)}
        onApply={() => { updateConfig('extraNegativeTags', Array.from(tagDraft)); setIsNegativeTagOpen(false); }}
        copy={copy}
      />
      {showErrorPanel && error && (
        <DraggableErrorPanel
          error={error}
          onClose={() => setShowErrorPanel(false)}
          onCopy={() => copyText(errorJson)}
          onDownload={() => downloadText('style-transfer-error.json', errorJson, 'application/json')}
          onRetry={startWorkflow}
          copy={copy}
        />
      )}
    </main>
  );
}
export function PromptSuitePage({
  appSubtitle,
  backHome,
  openSettings,
  privacyNote,
  pageTitle,
  pageDescription,
  settings,
  language,
  onBack,
  onOpenSettings,
}: SharedPageProps) {
  const copy = localizedUiCopy[language];
  const promptCopy = copy.prompt;
  const editorRef = useRef<HTMLDivElement>(null);
  const templates = localizedPromptTemplates[language];
  const initialTemplate = templates[0];
  const defaultToolbarState = {
    fontFamily: "'Noto Sans SC', 'PingFang SC', sans-serif",
    fontSize: '16px',
    blockStyle: 'p',
    textColor: '#eef4fb',
    highlightColor: '#4f9df7',
    lineHeight: '1.7',
  };
  const initialLlmConfig = {
    model: 'gpt-5.4',
    temperature: 0.7,
    topP: 0.92,
    maxTokens: 2048,
    systemNote: 'Keep the OC packet concise, coherent, and easy to hand off to downstream art or voice pipelines.',
  };
  const initialTtsConfig = {
    pitch: 0,
    volume: 96,
    sampleRate: 48000,
    referenceClipName: '',
    voice: 'Hanazora',
    language,
    rate: 1,
    emotion: 'calm-dramatic',
    format: 'wav',
  };
  const [persistedState] = useState(() =>
    readLocalState(PROMPT_SUITE_STORAGE_KEY, {
      selectedTemplate: initialTemplate.key,
      documentHtml: initialTemplate.html,
      toolbarState: defaultToolbarState,
      customFonts: [] as EditorFontOption[],
      llmConfig: initialLlmConfig,
      ttsConfig: initialTtsConfig,
      savedSnapshot: '',
    }),
  );
  const persistedCustomFonts = Array.isArray(persistedState.customFonts)
    ? persistedState.customFonts.filter(
        (item): item is EditorFontOption =>
          typeof item === 'object' &&
          item !== null &&
          'label' in item &&
          'value' in item &&
          typeof item.label === 'string' &&
          typeof item.value === 'string',
      )
    : [];
  const [selectedTemplate, setSelectedTemplate] = useState<string>(persistedState.selectedTemplate);
  const [documentHtml, setDocumentHtml] = useState<string>(persistedState.documentHtml);
  const [customFonts, setCustomFonts] = useState<EditorFontOption[]>(persistedCustomFonts);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [llmConfig, setLlmConfig] = useState({ ...initialLlmConfig, ...persistedState.llmConfig });
  const [ttsConfig, setTtsConfig] = useState(() => {
    const savedTts = persistedState.ttsConfig as Partial<{
      voice: string;
      language: AppLanguage;
      rate: number;
      emotion: string;
      format: string;
      pitch: number;
      volume: number;
      sampleRate: number;
      referenceClipName: string;
    }>;

    return {
      voice: savedTts.voice ?? initialTtsConfig.voice,
      language: savedTts.language ?? initialTtsConfig.language,
      rate: savedTts.rate ?? initialTtsConfig.rate,
      emotion: savedTts.emotion ?? initialTtsConfig.emotion,
      format: savedTts.format ?? initialTtsConfig.format,
      pitch: savedTts.pitch ?? initialTtsConfig.pitch,
      volume: savedTts.volume ?? initialTtsConfig.volume,
      sampleRate: savedTts.sampleRate ?? initialTtsConfig.sampleRate,
      referenceClipName: savedTts.referenceClipName ?? initialTtsConfig.referenceClipName,
    };
  });
  const [toolbarState, setToolbarState] = useState(() => ({ ...defaultToolbarState, ...(persistedState.toolbarState ?? {}) }));
  const [toolbarOpen, setToolbarOpen] = useState<Record<ToolbarGroupKey, boolean>>({
    font: true,
    style: true,
    paragraph: false,
    insert: false,
    history: false,
  });
  const [isCustomFontOpen, setIsCustomFontOpen] = useState(false);
  const [customFontDraft, setCustomFontDraft] = useState({ label: '', stack: '' });
  const [isCustomInsertOpen, setIsCustomInsertOpen] = useState(false);
  const [customInsertDraft, setCustomInsertDraft] = useState<{ kind: CustomInsertKind; payload: string }>({
    kind: 'callout',
    payload: '',
  });
  const currentSnapshot = JSON.stringify({ documentHtml, llmConfig, ttsConfig, selectedTemplate, customFonts, toolbarState });
  const initialSavedSnapshot =
    typeof persistedState.savedSnapshot === 'string' && persistedState.savedSnapshot.includes('"toolbarState"')
      ? persistedState.savedSnapshot
      : currentSnapshot;
  const [savedSnapshot, setSavedSnapshot] = useState(initialSavedSnapshot);
  const isDirty = currentSnapshot !== savedSnapshot;
  useBeforeUnloadGuard(isDirty);

  useEffect(() => {
    writeLocalState(PROMPT_SUITE_STORAGE_KEY, {
      selectedTemplate,
      documentHtml,
      toolbarState,
      customFonts,
      llmConfig,
      ttsConfig,
      savedSnapshot,
    });
  }, [customFonts, documentHtml, llmConfig, savedSnapshot, selectedTemplate, toolbarState, ttsConfig]);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== documentHtml) {
      editorRef.current.innerHTML = sanitizeHtml(documentHtml);
    }
  }, [documentHtml]);

  const fontFamilyOptions = useMemo(() => [...editorFontOptionsBase, ...customFonts], [customFonts]);
  const customInsertOptions = useMemo(
    () => [
      { value: 'callout' as const, label: promptCopy.customInsertCallout },
      { value: 'details' as const, label: promptCopy.customInsertDetails },
      { value: 'image' as const, label: promptCopy.customInsertImage },
      { value: 'badge' as const, label: promptCopy.customInsertBadge },
      { value: 'html' as const, label: promptCopy.customInsertHtml },
    ],
    [promptCopy.customInsertBadge, promptCopy.customInsertCallout, promptCopy.customInsertDetails, promptCopy.customInsertHtml, promptCopy.customInsertImage],
  );
  const toolbarSections: Array<{ key: ToolbarGroupKey; label: string }> = [
    { key: 'font', label: copy.toolbarFontGroup },
    { key: 'style', label: copy.toolbarStyleGroup },
    { key: 'paragraph', label: copy.toolbarParagraphGroup },
    { key: 'insert', label: copy.toolbarInsertGroup },
    { key: 'history', label: copy.toolbarHistoryGroup },
  ];

  function syncEditor() {
    setDocumentHtml(editorRef.current?.innerHTML ?? '');
  }

  function focusEditor() {
    editorRef.current?.focus();
  }

  function executeCommand(command: string, value?: string) {
    focusEditor();
    document.execCommand(command, false, value);
    syncEditor();
  }

  function insertHtml(html: string) {
    executeCommand('insertHTML', html);
  }

  function applySelectionStyle(style: Partial<CSSStyleDeclaration>) {
    focusEditor();
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || selection.isCollapsed) return;

    const range = selection.getRangeAt(0);
    const span = document.createElement('span');
    Object.entries(style).forEach(([key, value]) => {
      if (value) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (span.style as any)[key] = value;
      }
    });

    const fragment = range.extractContents();
    span.appendChild(fragment);
    range.insertNode(span);
    selection.removeAllRanges();
    const nextRange = document.createRange();
    nextRange.selectNodeContents(span);
    selection.addRange(nextRange);
    syncEditor();
  }

  function applyCurrentBlockStyle(style: Partial<CSSStyleDeclaration>) {
    focusEditor();
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    let node: Node | null = selection.anchorNode;
    while (node && node !== editorRef.current) {
      if (
        node instanceof HTMLElement &&
        ['P', 'DIV', 'LI', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'BLOCKQUOTE', 'PRE'].includes(node.tagName)
      ) {
        const target = node as HTMLElement;
        Object.entries(style).forEach(([key, value]) => {
          if (value) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (target.style as any)[key] = value;
          }
        });
        syncEditor();
        return;
      }
      node = node.parentNode;
    }
  }

  function applyTemplate(templateKey: string) {
    const nextTemplate = templates.find((item) => item.key === templateKey);
    if (!nextTemplate) return;

    setSelectedTemplate(templateKey);
    setDocumentHtml(nextTemplate.html);
  }

  function insertLink() {
    const selectedText = window.getSelection()?.toString().trim() || 'Link';
    insertHtml(`<a href="https://example.com" target="_blank" rel="noreferrer">${escapeHtml(selectedText)}</a>`);
  }

  function insertTable() {
    insertHtml(
      '<table><tr><th>字段</th><th>内容</th></tr><tr><td>条目 A</td><td>在这里填写描述</td></tr><tr><td>条目 B</td><td>继续填写内容</td></tr></table>',
    );
  }

  function insertInlineCode() {
    const selectedText = window.getSelection()?.toString().trim() || 'inline-code';
    insertHtml(`<code>${escapeHtml(selectedText)}</code>`);
  }

  function insertCalloutBlock() {
    insertHtml(`<aside class="editor-callout"><strong>Callout</strong><p>${escapeHtml('在这里填写强调说明。')}</p></aside>`);
  }

  function insertDetailsBlock() {
    insertHtml(`<details><summary>点击展开</summary><p>${escapeHtml('在这里填写折叠内容。')}</p></details>`);
  }

  function insertBadgeBlock() {
    const selectedText = window.getSelection()?.toString().trim() || 'Tag';
    insertHtml(`<p><span class="editor-badge">${escapeHtml(selectedText)}</span></p>`);
  }

  function insertImageBlock() {
    insertHtml(`<figure><img src="${PLACEHOLDER_IMAGE}" alt="custom asset" /><figcaption>Image caption</figcaption></figure>`);
  }

  function applyCustomInsert() {
    const payload = customInsertDraft.payload.trim();
    const safePayload = escapeHtml(payload || '请填写自定义内容');
    let html = '';

    switch (customInsertDraft.kind) {
      case 'callout':
        html = `<aside class="editor-callout"><strong>Callout</strong><p>${safePayload}</p></aside>`;
        break;
      case 'details':
        html = `<details><summary>点击展开</summary><p>${safePayload}</p></details>`;
        break;
      case 'image':
        html = `<figure><img src="${payload || PLACEHOLDER_IMAGE}" alt="custom asset" /><figcaption>${safePayload}</figcaption></figure>`;
        break;
      case 'badge':
        html = `<p><span class="editor-badge">${safePayload}</span></p>`;
        break;
      case 'html':
        html = payload || '<div class="editor-callout"><p>Custom HTML</p></div>';
        break;
    }

    insertHtml(html);
    setIsCustomInsertOpen(false);
    setCustomInsertDraft({ kind: 'callout', payload: '' });
  }

  function applyCustomFont() {
    const fontStack = customFontDraft.stack.trim();
    if (!fontStack) return;

    const nextOption = {
      label: customFontDraft.label.trim() || fontStack,
      value: fontStack,
      custom: true,
    };

    setCustomFonts((current) => {
      const withoutDuplicate = current.filter((item) => item.value !== nextOption.value);
      return [...withoutDuplicate, nextOption];
    });
    setToolbarState((current) => ({ ...current, fontFamily: nextOption.value }));
    applySelectionStyle({ fontFamily: nextOption.value });
    setCustomFontDraft({ label: '', stack: '' });
    setIsCustomFontOpen(false);
  }

  function handleFontFamilyChange(value: string) {
    setToolbarState((current) => ({ ...current, fontFamily: value }));
    applySelectionStyle({ fontFamily: value });
  }

  function handleFontSizeChange(value: string) {
    const nextValue = normalizeFontSizeInput(value);
    setToolbarState((current) => ({ ...current, fontSize: nextValue }));
    applySelectionStyle({ fontSize: nextValue });
  }

  function handleBlockStyleChange(value: string) {
    setToolbarState((current) => ({ ...current, blockStyle: value }));
    const blockMap: Record<string, string> = {
      p: '<p>',
      h1: '<h1>',
      h2: '<h2>',
      h3: '<h3>',
      h4: '<h4>',
      h5: '<h5>',
      h6: '<h6>',
      blockquote: '<blockquote>',
      pre: '<pre>',
    };
    executeCommand('formatBlock', blockMap[value] ?? '<p>');
  }

  function handleTextColorChange(value: string) {
    setToolbarState((current) => ({ ...current, textColor: value }));
    applySelectionStyle({ color: value });
  }

  function handleHighlightChange(value: string) {
    setToolbarState((current) => ({ ...current, highlightColor: value }));
    applySelectionStyle({ backgroundColor: value });
  }

  function clearHighlight() {
    applySelectionStyle({ backgroundColor: 'transparent' });
  }

  function handleLineHeightChange(value: string) {
    const nextValue = normalizeLineHeightInput(value);
    setToolbarState((current) => ({ ...current, lineHeight: nextValue }));
    applyCurrentBlockStyle({ lineHeight: nextValue });
  }

  function saveDraft() {
    setSavedSnapshot(currentSnapshot);
  }

  function resetWorkspaceView() {
    const nextToolbarState = { ...defaultToolbarState };
    const nextLlmConfig = { ...initialLlmConfig };
    const nextTtsConfig = { ...initialTtsConfig };
    const nextSnapshot = JSON.stringify({
      documentHtml: initialTemplate.html,
      llmConfig: nextLlmConfig,
      ttsConfig: nextTtsConfig,
      selectedTemplate: initialTemplate.key,
      customFonts: [],
      toolbarState: nextToolbarState,
    });

    setIsResetOpen(false);
    setSelectedTemplate(initialTemplate.key);
    setDocumentHtml(initialTemplate.html);
    setCustomFonts([]);
    setToolbarState(nextToolbarState);
    setToolbarOpen({
      font: true,
      style: true,
      paragraph: false,
      insert: false,
      history: false,
    });
    setCustomFontDraft({ label: '', stack: '' });
    setCustomInsertDraft({ kind: 'callout', payload: '' });
    setLlmConfig(nextLlmConfig);
    setTtsConfig(nextTtsConfig);
    setSavedSnapshot(nextSnapshot);
  }

  function triggerEditorAction(action: ShortcutAction) {
    switch (action) {
      case 'saveDocument':
        saveDraft();
        return;
      case 'bold':
        executeCommand('bold');
        return;
      case 'italic':
        executeCommand('italic');
        return;
      case 'underline':
        executeCommand('underline');
        return;
      case 'strikeThrough':
        executeCommand('strikeThrough');
        return;
      case 'subscript':
        executeCommand('subscript');
        return;
      case 'superscript':
        executeCommand('superscript');
        return;
      case 'blockquote':
        handleBlockStyleChange('blockquote');
        return;
      case 'heading1':
        handleBlockStyleChange('h1');
        return;
      case 'heading2':
        handleBlockStyleChange('h2');
        return;
      case 'heading3':
        handleBlockStyleChange('h3');
        return;
      case 'heading4':
        handleBlockStyleChange('h4');
        return;
      case 'heading5':
        handleBlockStyleChange('h5');
        return;
      case 'heading6':
        handleBlockStyleChange('h6');
        return;
      case 'unorderedList':
        executeCommand('insertUnorderedList');
        return;
      case 'orderedList':
        executeCommand('insertOrderedList');
        return;
      case 'justifyLeft':
        executeCommand('justifyLeft');
        return;
      case 'justifyCenter':
        executeCommand('justifyCenter');
        return;
      case 'justifyRight':
        executeCommand('justifyRight');
        return;
      case 'justifyFull':
        executeCommand('justifyFull');
        return;
      case 'indent':
        executeCommand('indent');
        return;
      case 'outdent':
        executeCommand('outdent');
        return;
      case 'insertLink':
        insertLink();
        return;
      case 'insertTable':
        insertTable();
        return;
      case 'insertHr':
        executeCommand('insertHorizontalRule');
        return;
      case 'insertCodeBlock':
        insertHtml('<pre><code>// code block</code></pre>');
        return;
      case 'insertImage':
        insertImageBlock();
        return;
      case 'clearHighlight':
        clearHighlight();
        return;
      case 'undo':
        executeCommand('undo');
        return;
      case 'redo':
        executeCommand('redo');
        return;
      case 'selectAll':
        executeCommand('selectAll');
        return;
      case 'clearFormat':
        executeCommand('removeFormat');
        return;
    }
  }

  function handleEditorKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    const shortcutEntries = Object.entries(settings.shortcutMap) as Array<[ShortcutAction, string]>;
    for (const [action, combo] of shortcutEntries) {
      if (matchesShortcut(event, combo)) {
        event.preventDefault();
        triggerEditorAction(action);
        return;
      }
    }
  }

  const plainText = useMemo(() => {
    const parser = new DOMParser();
    return parser.parseFromString(documentHtml, 'text/html').body.innerText;
  }, [documentHtml]);

  const exportJson = JSON.stringify(
    {
      tool: 'prompt-suite',
      selectedTemplate,
      documentHtml,
      plainText,
      toolbarState,
      customFonts,
      llmConfig,
      ttsConfig,
    },
    null,
    2,
  );

  function exportHtml() {
    downloadText('oc-prompt-suite.html', documentHtml, 'text/html');
  }

  function exportText() {
    downloadText('oc-prompt-suite.txt', plainText);
  }

  function exportJsonPack() {
    downloadText('oc-wrapper-pack.json', exportJson, 'application/json');
  }

  function exportAllFormats() {
    exportHtml();
    window.setTimeout(exportText, 120);
    window.setTimeout(exportJsonPack, 240);
  }

  return (
    <main className="feature-shell tool-page-shell">
      <header className="feature-header fade-up delay-1">
        <button className="secondary-button small-button" type="button" onClick={() => setIsConfirmOpen(true)}>
          {backHome}
        </button>
        <div className="feature-header-meta">
          <button className="secondary-button small-button" type="button" onClick={onOpenSettings}>
            {openSettings}
          </button>
        </div>
      </header>

      <section className="tool-workbench fade-up delay-2">
        <div className="tool-header">
          <div>
            <p className="section-label">{appSubtitle}</p>
            <h2>{pageTitle}</h2>
            <p>{pageDescription}</p>
          </div>
          <div className="tool-header-actions">
            <span className={`save-indicator ${isDirty ? 'dirty' : 'clean'}`}>{isDirty ? copy.dirty : copy.clean}</span>
            <button className="secondary-button small-button" type="button" onClick={() => setIsResetOpen(true)}>
              {copy.refreshWorkspace}
            </button>
            <button className="secondary-button small-button" type="button" onClick={saveDraft}>
              {copy.saveDocument}
            </button>
            <button className="secondary-button small-button" type="button" onClick={exportHtml}>
              {copy.downloadHtml}
            </button>
            <button className="secondary-button small-button" type="button" onClick={() => setIsExportOpen(true)}>
              {copy.exportPack}
            </button>
          </div>
        </div>

        <section className="tool-card rich-editor-card">
          <div className="tool-card-header">
            <div>
              <span className="card-caption">{promptCopy.contentTitle}</span>
              <h3>{promptCopy.contentTitle}</h3>
            </div>
            <div className="tool-card-inline-actions">
              <span className="tiny-copy">{copy.editorHint}</span>
              <button className="secondary-button small-button" type="button" onClick={() => copyText(plainText)}>
                {copy.copyText}
              </button>
            </div>
          </div>
          <div className="editor-toolbar-ribbon grouped-toolbar">
            <span className="editor-toolbar-label">{copy.editorToolbar}</span>
            <div className="editor-toolbar-sections">
              {toolbarSections.map((section) => (
                <div key={section.key} className={`toolbar-group ${toolbarOpen[section.key] ? 'expanded' : 'collapsed'}`}>
                  <button className="toolbar-group-header" type="button" onClick={() => { playSound(toolbarOpen[section.key] ? 'collapse' : 'expand'); setToolbarOpen((current) => ({ ...current, [section.key]: !current[section.key] })); }}>
                    <span className="toolbar-group-title">{section.label}</span>
                    <span className="toolbar-group-state">{toolbarOpen[section.key] ? copy.hideDetails : copy.showDetails}</span>
                  </button>

                  {toolbarOpen[section.key] ? (
                    <div className="toolbar-group-controls">
                      {section.key === 'font' ? (
                        <div className="toolbar-grid toolbar-grid-wide">
                          <label className="toolbar-field">
                            <span>{promptCopy.fontFamily}</span>
                            <select className="toolbar-select" value={toolbarState.fontFamily} onChange={(event) => handleFontFamilyChange(event.target.value)}>
                              {fontFamilyOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </label>
                          <button className="toolbar-button toolbar-button-highlight" type="button" onClick={() => setIsCustomFontOpen(true)}>
                            {promptCopy.customFontButton}
                          </button>
                          <label className="toolbar-field">
                            <span>{promptCopy.fontSize}</span>
                            <input
                              className="toolbar-input compact"
                              list="editor-font-size-presets"
                              value={toolbarState.fontSize}
                              onChange={(event) => setToolbarState((current) => ({ ...current, fontSize: event.target.value }))}
                              onBlur={(event) => handleFontSizeChange(event.target.value)}
                              onDoubleClick={(event) => event.currentTarget.select()}
                            />
                          </label>
                          <label className="toolbar-field">
                            <span>{promptCopy.blockStyle}</span>
                            <select className="toolbar-select compact" value={toolbarState.blockStyle} onChange={(event) => handleBlockStyleChange(event.target.value)}>
                              {editorBlockStylePresets.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </label>
                          <label className="toolbar-field">
                            <span>{promptCopy.lineHeight}</span>
                            <input
                              className="toolbar-input compact"
                              list="editor-line-height-presets"
                              value={toolbarState.lineHeight}
                              onChange={(event) => setToolbarState((current) => ({ ...current, lineHeight: event.target.value }))}
                              onBlur={(event) => handleLineHeightChange(event.target.value)}
                              onDoubleClick={(event) => event.currentTarget.select()}
                            />
                          </label>
                        </div>
                      ) : null}

                      {section.key === 'style' ? (
                        <div className="toolbar-group-controls">
                          <button className="toolbar-button" type="button" onClick={() => executeCommand('bold')}>B</button>
                          <button className="toolbar-button" type="button" onClick={() => executeCommand('italic')}>I</button>
                          <button className="toolbar-button" type="button" onClick={() => executeCommand('underline')}>U</button>
                          <button className="toolbar-button" type="button" onClick={() => executeCommand('strikeThrough')}>S</button>
                          <button className="toolbar-button" type="button" onClick={() => executeCommand('subscript')}>Sub</button>
                          <button className="toolbar-button" type="button" onClick={() => executeCommand('superscript')}>Sup</button>
                          <button className="toolbar-button" type="button" onClick={insertInlineCode}>Code</button>
                          <label className="toolbar-color">
                            <span>{promptCopy.textColor}</span>
                            <input type="color" value={toolbarState.textColor} onChange={(event) => handleTextColorChange(event.target.value)} />
                          </label>
                          <label className="toolbar-color">
                            <span>{promptCopy.highlightColor}</span>
                            <input type="color" value={toolbarState.highlightColor} onChange={(event) => handleHighlightChange(event.target.value)} />
                          </label>
                          <button className="toolbar-button" type="button" onClick={clearHighlight}>
                            {promptCopy.clearHighlight}
                          </button>
                        </div>
                      ) : null}

                      {section.key === 'paragraph' ? (
                        <div className="toolbar-group-controls">
                          <button className="toolbar-button" type="button" onClick={() => executeCommand('justifyLeft')}>L</button>
                          <button className="toolbar-button" type="button" onClick={() => executeCommand('justifyCenter')}>C</button>
                          <button className="toolbar-button" type="button" onClick={() => executeCommand('justifyRight')}>R</button>
                          <button className="toolbar-button" type="button" onClick={() => executeCommand('justifyFull')}>J</button>
                          <button className="toolbar-button" type="button" onClick={() => executeCommand('insertUnorderedList')}>UL</button>
                          <button className="toolbar-button" type="button" onClick={() => executeCommand('insertOrderedList')}>OL</button>
                          <button className="toolbar-button" type="button" onClick={() => executeCommand('outdent')}>Out</button>
                          <button className="toolbar-button" type="button" onClick={() => executeCommand('indent')}>In</button>
                          <button className="toolbar-button" type="button" onClick={() => handleBlockStyleChange('blockquote')}>Quote</button>
                          <button className="toolbar-button" type="button" onClick={() => handleBlockStyleChange('pre')}>Pre</button>
                        </div>
                      ) : null}

                      {section.key === 'insert' ? (
                        <div className="toolbar-group-controls">
                          <button className="toolbar-button" type="button" onClick={insertLink}>Link</button>
                          <button className="toolbar-button" type="button" onClick={insertTable}>Table</button>
                          <button className="toolbar-button" type="button" onClick={() => executeCommand('insertHorizontalRule')}>HR</button>
                          <button className="toolbar-button" type="button" onClick={insertCalloutBlock}>Callout</button>
                          <button className="toolbar-button" type="button" onClick={insertDetailsBlock}>Details</button>
                          <button className="toolbar-button" type="button" onClick={insertBadgeBlock}>Badge</button>
                          <button className="toolbar-button" type="button" onClick={insertImageBlock}>Image</button>
                          <button className="toolbar-button" type="button" onClick={() => insertHtml('<pre><code>// code block</code></pre>')}>Code block</button>
                          <button className="toolbar-button toolbar-button-highlight" type="button" onClick={() => setIsCustomInsertOpen(true)}>
                            {promptCopy.customInsertButton}
                          </button>
                        </div>
                      ) : null}

                      {section.key === 'history' ? (
                        <div className="toolbar-group-controls">
                          <button className="toolbar-button" type="button" onClick={() => executeCommand('undo')}>↺</button>
                          <button className="toolbar-button" type="button" onClick={() => executeCommand('redo')}>↻</button>
                          <button className="toolbar-button" type="button" onClick={() => executeCommand('selectAll')}>All</button>
                          <button className="toolbar-button" type="button" onClick={() => executeCommand('removeFormat')}>Clear</button>
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
            <datalist id="editor-font-size-presets">
              {editorFontSizePresets.map((option) => (
                <option key={option} value={option} />
              ))}
            </datalist>
            <datalist id="editor-line-height-presets">
              {editorLineHeightPresets.map((option) => (
                <option key={option} value={option} />
              ))}
            </datalist>
          </div>
          <div className="template-ribbon">
            <span className="editor-toolbar-label">{copy.promptTemplates}</span>
            <div className="template-grid">
              {templates.map((template) => (
                <button
                  key={template.key}
                  className={`template-card ${selectedTemplate === template.key ? 'active' : ''}`}
                  type="button"
                  onClick={() => applyTemplate(template.key)}
                >
                  {template.label}
                </button>
              ))}
            </div>
          </div>
          <div
            ref={editorRef}
            className="rich-editor-surface"
            contentEditable
            suppressContentEditableWarning
            onInput={syncEditor}
            onKeyDown={handleEditorKeyDown}
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(documentHtml) }}
          />
        </section>

        <div className="tool-grid prompt-grid">
          <section className="tool-card">
            <span className="card-caption">{copy.exportTitle}</span>
            <h3>{copy.exportTitle}</h3>
            <p>{promptCopy.editorReady}</p>
            <p className="muted-copy">{promptCopy.packageHint}</p>
            <CollapsibleCodePanel
              title={copy.exportTitle}
              description={promptCopy.packageHint}
              code={exportJson}
              copy={copy}
              actions={
                <>
                  <button className="secondary-button small-button" type="button" onClick={() => setIsExportOpen(true)}>
                    {copy.exportPack}
                  </button>
                  <button className="secondary-button small-button" type="button" onClick={() => copyText(exportJson)}>
                    {copy.copyJson}
                  </button>
                  <button className="secondary-button small-button" type="button" onClick={exportJsonPack}>
                    {copy.downloadJson}
                  </button>
                </>
              }
            />
          </section>
        </div>
      </section>

      <footer className="home-footer fade-up delay-3">
        <div className="notice-banner">{privacyNote}</div>
      </footer>

      {isCustomFontOpen ? (
        <EditorExperimentalModal title={promptCopy.customFontTitle} note={promptCopy.experimentalNote} onClose={() => setIsCustomFontOpen(false)}>
          <div className="form-grid">
            <label className="field">
              <span>{promptCopy.customFontName}</span>
              <input
                className="settings-input"
                type="text"
                value={customFontDraft.label}
                onChange={(event) => setCustomFontDraft((current) => ({ ...current, label: event.target.value }))}
              />
            </label>
            <label className="field">
              <span>{promptCopy.customFontStack}</span>
              <textarea
                className="settings-textarea compact"
                value={customFontDraft.stack}
                onChange={(event) => setCustomFontDraft((current) => ({ ...current, stack: event.target.value }))}
              />
            </label>
          </div>
          <div className="confirm-actions">
            <button className="secondary-button" type="button" onClick={() => setIsCustomFontOpen(false)}>
              {copy.continueEdit}
            </button>
            <button className="primary-button" type="button" onClick={applyCustomFont}>
              {promptCopy.customFontApply}
            </button>
          </div>
        </EditorExperimentalModal>
      ) : null}

      {isCustomInsertOpen ? (
        <EditorExperimentalModal title={promptCopy.customInsertTitle} note={promptCopy.experimentalNote} onClose={() => setIsCustomInsertOpen(false)}>
          <div className="form-grid">
            <label className="field">
              <span>{promptCopy.customInsertKind}</span>
              <select
                className="settings-input tool-select"
                value={customInsertDraft.kind}
                onChange={(event) => setCustomInsertDraft((current) => ({ ...current, kind: event.target.value as CustomInsertKind }))}
              >
                {customInsertOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>{promptCopy.customInsertPayload}</span>
              <textarea
                className="settings-textarea"
                value={customInsertDraft.payload}
                onChange={(event) => setCustomInsertDraft((current) => ({ ...current, payload: event.target.value }))}
              />
            </label>
          </div>
          <div className="confirm-actions">
            <button className="secondary-button" type="button" onClick={() => setIsCustomInsertOpen(false)}>
              {copy.continueEdit}
            </button>
            <button className="primary-button" type="button" onClick={applyCustomInsert}>
              {promptCopy.customInsertApply}
            </button>
          </div>
        </EditorExperimentalModal>
      ) : null}

      {isExportOpen ? (
        <ExportOptionsModal
          copy={copy}
          promptCopy={promptCopy}
          onClose={() => setIsExportOpen(false)}
          onExportHtml={exportHtml}
          onExportText={exportText}
          onExportJson={exportJsonPack}
          onExportAll={exportAllFormats}
        />
      ) : null}

      {isConfirmOpen && <ConfirmReturnModal copy={copy} isDirty={isDirty} onCancel={() => setIsConfirmOpen(false)} onConfirm={onBack} />}
      {isResetOpen ? (
        <ConfirmActionModal
          title={copy.refreshWorkspaceTitle}
          description={copy.refreshWorkspaceDescription}
          cancelLabel={copy.continueEdit}
          confirmLabel={copy.refreshWorkspaceConfirm}
          onCancel={() => setIsResetOpen(false)}
          onConfirm={resetWorkspaceView}
        />
      ) : null}
    </main>
  );
}

export function Paper2GalPage({
  appSubtitle,
  backHome,
  openSettings,
  privacyNote,
  pageTitle,
  pageDescription,
  settings,
  language,
  onBack,
  onOpenSettings,
}: SharedPageProps) {
  const copy = localizedUiCopy[language];
  const paper = copy.paper;
  const baseLanguage = resolveBaseLanguage(language);
  const stepLabels = paperStepLabels[baseLanguage];
  const statusLabels = paperStatusLabels[baseLanguage];
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [persistedState] = useState(() =>
    readLocalState(PAPER2GAL_STORAGE_KEY, {
      inputFileName: '',
      workflow: null as PaperWorkflow | null,
      message: { type: 'info' as PaperMessageType, text: paper.idleMessage },
      aiConcurrencyEnabled: true,
      promptOverrides: createDefaultPaperPromptOverrides(),
      savedSnapshot: '',
    }),
  );
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [inputPreviewUrl, setInputPreviewUrl] = useState('');
  const [inputFileName, setInputFileName] = useState(persistedState.inputFileName);
  const [workflow, setWorkflow] = useState<PaperWorkflow | null>(persistedState.workflow);
  const [message, setMessage] = useState<PaperMessage>(persistedState.message);
  const [aiConcurrencyEnabled, setAiConcurrencyEnabled] = useState(Boolean(persistedState.aiConcurrencyEnabled));
  const [promptOverrides, setPromptOverrides] = useState<PaperPromptOverrides>(
    normalizePaperPromptOverrides(migratePaperPromptOverrides(persistedState.promptOverrides)),
  );
  const [isSourcePanelOpen, setIsSourcePanelOpen] = useState(true);
  const [isSettingsPanelOpen, setIsSettingsPanelOpen] = useState(true);
  const [isPromptPanelOpen, setIsPromptPanelOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedActionKey, setCopiedActionKey] = useState('');
  const currentSnapshot = JSON.stringify({
    inputFileName,
    workflowId: workflow?.id ?? '',
    workflowStatus: workflow?.status ?? 'idle',
    aiConcurrencyEnabled,
    promptOverrides,
  });
  const initialSavedSnapshot =
    typeof persistedState.savedSnapshot === 'string' &&
    persistedState.savedSnapshot.includes('"promptOverrides"') &&
    persistedState.savedSnapshot.includes('"aiConcurrencyEnabled"')
      ? persistedState.savedSnapshot
      : currentSnapshot;
  const [savedSnapshot, setSavedSnapshot] = useState(initialSavedSnapshot);
  const isDirty = currentSnapshot !== savedSnapshot;
  useBeforeUnloadGuard(isDirty);

  useEffect(() => {
    writeLocalState(PAPER2GAL_STORAGE_KEY, {
      inputFileName,
      workflow,
      message,
      aiConcurrencyEnabled,
      promptOverrides,
      savedSnapshot,
    });
  }, [aiConcurrencyEnabled, inputFileName, message, promptOverrides, savedSnapshot, workflow]);

  useEffect(() => {
    return () => {
      if (inputPreviewUrl) {
        URL.revokeObjectURL(inputPreviewUrl);
      }
    };
  }, [inputPreviewUrl]);

  useEffect(() => {
    if (!workflow?.id) {
      return;
    }

    if (workflow.status === 'completed' || workflow.status === 'completed_with_errors' || workflow.status === 'failed') {
      return;
    }

    const workflowId = workflow.id;
    let disposed = false;
    let pollTimer = 0;

    async function pollOnce() {
      try {
        const latest = await fetchPaperWorkflowRequest(workflowId, settings, paper);
        if (disposed) {
          return;
        }

        setWorkflow(latest);
        if (latest.status === 'completed') {
          setMessage({ type: 'success', text: paper.completed });
        } else if (latest.status === 'completed_with_errors') {
          setMessage({ type: 'error', text: latest.error || paper.completedWithErrors });
        } else if (latest.status === 'failed') {
          setMessage({ type: 'error', text: latest.error || paper.failed });
        } else {
          setMessage({ type: 'info', text: paper.polling });
          pollTimer = window.setTimeout(pollOnce, PAPER_POLL_INTERVAL_MS);
        }
      } catch (error) {
        if (disposed) {
          return;
        }

        setMessage({
          type: 'error',
          text: normalizeFetchError(error, paper.networkFetchError),
        });
        pollTimer = window.setTimeout(pollOnce, PAPER_POLL_INTERVAL_MS);
      }
    }

    pollTimer = window.setTimeout(pollOnce, PAPER_POLL_INTERVAL_MS);
    return () => {
      disposed = true;
      window.clearTimeout(pollTimer);
    };
  }, [
    paper.completed,
    paper.completedWithErrors,
    paper.failed,
    paper.hostedApiRequired,
    paper.networkFetchError,
    paper.polling,
    settings,
    workflow?.id,
    workflow?.status,
  ]);

  const cutoutUploadInFlight = useRef(new Set<string>());
  useEffect(() => {
    if (!workflow?.id || !workflow.outputs) {
      return;
    }

    if (workflow.outputs.providers?.remove_background !== 'frontend') {
      return;
    }

    const workflowId = workflow.id;
    const expressions = workflow.outputs.expressions || {};
    const cutouts = workflow.outputs.expression_cutouts || {};
    const expressionNames: ExpressionName[] = ['thinking', 'surprise', 'angry'];

    let disposed = false;
    async function run() {
      for (const name of expressionNames) {
        const sourceUrl = expressions[name];
        const existingCutout = cutouts[name];
        if (!sourceUrl || existingCutout) {
          continue;
        }

        const key = `${workflowId}:${name}`;
        if (cutoutUploadInFlight.current.has(key)) {
          continue;
        }

        cutoutUploadInFlight.current.add(key);
        try {
          const next = await uploadFrontendCutout({
            workflowId,
            expressionName: name,
            sourceUrl,
            settings,
            copy: paper,
          });

          if (disposed) return;
          setWorkflow(next);
        } catch (error) {
          cutoutUploadInFlight.current.delete(key);
          if (disposed) return;
          setMessage({
            type: 'error',
            text: normalizeFetchError(error, paper.networkFetchError),
          });
        }
      }
    }

    run();
    return () => {
      disposed = true;
    };
  }, [paper, settings, workflow?.id, workflow?.outputs]);

  const progress = useMemo(() => {
    if (isSubmitting && !workflow) {
      return 8;
    }

    return getPaperProgress(workflow);
  }, [isSubmitting, workflow]);

  const badgeClass = workflow ? getPaperStatusBadgeClass(workflow) : isSubmitting ? 'running' : 'idle';
  const badgeLabel = workflow ? statusLabels[workflow.status] : isSubmitting ? copy.statusRunning : copy.statusIdle;
  const outputCards = useMemo(() => {
    if (!workflow?.outputs) {
      return [];
    }

    return [
      {
        title: stepLabels.expression_thinking,
        url: workflow.outputs.expressions?.thinking,
        fileName: 'expression-thinking.png',
        stepName: 'expression_thinking' as PaperWorkflowStepName,
      },
      {
        title: stepLabels.expression_surprise,
        url: workflow.outputs.expressions?.surprise,
        fileName: 'expression-surprise.png',
        stepName: 'expression_surprise' as PaperWorkflowStepName,
      },
      {
        title: stepLabels.expression_angry,
        url: workflow.outputs.expressions?.angry,
        fileName: 'expression-angry.png',
        stepName: 'expression_angry' as PaperWorkflowStepName,
      },
      {
        title: stepLabels.cg_01,
        url: workflow.outputs.cg_outputs?.[0],
        fileName: 'cg-01.png',
        stepName: 'cg_01' as PaperWorkflowStepName,
      },
      {
        title: stepLabels.cg_02,
        url: workflow.outputs.cg_outputs?.[1],
        fileName: 'cg-02.png',
        stepName: 'cg_02' as PaperWorkflowStepName,
      },
      {
        title: stepLabels.cutout_expression_thinking,
        url: workflow.outputs.expression_cutouts?.thinking,
        fileName: 'expression-thinking-cutout.png',
        stepName: 'cutout_expression_thinking' as PaperWorkflowStepName,
      },
      {
        title: stepLabels.cutout_expression_surprise,
        url: workflow.outputs.expression_cutouts?.surprise,
        fileName: 'expression-surprise-cutout.png',
        stepName: 'cutout_expression_surprise' as PaperWorkflowStepName,
      },
      {
        title: stepLabels.cutout_expression_angry,
        url: workflow.outputs.expression_cutouts?.angry,
        fileName: 'expression-angry-cutout.png',
        stepName: 'cutout_expression_angry' as PaperWorkflowStepName,
      },
    ].filter(
      (item): item is { title: string; url: string; fileName: string; stepName: PaperWorkflowStepName } => Boolean(item.url),
    );
  }, [stepLabels, workflow]);

  const latestStepError = useMemo(() => {
    if (!workflow) {
      return null;
    }

    for (const stepName of [...PAPER_STEP_ORDER].reverse()) {
      const step = workflow.steps?.[stepName];
      if (step?.error) {
        return {
          stepName,
          ...step,
        };
      }
    }

    return null;
  }, [workflow]);

  const workflowLogText = useMemo(() => {
    if (!workflow) {
      return paper.idleMessage;
    }

    return PAPER_STEP_ORDER.map((stepName) => {
      const step = workflow.steps?.[stepName];
      const label = stepLabels[stepName];
      if (!step) {
        return `[queued] ${label}`;
      }

      const parts = [`[${step.status}] ${label}`];
      if (step.provider) parts.push(`provider=${step.provider}`);
      if (step.output_url) parts.push(`output=${step.output_url}`);
      if (step.error) parts.push(`error=${step.error}`);
      return parts.join(' | ');
    }).join('\n');
  }, [paper.idleMessage, stepLabels, workflow]);

  const apiBaseIssue = detectWorkflowApiBaseIssue(getEffectiveApiBase(settings));
  const readableErrorMessage =
    (message.type === 'error' ? message.text : '') || latestStepError?.error || workflow?.error || '';
  const workflowErrorInsight = derivePaperWorkflowErrorInsight({
    apiBaseIssue,
    paper,
    workflow,
    latestStepError,
  });
  const resultJson = JSON.stringify(workflow?.outputs ?? { state: 'waiting' }, null, 2);
  const errorJson = JSON.stringify(
    readableErrorMessage
      ? {
          readable_message: readableErrorMessage,
          possible_cause: workflowErrorInsight.possibleCause,
          fix_hint: workflowErrorInsight.fixHint,
          effective_api_base: getEffectiveApiBase(settings),
          latest_step_error: latestStepError ?? null,
          workflow_error: workflow?.error ?? null,
          workflow_error_details: workflow?.error_details ?? null,
        }
      : { state: 'none' },
    null,
    2,
  );
  const debugJson = JSON.stringify(
    {
      message,
      workflow,
      effectiveApiBase: getEffectiveApiBase(settings),
      interfaceMode: settings.interfaceMode,
      apiPreset: settings.apiPreset,
      inputFileName,
      aiConcurrencyEnabled,
      promptOverrides,
    },
    null,
    2,
  );

  function flashCopied(key: string) {
    setCopiedActionKey(key);
    window.setTimeout(() => {
      setCopiedActionKey((current) => (current === key ? '' : current));
    }, 1600);
  }

  function saveConfig() {
    setSavedSnapshot(currentSnapshot);
    setMessage({ type: 'success', text: copy.saveConfig });
  }

  function updatePromptOverride(key: keyof PaperPromptOverrides, value: string) {
    setPromptOverrides((current) => ({ ...current, [key]: value }));
  }

  function resetWorkflowView() {
    setIsResetOpen(false);

    if (inputPreviewUrl) {
      URL.revokeObjectURL(inputPreviewUrl);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    setSelectedFile(null);
    setInputPreviewUrl('');
    setInputFileName('');
    setWorkflow(null);
    setAiConcurrencyEnabled(true);
    setPromptOverrides(createDefaultPaperPromptOverrides());
    setMessage({ type: 'info', text: paper.idleMessage });

    const nextSnapshot = JSON.stringify({
      inputFileName: '',
      workflowId: '',
      workflowStatus: 'idle',
      aiConcurrencyEnabled: true,
      promptOverrides: createDefaultPaperPromptOverrides(),
    });
    setSavedSnapshot(nextSnapshot);
  }

  function handlePickFile() {
    fileInputRef.current?.click();
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (inputPreviewUrl) {
      URL.revokeObjectURL(inputPreviewUrl);
    }

    setSelectedFile(file);
    setInputFileName(file.name);
    setInputPreviewUrl(URL.createObjectURL(file));
    setMessage({ type: 'info', text: `${paper.sourceTitle}: ${file.name}` });
  }

  async function handleStartWorkflow() {
    if (!selectedFile) {
      setMessage({ type: 'error', text: paper.missingFile });
      return;
    }

    setWorkflow(null);
    setIsSubmitting(true);
    setMessage({ type: 'info', text: paper.starting });

    try {
      const nextWorkflow = await startPaperWorkflowRequest(selectedFile, promptOverrides, aiConcurrencyEnabled, settings, paper);
      setWorkflow(nextWorkflow);
      setMessage({ type: 'info', text: paper.submitted });
    } catch (error) {
      const base = getEffectiveApiBase(settings);
      const isLocalhost = typeof window !== 'undefined' && /^(localhost|127\.0\.0\.1)/.test(window.location.hostname);
      let errorText = normalizeFetchError(error, paper.networkStartError);
      if (isLocalhost && error instanceof TypeError && String(error.message).includes('Failed to fetch')) {
        errorText = `${errorText}（当前尝试连接 ${base}）。如果后端跑在其他端口，请在 URL 后面加 ?apiPort=你的端口，例如 ?apiPort=8080。常用端口会自动探测：3000/3001/5173/8080/8000/5000/9000。`;
      }
      setMessage({
        type: 'error',
        text: errorText,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleRedoWorkflow() {
    if (!selectedFile || isSubmitting) {
      return;
    }

    void handleStartWorkflow();
  }

  async function handleRedoResult(stepName: PaperWorkflowStepName) {
    if (!workflow?.id || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setMessage({ type: 'info', text: `${paper.redoCurrentResult}: ${stepLabels[stepName]}` });

    try {
      const nextWorkflow = await redoPaperWorkflowStepRequest(
        workflow.id,
        stepName,
        promptOverrides,
        aiConcurrencyEnabled,
        settings,
        paper,
      );
      setWorkflow(nextWorkflow);
      setMessage({ type: 'info', text: `${paper.redoCurrentResult}: ${stepLabels[stepName]}` });
    } catch (error) {
      setMessage({
        type: 'error',
        text: normalizeFetchError(error, paper.networkStartError),
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDownloadAll() {
    if (!workflow?.id) {
      return;
    }

    try {
      await downloadPaperArchive(workflow.id, settings, paper);
    } catch (error) {
      setMessage({
        type: 'error',
        text: normalizeFetchError(error, paper.networkFetchError),
      });
    }
  }

  async function handleDownloadAsset(url: string, fileName: string) {
    try {
      await downloadRemoteFile(url, fileName, settings, paper);
    } catch (error) {
      setMessage({
        type: 'error',
        text: normalizeFetchError(error, paper.networkFetchError),
      });
    }
  }

  async function handleCopyAsset(url: string, key: string) {
    const copied = await copyRemoteAsset(url, settings);
    if (copied) {
      flashCopied(key);
      return;
    }

    setMessage({ type: 'error', text: paper.networkFetchError });
  }

  return (
    <main className="feature-shell tool-page-shell">
      <header className="feature-header fade-up delay-1">
        <button className="secondary-button small-button" type="button" onClick={() => setIsConfirmOpen(true)}>
          {backHome}
        </button>
        <div className="feature-header-meta">
          <button className="secondary-button small-button" type="button" onClick={onOpenSettings}>
            {openSettings}
          </button>
        </div>
      </header>

      <section className="tool-workbench fade-up delay-2">
        <div className="tool-header">
          <div>
            <p className="section-label">{appSubtitle}</p>
            <h2>{pageTitle}</h2>
            <p>{pageDescription}</p>
          </div>
          <div className="tool-header-actions">
            <span className={`save-indicator ${isDirty ? 'dirty' : 'clean'}`}>{isDirty ? copy.dirty : copy.clean}</span>
            <button className="secondary-button small-button" type="button" onClick={saveConfig}>
              {copy.saveConfig}
            </button>
            <button className="secondary-button small-button" type="button" onClick={() => setIsResetOpen(true)}>
              {paper.resetWorkflow}
            </button>
            <button className="secondary-button small-button" type="button" onClick={() => downloadText('paper2gal-workflow.json', debugJson, 'application/json')}>
              {paper.exportJson}
            </button>
          </div>
        </div>

        <div className={`message-strip ${message.type}`}>
          <strong>{message.type === 'success' ? copy.statusSuccess : message.type === 'error' ? copy.statusError : copy.statusRunning}</strong>
          <span>{message.text}</span>
        </div>

        <div className="tool-grid transfer-grid">
          <div className="tool-column">
            <section className="tool-card collapsible-panel">
              <button className="collapsible-toggle" type="button" onClick={() => { playSound(isSourcePanelOpen ? 'collapse' : 'expand'); setIsSourcePanelOpen((current) => !current); }} aria-expanded={isSourcePanelOpen}>
                <div className="collapsible-copy">
                  <span className="card-caption">{paper.sourceTitle}</span>
                  <strong>{paper.sourceTitle}</strong>
                  <p>{paper.sourceHint}</p>
                </div>
                <span className="collapsible-state">{isSourcePanelOpen ? copy.hideDetails : copy.showDetails}</span>
              </button>
              {isSourcePanelOpen ? (
                <div className="collapsible-body">
                  <div className="tool-card-header">
                    <div />
                    <button className="secondary-button small-button" type="button" onClick={handlePickFile}>
                      {selectedFile ? copy.replaceImage : copy.chooseImage}
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      hidden
                      onChange={handleFileChange}
                    />
                  </div>
                  <div className="preview-surface paper-preview">
                    {inputPreviewUrl ? <img className="preview-image" src={inputPreviewUrl} alt={inputFileName} /> : <div className="preview-empty">{paper.chooseHint}</div>}
                  </div>
                  <p className="tiny-copy">{inputFileName || copy.noImage}</p>
                </div>
              ) : null}
            </section>

            <section className="tool-card collapsible-panel">
              <button className="collapsible-toggle" type="button" onClick={() => { playSound(isSettingsPanelOpen ? 'collapse' : 'expand'); setIsSettingsPanelOpen((current) => !current); }} aria-expanded={isSettingsPanelOpen}>
                <div className="collapsible-copy">
                  <span className="card-caption">{paper.settingsTitle}</span>
                  <strong>{paper.settingsTitle}</strong>
                  <p>{paper.settingsHint}</p>
                </div>
                <span className="collapsible-state">{isSettingsPanelOpen ? copy.hideDetails : copy.showDetails}</span>
              </button>
              {isSettingsPanelOpen ? (
                <div className="collapsible-body">
                  <div className="paper-source-meta">
                    <div className="result-panel">
                      <strong>{paper.sourceInfo}</strong>
                      <p>{inputFileName || '—'}</p>
                    </div>
                    <div className="result-panel">
                      <strong>{paper.providerInfo}</strong>
                      <p>{workflow?.current_step ? stepLabels[workflow.current_step as PaperWorkflowStepName] ?? workflow.current_step : '—'}</p>
                    </div>
                  </div>
                  <ToggleChip
                    label={paper.workflowConcurrency}
                    checked={aiConcurrencyEnabled}
                    onToggle={() => setAiConcurrencyEnabled((current) => !current)}
                  />
                  <p className="tiny-copy">{paper.workflowConcurrencyHint}</p>
                  <div className="tool-actions-row">
                    <button className="primary-button" type="button" onClick={handleStartWorkflow} disabled={isSubmitting}>
                      {isSubmitting ? paper.starting : paper.start}
                    </button>
                    {selectedFile ? (
                      <button className="secondary-button" type="button" onClick={handleRedoWorkflow} disabled={isSubmitting}>
                        {paper.redoWorkflow}
                      </button>
                    ) : null}
                    {workflow?.id && (
                      <button className="secondary-button" type="button" onClick={handleDownloadAll}>
                        {paper.downloadAll}
                      </button>
                    )}
                  </div>
                  <p className="tiny-copy">{paper.hint}</p>
                </div>
              ) : null}
            </section>

            <section className="tool-card">
              <button className="collapsible-toggle" type="button" onClick={() => setIsPromptPanelOpen((current) => !current)} aria-expanded={isPromptPanelOpen}>
                <div className="collapsible-copy">
                  <span className="card-caption">{paper.promptOverridesTitle}</span>
                  <strong>{paper.promptOverridesTitle}</strong>
                  <p>{paper.promptOverridesHint}</p>
                </div>
                <span className="collapsible-state">{isPromptPanelOpen ? copy.hideDetails : copy.showDetails}</span>
              </button>
              {isPromptPanelOpen ? (
                <div className="collapsible-body">
                  <label className="field">
                    <span>{stepLabels.expression_thinking}</span>
                    <textarea className="settings-textarea" value={promptOverrides.thinking} onChange={(event) => updatePromptOverride('thinking', event.target.value)} />
                  </label>
                  <label className="field">
                    <span>{stepLabels.expression_surprise}</span>
                    <textarea className="settings-textarea" value={promptOverrides.surprise} onChange={(event) => updatePromptOverride('surprise', event.target.value)} />
                  </label>
                  <label className="field">
                    <span>{stepLabels.expression_angry}</span>
                    <textarea className="settings-textarea" value={promptOverrides.angry} onChange={(event) => updatePromptOverride('angry', event.target.value)} />
                  </label>
                  <label className="field">
                    <span>{stepLabels.cg_01}</span>
                    <textarea className="settings-textarea" value={promptOverrides.cg01} onChange={(event) => updatePromptOverride('cg01', event.target.value)} />
                  </label>
                  <label className="field">
                    <span>{stepLabels.cg_02}</span>
                    <textarea className="settings-textarea" value={promptOverrides.cg02} onChange={(event) => updatePromptOverride('cg02', event.target.value)} />
                  </label>
                </div>
              ) : null}
            </section>

            <section className="tool-card">
              <div className="tool-card-section">
                <span className="card-caption">{paper.resultsTitle}</span>
                <h3>{paper.resultsTitle}</h3>
                <p className="muted-copy">{paper.outputsHint}</p>
              </div>

              {workflow?.outputs?.providers && (
                <div className="paper-provider-row">
                  <span className="paper-provider-pill">
                    {paper.providerCutout}: {workflow.outputs.providers.remove_background || '—'}
                  </span>
                  <span className="paper-provider-pill">
                    {paper.providerExpressions}: {workflow.outputs.providers.expressions || '—'}
                  </span>
                  <span className="paper-provider-pill">
                    {paper.providerCg}: {workflow.outputs.providers.cg || '—'}
                  </span>
                </div>
              )}

              {workflow?.outputs && (
                <div className="mini-action-row paper-meta-actions">
                  {workflow.outputs.manifest && (
                    <button className="secondary-button small-button" type="button" onClick={() => window.open(toPaperAssetUrl(settings, workflow.outputs.manifest || ''), '_blank', 'noopener,noreferrer')}>
                      {paper.openManifest}
                    </button>
                  )}
                  {workflow.outputs.meta_files?.character_profile && (
                    <button className="secondary-button small-button" type="button" onClick={() => window.open(toPaperAssetUrl(settings, workflow.outputs.meta_files.character_profile || ''), '_blank', 'noopener,noreferrer')}>
                      {paper.openProfile}
                    </button>
                  )}
                  {workflow.outputs.meta_files?.prompts && (
                    <button className="secondary-button small-button" type="button" onClick={() => window.open(toPaperAssetUrl(settings, workflow.outputs.meta_files.prompts || ''), '_blank', 'noopener,noreferrer')}>
                      {paper.openPrompts}
                    </button>
                  )}
                  {workflow.outputs.meta_files?.character_pack && (
                    <button className="secondary-button small-button" type="button" onClick={() => window.open(toPaperAssetUrl(settings, workflow.outputs.meta_files.character_pack || ''), '_blank', 'noopener,noreferrer')}>
                      {paper.openCharacterPack}
                    </button>
                  )}
                  {workflow.outputs.meta_files?.p2g_handoff && (
                    <button className="secondary-button small-button" type="button" onClick={() => window.open(toPaperAssetUrl(settings, workflow.outputs.meta_files.p2g_handoff || ''), '_blank', 'noopener,noreferrer')}>
                      {paper.openP2gHandoff}
                    </button>
                  )}
                  {workflow.id && (
                    <button className="secondary-button small-button" type="button" onClick={handleDownloadAll}>
                      {paper.downloadAll}
                    </button>
                  )}
                </div>
              )}

              {outputCards.length === 0 ? (
                <div className="log-empty">{paper.noOutputs}</div>
              ) : (
                <div className="paper-output-grid">
                  {outputCards.map((card) => {
                    const copyKey = `asset-${card.fileName}`;
                    return (
                      <article key={card.fileName} className="paper-output-card">
                        <div className="paper-output-card-header">
                          <strong>{card.title}</strong>
                          <button className="secondary-button small-button" type="button" onClick={() => window.open(toPaperAssetUrl(settings, card.url), '_blank', 'noopener,noreferrer')}>
                            {paper.openFile}
                          </button>
                        </div>
                        <img className="paper-output-image" src={toPaperAssetUrl(settings, card.url)} alt={card.title} />
                        <div className="mini-action-row">
                          <button className="secondary-button small-button" type="button" onClick={() => handleDownloadAsset(card.url, card.fileName || inferFileNameFromUrl(card.url))}>
                            {paper.downloadFile}
                          </button>
                          <button className="secondary-button small-button" type="button" onClick={() => handleCopyAsset(card.url, copyKey)}>
                            {copiedActionKey === copyKey ? copy.copied : paper.copyAsset}
                          </button>
                          <button className="secondary-button small-button" type="button" onClick={() => void handleRedoResult(card.stepName)} disabled={isSubmitting}>
                            {paper.redoCurrentResult}
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}

              <div className="result-grid paper-result-grid">
                <CollapsibleCodePanel
                  title={paper.manifestTitle}
                  description={paper.resultSummary}
                  code={resultJson}
                  copy={copy}
                  actions={
                    <>
                      <button className="secondary-button small-button" type="button" onClick={() => copyText(resultJson)}>
                        {copy.copyResult}
                      </button>
                      <button className="secondary-button small-button" type="button" onClick={() => downloadText('paper2gal-result.json', resultJson, 'application/json')}>
                        {copy.downloadResult}
                      </button>
                    </>
                  }
                />

                <CollapsibleCodePanel
                  title={paper.latestError}
                  description={readableErrorMessage || copy.noRecentError}
                  code={errorJson}
                  copy={copy}
                  tone={readableErrorMessage ? 'error' : 'default'}
                  defaultOpen={Boolean(readableErrorMessage)}
                  autoOpenSignal={readableErrorMessage}
                  actions={
                    readableErrorMessage ? (
                      <>
                        <button className="secondary-button small-button" type="button" onClick={() => copyText(errorJson)}>
                          {copy.copyError}
                        </button>
                        <button className="secondary-button small-button" type="button" onClick={() => downloadText('paper2gal-error.json', errorJson, 'application/json')}>
                          {copy.downloadError}
                        </button>
                      </>
                    ) : null
                  }
                />

                <CollapsibleCodePanel
                  title={copy.debugTitle}
                  description={paper.debugSummary}
                  code={debugJson}
                  copy={copy}
                  actions={
                    <>
                      <button className="secondary-button small-button" type="button" onClick={() => copyText(debugJson)}>
                        {copy.copyDebug}
                      </button>
                      <button className="secondary-button small-button" type="button" onClick={() => downloadText('paper2gal-debug.json', debugJson, 'application/json')}>
                        {copy.downloadDebug}
                      </button>
                    </>
                  }
                />
              </div>
            </section>
          </div>

          <div className="tool-column side">
            <section className="tool-card">
              <div className="tool-card-header">
                <div>
                  <span className="card-caption">{copy.progressTitle}</span>
                  <h3>{copy.progressTitle}</h3>
                </div>
                <span className={`status-badge ${badgeClass}`}>{badgeLabel}</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${progress}%` }} />
              </div>
              <div className="progress-meta">
                <span>{copy.workflowId}</span>
                <strong>{workflow?.id ?? 'paper2gal-idle'}</strong>
              </div>
              {workflow ? (
                <div className="paper-step-list">
                  {PAPER_STEP_ORDER.map((stepName) => {
                    const step = workflow.steps?.[stepName];
                    const stepStatus = step?.status ?? 'queued';
                    const debugEntries =
                      step?.debug ? Object.entries(step.debug).filter(([, value]) => value !== null && value !== undefined && value !== '') : [];
                    return (
                      <article key={stepName} className={`paper-step-card ${stepStatus}`}>
                        <div className="paper-step-head">
                          <div>
                            <strong>{stepLabels[stepName]}</strong>
                            <p>{step?.provider || '—'}</p>
                          </div>
                          <span>{statusLabels[stepStatus]}</span>
                        </div>
                        {step?.output_url && (
                          <div className="mini-action-row">
                            <button
                              className="secondary-button small-button"
                              type="button"
                              onClick={() => window.open(toPaperAssetUrl(settings, step.output_url || ''), '_blank', 'noopener,noreferrer')}
                            >
                              {paper.openFile}
                            </button>
                          </div>
                        )}
                        {step?.error && <div className="paper-step-error">{step.error}</div>}
                        {debugEntries.length > 0 && (
                          <details className="paper-debug-panel">
                            <summary>{copy.debugTitle}</summary>
                            <div className="paper-debug-grid">
                              {debugEntries.map(([key, value]) => (
                                <div key={key} className="paper-debug-row">
                                  <span>{key}</span>
                                  <code>{String(value)}</code>
                                </div>
                              ))}
                            </div>
                          </details>
                        )}
                      </article>
                    );
                  })}
                </div>
              ) : (
                <div className="log-empty">{paper.noWorkflow}</div>
              )}
              <div className="tool-card-divider" />
              <CollapsibleCodePanel
                title={copy.logsTitle}
                description={paper.logsHint}
                code={workflowLogText}
                copy={copy}
                defaultOpen={false}
                autoOpenSignal={readableErrorMessage}
                actions={
                  <>
                    <button className="secondary-button small-button" type="button" onClick={() => copyText(workflowLogText)}>
                      {copy.copyLogs}
                    </button>
                    <button className="secondary-button small-button" type="button" onClick={() => downloadText('paper2gal-logs.txt', workflowLogText)}>
                      {copy.downloadLogs}
                    </button>
                  </>
                }
              />
            </section>
          </div>
        </div>
      </section>

      <footer className="home-footer fade-up delay-3">
        <div className="notice-banner">{privacyNote}</div>
      </footer>

      {isConfirmOpen && <ConfirmReturnModal copy={copy} isDirty={isDirty} onCancel={() => setIsConfirmOpen(false)} onConfirm={onBack} />}
      {isResetOpen ? (
        <ConfirmActionModal
          title={paper.resetWorkflowTitle}
          description={paper.resetWorkflowDescription}
          cancelLabel={copy.continueEdit}
          confirmLabel={paper.resetWorkflowConfirm}
          onCancel={() => setIsResetOpen(false)}
          onConfirm={resetWorkflowView}
        />
      ) : null}
    </main>
  );
}

// ─── LLM Hub Page ───
export function LlmHubPage({
  appSubtitle,
  backHome,
  openSettings,
  privacyNote,
  pageTitle,
  pageDescription,
  settings: _settings,
  language,
  onBack,
  onOpenSettings,
}: SharedPageProps) {
  const copy = localizedUiCopy[language];
  const promptCopy = copy.prompt;
  const initialLlmConfig = {
    model: 'gpt-5.4',
    temperature: 0.7,
    topP: 0.92,
    maxTokens: 2048,
    systemNote: 'Keep the OC packet concise, coherent, and easy to hand off to downstream art or voice pipelines.',
  };
  const [persistedState] = useState(() => {
    const ownState = readLocalState('oc-maker.llm-hub', {
      llmConfig: initialLlmConfig,
      savedSnapshot: '',
    });
    // Migrate from old prompt-suite key on first visit
    if (!ownState.savedSnapshot) {
      const oldSuite = readLocalState('oc-maker.prompt-suite', {} as Record<string, unknown>);
      if (oldSuite.llmConfig) {
        return {
          llmConfig: { ...initialLlmConfig, ...(oldSuite.llmConfig as Partial<typeof initialLlmConfig>) },
          savedSnapshot: '',
        };
      }
    }
    return ownState;
  });
  const [llmConfig, setLlmConfig] = useState({ ...initialLlmConfig, ...persistedState.llmConfig });
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const currentSnapshot = JSON.stringify({ llmConfig });
  const [savedSnapshot, setSavedSnapshot] = useState(
    typeof persistedState.savedSnapshot === 'string' ? persistedState.savedSnapshot : currentSnapshot,
  );
  const isDirty = currentSnapshot !== savedSnapshot;
  useBeforeUnloadGuard(isDirty);

  useEffect(() => {
    writeLocalState('oc-maker.llm-hub', { llmConfig, savedSnapshot });
  }, [llmConfig, savedSnapshot]);

  function saveDraft() {
    setSavedSnapshot(currentSnapshot);
  }

  const exportJson = JSON.stringify({ tool: 'llm-hub', llmConfig }, null, 2);

  return (
    <main className="feature-shell tool-page-shell">
      <header className="feature-header fade-up delay-1">
        <button className="secondary-button small-button" type="button" onClick={() => setIsConfirmOpen(true)}>
          {backHome}
        </button>
        <div className="feature-header-meta">
          <button className="secondary-button small-button" type="button" onClick={onOpenSettings}>
            {openSettings}
          </button>
        </div>
      </header>

      <section className="tool-workbench fade-up delay-2">
        <div className="tool-header">
          <div>
            <p className="section-label">{appSubtitle}</p>
            <h2>{pageTitle}</h2>
            <p>{pageDescription}</p>
          </div>
          <div className="tool-header-actions">
            <span className={`save-indicator ${isDirty ? 'dirty' : 'clean'}`}>{isDirty ? copy.dirty : copy.clean}</span>
            <button className="secondary-button small-button" type="button" onClick={saveDraft}>
              {copy.saveDocument}
            </button>
            <button className="secondary-button small-button" type="button" onClick={() => downloadText('oc-llm-config.json', exportJson, 'application/json')}>
              {copy.downloadJson}
            </button>
          </div>
        </div>

        <section className="tool-card">
          <span className="card-caption">{copy.llmTitle}</span>
          <h3>{copy.llmTitle}</h3>
          <div className="form-grid two-column">
            <label className="field">
              <span>{promptCopy.llmModel}</span>
              <select className="settings-input tool-select" value={llmConfig.model} onChange={(event) => setLlmConfig((current) => ({ ...current, model: event.target.value }))}>
                <option>gpt-5.4</option>
                <option>gpt-5.4-mini</option>
                <option>gpt-5.2</option>
              </select>
            </label>
            <RangeField label={promptCopy.llmTemp} min={0} max={2} step={0.01} value={llmConfig.temperature} onChange={(value) => setLlmConfig((current) => ({ ...current, temperature: value }))} />
            <RangeField label={promptCopy.llmTopP} min={0} max={1} step={0.01} value={llmConfig.topP} onChange={(value) => setLlmConfig((current) => ({ ...current, topP: value }))} />
            <label className="field">
              <span>{promptCopy.llmMaxTokens}</span>
              <input className="settings-input" type="number" value={llmConfig.maxTokens} onChange={(event) => setLlmConfig((current) => ({ ...current, maxTokens: Number(event.target.value) }))} />
            </label>
          </div>
          <label className="field">
            <span className="field-title-row">
              <span>{promptCopy.llmSystemNote}</span>
              <button className="secondary-button small-button" type="button" onClick={() => copyText(llmConfig.systemNote)}>
                {copy.copyText}
              </button>
            </span>
            <textarea className="settings-textarea" value={llmConfig.systemNote} onChange={(event) => setLlmConfig((current) => ({ ...current, systemNote: event.target.value }))} />
          </label>
        </section>

        <section className="tool-card">
          <span className="card-caption">{copy.exportTitle}</span>
          <h3>{copy.exportTitle}</h3>
          <p className="muted-copy">{promptCopy.packageHint}</p>
          <CollapsibleCodePanel
            title={copy.exportTitle}
            description={promptCopy.packageHint}
            code={exportJson}
            copy={copy}
            actions={
              <>
                <button className="secondary-button small-button" type="button" onClick={() => copyText(exportJson)}>
                  {copy.copyJson}
                </button>
                <button className="secondary-button small-button" type="button" onClick={() => downloadText('oc-llm-config.json', exportJson, 'application/json')}>
                  {copy.downloadJson}
                </button>
              </>
            }
          />
        </section>
      </section>

      <footer className="home-footer fade-up delay-3">
        <div className="notice-banner">{privacyNote}</div>
      </footer>

      {isConfirmOpen && <ConfirmReturnModal copy={copy} isDirty={isDirty} onCancel={() => setIsConfirmOpen(false)} onConfirm={onBack} />}
    </main>
  );
}

// ─── TTS Export Page ───
export function TtsExportPage({
  appSubtitle,
  backHome,
  openSettings,
  privacyNote,
  pageTitle,
  pageDescription,
  settings: _settings,
  language,
  onBack,
  onOpenSettings,
}: SharedPageProps) {
  const copy = localizedUiCopy[language];
  const promptCopy = copy.prompt;
  const initialTtsConfig = {
    pitch: 0,
    volume: 96,
    sampleRate: 48000,
    referenceClipName: '',
    voice: 'Hanazora',
    language,
    rate: 1,
    emotion: 'calm-dramatic',
    format: 'wav',
    breathiness: 30,
    clarity: 80,
    expressiveness: 50,
    speedVariation: 20,
    pauseStrength: 50,
    toneCurve: 'natural',
    emphasisMode: 'normal',
    noiseReduction: 20,
    audioPostProcessing: false,
    textPreprocessing: false,
    eqPreset: 'flat',
    compression: 30,
    customReplacements: '',
  };
  const [persistedState] = useState(() => {
    const ownState = readLocalState('oc-maker.tts-export', {
      ttsConfig: initialTtsConfig,
      savedSnapshot: '',
    });
    // Migrate from old prompt-suite key on first visit
    if (!ownState.savedSnapshot) {
      const oldSuite = readLocalState('oc-maker.prompt-suite', {} as Record<string, unknown>);
      if (oldSuite.ttsConfig) {
        const migrated = oldSuite.ttsConfig as Partial<typeof initialTtsConfig>;
        return {
          ttsConfig: {
            voice: migrated.voice ?? initialTtsConfig.voice,
            language: migrated.language ?? initialTtsConfig.language,
            rate: migrated.rate ?? initialTtsConfig.rate,
            emotion: migrated.emotion ?? initialTtsConfig.emotion,
            format: migrated.format ?? initialTtsConfig.format,
            pitch: migrated.pitch ?? initialTtsConfig.pitch,
            volume: migrated.volume ?? initialTtsConfig.volume,
            sampleRate: migrated.sampleRate ?? initialTtsConfig.sampleRate,
            referenceClipName: migrated.referenceClipName ?? initialTtsConfig.referenceClipName,
            breathiness: migrated.breathiness ?? initialTtsConfig.breathiness,
            clarity: migrated.clarity ?? initialTtsConfig.clarity,
            expressiveness: migrated.expressiveness ?? initialTtsConfig.expressiveness,
            speedVariation: migrated.speedVariation ?? initialTtsConfig.speedVariation,
            pauseStrength: migrated.pauseStrength ?? initialTtsConfig.pauseStrength,
            toneCurve: migrated.toneCurve ?? initialTtsConfig.toneCurve,
            emphasisMode: migrated.emphasisMode ?? initialTtsConfig.emphasisMode,
            noiseReduction: migrated.noiseReduction ?? initialTtsConfig.noiseReduction,
            audioPostProcessing: migrated.audioPostProcessing ?? initialTtsConfig.audioPostProcessing,
            textPreprocessing: migrated.textPreprocessing ?? initialTtsConfig.textPreprocessing,
            eqPreset: migrated.eqPreset ?? initialTtsConfig.eqPreset,
            compression: migrated.compression ?? initialTtsConfig.compression,
            customReplacements: migrated.customReplacements ?? initialTtsConfig.customReplacements,
          },
          savedSnapshot: '',
        };
      }
    }
    return ownState;
  });
  const [ttsConfig, setTtsConfig] = useState(() => {
    const saved = persistedState.ttsConfig as Partial<typeof initialTtsConfig>;
    return {
      voice: saved.voice ?? initialTtsConfig.voice,
      language: saved.language ?? initialTtsConfig.language,
      rate: saved.rate ?? initialTtsConfig.rate,
      emotion: saved.emotion ?? initialTtsConfig.emotion,
      format: saved.format ?? initialTtsConfig.format,
      pitch: saved.pitch ?? initialTtsConfig.pitch,
      volume: saved.volume ?? initialTtsConfig.volume,
      sampleRate: saved.sampleRate ?? initialTtsConfig.sampleRate,
      referenceClipName: saved.referenceClipName ?? initialTtsConfig.referenceClipName,
      breathiness: saved.breathiness ?? initialTtsConfig.breathiness,
      clarity: saved.clarity ?? initialTtsConfig.clarity,
      expressiveness: saved.expressiveness ?? initialTtsConfig.expressiveness,
      speedVariation: saved.speedVariation ?? initialTtsConfig.speedVariation,
      pauseStrength: saved.pauseStrength ?? initialTtsConfig.pauseStrength,
      toneCurve: saved.toneCurve ?? initialTtsConfig.toneCurve,
      emphasisMode: saved.emphasisMode ?? initialTtsConfig.emphasisMode,
      noiseReduction: saved.noiseReduction ?? initialTtsConfig.noiseReduction,
      audioPostProcessing: saved.audioPostProcessing ?? initialTtsConfig.audioPostProcessing,
      textPreprocessing: saved.textPreprocessing ?? initialTtsConfig.textPreprocessing,
      eqPreset: saved.eqPreset ?? initialTtsConfig.eqPreset,
      compression: saved.compression ?? initialTtsConfig.compression,
      customReplacements: saved.customReplacements ?? initialTtsConfig.customReplacements,
    };
  });
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [isAudioPostOpen, setIsAudioPostOpen] = useState(false);
  const [isPronunciationOpen, setIsPronunciationOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const referenceAudioInputRef = useRef<HTMLInputElement>(null);
  const currentSnapshot = JSON.stringify({ ttsConfig });
  const [savedSnapshot, setSavedSnapshot] = useState(
    typeof persistedState.savedSnapshot === 'string' ? persistedState.savedSnapshot : currentSnapshot,
  );
  const isDirty = currentSnapshot !== savedSnapshot;
  useBeforeUnloadGuard(isDirty);

  useEffect(() => {
    writeLocalState('oc-maker.tts-export', { ttsConfig, savedSnapshot });
  }, [ttsConfig, savedSnapshot]);

  function handleReferenceAudioChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setTtsConfig((current) => ({ ...current, referenceClipName: file.name }));
  }

  function saveDraft() {
    setSavedSnapshot(currentSnapshot);
  }

  const exportJson = JSON.stringify({ tool: 'tts-export', ttsConfig }, null, 2);

  return (
    <main className="feature-shell tool-page-shell">
      <header className="feature-header fade-up delay-1">
        <button className="secondary-button small-button" type="button" onClick={() => setIsConfirmOpen(true)}>
          {backHome}
        </button>
        <div className="feature-header-meta">
          <button className="secondary-button small-button" type="button" onClick={onOpenSettings}>
            {openSettings}
          </button>
        </div>
      </header>

      <section className="tool-workbench fade-up delay-2">
        <div className="tool-header">
          <div>
            <p className="section-label">{appSubtitle}</p>
            <h2>{pageTitle}</h2>
            <p>{pageDescription}</p>
          </div>
          <div className="tool-header-actions">
            <span className={`save-indicator ${isDirty ? 'dirty' : 'clean'}`}>{isDirty ? copy.dirty : copy.clean}</span>
            <button className="secondary-button small-button" type="button" onClick={saveDraft}>
              {copy.saveDocument}
            </button>
            <button className="secondary-button small-button" type="button" onClick={() => downloadText('oc-tts-config.json', exportJson, 'application/json')}>
              {copy.downloadJson}
            </button>
          </div>
        </div>

        <section className="tool-card">
          <span className="card-caption">{copy.ttsTitle}</span>
          <h3>{copy.ttsTitle}</h3>
          <div className="form-grid two-column">
            <label className="field">
              <span>{promptCopy.ttsVoice}</span>
              <select className="settings-input tool-select" value={ttsConfig.voice} onChange={(event) => setTtsConfig((current) => ({ ...current, voice: event.target.value }))}>
                <option>Hanazora</option>
                <option>Mirako</option>
                <option>Rin</option>
              </select>
            </label>
            <label className="field">
              <span>{promptCopy.ttsLanguage}</span>
              <select className="settings-input tool-select" value={ttsConfig.language} onChange={(event) => setTtsConfig((current) => ({ ...current, language: event.target.value as AppLanguage }))}>
                {ttsLanguageOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <RangeField label={promptCopy.ttsRate} min={0.6} max={1.6} step={0.05} value={ttsConfig.rate} onChange={(value) => setTtsConfig((current) => ({ ...current, rate: value }))} />
            <label className="field">
              <span>{promptCopy.ttsEmotion}</span>
              <input className="settings-input" type="text" value={ttsConfig.emotion} onChange={(event) => setTtsConfig((current) => ({ ...current, emotion: event.target.value }))} />
            </label>
            <RangeField label={promptCopy.ttsPitch} min={-12} max={12} step={1} value={ttsConfig.pitch} onChange={(value) => setTtsConfig((current) => ({ ...current, pitch: value }))} />
            <RangeField label={promptCopy.ttsVolume} min={40} max={140} step={1} value={ttsConfig.volume} onChange={(value) => setTtsConfig((current) => ({ ...current, volume: value }))} />
            <RangeField label={promptCopy.ttsBreathiness} min={0} max={100} step={1} value={ttsConfig.breathiness} onChange={(value) => setTtsConfig((current) => ({ ...current, breathiness: value }))} />
            <RangeField label={promptCopy.ttsClarity} min={0} max={100} step={1} value={ttsConfig.clarity} onChange={(value) => setTtsConfig((current) => ({ ...current, clarity: value }))} />
            <RangeField label={promptCopy.ttsExpressiveness} min={0} max={100} step={1} value={ttsConfig.expressiveness} onChange={(value) => setTtsConfig((current) => ({ ...current, expressiveness: value }))} />
            <RangeField label={promptCopy.ttsSpeedVariation} min={0} max={100} step={1} value={ttsConfig.speedVariation} onChange={(value) => setTtsConfig((current) => ({ ...current, speedVariation: value }))} />
          </div>
          <div className="form-grid two-column">
            <label className="field">
              <span>{promptCopy.ttsFormat}</span>
              <select className="settings-input tool-select" value={ttsConfig.format} onChange={(event) => setTtsConfig((current) => ({ ...current, format: event.target.value }))}>
                <option>wav</option>
                <option>mp3</option>
                <option>flac</option>
              </select>
            </label>
            <label className="field">
              <span>{promptCopy.ttsSampleRate}</span>
              <select className="settings-input tool-select" value={String(ttsConfig.sampleRate)} onChange={(event) => setTtsConfig((current) => ({ ...current, sampleRate: Number(event.target.value) }))}>
                <option value="22050">22050 Hz</option>
                <option value="32000">32000 Hz</option>
                <option value="44100">44100 Hz</option>
                <option value="48000">48000 Hz</option>
              </select>
            </label>
          </div>
          <label className="field">
            <span>{promptCopy.ttsReference}</span>
            <div className="reference-audio-row">
              <button className="secondary-button small-button" type="button" onClick={() => referenceAudioInputRef.current?.click()}>
                {promptCopy.ttsReferenceButton}
              </button>
              <span className="reference-audio-name">{ttsConfig.referenceClipName || promptCopy.ttsReferenceHint}</span>
            </div>
            <input ref={referenceAudioInputRef} type="file" accept="audio/wav,audio/mpeg,audio/flac" hidden onChange={handleReferenceAudioChange} />
            <p className="tiny-copy">{promptCopy.ttsReferenceHint}</p>
          </label>
        </section>

        <section className="tool-card">
          <div className="tool-card-header" style={{ cursor: 'pointer' }} onClick={() => { playSound(isAdvancedOpen ? 'collapse' : 'expand'); setIsAdvancedOpen((v) => !v); }} role="button" tabIndex={0}>
            <div>
              <span className="card-caption">{promptCopy.ttsAdvancedParams}</span>
              <h3 style={{ margin: 0 }}>{promptCopy.ttsAdvancedParams}</h3>
            </div>
            <span style={{ fontSize: 12, color: '#8aa4c0' }}>{isAdvancedOpen ? '▲' : '▼'}</span>
          </div>
          {isAdvancedOpen && (
            <div className="form-grid two-column" style={{ marginTop: 16 }}>
              <RangeField label={promptCopy.ttsPauseStrength} min={0} max={100} step={1} value={ttsConfig.pauseStrength} onChange={(value) => setTtsConfig((current) => ({ ...current, pauseStrength: value }))} />
              <label className="field">
                <span>{promptCopy.ttsToneCurve}</span>
                <select className="settings-input tool-select" value={ttsConfig.toneCurve} onChange={(event) => setTtsConfig((current) => ({ ...current, toneCurve: event.target.value }))}>
                  <option value="flat">{promptCopy.ttsToneCurveFlat}</option>
                  <option value="natural">{promptCopy.ttsToneCurveNatural}</option>
                  <option value="dramatic">{promptCopy.ttsToneCurveDramatic}</option>
                  <option value="melodic">{promptCopy.ttsToneCurveMelodic}</option>
                </select>
              </label>
              <label className="field">
                <span>{promptCopy.ttsEmphasisMode}</span>
                <select className="settings-input tool-select" value={ttsConfig.emphasisMode} onChange={(event) => setTtsConfig((current) => ({ ...current, emphasisMode: event.target.value }))}>
                  <option value="normal">{promptCopy.ttsEmphasisNormal}</option>
                  <option value="strong">{promptCopy.ttsEmphasisStrong}</option>
                  <option value="subtle">{promptCopy.ttsEmphasisSubtle}</option>
                </select>
              </label>
            </div>
          )}
        </section>

        <section className="tool-card">
          <div className="tool-card-header" style={{ cursor: 'pointer' }} onClick={() => { playSound(isAudioPostOpen ? 'collapse' : 'expand'); setIsAudioPostOpen((v) => !v); }} role="button" tabIndex={0}>
            <div>
              <span className="card-caption">{promptCopy.ttsAudioPostProcessing}</span>
              <h3 style={{ margin: 0 }}>{promptCopy.ttsAudioPostProcessing}</h3>
            </div>
            <span style={{ fontSize: 12, color: '#8aa4c0' }}>{isAudioPostOpen ? '▲' : '▼'}</span>
          </div>
          {isAudioPostOpen && (
            <div style={{ marginTop: 16 }}>
              <div className="form-grid two-column">
                <RangeField label={promptCopy.ttsNoiseReduction} min={0} max={100} step={1} value={ttsConfig.noiseReduction} onChange={(value) => setTtsConfig((current) => ({ ...current, noiseReduction: value }))} />
                <label className="field">
                  <span>{promptCopy.ttsEqPreset}</span>
                  <select className="settings-input tool-select" value={ttsConfig.eqPreset} onChange={(event) => setTtsConfig((current) => ({ ...current, eqPreset: event.target.value }))}>
                    <option value="flat">{promptCopy.ttsEqFlat}</option>
                    <option value="warm">{promptCopy.ttsEqWarm}</option>
                    <option value="bright">{promptCopy.ttsEqBright}</option>
                    <option value="radio">{promptCopy.ttsEqRadio}</option>
                    <option value="clear">{promptCopy.ttsEqClear}</option>
                  </select>
                </label>
                <RangeField label={promptCopy.ttsCompression} min={0} max={100} step={1} value={ttsConfig.compression} onChange={(value) => setTtsConfig((current) => ({ ...current, compression: value }))} />
              </div>
              <div style={{ marginTop: 12 }}>
                <ToggleChip label={promptCopy.ttsAudioPostProcessing} checked={ttsConfig.audioPostProcessing} onToggle={() => setTtsConfig((current) => ({ ...current, audioPostProcessing: !current.audioPostProcessing }))} />
              </div>
            </div>
          )}
        </section>

        <section className="tool-card">
          <div className="tool-card-header" style={{ cursor: 'pointer' }} onClick={() => { playSound(isPronunciationOpen ? 'collapse' : 'expand'); setIsPronunciationOpen((v) => !v); }} role="button" tabIndex={0}>
            <div>
              <span className="card-caption">{promptCopy.ttsPronunciation}</span>
              <h3 style={{ margin: 0 }}>{promptCopy.ttsPronunciation}</h3>
            </div>
            <span style={{ fontSize: 12, color: '#8aa4c0' }}>{isPronunciationOpen ? '▲' : '▼'}</span>
          </div>
          {isPronunciationOpen && (
            <div style={{ marginTop: 16 }}>
              <div style={{ marginBottom: 12 }}>
                <ToggleChip label={promptCopy.ttsTextPreprocessing} checked={ttsConfig.textPreprocessing} onToggle={() => setTtsConfig((current) => ({ ...current, textPreprocessing: !current.textPreprocessing }))} />
              </div>
              <label className="field">
                <span>{promptCopy.ttsCustomReplacements}</span>
                <textarea className="settings-textarea" rows={4} placeholder={promptCopy.ttsReplacementsHint} value={ttsConfig.customReplacements} onChange={(event) => setTtsConfig((current) => ({ ...current, customReplacements: event.target.value }))} />
                <p className="tiny-copy">{promptCopy.ttsReplacementsHint}</p>
              </label>
            </div>
          )}
        </section>

        <section className="tool-card">
          <span className="card-caption">{copy.exportTitle}</span>
          <h3>{copy.exportTitle}</h3>
          <p className="muted-copy">{promptCopy.packageHint}</p>
          <CollapsibleCodePanel
            title={copy.exportTitle}
            description={promptCopy.packageHint}
            code={exportJson}
            copy={copy}
            actions={
              <>
                <button className="secondary-button small-button" type="button" onClick={() => copyText(exportJson)}>
                  {copy.copyJson}
                </button>
                <button className="secondary-button small-button" type="button" onClick={() => downloadText('oc-tts-config.json', exportJson, 'application/json')}>
                  {copy.downloadJson}
                </button>
              </>
            }
          />
        </section>
      </section>

      <footer className="home-footer fade-up delay-3">
        <div className="notice-banner">{privacyNote}</div>
      </footer>

      {isConfirmOpen && <ConfirmReturnModal copy={copy} isDirty={isDirty} onCancel={() => setIsConfirmOpen(false)} onConfirm={onBack} />}
    </main>
  );
}

export function ImageConverterPage({
  appSubtitle,
  backHome,
  openSettings,
  privacyNote,
  pageTitle,
  pageDescription,
  settings: _settings,
  language,
  onBack,
  onOpenSettings,
}: SharedPageProps) {
  const copy = localizedUiCopy[language];
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [sourcePreviewUrl, setSourcePreviewUrl] = useState('');
  const [convertedUrl, setConvertedUrl] = useState('');
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState('');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const [persistedState] = useState(() =>
    readLocalState(IMAGE_CONVERTER_STORAGE_KEY, {
      outputFormat: 'image/png',
      quality: 92,
      maxWidth: 2048,
      maxHeight: 2048,
      maintainAspect: true,
      savedSnapshot: '',
    }),
  );
  const [outputFormat, setOutputFormat] = useState(persistedState.outputFormat);
  const [quality, setQuality] = useState(persistedState.quality);
  const [maxWidth, setMaxWidth] = useState(persistedState.maxWidth);
  const [maxHeight, setMaxHeight] = useState(persistedState.maxHeight);
  const [maintainAspect, setMaintainAspect] = useState(Boolean(persistedState.maintainAspect));

  const currentSnapshot = JSON.stringify({ outputFormat, quality, maxWidth, maxHeight, maintainAspect });
  const [savedSnapshot, setSavedSnapshot] = useState(persistedState.savedSnapshot || currentSnapshot);
  const isDirty = currentSnapshot !== savedSnapshot;

  useEffect(() => {
    writeLocalState(IMAGE_CONVERTER_STORAGE_KEY, { outputFormat, quality, maxWidth, maxHeight, maintainAspect, savedSnapshot });
  }, [outputFormat, quality, maxWidth, maxHeight, maintainAspect, savedSnapshot]);

  function handlePickFile() { fileInputRef.current?.click(); }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (sourcePreviewUrl) URL.revokeObjectURL(sourcePreviewUrl);
    if (convertedUrl) URL.revokeObjectURL(convertedUrl);
    setSourceFile(file);
    setSourcePreviewUrl(URL.createObjectURL(file));
    setConvertedUrl('');
    setError('');
  }

  async function convertImage() {
    if (!sourceFile || !canvasRef.current) return;
    setIsConverting(true);
    setError('');
    setConvertedUrl('');
    try {
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = reject;
        image.src = sourcePreviewUrl;
      });

      const canvas = canvasRef.current;
      let width = img.naturalWidth;
      let height = img.naturalHeight;

      if (maxWidth > 0 && width > maxWidth) {
        const ratio = maxWidth / width;
        width = maxWidth;
        height = maintainAspect ? Math.round(height * ratio) : height;
      }
      if (maxHeight > 0 && height > maxHeight) {
        const ratio = maxHeight / height;
        height = maxHeight;
        width = maintainAspect ? Math.round(width * ratio) : width;
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error(copy.imageConverter.converting + ' ' + copy.imageConverter.convert);
      ctx.drawImage(img, 0, 0, width, height);

      const dataUrl = canvas.toDataURL(outputFormat, quality / 100);
      setConvertedUrl(dataUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : copy.imageConverter.converting);
    } finally {
      setIsConverting(false);
    }
  }

  function downloadResult() {
    if (!convertedUrl || !sourceFile) return;
    const ext = outputFormat === 'image/jpeg' ? 'jpg' : outputFormat === 'image/webp' ? 'webp' : 'png';
    const name = sourceFile.name.replace(/\.[^.]+$/, '') + `-converted.${ext}`;
    const link = document.createElement('a');
    link.href = convertedUrl;
    link.download = name;
    link.click();
  }

  function resetWorkspace() {
    if (sourcePreviewUrl) URL.revokeObjectURL(sourcePreviewUrl);
    if (convertedUrl) URL.revokeObjectURL(convertedUrl);
    setSourceFile(null);
    setSourcePreviewUrl('');
    setConvertedUrl('');
    setError('');
    setOutputFormat('image/png');
    setQuality(92);
    setMaxWidth(2048);
    setMaxHeight(2048);
    setMaintainAspect(true);
    setSavedSnapshot(JSON.stringify({ outputFormat: 'image/png', quality: 92, maxWidth: 2048, maxHeight: 2048, maintainAspect: true }));
  }

  return (
    <main className="feature-shell tool-page-shell">
      <header className="feature-header fade-up delay-1">
        <button className="secondary-button small-button" type="button" onClick={() => setIsConfirmOpen(true)}>{backHome}</button>
        <div className="feature-header-meta">
          <button className="secondary-button small-button" type="button" onClick={onOpenSettings}>{openSettings}</button>
        </div>
      </header>

      <section className="tool-workbench fade-up delay-2">
        <div className="tool-header">
          <div>
            <p className="section-label">{appSubtitle}</p>
            <h2>{pageTitle}</h2>
            <p>{pageDescription}</p>
          </div>
          <div className="tool-header-actions">
            <span className={`save-indicator ${isDirty ? 'dirty' : 'clean'}`}>{isDirty ? copy.dirty : copy.clean}</span>
            <button className="secondary-button small-button" type="button" onClick={resetWorkspace}>{copy.refreshWorkspace}</button>
            <button className="secondary-button small-button" type="button" onClick={() => setSavedSnapshot(currentSnapshot)}>{copy.saveConfig}</button>
          </div>
        </div>

        <div className="tool-grid transfer-grid">
          <div className="tool-column">
            <section className="tool-card">
              <div className="tool-card-header">
                <div>
                  <span className="card-caption">{copy.imageConverter.sourceTitle}</span>
                  <h3>{copy.imageConverter.sourceTitle}</h3>
                </div>
                <button className="secondary-button small-button" type="button" onClick={handlePickFile}>
                  {sourceFile ? copy.replaceImage : copy.chooseImage}
                </button>
                <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/webp" hidden onChange={handleFileChange} />
              </div>
              <div className="preview-surface">
                {sourcePreviewUrl ? <img className="preview-image" src={sourcePreviewUrl} alt="source" /> : <div className="preview-empty">{copy.imageConverter.noImage}</div>}
              </div>
              {sourceFile && <p className="tiny-copy">{sourceFile.name} ({sourceFile.size > 1024 * 1024 ? `${(sourceFile.size / 1024 / 1024).toFixed(2)} MB` : `${(sourceFile.size / 1024).toFixed(1)} KB`})</p>}
            </section>

            <section className="tool-card">
              <span className="card-caption">{copy.imageConverter.settingsTitle}</span>
              <h3>{copy.imageConverter.settingsTitle}</h3>
              <div className="form-grid two-column">
                <label className="field">
                  <span>{copy.imageConverter.outputFormat}</span>
                  <select className="settings-input tool-select" value={outputFormat} onChange={(e) => setOutputFormat(e.target.value)}>
                    <option value="image/png">PNG (lossless)</option>
                    <option value="image/jpeg">JPEG (compressed)</option>
                    <option value="image/webp">WEBP (modern)</option>
                  </select>
                </label>
                <label className="field">
                  <span>{copy.imageConverter.quality} ({quality}%)</span>
                  <input className="settings-input" type="range" min="10" max="100" step="1" value={quality} onChange={(e) => setQuality(Number(e.target.value))} />
                </label>
                <label className="field">
                  <span>{copy.imageConverter.maxWidth}</span>
                  <input className="settings-input" type="number" min="0" value={maxWidth} onChange={(e) => setMaxWidth(Number(e.target.value))} />
                </label>
                <label className="field">
                  <span>{copy.imageConverter.maxHeight}</span>
                  <input className="settings-input" type="number" min="0" value={maxHeight} onChange={(e) => setMaxHeight(Number(e.target.value))} />
                </label>
              </div>
              <div className="toggle-grid" style={{ marginTop: 8 }}>
                <ToggleChip label={copy.imageConverter.maintainAspect} checked={maintainAspect} onToggle={() => setMaintainAspect((v) => !v)} />
              </div>
              <div className="tool-actions-row" style={{ marginTop: 12 }}>
                <button className="primary-button" type="button" onClick={convertImage} disabled={!sourceFile || isConverting}>
                  {isConverting ? copy.imageConverter.converting : copy.imageConverter.convert}
                </button>
                <button className="secondary-button" type="button" onClick={downloadResult} disabled={!convertedUrl}>
                  {copy.imageConverter.download}
                </button>
              </div>
              {error && <p className="tiny-copy" style={{ color: '#f45a5a', marginTop: 8 }}>{error}</p>}
            </section>
          </div>

          <div className="tool-column side">
            <section className="tool-card">
              <span className="card-caption">{copy.imageConverter.resultTitle}</span>
              <h3>{copy.imageConverter.resultTitle}</h3>
              <div className="preview-surface">
                {convertedUrl ? <img className="preview-image" src={convertedUrl} alt="converted" /> : <div className="preview-empty">{isConverting ? copy.imageConverter.converting : copy.imageConverter.resultPlaceholder}</div>}
              </div>
              {convertedUrl && (
                <div className="progress-meta" style={{ marginTop: 8 }}>
                  <span>{copy.imageConverter.formatLabel}</span><strong>{outputFormat.replace('image/', '').toUpperCase()}</strong>
                  <span>{copy.imageConverter.qualityLabel}</span><strong>{quality}%</strong>
                </div>
              )}
            </section>
          </div>
        </div>
      </section>

      <footer className="home-footer fade-up delay-3">
        <div className="notice-banner">{privacyNote}</div>
      </footer>
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {isConfirmOpen && <ConfirmReturnModal copy={copy} isDirty={isDirty} onCancel={() => setIsConfirmOpen(false)} onConfirm={onBack} />}
    </main>
  );
}

function RangeField({
  label,
  min,
  max,
  step,
  value,
  onChange,
}: {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="field range-field">
      <div className="range-field-top">
        <span>{label}</span>
        <strong>{Number.isInteger(value) ? value : value.toFixed(2)}</strong>
      </div>
      <input className="tool-range" type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} />
    </label>
  );
}

function ToggleChip({
  label,
  checked,
  onToggle,
}: {
  label: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <button className={`toggle-chip ${checked ? 'active' : ''}`} type="button" onClick={onToggle}>
      <span className="toggle-chip-dot" />
      {label}
    </button>
  );
}
