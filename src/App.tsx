import { useEffect, useState, type CSSProperties } from 'react';
import DevModePanel from './DevModePanel';
import { createPortal } from 'react-dom';
import type {
  AccentPalette,
  AppLanguage,
  FeatureScreen,
  FontPreset,
  SavedStylePreset,
  SettingsState,
  SettingsTab,
  ShortcutAction,
  ShortcutMap,
  StartModalStep,
  StylePreset,
  ThemeDepth,
} from './types';
import { detectWorkflowApiBaseIssue, getEffectiveApiBase, getPresetApiBase, requiresHostedApiBase } from './apiConfig';
import { Paper2GalPage, PromptSuitePage, StyleTransferPage, LlmHubPage, TtsExportPage, ImageConverterPage } from './workflowPages';
import {
  defaultAudioSettings,
  initAudio,
  MUSIC_PRESETS_LIST,
  playSound,
  previewSound,
  SOUND_PRESETS,
  SOUND_PREVIEW_LIST,
  startMusic,
  stopMusic,
  updateAudioSettings,
} from './audioEngine';

const VERSION = '0.5.1';
const STORAGE_KEY = 'oc-maker.settings';
const MODAL_CLOSE_MS = 220;

type Messages = {
  appTitle: string;
  appSubtitle: string;
  versionLabel: string;
  overviewTitle: string;
  overviewDescription: string;
  workflowTitle: string;
  workflowDescription: string;
  workflowHint: string;
  workflowFormats: string;
  startButton: string;
  settingsButton: string;
  progressTitle: string;
  progressDescription: string;
  outputTitle: string;
  outputDescription: string;
  privacyNote: string;
  footerNote: string;
  metricModules: string;
  metricLanguages: string;
  metricStorage: string;
  featureFace: string;
  featureStyle: string;
  featureSeries: string;
  featurePrompt: string;
  featureLlm: string;
  featureTts: string;
  featurePaper: string;
  featureImageConverter: string;
  backHome: string;
  openSettings: string;
  comingSoon: string;
  preparedModules: string;
  placeholderTodo: string;
  placeholderCanvas: string;
  placeholderSettings: string;
  placeholderPipeline: string;
  placeholderHint: string;
  startModalTitle: string;
  startModalDescription: string;
  startModalSeriesTitle: string;
  startModalSeriesDescription: string;
  actionFace: string;
  actionStyle: string;
  actionSeries: string;
  actionPromptSuite: string;
  actionLlmHub: string;
  actionTtsExport: string;
  actionPaper2Gal: string;
  actionImageConverter: string;
  actionBack: string;
  settingsTitle: string;
  tabStyle: string;
  tabLanguage: string;
  tabApi: string;
  tabAudio: string;
  tabAnimation: string;
  tabShortcuts: string;
  tabAnnouncement: string;
  tabAbout: string;
  stylePresetTitle: string;
  stylePresetDefault: string;
  stylePresetPaper2Gal: string;
  themeModeTitle: string;
  themeLight: string;
  themeDeep: string;
  customContrastLabel: string;
  customContrastHint: string;
  accentTitle: string;
  customAccentLabel: string;
  styleLockedTitle: string;
  styleLockedDescription: string;
  fontTitle: string;
  fontSans: string;
  fontRounded: string;
  fontSerif: string;
  languageTitle: string;
  apiModeTitle: string;
  builtinMode: string;
  customApiMode: string;
  apiPresetTitle: string;
  apiPresetPlato: string;
  apiPresetHint: string;
  apiPresetUnavailable: string;
  apiBaseTitle: string;
  apiBasePlaceholder: string;
  apiKeyTitle: string;
  apiKeyPlaceholder: string;
  apiHelp: string;
  apiHint: string;
  apiModelEndpointWarning: string;
  apiEffectiveTitle: string;
  apiEffectiveBuiltin: string;
  apiEffectiveCustom: string;
  apiPrivacy: string;
  shortcutsTitle: string;
  shortcutsHint: string;
  shortcutsReset: string;
  shortcutsExperimental: string;
  announcementTitle: string;
  announcementHistoryButton: string;
  announcementDescription: string;
  announcementList1: string;
  announcementList2: string;
  announcementList3: string;
  aboutTitle: string;
  aboutDescription: string;
  paperSiteLabel: string;
  profileLinkLabel: string;
  repoLinkLabel: string;
  pageFaceTitle: string;
  pageFaceDescription: string;
  pageStyleTitle: string;
  pageStyleDescription: string;
  pagePromptTitle: string;
  pagePromptDescription: string;
  pageLlmTitle: string;
  pageLlmDescription: string;
  pageTtsTitle: string;
  pageTtsDescription: string;
  pagePaperTitle: string;
  pagePaperDescription: string;
  pageImageConverterTitle: string;
  pageImageConverterDescription: string;
  moduleCanvas: string;
  modulePanel: string;
  modulePipeline: string;
  moduleStorage: string;
  animationTitle: string;
  animationEnabled: string;
  animationSpeed: string;
  animationUiFadeIn: string;
  animationButtonHover: string;
  animationPageTransitions: string;
  animationModalTransitions: string;
  animationHint: string;
  borderWidthTitle: string;
  audioTitle: string;
  audioMasterVolume: string;
  audioSfxVolume: string;
  audioMusicVolume: string;
  audioSfxEnabled: string;
  audioMusicEnabled: string;
  audioSoundOnInteractOn: string;
  audioSoundOnInteractOff: string;
  audioHint: string;
  audioSfxPreset: string;
  audioMusicPreset: string;
  audioPitch: string;
  audioDuration: string;
  audioFilter: string;
  audioDetune: string;
  audioReverb: string;
  audioMusicPitch: string;
  audioMusicTempo: string;
  audioPreview: string;
  presetClassic: string;
  presetElectronic: string;
  presetRetro: string;
  presetXylophone: string;
  presetBell: string;
  presetSpace: string;
  presetDrum: string;
  presetPiano: string;
  presetSynthwave: string;
  presetChiptune: string;
  presetStrings: string;
  presetWind: string;
  presetJazz: string;
  presetPercussion: string;
  presetAmbient: string;
  presetScifi: string;
  presetCartoon: string;
  presetHorror: string;
  presetNature: string;
  presetMechanical: string;
  musicOrchestral: string;
  musicAmbient: string;
  musicElectronic: string;
  musicPiano: string;
  musicSynthwave: string;
  musicNature: string;
  musicJazz: string;
  musicMeditation: string;
  musicCyber: string;
  musicLofi: string;
  musicRock: string;
  musicBlues: string;
  musicFolk: string;
  musicReggae: string;
  musicFunk: string;
  musicSoul: string;
  musicGospel: string;
  musicCountry: string;
  musicCeltic: string;
  musicOriental: string;
  musicTribal: string;
  musicSpace: string;
  musicUnderwater: string;
  musicRain: string;
  musicWindchime: string;
  musicFireplace: string;
  musicNight: string;
  musicSunrise: string;
  musicDreamy: string;
  musicEnergetic: string;
  musicBattle: string;
  musicAdventure: string;
  musicMystery: string;
  musicRomantic: string;
  musicNostalgic: string;
  musicHopeful: string;
  musicEpic: string;
  musicChill: string;
  musicStudy: string;
  musicFocus: string;
  audioSfxAttack: string;
  audioSfxDecay: string;
  audioSfxSustain: string;
  audioSfxRelease: string;
  audioSfxPan: string;
  audioMusicReverb: string;
  audioMusicFilter: string;
  audioMusicStereoWidth: string;
  audioAdvancedTitle: string;
  audioSpatialTitle: string;
  fontCustomLabel: string;
  fontCustomHint: string;
  fontCustomPlaceholder: string;
  // v0.4.2 new tabs
  tabPerformance: string;
  tabOthers: string;
  // Audio reset & custom
  audioResetSfx: string;
  audioResetMusic: string;
  audioResetAdvanced: string;
  audioCustomSfx: string;
  audioCustomMusic: string;
  audioUploadFile: string;
  audioRemoveCustom: string;
  audioCustomActive: string;
  // Animation
  animationReset: string;
  animationEffectsTitle: string;
  // Performance
  performanceTitle: string;
  performanceReduceAnimations: string;
  performanceDisableGlass: string;
  performanceLowResPreview: string;
  performanceLazyLoad: string;
  performanceDisableParticles: string;
  performanceAggressiveCache: string;
  performanceDevMode: string;
  performanceImageQuality: string;
  performanceImageQualityLow: string;
  performanceImageQualityMedium: string;
  performanceImageQualityHigh: string;
  performanceMaxConcurrent: string;
  performanceReset: string;
  performanceHint: string;
  // API channels
  apiChannel1: string;
  apiChannel2: string;
  apiChannel3: string;
  apiClearChannel: string;
  apiConfirmClear: string;
  apiConfirmClearAgain: string;
  // Others
  othersTitle: string;
  othersTooltips: string;
  othersConfirmDestructive: string;
  othersKeyboardHints: string;
  othersSmoothScroll: string;
  othersNotificationSound: string;
  othersAutoSave: string;
  othersDateFormat: string;
  othersDateFormatIso: string;
  othersDateFormatLocale: string;
  othersDateFormatFriendly: string;
  othersShowClock: string;
  othersStatusBar: string;
  othersHighContrastFocus: string;
  othersResetAll: string;
  othersRestoreDefaults: string;
  othersConfirmReset: string;
  othersConfirmResetAgain: string;
  othersConfirmRestore: string;
  othersConfirmRestoreAgain: string;
  othersHint: string;
  othersLanguageSettings: string;
  othersLanguageMissing: string;
  // Style presets
  styleSavePreset: string;
  stylePreset1: string;
  stylePreset2: string;
  stylePresetName: string;
  stylePresetSaved: string;
  stylePresetSame: string;
  stylePresetUse: string;
  styleResetDefaults: string;
  // Confirm dialog
  confirmYes: string;
  confirmNo: string;
  confirmCancel: string;
  // Toggles
  toggleOn: string;
  toggleOff: string;
};

type BaseLanguage = 'zh' | 'ja' | 'en' | 'ru';

const translations: Record<BaseLanguage, Messages> = {
  zh: {
  appTitle: 'Original Character Maker',
  appSubtitle: '自定义 OC 角色中控台',
  versionLabel: '版本',
  overviewTitle: '单图进，多资产出',
  overviewDescription:
      '把捏脸、转画风、角色 Prompt / LLM / TTS 封装、paper2gal 素材生成与图片格式转换统一到同一个入口页里，方便集中管理角色创作流程。',
  workflowTitle: '开始新的工作流',
  workflowDescription: '从这里直接进入捏脸、转画风、角色 Prompt + LLM / TTS 或 paper2gal 工作台。',
  workflowHint: '点击开始会打开七个主入口弹窗，也可以直接点击上面的图标卡片进入。',
  workflowFormats: '支持 PNG / JPG / WEBP，推荐上传单人立绘或清晰半身图。',
    startButton: '开始',
    settingsButton: '设置',
    progressTitle: '工作流进度',
    progressDescription: '还没有开始任何工作流。进入对应入口后，进度和任务日志会显示在这里。',
    outputTitle: '阶段输出',
    outputDescription: '暂无输出。后续在捏脸、转画风和素材生成流程里的中间结果都会放到这里。',
    privacyNote: '本网站所有信息均在本地保存，不会上传你的角色社卡、个人信息或 API 私钥。',
    footerNote: 'Copyright © 2026 Mirako Company. Developed by Hanazar Ochikawa.',
    metricModules: '主入口',
    metricLanguages: '界面语言',
    metricStorage: '本地保存',
    featureFace: '捏脸',
    featureStyle: '转画风',
    featureSeries: '生成系列素材',
    featurePrompt: '角色设卡 / 世界观编辑',
    featureLlm: 'LLM 文本接入',
    featureTts: 'TTS 语音导出',
    featurePaper: 'paper2gal 图片素材',
    featureImageConverter: '图片格式转换',
    backHome: '返回首页',
    openSettings: '打开设置',
    comingSoon: '功能页面框架',
    preparedModules: '已准备模块',
    placeholderTodo: '下一步',
    placeholderCanvas: '主工作区画布与预览',
    placeholderSettings: '参数面板与模块设置',
    placeholderPipeline: '任务队列、接口调用与输出区',
    placeholderHint: '当前页面保留了完整结构，后续可直接进入对应功能。',
    startModalTitle: '选择工作台入口',
    startModalDescription: '先进入你现在要使用的七个主入口之一。',
    startModalSeriesTitle: '生成系列素材',
    startModalSeriesDescription: '这里分成两个子入口，分别进入对应的素材流程。',
    actionFace: '捏脸',
    actionStyle: '转画风',
    actionSeries: '生成系列素材',
    actionPromptSuite: '角色设卡 / 世界观编辑',
    actionLlmHub: 'LLM 文本接入',
    actionTtsExport: 'TTS 语音导出',
    actionPaper2Gal: 'paper2gal 图片素材生成',
    actionImageConverter: '图片格式转换',
    actionBack: '返回上一级',
    settingsTitle: '项目设置',
    tabStyle: '样式',
    tabLanguage: '语言',
    tabApi: '接口',
    tabAudio: '音频',
    tabAnimation: '动画',
    tabShortcuts: '快捷键',
    tabAnnouncement: '公告',
    tabAbout: '关于',
    stylePresetTitle: '样式预设',
    stylePresetDefault: '默认样式',
    stylePresetPaper2Gal: 'paper2gal 官方样式',
    themeModeTitle: '模式',
    themeLight: '浅色',
    themeDeep: '深色',
    customContrastLabel: '自定义对比度',
    customContrastHint: '调节整体界面的明暗对比强度。',
    accentTitle: '配色样式',
    customAccentLabel: '自定义配色',
    styleLockedTitle: 'paper2gal 样式已锁定',
    styleLockedDescription: '启用官方样式后，会固定背景、主色和深浅模式，不再允许调整其他配色。',
    fontTitle: '字体',
    fontSans: '默认无衬线',
    fontRounded: '圆角标题风格',
    fontSerif: '衬线风格',
    languageTitle: '界面语言',
    apiModeTitle: '接口模式',
    builtinMode: '使用内置模型',
    customApiMode: '自定义 API',
    apiPresetTitle: 'Plato 预设通道',
    apiPresetPlato: '使用 Plato 模型',
    apiPresetHint: '这个按钮会使用你预先接好的 Plato 后端通道，不会把私钥暴露到前端页面。',
    apiPresetUnavailable: '当前环境还没有配置 Plato 预设通道地址。请切换到自定义 API，或给预设接上已部署的后端地址。',
    apiBaseTitle: 'API 地址',
    apiBasePlaceholder: 'https://your-backend.example.com',
    apiKeyTitle: 'API Key',
    apiKeyPlaceholder: '填写你自己的 API Key',
    apiHelp: '所有接口配置只保存在当前浏览器本地。',
    apiHint: '这里要填写工作流后端根地址，前端会自动请求 /api/workflows。不要填写 /v1/chat/completions 这类模型接口。',
    apiModelEndpointWarning:
      '你当前填写的看起来是模型接口，不是工作流后端根地址。请改成像 https://your-backend.example.com 这样的后端根地址。',
    apiEffectiveTitle: '当前生效地址',
    apiEffectiveBuiltin: '当前优先使用 Plato 预设通道，本地开发时会优先回落到 localhost:3001。',
    apiEffectiveCustom: '当前优先使用你填写的工作流后端根地址。',
    apiPrivacy: '本网站所有信息均在本地保存，不会上传任何角色社卡、个人信息或私钥。',
    shortcutsTitle: '编辑器快捷键',
    shortcutsHint: '这里可以直接改 OC 设卡编辑器的快捷键组合，修改后会立刻写入本地设置。',
    shortcutsReset: '恢复默认快捷键',
    shortcutsExperimental: '自定义快捷键属于实验性设置，请避免与浏览器或系统保留快捷键冲突。',
    announcementTitle: '公告',
    announcementHistoryButton: '查看往期公告',
    announcementDescription: '0.4.2.1 全按钮音效覆盖、40 种 BGM 预设与性能设置功能化。',
    announcementList1: '全局音效全覆盖，背景音乐引擎 v5 升级至 40 种风格预设并采用前瞻式精准调度。',
    announcementList2: '性能设置各项选项真正生效：减少动画禁用 CSS 动画、禁用毛玻璃移除 backdrop-filter、开发者模式显示实时调试面板。',
    announcementList3: '30 种语言同步更新，40 个 BGM 预设名称已同步到 4 种基础语言翻译中。',
    aboutTitle: '关于',
    aboutDescription: '这个项目会作为你的 OC 角色创作入口，集中管理角色编辑、画风处理和系列素材生成。',
    paperSiteLabel: '前往 paper2gal',
    profileLinkLabel: '作者',
    repoLinkLabel: 'GitHub 仓库',
    pageFaceTitle: '捏脸编辑器',
    pageFaceDescription: '左侧管理部件资产，中间预览角色画布，右侧调整参数并处理保存与导出。',
    pageStyleTitle: '转画风',
    pageStyleDescription: '上传角色图像、调整 AI 参数、查看任务进度，并导出结果、错误包和调试 JSON。',
    pagePromptTitle: 'OC 设卡编辑',
    pagePromptDescription: '在富文本编辑器中整理世界观、角色设卡和封装输入。',
    pageLlmTitle: 'LLM 文本接入',
    pageLlmDescription: '配置大语言模型参数，生成角色对话、设定补全与世界观文本。',
    pageTtsTitle: 'TTS 语音导出',
    pageTtsDescription: '配置语音合成参数，上传参考音频，导出角色语音素材。',
    pagePaperTitle: 'paper2gal 图片素材生成',
    pagePaperDescription: '接入 p2g-character-workflow 的 paper2gal 流程，负责上传角色图、轮询工作流进度、查看结果资产与下载调试包。',
    pageImageConverterTitle: '图片格式转换',
    pageImageConverterDescription: '上传图片并转换为 PNG、JPG、WEBP 等不同格式，支持质量调整和尺寸缩放。',
    moduleCanvas: '主工作区画布',
    modulePanel: '右侧参数 / 功能面板',
    modulePipeline: '任务队列与输出结果区',
    moduleStorage: '本地配置与历史记录',
    animationTitle: '动画设置',
    animationEnabled: '启用动画',
    animationSpeed: '动画速度',
    animationUiFadeIn: '界面渐显',
    animationButtonHover: '按钮悬停',
    animationPageTransitions: '页面切换',
    animationModalTransitions: '弹窗过渡',
    animationHint: '调整动画速度并开关单独效果。速度越低动画越慢。',
    borderWidthTitle: '边框粗细',
    audioTitle: '音频设置',
    audioMasterVolume: '主音量',
    audioSfxVolume: '音效音量',
    audioMusicVolume: '音乐音量',
    audioSfxEnabled: '启用音效',
    audioMusicEnabled: '启用背景音乐',
    audioSoundOnInteractOn: '按钮音效开',
    audioSoundOnInteractOff: '按钮音效关',
    audioHint: '所有音频均为程序生成，不依赖外部文件。',
    audioSfxPreset: '音效风格',
    audioMusicPreset: '音乐风格',
    audioPitch: '音高',
    audioDuration: '时长',
    audioFilter: '滤波',
    audioDetune: '失谐',
    audioReverb: '混响',
    audioMusicPitch: '音乐音高',
    audioMusicTempo: '音乐速度',
    audioPreview: '试听',
    presetClassic: '经典',
    presetElectronic: '电子',
    presetRetro: '复古',
    presetXylophone: '木琴',
    presetBell: '铃铛',
    presetSpace: '太空',
    presetDrum: '鼓点',
    presetPiano: '钢琴',
    presetSynthwave: '合成器波',
    presetChiptune: '8-bit',
    presetStrings: '弦乐',
    presetWind: '管乐',
    presetJazz: '爵士',
    presetPercussion: '打击乐',
    presetAmbient: '环境',
    presetScifi: '科幻',
    presetCartoon: '卡通',
    presetHorror: '恐怖',
    presetNature: '自然',
    presetMechanical: '机械',
    musicOrchestral: '管弦乐',
    musicAmbient: '氛围',
    musicElectronic: '电子乐',
    musicPiano: '钢琴',
    musicSynthwave: '合成器波',
    musicNature: '自然',
    musicJazz: '爵士',
    musicMeditation: '冥想',
    musicCyber: '赛博',
    musicLofi: '低保真',
    musicRock: '摇滚',
    musicBlues: '蓝调',
    musicFolk: '民谣',
    musicReggae: '雷鬼',
    musicFunk: '放克',
    musicSoul: '灵魂乐',
    musicGospel: '福音',
    musicCountry: '乡村',
    musicCeltic: '凯尔特',
    musicOriental: '东方',
    musicTribal: '部落',
    musicSpace: '太空',
    musicUnderwater: '水下',
    musicRain: '雨声',
    musicWindchime: '风铃',
    musicFireplace: '壁炉',
    musicNight: '夜晚',
    musicSunrise: '日出',
    musicDreamy: '梦幻',
    musicEnergetic: '活力',
    musicBattle: '战斗',
    musicAdventure: '冒险',
    musicMystery: '神秘',
    musicRomantic: '浪漫',
    musicNostalgic: '怀旧',
    musicHopeful: '希望',
    musicEpic: '史诗',
    musicChill: '放松',
    musicStudy: '学习',
    musicFocus: '专注',
    audioSfxAttack: '起音',
    audioSfxDecay: '衰减',
    audioSfxSustain: '延持',
    audioSfxRelease: '释音',
    audioSfxPan: '声像',
    audioMusicReverb: '音乐混响',
    audioMusicFilter: '音乐滤波',
    audioMusicStereoWidth: '立体声宽度',
    audioAdvancedTitle: '高级合成',
    audioSpatialTitle: '空间与音乐',
    fontCustomLabel: '自定义字体',
    fontCustomHint: '输入系统中已安装的字体名称，例如 LXGW WenKai。',
    fontCustomPlaceholder: '输入页面字体名称，例如: LXGW WenKai',
    tabPerformance: '性能',
    tabOthers: '其他',
    audioResetSfx: '恢复音效默认',
    audioResetMusic: '恢复音乐默认',
    audioResetAdvanced: '恢复高级默认',
    audioCustomSfx: '自定义音效',
    audioCustomMusic: '自定义音乐',
    audioUploadFile: '上传音频文件',
    audioRemoveCustom: '移除自定义',
    audioCustomActive: '已启用自定义',
    animationReset: '恢复动画默认',
    animationEffectsTitle: '动画效果',
    performanceTitle: '性能与质量',
    performanceReduceAnimations: '减少动画效果',
    performanceDisableGlass: '禁用毛玻璃效果',
    performanceLowResPreview: '低分辨率预览',
    performanceLazyLoad: '延迟加载模块',
    performanceDisableParticles: '禁用粒子效果',
    performanceAggressiveCache: '激进缓存策略',
    performanceDevMode: '开发者调试模式',
    performanceImageQuality: '图像预览质量',
    performanceImageQualityLow: '低',
    performanceImageQualityMedium: '中',
    performanceImageQualityHigh: '高',
    performanceMaxConcurrent: '最大并发请求',
    performanceReset: '恢复性能默认',
    performanceHint: '关闭部分视觉效果可以提升低配置设备的流畅度。',
    apiChannel1: '自定义 API 通道 1',
    apiChannel2: '自定义 API 通道 2',
    apiChannel3: '自定义 API 通道 3',
    apiClearChannel: '清除此 API',
    apiConfirmClear: '确定要清除此 API 配置吗？',
    apiConfirmClearAgain: '请再次确认：此操作不可撤销，是否继续清除？',
    othersTitle: '其他设置',
    othersTooltips: '显示工具提示',
    othersConfirmDestructive: '破坏性操作二次确认',
    othersKeyboardHints: '显示键盘快捷键提示',
    othersSmoothScroll: '平滑滚动',
    othersNotificationSound: '通知声音',
    othersAutoSave: '自动保存间隔（分钟，0 为关闭）',
    othersDateFormat: '日期格式',
    othersDateFormatIso: 'ISO',
    othersDateFormatLocale: '本地',
    othersDateFormatFriendly: '友好',
    othersShowClock: '显示时钟',
    othersStatusBar: '启用状态栏',
    othersHighContrastFocus: '高对比度焦点框',
    othersResetAll: '全部重刷',
    othersRestoreDefaults: '恢复全部默认设置',
    othersConfirmReset: '确定要重刷所有设置吗？此操作会清空当前所有配置。',
    othersConfirmResetAgain: '请再次确认：全部重刷后所有自定义设置将丢失，是否继续？',
    othersConfirmRestore: '确定要恢复全部默认设置吗？',
    othersConfirmRestoreAgain: '请再次确认：恢复默认后所有自定义设置将被覆盖，是否继续？',
    othersHint: '这些设置影响全局行为。',
    othersLanguageSettings: '语言设置',
    othersLanguageMissing: '如果没有你的母语，你可以在「关于」页点击作者按钮前往 GitHub 提交 Issue 或联系作者。',
    styleSavePreset: '保存当前样式为预设',
    stylePreset1: '预设 1',
    stylePreset2: '预设 2',
    stylePresetName: '预设名称',
    stylePresetSaved: '预设已保存',
    stylePresetSame: '当前样式与已有预设相同，无需保存。',
    stylePresetUse: '使用此预设',
    styleResetDefaults: '恢复样式默认',
    confirmYes: '确认',
    confirmNo: '取消',
    confirmCancel: '取消',
    toggleOn: '开',
    toggleOff: '关',
  },
  ja: {
    appTitle: 'Original Character Maker',
    appSubtitle: 'OC キャラクター統合ハブ',
    versionLabel: 'バージョン',
    overviewTitle: 'キャラクター制作入口',
    overviewDescription:
      '顔編集、画風変換、Prompt / LLM / TTS ラッパー、paper2gal 素材生成と画像フォーマット変換を 1 つの入口ページにまとめています。',
    workflowTitle: '新しいワークフローを開始',
    workflowDescription: 'ここから顔編集、画風変換、Prompt / LLM / TTS、paper2gal の各ワークベンチへ直接入れます。',
    workflowHint: '開始ボタンを押すと 7 つの主入口モーダルが開き、上のカードから直接入ることもできます。',
    workflowFormats: 'PNG / JPG / WEBP に対応。単体キャラ立ち絵や鮮明な半身図を推奨します。',
    startButton: '開始',
    settingsButton: '設定',
    progressTitle: 'ワークフロー進捗',
    progressDescription: 'まだワークフローは開始されていません。開始後に進捗とログがここへ表示されます。',
    outputTitle: '段階出力',
    outputDescription: '現在は出力がありません。今後の中間結果や完成物はここに集約されます。',
    privacyNote: 'このサイトの情報はすべてローカル保存です。キャラ資料、個人情報、API キーはアップロードしません。',
    footerNote: 'Copyright © 2026 Mirako Company. Developed by Hanazar Ochikawa.',
    metricModules: 'メイン入口',
    metricLanguages: '言語対応',
    metricStorage: 'ローカル保存',
    featureFace: '捏脸',
    featureStyle: '画風変換',
    featureSeries: 'シリーズ素材生成',
    featurePrompt: 'キャラ設定 / 世界観編集',
    featureLlm: 'LLM テキスト接続',
    featureTts: 'TTS 音声出力',
    featurePaper: 'paper2gal 素材',
    featureImageConverter: '画像フォーマット変換',
    backHome: 'ホームへ戻る',
    openSettings: '設定を開く',
    comingSoon: '機能ページの骨組み',
    preparedModules: '準備済みモジュール',
    placeholderTodo: '次のステップ',
    placeholderCanvas: 'メインキャンバスとプレビュー',
    placeholderSettings: 'パラメータパネルと設定連動',
    placeholderPipeline: 'タスクキュー、API、出力領域',
    placeholderHint: '現在はページ構造を先に確保しています。',
    startModalTitle: 'ワークベンチ入口を選択',
    startModalDescription: '今使いたい 7 つの主入口から 1 つ選んでください。',
    startModalSeriesTitle: 'シリーズ素材生成',
    startModalSeriesDescription: 'ここではさらに 2 つの子入口へ分けています。',
    actionFace: '捏脸',
    actionStyle: '画風変換',
    actionSeries: 'シリーズ素材生成',
    actionPromptSuite: 'キャラ設定 / 世界観編集',
    actionLlmHub: 'LLM テキスト接続',
    actionTtsExport: 'TTS 音声出力',
    actionPaper2Gal: 'paper2gal 素材生成',
    actionImageConverter: '画像フォーマット変換',
    actionBack: '戻る',
    settingsTitle: 'プロジェクト設定',
    tabStyle: 'スタイル',
    tabLanguage: '言語',
    tabApi: 'API',
    tabAudio: 'オーディオ',
    tabAnimation: 'アニメーション',
    tabShortcuts: 'ショートカット',
    tabAnnouncement: 'お知らせ',
    tabAbout: '情報',
    stylePresetTitle: 'スタイルプリセット',
    stylePresetDefault: 'デフォルト',
    stylePresetPaper2Gal: 'paper2gal 公式',
    themeModeTitle: 'モード',
    themeLight: 'ライト',
    themeDeep: 'ダーク',
    customContrastLabel: 'カスタムコントラスト',
    customContrastHint: '画面全体のコントラスト強度を調整します。',
    accentTitle: '配色',
    customAccentLabel: 'カスタム配色',
    styleLockedTitle: 'paper2gal スタイル固定',
    styleLockedDescription: '公式スタイルを有効化すると背景、主色、明暗モードが固定されます。',
    fontTitle: 'フォント',
    fontSans: '標準サンセリフ',
    fontRounded: '丸みタイトル',
    fontSerif: 'セリフ体',
    languageTitle: '表示言語',
    apiModeTitle: 'API モード',
    builtinMode: '内蔵モデル',
    customApiMode: 'カスタム API',
    apiPresetTitle: 'Plato プリセット',
    apiPresetPlato: 'Plato モデルを使う',
    apiPresetHint: 'このボタンは事前接続済みの Plato バックエンドを使います。秘密鍵をフロントエンドへ露出しません。',
    apiPresetUnavailable: 'この環境では Plato プリセットの接続先 URL がまだ設定されていません。カスタム API に切り替えるか、プリセットへデプロイ済みバックエンド URL を接続してください。',
    apiBaseTitle: 'API URL',
    apiBasePlaceholder: 'https://your-backend.example.com',
    apiKeyTitle: 'API Key',
    apiKeyPlaceholder: '自分の API Key を入力',
    apiHelp: 'すべての設定は現在のブラウザにだけ保存されます。',
    apiHint: 'ここには workflow backend のルート URL を入力します。フロントエンドが自動で /api/workflows を呼び出すため、/v1/chat/completions のようなモデル API は入力しないでください。',
    apiModelEndpointWarning:
      '入力された URL はモデル API のように見えます。https://your-backend.example.com のような workflow backend ルート URL に変更してください。',
    apiEffectiveTitle: '現在の有効先',
    apiEffectiveBuiltin: '現在は Plato プリセット通道を優先し、ローカル開発では localhost:3001 を優先します。',
    apiEffectiveCustom: '現在は入力された workflow backend ルート URL を優先します。',
    apiPrivacy: 'このサイトの情報はすべてローカル保存です。',
    shortcutsTitle: 'エディタショートカット',
    shortcutsHint: 'ここでは OC 設定エディタ用ショートカットを直接編集でき、変更はすぐローカル設定へ保存されます。',
    shortcutsReset: '既定ショートカットに戻す',
    shortcutsExperimental: 'カスタムショートカットは実験的機能です。ブラウザや OS の予約ショートカットとの衝突に注意してください。',
    announcementTitle: 'お知らせ',
    announcementHistoryButton: '過去のお知らせを見る',
    announcementDescription: '0.4.2.1 全ボタンSEカバー、40種BGMプリセットとパフォーマンス設定の機能化。',
    announcementList1: 'グローバルSEフルカバー、BGMエンジンv5は40種のプリセットとルックアヘッド精密スケジューリングを採用。',
    announcementList2: 'パフォーマンス設定が実際に機能：アニメーション削減でCSSアニメーション無効化、ガラス効果無効化でbackdrop-filter削除、開発者モードでリアルタイムデバッグパネル表示。',
    announcementList3: '約30言語に同期更新。40個のBGMプリセット名が4つの基礎言語翻訳に同期。',
    aboutTitle: '情報',
    aboutDescription: 'このプロジェクトは OC 制作の統合入口として機能します。',
    paperSiteLabel: 'paper2gal へ移動',
    profileLinkLabel: '作者',
    repoLinkLabel: 'GitHub リポジトリ',
    pageFaceTitle: '顔編集',
    pageFaceDescription: '左側でパーツ資産を管理し、中央でキャラを確認し、右側で調整と保存 / 書き出しを行います。',
    pageStyleTitle: '画風変換',
    pageStyleDescription: '画像入力、AI パラメータ、進捗ログ、結果、エラー JSON をまとめて扱う画風変換ワークベンチです。',
    pagePromptTitle: 'OC 設定エディタ',
    pagePromptDescription: 'リッチテキストで世界観やキャラクター設定を整理します。',
    pageLlmTitle: 'LLM テキスト接続',
    pageLlmDescription: '大規模言語モデルのパラメータを設定し、キャラ会話や設定補完、世界観テキストを生成します。',
    pageTtsTitle: 'TTS 音声出力',
    pageTtsDescription: '音声合成パラメータを設定し、参照音声をアップロードしてキャラ音声素材を出力します。',
    pagePaperTitle: 'paper2gal 素材生成',
    pagePaperDescription: 'p2g-character-workflow の paper2gal パイプラインに接続し、キャラクター画像のアップロード、進捗同期、成果物確認、デバッグパックの取得を行います。',
    pageImageConverterTitle: '画像フォーマット変換',
    pageImageConverterDescription: '画像をアップロードして PNG、JPG、WEBP などの形式に変換します。品質調整とサイズ変更に対応。',
    moduleCanvas: 'メイン作業領域',
    modulePanel: '右側パネル',
    modulePipeline: 'タスクと出力',
    moduleStorage: 'ローカル保存と履歴',
    animationTitle: 'アニメーション設定',
    animationEnabled: 'アニメーションを有効化',
    animationSpeed: 'アニメーション速度',
    animationUiFadeIn: 'UIフェードイン',
    animationButtonHover: 'ボタンホバー',
    animationPageTransitions: 'ページ遷移',
    animationModalTransitions: 'モーダル遷移',
    animationHint: 'アニメーション速度を調整し、個別効果をオン/オフします。速度が低いほどアニメーションは遅くなります。',
    borderWidthTitle: '枠線の太さ',
    audioTitle: 'オーディオ設定',
    audioMasterVolume: 'マスターボリューム',
    audioSfxVolume: '効果音ボリューム',
    audioMusicVolume: 'BGMボリューム',
    audioSfxEnabled: '効果音を有効化',
    audioMusicEnabled: 'BGM を有効化',
    audioSoundOnInteractOn: 'ボタン音ON',
    audioSoundOnInteractOff: 'ボタン音OFF',
    audioHint: 'すべてのオーディオはプロシージャル生成で、外部ファイルに依存しません。',
    audioSfxPreset: '効果音プリセット',
    audioMusicPreset: 'BGMプリセット',
    audioPitch: 'ピッチ',
    audioDuration: '長さ',
    audioFilter: 'フィルター',
    audioDetune: 'デチューン',
    audioReverb: 'リバーブ',
    audioMusicPitch: 'BGMピッチ',
    audioMusicTempo: 'BGMテンポ',
    audioPreview: 'プレビュー',
    presetClassic: 'クラシック',
    presetElectronic: 'エレクトロ',
    presetRetro: 'レトロ',
    presetXylophone: '木琴',
    presetBell: 'ベル',
    presetSpace: '宇宙',
    presetDrum: 'ドラム',
    presetPiano: 'ピアノ',
    presetSynthwave: 'シンセウェーブ',
    presetChiptune: 'チップチューン',
    presetStrings: '弦楽器',
    presetWind: '管楽器',
    presetJazz: 'ジャズ',
    presetPercussion: 'パーカッション',
    presetAmbient: 'アンビエント',
    presetScifi: 'SF',
    presetCartoon: 'カートゥーン',
    presetHorror: 'ホラー',
    presetNature: '自然',
    presetMechanical: '機械',
    musicOrchestral: 'オーケストラ',
    musicAmbient: 'アンビエント',
    musicElectronic: 'エレクトロ',
    musicPiano: 'ピアノ',
    musicSynthwave: 'シンセウェーブ',
    musicNature: '自然',
    musicJazz: 'ジャズ',
    musicMeditation: '瞑想',
    musicCyber: 'サイバー',
    musicLofi: 'ローファイ',
    musicRock: 'ロック',
    musicBlues: 'ブルース',
    musicFolk: 'フォーク',
    musicReggae: 'レゲエ',
    musicFunk: 'ファンク',
    musicSoul: 'ソウル',
    musicGospel: 'ゴスペル',
    musicCountry: 'カントリー',
    musicCeltic: 'ケルト',
    musicOriental: 'オリエンタル',
    musicTribal: 'トライバル',
    musicSpace: '宇宙',
    musicUnderwater: '水中',
    musicRain: '雨',
    musicWindchime: '風鈴',
    musicFireplace: '暖炉',
    musicNight: '夜',
    musicSunrise: '日の出',
    musicDreamy: '夢幻',
    musicEnergetic: 'エネルギー',
    musicBattle: '戦闘',
    musicAdventure: '冒険',
    musicMystery: 'ミステリー',
    musicRomantic: 'ロマンチック',
    musicNostalgic: 'ノスタルジア',
    musicHopeful: '希望',
    musicEpic: 'エピック',
    musicChill: 'チル',
    musicStudy: '勉強',
    musicFocus: '集中',
    audioSfxAttack: 'アタック',
    audioSfxDecay: 'ディケイ',
    audioSfxSustain: 'サステイン',
    audioSfxRelease: 'リリース',
    audioSfxPan: 'パン',
    audioMusicReverb: '音楽リバーブ',
    audioMusicFilter: '音楽フィルター',
    audioMusicStereoWidth: 'ステレオ幅',
    audioAdvancedTitle: '詳細合成',
    audioSpatialTitle: '空間と音楽',
    fontCustomLabel: 'カスタムフォント',
    fontCustomHint: 'システムにインストール済みのフォント名を入力してください。',
    fontCustomPlaceholder: 'フォント名を入力（例: LXGW WenKai）',
    tabPerformance: 'パフォーマンス',
    tabOthers: 'その他',
    audioResetSfx: 'SEをデフォルトに戻す',
    audioResetMusic: 'BGMをデフォルトに戻す',
    audioResetAdvanced: '詳細設定をデフォルトに戻す',
    audioCustomSfx: 'カスタムSE',
    audioCustomMusic: 'カスタムBGM',
    audioUploadFile: '音声ファイルをアップロード',
    audioRemoveCustom: 'カスタムを削除',
    audioCustomActive: 'カスタム有効',
    animationReset: 'アニメーションをデフォルトに戻す',
    animationEffectsTitle: 'アニメーション効果',
    performanceTitle: 'パフォーマンスと品質',
    performanceReduceAnimations: 'アニメーションを減らす',
    performanceDisableGlass: 'ガラス効果を無効化',
    performanceLowResPreview: '低解像度プレビュー',
    performanceLazyLoad: 'モジュールの遅延読み込み',
    performanceDisableParticles: 'パーティクルを無効化',
    performanceAggressiveCache: '積極的なキャッシュ',
    performanceDevMode: '開発者デバッグモード',
    performanceImageQuality: '画像プレビュー品質',
    performanceImageQualityLow: '低',
    performanceImageQualityMedium: '中',
    performanceImageQualityHigh: '高',
    performanceMaxConcurrent: '最大同時リクエスト数',
    performanceReset: 'パフォーマンス設定をデフォルトに戻す',
    performanceHint: '一部の視覚効果を無効にすると、低スペック端末での動作が軽快になります。',
    apiChannel1: 'カスタムAPIチャンネル1',
    apiChannel2: 'カスタムAPIチャンネル2',
    apiChannel3: 'カスタムAPIチャンネル3',
    apiClearChannel: 'このAPIをクリア',
    apiConfirmClear: 'このAPI設定をクリアしますか？',
    apiConfirmClearAgain: '再度確認：この操作は取り消せません。クリアを続行しますか？',
    othersTitle: 'その他の設定',
    othersTooltips: 'ツールチップを表示',
    othersConfirmDestructive: '破壊的操作の二重確認',
    othersKeyboardHints: 'キーボードショートカットヒントを表示',
    othersSmoothScroll: 'スムーズスクロール',
    othersNotificationSound: '通知音',
    othersAutoSave: '自動保存間隔（分、0で無効）',
    othersDateFormat: '日付形式',
    othersDateFormatIso: 'ISO',
    othersDateFormatLocale: 'ローカル',
    othersDateFormatFriendly: 'フレンドリー',
    othersShowClock: '時計を表示',
    othersStatusBar: 'ステータスバーを有効化',
    othersHighContrastFocus: '高コントラストフォーカス',
    othersResetAll: 'すべてリセット',
    othersRestoreDefaults: 'すべてデフォルトに戻す',
    othersConfirmReset: 'すべての設定をリセットしますか？現在のすべての設定が消去されます。',
    othersConfirmResetAgain: '再度確認：すべてリセットするとカスタム設定が失われます。続行しますか？',
    othersConfirmRestore: 'すべての設定をデフォルトに戻しますか？',
    othersConfirmRestoreAgain: '再度確認：デフォルトに戻すとカスタム設定が上書きされます。続行しますか？',
    othersHint: 'これらの設定はグローバル動作に影響します。',
    othersLanguageSettings: '言語設定',
    othersLanguageMissing: '母語が見つからない場合は、「情報」ページで作者ボタンをクリックしてGitHubでIssueを提出するか、作者に連絡してください。',
    styleSavePreset: '現在のスタイルをプリセットとして保存',
    stylePreset1: 'プリセット1',
    stylePreset2: 'プリセット2',
    stylePresetName: 'プリセット名',
    stylePresetSaved: 'プリセットを保存しました',
    stylePresetSame: '現在のスタイルは既存のプリセットと同じです。',
    stylePresetUse: 'このプリセットを使用',
    styleResetDefaults: 'スタイルをデフォルトに戻す',
    confirmYes: '確認',
    confirmNo: 'キャンセル',
    confirmCancel: 'キャンセル',
    toggleOn: 'ON',
    toggleOff: 'OFF',
  },
  en: {
    appTitle: 'Original Character Maker',
    appSubtitle: 'Custom OC control center',
    versionLabel: 'Version',
    overviewTitle: 'Character creation entry',
    overviewDescription:
      'Face making, style transfer, prompt tooling, LLM / TTS packaging, paper2gal asset generation, and image format conversion are grouped into one entry page for a cleaner workflow.',
    workflowTitle: 'Start a new workflow',
    workflowDescription: 'Jump straight into Face Maker, Style Transfer, Prompt + LLM / TTS, or the paper2gal workbench from here.',
    workflowHint: 'Press Start to open the seven-entry launcher, or click any icon card above to jump in directly.',
    workflowFormats: 'Supports PNG / JPG / WEBP. Single-character art or a clean half-body image is recommended.',
    startButton: 'Start',
    settingsButton: 'Settings',
    progressTitle: 'Workflow progress',
    progressDescription: 'No workflow has started yet. Progress logs will appear here after you enter a tool.',
    outputTitle: 'Stage outputs',
    outputDescription: 'No output yet. Future intermediate and final assets will be shown here.',
    privacyNote: 'Everything on this site stays local. No OC sheets, personal data, or API secrets are uploaded.',
    footerNote: 'Copyright © 2026 Mirako Company. Developed by Hanazar Ochikawa.',
    metricModules: 'Main entries',
    metricLanguages: 'Interface languages',
    metricStorage: 'Local storage',
    featureFace: 'Face Maker',
    featureStyle: 'Style Transfer',
    featureSeries: 'Series Assets',
    featurePrompt: 'Character Card / World-building',
    featureLlm: 'LLM Text Hub',
    featureTts: 'TTS Voice Export',
    featurePaper: 'paper2gal Assets',
    featureImageConverter: 'Image Converter',
    backHome: 'Back home',
    openSettings: 'Open settings',
    comingSoon: 'Feature shell',
    preparedModules: 'Prepared modules',
    placeholderTodo: 'Next steps',
    placeholderCanvas: 'Main workspace canvas and preview',
    placeholderSettings: 'Parameter panel and module settings',
    placeholderPipeline: 'Task queue, API calls, and outputs',
    placeholderHint: 'This page currently reserves the layout structure for the real tool.',
    startModalTitle: 'Choose a workbench',
    startModalDescription: 'Select one of the seven main workbenches to enter first.',
    startModalSeriesTitle: 'Generate series assets',
    startModalSeriesDescription: 'This branch is split into two child entries for later integration.',
    actionFace: 'Face Maker',
    actionStyle: 'Style Transfer',
    actionSeries: 'Generate Series Assets',
    actionPromptSuite: 'Character Card / World-building',
    actionLlmHub: 'LLM Text Hub',
    actionTtsExport: 'TTS Voice Export',
    actionPaper2Gal: 'paper2gal Asset Generation',
    actionImageConverter: 'Image Format Converter',
    actionBack: 'Back',
    settingsTitle: 'Project Settings',
    tabStyle: 'Style',
    tabLanguage: 'Language',
    tabApi: 'API',
    tabAudio: 'Audio',
    tabAnimation: 'Animation',
    tabShortcuts: 'Shortcuts',
    tabAnnouncement: 'Announcement',
    tabAbout: 'About',
    stylePresetTitle: 'Style preset',
    stylePresetDefault: 'Default',
    stylePresetPaper2Gal: 'paper2gal official',
    themeModeTitle: 'Mode',
    themeLight: 'Light',
    themeDeep: 'Deep',
    customContrastLabel: 'Custom contrast',
    customContrastHint: 'Adjust the overall contrast intensity of the interface.',
    accentTitle: 'Accent palette',
    customAccentLabel: 'Custom accent',
    styleLockedTitle: 'paper2gal style locked',
    styleLockedDescription: 'The official paper2gal preset locks the background, primary color, and depth mode.',
    fontTitle: 'Font',
    fontSans: 'Sans',
    fontRounded: 'Rounded',
    fontSerif: 'Serif',
    languageTitle: 'Interface language',
    apiModeTitle: 'Interface mode',
    builtinMode: 'Built-in model',
    customApiMode: 'Custom API',
    apiPresetTitle: 'Plato preset channel',
    apiPresetPlato: 'Use Plato model',
    apiPresetHint: 'This option uses your pre-wired Plato backend channel and keeps secret keys out of the frontend page.',
    apiPresetUnavailable: 'The Plato preset endpoint is not configured in this environment yet. Switch to Custom API or wire the preset to a deployed backend.',
    apiBaseTitle: 'API endpoint',
    apiBasePlaceholder: 'https://your-backend.example.com',
    apiKeyTitle: 'API key',
    apiKeyPlaceholder: 'Enter your API key',
    apiHelp: 'All interface settings stay in the current browser only.',
    apiHint: 'Enter the workflow backend root here. The frontend automatically calls /api/workflows, so do not paste model endpoints like /v1/chat/completions.',
    apiModelEndpointWarning:
      'The current URL looks like a model endpoint instead of a workflow backend root. Replace it with a backend root such as https://your-backend.example.com.',
    apiEffectiveTitle: 'Current endpoint',
    apiEffectiveBuiltin: 'The app currently prioritizes the Plato preset channel and falls back to localhost:3001 during local development.',
    apiEffectiveCustom: 'The app currently prioritizes your workflow backend root.',
    apiPrivacy: 'Everything stays local in this browser.',
    shortcutsTitle: 'Editor shortcuts',
    shortcutsHint: 'Customize the OC card editor shortcuts here. Changes are saved to local settings immediately.',
    shortcutsReset: 'Reset to default shortcuts',
    shortcutsExperimental: 'Custom shortcuts are experimental. Avoid combinations that conflict with browser or system-reserved commands.',
    announcementTitle: 'Announcement',
    announcementHistoryButton: 'View past announcements',
    announcementDescription: 'Version 0.4.2.1: full button sound coverage, 40 BGM presets and performance settings functionalized.',
    announcementList1: 'Global sound effects fully cover all interactions; BGM engine v5 upgrades to 40 presets with lookahead precision scheduling.',
    announcementList2: 'Performance settings now actually work: reduce animations disables CSS animations, disable glassmorphism removes backdrop-filter, dev mode shows real-time debug panel.',
    announcementList3: 'Synced to ~30 languages. 40 BGM preset names synchronized across 4 base language translations.',
    aboutTitle: 'About',
    aboutDescription: 'This project is the unified entry point for your OC creation workflow.',
    paperSiteLabel: 'Open paper2gal',
    profileLinkLabel: 'Author',
    repoLinkLabel: 'GitHub repository',
    pageFaceTitle: 'Face Maker',
    pageFaceDescription: 'Manage modular assets on the left, preview the character in the middle, and adjust controls plus export actions on the right.',
    pageStyleTitle: 'Style Transfer',
    pageStyleDescription: 'Upload an image, tune AI parameters, monitor the run, and export result, error, and debug payloads from one workbench.',
    pagePromptTitle: 'Character Card / World-building',
    pagePromptDescription: 'Edit character profile, world-building and prompt templates in a rich-text workspace, then export the card text.',
    pageLlmTitle: 'LLM Text Hub',
    pageLlmDescription: 'Configure large language model parameters, generate character dialogue, profile completion and world-building text.',
    pageTtsTitle: 'TTS Voice Export',
    pageTtsDescription: 'Configure voice synthesis parameters, upload reference audio, and export character voice assets.',
    pagePaperTitle: 'paper2gal Asset Generation',
    pagePaperDescription: 'Connects to the p2g-character-workflow paper2gal pipeline for character upload, workflow polling, output review, and debug-package download.',
    pageImageConverterTitle: 'Image Format Converter',
    pageImageConverterDescription: 'Upload an image and convert it to PNG, JPG, WEBP and other formats. Supports quality adjustment and resizing.',
    moduleCanvas: 'Main workspace',
    modulePanel: 'Control panel',
    modulePipeline: 'Task queue and outputs',
    moduleStorage: 'Local settings and history',
    animationTitle: 'Animation Settings',
    animationEnabled: 'Enable Animations',
    animationSpeed: 'Animation Speed',
    animationUiFadeIn: 'UI Fade-in',
    animationButtonHover: 'Button Hover',
    animationPageTransitions: 'Page Transitions',
    animationModalTransitions: 'Modal Transitions',
    animationHint: 'Adjust animation speed and toggle individual effects. Lower speed = slower animations.',
    borderWidthTitle: 'Border Thickness',
    audioTitle: 'Audio Settings',
    audioMasterVolume: 'Master Volume',
    audioSfxVolume: 'SFX Volume',
    audioMusicVolume: 'Music Volume',
    audioSfxEnabled: 'Enable Sound Effects',
    audioMusicEnabled: 'Enable Background Music',
    audioSoundOnInteractOn: 'Button Sounds On',
    audioSoundOnInteractOff: 'Button Sounds Off',
    audioHint: 'All audio is procedurally generated with no external files.',
    audioSfxPreset: 'SFX Preset',
    audioMusicPreset: 'Music Preset',
    audioPitch: 'Pitch',
    audioDuration: 'Duration',
    audioFilter: 'Filter',
    audioDetune: 'Detune',
    audioReverb: 'Reverb',
    audioMusicPitch: 'Music Pitch',
    audioMusicTempo: 'Music Tempo',
    audioPreview: 'Preview',
    presetClassic: 'Classic',
    presetElectronic: 'Electronic',
    presetRetro: 'Retro',
    presetXylophone: 'Xylophone',
    presetBell: 'Bell',
    presetSpace: 'Space',
    presetDrum: 'Drum',
    presetPiano: 'Piano',
    presetSynthwave: 'Synthwave',
    presetChiptune: 'Chiptune',
    presetStrings: 'Strings',
    presetWind: 'Wind',
    presetJazz: 'Jazz',
    presetPercussion: 'Percussion',
    presetAmbient: 'Ambient',
    presetScifi: 'Sci-Fi',
    presetCartoon: 'Cartoon',
    presetHorror: 'Horror',
    presetNature: 'Nature',
    presetMechanical: 'Mechanical',
    musicOrchestral: 'Orchestral',
    musicAmbient: 'Ambient',
    musicElectronic: 'Electronic',
    musicPiano: 'Piano',
    musicSynthwave: 'Synthwave',
    musicNature: 'Nature',
    musicJazz: 'Jazz',
    musicMeditation: 'Meditation',
    musicCyber: 'Cyber',
    musicLofi: 'Lo-Fi',
    musicRock: 'Rock',
    musicBlues: 'Blues',
    musicFolk: 'Folk',
    musicReggae: 'Reggae',
    musicFunk: 'Funk',
    musicSoul: 'Soul',
    musicGospel: 'Gospel',
    musicCountry: 'Country',
    musicCeltic: 'Celtic',
    musicOriental: 'Oriental',
    musicTribal: 'Tribal',
    musicSpace: 'Space',
    musicUnderwater: 'Underwater',
    musicRain: 'Rain',
    musicWindchime: 'Wind Chime',
    musicFireplace: 'Fireplace',
    musicNight: 'Night',
    musicSunrise: 'Sunrise',
    musicDreamy: 'Dreamy',
    musicEnergetic: 'Energetic',
    musicBattle: 'Battle',
    musicAdventure: 'Adventure',
    musicMystery: 'Mystery',
    musicRomantic: 'Romantic',
    musicNostalgic: 'Nostalgic',
    musicHopeful: 'Hopeful',
    musicEpic: 'Epic',
    musicChill: 'Chill',
    musicStudy: 'Study',
    musicFocus: 'Focus',
    audioSfxAttack: 'Attack',
    audioSfxDecay: 'Decay',
    audioSfxSustain: 'Sustain',
    audioSfxRelease: 'Release',
    audioSfxPan: 'Pan',
    audioMusicReverb: 'Music Reverb',
    audioMusicFilter: 'Music Filter',
    audioMusicStereoWidth: 'Stereo Width',
    audioAdvancedTitle: 'Advanced Synthesis',
    audioSpatialTitle: 'Spatial & Music',
    fontCustomLabel: 'Custom Font',
    fontCustomHint: 'Enter a font name installed on your system, e.g. LXGW WenKai.',
    fontCustomPlaceholder: 'Enter font name, e.g. LXGW WenKai',
    tabPerformance: 'Performance',
    tabOthers: 'Others',
    audioResetSfx: 'Reset SFX to Default',
    audioResetMusic: 'Reset Music to Default',
    audioResetAdvanced: 'Reset Advanced to Default',
    audioCustomSfx: 'Custom SFX',
    audioCustomMusic: 'Custom Music',
    audioUploadFile: 'Upload Audio File',
    audioRemoveCustom: 'Remove Custom',
    audioCustomActive: 'Custom Active',
    animationReset: 'Reset Animation to Default',
    animationEffectsTitle: 'Animation Effects',
    performanceTitle: 'Performance & Quality',
    performanceReduceAnimations: 'Reduce Animations',
    performanceDisableGlass: 'Disable Glassmorphism',
    performanceLowResPreview: 'Low-Resolution Previews',
    performanceLazyLoad: 'Lazy Load Modules',
    performanceDisableParticles: 'Disable Particles',
    performanceAggressiveCache: 'Aggressive Caching',
    performanceDevMode: 'Developer Debug Mode',
    performanceImageQuality: 'Image Preview Quality',
    performanceImageQualityLow: 'Low',
    performanceImageQualityMedium: 'Medium',
    performanceImageQualityHigh: 'High',
    performanceMaxConcurrent: 'Max Concurrent Requests',
    performanceReset: 'Reset Performance Defaults',
    performanceHint: 'Disabling some visual effects can improve performance on lower-end devices.',
    apiChannel1: 'Custom API Channel 1',
    apiChannel2: 'Custom API Channel 2',
    apiChannel3: 'Custom API Channel 3',
    apiClearChannel: 'Clear This API',
    apiConfirmClear: 'Are you sure you want to clear this API configuration?',
    apiConfirmClearAgain: 'Please confirm again: this action cannot be undone. Continue to clear?',
    othersTitle: 'Other Settings',
    othersTooltips: 'Show Tooltips',
    othersConfirmDestructive: 'Double-Confirm Destructive Actions',
    othersKeyboardHints: 'Show Keyboard Shortcut Hints',
    othersSmoothScroll: 'Smooth Scrolling',
    othersNotificationSound: 'Notification Sounds',
    othersAutoSave: 'Auto-Save Interval (minutes, 0 = off)',
    othersDateFormat: 'Date Format',
    othersDateFormatIso: 'ISO',
    othersDateFormatLocale: 'Locale',
    othersDateFormatFriendly: 'Friendly',
    othersShowClock: 'Show Clock',
    othersStatusBar: 'Enable Status Bar',
    othersHighContrastFocus: 'High-Contrast Focus Ring',
    othersResetAll: 'Reset All',
    othersRestoreDefaults: 'Restore All Defaults',
    othersConfirmReset: 'Are you sure you want to reset all settings? This will clear all current configurations.',
    othersConfirmResetAgain: 'Please confirm again: all custom settings will be lost after reset. Continue?',
    othersConfirmRestore: 'Are you sure you want to restore all settings to default?',
    othersConfirmRestoreAgain: 'Please confirm again: all custom settings will be overwritten. Continue?',
    othersHint: 'These settings affect global behavior.',
    othersLanguageSettings: 'Language Settings',
    othersLanguageMissing: 'If your native language is missing, you can click the author button on the About page to go to GitHub and submit an issue or contact the author.',
    styleSavePreset: 'Save Current Style as Preset',
    stylePreset1: 'Preset 1',
    stylePreset2: 'Preset 2',
    stylePresetName: 'Preset Name',
    stylePresetSaved: 'Preset Saved',
    stylePresetSame: 'Current style is identical to an existing preset.',
    stylePresetUse: 'Use This Preset',
    styleResetDefaults: 'Reset Style Defaults',
    confirmYes: 'Yes',
    confirmNo: 'No',
    confirmCancel: 'Cancel',
    toggleOn: 'ON',
    toggleOff: 'OFF',
  },
  ru: {
    appTitle: 'Original Character Maker',
    appSubtitle: 'Центр управления OC',
    versionLabel: 'Версия',
    overviewTitle: 'Точка входа в создание персонажа',
    overviewDescription:
      'Редактор лица, перенос стиля, prompt-инструменты, paper2gal и конвертер изображений собраны на одной входной странице.',
    workflowTitle: 'Запустить новый workflow',
    workflowDescription: 'Отсюда можно сразу перейти в редактор лица, перенос стиля, Prompt + LLM / TTS или paper2gal.',
    workflowHint: 'Кнопка старта открывает модальное окно с семью основными входами, но можно зайти и напрямую по карточке.',
    workflowFormats: 'Поддерживаются PNG / JPG / WEBP. Рекомендуется одиночный персонаж или чистый полуторс.',
    startButton: 'Старт',
    settingsButton: 'Настройки',
    progressTitle: 'Прогресс workflow',
    progressDescription: 'Workflow ещё не запускался. После входа логи и прогресс появятся здесь.',
    outputTitle: 'Промежуточные результаты',
    outputDescription: 'Пока результатов нет. Будущие материалы будут отображаться здесь.',
    privacyNote: 'Вся информация хранится локально. Данные персонажа, личная информация и API-ключи не загружаются.',
    footerNote: 'Copyright © 2026 Mirako Company. Developed by Hanazar Ochikawa.',
    metricModules: 'Основные входы',
    metricLanguages: 'Языков интерфейса',
    metricStorage: 'Локальное хранение',
    featureFace: 'Редактор лица',
    featureStyle: 'Перенос стиля',
    featureSeries: 'Серийные материалы',
    featurePrompt: 'Карточка персонажа / Миростроительство',
    featureLlm: 'LLM текстовый хаб',
    featureTts: 'TTS экспорт голоса',
    featurePaper: 'paper2gal материалы',
    featureImageConverter: 'Конвертер изображений',
    backHome: 'На главную',
    openSettings: 'Открыть настройки',
    comingSoon: 'Каркас страницы',
    preparedModules: 'Подготовленные модули',
    placeholderTodo: 'Следующее',
    placeholderCanvas: 'Основное полотно и превью',
    placeholderSettings: 'Панель параметров и настройки',
    placeholderPipeline: 'Очередь задач, API и вывод',
    placeholderHint: 'Сейчас страница сохраняет структуру для будущего инструмента.',
    startModalTitle: 'Выберите рабочий стол',
    startModalDescription: 'Сначала выберите один из семи основных рабочих столов.',
    startModalSeriesTitle: 'Генерация серии',
    startModalSeriesDescription: 'Эта ветка разделена на два под-входа.',
    actionFace: 'Редактор лица',
    actionStyle: 'Перенос стиля',
    actionSeries: 'Генерация серии',
    actionPromptSuite: 'Карточка персонажа / Миростроительство',
    actionLlmHub: 'LLM текстовый хаб',
    actionTtsExport: 'TTS экспорт голоса',
    actionPaper2Gal: 'paper2gal генерация',
    actionImageConverter: 'Конвертер форматов',
    actionBack: 'Назад',
    settingsTitle: 'Настройки проекта',
    tabStyle: 'Стиль',
    tabLanguage: 'Язык',
    tabApi: 'API',
    tabAudio: 'Аудио',
    tabAnimation: 'Анимация',
    tabShortcuts: 'Шорткаты',
    tabAnnouncement: 'Объявление',
    tabAbout: 'О проекте',
    stylePresetTitle: 'Пресет стиля',
    stylePresetDefault: 'По умолчанию',
    stylePresetPaper2Gal: 'paper2gal',
    themeModeTitle: 'Режим',
    themeLight: 'Светлый',
    themeDeep: 'Тёмный',
    customContrastLabel: 'Пользовательский контраст',
    customContrastHint: 'Регулирует общую контрастность интерфейса.',
    accentTitle: 'Палитра',
    customAccentLabel: 'Своя палитра',
    styleLockedTitle: 'Стиль paper2gal зафиксирован',
    styleLockedDescription: 'Официальный paper2gal фиксирует фон, основной цвет и режим глубины.',
    fontTitle: 'Шрифт',
    fontSans: 'Sans',
    fontRounded: 'Rounded',
    fontSerif: 'Serif',
    languageTitle: 'Язык интерфейса',
    apiModeTitle: 'Режим API',
    builtinMode: 'Встроенная модель',
    customApiMode: 'Свой API',
    apiPresetTitle: 'Предустановленный Plato',
    apiPresetPlato: 'Использовать модель Plato',
    apiPresetHint: 'Эта кнопка использует заранее подключенный Plato backend и не раскрывает секретный ключ во фронтенде.',
    apiPresetUnavailable: 'В этой среде еще не настроен URL предустановленного канала Plato. Переключитесь на свой API или подключите к пресету адрес развернутого backend.',
    apiBaseTitle: 'Адрес API',
    apiBasePlaceholder: 'https://your-backend.example.com',
    apiKeyTitle: 'API-ключ',
    apiKeyPlaceholder: 'Введите API-ключ',
    apiHelp: 'Все настройки сохраняются только в текущем браузере.',
    apiHint: 'Здесь нужен корневой адрес workflow backend. Фронтенд сам вызывает /api/workflows, поэтому не вставляйте сюда модельные endpoint вроде /v1/chat/completions.',
    apiModelEndpointWarning:
      'Текущий URL похож на endpoint модели, а не на корневой адрес workflow backend. Укажите корневой backend URL вроде https://your-backend.example.com.',
    apiEffectiveTitle: 'Текущий адрес',
    apiEffectiveBuiltin: 'Сейчас приложение предпочитает предустановленный канал Plato и локально использует fallback на localhost:3001.',
    apiEffectiveCustom: 'Сейчас приоритет у корневого адреса workflow backend, который вы указали.',
    apiPrivacy: 'Всё остаётся локально в браузере.',
    shortcutsTitle: 'Горячие клавиши редактора',
    shortcutsHint: 'Здесь можно настроить сочетания клавиш для редактора карточек OC. Изменения сразу сохраняются локально.',
    shortcutsReset: 'Сбросить шорткаты',
    shortcutsExperimental: 'Пользовательские шорткаты являются экспериментальной функцией. Избегайте конфликтов с системными и браузерными сочетаниями.',
    announcementTitle: 'Объявление',
    announcementHistoryButton: 'Смотреть прошлые объявления',
    announcementDescription: 'Версия 0.4.2.1: полное покрытие звуками всех кнопок, 40 пресетов BGM и функционализация настроек производительности.',
    announcementList1: 'Глобальные звуковые эффекты полностью покрывают все взаимодействия; движок BGM v5 обновлён до 40 пресетов с точным планированием lookahead.',
    announcementList2: 'Настройки производительности теперь реально работают: уменьшение анимации отключает CSS-анимации, отключение стеклянного эффекта удаляет backdrop-filter, режим разработчика показывает панель отладки в реальном времени.',
    announcementList3: 'Синхронизировано с ~30 языками. 40 названий пресетов BGM синхронизированы для 4 базовых языков перевода.',
    aboutTitle: 'О проекте',
    aboutDescription: 'Этот проект служит единым входом в ваш рабочий процесс создания OC.',
    paperSiteLabel: 'Открыть paper2gal',
    profileLinkLabel: 'Автор',
    repoLinkLabel: 'GitHub репозиторий',
    pageFaceTitle: 'Редактор лица',
    pageFaceDescription: 'Слева управляются ассеты, по центру — холст персонажа, справа — параметры, сохранение и экспорт.',
    pageStyleTitle: 'Перенос стиля',
    pageStyleDescription: 'Загружайте изображение, настраивайте AI-параметры, следите за прогрессом и выгружайте результат, ошибки и debug JSON.',
    pagePromptTitle: 'Карточка персонажа / Миростроительство',
    pagePromptDescription: 'Редактируйте профиль персонажа, миростроительство и шаблоны Prompt в rich-text редакторе, затем экспортируйте текст карточки.',
    pageLlmTitle: 'LLM текстовый хаб',
    pageLlmDescription: 'Настройте параметры большой языковой модели, генерируйте диалоги персонажей, дополнение профиля и текст миростроительства.',
    pageTtsTitle: 'TTS экспорт голоса',
    pageTtsDescription: 'Настройте параметры синтеза речи, загрузите эталонное аудио и экспортируйте голосовые материалы персонажа.',
    pagePaperTitle: 'paper2gal генерация',
    pagePaperDescription: 'Подключает paper2gal pipeline из p2g-character-workflow: загрузка изображения персонажа, polling workflow, просмотр результатов и скачивание debug-пакета.',
    pageImageConverterTitle: 'Конвертер форматов',
    pageImageConverterDescription: 'Загрузите изображение и конвертируйте его в PNG, JPG, WEBP и другие форматы. Поддержка настройки качества и изменения размера.',
    moduleCanvas: 'Основное рабочее поле',
    modulePanel: 'Панель управления',
    modulePipeline: 'Очередь задач и вывод',
    moduleStorage: 'Локальные настройки и история',
    animationTitle: 'Настройки анимации',
    animationEnabled: 'Включить анимацию',
    animationSpeed: 'Скорость анимации',
    animationUiFadeIn: 'Появление UI',
    animationButtonHover: 'Наведение на кнопку',
    animationPageTransitions: 'Переходы страниц',
    animationModalTransitions: 'Переходы модалов',
    animationHint: 'Настройте скорость анимации и переключайте отдельные эффекты. Низкая скорость = медленнее анимация.',
    borderWidthTitle: 'Толщина рамки',
    audioTitle: 'Настройки аудио',
    audioMasterVolume: 'Общая громкость',
    audioSfxVolume: 'Громкость эффектов',
    audioMusicVolume: 'Громкость музыки',
    audioSfxEnabled: 'Включить звуковые эффекты',
    audioMusicEnabled: 'Включить фоновую музыку',
    audioSoundOnInteractOn: 'Звуки кнопок Вкл',
    audioSoundOnInteractOff: 'Звуки кнопок Выкл',
    audioHint: 'Весь звук генерируется процедурно, без внешних файлов.',
    audioSfxPreset: 'Пресет эффектов',
    audioMusicPreset: 'Пресет музыки',
    audioPitch: 'Высота тона',
    audioDuration: 'Длительность',
    audioFilter: 'Фильтр',
    audioDetune: 'Детюн',
    audioReverb: 'Реверберация',
    audioMusicPitch: 'Высота музыки',
    audioMusicTempo: 'Темп музыки',
    audioPreview: 'Предпрослушивание',
    presetClassic: 'Классика',
    presetElectronic: 'Электро',
    presetRetro: 'Ретро',
    presetXylophone: 'Ксилофон',
    presetBell: 'Колокол',
    presetSpace: 'Космос',
    presetDrum: 'Барабан',
    presetPiano: 'Фортепиано',
    presetSynthwave: 'Синтвейв',
    presetChiptune: 'Чиптюн',
    presetStrings: 'Струнные',
    presetWind: 'Духовые',
    presetJazz: 'Джаз',
    presetPercussion: 'Ударные',
    presetAmbient: 'Эмбиент',
    presetScifi: 'Sci-Fi',
    presetCartoon: 'Мульт',
    presetHorror: 'Хоррор',
    presetNature: 'Природа',
    presetMechanical: 'Механика',
    musicOrchestral: 'Оркестр',
    musicAmbient: 'Эмбиент',
    musicElectronic: 'Электро',
    musicPiano: 'Фортепиано',
    musicSynthwave: 'Синтвейв',
    musicNature: 'Природа',
    musicJazz: 'Джаз',
    musicMeditation: 'Медитация',
    musicCyber: 'Кибер',
    musicLofi: 'Лоу-фай',
    musicRock: 'Рок',
    musicBlues: 'Блюз',
    musicFolk: 'Фолк',
    musicReggae: 'Регги',
    musicFunk: 'Фанк',
    musicSoul: 'Соул',
    musicGospel: 'Госпел',
    musicCountry: 'Кантри',
    musicCeltic: 'Кельтская',
    musicOriental: 'Восточная',
    musicTribal: 'Трайбл',
    musicSpace: 'Космос',
    musicUnderwater: 'Под водой',
    musicRain: 'Дождь',
    musicWindchime: 'Колокольчики',
    musicFireplace: 'Камин',
    musicNight: 'Ночь',
    musicSunrise: 'Рассвет',
    musicDreamy: 'Мечтательная',
    musicEnergetic: 'Энергичная',
    musicBattle: 'Битва',
    musicAdventure: 'Приключение',
    musicMystery: 'Тайна',
    musicRomantic: 'Романтика',
    musicNostalgic: 'Ностальгия',
    musicHopeful: 'Надежда',
    musicEpic: 'Эпика',
    musicChill: 'Чилл',
    musicStudy: 'Учёба',
    musicFocus: 'Фокус',
    audioSfxAttack: 'Атака',
    audioSfxDecay: 'Спад',
    audioSfxSustain: 'Удержание',
    audioSfxRelease: 'Затухание',
    audioSfxPan: 'Панорама',
    audioMusicReverb: 'Реверб музыки',
    audioMusicFilter: 'Фильтр музыки',
    audioMusicStereoWidth: 'Ширина стерео',
    audioAdvancedTitle: 'Расширенный синтез',
    audioSpatialTitle: 'Пространство и музыка',
    fontCustomLabel: 'Пользовательский шрифт',
    fontCustomHint: 'Введите название шрифта, установленного в вашей системе.',
    fontCustomPlaceholder: 'Название шрифта, например: LXGW WenKai',
    tabPerformance: 'Производительность',
    tabOthers: 'Другое',
    audioResetSfx: 'Сбросить SFX по умолчанию',
    audioResetMusic: 'Сбросить музыку по умолчанию',
    audioResetAdvanced: 'Сбросить расширенные настройки',
    audioCustomSfx: 'Пользовательские SFX',
    audioCustomMusic: 'Пользовательская музыка',
    audioUploadFile: 'Загрузить аудиофайл',
    audioRemoveCustom: 'Удалить пользовательское',
    audioCustomActive: 'Пользовательское активно',
    animationReset: 'Сбросить анимацию по умолчанию',
    animationEffectsTitle: 'Эффекты анимации',
    performanceTitle: 'Производительность и качество',
    performanceReduceAnimations: 'Уменьшить анимацию',
    performanceDisableGlass: 'Отключить стеклянный эффект',
    performanceLowResPreview: 'Предпросмотр низкого разрешения',
    performanceLazyLoad: 'Ленивая загрузка модулей',
    performanceDisableParticles: 'Отключить частицы',
    performanceAggressiveCache: 'Агрессивное кеширование',
    performanceDevMode: 'Режим отладки разработчика',
    performanceImageQuality: 'Качество предпросмотра изображений',
    performanceImageQualityLow: 'Низкое',
    performanceImageQualityMedium: 'Среднее',
    performanceImageQualityHigh: 'Высокое',
    performanceMaxConcurrent: 'Макс. одновременных запросов',
    performanceReset: 'Сбросить настройки производительности',
    performanceHint: 'Отключение некоторых визуальных эффектов может улучшить производительность на слабых устройствах.',
    apiChannel1: 'Пользовательский API канал 1',
    apiChannel2: 'Пользовательский API канал 2',
    apiChannel3: 'Пользовательский API канал 3',
    apiClearChannel: 'Очистить этот API',
    apiConfirmClear: 'Вы уверены, что хотите очистить эту конфигурацию API?',
    apiConfirmClearAgain: 'Пожалуйста, подтвердите ещё раз: это действие нельзя отменить. Продолжить очистку?',
    othersTitle: 'Другие настройки',
    othersTooltips: 'Показывать подсказки',
    othersConfirmDestructive: 'Двойное подтверждение разрушительных действий',
    othersKeyboardHints: 'Показывать подсказки горячих клавиш',
    othersSmoothScroll: 'Плавная прокрутка',
    othersNotificationSound: 'Звук уведомлений',
    othersAutoSave: 'Интервал автосохранения (мин, 0 = выкл)',
    othersDateFormat: 'Формат даты',
    othersDateFormatIso: 'ISO',
    othersDateFormatLocale: 'Локальный',
    othersDateFormatFriendly: 'Дружелюбный',
    othersShowClock: 'Показывать часы',
    othersStatusBar: 'Включить строку состояния',
    othersHighContrastFocus: 'Высококонтрастное выделение фокуса',
    othersResetAll: 'Сбросить всё',
    othersRestoreDefaults: 'Восстановить все настройки по умолчанию',
    othersConfirmReset: 'Вы уверены, что хотите сбросить все настройки? Это удалит все текущие конфигурации.',
    othersConfirmResetAgain: 'Пожалуйста, подтвердите ещё раз: все пользовательские настройки будут потеряны. Продолжить?',
    othersConfirmRestore: 'Вы уверены, что хотите восстановить все настройки по умолчанию?',
    othersConfirmRestoreAgain: 'Пожалуйста, подтвердите ещё раз: все пользовательские настройки будут перезаписаны. Продолжить?',
    othersHint: 'Эти настройки влияют на глобальное поведение.',
    othersLanguageSettings: 'Настройки языка',
    othersLanguageMissing: 'Если вашего родного языка нет, вы можете нажать кнопку автора на странице «О проекте», чтобы перейти на GitHub и отправить issue или связаться с автором.',
    styleSavePreset: 'Сохранить текущий стиль как пресет',
    stylePreset1: 'Пресет 1',
    stylePreset2: 'Пресет 2',
    stylePresetName: 'Название пресета',
    stylePresetSaved: 'Пресет сохранён',
    stylePresetSame: 'Текущий стиль идентичен существующему пресету.',
    stylePresetUse: 'Использовать этот пресет',
    styleResetDefaults: 'Сбросить стиль по умолчанию',
    confirmYes: 'Да',
    confirmNo: 'Нет',
    confirmCancel: 'Отмена',
    toggleOn: 'ВКЛ',
    toggleOff: 'ВЫКЛ',
  },
};

const paletteOptions: Array<{
  value: AccentPalette;
  swatch: string;
  label: Record<BaseLanguage, string>;
}> = [
  { value: 'ocean', swatch: '#4da3ff', label: { zh: '海蓝', ja: 'オーシャン', en: 'Ocean', ru: 'Океан' } },
  { value: 'emerald', swatch: '#45d08d', label: { zh: '翡翠', ja: 'エメラルド', en: 'Emerald', ru: 'Изумруд' } },
  { value: 'amber', swatch: '#f5b94f', label: { zh: '琥珀', ja: 'アンバー', en: 'Amber', ru: 'Янтарь' } },
  { value: 'rose', swatch: '#f36a9d', label: { zh: '玫瑰', ja: 'ローズ', en: 'Rose', ru: 'Роза' } },
  { value: 'violet', swatch: '#9370ff', label: { zh: '紫藤', ja: 'バイオレット', en: 'Violet', ru: 'Фиалка' } },
  { value: 'slate', swatch: '#9bb2c9', label: { zh: '石墨', ja: 'スレート', en: 'Slate', ru: 'Сланец' } },
  { value: 'crimson', swatch: '#ef476f', label: { zh: '绯红', ja: 'クリムゾン', en: 'Crimson', ru: 'Кармин' } },
  { value: 'teal', swatch: '#22c1c3', label: { zh: '湖青', ja: 'ティール', en: 'Teal', ru: 'Тил' } },
  { value: 'gold', swatch: '#e3b341', label: { zh: '鎏金', ja: 'ゴールド', en: 'Gold', ru: 'Золото' } },
  { value: 'cyan', swatch: '#5bc0eb', label: { zh: '青空', ja: 'シアン', en: 'Cyan', ru: 'Циан' } },
  { value: 'custom', swatch: '#7c5cff', label: { zh: '自定义', ja: 'カスタム', en: 'Custom', ru: 'Своя' } },
];

const languageOptions: Array<{
  value: AppLanguage;
  label: string;
}> = [
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

const fontPresetOptions: Array<{ value: FontPreset; label: string }> = [
  { value: 'sans', label: '系统无衬线' },
  { value: 'serif', label: '系统衬线' },
  { value: 'mono', label: '等宽字' },
  { value: 'heiti', label: '黑体' },
  { value: 'songti', label: '宋体' },
  { value: 'kaiti', label: '楷体' },
  { value: 'georgia', label: 'Georgia' },
  { value: 'times', label: 'Times' },
  { value: 'verdana', label: 'Verdana' },
  { value: 'fira', label: 'Fira Sans' },
  { value: 'custom', label: '自定义字体' },
];

const defaultShortcutMap: ShortcutMap = {
  saveDocument: 'Ctrl+Alt+S',
  bold: 'Ctrl+Alt+B',
  italic: 'Ctrl+Alt+I',
  underline: 'Ctrl+Alt+U',
  strikeThrough: 'Ctrl+Alt+Shift+S',
  subscript: 'Ctrl+Alt+,',
  superscript: 'Ctrl+Alt+.',
  blockquote: 'Ctrl+Alt+Q',
  heading1: 'Ctrl+Alt+Shift+1',
  heading2: 'Ctrl+Alt+Shift+2',
  heading3: 'Ctrl+Alt+Shift+3',
  heading4: 'Ctrl+Alt+Shift+4',
  heading5: 'Ctrl+Alt+Shift+5',
  heading6: 'Ctrl+Alt+Shift+6',
  unorderedList: 'Ctrl+Alt+7',
  orderedList: 'Ctrl+Alt+8',
  justifyLeft: 'Ctrl+Alt+Shift+L',
  justifyCenter: 'Ctrl+Alt+Shift+C',
  justifyRight: 'Ctrl+Alt+Shift+R',
  justifyFull: 'Ctrl+Alt+Shift+J',
  indent: 'Ctrl+Alt+]',
  outdent: 'Ctrl+Alt+[',
  insertLink: 'Ctrl+Alt+K',
  insertTable: 'Ctrl+Alt+T',
  insertHr: 'Ctrl+Alt+H',
  insertCodeBlock: 'Ctrl+Alt+M',
  insertImage: 'Ctrl+Alt+G',
  clearHighlight: 'Ctrl+Alt+Shift+H',
  undo: 'Ctrl+Z',
  redo: 'Ctrl+Shift+Z',
  selectAll: 'Ctrl+A',
  clearFormat: 'Ctrl+Alt+\\',
};

const translationAliases: Record<AppLanguage, BaseLanguage> = {
  zh: 'zh',
  ja: 'ja',
  en: 'en',
  ru: 'ru',
  ko: 'en',
  fr: 'en',
  de: 'en',
  es: 'en',
  it: 'en',
  pt: 'en',
  cs: 'en',
  da: 'en',
  nl: 'en',
  el: 'en',
  hi: 'en',
  hu: 'en',
  id: 'en',
  no: 'en',
  pl: 'en',
  ro: 'en',
  sk: 'en',
  sv: 'en',
  th: 'en',
  tr: 'en',
  uk: 'ru',
  vi: 'en',
  ms: 'en',
  fi: 'en',
  bg: 'ru',
  lt: 'en',
};

const shortcutLabels: Record<BaseLanguage, Record<ShortcutAction, string>> = {
  zh: {
    saveDocument: '保存文档',
    bold: '加粗',
    italic: '斜体',
    underline: '下划线',
    strikeThrough: '删除线',
    subscript: '下标',
    superscript: '上标',
    blockquote: '引用块',
    heading1: '一级标题',
    heading2: '二级标题',
    heading3: '三级标题',
    heading4: '四级标题',
    heading5: '五级标题',
    heading6: '六级标题',
    unorderedList: '无序列表',
    orderedList: '有序列表',
    justifyLeft: '左对齐',
    justifyCenter: '居中',
    justifyRight: '右对齐',
    justifyFull: '两端对齐',
    indent: '增加缩进',
    outdent: '减少缩进',
    insertLink: '插入链接',
    insertTable: '插入表格',
    insertHr: '插入分割线',
    insertCodeBlock: '插入代码块',
    insertImage: '插入图片',
    clearHighlight: '清除高亮',
    undo: '撤销',
    redo: '重做',
    selectAll: '全选',
    clearFormat: '清除格式',
  },
  ja: {
    saveDocument: '文書を保存',
    bold: '太字',
    italic: '斜体',
    underline: '下線',
    strikeThrough: '取り消し線',
    subscript: '下付き',
    superscript: '上付き',
    blockquote: '引用ブロック',
    heading1: '見出し 1',
    heading2: '見出し 2',
    heading3: '見出し 3',
    heading4: '見出し 4',
    heading5: '見出し 5',
    heading6: '見出し 6',
    unorderedList: '箇条書き',
    orderedList: '番号付きリスト',
    justifyLeft: '左揃え',
    justifyCenter: '中央揃え',
    justifyRight: '右揃え',
    justifyFull: '両端揃え',
    indent: 'インデント',
    outdent: '逆インデント',
    insertLink: 'リンクを挿入',
    insertTable: '表を挿入',
    insertHr: '区切り線を挿入',
    insertCodeBlock: 'コードブロックを挿入',
    insertImage: '画像を挿入',
    clearHighlight: 'ハイライト解除',
    undo: '元に戻す',
    redo: 'やり直し',
    selectAll: 'すべて選択',
    clearFormat: '書式をクリア',
  },
  en: {
    saveDocument: 'Save document',
    bold: 'Bold',
    italic: 'Italic',
    underline: 'Underline',
    strikeThrough: 'Strikethrough',
    subscript: 'Subscript',
    superscript: 'Superscript',
    blockquote: 'Blockquote',
    heading1: 'Heading 1',
    heading2: 'Heading 2',
    heading3: 'Heading 3',
    heading4: 'Heading 4',
    heading5: 'Heading 5',
    heading6: 'Heading 6',
    unorderedList: 'Unordered list',
    orderedList: 'Ordered list',
    justifyLeft: 'Align left',
    justifyCenter: 'Align center',
    justifyRight: 'Align right',
    justifyFull: 'Justify',
    indent: 'Indent',
    outdent: 'Outdent',
    insertLink: 'Insert link',
    insertTable: 'Insert table',
    insertHr: 'Insert divider',
    insertCodeBlock: 'Insert code block',
    insertImage: 'Insert image',
    clearHighlight: 'Clear highlight',
    undo: 'Undo',
    redo: 'Redo',
    selectAll: 'Select all',
    clearFormat: 'Clear formatting',
  },
  ru: {
    saveDocument: 'Сохранить документ',
    bold: 'Полужирный',
    italic: 'Курсив',
    underline: 'Подчеркнуть',
    strikeThrough: 'Зачеркнуть',
    subscript: 'Нижний индекс',
    superscript: 'Верхний индекс',
    blockquote: 'Цитата',
    heading1: 'Заголовок 1',
    heading2: 'Заголовок 2',
    heading3: 'Заголовок 3',
    heading4: 'Заголовок 4',
    heading5: 'Заголовок 5',
    heading6: 'Заголовок 6',
    unorderedList: 'Маркированный список',
    orderedList: 'Нумерованный список',
    justifyLeft: 'По левому краю',
    justifyCenter: 'По центру',
    justifyRight: 'По правому краю',
    justifyFull: 'По ширине',
    indent: 'Увеличить отступ',
    outdent: 'Уменьшить отступ',
    insertLink: 'Вставить ссылку',
    insertTable: 'Вставить таблицу',
    insertHr: 'Вставить разделитель',
    insertCodeBlock: 'Вставить код-блок',
    insertImage: 'Вставить изображение',
    clearHighlight: 'Снять подсветку',
    undo: 'Отменить',
    redo: 'Повторить',
    selectAll: 'Выделить все',
    clearFormat: 'Очистить формат',
  },
};

const shortcutBuilderCopy: Record<
  BaseLanguage,
  {
    action: string;
    capture: string;
    captureHint: string;
    apply: string;
    clear: string;
    conflicts: string;
  }
> = {
  zh: {
    action: '操作选择',
    capture: '选择键位',
    captureHint: '点击输入框后直接按下你想要的新组合键，尽量避免浏览器常用快捷键。',
    apply: '应用快捷键',
    clear: '清空键位',
    conflicts: '这个组合已经被其他操作使用，会覆盖旧设置。',
  },
  ja: {
    action: '操作を選択',
    capture: 'キーを記録',
    captureHint: '入力欄をクリックしてから新しいキーの組み合わせを押してください。ブラウザ既定のショートカットはできるだけ避けてください。',
    apply: 'ショートカットを適用',
    clear: 'キーをクリア',
    conflicts: 'この組み合わせは他の操作ですでに使われています。上書きに注意してください。',
  },
  en: {
    action: 'Choose action',
    capture: 'Capture keys',
    captureHint: 'Focus the field and press the new key combo. Try to avoid common browser shortcuts.',
    apply: 'Apply shortcut',
    clear: 'Clear combo',
    conflicts: 'This combo is already used by another action and will overwrite it.',
  },
  ru: {
    action: 'Выбрать действие',
    capture: 'Записать сочетание',
    captureHint: 'Нажмите в поле и введите новую комбинацию клавиш. По возможности избегайте стандартных шорткатов браузера.',
    apply: 'Применить шорткат',
    clear: 'Очистить сочетание',
    conflicts: 'Это сочетание уже используется другим действием и перезапишет старую настройку.',
  },
};

function normalizeShortcutToken(key: string) {
  const lowered = key.toLowerCase();
  if (lowered === ' ') return 'Space';
  if (lowered === 'escape' || lowered === 'esc') return 'Escape';
  if (lowered === 'arrowup') return 'ArrowUp';
  if (lowered === 'arrowdown') return 'ArrowDown';
  if (lowered === 'arrowleft') return 'ArrowLeft';
  if (lowered === 'arrowright') return 'ArrowRight';
  if (lowered.length === 1) return lowered.toUpperCase();
  return lowered.slice(0, 1).toUpperCase() + lowered.slice(1);
}

function formatShortcutInput(event: { ctrlKey: boolean; metaKey: boolean; altKey: boolean; shiftKey: boolean; key: string }) {
  const segments: string[] = [];
  if (event.ctrlKey || event.metaKey) segments.push('Ctrl');
  if (event.altKey) segments.push('Alt');
  if (event.shiftKey) segments.push('Shift');

  const key = normalizeShortcutToken(event.key);
  if (!['Control', 'Meta', 'Alt', 'Shift'].includes(key)) {
    segments.push(key);
  }

  return segments.join('+');
}

const localizedMessages: Record<AppLanguage, Messages> = {
  zh: translations.zh,
  ja: translations.ja,
  en: translations.en,
  ru: translations.ru,
  ko: {
    ...translations.en,
    appSubtitle: '커스텀 OC 캐릭터 허브',
    overviewTitle: '한 장으로, 더 많은 자산으로',
    overviewDescription:
      'Face Maker, style transfer, Character Prompt / LLM / TTS packaging, and paper2gal asset generation are managed from one entry page.',
    workflowTitle: '새 워크플로 시작',
    workflowDescription: '여기에서 원하는 기능으로 바로 이동하세요.',
    workflowHint: '바로가기 버튼을 눌러 해당 작업대로 들어갈 수 있습니다.',
    startButton: '시작',
    settingsButton: '설정',
    featureFace: '페이스 메이커',
    featureStyle: '스타일 변환',
    featureSeries: '시리즈 자산',
    featurePrompt: '프롬프트 + LLM / TTS',
    featurePaper: 'paper2gal 자산',
    backHome: '홈으로',
    openSettings: '설정 열기',
    announcementTitle: '공지',
    announcementHistoryButton: '이전 공지 보기',
    pageFaceTitle: '페이스 메이커',
    pageStyleTitle: '스타일 변환',
    pagePromptTitle: 'OC 설정 에디터',
    pagePaperTitle: 'paper2gal 자산 생성',
  },
  fr: {
    ...translations.en,
    appSubtitle: 'Centre de contrôle OC personnalisé',
    overviewTitle: 'Une image, plusieurs assets',
    overviewDescription:
      'Face Maker, transfert de style, Character Prompt / LLM / TTS et génération d’assets paper2gal sont regroupés dans une seule entrée.',
    workflowTitle: 'Démarrer un nouveau workflow',
    workflowDescription: 'Entrez directement dans la fonction dont vous avez besoin.',
    workflowHint: 'Les cartes d’entrée ouvrent maintenant directement chaque espace de travail.',
    startButton: 'Démarrer',
    settingsButton: 'Paramètres',
    featureFace: 'Face Maker',
    featureStyle: 'Transfert de style',
    featureSeries: 'Assets de série',
    featurePrompt: 'Prompt + LLM / TTS',
    featurePaper: 'Assets paper2gal',
    backHome: 'Retour accueil',
    openSettings: 'Ouvrir les paramètres',
    announcementTitle: 'Annonce',
    announcementHistoryButton: 'Voir les annonces passées',
    pageFaceTitle: 'Face Maker',
    pageStyleTitle: 'Transfert de style',
    pagePromptTitle: 'Éditeur de fiches OC',
    pagePaperTitle: 'Génération d’assets paper2gal',
  },
  de: {
    ...translations.en,
    appSubtitle: 'Benutzerdefiniertes OC-Kontrollzentrum',
    overviewTitle: 'Ein Bild, mehrere Assets',
    overviewDescription:
      'Face Maker, Stiltransfer, Character Prompt / LLM / TTS und paper2gal-Asset-Erzeugung werden auf einer gemeinsamen Startseite verwaltet.',
    workflowTitle: 'Neuen Workflow starten',
    workflowDescription: 'Springe direkt in die Funktion, die du jetzt brauchst.',
    workflowHint: 'Die Einstiegskarten führen jetzt direkt in die jeweiligen Arbeitsbereiche.',
    startButton: 'Starten',
    settingsButton: 'Einstellungen',
    featureFace: 'Face Maker',
    featureStyle: 'Stiltransfer',
    featureSeries: 'Serien-Assets',
    featurePrompt: 'Prompt + LLM / TTS',
    featurePaper: 'paper2gal-Assets',
    backHome: 'Zur Startseite',
    openSettings: 'Einstellungen öffnen',
    announcementTitle: 'Ankündigung',
    announcementHistoryButton: 'Frühere Ankündigungen ansehen',
    pageFaceTitle: 'Face Maker',
    pageStyleTitle: 'Stiltransfer',
    pagePromptTitle: 'OC-Karteneditor',
    pagePaperTitle: 'paper2gal-Asset-Generierung',
  },
  es: {
    ...translations.en,
    appSubtitle: 'Centro de control OC personalizado',
    overviewTitle: 'Una imagen, más assets',
    overviewDescription:
      'Face Maker, transferencia de estilo, Character Prompt / LLM / TTS y generación de assets paper2gal se gestionan desde una sola entrada.',
    workflowTitle: 'Iniciar un nuevo flujo',
    workflowDescription: 'Entra directamente en la función que necesitas.',
    workflowHint: 'Las tarjetas de acceso ahora abren cada banco de trabajo directamente.',
    startButton: 'Iniciar',
    settingsButton: 'Configuración',
    featureFace: 'Face Maker',
    featureStyle: 'Transferencia de estilo',
    featureSeries: 'Assets en serie',
    featurePrompt: 'Prompt + LLM / TTS',
    featurePaper: 'Assets paper2gal',
    backHome: 'Volver al inicio',
    openSettings: 'Abrir configuración',
    announcementTitle: 'Anuncio',
    announcementHistoryButton: 'Ver anuncios anteriores',
    pageFaceTitle: 'Face Maker',
    pageStyleTitle: 'Transferencia de estilo',
    pagePromptTitle: 'Editor de fichas OC',
    pagePaperTitle: 'Generación de assets paper2gal',
  },
  it: {
    ...translations.en,
    appSubtitle: 'Centro di controllo OC personalizzato',
    overviewTitle: 'Una sola immagine, più asset',
    overviewDescription:
      'Face Maker, style transfer, Character Prompt / LLM / TTS e generazione di asset paper2gal sono raccolti in un unico ingresso.',
    workflowTitle: 'Avvia un nuovo workflow',
    workflowDescription: 'Entra subito nella funzione che ti serve.',
    workflowHint: 'Le carte di accesso ora aprono direttamente ogni banco di lavoro.',
    startButton: 'Avvia',
    settingsButton: 'Impostazioni',
    featureFace: 'Face Maker',
    featureStyle: 'Style transfer',
    featureSeries: 'Asset di serie',
    featurePrompt: 'Prompt + LLM / TTS',
    featurePaper: 'Asset paper2gal',
    backHome: 'Torna alla home',
    openSettings: 'Apri impostazioni',
    announcementTitle: 'Annuncio',
    announcementHistoryButton: 'Vedi annunci precedenti',
    pageFaceTitle: 'Face Maker',
    pageStyleTitle: 'Style transfer',
    pagePromptTitle: 'Editor schede OC',
    pagePaperTitle: 'Generazione asset paper2gal',
  },
  pt: {
    ...translations.en,
    appSubtitle: 'Central de controle OC personalizada',
    overviewTitle: 'Uma imagem, mais assets',
    overviewDescription:
      'Face Maker, transferência de estilo, Character Prompt / LLM / TTS e geração de assets paper2gal ficam reunidos em uma única entrada.',
    workflowTitle: 'Iniciar um novo fluxo',
    workflowDescription: 'Entre direto na função que você precisa agora.',
    workflowHint: 'Os cartões de entrada agora abrem cada bancada de trabalho diretamente.',
    startButton: 'Iniciar',
    settingsButton: 'Configurações',
    featureFace: 'Face Maker',
    featureStyle: 'Transferência de estilo',
    featureSeries: 'Assets em série',
    featurePrompt: 'Prompt + LLM / TTS',
    featurePaper: 'Assets paper2gal',
    backHome: 'Voltar ao início',
    openSettings: 'Abrir configurações',
    announcementTitle: 'Aviso',
    announcementHistoryButton: 'Ver avisos anteriores',
    pageFaceTitle: 'Face Maker',
    pageStyleTitle: 'Transferência de estilo',
    pagePromptTitle: 'Editor de fichas OC',
    pagePaperTitle: 'Geração de assets paper2gal',
  },

  cs: {
    ...translations.en,
  },
  da: {
    ...translations.en,
  },
  nl: {
    ...translations.en,
  },
  el: {
    ...translations.en,
  },
  hi: {
    ...translations.en,
  },
  hu: {
    ...translations.en,
  },
  id: {
    ...translations.en,
  },
  no: {
    ...translations.en,
  },
  pl: {
    ...translations.en,
  },
  ro: {
    ...translations.en,
  },
  sk: {
    ...translations.en,
  },
  sv: {
    ...translations.en,
  },
  th: {
    ...translations.en,
  },
  tr: {
    ...translations.en,
  },
  uk: {
    ...translations.ru,
  },
  vi: {
    ...translations.en,
  },
  ms: {
    ...translations.en,
  },
  fi: {
    ...translations.en,
  },
  bg: {
    ...translations.ru,
  },
  lt: {
    ...translations.en,
  },
};

const announcementHistory = [
  {
    version: '0.5.1',
    date: '2026-04-20',
    title: '0.5.1 公告修复 + 端口扩展 + TTS 全面增强',
    summary: '修复首页公告显示 Bug，扩展后端端口探测范围，TTS 导出页面新增 13 项参数与 3 个可折叠精校模块。',
    details: [
      '修复首页公告内容 Bug：公告卡片现在从 announcementHistory 数组动态读取最新内容，不再显示过期的硬编码 0.4.2.1 文案。',
      '扩展后端端口探测范围：PROBE_PORTS 从 5 个端口扩展至 10 个（3000/3001/5173/4173/8080/8000/5000/5001/9000/9001），并改进错误提示信息。',
      'TTS 导出页面全面增强：新增气息感、清晰度、表现力、语速变化 4 项基础参数滑块。',
      '新增高级参数可折叠面板：停顿强度、语调曲线（平直/自然/戏剧化/旋律化）、强调模式（正常/强烈/微妙）。',
      '新增音频后处理可折叠面板：降噪强度、EQ 预设（平直/温暖/明亮/广播/清晰）、压缩强度、后处理总开关。',
      '新增发音精校可折叠面板：文本预处理开关、自定义替换规则文本框。',
      '全部 26 个新翻译键已同步至 4 种基础语言（中/日/英/俄）。',
      '更新 Plato API Key 至新服务密钥。',
    ],
  },
  {
    version: '0.5.0.1',
    date: '2026-04-20',
    title: '0.5.0.1 紧急更新：切换 Plato API Key',
    summary: '更换 Plato 图像生成服务 API Key，确保 Paper2Gal 图像编辑通道正常可用。',
    details: [
      '更新 PLATO_API_KEY 至新的服务密钥，解决旧 key 额度耗尽导致的图像生成失败。',
      'API Base URL 保持 https://api.bltcy.ai/v1，无需用户侧配置变更。',
    ],
  },
  {
    version: '0.5.0',
    date: '2026-04-20',
    title: '0.5.0 大版本更新：转画风重构 + 图片格式转换 + API 升级',
    summary: '转画风页面全面重构为可折叠工作台，新增图片格式转换工具，Paper2Gal API 升级至 gpt-image-2，修复全部已知安全漏洞和内存泄漏。',
    details: [
      '转画风（Style Transfer）全面重构：参数面板、结果面板、日志面板全部支持折叠展开，UI 更清爽。',
      '新增高级 AI 参数：宽高比、图像尺寸、风格强度、线稿风格、配色方案、背景类型、光照风格、镜头角度、角色情绪、服装细节、眼睛风格、发型、皮肤质感共 13 项参数。',
      'Prompt 隐形附加系统：高级参数自动转换为英文 prompt 后缀并实时显示 Effective Prompt Preview。',
      '新增风格 Tag 库弹窗：约 150 个正面 tag（现代动漫、Galgame、游戏角色、画风、色彩、光影、背景等 11 个分类）。',
      '新增负面 Tag 库弹窗：约 100 个负面 tag（低质量、解剖错误、面部/手部/肢体错误、颜色问题等 10 个分类）。',
      '新增可拖拽报错详情面板：错误发生时弹出可移动面板，支持复制、导出 JSON、一键重试。',
      '新增图片格式转换工具：支持 PNG/JPEG/WEBP 互转，可调节质量、限制最大尺寸、保持宽高比。',
      '主页和开始弹窗扩展为 7 个入口：新增图片格式转换入口。',
      'Paper2Gal API 升级：默认模型从 gemini-3.1-flash-image-preview 升级为 gpt-image-2。',
      '修复后端路径遍历漏洞：workflow ID 增加正则校验，防止恶意请求读取服务器任意文件。',
      '修复后端 rerun 路由状态损坏：非法 targetStep 不再导致 workflow 永久卡死。',
      '修复 SFX 混响节点内存泄漏：音效播放结束后自动 disconnect 所有 AudioNode。',
      '修复旧用户 LLM/TTS 配置丢失：拆页后新页面自动迁移旧 prompt-suite 中的数据。',
      '修复 cutout-assets 代理 timer leak 和超时错误码。',
      '修复 promptLoader 缺失 .md 文件时的级联崩溃。',
      '修复 writeWorkflowSnapshots 在非 fatal 步骤后的未保护调用。',
      '修复 parseExecutionOptions 意外关闭并发开关的 Bug。',
      '全部翻译同步更新：4 种基础语言 + 26 种继承语言。',
      'TypeScript 严格检查通过：零类型错误、零未使用变量。',
    ],
  },
  {
    version: '0.4.3.3',
    date: '2026-04-20',
    title: '0.4.3.3 后端全面修 Bug',
    summary: '修复后端 CORS、抠图 provider、请求超时和 prompt 死代码等全部已知问题，前后端稳定性大幅提升。',
    details: [
      '修复 CORS 多 origin 不匹配：当环境变量配置逗号分隔的多个 origin 时，后端现在能正确解析数组并允许所有配置的域名访问，不再出现跨域拒绝。',
      '修复前端抠图 provider 被错误回退为 mock：providerRegistry 现在正确识别 "frontend" 配置，不再 fall through 到 mock 导致后端运行无意义的抠图任务。',
      '修复 workflow 中 frontend 抠图步骤仍被后端执行：当背景移除 provider 为 frontend 时，executeWorkflow 现在会跳过 cutout generation，等待前端上传，避免步骤失败。',
      '修复 cutout-assets 代理请求无超时：静态资源代理 fetch 现在带有 15 秒 AbortSignal 超时，防止上游挂起时请求无限等待。',
      '修复 Aliyun 结果图片下载无超时：下载抠图结果图片的 fetch 现在带有 30 秒超时，网络波动时不再导致 workflow 卡死。',
      '修复 Plato 远程图片下载无超时：从 Plato 返回的远程图片 URL 下载同样增加了 30 秒超时保护。',
      '修复 prompt 模板文件死代码：prompts/ 目录下的 expression-thinking.md、expression-surprise.md、expression-angry.md 和 cg-generation.md 现在被实际读取并用于生成 prompt，不再被硬编码字符串覆盖，修改 markdown 文件即可生效。',
      'BGM 音质大幅提升：每个音符升级为 3 层振荡器（sub + primary + bright overtone），加入滤波器包络、ADSR 包络、人性化随机 detune 与力度变化、18ms swing、更丰富的鼓组合成（kick body+click、snare tone+noise、bandpass hihat），以及总线 dynamics compressor 限幅器。',
      'Performance 设置 UI 改版：从 palette-chip 网格改为清爽的行式开关（标签在左、toggle 在右），更直观易用。',
    ],
  },
  {
    version: '0.4.3.2',
    date: '2026-04-20',
    title: '0.4.3.2 Bug 修复与稳定性提升',
    summary: '全面修复 v0.4.2.1 中发现的崩溃风险、功能失效和用户体验问题，提升整体稳定性与一致性。',
    details: [
      '修复 localStorage 配额崩溃：自定义音效/音乐文件不再直接存入 localStorage，避免上传大文件后页面白屏或无法启动。',
      '修复 BGM 节奏为 0 时页面卡死：对 tempo 值进行安全边界检查，防止零或负值导致无限循环冻结主线程。',
      '修复后台标签切回后的音频泄漏：浏览器节流 setInterval 后，已过去的音符不再尝试调度，防止幽灵音频残留。',
      '修复 API 清除通道确认文案错误：第二步提示现在正确显示「请再次确认清除」而非错误的「恢复默认」。',
      '修复「禁用毛玻璃」覆盖不全：扩展 CSS 选择器至全部 15+ 处 glassmorphism 卡片，开启后所有模糊效果均被移除。',
      '修复「恢复样式默认」无确认：与其他破坏性操作保持一致，现在也需要双重确认。',
      '修复样式预设加载丢失锁定状态：加载 paper2gal 预设后正确恢复锁定，不再丢失保存时的样式配置。',
      '修复语言设置未验证：损坏或非法的语言代码不再导致整个页面白屏。',
      '修复 BGM 实时调节不生效：播放中调节节奏和音高现在会立即生效，无需手动停止再启动。',
      '修复低分辨率预览无效：将 image-rendering 设为 pixelated，真正降级图像质量。',
      'TypeScript 类型一致性修复：MusicPreset 与 AudioSettings 接口完全对齐，确保构建通过。',
    ],
  },
  {
    version: '0.4.2.1',
    date: '2026-04-20',
    title: '0.4.2.1 全按钮音效覆盖、40 种 BGM 预设与性能设置功能化',
    summary: '全局交互音效实现真正全覆盖，背景音乐引擎升级至 v5 并扩展至 40 种风格预设，性能设置各项选项现已真正生效。',
    details: [
      '全局音效全覆盖：所有按钮、链接、切换开关、滑块、复选框、选择框、标签页和弹窗按钮均触发对应音效（确认/关闭/切换/滑动等），不再有静音交互。',
      '背景音乐引擎 v5：采用 Web Audio API 前瞻式调度（lookahead scheduling），实现毫秒级精准的音符时序；新增 30 种风格预设，总计 40 种（摇滚、蓝调、民谣、雷鬼、放克、灵魂乐、福音、乡村、凯尔特、东方、部落、太空、水下、雨声、风铃、壁炉、夜晚、日出、梦幻、活力、战斗、冒险、神秘、浪漫、怀旧、希望、史诗、放松、学习、专注）。',
      '性能设置功能化：「减少动画」会强制禁用所有 CSS 动画与过渡；「禁用毛玻璃」会移除所有 backdrop-filter；「低分辨率预览」会降级图像渲染；「开发者模式」会在界面右下角显示实时调试面板，展示版本、语言、预设、音效、API 等全部运行状态。',
      '30 种语言同步更新：新增 30 个 BGM 预设名称已同步到 4 种基础语言翻译中。',
    ],
  },
  {
    version: '0.4.2',
    date: '2026-04-20',
    title: '0.4.2 音乐引擎重写、性能与其他设置、API 多通道与样式预设保存',
    summary: '全面重写背景音乐引擎，新增「性能」与「其他」设置标签页，支持 3 个自定义 API 通道与双次确认清除，音频支持自定义文件上传，样式预设支持保存与加载，动画与音频各区域新增恢复默认按钮。',
    details: [
      '背景音乐引擎 v4 全面重写：新增打击乐节奏层、更丰富的和弦进行、立体声像分布和低音线，所有 10 种风格预设音质大幅提升。',
      '新增「性能」设置标签页：提供减少动画、禁用毛玻璃、低分辨率预览、延迟加载、禁用粒子、激进缓存、开发者模式、图像预览质量和最大并发请求数等选项。',
      '新增「其他」设置标签页：包含语言设置提示、工具提示、二次确认、键盘快捷键提示、平滑滚动、通知声音、自动保存间隔、日期格式、时钟、状态栏、高对比度焦点等选项，以及「全部重刷」和「恢复全部默认」双次确认按钮。',
      'API 设置扩展为 3 个自定义通道：每个通道独立配置 baseUrl 和 apiKey，支持带双次确认的快速清除按钮。',
      '音频支持自定义文件上传：音效和音乐均可上传本地音频文件，上传后可通过开关启用或禁用自定义音频。',
      '样式预设保存功能：支持将当前样式保存为「预设 1」或「预设 2」，可自定义命名，保存时检测重复并提示。',
      '音频和动画各区域新增「恢复默认」按钮，动画效果标题由硬编码英文改为本地化文本。',
      '30 种语言同步更新，所有新增字段已同步到 4 种基础语言翻译中。',
    ],
  },
  {
    version: '0.4.1.1',
    date: '2026-04-20',
    title: '0.4.1.1 动画设置面板、全局音效与边框自定义',
    summary: '新增动画设置面板，支持动画速度、边框粗细和子效果开关；全局按钮点击音效覆盖所有交互元素；音频引擎增加 ADSR 包络、声像和音乐混响等高级控制。',
    details: [
      '新增「动画」设置标签页：支持动画总开关、动画速度无级调节（20%~200%）、边框粗细（1px~4px）以及 UI 渐显、按钮悬停、页面切换、弹窗过渡四个子效果的独立开关。',
      '全局按钮点击音效：通过委托事件监听器覆盖所有 button、a、choice-chip 和 palette-chip 元素，无需手动给每个按钮绑定 onClick。',
      '音频高级合成控制：新增 ADSR 包络（起音/衰减/延音/释音）、声像（Pan）、音乐混响等细粒度调节滑块。',
      '30 种语言同步更新：所有新增字段已同步到约 30 种语言的翻译中，公告历史支持多语言切换。',
    ],
  },
  {
    version: '0.4.0',
    date: '2026-04-20',
    title: '0.4.0 程序合成音效引擎、30 语言扩展与双语错误提示',
    summary: '新增 50 个程序化合成的 UI 音效与氛围管弦乐、将语言支持扩展到约 30 种、新增音频设置面板、支持自定义字体，并提供详细的中英双语错误提示。',
    details: [
      '全新的 Web Audio API 音效引擎：50 个 UI 交互音效（点击、悬停、成功、错误、切换等）全部通过振荡器与噪声缓冲实时合成，零外部音频文件。',
      '氛围背景音乐：可选的轻柔管弦乐氛围音乐，通过多声部滤波正弦波与 LFO 调制生成，支持独立音量与开关控制。',
      '设置面板新增「音频」标签页：支持主音量、音效音量、音乐音量的独立调节，以及音效与背景音乐的独立开关。',
      '语言支持从 10 种扩展到约 30 种，新增捷克语、丹麦语、荷兰语、希腊语、印地语、匈牙利语、印尼语、挪威语、波兰语、罗马尼亚语、斯洛伐克语、瑞典语、泰语、土耳其语、乌克兰语、越南语、马来语、芬兰语、保加利亚语、立陶宛语，且所有新增语言均同步了音频与字体自定义字段的翻译。',
      '错误提示全面双语化：关键错误面板现在同时提供中文与英文说明，包含可能的根因与修复建议。',
      '自定义字体支持：字体预设新增「自定义」选项，可直接输入系统中已安装的字体名称实时生效。',
    ],
  },
  {
    version: '0.3.7',
    date: '2026-04-19',
    title: '0.3.7 paper2gal 参考图链路修复与 qwen-image-edit 接入',
    summary: '把 paper2gal 的图像步骤切到更稳定的 images/edits 图生图链路，修复参考图失真、假成功和错误提示不清晰的问题。',
    details: [
      'plato 图像适配层从旧的 chat/completions 路径切到 images/edits，并优先使用 qwen-image-edit，避免参考图被上游改写成无效的占位 URL。',
      '新 workflow 的表情、CG 和 rembg 抠图都会走真实链路执行，不再静默回退到 mock，参考图约束和结果一致性也更稳定。',
      '错误详情补充了 possible_cause 与 fix_hint，能直接提示当前是图像模型通道、内容审核还是参考图改写链路的问题。',
    ],
  },
  {
    version: '0.3.6.1',
    date: '2026-04-19',
    title: '0.3.6.1 paper2gal Prompt 回调与模块重刷补齐',
    summary: '把 paper2gal 默认 Prompt 改成最新指定文案，并给捏脸、转画风、Prompt / TTS 页面补上统一的重刷入口。',
    details: [
      'paper2gal 的默认表情 Prompt 与 CG Prompt 改成最新指定版本，前端默认值和后端实际编译逻辑保持一致。',
      '捏脸、转画风、Prompt / TTS 页面顶部都新增“重刷”按钮，并统一接入确认弹窗，执行后会清空当前页面的参数和临时结果。',
      '主页、公告面板和版本号同步更新到 0.3.6.1，方便直接确认当前补丁是否已经生效。',
    ],
  },
  {
    version: '0.3.6',
    date: '2026-04-19',
    title: '0.3.6 paper2gal 顺序执行、单结果重做与 rembg 切换',
    summary: 'paper2gal 默认回到顺序执行，新增工作流并发开关、单结果重做与 Prompt 自定义，并把 cutout 路径切回 rembg。',
    details: [
      'workflow 现在默认按顺序逐步执行；只有开启“工作流并发”后，AI 生成部分才会并发，cutout 仍然保持顺序处理。',
      '每个输出结果卡片都新增了“重做当前结果”，可以只重跑某一张表情、某一张 CG 或对应透明底素材。',
      '上传提示文案改为无背景角色图，cutout 不再使用 Prompt，而是切换为 rembg 抠图路径，并沿用更强的一致性 Prompt 约束角色特征。',
    ],
  },
  {
    version: '0.3.5',
    date: '2026-04-18',
    title: '0.3.5 公告补全、关于页入口与设卡编辑器升级',
    summary: '补全 0.3.3.0 到 0.3.3.2 的公告链路，并继续升级 OC 设卡编辑器、关于页入口和快捷键设置。',
    details: [
      '公告面板补齐 0.3.3.0、0.3.3.1、0.3.3.2、0.3.4 等历史版本，并把列表改成默认收起的版本入口样式。',
      '关于页新增 paper2gal 官方站点入口，作者和 GitHub 仓库链接文案同步整理。',
      'OC 设卡编辑器继续升级：工具栏可折叠、字体和插入工具扩展、自定义字体与自定义插入弹窗、快捷键设置页一并补上。',
    ],
  },
  {
    version: '0.3.4',
    date: '2026-04-18',
    title: '0.3.4 paper2gal 侧栏重排与全局确认弹窗',
    summary: '重新整理 paper2gal 的右侧信息栏，让结果与调试更聚焦，同时把返回首页确认弹窗提升到全局层。',
    details: [
      'paper2gal 的结果资产、结果清单、最近错误与调试 JSON 全部收进右侧信息栏，避免输出信息分散在页面下半段。',
      '包含代码框的结果 / 错误 / 调试面板默认折叠，仅在步骤失败时自动展开最近错误，页面信息更清爽、更容易快速定位。',
      '返回首页确认弹窗改为通过全局层独立渲染，不再受工作台面板尺寸、缩放比例和局部容器裁切影响。',
    ],
  },
  {
    version: '0.3.3.2',
    date: '2026-04-17',
    title: '0.3.3.2 前端 UI / UX 细节整理',
    summary: '清理工作台页面里重复的保存状态信息，并修正 paper2gal 资源复制后的按钮反馈文案。',
    details: [
      '捏脸、转画风、Prompt / TTS、paper2gal 页顶部的保存状态不再重复显示两次，工作区头部信息更简洁。',
      'paper2gal 结果资源卡片复制成功后，会显示“已复制”反馈，不再沿用不准确的“复制结果”文案。',
      '重新构建并回归检查当前前端样式、工作台交互、版本号和公告面板，补丁版本保持主题与多语言结构同步。',
    ],
  },
  {
    version: '0.3.3.1',
    date: '2026-04-16',
    title: '0.3.3.1 paper2gal 下载错误链路补强',
    summary: '继续补强 paper2gal 的错误可读性，下载单文件和整包失败时也会给出更清楚的定位信息。',
    details: [
      'paper2gal 下载结果文件或 zip 归档失败时，会展示可读错误摘要、后端返回内容和实际请求地址。',
      '模型接口地址误填检查继续扩展到下载链路，避免某些按钮点击后才出现晦涩错误。',
      '重新构建并回归检查当前 UI、公告、版本号和本地保存逻辑，确保补丁版不带进新的界面问题。',
    ],
  },
  {
    version: '0.3.3.0',
    date: '2026-04-15',
    title: '0.3.3.0 paper2gal API 诊断与错误可读性修复',
    summary: 'paper2gal 现在能识别错误的模型接口地址，并把后端错误对象展开成可读说明，而不是只显示 [object Object]。',
    details: [
      'paper2gal 会在启动前检查当前 API 地址是否看起来像 /v1/chat/completions 这类模型接口，并明确提示这里需要的是工作流后端根地址。',
      '错误面板会同时展示可读错误摘要、后端返回内容、当前请求地址和修复提示，定位 API 接入问题更直接。',
      '项目设置里的 API 文案同步更新，强调这里要填 workflow backend root，并保留现有主题、样式和本地保存逻辑。',
    ],
  },
  {
    version: '0.3.2',
    date: '2026-04-14',
    title: '0.3.2 公告主页化与编辑器工具栏升级',
    summary: '首页改成公告 + 四入口结构，未保存离站提醒覆盖刷新场景，Prompt / TTS 页补上更完整的分区工具栏和复制动作。',
    details: [
      '首页左侧主卡切换为当前公告，开始和设置按钮放到同一区域，往期公告入口可直接打开设置里的公告面板。',
      '全局对比度继续生效，浅色模式背景不再残留黑色深色渐变；所有主按钮在高亮时会整块染上当前样式色。',
      'Prompt / LLM / TTS 页把工具栏重组为更接近 Word 的分区布局，并给文档编辑区和系统提示词分别补上独立复制按钮。',
    ],
  },
  {
    version: '0.3.1',
    date: '2026-04-13',
    title: '0.3.1 首页入口与本地持久化修正',
    summary: '修复转画风页返回首页确认层级异常，补齐工作流参数本地保存，并继续整理首页入口结构。',
    details: [
      '转画风页的返回首页确认弹窗加强了层级和显示稳定性，避免出现只剩遮罩的异常状态。',
      '转画风、Prompt / LLM / TTS 和 paper2gal 的设置参数现在都会写入本地存储，刷新页面后继续保留。',
      '首页移除了 3 / 10 / Local 指标块，说明文字上移到站点副标题下，并补齐功能入口图标按钮。',
    ],
  },
  {
    version: '0.3.0',
    date: '2026-04-13',
    title: '0.3.0 工作台页面升级',
    summary: '首页改成单卡入口，转画风、Prompt / LLM / TTS 与 paper2gal 三个页面升级为真正可操作的工作台。',
    details: [
      '首页把两块主卡合并为统一入口区，只保留三大功能入口、开始动作与本地优先的站点说明。',
      '转画风页补上图片输入、模型与采样参数、详细日志、明确错误包、结果数据和复制 / 下载调试动作。',
      '角色 Prompt + LLM / TTS 页补上富文本编辑器、OC 模板、封装配置，三个功能页统一支持返回首页前确认。',
    ],
  },
  {
    version: '0.2.2',
    date: '2026-04-12',
    title: '0.2.2 首页清理与样式自定义',
    summary: '移除首页半成品占位区，补上自定义配色和全局对比度，并修正一轮主题与状态逻辑。',
    details: [
      '首页移除了工作流进度、阶段输出和上传占位内容，入口结构更像正式站点首页。',
      '样式页新增自定义配色和全局对比度调节，自定义颜色输入带有非法值回退保护。',
      '修正主入口数量与文案不一致、paper2gal 锁定时自定义配色区显示不准确等问题。',
    ],
  },
  {
    version: '0.2.1',
    date: '2026-04-12',
    title: '0.2.1 捏脸编辑器壳与公告历史',
    summary: '新增 VRoid 风格捏脸编辑器布局、返回确认弹窗、10 语言、10 字体与历史公告面板。',
    details: [
      '捏脸页改成左侧资产面板、中间透明画布、右侧参数面板，并加入顶部工具栏。',
      '返回首页前会检测当前草稿是否保存，未保存时弹出更明确的提醒。',
      '公告页扩展为当前公告 + 历史公告列表，并补齐 0.1.0 到 0.2.0 的版本记录。',
    ],
  },
  {
    version: '0.2.0',
    date: '2026-04-12',
    title: '0.2.0 紧凑化 UI 与入口动效',
    summary: '压缩主页面比例、入口弹窗改图标、补全按钮高亮和渐显动画。',
    details: [
      '主页整体缩放并贴近 Character Workflow Agent 的布局比例。',
      '入口弹窗从编号卡片改成了图标卡片，交互反馈更清晰。',
      '设置面板的打开关闭动画和按钮按压动画一起补齐。',
    ],
  },
  {
    version: '0.1.5',
    date: '2026-04-11',
    title: '0.1.5 主页结构细化',
    summary: '开始和设置按钮迁移到主操作区，并继续梳理首页卡片结构。',
    details: [
      '首页的动作区与信息区分开，功能入口更集中。',
      '调整文案结构，减少开发者视角的占位表述。',
      '为后续工作流卡片和设置页联动打基础。',
    ],
  },
  {
    version: '0.1.4',
    date: '2026-04-11',
    title: '0.1.4 主题同步整理',
    summary: 'paper2gal 主题和默认主题的变量重新同步，设置页同步修正。',
    details: [
      'paper2gal 主题开启后锁定主色和明暗模式。',
      '整理了主题变量，避免主页和设置页不同步。',
      '给后续扩展更多配色留了结构空间。',
    ],
  },
  {
    version: '0.1.3',
    date: '2026-04-10',
    title: '0.1.3 设置页与入口弹窗',
    summary: '项目设置、功能入口弹窗和基础多语言切换已经接通。',
    details: [
      '设置页建立样式、语言、接口、公告和关于五个分区。',
      '开始按钮打开功能入口弹窗，形成站点一级导航。',
      '本地保存的设置状态已经接入浏览器存储。',
    ],
  },
  {
    version: '0.1.2',
    date: '2026-04-10',
    title: '0.1.2 首页主题与动效底座',
    summary: '补上暗色基底、玻璃卡片、基础渐显动效和站点背景氛围。',
    details: [
      '站点整体视觉方向确定为深色创作工作台。',
      '加入渐显动画和卡片阴影，为后续交互动效准备底座。',
      '开始整理按钮、卡片和标题的统一节奏。',
    ],
  },
  {
    version: '0.1.1',
    date: '2026-04-09',
    title: '0.1.1 首页与流程入口初版',
    summary: '主页、开始流程和设置面板的第一版框架完成。',
    details: [
      '首页形成主面板和功能入口的基础结构。',
      '开始流程弹窗建立了捏脸、转画风和生成系列素材的主入口。',
      '站点开始具备作为 OC 创作入口页的基本形态。',
    ],
  },
  {
    version: '0.1.0',
    date: '2026-04-09',
    title: '0.1.0 项目起步',
    summary: '项目初始化完成，前端工程、路由壳和基础资源组织开始落地。',
    details: [
      'Vite + React + TypeScript 的前端底座建立。',
      '确定以本地保存和角色创作中控台为核心方向。',
      '开始规划捏脸、转画风与系列素材生成三条主线。',
    ],
  },
] as const;

function hexToRgb(hex: string) {
  const normalized = hex.trim().replace('#', '');

  if (!/^[0-9a-fA-F]{6}$/.test(normalized)) {
    return '79, 157, 247';
  }

  const red = Number.parseInt(normalized.slice(0, 2), 16);
  const green = Number.parseInt(normalized.slice(2, 4), 16);
  const blue = Number.parseInt(normalized.slice(4, 6), 16);

  return `${red}, ${green}, ${blue}`;
}

const defaultSettings: SettingsState = {
  stylePreset: 'default',
  depth: 'deep',
  accent: 'ocean',
  customAccentColor: '#7c5cff',
  contrast: 100,
  borderWidth: 1,
  language: 'zh',
  customFontFamily: '',
  interfaceMode: 'builtin',
  apiPreset: 'plato',
  apiBaseUrl: '',
  apiKey: '',
  apiBaseUrl2: '',
  apiKey2: '',
  apiBaseUrl3: '',
  apiKey3: '',
  fontPreset: 'sans',
  shortcutMap: defaultShortcutMap,
  audio: { ...defaultAudioSettings },
  animation: {
    enabled: true,
    speed: 100,
    uiFadeIn: true,
    buttonHover: true,
    pageTransitions: true,
    modalTransitions: true,
  },
  performance: {
    reduceAnimations: false,
    disableGlassmorphism: false,
    lowResolutionPreviews: false,
    lazyLoadModules: false,
    disableParticles: false,
    aggressiveCaching: false,
    devMode: false,
    imagePreviewQuality: 'high',
    maxConcurrentRequests: 4,
  },
  others: {
    showTooltips: true,
    confirmDestructiveActions: true,
    showKeyboardHints: true,
    smoothScroll: true,
    enableNotificationSound: true,
    autoSaveInterval: 0,
    dateFormat: 'locale',
    showClock: false,
    enableStatusBar: false,
    highContrastFocus: false,
  },
  savedPresets: [null, null],
};

function loadInitialSettings(): SettingsState {
  if (typeof window === 'undefined') {
    return defaultSettings;
  }

  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    return defaultSettings;
  }

  try {
    const parsed = JSON.parse(saved) as Partial<SettingsState>;
    const nextSettings = { ...defaultSettings, ...parsed };

    if ((nextSettings as { fontPreset?: string }).fontPreset === 'rounded') {
      nextSettings.fontPreset = 'sans';
    }

    const validApiPresets = ['plato', 'custom1', 'custom2', 'custom3'];
    if (!validApiPresets.includes(nextSettings.apiPreset)) {
      nextSettings.apiPreset = 'plato';
    }

    const validStylePresets = ['default', 'paper2gal', 'preset1', 'preset2'];
    if (!validStylePresets.includes(nextSettings.stylePreset)) {
      nextSettings.stylePreset = defaultSettings.stylePreset;
    }

    const validLanguages: string[] = Object.keys(localizedMessages);
    if (!validLanguages.includes(nextSettings.language)) {
      nextSettings.language = defaultSettings.language;
    }

    if (!/^#[0-9a-fA-F]{6}$/.test(nextSettings.customAccentColor)) {
      nextSettings.customAccentColor = defaultSettings.customAccentColor;
    }

    if (typeof nextSettings.contrast !== 'number' || Number.isNaN(nextSettings.contrast)) {
      nextSettings.contrast = defaultSettings.contrast;
    }

    nextSettings.shortcutMap = {
      ...defaultShortcutMap,
      ...(parsed.shortcutMap ?? {}),
    };
    nextSettings.contrast = Math.min(130, Math.max(80, Math.round(nextSettings.contrast)));

    if (!nextSettings.audio || typeof nextSettings.audio !== 'object') {
      nextSettings.audio = { ...defaultAudioSettings };
    } else {
      nextSettings.audio = { ...defaultAudioSettings, ...nextSettings.audio };
    }

    if (!nextSettings.animation || typeof nextSettings.animation !== 'object') {
      nextSettings.animation = { ...defaultSettings.animation };
    } else {
      nextSettings.animation = { ...defaultSettings.animation, ...nextSettings.animation };
    }
    if (typeof nextSettings.animation.speed !== 'number' || Number.isNaN(nextSettings.animation.speed)) {
      nextSettings.animation.speed = defaultSettings.animation.speed;
    }
    nextSettings.animation.speed = Math.min(200, Math.max(20, Math.round(nextSettings.animation.speed)));

    // If custom audio flags are true but data URLs were stripped by storage cleanup, reset them
    if (nextSettings.audio.useCustomSfx && !nextSettings.audio.customSfxDataUrl) {
      nextSettings.audio.useCustomSfx = false;
    }
    if (nextSettings.audio.useCustomMusic && !nextSettings.audio.customMusicDataUrl) {
      nextSettings.audio.useCustomMusic = false;
    }

    if (!nextSettings.performance || typeof nextSettings.performance !== 'object') {
      nextSettings.performance = { ...defaultSettings.performance };
    } else {
      nextSettings.performance = { ...defaultSettings.performance, ...nextSettings.performance };
    }

    if (!nextSettings.others || typeof nextSettings.others !== 'object') {
      nextSettings.others = { ...defaultSettings.others };
    } else {
      nextSettings.others = { ...defaultSettings.others, ...nextSettings.others };
    }

    if (!Array.isArray(nextSettings.savedPresets) || nextSettings.savedPresets.length !== 2) {
      nextSettings.savedPresets = [null, null];
    }

    if (typeof nextSettings.borderWidth !== 'number' || Number.isNaN(nextSettings.borderWidth)) {
      nextSettings.borderWidth = defaultSettings.borderWidth;
    }
    nextSettings.borderWidth = Math.min(4, Math.max(1, Math.round(nextSettings.borderWidth)));

    // API channels fallback
    if (typeof nextSettings.apiBaseUrl !== 'string') nextSettings.apiBaseUrl = '';
    if (typeof nextSettings.apiKey !== 'string') nextSettings.apiKey = '';
    if (typeof nextSettings.apiBaseUrl2 !== 'string') nextSettings.apiBaseUrl2 = '';
    if (typeof nextSettings.apiKey2 !== 'string') nextSettings.apiKey2 = '';
    if (typeof nextSettings.apiBaseUrl3 !== 'string') nextSettings.apiBaseUrl3 = '';
    if (typeof nextSettings.apiKey3 !== 'string') nextSettings.apiKey3 = '';

    updateAudioSettings(nextSettings.audio);
    return nextSettings;
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return defaultSettings;
  }
}

function App() {
  const [settings, setSettings] = useState<SettingsState>(() => loadInitialSettings());
  const [screen, setScreen] = useState<FeatureScreen>('home');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsInitialTab, setSettingsInitialTab] = useState<SettingsTab>('style');
  const [modalStep, setModalStep] = useState<StartModalStep>(null);

  useEffect(() => {
    initAudio();
  }, []);

  // Keep UI preferences local-only so the shell behaves like a desktop-style tool launcher.
  useEffect(() => {
    try {
      // Strip large data URLs before saving to avoid localStorage quota crash
      const stripped = {
        ...settings,
        audio: {
          ...settings.audio,
          customSfxDataUrl: null,
          customMusicDataUrl: null,
        },
      };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stripped));
    } catch {
      // Silently ignore quota errors; user can still use the app in this session
    }
  }, [settings]);

  // Global delegated click sound for ALL interactive elements
  useEffect(() => {
    if (!settings.audio.sfxEnabled || !settings.audio.soundOnInteract) {
      return;
    }
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const el = target.closest('button, a, [role="button"], .choice-chip, .palette-chip, .asset-card, .tool-dot, .workflow-entry-button, .toolbar-button, .toggle-chip, .settings-tab, .modal-close, .link-list a, .back-link, .action-tile, .primary-button, .secondary-button, input[type="checkbox"], input[type="radio"], input[type="range"], input[type="file"], select, .announcement-entry, .modal-backdrop, .modal-overlay');
      if (!el) return;

      // Skip elements that have their own explicit sound handling (avoids double-play)
      if (el.classList.contains('collapsible-toggle') || el.classList.contains('toolbar-group-header')) return;

      // Determine appropriate sound based on element type and context
      const isBackdrop = el.classList.contains('modal-backdrop') || el.classList.contains('modal-overlay');
      const isClose = el.classList.contains('modal-close') || (el as HTMLElement).getAttribute('aria-label') === 'Close';
      const isBack = el.classList.contains('back-link') || (el as HTMLElement).textContent?.includes('返回');
      const isConfirm = el.classList.contains('primary-button');
      const isSlider = el.tagName === 'INPUT' && (el as HTMLInputElement).type === 'range';
      const isCheckbox = el.tagName === 'INPUT' && (el as HTMLInputElement).type === 'checkbox';

      // Chip logic: determine if this is a toggle-style (2-option) or select-style chip
      const isChip = el.classList.contains('choice-chip') || el.classList.contains('palette-chip');
      const chipWasActive = el.classList.contains('active');
      const chipRow = el.closest('.chip-row');
      const chipRowButtons = chipRow ? chipRow.querySelectorAll('button').length : 0;
      const isToggleChip = isChip && chipRowButtons === 2;

      if (isClose || isBackdrop) {
        playSound('modalClose');
      } else if (isSlider) {
        playSound('sliderChange');
      } else if (isCheckbox) {
        const cb = el as HTMLInputElement;
        playSound(cb.checked ? 'toggleOn' : 'toggleOff');
      } else if (isBack) {
        playSound('back');
      } else if (isConfirm) {
        playSound('confirm');
      } else if (isToggleChip) {
        playSound(chipWasActive ? 'toggleOff' : 'toggleOn');
      } else if (isChip) {
        playSound(chipWasActive ? 'deselect' : 'select');
      } else {
        playSound('buttonClick');
      }
    };
    // Use capture phase so that modal stopPropagation() does not block sound events
    document.addEventListener('click', handler, true);
    return () => document.removeEventListener('click', handler, true);
  }, [settings.audio.sfxEnabled, settings.audio.soundOnInteract]);

  const messages = localizedMessages[settings.language];
  const effectivePreset = settings.stylePreset;
  const effectiveDepth: ThemeDepth = effectivePreset === 'paper2gal' ? 'light' : settings.depth;
  const effectiveAccent: AccentPalette = effectivePreset === 'paper2gal' ? 'rose' : settings.accent;
  const effectiveApiEndpoint = getEffectiveApiBase(settings);
  const apiEndpointIssue = detectWorkflowApiBaseIssue(effectiveApiEndpoint);
  const customAccentHex = /^#[0-9a-fA-F]{6}$/.test(settings.customAccentColor)
    ? settings.customAccentColor
    : defaultSettings.customAccentColor;
  const customAccentRgb = hexToRgb(customAccentHex);

  const appClassName = [
    'app-shell',
    `preset-${effectivePreset}`,
    `depth-${effectiveDepth}`,
    `accent-${effectiveAccent}`,
    `font-${settings.fontPreset}`,
    settings.performance.reduceAnimations ? 'perf-no-anim' : '',
    settings.performance.disableGlassmorphism ? 'perf-no-glass' : '',
    settings.performance.devMode ? 'perf-dev-mode' : '',
    settings.performance.lowResolutionPreviews ? 'perf-low-res' : '',
  ].filter(Boolean).join(' ');
  const appStyle = {
    ['--ui-contrast' as string]: `${settings.contrast}%`,
    ['--border-width' as string]: `${settings.borderWidth}px`,
    ['--animation-speed' as string]: `${settings.animation.speed / 100}`,
    ...(settings.fontPreset === 'custom' && settings.customFontFamily
      ? ({ ['--custom-font-family' as string]: settings.customFontFamily } as CSSProperties)
      : {}),
    ...(effectiveAccent === 'custom'
      ? ({
          ['--accent-solid' as string]: customAccentHex,
          ['--accent-rgb' as string]: customAccentRgb,
        } as CSSProperties)
      : {}),
  } as CSSProperties;

  function updateSettings(patch: Partial<SettingsState>) {
    setSettings((current) => ({ ...current, ...patch }));
    if ('audio' in patch && patch.audio) {
      updateAudioSettings(patch.audio);
    }
  }

  function navigateTo(nextScreen: Exclude<FeatureScreen, 'home'>) {
    playSound('pageSwitch');
    setScreen(nextScreen);
    setModalStep(null);
  }

  function openSettings(tab: SettingsTab = 'style') {
    playSound('modalOpen');
    setSettingsInitialTab(tab);
    setIsSettingsOpen(true);
  }

  const sharedPageProps = {
    appSubtitle: messages.appSubtitle,
    backHome: messages.backHome,
    openSettings: messages.openSettings,
    privacyNote: messages.privacyNote,
    settings,
    language: settings.language,
    onBack: () => setScreen('home'),
    onOpenSettings: () => openSettings('style'),
  };

  return (
    <div className={appClassName} style={appStyle}>
      <div className="app-background">
        <div className="orb orb-left" />
        <div className="orb orb-right" />
        <div className="grid-layer" />
      </div>

      {screen === 'home' ? (
        <HomeScreen
          messages={messages}
          onNavigate={navigateTo}
          onOpenSettings={() => openSettings('style')}
          onOpenAnnouncementArchive={() => openSettings('announcement')}
          onOpenStart={() => { playSound('modalOpen'); setModalStep('root'); }}
        />
      ) : screen === 'face-maker' ? (
        <FaceMakerPage
          messages={messages}
          language={settings.language}
          onBack={() => setScreen('home')}
          onOpenSettings={() => openSettings('style')}
        />
      ) : screen === 'style-transfer' ? (
        <StyleTransferPage
          {...sharedPageProps}
          pageTitle={messages.pageStyleTitle}
          pageDescription={messages.pageStyleDescription}
        />
      ) : screen === 'prompt-suite' ? (
        <PromptSuitePage
          {...sharedPageProps}
          pageTitle={messages.pagePromptTitle}
          pageDescription={messages.pagePromptDescription}
        />
      ) : screen === 'llm-hub' ? (
        <LlmHubPage
          {...sharedPageProps}
          pageTitle={messages.pageLlmTitle}
          pageDescription={messages.pageLlmDescription}
        />
      ) : screen === 'tts-export' ? (
        <TtsExportPage
          {...sharedPageProps}
          pageTitle={messages.pageTtsTitle}
          pageDescription={messages.pageTtsDescription}
        />
      ) : screen === 'paper2gal' ? (
        <Paper2GalPage
          {...sharedPageProps}
          pageTitle={messages.pagePaperTitle}
          pageDescription={messages.pagePaperDescription}
        />
      ) : screen === 'image-converter' ? (
        <ImageConverterPage
          {...sharedPageProps}
          pageTitle={messages.pageImageConverterTitle}
          pageDescription={messages.pageImageConverterDescription}
        />
      ) : (
        <FeaturePage
          screen={screen}
          messages={messages}
          language={settings.language}
          onBack={() => setScreen('home')}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />
      )}

      {modalStep && (
        <StartModal
          messages={messages}
          onClose={() => setModalStep(null)}
          onSelect={navigateTo}
        />
      )}

      {isSettingsOpen && (
        <SettingsModal
          initialTab={settingsInitialTab}
          messages={messages}
          settings={settings}
          effectiveApiEndpoint={effectiveApiEndpoint}
          apiEndpointIssue={apiEndpointIssue}
          onClose={() => setIsSettingsOpen(false)}
          onUpdate={updateSettings}
        />
      )}

      {settings.performance.devMode && (
        <DevModePanel
          version={VERSION}
          settings={settings}
          effectiveApiEndpoint={effectiveApiEndpoint}
          screen={screen}
        />
      )}
    </div>
  );
}

function HomeScreen({
  messages,
  onNavigate,
  onOpenSettings,
  onOpenAnnouncementArchive,
  onOpenStart,
}: {
  messages: Messages;
  onNavigate: (screen: Exclude<FeatureScreen, 'home'>) => void;
  onOpenSettings: () => void;
  onOpenAnnouncementArchive: () => void;
  onOpenStart: () => void;
}) {
  return (
    <main className="home-shell">
      <section className="top-banner fade-up delay-1">
        <div className="top-banner-copy">
          <h1>{messages.appTitle}</h1>
          <p className="banner-subtitle">{messages.appSubtitle}</p>
          <p className="banner-description">{messages.overviewDescription}</p>
        </div>
        <div className="top-banner-side">
          <div className="version-pill">
            <span>{messages.versionLabel}</span>
            <strong>{VERSION}</strong>
          </div>
        </div>
      </section>

      <section className="home-hero-card fade-up delay-2">
        <div className="home-hero-grid">
          <article className="home-hero-copy">
            <p className="section-label">{messages.announcementTitle}</p>
            <h2>{announcementHistory[0].version}</h2>
            <p className="announcement-summary">{announcementHistory[0].summary}</p>
            <ul className="home-announcement-list">
              {announcementHistory[0].details.slice(0, 3).map((detail, i) => (
                <li key={i}>{detail}</li>
              ))}
            </ul>
            <div className="workflow-actions home-announcement-actions">
              <button className="secondary-button" type="button" onClick={onOpenAnnouncementArchive}>
                {messages.announcementHistoryButton}
              </button>
            </div>
          </article>

          <article className="home-hero-workflow">
            <h3>{messages.workflowTitle}</h3>
            <p>{messages.workflowDescription}</p>

            <div className="workflow-list horizontal">
              <button className="workflow-item compact workflow-entry-button" type="button" onClick={() => onNavigate('face-maker')}>
                <ActionIcon kind="face-maker" />
                <span>{messages.featureFace}</span>
              </button>
              <button className="workflow-item compact workflow-entry-button" type="button" onClick={() => onNavigate('style-transfer')}>
                <ActionIcon kind="style-transfer" />
                <span>{messages.featureStyle}</span>
              </button>
              <button className="workflow-item compact workflow-entry-button" type="button" onClick={() => onNavigate('prompt-suite')}>
                <ActionIcon kind="prompt-suite" />
                <span>{messages.featurePrompt}</span>
              </button>
              <button className="workflow-item compact workflow-entry-button" type="button" onClick={() => onNavigate('llm-hub')}>
                <ActionIcon kind="llm-hub" />
                <span>{messages.featureLlm}</span>
              </button>
              <button className="workflow-item compact workflow-entry-button" type="button" onClick={() => onNavigate('tts-export')}>
                <ActionIcon kind="tts-export" />
                <span>{messages.featureTts}</span>
              </button>
              <button className="workflow-item compact workflow-entry-button" type="button" onClick={() => onNavigate('paper2gal')}>
                <ActionIcon kind="paper2gal" />
                <span>{messages.featurePaper}</span>
              </button>
              <button className="workflow-item compact workflow-entry-button" type="button" onClick={() => onNavigate('image-converter')}>
                <ActionIcon kind="image-converter" />
                <span>{messages.featureImageConverter}</span>
              </button>
            </div>

            <div className="workflow-actions">
              <button className="primary-button giant-button workflow-action-button" type="button" onClick={onOpenStart}>
                {messages.startButton}
              </button>
              <button className="secondary-button giant-button workflow-action-button" type="button" onClick={onOpenSettings}>
                {messages.settingsButton}
              </button>
            </div>

            <p className="workflow-subhint">{messages.workflowHint}</p>
          </article>
        </div>
      </section>

      <footer className="home-footer fade-up delay-4">
        <div className="notice-banner">{messages.privacyNote}</div>
        <p>{messages.footerNote}</p>
      </footer>
    </main>
  );
}

type FaceMakerCopy = {
  saved: string;
  unsaved: string;
  unsavedWarning: string;
  savedWarning: string;
  reset: string;
  refreshWorkspaceTitle: string;
  refreshWorkspaceDescription: string;
  refreshWorkspaceConfirm: string;
  saveDraft: string;
  export: string;
  workboard: string;
  assetHairTitle: string;
  assetEyesTitle: string;
  assetAccessoryTitle: string;
  paramsTitle: string;
  projectStatusTitle: string;
  headScale: string;
  eyeScale: string;
  mouthCurve: string;
  tilt: string;
  currentHair: string;
  currentEyes: string;
  currentAccessory: string;
  continueEdit: string;
  confirmReturn: string;
  confirmTitle: string;
  confirmDirty: string;
  confirmClean: string;
};

const faceMakerCopy: Record<BaseLanguage, FaceMakerCopy> = {
  zh: {
    saved: '已保存',
    unsaved: '未保存',
    unsavedWarning: '你还没保存',
    savedWarning: '当前内容已保存',
    reset: '重刷',
    refreshWorkspaceTitle: '确定重刷当前捏脸页面吗？',
    refreshWorkspaceDescription: '这会清空当前捏脸参数和暂存状态，让页面回到最初默认值。',
    refreshWorkspaceConfirm: '确认重刷',
    saveDraft: '保存草稿',
    export: '导出',
    workboard: '工作画板',
    assetHairTitle: '发型资产',
    assetEyesTitle: '眼型资产',
    assetAccessoryTitle: '配件资产',
    paramsTitle: '参数调整',
    projectStatusTitle: '项目状态',
    headScale: '头部比例',
    eyeScale: '眼睛大小',
    mouthCurve: '嘴角弧度',
    tilt: '整体倾角',
    currentHair: '当前发型',
    currentEyes: '当前眼型',
    currentAccessory: '当前配件',
    continueEdit: '继续编辑',
    confirmReturn: '确认返回',
    confirmTitle: '确定返回首页吗？',
    confirmDirty: '你还没保存当前捏脸项目，返回后未保存的调整不会保留。',
    confirmClean: '当前内容已经保存，返回首页后可以稍后再继续编辑。',
  },
  ja: {
    saved: '保存済み',
    unsaved: '未保存',
    unsavedWarning: 'まだ保存していません',
    savedWarning: '現在の内容は保存済みです',
    reset: '再初期化',
    refreshWorkspaceTitle: '現在の顔メイクページをリセットしますか？',
    refreshWorkspaceDescription: '現在の顔メイク設定と一時状態を消去して、初期値へ戻します。',
    refreshWorkspaceConfirm: 'リセットする',
    saveDraft: '下書きを保存',
    export: '書き出し',
    workboard: '作業ボード',
    assetHairTitle: '髪型アセット',
    assetEyesTitle: '目元アセット',
    assetAccessoryTitle: 'アクセサリー',
    paramsTitle: 'パラメータ調整',
    projectStatusTitle: 'プロジェクト状態',
    headScale: '頭部比率',
    eyeScale: '目の大きさ',
    mouthCurve: '口元カーブ',
    tilt: '全体の傾き',
    currentHair: '現在の髪型',
    currentEyes: '現在の目元',
    currentAccessory: '現在のアクセサリー',
    continueEdit: '編集を続ける',
    confirmReturn: '戻る',
    confirmTitle: 'ホームへ戻りますか？',
    confirmDirty: '現在の捏脸プロジェクトはまだ保存されていません。戻ると未保存の調整は失われます。',
    confirmClean: '現在の内容は保存済みです。ホームへ戻って後で続けられます。',
  },
  en: {
    saved: 'Saved',
    unsaved: 'Unsaved',
    unsavedWarning: 'Unsaved changes',
    savedWarning: 'Everything is saved',
    reset: 'Refresh',
    refreshWorkspaceTitle: 'Reset the current face-maker page?',
    refreshWorkspaceDescription: 'This clears the current face-maker parameters and temporary state so the page goes back to its default values.',
    refreshWorkspaceConfirm: 'Reset now',
    saveDraft: 'Save draft',
    export: 'Export',
    workboard: 'Workbench',
    assetHairTitle: 'Hair assets',
    assetEyesTitle: 'Eye assets',
    assetAccessoryTitle: 'Accessories',
    paramsTitle: 'Adjustments',
    projectStatusTitle: 'Project status',
    headScale: 'Head scale',
    eyeScale: 'Eye size',
    mouthCurve: 'Mouth curve',
    tilt: 'Overall tilt',
    currentHair: 'Current hair',
    currentEyes: 'Current eyes',
    currentAccessory: 'Current accessory',
    continueEdit: 'Keep editing',
    confirmReturn: 'Return',
    confirmTitle: 'Return to the homepage?',
    confirmDirty: 'This face-maker draft still has unsaved changes. Returning now will discard them.',
    confirmClean: 'The current face-maker draft is already saved. You can safely come back later.',
  },
  ru: {
    saved: 'Сохранено',
    unsaved: 'Не сохранено',
    unsavedWarning: 'Есть несохранённые изменения',
    savedWarning: 'Текущий черновик сохранён',
    reset: 'Сбросить страницу',
    refreshWorkspaceTitle: 'Сбросить текущую страницу face-maker?',
    refreshWorkspaceDescription: 'Это очистит текущие параметры face-maker и временное состояние, вернув страницу к значениям по умолчанию.',
    refreshWorkspaceConfirm: 'Сбросить сейчас',
    saveDraft: 'Сохранить черновик',
    export: 'Экспорт',
    workboard: 'Рабочее поле',
    assetHairTitle: 'Ассеты волос',
    assetEyesTitle: 'Ассеты глаз',
    assetAccessoryTitle: 'Аксессуары',
    paramsTitle: 'Параметры',
    projectStatusTitle: 'Состояние проекта',
    headScale: 'Размер головы',
    eyeScale: 'Размер глаз',
    mouthCurve: 'Изгиб рта',
    tilt: 'Общий наклон',
    currentHair: 'Текущая причёска',
    currentEyes: 'Текущие глаза',
    currentAccessory: 'Текущий аксессуар',
    continueEdit: 'Продолжить редактирование',
    confirmReturn: 'Вернуться',
    confirmTitle: 'Вернуться на главную?',
    confirmDirty: 'Текущий проект face-maker ещё не сохранён. Если вернуться сейчас, правки будут потеряны.',
    confirmClean: 'Текущий черновик уже сохранён. Можно безопасно вернуться и продолжить позже.',
  },
};

const localizedFaceMakerCopy: Record<AppLanguage, FaceMakerCopy> = {
  zh: faceMakerCopy.zh,
  ja: faceMakerCopy.ja,
  en: faceMakerCopy.en,
  ru: faceMakerCopy.ru,
  ko: faceMakerCopy.en,
  fr: faceMakerCopy.en,
  de: faceMakerCopy.en,
  es: faceMakerCopy.en,
  it: faceMakerCopy.en,
  pt: faceMakerCopy.en,
  cs: faceMakerCopy.en,
  da: faceMakerCopy.en,
  nl: faceMakerCopy.en,
  el: faceMakerCopy.en,
  hi: faceMakerCopy.en,
  hu: faceMakerCopy.en,
  id: faceMakerCopy.en,
  no: faceMakerCopy.en,
  pl: faceMakerCopy.en,
  ro: faceMakerCopy.en,
  sk: faceMakerCopy.en,
  sv: faceMakerCopy.en,
  th: faceMakerCopy.en,
  tr: faceMakerCopy.en,
  uk: faceMakerCopy.ru,
  vi: faceMakerCopy.en,
  ms: faceMakerCopy.en,
  fi: faceMakerCopy.en,
  bg: faceMakerCopy.ru,
  lt: faceMakerCopy.en,
};

function FaceMakerPage({
  messages,
  language,
  onBack,
  onOpenSettings,
}: {
  messages: Messages;
  language: AppLanguage;
  onBack: () => void;
  onOpenSettings: () => void;
}) {
  const copy = localizedFaceMakerCopy[language];
  const initialDraft = {
    hair: 'air-bob',
    eyes: 'soft-round',
    accessory: 'none',
    headScale: 52,
    eyeScale: 48,
    mouthCurve: 56,
    tilt: 0,
  };

  const [draft, setDraft] = useState(initialDraft);
  const [savedSnapshot, setSavedSnapshot] = useState(JSON.stringify(initialDraft));
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isResetOpen, setIsResetOpen] = useState(false);
  const isDirty = JSON.stringify(draft) !== savedSnapshot;

  useEffect(() => {
    if (!isDirty) return;

    function handleBeforeUnload(event: BeforeUnloadEvent) {
      event.preventDefault();
      event.returnValue = '';
    }

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const assetGroups = [
    {
      title: copy.assetHairTitle,
      key: 'hair' as const,
      items: [
        { value: 'air-bob', label: '空气波波' },
        { value: 'long-straight', label: '直长发' },
        { value: 'twin-tail', label: '双马尾' },
        { value: 'wolf-cut', label: '狼尾层次' },
      ],
    },
    {
      title: copy.assetEyesTitle,
      key: 'eyes' as const,
      items: [
        { value: 'soft-round', label: '圆润眼' },
        { value: 'sharp', label: '上挑眼' },
        { value: 'sleepy', label: '慵懒眼' },
        { value: 'idol', label: '偶像眼' },
      ],
    },
    {
      title: copy.assetAccessoryTitle,
      key: 'accessory' as const,
      items: [
        { value: 'none', label: '无配件' },
        { value: 'glasses', label: '眼镜' },
        { value: 'ribbon', label: '发饰' },
        { value: 'scar', label: '伤痕' },
      ],
    },
  ];

  function updateDraft<K extends keyof typeof draft>(key: K, value: (typeof draft)[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function saveDraft() {
    setSavedSnapshot(JSON.stringify(draft));
  }

  function resetDraft() {
    setDraft(initialDraft);
    setSavedSnapshot(JSON.stringify(initialDraft));
    setIsResetOpen(false);
  }

  function confirmBack() {
    setIsConfirmOpen(true);
  }

  const headScale = draft.headScale / 100;
  const eyeScale = draft.eyeScale / 50;
  const mouthCurve = (draft.mouthCurve - 50) / 10;

  return (
    <main className="feature-shell face-editor-shell">
      <header className="feature-header fade-up delay-1">
        <button className="secondary-button small-button" type="button" onClick={confirmBack}>
          {messages.backHome}
        </button>
        <div className="feature-header-meta">
          <button className="secondary-button small-button" type="button" onClick={onOpenSettings}>
            {messages.openSettings}
          </button>
        </div>
      </header>

      <section className="editor-workbench fade-up delay-2">
        <div className="editor-toolbar">
          <div className="editor-toolbar-copy">
            <p className="section-label">{messages.appSubtitle}</p>
            <h2>{messages.pageFaceTitle}</h2>
          </div>
          <div className="editor-toolbar-actions">
            <span className={`save-indicator ${isDirty ? 'dirty' : 'clean'}`}>{isDirty ? copy.unsavedWarning : copy.savedWarning}</span>
            <button className="secondary-button small-button" type="button" onClick={() => setIsResetOpen(true)}>
              {copy.reset}
            </button>
            <button className="secondary-button small-button" type="button" onClick={saveDraft}>
              {copy.saveDraft}
            </button>
            <button className="primary-button small-button" type="button">
              {copy.export}
            </button>
          </div>
        </div>

        <div className="editor-layout">
          <aside className="editor-side editor-assets">
            {assetGroups.map((group) => (
              <section key={group.title} className="editor-panel-block">
                <h3>{group.title}</h3>
                <div className="asset-grid">
                  {group.items.map((item) => (
                    <button
                      key={item.value}
                      className={`asset-card ${draft[group.key] === item.value ? 'active' : ''}`}
                      type="button"
                      onClick={() => updateDraft(group.key, item.value)}
                    >
                      <span className="asset-thumb" />
                      <strong>{item.label}</strong>
                    </button>
                  ))}
                </div>
              </section>
            ))}
          </aside>

          <section className="editor-stage-shell">
            <div className="stage-toolbar">
              <span>{copy.workboard}</span>
              <div className="stage-toolbar-actions">
                <button className="tool-dot active" type="button" aria-label="Preview mode" />
                <button className="tool-dot" type="button" aria-label="Reference mode" />
                <button className="tool-dot" type="button" aria-label="Overlay mode" />
              </div>
            </div>
            <div className="editor-stage">
              <div className="checkerboard-layer" />
              <div className="character-stage" style={{ transform: `rotate(${draft.tilt}deg)` }}>
                <div className={`hair-shape ${draft.hair}`} />
                <div className="head-shape" style={{ transform: `scale(${headScale})` }}>
                  <div className={`eye-pair ${draft.eyes}`} style={{ transform: `scale(${eyeScale})` }}>
                    <span />
                    <span />
                  </div>
                  <div className="mouth-line" style={{ borderRadius: `${8 + mouthCurve * 2}px` }} />
                </div>
                {draft.accessory !== 'none' && <div className={`accessory-chip ${draft.accessory}`} />}
              </div>
            </div>
          </section>

          <aside className="editor-side editor-controls">
            <section className="editor-panel-block">
              <h3>{copy.paramsTitle}</h3>
              <label className="slider-row">
                <span>{copy.headScale}</span>
                <input type="range" min="40" max="70" value={draft.headScale} onChange={(event) => updateDraft('headScale', Number(event.target.value))} />
              </label>
              <label className="slider-row">
                <span>{copy.eyeScale}</span>
                <input type="range" min="38" max="62" value={draft.eyeScale} onChange={(event) => updateDraft('eyeScale', Number(event.target.value))} />
              </label>
              <label className="slider-row">
                <span>{copy.mouthCurve}</span>
                <input type="range" min="40" max="64" value={draft.mouthCurve} onChange={(event) => updateDraft('mouthCurve', Number(event.target.value))} />
              </label>
              <label className="slider-row">
                <span>{copy.tilt}</span>
                <input type="range" min="-10" max="10" value={draft.tilt} onChange={(event) => updateDraft('tilt', Number(event.target.value))} />
              </label>
            </section>

            <section className="editor-panel-block">
              <h3>{copy.projectStatusTitle}</h3>
              <div className="status-stack">
                <div className="status-card-mini">
                  <strong>{draft.hair}</strong>
                  <span>{copy.currentHair}</span>
                </div>
                <div className="status-card-mini">
                  <strong>{draft.eyes}</strong>
                  <span>{copy.currentEyes}</span>
                </div>
                <div className="status-card-mini">
                  <strong>{draft.accessory}</strong>
                  <span>{copy.currentAccessory}</span>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </section>

      <footer className="face-editor-footer fade-up delay-3">
        <div className="notice-banner">{messages.privacyNote}</div>
      </footer>

      {isConfirmOpen && (
        <ConfirmReturnModal
          copy={copy}
          isDirty={isDirty}
          onCancel={() => setIsConfirmOpen(false)}
          onConfirm={onBack}
        />
      )}
      {isResetOpen ? (
        <ActionConfirmModal
          title={copy.refreshWorkspaceTitle}
          description={copy.refreshWorkspaceDescription}
          cancelLabel={copy.continueEdit}
          confirmLabel={copy.refreshWorkspaceConfirm}
          onCancel={() => setIsResetOpen(false)}
          onConfirm={resetDraft}
        />
      ) : null}
    </main>
  );
}

function ConfirmReturnModal({
  copy,
  isDirty,
  onCancel,
  onConfirm,
}: {
  copy: FaceMakerCopy;
  isDirty: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const [isClosing, setIsClosing] = useState(false);

  function requestClose() {
    setIsClosing(true);
    window.setTimeout(onCancel, MODAL_CLOSE_MS);
  }

  function confirmLeave() {
    setIsClosing(true);
    window.setTimeout(onConfirm, MODAL_CLOSE_MS);
  }

  if (typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <div className={`modal-backdrop ${isClosing ? 'closing' : 'opening'}`} role="presentation" onClick={requestClose}>
      <section className={`modal-card confirm-modal modal-surface ${isClosing ? 'closing' : 'opening'}`} role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
        <button className="modal-close" type="button" onClick={requestClose} aria-label="Close">
          ×
        </button>
        <p className="section-label">{copy.confirmTitle}</p>
        <h2>{copy.confirmTitle}</h2>
        <p className="modal-description">{isDirty ? copy.confirmDirty : copy.confirmClean}</p>
        <div className="confirm-actions">
          <button className="secondary-button" type="button" onClick={requestClose}>
            {copy.continueEdit}
          </button>
          <button className="primary-button" type="button" onClick={confirmLeave}>
            {copy.confirmReturn}
          </button>
        </div>
      </section>
    </div>,
    document.body,
  );
}

function ActionConfirmModal({
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
    window.setTimeout(onCancel, MODAL_CLOSE_MS);
  }

  function requestConfirm() {
    setIsClosing(true);
    window.setTimeout(onConfirm, MODAL_CLOSE_MS);
  }

  if (typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <div className={`modal-backdrop ${isClosing ? 'closing' : 'opening'}`} role="presentation" onClick={requestClose}>
      <section className={`modal-card confirm-modal modal-surface ${isClosing ? 'closing' : 'opening'}`} role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
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

function FeaturePage({
  screen,
  messages,
  language,
  onBack,
  onOpenSettings,
}: {
  screen: Exclude<FeatureScreen, 'home'>;
  messages: Messages;
  language: AppLanguage;
  onBack: () => void;
  onOpenSettings: () => void;
}) {
  const details = getFeatureDetails(screen, messages);

  return (
    <main className="feature-shell">
      <header className="feature-header fade-up delay-1">
        <button className="secondary-button small-button" type="button" onClick={onBack}>
          {messages.backHome}
        </button>
        <div className="feature-header-meta">
          <span>{messages.comingSoon}</span>
          <button className="secondary-button small-button" type="button" onClick={onOpenSettings}>
            {messages.openSettings}
          </button>
        </div>
      </header>

      <section className="feature-main">
        <div className="feature-intro-card fade-up delay-2">
          <p className="section-label">{messages.appSubtitle}</p>
          <h2>{details.title}</h2>
          <p>{details.description}</p>
          <div className="language-badge">{language.toUpperCase()}</div>
        </div>

        <div className="feature-layout-card fade-up delay-3">
          <div className="feature-layout-grid">
            <div className="layout-column workspace-column">
              <div className="layout-card tall-card">
                <span>{messages.moduleCanvas}</span>
                <strong>{details.workspaceTitle}</strong>
              </div>
            </div>
            <div className="layout-column side-column">
              <div className="layout-card">
                <span>{messages.modulePanel}</span>
                <strong>{details.panelTitle}</strong>
              </div>
              <div className="layout-card">
                <span>{messages.modulePipeline}</span>
                <strong>{details.pipelineTitle}</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="feature-bottom-grid">
        <article className="info-panel fade-up delay-4">
          <h3>{messages.preparedModules}</h3>
          <ul>
            <li>{messages.placeholderCanvas}</li>
            <li>{messages.placeholderSettings}</li>
            <li>{messages.moduleStorage}</li>
          </ul>
        </article>

        <article className="info-panel fade-up delay-5">
          <h3>{messages.placeholderTodo}</h3>
          <ul>
            <li>{messages.placeholderPipeline}</li>
            <li>{details.todoOne}</li>
            <li>{details.todoTwo}</li>
          </ul>
        </article>
      </section>

      <p className="feature-hint fade-up delay-6">{messages.privacyNote}</p>
    </main>
  );
}

function ActionIcon({
  kind,
}: {
  kind: 'face-maker' | 'style-transfer' | 'prompt-suite' | 'llm-hub' | 'tts-export' | 'paper2gal' | 'image-converter';
}) {
  const paths = {
    'face-maker': (
      <>
        <circle cx="20" cy="15" r="6" />
        <path d="M11 30c0-5 4-9 9-9s9 4 9 9" />
        <path d="M8 19c2 9 6 14 12 14s10-5 12-14" />
      </>
    ),
    'style-transfer': (
      <>
        <path d="M10 27c0-8 5-14 12-14 4 0 7 2 9 5" />
        <path d="M22 10h10v10" />
        <path d="M32 10 20 22" />
        <path d="M10 30h20" />
      </>
    ),
    'prompt-suite': (
      <>
        <path d="M10 10h20v14H18l-6 6v-6h-2z" />
        <path d="M15 16h10" />
        <path d="M15 20h7" />
      </>
    ),
    'llm-hub': (
      <>
        <rect x="8" y="8" width="24" height="24" rx="3" />
        <path d="M14 20h12" />
        <path d="M14 16h8" />
        <path d="M14 24h10" />
        <circle cx="28" cy="14" r="2" fill="currentColor" stroke="none" />
      </>
    ),
    'tts-export': (
      <>
        <path d="M20 8v10" />
        <path d="M14 14a6 6 0 0 0 12 0" />
        <path d="M24 22v4a4 4 0 0 1-8 0v-4" />
        <rect x="18" y="26" width="4" height="6" rx="1" />
      </>
    ),
    paper2gal: (
      <>
        <rect x="9" y="10" width="22" height="20" rx="4" />
        <circle cx="16" cy="17" r="2.5" />
        <path d="m13 27 5-5 4 4 4-6 4 7" />
      </>
    ),
    'image-converter': (
      <>
        <rect x="8" y="10" width="24" height="20" rx="3" />
        <path d="M8 26 16 18 22 24 28 16" />
        <circle cx="24" cy="14" r="2.5" />
        <path d="M18 30h4" />
      </>
    ),
  } as const;

  return (
    <span className="action-icon-wrap fade-up">
      <svg className="action-icon" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {paths[kind]}
      </svg>
    </span>
  );
}

function StartModal({
  messages,
  onClose,
  onSelect,
}: {
  messages: Messages;
  onClose: () => void;
  onSelect: (screen: Exclude<FeatureScreen, 'home'>) => void;
}) {
  const [isClosing, setIsClosing] = useState(false);

  function requestClose() {
    setIsClosing(true);
    window.setTimeout(onClose, MODAL_CLOSE_MS);
  }

  return (
    <div className={`modal-backdrop ${isClosing ? 'closing' : 'opening'}`} role="presentation" onClick={requestClose}>
      <section className={`modal-card action-modal modal-surface ${isClosing ? 'closing' : 'opening'}`} role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
        <button className="modal-close" type="button" onClick={requestClose} aria-label="Close">
          ×
        </button>

        <p className="section-label">{messages.appSubtitle}</p>
        <h2>{messages.startModalTitle}</h2>
        <p className="modal-description">{messages.startModalDescription}</p>

        <div className="action-grid root-grid">
          <button className="action-tile" type="button" onClick={() => onSelect('face-maker')}>
            <ActionIcon kind="face-maker" />
            <strong>{messages.actionFace}</strong>
          </button>
          <button className="action-tile" type="button" onClick={() => onSelect('style-transfer')}>
            <ActionIcon kind="style-transfer" />
            <strong>{messages.actionStyle}</strong>
          </button>
          <button className="action-tile" type="button" onClick={() => onSelect('prompt-suite')}>
            <ActionIcon kind="prompt-suite" />
            <strong>{messages.actionPromptSuite}</strong>
          </button>
          <button className="action-tile" type="button" onClick={() => onSelect('llm-hub')}>
            <ActionIcon kind="llm-hub" />
            <strong>{messages.actionLlmHub}</strong>
          </button>
          <button className="action-tile" type="button" onClick={() => onSelect('tts-export')}>
            <ActionIcon kind="tts-export" />
            <strong>{messages.actionTtsExport}</strong>
          </button>
          <button className="action-tile" type="button" onClick={() => onSelect('paper2gal')}>
            <ActionIcon kind="paper2gal" />
            <strong>{messages.actionPaper2Gal}</strong>
          </button>
          <button className="action-tile" type="button" onClick={() => onSelect('image-converter')}>
            <ActionIcon kind="image-converter" />
            <strong>{messages.actionImageConverter}</strong>
          </button>
        </div>
      </section>
    </div>
  );
}

function SettingsModal({
  initialTab,
  messages,
  settings,
  effectiveApiEndpoint,
  apiEndpointIssue,
  onClose,
  onUpdate,
}: {
  initialTab: SettingsTab;
  messages: Messages;
  settings: SettingsState;
  effectiveApiEndpoint: string;
  apiEndpointIssue: ReturnType<typeof detectWorkflowApiBaseIssue>;
  onClose: () => void;
  onUpdate: (patch: Partial<SettingsState>) => void;
}) {
  const [tab, setTab] = useState<SettingsTab>(initialTab);
  const [isClosing, setIsClosing] = useState(false);
  const [selectedAnnouncementVersion, setSelectedAnnouncementVersion] = useState<
    (typeof announcementHistory)[number]['version']
  >(announcementHistory[0].version);
  const styleLocked = settings.stylePreset === 'paper2gal';
  const resolvedLanguage = translationAliases[settings.language];
  const customAccentHex = /^#[0-9a-fA-F]{6}$/.test(settings.customAccentColor)
    ? settings.customAccentColor
    : defaultSettings.customAccentColor;
  const presetEndpoint = getPresetApiBase(settings);
  const hostedApiRequired = requiresHostedApiBase(settings);

  const tabs: Array<{ key: SettingsTab; label: string }> = [
    { key: 'style', label: messages.tabStyle },
    { key: 'language', label: messages.tabLanguage },
    { key: 'audio', label: messages.tabAudio },
    { key: 'animation', label: messages.tabAnimation },
    { key: 'performance', label: messages.tabPerformance },
    { key: 'api', label: messages.tabApi },
    { key: 'shortcuts', label: messages.tabShortcuts },
    { key: 'others', label: messages.tabOthers },
    { key: 'announcement', label: messages.tabAnnouncement },
    { key: 'about', label: messages.tabAbout },
  ];

  const shortcutLabelsForLanguage = shortcutLabels[resolvedLanguage];
  const shortcutBuilderLabels = shortcutBuilderCopy[resolvedLanguage];
  const shortcutEntries = Object.entries(settings.shortcutMap) as Array<[ShortcutAction, string]>;
  const [shortcutBuilderAction, setShortcutBuilderAction] = useState<ShortcutAction>('saveDocument');
  const [shortcutBuilderValue, setShortcutBuilderValue] = useState('');

  // Confirm dialog state
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    message: string;
    step: 1 | 2;
    onConfirm: () => void;
  }>({ open: false, title: '', message: '', step: 1, onConfirm: () => {} });

  // Preset save dialog state
  const [presetDialog, setPresetDialog] = useState<{
    open: boolean;
    slot: 0 | 1;
    name: string;
  }>({ open: false, slot: 0, name: '' });

  const selectedAnnouncement =
    announcementHistory.find((item) => item.version === selectedAnnouncementVersion) ?? announcementHistory[0];

  useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);

  function requestClose() {
    setIsClosing(true);
    window.setTimeout(onClose, MODAL_CLOSE_MS);
  }

  function applyShortcutBuilderValue() {
    const nextValue = shortcutBuilderValue.trim();
    if (!nextValue) {
      return;
    }

    onUpdate({
      shortcutMap: {
        ...settings.shortcutMap,
        [shortcutBuilderAction]: nextValue,
      },
    });
  }

  function openConfirm(title: string, message: string, onConfirm: () => void) {
    setConfirmDialog({ open: true, title, message, step: 1, onConfirm });
  }

  function handleConfirmStep() {
    if (confirmDialog.step === 1) {
      const secondMessage =
        confirmDialog.title === messages.apiChannel1 ||
        confirmDialog.title === messages.apiChannel2 ||
        confirmDialog.title === messages.apiChannel3
          ? messages.apiConfirmClearAgain
          : confirmDialog.title.includes(messages.othersResetAll)
          ? messages.othersConfirmResetAgain
          : confirmDialog.title.includes(messages.styleResetDefaults)
          ? messages.othersConfirmRestoreAgain
          : messages.othersConfirmRestoreAgain;
      setConfirmDialog((d) => ({ ...d, step: 2, message: secondMessage }));
    } else {
      setConfirmDialog((d) => ({ ...d, open: false }));
      confirmDialog.onConfirm();
    }
  }

  function handleUploadAudio(type: 'sfx' | 'music', file: File) {
    if (!file.type.startsWith('audio/')) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      if (type === 'sfx') {
        onUpdate({
          audio: {
            ...settings.audio,
            useCustomSfx: true,
            customSfxDataUrl: dataUrl,
            customSfxName: file.name,
          },
        });
        import('./audioEngine').then((m) => m.setCustomSfx(dataUrl));
      } else {
        onUpdate({
          audio: {
            ...settings.audio,
            useCustomMusic: true,
            customMusicDataUrl: dataUrl,
            customMusicName: file.name,
          },
        });
        import('./audioEngine').then((m) => m.setCustomMusic(dataUrl));
      }
    };
    reader.readAsDataURL(file);
  }

  function handleRemoveCustomAudio(type: 'sfx' | 'music') {
    if (type === 'sfx') {
      onUpdate({
        audio: {
          ...settings.audio,
          useCustomSfx: false,
          customSfxDataUrl: null,
          customSfxName: '',
        },
      });
      import('./audioEngine').then((m) => m.setCustomSfx(null));
    } else {
      onUpdate({
        audio: {
          ...settings.audio,
          useCustomMusic: false,
          customMusicDataUrl: null,
          customMusicName: '',
        },
      });
      import('./audioEngine').then((m) => m.setCustomMusic(null));
    }
  }

  function savePresetSlot(slot: 0 | 1, name: string) {
    const preset: SavedStylePreset = {
      name: name || (slot === 0 ? messages.stylePreset1 : messages.stylePreset2),
      stylePreset: settings.stylePreset,
      depth: settings.depth,
      accent: settings.accent,
      customAccentColor: settings.customAccentColor,
      contrast: settings.contrast,
      borderWidth: settings.borderWidth,
      fontPreset: settings.fontPreset,
      customFontFamily: settings.customFontFamily,
    };
    const nextPresets: [SavedStylePreset | null, SavedStylePreset | null] = [...settings.savedPresets];
    nextPresets[slot] = preset;
    onUpdate({ savedPresets: nextPresets });
    setPresetDialog({ open: false, slot: 0, name: '' });
  }

  function loadPresetSlot(slot: 0 | 1) {
    const preset = settings.savedPresets[slot];
    if (!preset) return;
    onUpdate({
      stylePreset: preset.stylePreset,
      depth: preset.depth,
      accent: preset.accent,
      customAccentColor: preset.customAccentColor,
      contrast: preset.contrast,
      borderWidth: preset.borderWidth,
      fontPreset: preset.fontPreset,
      customFontFamily: preset.customFontFamily,
    });
  }

  function isPresetSameAsCurrent(slot: 0 | 1): boolean {
    const preset = settings.savedPresets[slot];
    if (!preset) return false;
    return (
      preset.stylePreset === settings.stylePreset &&
      preset.depth === settings.depth &&
      preset.accent === settings.accent &&
      preset.customAccentColor === settings.customAccentColor &&
      preset.contrast === settings.contrast &&
      preset.borderWidth === settings.borderWidth &&
      preset.fontPreset === settings.fontPreset &&
      preset.customFontFamily === settings.customFontFamily
    );
  }

  return (
    <div className={`modal-backdrop ${isClosing ? 'closing' : 'opening'}`} role="presentation" onClick={requestClose}>
      <section className={`modal-card settings-modal modal-surface ${isClosing ? 'closing' : 'opening'}`} role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
        <button className="modal-close" type="button" onClick={requestClose} aria-label="Close">
          ×
        </button>

        <h2 className="settings-title">{messages.settingsTitle}</h2>

        <div className="settings-layout">
          <aside className="settings-sidebar">
            {tabs.map((item) => (
              <button
                key={item.key}
                className={`settings-tab ${tab === item.key ? 'active' : ''}`}
                type="button"
                onClick={() => setTab(item.key)}
              >
                {item.label}
              </button>
            ))}
          </aside>

          <div className="settings-content">
            {tab === 'style' && (
              <>
                <section className="settings-section">
                  <h3>{messages.stylePresetTitle}</h3>
                  <div className="chip-row">
                    <button
                      className={`choice-chip ${settings.stylePreset === 'default' ? 'active' : ''}`}
                      type="button"
                      onClick={() => onUpdate({ stylePreset: 'default' })}
                    >
                      {messages.stylePresetDefault}
                    </button>
                    <button
                      className={`choice-chip ${settings.stylePreset === 'paper2gal' ? 'active' : ''}`}
                      type="button"
                      onClick={() => onUpdate({ stylePreset: 'paper2gal' })}
                    >
                      {messages.stylePresetPaper2Gal}
                    </button>
                    {settings.savedPresets.map((preset, slot) => (
                      preset && (
                        <button
                          key={slot}
                          className={`choice-chip ${settings.stylePreset === `preset${slot + 1}` as StylePreset ? 'active' : ''}`}
                          type="button"
                          onClick={() => loadPresetSlot(slot as 0 | 1)}
                        >
                          {preset.name}
                        </button>
                      )
                    ))}
                  </div>
                </section>

                <section className="settings-section">
                  <h3>{messages.themeModeTitle}</h3>
                  <div className="chip-row">
                    <button
                      className={`choice-chip ${settings.depth === 'light' ? 'active' : ''}`}
                      type="button"
                      disabled={styleLocked}
                      onClick={() => onUpdate({ depth: 'light' })}
                    >
                      {messages.themeLight}
                    </button>
                    <button
                      className={`choice-chip ${settings.depth === 'deep' ? 'active' : ''}`}
                      type="button"
                      disabled={styleLocked}
                      onClick={() => onUpdate({ depth: 'deep' })}
                    >
                      {messages.themeDeep}
                    </button>
                  </div>
                  <div className="contrast-control">
                    <div className="contrast-copy">
                      <strong>{messages.customContrastLabel}</strong>
                      <span>{messages.customContrastHint}</span>
                    </div>
                    <div className="contrast-slider-row">
                      <input
                        className="contrast-slider"
                        type="range"
                        min="80"
                        max="130"
                        step="1"
                        value={settings.contrast}
                        onChange={(event) => onUpdate({ contrast: Number(event.target.value) })}
                      />
                      <span className="contrast-value">{settings.contrast}%</span>
                    </div>
                  </div>
                </section>

                <section className="settings-section">
                  <h3>{messages.accentTitle}</h3>
                  <div className="palette-grid">
                    {paletteOptions.map((item) => (
                    <button
                      key={item.value}
                      className={`palette-chip ${settings.accent === item.value ? 'active' : ''}`}
                      type="button"
                      disabled={styleLocked}
                      onClick={() => onUpdate({ accent: item.value })}
                    >
                        <span className="palette-dot" style={{ backgroundColor: item.swatch }} />
                        {item.label[resolvedLanguage]}
                      </button>
                    ))}
                  </div>
                  {settings.accent === 'custom' && !styleLocked && (
                    <div className="custom-accent-shell">
                      <label className="custom-accent-row">
                        <input
                          className="custom-color-input"
                          type="color"
                          value={customAccentHex}
                          onChange={(event) => onUpdate({ customAccentColor: event.target.value })}
                        />
                        <input
                          className="settings-input"
                          type="text"
                          value={settings.customAccentColor}
                          placeholder="#7c5cff"
                          onChange={(event) => onUpdate({ customAccentColor: event.target.value })}
                          onBlur={() => {
                            if (!/^#[0-9a-fA-F]{6}$/.test(settings.customAccentColor)) {
                              onUpdate({ customAccentColor: customAccentHex });
                            }
                          }}
                        />
                      </label>
                      <p className="muted-copy">{messages.customAccentLabel}</p>
                    </div>
                  )}
                </section>

                <section className="settings-section">
                  <h3>{messages.fontTitle}</h3>
                  <div className="palette-grid">
                    {fontPresetOptions.map((item) => (
                      <button
                        key={item.value}
                        className={`palette-chip ${settings.fontPreset === item.value ? 'active' : ''}`}
                        type="button"
                        onClick={() => onUpdate({ fontPreset: item.value })}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                  {settings.fontPreset === 'custom' && (
                    <div className="custom-font-shell">
                      <input
                        className="settings-input"
                        type="text"
                        placeholder="输入页面字体名称，例如: LXGW WenKai"
                        value={settings.customFontFamily}
                        onChange={(event) => onUpdate({ customFontFamily: event.target.value })}
                      />
                    </div>
                  )}
                </section>

                {styleLocked && (
                  <section className="settings-section tip-section">
                    <h3>{messages.styleLockedTitle}</h3>
                    <p>{messages.styleLockedDescription}</p>
                  </section>
                )}

                <section className="settings-section">
                  <h3>{messages.styleSavePreset}</h3>
                  <div className="palette-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
                    {[0, 1].map((slot) => {
                      const preset = settings.savedPresets[slot];
                      const isSame = isPresetSameAsCurrent(slot as 0 | 1);
                      return (
                        <button
                          key={slot}
                          className="palette-chip"
                          type="button"
                          style={preset ? {} : { opacity: 0.5 }}
                          onClick={() => preset ? loadPresetSlot(slot as 0 | 1) : setPresetDialog({ open: true, slot: slot as 0 | 1, name: '' })}
                        >
                          {preset ? `${messages.stylePresetUse}: ${preset.name}` : (slot === 0 ? messages.stylePreset1 : messages.stylePreset2)}
                          {isSame && <span className="tiny-copy" style={{ marginLeft: 6 }}>✓</span>}
                        </button>
                      );
                    })}
                  </div>
                  <div className="tool-actions-row" style={{ marginTop: 8 }}>
                    <button className="secondary-button" type="button" onClick={() => setPresetDialog({ open: true, slot: 0, name: '' })}>{messages.styleSavePreset}</button>
                    <button className="secondary-button" type="button" onClick={() => openConfirm(messages.styleResetDefaults, messages.othersConfirmRestore, () => onUpdate({ stylePreset: defaultSettings.stylePreset, depth: defaultSettings.depth, accent: defaultSettings.accent, customAccentColor: defaultSettings.customAccentColor, contrast: defaultSettings.contrast, borderWidth: defaultSettings.borderWidth, fontPreset: defaultSettings.fontPreset, customFontFamily: defaultSettings.customFontFamily }))}>{messages.styleResetDefaults}</button>
                  </div>
                </section>
              </>
            )}

            {tab === 'language' && (
              <section className="settings-section">
                <h3>{messages.languageTitle}</h3>
                <div className="palette-grid">
                  {languageOptions.map((item) => (
                    <button
                      key={item.value}
                      className={`palette-chip ${settings.language === item.value ? 'active' : ''}`}
                      type="button"
                      onClick={() => onUpdate({ language: item.value })}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
                <p className="muted-copy" style={{ marginTop: 12 }}>{messages.othersLanguageMissing}</p>
              </section>
            )}

            {tab === 'audio' && (
              <>
                <section className="settings-section">
                  <h3>{messages.audioTitle}</h3>
                  <div className="contrast-control">
                    <div className="contrast-copy"><strong>{messages.audioMasterVolume}</strong></div>
                    <div className="contrast-slider-row">
                      <input className="contrast-slider" type="range" min="0" max="100" step="1" value={settings.audio.masterVolume} onChange={(e) => onUpdate({ audio: { ...settings.audio, masterVolume: Number(e.target.value) } })} />
                      <span className="contrast-value">{settings.audio.masterVolume}%</span>
                    </div>
                  </div>
                </section>

                <section className="settings-section">
                  <h3>{messages.audioSfxPreset}</h3>
                  <div className="palette-grid audio-preset-grid">
                    {SOUND_PRESETS.map((preset) => (
                      <button
                        key={preset}
                        className={`palette-chip ${settings.audio.sfxPreset === preset ? 'active' : ''}`}
                        type="button"
                        onClick={() => onUpdate({ audio: { ...settings.audio, sfxPreset: preset } })}
                      >
                        {messages[`preset${preset.charAt(0).toUpperCase() + preset.slice(1).replace(/-([a-z])/g, (_, c) => c.toUpperCase())}` as keyof Messages]}
                      </button>
                    ))}
                  </div>
                  <div className="chip-row" style={{ marginTop: 8 }}>
                    <button className={`choice-chip ${settings.audio.sfxEnabled ? 'active' : ''}`} type="button" onClick={() => onUpdate({ audio: { ...settings.audio, sfxEnabled: true } })}>{messages.toggleOn}</button>
                    <button className={`choice-chip ${!settings.audio.sfxEnabled ? 'active' : ''}`} type="button" onClick={() => onUpdate({ audio: { ...settings.audio, sfxEnabled: false } })}>{messages.toggleOff}</button>
                  </div>
                  <div className="chip-row" style={{ marginTop: 8 }}>
                    <button className={`choice-chip ${settings.audio.soundOnInteract ? 'active' : ''}`} type="button" onClick={() => onUpdate({ audio: { ...settings.audio, soundOnInteract: true } })}>{messages.audioSoundOnInteractOn}</button>
                    <button className={`choice-chip ${!settings.audio.soundOnInteract ? 'active' : ''}`} type="button" onClick={() => onUpdate({ audio: { ...settings.audio, soundOnInteract: false } })}>{messages.audioSoundOnInteractOff}</button>
                  </div>
                  <div className="contrast-slider-row" style={{ marginTop: 8 }}>
                    <input className="contrast-slider" type="range" min="0" max="100" step="1" value={settings.audio.sfxVolume} onChange={(e) => onUpdate({ audio: { ...settings.audio, sfxVolume: Number(e.target.value) } })} />
                    <span className="contrast-value">{settings.audio.sfxVolume}%</span>
                  </div>
                  <div style={{ marginTop: 16, display: 'grid', gap: 12 }}>
                    <div className="contrast-control">
                      <div className="contrast-copy"><strong>{messages.audioPitch}</strong><span>{settings.audio.sfxPitch > 0 ? '+' : ''}{settings.audio.sfxPitch} ct</span></div>
                      <div className="contrast-slider-row">
                        <input className="contrast-slider" type="range" min="-1200" max="1200" step="50" value={settings.audio.sfxPitch} onChange={(e) => onUpdate({ audio: { ...settings.audio, sfxPitch: Number(e.target.value) } })} />
                      </div>
                    </div>
                    <div className="contrast-control">
                      <div className="contrast-copy"><strong>{messages.audioDuration}</strong><span>{settings.audio.sfxDurationScale}%</span></div>
                      <div className="contrast-slider-row">
                        <input className="contrast-slider" type="range" min="50" max="200" step="5" value={settings.audio.sfxDurationScale} onChange={(e) => onUpdate({ audio: { ...settings.audio, sfxDurationScale: Number(e.target.value) } })} />
                      </div>
                    </div>
                    <div className="contrast-control">
                      <div className="contrast-copy"><strong>{messages.audioFilter}</strong><span>{settings.audio.sfxFilterFreq} Hz</span></div>
                      <div className="contrast-slider-row">
                        <input className="contrast-slider" type="range" min="100" max="10000" step="100" value={settings.audio.sfxFilterFreq} onChange={(e) => onUpdate({ audio: { ...settings.audio, sfxFilterFreq: Number(e.target.value) } })} />
                      </div>
                    </div>
                    <div className="contrast-control">
                      <div className="contrast-copy"><strong>{messages.audioDetune}</strong><span>{settings.audio.sfxDetune} ct</span></div>
                      <div className="contrast-slider-row">
                        <input className="contrast-slider" type="range" min="0" max="100" step="5" value={settings.audio.sfxDetune} onChange={(e) => onUpdate({ audio: { ...settings.audio, sfxDetune: Number(e.target.value) } })} />
                      </div>
                    </div>
                    <div className="contrast-control">
                      <div className="contrast-copy"><strong>{messages.audioReverb}</strong><span>{settings.audio.sfxReverb}%</span></div>
                      <div className="contrast-slider-row">
                        <input className="contrast-slider" type="range" min="0" max="100" step="5" value={settings.audio.sfxReverb} onChange={(e) => onUpdate({ audio: { ...settings.audio, sfxReverb: Number(e.target.value) } })} />
                      </div>
                    </div>
                  </div>
                  <div className="palette-grid" style={{ marginTop: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))' }}>
                    {SOUND_PREVIEW_LIST.map((item) => (
                      <button
                        key={item.name}
                        className="palette-chip"
                        type="button"
                        onClick={() => previewSound(item.name)}
                      >
                        {messages.audioPreview} {item.label}
                      </button>
                    ))}
                  </div>
                  <div className="tool-actions-row" style={{ marginTop: 12 }}>
                    <button className="secondary-button" type="button" onClick={() => onUpdate({ audio: { ...settings.audio, sfxPreset: defaultAudioSettings.sfxPreset, sfxEnabled: defaultAudioSettings.sfxEnabled, sfxVolume: defaultAudioSettings.sfxVolume, sfxPitch: defaultAudioSettings.sfxPitch, sfxDurationScale: defaultAudioSettings.sfxDurationScale, sfxFilterFreq: defaultAudioSettings.sfxFilterFreq, sfxDetune: defaultAudioSettings.sfxDetune, sfxReverb: defaultAudioSettings.sfxReverb, sfxAttack: defaultAudioSettings.sfxAttack, sfxDecay: defaultAudioSettings.sfxDecay, sfxSustain: defaultAudioSettings.sfxSustain, sfxRelease: defaultAudioSettings.sfxRelease, sfxPan: defaultAudioSettings.sfxPan } })}>{messages.audioResetSfx}</button>
                  </div>
                </section>

                <section className="settings-section">
                  <h3>{messages.audioMusicPreset}</h3>
                  <div className="palette-grid audio-preset-grid">
                    {MUSIC_PRESETS_LIST.map((preset) => (
                      <button
                        key={preset}
                        className={`palette-chip ${settings.audio.musicPreset === preset ? 'active' : ''}`}
                        type="button"
                        onClick={() => onUpdate({ audio: { ...settings.audio, musicPreset: preset } })}
                      >
                        {messages[`music${preset.charAt(0).toUpperCase() + preset.slice(1).replace(/-([a-z])/g, (_, c) => c.toUpperCase())}` as keyof Messages]}
                      </button>
                    ))}
                  </div>
                  <div className="chip-row" style={{ marginTop: 8 }}>
                    <button className={`choice-chip ${settings.audio.musicEnabled ? 'active' : ''}`} type="button" onClick={() => { onUpdate({ audio: { ...settings.audio, musicEnabled: true } }); startMusic(); }}>{messages.toggleOn}</button>
                    <button className={`choice-chip ${!settings.audio.musicEnabled ? 'active' : ''}`} type="button" onClick={() => { onUpdate({ audio: { ...settings.audio, musicEnabled: false } }); stopMusic(); }}>{messages.toggleOff}</button>
                  </div>
                  <div className="contrast-slider-row" style={{ marginTop: 8 }}>
                    <input className="contrast-slider" type="range" min="0" max="100" step="1" value={settings.audio.musicVolume} onChange={(e) => onUpdate({ audio: { ...settings.audio, musicVolume: Number(e.target.value) } })} />
                    <span className="contrast-value">{settings.audio.musicVolume}%</span>
                  </div>
                  <div style={{ marginTop: 16, display: 'grid', gap: 12 }}>
                    <div className="contrast-control">
                      <div className="contrast-copy"><strong>{messages.audioMusicPitch}</strong><span>{settings.audio.musicPitch > 0 ? '+' : ''}{settings.audio.musicPitch} ct</span></div>
                      <div className="contrast-slider-row">
                        <input className="contrast-slider" type="range" min="-600" max="600" step="50" value={settings.audio.musicPitch} onChange={(e) => onUpdate({ audio: { ...settings.audio, musicPitch: Number(e.target.value) } })} />
                      </div>
                    </div>
                    <div className="contrast-control">
                      <div className="contrast-copy"><strong>{messages.audioMusicTempo}</strong><span>{settings.audio.musicTempo}%</span></div>
                      <div className="contrast-slider-row">
                        <input className="contrast-slider" type="range" min="50" max="150" step="5" value={settings.audio.musicTempo} onChange={(e) => onUpdate({ audio: { ...settings.audio, musicTempo: Number(e.target.value) } })} />
                      </div>
                    </div>
                  </div>
                  <div className="tool-actions-row" style={{ marginTop: 12 }}>
                    <button className="secondary-button" type="button" onClick={() => onUpdate({ audio: { ...settings.audio, musicPreset: defaultAudioSettings.musicPreset, musicEnabled: defaultAudioSettings.musicEnabled, musicVolume: defaultAudioSettings.musicVolume, musicPitch: defaultAudioSettings.musicPitch, musicTempo: defaultAudioSettings.musicTempo, musicReverb: defaultAudioSettings.musicReverb, musicFilter: defaultAudioSettings.musicFilter, musicStereoWidth: defaultAudioSettings.musicStereoWidth } })}>{messages.audioResetMusic}</button>
                  </div>
                </section>

                <section className="settings-section">
                  <h3>{messages.audioCustomSfx}</h3>
                  <div className="chip-row">
                    <label className="primary-button" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      <input type="file" accept="audio/*" style={{ display: 'none' }} onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUploadAudio('sfx', f); }} />
                      {messages.audioUploadFile}
                    </label>
                    {settings.audio.customSfxName && (
                      <span className="muted-copy" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {settings.audio.customSfxName}
                        <button className="secondary-button" type="button" onClick={() => handleRemoveCustomAudio('sfx')}>{messages.audioRemoveCustom}</button>
                      </span>
                    )}
                  </div>
                  {settings.audio.customSfxDataUrl && (
                    <div className="chip-row" style={{ marginTop: 8 }}>
                      <button className={`choice-chip ${settings.audio.useCustomSfx ? 'active' : ''}`} type="button" onClick={() => onUpdate({ audio: { ...settings.audio, useCustomSfx: true } })}>{messages.audioCustomActive}</button>
                      <button className={`choice-chip ${!settings.audio.useCustomSfx ? 'active' : ''}`} type="button" onClick={() => onUpdate({ audio: { ...settings.audio, useCustomSfx: false } })}>{messages.toggleOff}</button>
                    </div>
                  )}
                </section>

                <section className="settings-section">
                  <h3>{messages.audioCustomMusic}</h3>
                  <div className="chip-row">
                    <label className="primary-button" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      <input type="file" accept="audio/*" style={{ display: 'none' }} onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUploadAudio('music', f); }} />
                      {messages.audioUploadFile}
                    </label>
                    {settings.audio.customMusicName && (
                      <span className="muted-copy" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {settings.audio.customMusicName}
                        <button className="secondary-button" type="button" onClick={() => handleRemoveCustomAudio('music')}>{messages.audioRemoveCustom}</button>
                      </span>
                    )}
                  </div>
                  {settings.audio.customMusicDataUrl && (
                    <div className="chip-row" style={{ marginTop: 8 }}>
                      <button className={`choice-chip ${settings.audio.useCustomMusic ? 'active' : ''}`} type="button" onClick={() => { onUpdate({ audio: { ...settings.audio, useCustomMusic: true } }); startMusic(); }}>{messages.audioCustomActive}</button>
                      <button className={`choice-chip ${!settings.audio.useCustomMusic ? 'active' : ''}`} type="button" onClick={() => { onUpdate({ audio: { ...settings.audio, useCustomMusic: false } }); stopMusic(); }}>{messages.toggleOff}</button>
                    </div>
                  )}
                </section>

                <section className="settings-section">
                  <h3>{messages.audioAdvancedTitle}</h3>
                  <div style={{ marginTop: 16, display: 'grid', gap: 12 }}>
                    <div className="contrast-control">
                      <div className="contrast-copy"><strong>{messages.audioSfxAttack}</strong><span>{settings.audio.sfxAttack} ms</span></div>
                      <div className="contrast-slider-row">
                        <input className="contrast-slider" type="range" min="0" max="500" step="10" value={settings.audio.sfxAttack} onChange={(e) => onUpdate({ audio: { ...settings.audio, sfxAttack: Number(e.target.value) } })} />
                      </div>
                    </div>
                    <div className="contrast-control">
                      <div className="contrast-copy"><strong>{messages.audioSfxDecay}</strong><span>{settings.audio.sfxDecay} ms</span></div>
                      <div className="contrast-slider-row">
                        <input className="contrast-slider" type="range" min="10" max="1000" step="10" value={settings.audio.sfxDecay} onChange={(e) => onUpdate({ audio: { ...settings.audio, sfxDecay: Number(e.target.value) } })} />
                      </div>
                    </div>
                    <div className="contrast-control">
                      <div className="contrast-copy"><strong>{messages.audioSfxSustain}</strong><span>{Math.round(settings.audio.sfxSustain * 100)}%</span></div>
                      <div className="contrast-slider-row">
                        <input className="contrast-slider" type="range" min="0" max="1" step="0.05" value={settings.audio.sfxSustain} onChange={(e) => onUpdate({ audio: { ...settings.audio, sfxSustain: Number(e.target.value) } })} />
                      </div>
                    </div>
                    <div className="contrast-control">
                      <div className="contrast-copy"><strong>{messages.audioSfxRelease}</strong><span>{settings.audio.sfxRelease} ms</span></div>
                      <div className="contrast-slider-row">
                        <input className="contrast-slider" type="range" min="10" max="2000" step="10" value={settings.audio.sfxRelease} onChange={(e) => onUpdate({ audio: { ...settings.audio, sfxRelease: Number(e.target.value) } })} />
                      </div>
                    </div>
                    <div className="contrast-control">
                      <div className="contrast-copy"><strong>{messages.audioSfxPan}</strong><span>{settings.audio.sfxPan > 0 ? '+' : ''}{settings.audio.sfxPan}</span></div>
                      <div className="contrast-slider-row">
                        <input className="contrast-slider" type="range" min="-1" max="1" step="0.1" value={settings.audio.sfxPan} onChange={(e) => onUpdate({ audio: { ...settings.audio, sfxPan: Number(e.target.value) } })} />
                      </div>
                    </div>
                    <div className="contrast-control">
                      <div className="contrast-copy"><strong>{messages.audioMusicReverb}</strong><span>{Math.round(settings.audio.musicReverb * 100)}%</span></div>
                      <div className="contrast-slider-row">
                        <input className="contrast-slider" type="range" min="0" max="1" step="0.05" value={settings.audio.musicReverb} onChange={(e) => onUpdate({ audio: { ...settings.audio, musicReverb: Number(e.target.value) } })} />
                      </div>
                    </div>
                  </div>
                  <div className="tool-actions-row" style={{ marginTop: 12 }}>
                    <button className="secondary-button" type="button" onClick={() => onUpdate({ audio: { ...settings.audio, sfxAttack: defaultAudioSettings.sfxAttack, sfxDecay: defaultAudioSettings.sfxDecay, sfxSustain: defaultAudioSettings.sfxSustain, sfxRelease: defaultAudioSettings.sfxRelease, sfxPan: defaultAudioSettings.sfxPan, musicReverb: defaultAudioSettings.musicReverb } })}>{messages.audioResetAdvanced}</button>
                  </div>
                </section>

                <p className="muted-copy">{messages.audioHint}</p>
              </>
            )}

            {tab === 'animation' && (
              <>
                <section className="settings-section">
                  <h3>{messages.animationTitle}</h3>
                  <div className="chip-row">
                    <button className={`choice-chip ${settings.animation.enabled ? 'active' : ''}`} type="button" onClick={() => onUpdate({ animation: { ...settings.animation, enabled: true } })}>{messages.toggleOn}</button>
                    <button className={`choice-chip ${!settings.animation.enabled ? 'active' : ''}`} type="button" onClick={() => onUpdate({ animation: { ...settings.animation, enabled: false } })}>{messages.toggleOff}</button>
                  </div>
                  <p className="muted-copy" style={{ marginTop: 10 }}>{messages.animationEnabled}</p>
                </section>

                <section className="settings-section">
                  <h3>{messages.animationSpeed}</h3>
                  <div className="contrast-control">
                    <div className="contrast-copy"><strong>{messages.animationSpeed}</strong><span>{settings.animation.speed}%</span></div>
                    <div className="contrast-slider-row">
                      <input className="contrast-slider" type="range" min="20" max="200" step="1" value={settings.animation.speed} onChange={(e) => onUpdate({ animation: { ...settings.animation, speed: Number(e.target.value) } })} />
                    </div>
                  </div>
                </section>

                <section className="settings-section">
                  <h3>{messages.borderWidthTitle}</h3>
                  <div className="contrast-control">
                    <div className="contrast-copy"><strong>{messages.borderWidthTitle}</strong><span>{settings.borderWidth}px</span></div>
                    <div className="contrast-slider-row">
                      <input className="contrast-slider" type="range" min="1" max="4" step="1" value={settings.borderWidth} onChange={(e) => onUpdate({ borderWidth: Number(e.target.value) })} />
                    </div>
                  </div>
                </section>

                <section className="settings-section">
                  <h3>{messages.animationEffectsTitle}</h3>
                  <div className="palette-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                    {[
                      { key: 'uiFadeIn', label: messages.animationUiFadeIn },
                      { key: 'buttonHover', label: messages.animationButtonHover },
                      { key: 'pageTransitions', label: messages.animationPageTransitions },
                      { key: 'modalTransitions', label: messages.animationModalTransitions },
                    ].map((item) => (
                      <button
                        key={item.key}
                        className={`palette-chip ${settings.animation[item.key as keyof typeof settings.animation] ? 'active' : ''}`}
                        type="button"
                        onClick={() => onUpdate({ animation: { ...settings.animation, [item.key]: !settings.animation[item.key as keyof typeof settings.animation] } })}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </section>

                <div className="tool-actions-row">
                  <button className="secondary-button" type="button" onClick={() => onUpdate({ animation: { ...defaultSettings.animation } })}>{messages.animationReset}</button>
                </div>

                <p className="muted-copy">{messages.animationHint}</p>
              </>
            )}

            {tab === 'api' && (
              <>
                <section className="settings-section">
                  <h3>{messages.apiModeTitle}</h3>
                  <div className="chip-row">
                    <button
                      className={`choice-chip ${settings.interfaceMode === 'builtin' ? 'active' : ''}`}
                      type="button"
                      onClick={() => onUpdate({ interfaceMode: 'builtin' })}
                    >
                      {messages.builtinMode}
                    </button>
                    <button
                      className={`choice-chip ${settings.interfaceMode === 'custom' ? 'active' : ''}`}
                      type="button"
                      onClick={() => onUpdate({ interfaceMode: 'custom' })}
                    >
                      {messages.customApiMode}
                    </button>
                  </div>
                </section>

                {settings.interfaceMode === 'builtin' ? (
                  <section className="settings-section">
                    <h3>{messages.apiPresetTitle}</h3>
                    <div className="chip-row">
                      <button
                        className={`choice-chip ${settings.apiPreset === 'plato' ? 'active' : ''}`}
                        type="button"
                        onClick={() => onUpdate({ apiPreset: 'plato' })}
                      >
                        {messages.apiPresetPlato}
                      </button>
                    </div>
                    <p className="muted-copy">{messages.apiPresetHint}</p>
                    <p className="muted-copy">{presetEndpoint || messages.apiPresetUnavailable}</p>
                    {!presetEndpoint && <p className="tiny-copy settings-warning">{messages.apiPresetUnavailable}</p>}
                  </section>
                ) : (
                  <>
                    {[1, 2, 3].map((ch) => {
                      const baseUrlKey = ch === 1 ? 'apiBaseUrl' : ch === 2 ? 'apiBaseUrl2' : 'apiBaseUrl3';
                      const apiKeyKey = ch === 1 ? 'apiKey' : ch === 2 ? 'apiKey2' : 'apiKey3';
                      const title = ch === 1 ? messages.apiChannel1 : ch === 2 ? messages.apiChannel2 : messages.apiChannel3;
                      return (
                        <section className="settings-section" key={ch}>
                          <h3>{title}</h3>
                          <input
                            className="settings-input"
                            type="url"
                            placeholder={messages.apiBasePlaceholder}
                            value={settings[baseUrlKey as keyof SettingsState] as string}
                            onChange={(event) => onUpdate({ [baseUrlKey]: event.target.value })}
                          />
                          <input
                            className="settings-input"
                            style={{ marginTop: 8 }}
                            type="password"
                            placeholder={messages.apiKeyPlaceholder}
                            value={settings[apiKeyKey as keyof SettingsState] as string}
                            onChange={(event) => onUpdate({ [apiKeyKey]: event.target.value })}
                          />
                          <div className="tool-actions-row" style={{ marginTop: 8 }}>
                            <button
                              className="secondary-button"
                              type="button"
                              onClick={() => openConfirm(title, messages.apiConfirmClear, () => onUpdate({ [baseUrlKey]: '', [apiKeyKey]: '' }))}
                            >
                              {messages.apiClearChannel}
                            </button>
                          </div>
                        </section>
                      );
                    })}
                  </>
                )}

                <section className="settings-section tip-section">
                  <h3>{messages.apiEffectiveTitle}</h3>
                  <p className="muted-copy">{effectiveApiEndpoint || messages.apiPresetUnavailable}</p>
                  <p>{settings.interfaceMode === 'custom' ? messages.apiEffectiveCustom : messages.apiEffectiveBuiltin}</p>
                  {apiEndpointIssue === 'direct-model-endpoint' && <p className="tiny-copy settings-warning">{messages.apiModelEndpointWarning}</p>}
                  {hostedApiRequired && <p className="tiny-copy settings-warning">{messages.apiPresetUnavailable}</p>}
                  <p className="tiny-copy">{messages.apiPrivacy}</p>
                </section>
              </>
            )}

            {tab === 'performance' && (
              <>
                <section className="settings-section">
                  <h3>{messages.performanceTitle}</h3>
                  <div className="switch-list">
                    {[
                      { key: 'reduceAnimations', label: messages.performanceReduceAnimations },
                      { key: 'disableGlassmorphism', label: messages.performanceDisableGlass },
                      { key: 'lowResolutionPreviews', label: messages.performanceLowResPreview },
                      { key: 'lazyLoadModules', label: messages.performanceLazyLoad },
                      { key: 'disableParticles', label: messages.performanceDisableParticles },
                      { key: 'aggressiveCaching', label: messages.performanceAggressiveCache },
                      { key: 'devMode', label: messages.performanceDevMode },
                    ].map((item) => (
                      <div key={item.key} className="switch-row">
                        <span className="switch-label">{item.label}</span>
                        <button
                          type="button"
                          className={`switch-track ${settings.performance[item.key as keyof typeof settings.performance] ? 'active' : ''}`}
                          onClick={() => onUpdate({ performance: { ...settings.performance, [item.key]: !settings.performance[item.key as keyof typeof settings.performance] } })}
                          aria-pressed={!!settings.performance[item.key as keyof typeof settings.performance]}
                        >
                          <span className="switch-thumb" />
                        </button>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="settings-section">
                  <h3>{messages.performanceImageQuality}</h3>
                  <div className="chip-row">
                    {(['low', 'medium', 'high'] as const).map((q) => (
                      <button
                        key={q}
                        className={`choice-chip ${settings.performance.imagePreviewQuality === q ? 'active' : ''}`}
                        type="button"
                        onClick={() => onUpdate({ performance: { ...settings.performance, imagePreviewQuality: q } })}
                      >
                        {messages[`performanceImageQuality${q.charAt(0).toUpperCase() + q.slice(1)}` as keyof Messages]}
                      </button>
                    ))}
                  </div>
                </section>

                <section className="settings-section">
                  <h3>{messages.performanceMaxConcurrent}</h3>
                  <div className="contrast-control">
                    <div className="contrast-copy"><strong>{settings.performance.maxConcurrentRequests}</strong></div>
                    <div className="contrast-slider-row">
                      <input className="contrast-slider" type="range" min="1" max="10" step="1" value={settings.performance.maxConcurrentRequests} onChange={(e) => onUpdate({ performance: { ...settings.performance, maxConcurrentRequests: Number(e.target.value) } })} />
                    </div>
                  </div>
                </section>

                <div className="tool-actions-row">
                  <button className="secondary-button" type="button" onClick={() => onUpdate({ performance: { ...defaultSettings.performance } })}>{messages.performanceReset}</button>
                </div>
                <p className="muted-copy">{messages.performanceHint}</p>
              </>
            )}

            {tab === 'shortcuts' && (
              <section className="settings-section">
                <h3>{messages.shortcutsTitle}</h3>
                <p className="muted-copy">{messages.shortcutsHint}</p>
                <div className="shortcut-builder">
                  <label className="field">
                    <span>{shortcutBuilderLabels.action}</span>
                    <select
                      className="settings-input tool-select"
                      value={shortcutBuilderAction}
                      onChange={(event) => setShortcutBuilderAction(event.target.value as ShortcutAction)}
                    >
                      {shortcutEntries.map(([action]) => (
                        <option key={action} value={action}>
                          {shortcutLabelsForLanguage[action]}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="field">
                    <span>{shortcutBuilderLabels.capture}</span>
                    <input
                      className="settings-input shortcut-capture-input"
                      type="text"
                      placeholder="Ctrl+Alt+S"
                      value={shortcutBuilderValue}
                      onChange={(event) => setShortcutBuilderValue(event.target.value)}
                      onKeyDown={(event) => {
                        event.preventDefault();
                        const nextValue = formatShortcutInput(event);
                        if (nextValue) {
                          setShortcutBuilderValue(nextValue);
                        }
                      }}
                    />
                  </label>
                </div>
                <div className="tool-actions-row">
                  <button className="secondary-button" type="button" onClick={applyShortcutBuilderValue}>
                    {shortcutBuilderLabels.apply}
                  </button>
                  <button className="secondary-button" type="button" onClick={() => setShortcutBuilderValue('')}>
                    {shortcutBuilderLabels.clear}
                  </button>
                </div>
                <p className="tiny-copy">{shortcutBuilderLabels.captureHint}</p>
                {shortcutBuilderValue &&
                shortcutEntries.some(([action, combo]) => action !== shortcutBuilderAction && combo === shortcutBuilderValue.trim()) ? (
                  <p className="tiny-copy settings-warning">{shortcutBuilderLabels.conflicts}</p>
                ) : null}
                <div className="shortcut-grid">
                  {shortcutEntries.map(([action, value]) => (
                    <label key={action} className="shortcut-row">
                      <span>{shortcutLabelsForLanguage[action as ShortcutAction]}</span>
                      <input
                        className="settings-input"
                        type="text"
                        value={value}
                        onChange={(event) =>
                          onUpdate({
                            shortcutMap: {
                              ...settings.shortcutMap,
                              [action]: event.target.value,
                            },
                          })
                        }
                      />
                    </label>
                  ))}
                </div>
                <div className="tool-actions-row">
                  <button className="secondary-button" type="button" onClick={() => onUpdate({ shortcutMap: defaultShortcutMap })}>
                    {messages.shortcutsReset}
                  </button>
                </div>
                <p className="tiny-copy settings-warning">{messages.shortcutsExperimental}</p>
              </section>
            )}

            {tab === 'others' && (
              <>
                <section className="settings-section">
                  <h3>{messages.othersLanguageSettings}</h3>
                  <p className="muted-copy">{messages.othersLanguageMissing}</p>
                </section>

                <section className="settings-section">
                  <h3>{messages.othersTitle}</h3>
                  <div className="palette-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
                    {[
                      { key: 'showTooltips', label: messages.othersTooltips },
                      { key: 'confirmDestructiveActions', label: messages.othersConfirmDestructive },
                      { key: 'showKeyboardHints', label: messages.othersKeyboardHints },
                      { key: 'smoothScroll', label: messages.othersSmoothScroll },
                      { key: 'enableNotificationSound', label: messages.othersNotificationSound },
                      { key: 'showClock', label: messages.othersShowClock },
                      { key: 'enableStatusBar', label: messages.othersStatusBar },
                      { key: 'highContrastFocus', label: messages.othersHighContrastFocus },
                    ].map((item) => (
                      <button
                        key={item.key}
                        className={`palette-chip ${settings.others[item.key as keyof typeof settings.others] ? 'active' : ''}`}
                        type="button"
                        onClick={() => onUpdate({ others: { ...settings.others, [item.key]: !settings.others[item.key as keyof typeof settings.others] } })}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </section>

                <section className="settings-section">
                  <h3>{messages.othersDateFormat}</h3>
                  <div className="chip-row">
                    {(['iso', 'locale', 'friendly'] as const).map((f) => (
                      <button
                        key={f}
                        className={`choice-chip ${settings.others.dateFormat === f ? 'active' : ''}`}
                        type="button"
                        onClick={() => onUpdate({ others: { ...settings.others, dateFormat: f } })}
                      >
                        {messages[`othersDateFormat${f.charAt(0).toUpperCase() + f.slice(1)}` as keyof Messages]}
                      </button>
                    ))}
                  </div>
                </section>

                <section className="settings-section">
                  <h3>{messages.othersAutoSave}</h3>
                  <div className="contrast-control">
                    <div className="contrast-copy"><strong>{settings.others.autoSaveInterval === 0 ? 'OFF' : `${settings.others.autoSaveInterval} min`}</strong></div>
                    <div className="contrast-slider-row">
                      <input className="contrast-slider" type="range" min="0" max="30" step="1" value={settings.others.autoSaveInterval} onChange={(e) => onUpdate({ others: { ...settings.others, autoSaveInterval: Number(e.target.value) } })} />
                    </div>
                  </div>
                </section>

                <section className="settings-section">
                  <h3>{messages.othersResetAll}</h3>
                  <div className="tool-actions-row">
                    <button
                      className="secondary-button"
                      type="button"
                      onClick={() => openConfirm(messages.othersResetAll, messages.othersConfirmReset, () => {
                        window.localStorage.removeItem(STORAGE_KEY);
                        window.location.reload();
                      })}
                    >
                      {messages.othersResetAll}
                    </button>
                  </div>
                </section>

                <section className="settings-section">
                  <h3>{messages.othersRestoreDefaults}</h3>
                  <div className="tool-actions-row">
                    <button
                      className="secondary-button"
                      type="button"
                      onClick={() => openConfirm(messages.othersRestoreDefaults, messages.othersConfirmRestore, () => {
                        onUpdate({ ...defaultSettings });
                      })}
                    >
                      {messages.othersRestoreDefaults}
                    </button>
                  </div>
                </section>

                <p className="muted-copy">{messages.othersHint}</p>
              </>
            )}

            {tab === 'announcement' && (
              <section className="settings-section announcement-shell">
                <div className="announcement-list">
                  {announcementHistory.map((item) => (
                    <button
                      key={item.version}
                      className={`announcement-entry ${selectedAnnouncement.version === item.version ? 'active' : ''}`}
                      type="button"
                      onClick={() => setSelectedAnnouncementVersion(item.version)}
                    >
                      <strong>{item.version}</strong>
                      <em className="announcement-entry-arrow">{selectedAnnouncement.version === item.version ? '−' : '+'}</em>
                    </button>
                  ))}
                </div>
                <div className="announcement-detail">
                  <span>{selectedAnnouncement.date}</span>
                  <h3>{selectedAnnouncement.title}</h3>
                  <p>{selectedAnnouncement.summary}</p>
                  <ul>
                    {selectedAnnouncement.details.map((detail) => (
                      <li key={detail}>{detail}</li>
                    ))}
                  </ul>
                </div>
              </section>
            )}

            {tab === 'about' && (
              <section className="settings-section">
                <h3>{messages.aboutTitle}</h3>
                <p>{messages.aboutDescription}</p>
                <div className="link-list">
                  <a href="https://github.com/hzagaming" rel="noreferrer" target="_blank">
                    {messages.profileLinkLabel}
                  </a>
                  <a href="https://github.com/hzagaming/Original-Character-Maker" rel="noreferrer" target="_blank">
                    {messages.repoLinkLabel}
                  </a>
                  <a href="https://paper2gal.com" rel="noreferrer" target="_blank">
                    {messages.paperSiteLabel}
                  </a>
                </div>
              </section>
            )}

            {/* Confirm Dialog */}
            {confirmDialog.open && (
              <div className="modal-backdrop" style={{ position: 'fixed', inset: 0, zIndex: 100 }} role="presentation" onClick={() => setConfirmDialog((d) => ({ ...d, open: false }))}>
                <section className="modal-card modal-surface" style={{ maxWidth: 420, margin: 'auto', position: 'relative', top: '30%' }} role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
                  <h3 style={{ marginBottom: 12 }}>{confirmDialog.title}</h3>
                  <p className="muted-copy" style={{ marginBottom: 20 }}>
                    {confirmDialog.message}
                  </p>
                  <div className="tool-actions-row">
                    <button className="primary-button" type="button" onClick={handleConfirmStep}>{messages.confirmYes}</button>
                    <button className="secondary-button" type="button" onClick={() => setConfirmDialog((d) => ({ ...d, open: false }))}>{messages.confirmNo}</button>
                  </div>
                </section>
              </div>
            )}

            {/* Preset Save Dialog */}
            {presetDialog.open && (
              <div className="modal-backdrop" style={{ position: 'fixed', inset: 0, zIndex: 100 }} role="presentation" onClick={() => setPresetDialog({ open: false, slot: 0, name: '' })}>
                <section className="modal-card modal-surface" style={{ maxWidth: 420, margin: 'auto', position: 'relative', top: '30%' }} role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
                  <h3 style={{ marginBottom: 12 }}>{messages.styleSavePreset}</h3>
                  <p className="muted-copy" style={{ marginBottom: 12 }}>
                    {presetDialog.slot === 0 ? messages.stylePreset1 : messages.stylePreset2}
                  </p>
                  <input
                    className="settings-input"
                    type="text"
                    placeholder={messages.stylePresetName}
                    value={presetDialog.name}
                    onChange={(e) => setPresetDialog((d) => ({ ...d, name: e.target.value }))}
                    autoFocus
                  />
                  <div className="tool-actions-row" style={{ marginTop: 16 }}>
                    <button
                      className="primary-button"
                      type="button"
                      onClick={() => {
                        if (isPresetSameAsCurrent(presetDialog.slot as 0 | 1)) {
                          alert(messages.stylePresetSame);
                          return;
                        }
                        savePresetSlot(presetDialog.slot as 0 | 1, presetDialog.name);
                      }}
                    >
                      {messages.confirmYes}
                    </button>
                    <button className="secondary-button" type="button" onClick={() => setPresetDialog({ open: false, slot: 0, name: '' })}>{messages.confirmCancel}</button>
                  </div>
                  <div className="chip-row" style={{ marginTop: 8 }}>
                    <button className={`choice-chip ${presetDialog.slot === 0 ? 'active' : ''}`} type="button" onClick={() => setPresetDialog((d) => ({ ...d, slot: 0 }))}>{messages.stylePreset1}</button>
                    <button className={`choice-chip ${presetDialog.slot === 1 ? 'active' : ''}`} type="button" onClick={() => setPresetDialog((d) => ({ ...d, slot: 1 }))}>{messages.stylePreset2}</button>
                  </div>
                </section>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function getFeatureDetails(screen: Exclude<FeatureScreen, 'home'>, messages: Messages) {
  switch (screen) {
    case 'face-maker':
      return {
        title: messages.pageFaceTitle,
        description: messages.pageFaceDescription,
        workspaceTitle: 'Character Canvas',
        panelTitle: 'Face / Hair / Palette',
        pipelineTitle: 'Presets / Export',
        todoOne: '补角色图层、部位分类和颜色系统',
        todoTwo: '补随机生成、重置与导出 PNG',
      };
    case 'style-transfer':
      return {
        title: messages.pageStyleTitle,
        description: messages.pageStyleDescription,
        workspaceTitle: 'Input / Output Preview',
        panelTitle: 'Model / Prompt / Seed',
        pipelineTitle: 'Queue / History',
        todoOne: '补输入图片、模型选择和参数面板',
        todoTwo: '补任务状态、结果预览与下载',
      };
    case 'prompt-suite':
      return {
        title: messages.pagePromptTitle,
        description: messages.pagePromptDescription,
        workspaceTitle: 'Prompt Workspace',
        panelTitle: 'Character Prompt / World-building',
        pipelineTitle: 'Generated Assets',
        todoOne: '补角色资料、Prompt 模板和导出逻辑',
        todoTwo: '补世界观编辑与本地保存',
      };
    case 'llm-hub':
      return {
        title: messages.pageLlmTitle,
        description: messages.pageLlmDescription,
        workspaceTitle: 'LLM Workspace',
        panelTitle: 'Model / Parameters',
        pipelineTitle: 'Generated Text',
        todoOne: '补 LLM 模型选择、温度与系统提示词',
        todoTwo: '补文本生成、历史记录与导出',
      };
    case 'tts-export':
      return {
        title: messages.pageTtsTitle,
        description: messages.pageTtsDescription,
        workspaceTitle: 'TTS Workspace',
        panelTitle: 'Voice / Emotion / Format',
        pipelineTitle: 'Audio Outputs',
        todoOne: '补语音选择、语速、音高与情感配置',
        todoTwo: '补参考音频上传、合成与导出',
      };
    case 'paper2gal':
      return {
        title: messages.pagePaperTitle,
        description: messages.pagePaperDescription,
        workspaceTitle: 'paper2gal Stage',
        panelTitle: 'Asset Controls',
        pipelineTitle: 'Outputs / Logs',
        todoOne: '补图片素材工作流配置与启动入口',
        todoTwo: '补 Character Workflow 仓库联动',
      };
    case 'image-converter':
      return {
        title: messages.pageImageConverterTitle,
        description: messages.pageImageConverterDescription,
        workspaceTitle: 'Converter Workspace',
        panelTitle: 'Format Controls',
        pipelineTitle: 'Output / Download',
        todoOne: '补格式选择与质量调整',
        todoTwo: '补批量转换与尺寸调整',
      };
  }
}

export default App;
