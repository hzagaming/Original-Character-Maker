import type { FeatureScreen } from './types';

export type FeatureCategory = 'creation' | 'character' | 'world' | 'audio' | 'assets';

export type ActionIconKind =
  | 'face-maker'
  | 'style-transfer'
  | 'prompt-suite'
  | 'llm-hub'
  | 'tts-export'
  | 'paper2gal'
  | 'image-converter'
  | 'character-gif'
  | 'index-tts'
  | 'audio-editor'
  | 'audio-converter'
  | 'asset-gallery'
  | 'relationship-web'
  | 'character-card'
  | 'character-chronicle'
  | 'world-encyclopedia'
  | 'inspiration-generator'
  | 'character-stats'
  | 'color-palette'
  | 'dialogue-generator'
  | 'skill-tree'
  | 'battle-card'
  | 'scene-writer'
  | 'character-au'
  | 'character-nemesis'
  | 'character-interview'
  | 'docs';

export interface FeatureMeta {
  id: Exclude<FeatureScreen, 'home'>;
  category: FeatureCategory;
  icon: ActionIconKind;
  labelKey: string;
  actionKey: string;
  pageTitleKey: string;
  pageDescKey: string;
  importable: boolean;
  workspaceTitle: string;
  panelTitle: string;
  pipelineTitle: string;
  todoOne: string;
  todoTwo: string;
}

export const FEATURE_REGISTRY: FeatureMeta[] = [
  // ── 创作生成 ──
  {
    id: 'face-maker',
    category: 'creation',
    icon: 'face-maker',
    labelKey: 'featureFace',
    actionKey: 'actionFace',
    pageTitleKey: 'pageFaceTitle',
    pageDescKey: 'pageFaceDescription',
    importable: true,
    workspaceTitle: 'Character Canvas',
    panelTitle: 'Face / Hair / Palette',
    pipelineTitle: 'Presets / Export',
    todoOne: '补角色图层、部位分类和颜色系统',
    todoTwo: '补随机生成、重置与导出 PNG',
  },
  {
    id: 'style-transfer',
    category: 'creation',
    icon: 'style-transfer',
    labelKey: 'featureStyle',
    actionKey: 'actionStyle',
    pageTitleKey: 'pageStyleTitle',
    pageDescKey: 'pageStyleDescription',
    importable: true,
    workspaceTitle: 'Input / Output Preview',
    panelTitle: 'Model / Prompt / Seed',
    pipelineTitle: 'Queue / History',
    todoOne: '补输入图片、模型选择和参数面板',
    todoTwo: '补任务状态、结果预览与下载',
  },
  {
    id: 'character-gif',
    category: 'creation',
    icon: 'character-gif',
    labelKey: 'featureGif',
    actionKey: 'actionGif',
    pageTitleKey: 'pageGifTitle',
    pageDescKey: 'pageGifDescription',
    importable: true,
    workspaceTitle: 'GIF Generator Workspace',
    panelTitle: 'GIF Parameters',
    pipelineTitle: 'Generated GIF / Logs',
    todoOne: '补 GIF 帧数、帧率、循环与动画类型配置',
    todoTwo: '补角色图像输入与动态 GIF 生成导出',
  },
  {
    id: 'prompt-suite',
    category: 'creation',
    icon: 'prompt-suite',
    labelKey: 'featurePrompt',
    actionKey: 'actionPromptSuite',
    pageTitleKey: 'pagePromptTitle',
    pageDescKey: 'pagePromptDescription',
    importable: true,
    workspaceTitle: 'Prompt Workspace',
    panelTitle: 'Character Prompt / World-building',
    pipelineTitle: 'Generated Assets',
    todoOne: '补角色资料、Prompt 模板和导出逻辑',
    todoTwo: '补世界观编辑与本地保存',
  },
  {
    id: 'llm-hub',
    category: 'creation',
    icon: 'llm-hub',
    labelKey: 'featureLlm',
    actionKey: 'actionLlmHub',
    pageTitleKey: 'pageLlmTitle',
    pageDescKey: 'pageLlmDescription',
    importable: true,
    workspaceTitle: 'LLM Workspace',
    panelTitle: 'Model / Parameters',
    pipelineTitle: 'Generated Text',
    todoOne: '补 LLM 模型选择、温度与系统提示词',
    todoTwo: '补文本生成、历史记录与导出',
  },
  {
    id: 'paper2gal',
    category: 'creation',
    icon: 'paper2gal',
    labelKey: 'featurePaper',
    actionKey: 'actionPaper2Gal',
    pageTitleKey: 'pagePaperTitle',
    pageDescKey: 'pagePaperDescription',
    importable: true,
    workspaceTitle: 'paper2gal Stage',
    panelTitle: 'Asset Controls',
    pipelineTitle: 'Outputs / Logs',
    todoOne: '补图片素材工作流配置与启动入口',
    todoTwo: '补 Character Workflow 仓库联动',
  },
  {
    id: 'image-converter',
    category: 'creation',
    icon: 'image-converter',
    labelKey: 'featureImageConverter',
    actionKey: 'actionImageConverter',
    pageTitleKey: 'pageImageConverterTitle',
    pageDescKey: 'pageImageConverterDescription',
    importable: true,
    workspaceTitle: 'Converter Workspace',
    panelTitle: 'Format Controls',
    pipelineTitle: 'Output / Download',
    todoOne: '补格式选择与质量调整',
    todoTwo: '补批量转换与尺寸调整',
  },
  {
    id: 'inspiration-generator',
    category: 'creation',
    icon: 'inspiration-generator',
    labelKey: 'featureInspirationGenerator',
    actionKey: 'actionInspirationGenerator',
    pageTitleKey: 'pageInspirationGeneratorTitle',
    pageDescKey: 'pageInspirationGeneratorDescription',
    importable: false,
    workspaceTitle: 'Generator Workspace',
    panelTitle: 'Prompts / Presets',
    pipelineTitle: 'Results / History',
    todoOne: '补 Prompt 模板与预设管理',
    todoTwo: '补结果收藏与历史记录',
  },
  {
    id: 'dialogue-generator',
    category: 'creation',
    icon: 'dialogue-generator',
    labelKey: 'featureDialogueGenerator',
    actionKey: 'actionDialogueGenerator',
    pageTitleKey: 'pageDialogueGeneratorTitle',
    pageDescKey: 'pageDialogueGeneratorDescription',
    importable: false,
    workspaceTitle: 'Dialogue Workspace',
    panelTitle: 'Characters / Tone',
    pipelineTitle: 'Lines / Export',
    todoOne: '补角色选择与语气配置',
    todoTwo: '补台词生成与批量导出',
  },
  // ── 角色资料 ──
  {
    id: 'character-card',
    category: 'character',
    icon: 'character-card',
    labelKey: 'featureCharacterCard',
    actionKey: 'actionCharacterCard',
    pageTitleKey: 'pageCharacterCardTitle',
    pageDescKey: 'pageCharacterCardDescription',
    importable: false,
    workspaceTitle: 'Card Editor',
    panelTitle: 'Fields / Theme',
    pipelineTitle: 'Preview / Export',
    todoOne: '补字段编辑与主题切换',
    todoTwo: '补 PNG 导出与模板选择',
  },
  {
    id: 'character-chronicle',
    category: 'character',
    icon: 'character-chronicle',
    labelKey: 'featureCharacterChronicle',
    actionKey: 'actionCharacterChronicle',
    pageTitleKey: 'pageCharacterChronicleTitle',
    pageDescKey: 'pageCharacterChronicleDescription',
    importable: false,
    workspaceTitle: 'Chronicle Editor',
    panelTitle: 'Events / Timeline',
    pipelineTitle: 'Export / Import',
    todoOne: '补事件增删改与排序',
    todoTwo: '补时间轴可视化与导出',
  },
  {
    id: 'relationship-web',
    category: 'character',
    icon: 'relationship-web',
    labelKey: 'featureRelationshipWeb',
    actionKey: 'actionRelationshipWeb',
    pageTitleKey: 'pageRelationshipWebTitle',
    pageDescKey: 'pageRelationshipWebDescription',
    importable: false,
    workspaceTitle: 'Relationship Canvas',
    panelTitle: 'Nodes / Connections',
    pipelineTitle: 'Export / Import',
    todoOne: '补节点拖拽、连线编辑',
    todoTwo: '补关系类型与布局算法',
  },
  {
    id: 'skill-tree',
    category: 'character',
    icon: 'skill-tree',
    labelKey: 'featureSkillTree',
    actionKey: 'actionSkillTree',
    pageTitleKey: 'pageSkillTreeTitle',
    pageDescKey: 'pageSkillTreeDescription',
    importable: false,
    workspaceTitle: 'Skill Tree Canvas',
    panelTitle: 'Nodes / Connections',
    pipelineTitle: 'Export / Import',
    todoOne: '补节点编辑与连线系统',
    todoTwo: '补技能类型与 JSON 导出',
  },
  {
    id: 'character-stats',
    category: 'character',
    icon: 'character-stats',
    labelKey: 'featureCharacterStats',
    actionKey: 'actionCharacterStats',
    pageTitleKey: 'pageCharacterStatsTitle',
    pageDescKey: 'pageCharacterStatsDescription',
    importable: false,
    workspaceTitle: 'Stats Designer',
    panelTitle: 'Attributes / Radar',
    pipelineTitle: 'Presets / Export',
    todoOne: '补属性配置与雷达图',
    todoTwo: '补预设导入与数值平衡',
  },
  {
    id: 'battle-card',
    category: 'character',
    icon: 'battle-card',
    labelKey: 'featureBattleCard',
    actionKey: 'actionBattleCard',
    pageTitleKey: 'pageBattleCardTitle',
    pageDescKey: 'pageBattleCardDescription',
    importable: false,
    workspaceTitle: 'Battle Card Editor',
    panelTitle: 'Stats / Skills',
    pipelineTitle: 'Preview / Export',
    todoOne: '补属性自动计算与技能标签',
    todoTwo: '补战斗卡 PNG 导出',
  },
  {
    id: 'scene-writer',
    category: 'character',
    icon: 'scene-writer',
    labelKey: 'featureSceneWriter',
    actionKey: 'actionSceneWriter',
    pageTitleKey: 'pageSceneWriterTitle',
    pageDescKey: 'pageSceneWriterDescription',
    importable: false,
    workspaceTitle: 'Scene Studio',
    panelTitle: 'Script / Cast',
    pipelineTitle: 'Preview / Export',
    todoOne: '补场景创建与剧本行编辑',
    todoTwo: '补剧本预览与 Markdown 导出',
  },
  {
    id: 'character-au',
    category: 'character',
    icon: 'character-au',
    labelKey: 'featureCharacterAu',
    actionKey: 'actionCharacterAu',
    pageTitleKey: 'pageCharacterAuTitle',
    pageDescKey: 'pageCharacterAuDescription',
    importable: false,
    workspaceTitle: 'AU Generator',
    panelTitle: 'Base / Template',
    pipelineTitle: 'Compare / Export',
    todoOne: '补 AU 模板选择与角色属性映射',
    todoTwo: '补原版与 AU 版本对比与导出',
  },
  {
    id: 'character-nemesis',
    category: 'character',
    icon: 'character-nemesis',
    labelKey: 'featureCharacterNemesis',
    actionKey: 'actionCharacterNemesis',
    pageTitleKey: 'pageCharacterNemesisTitle',
    pageDescKey: 'pageCharacterNemesisDescription',
    importable: false,
    workspaceTitle: 'Nemesis Generator',
    panelTitle: 'Base / Nemesis Type',
    pipelineTitle: 'Compare / Export',
    todoOne: '补宿敌类型选择与角色属性映射',
    todoTwo: '补原版与宿敌对比与 Markdown 导出',
  },
  {
    id: 'character-interview',
    category: 'character',
    icon: 'character-interview',
    labelKey: 'featureCharacterInterview',
    actionKey: 'actionCharacterInterview',
    pageTitleKey: 'pageCharacterInterviewTitle',
    pageDescKey: 'pageCharacterInterviewDescription',
    importable: false,
    workspaceTitle: 'Interview Studio',
    panelTitle: 'Character / Mode',
    pipelineTitle: 'Q&A / Export',
    todoOne: '补角色选择与访谈模式',
    todoTwo: '补问答编辑与 Markdown 导出',
  },
  // ── 世界观管理 ──
  {
    id: 'world-encyclopedia',
    category: 'world',
    icon: 'world-encyclopedia',
    labelKey: 'featureWorldEncyclopedia',
    actionKey: 'actionWorldEncyclopedia',
    pageTitleKey: 'pageWorldEncyclopediaTitle',
    pageDescKey: 'pageWorldEncyclopediaDescription',
    importable: true,
    workspaceTitle: 'Encyclopedia Editor',
    panelTitle: 'Entries / Categories',
    pipelineTitle: 'Search / Export',
    todoOne: '补条目编辑与分类管理',
    todoTwo: '补全文搜索与 JSON 导出',
  },
  {
    id: 'color-palette',
    category: 'world',
    icon: 'color-palette',
    labelKey: 'featureColorPalette',
    actionKey: 'actionColorPalette',
    pageTitleKey: 'pageColorPaletteTitle',
    pageDescKey: 'pageColorPaletteDescription',
    importable: false,
    workspaceTitle: 'Palette Designer',
    panelTitle: 'Colors / Harmonies',
    pipelineTitle: 'Export / Apply',
    todoOne: '补色彩选择与调和算法',
    todoTwo: '补导出格式与角色关联',
  },
  // ── 音频语音 ──
  {
    id: 'tts-export',
    category: 'audio',
    icon: 'tts-export',
    labelKey: 'featureTts',
    actionKey: 'actionTtsExport',
    pageTitleKey: 'pageTtsTitle',
    pageDescKey: 'pageTtsDescription',
    importable: true,
    workspaceTitle: 'TTS Workspace',
    panelTitle: 'Voice / Emotion / Format',
    pipelineTitle: 'Audio Outputs',
    todoOne: '补语音选择、语速、音高与情感配置',
    todoTwo: '补参考音频上传、合成与导出',
  },
  {
    id: 'index-tts',
    category: 'audio',
    icon: 'index-tts',
    labelKey: 'featureIndexTts',
    actionKey: 'actionIndexTts',
    pageTitleKey: 'pageIndexTtsTitle',
    pageDescKey: 'pageIndexTtsDescription',
    importable: true,
    workspaceTitle: 'IndexTTS Workspace',
    panelTitle: 'Voice / Emotion / Format',
    pipelineTitle: 'Generated Audio / Logs',
    todoOne: '补文本输入、参考音频上传与音色克隆配置',
    todoTwo: '补 IndexTTS 语音合成与音频导出',
  },
  {
    id: 'audio-editor',
    category: 'audio',
    icon: 'audio-editor',
    labelKey: 'featureAudioEditor',
    actionKey: 'actionAudioEditor',
    pageTitleKey: 'pageAudioEditorTitle',
    pageDescKey: 'pageAudioEditorDescription',
    importable: true,
    workspaceTitle: 'Audio Editor Workspace',
    panelTitle: 'Waveform & Effects',
    pipelineTitle: 'Export / Download',
    todoOne: '补音频导入与波形可视化',
    todoTwo: '补剪辑、效果处理与导出',
  },
  {
    id: 'audio-converter',
    category: 'audio',
    icon: 'audio-converter',
    labelKey: 'featureAudioConverter',
    actionKey: 'actionAudioConverter',
    pageTitleKey: 'pageAudioConverterTitle',
    pageDescKey: 'pageAudioConverterDescription',
    importable: true,
    workspaceTitle: 'Audio Converter Workspace',
    panelTitle: 'Format & Parameters',
    pipelineTitle: 'Convert / Download',
    todoOne: '补音频导入与格式选择',
    todoTwo: '补参数调整与批量转换',
  },
  // ── 资产与文档 ──
  {
    id: 'asset-gallery',
    category: 'assets',
    icon: 'asset-gallery',
    labelKey: 'featureAssetGallery',
    actionKey: 'actionAssetGallery',
    pageTitleKey: 'pageAssetGalleryTitle',
    pageDescKey: 'pageAssetGalleryDescription',
    importable: false,
    workspaceTitle: 'Asset Gallery',
    panelTitle: 'Assets / Filters',
    pipelineTitle: 'Preview / Export',
    todoOne: '补资产导入、分类与搜索',
    todoTwo: '补批量导出与预览弹窗',
  },
  {
    id: 'docs',
    category: 'assets',
    icon: 'docs',
    labelKey: 'featureDocs',
    actionKey: 'actionBack',
    pageTitleKey: 'pageDocsTitle',
    pageDescKey: 'pageDocsDescription',
    importable: false,
    workspaceTitle: 'Documentation',
    panelTitle: 'Topics / Search',
    pipelineTitle: 'Content / Navigation',
    todoOne: '补文档内容与搜索索引',
    todoTwo: '补多语言文档与快捷键参考',
  },
];

export function getFeatureMeta(id: Exclude<FeatureScreen, 'home'>): FeatureMeta | undefined {
  return FEATURE_REGISTRY.find((f) => f.id === id);
}

export function getFeaturesByCategory(category: FeatureCategory): FeatureMeta[] {
  return FEATURE_REGISTRY.filter((f) => f.category === category);
}

export function getImportableFeatures(): FeatureMeta[] {
  return FEATURE_REGISTRY.filter((f) => f.importable);
}

export function getFeatureDetailsFromRegistry(
  screen: Exclude<FeatureScreen, 'home'>,
  messages: Record<string, string>,
) {
  const meta = getFeatureMeta(screen);
  if (!meta) {
    return {
      title: messages.appTitle || 'Unknown',
      description: '',
      workspaceTitle: 'Workspace',
      panelTitle: 'Controls',
      pipelineTitle: 'Outputs',
      todoOne: '',
      todoTwo: '',
    };
  }
  return {
    title: messages[meta.pageTitleKey] as string,
    description: messages[meta.pageDescKey] as string,
    workspaceTitle: meta.workspaceTitle,
    panelTitle: meta.panelTitle,
    pipelineTitle: meta.pipelineTitle,
    todoOne: meta.todoOne,
    todoTwo: meta.todoTwo,
  };
}
