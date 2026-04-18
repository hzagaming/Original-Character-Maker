import { useEffect, useState, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import type {
  AccentPalette,
  AppLanguage,
  FeatureScreen,
  FontPreset,
  SettingsState,
  SettingsTab,
  ShortcutAction,
  ShortcutMap,
  StartModalStep,
  ThemeDepth,
} from './types';
import { detectWorkflowApiBaseIssue, getEffectiveApiBase, getPresetApiBase, requiresHostedApiBase } from './apiConfig';
import { Paper2GalPage, PromptSuitePage, StyleTransferPage } from './workflowPages';

const VERSION = '0.3.5';
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
  featurePaper: string;
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
  actionPaper2Gal: string;
  actionBack: string;
  settingsTitle: string;
  tabStyle: string;
  tabLanguage: string;
  tabApi: string;
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
  pagePaperTitle: string;
  pagePaperDescription: string;
  moduleCanvas: string;
  modulePanel: string;
  modulePipeline: string;
  moduleStorage: string;
};

type BaseLanguage = 'zh' | 'ja' | 'en' | 'ru';

const translations: Record<BaseLanguage, Messages> = {
  zh: {
  appTitle: 'Original Character Maker',
  appSubtitle: '自定义 OC 角色中控台',
  versionLabel: '版本',
  overviewTitle: '单图进，多资产出',
  overviewDescription:
      '把捏脸、转画风、角色 Prompt / LLM / TTS 封装与 paper2gal 素材生成统一到同一个入口页里，方便集中管理角色创作流程。',
  workflowTitle: '开始新的工作流',
  workflowDescription: '从这里直接进入捏脸、转画风、角色 Prompt + LLM / TTS 或 paper2gal 工作台。',
  workflowHint: '点击开始会打开四个主入口弹窗，也可以直接点击上面的图标卡片进入。',
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
    featurePrompt: '角色 Prompt + LLM / TTS',
    featurePaper: 'paper2gal 图片素材',
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
    startModalDescription: '先进入你现在要使用的四个主入口之一。',
    startModalSeriesTitle: '生成系列素材',
    startModalSeriesDescription: '这里分成两个子入口，分别进入对应的素材流程。',
    actionFace: '捏脸',
    actionStyle: '转画风',
    actionSeries: '生成系列素材',
    actionPromptSuite: '角色 Prompt + LLM / TTS 封装',
    actionPaper2Gal: 'paper2gal 图片素材生成',
    actionBack: '返回上一级',
    settingsTitle: '项目设置',
    tabStyle: '样式',
    tabLanguage: '语言',
    tabApi: '接口',
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
    announcementDescription: '0.3.5 补全了 0.3.3.0 到 0.3.3.2 的公告链路，并继续整理关于页入口、设卡编辑器工具栏和快捷键设置。',
    announcementList1: '公告页补齐 0.3.3.0、0.3.3.1、0.3.3.2、0.3.4 的历史版本，列表默认只显示版本入口，右侧再展开详细更新信息。',
    announcementList2: '关于页新增 paper2gal 官方站点入口，并把作者和 GitHub 仓库链接文案统一整理。',
    announcementList3: 'OC 设卡编辑器继续扩展：工具栏支持折叠、自定义字体、自定义插入、更多字体和快捷键设置。',
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
    pagePromptDescription: '在富文本编辑器中整理世界观、角色设卡和封装输入，并在下方配置 LLM 与 TTS 封装参数。',
    pagePaperTitle: 'paper2gal 图片素材生成',
    pagePaperDescription: '接入 p2g-character-workflow 的 paper2gal 流程，负责上传角色图、轮询工作流进度、查看结果资产与下载调试包。',
    moduleCanvas: '主工作区画布',
    modulePanel: '右侧参数 / 功能面板',
    modulePipeline: '任务队列与输出结果区',
    moduleStorage: '本地配置与历史记录',
  },
  ja: {
    appTitle: 'Original Character Maker',
    appSubtitle: 'OC キャラクター統合ハブ',
    versionLabel: 'バージョン',
    overviewTitle: 'キャラクター制作入口',
    overviewDescription:
      '顔編集、画風変換、Prompt / LLM / TTS ラッパー、paper2gal 素材生成を 1 つの入口ページにまとめています。',
    workflowTitle: '新しいワークフローを開始',
    workflowDescription: 'ここから顔編集、画風変換、Prompt / LLM / TTS、paper2gal の各ワークベンチへ直接入れます。',
    workflowHint: '開始ボタンを押すと 4 つの主入口モーダルが開き、上のカードから直接入ることもできます。',
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
    featurePrompt: 'Prompt + LLM / TTS',
    featurePaper: 'paper2gal 素材',
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
    startModalDescription: '今使いたい 4 つの主入口から 1 つ選んでください。',
    startModalSeriesTitle: 'シリーズ素材生成',
    startModalSeriesDescription: 'ここではさらに 2 つの子入口へ分けています。',
    actionFace: '捏脸',
    actionStyle: '画風変換',
    actionSeries: 'シリーズ素材生成',
    actionPromptSuite: 'Prompt + LLM / TTS ラッパー',
    actionPaper2Gal: 'paper2gal 素材生成',
    actionBack: '戻る',
    settingsTitle: 'プロジェクト設定',
    tabStyle: 'スタイル',
    tabLanguage: '言語',
    tabApi: 'API',
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
    announcementDescription: '0.3.5 では 0.3.3.0 から 0.3.3.2 までの告知履歴を補完し、情報ページ入口・OC 設定エディタ・ショートカット設定をさらに整理しました。',
    announcementList1: '告知一覧は 0.3.3.0 / 0.3.3.1 / 0.3.3.2 / 0.3.4 を含む形に補完され、一覧ではバージョン入口だけを見せて右側に詳細を展開します。',
    announcementList2: 'About ページには paper2gal 公式サイト入口を追加し、作者リンクと GitHub リポジトリ表記も整理しました。',
    announcementList3: 'OC 設定エディタは折りたたみ式ツールバー、カスタムフォント、カスタム挿入、追加フォント群、ショートカット設定に対応しました。',
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
    pagePromptDescription: 'リッチテキストで世界観やキャラクター設定を整理し、その下で LLM / TTS 封装を管理します。',
    pagePaperTitle: 'paper2gal 素材生成',
    pagePaperDescription: 'p2g-character-workflow の paper2gal パイプラインに接続し、キャラクター画像のアップロード、進捗同期、成果物確認、デバッグパックの取得を行います。',
    moduleCanvas: 'メイン作業領域',
    modulePanel: '右側パネル',
    modulePipeline: 'タスクと出力',
    moduleStorage: 'ローカル保存と履歴',
  },
  en: {
    appTitle: 'Original Character Maker',
    appSubtitle: 'Custom OC control center',
    versionLabel: 'Version',
    overviewTitle: 'Character creation entry',
    overviewDescription:
      'Face making, style transfer, prompt tooling, and paper2gal asset generation are grouped into one entry page for a cleaner workflow.',
    workflowTitle: 'Start a new workflow',
    workflowDescription: 'Jump straight into Face Maker, Style Transfer, Prompt + LLM / TTS, or the paper2gal workbench from here.',
    workflowHint: 'Press Start to open the four-entry launcher, or click any icon card above to jump in directly.',
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
    featurePrompt: 'Prompt + LLM / TTS',
    featurePaper: 'paper2gal Assets',
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
    startModalDescription: 'Select one of the four main workbenches to enter first.',
    startModalSeriesTitle: 'Generate series assets',
    startModalSeriesDescription: 'This branch is split into two child entries for later integration.',
    actionFace: 'Face Maker',
    actionStyle: 'Style Transfer',
    actionSeries: 'Generate Series Assets',
    actionPromptSuite: 'Character Prompt + LLM / TTS',
    actionPaper2Gal: 'paper2gal Asset Generation',
    actionBack: 'Back',
    settingsTitle: 'Project Settings',
    tabStyle: 'Style',
    tabLanguage: 'Language',
    tabApi: 'API',
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
    announcementDescription: 'Version 0.3.5 fills the missing 0.3.3.0 to 0.3.3.2 announcement chain and keeps refining the about links, OC card editor toolbar, and shortcut settings.',
    announcementList1: 'The announcement archive now includes 0.3.3.0, 0.3.3.1, 0.3.3.2, and 0.3.4, with a compact version-only list that expands details on the right.',
    announcementList2: 'The About page now includes a paper2gal website entry, while the author link and GitHub repository label were cleaned up.',
    announcementList3: 'The OC card editor keeps growing with collapsible toolbar groups, custom fonts, custom insert tools, a much larger font list, and editable shortcuts.',
    aboutTitle: 'About',
    aboutDescription: 'This project is the unified entry point for your OC creation workflow.',
    paperSiteLabel: 'Open paper2gal',
    profileLinkLabel: 'Author',
    repoLinkLabel: 'GitHub repository',
    pageFaceTitle: 'Face Maker',
    pageFaceDescription: 'Manage modular assets on the left, preview the character in the middle, and adjust controls plus export actions on the right.',
    pageStyleTitle: 'Style Transfer',
    pageStyleDescription: 'Upload an image, tune AI parameters, monitor the run, and export result, error, and debug payloads from one workbench.',
    pagePromptTitle: 'OC Card Editor',
    pagePromptDescription: 'Edit world lore, character cards, and wrapper inputs in a rich-text workspace, then configure the LLM and TTS layers underneath.',
    pagePaperTitle: 'paper2gal Asset Generation',
    pagePaperDescription: 'Connects to the p2g-character-workflow paper2gal pipeline for character upload, workflow polling, output review, and debug-package download.',
    moduleCanvas: 'Main workspace',
    modulePanel: 'Control panel',
    modulePipeline: 'Task queue and outputs',
    moduleStorage: 'Local settings and history',
  },
  ru: {
    appTitle: 'Original Character Maker',
    appSubtitle: 'Центр управления OC',
    versionLabel: 'Версия',
    overviewTitle: 'Точка входа в создание персонажа',
    overviewDescription:
      'Редактор лица, перенос стиля, prompt-инструменты и paper2gal собраны на одной входной странице.',
    workflowTitle: 'Запустить новый workflow',
    workflowDescription: 'Отсюда можно сразу перейти в редактор лица, перенос стиля, Prompt + LLM / TTS или paper2gal.',
    workflowHint: 'Кнопка старта открывает модальное окно с четырьмя основными входами, но можно зайти и напрямую по карточке.',
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
    featurePrompt: 'Prompt + LLM / TTS',
    featurePaper: 'paper2gal материалы',
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
    startModalDescription: 'Сначала выберите один из четырёх основных рабочих столов.',
    startModalSeriesTitle: 'Генерация серии',
    startModalSeriesDescription: 'Эта ветка разделена на два под-входа.',
    actionFace: 'Редактор лица',
    actionStyle: 'Перенос стиля',
    actionSeries: 'Генерация серии',
    actionPromptSuite: 'Prompt + LLM / TTS',
    actionPaper2Gal: 'paper2gal генерация',
    actionBack: 'Назад',
    settingsTitle: 'Настройки проекта',
    tabStyle: 'Стиль',
    tabLanguage: 'Язык',
    tabApi: 'API',
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
    announcementDescription: 'Версия 0.3.5 дополняет цепочку объявлений 0.3.3.0–0.3.3.2 и продолжает дорабатывать раздел About, редактор карточек OC и настройки горячих клавиш.',
    announcementList1: 'Архив объявлений теперь содержит 0.3.3.0, 0.3.3.1, 0.3.3.2 и 0.3.4, а список слева показывает компактные входы по версиям с деталями справа.',
    announcementList2: 'В разделе About добавлена ссылка на сайт paper2gal, а подписи для автора и GitHub-репозитория приведены к более понятному виду.',
    announcementList3: 'Редактор карточек OC получил складывающиеся группы тулбара, пользовательские шрифты, пользовательские вставки, расширенный список шрифтов и настраиваемые шорткаты.',
    aboutTitle: 'О проекте',
    aboutDescription: 'Этот проект служит единым входом в ваш рабочий процесс создания OC.',
    paperSiteLabel: 'Открыть paper2gal',
    profileLinkLabel: 'Автор',
    repoLinkLabel: 'GitHub репозиторий',
    pageFaceTitle: 'Редактор лица',
    pageFaceDescription: 'Слева управляются ассеты, по центру — холст персонажа, справа — параметры, сохранение и экспорт.',
    pageStyleTitle: 'Перенос стиля',
    pageStyleDescription: 'Загружайте изображение, настраивайте AI-параметры, следите за прогрессом и выгружайте результат, ошибки и debug JSON.',
    pagePromptTitle: 'Редактор карточек OC',
    pagePromptDescription: 'Редактируйте мир, карточки персонажей и входные данные для обёрток в rich-text редакторе, а ниже настраивайте LLM и TTS.',
    pagePaperTitle: 'paper2gal генерация',
    pagePaperDescription: 'Подключает paper2gal pipeline из p2g-character-workflow: загрузка изображения персонажа, polling workflow, просмотр результатов и скачивание debug-пакета.',
    moduleCanvas: 'Основное рабочее поле',
    modulePanel: 'Панель управления',
    modulePipeline: 'Очередь задач и вывод',
    moduleStorage: 'Локальные настройки и история',
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
  saveDocument: 'Ctrl+S',
  bold: 'Ctrl+B',
  italic: 'Ctrl+I',
  underline: 'Ctrl+U',
  strikeThrough: 'Ctrl+Shift+S',
  subscript: 'Ctrl+.',
  superscript: 'Ctrl+Shift+.',
  blockquote: 'Ctrl+Shift+Q',
  heading1: 'Ctrl+Alt+1',
  heading2: 'Ctrl+Alt+2',
  heading3: 'Ctrl+Alt+3',
  heading4: 'Ctrl+Alt+4',
  heading5: 'Ctrl+Alt+5',
  heading6: 'Ctrl+Alt+6',
  unorderedList: 'Ctrl+Shift+7',
  orderedList: 'Ctrl+Shift+8',
  justifyLeft: 'Ctrl+Alt+L',
  justifyCenter: 'Ctrl+Alt+E',
  justifyRight: 'Ctrl+Alt+R',
  justifyFull: 'Ctrl+Alt+J',
  indent: 'Tab',
  outdent: 'Shift+Tab',
  insertLink: 'Ctrl+K',
  insertTable: 'Ctrl+Alt+T',
  insertHr: 'Ctrl+Alt+H',
  insertCodeBlock: 'Ctrl+Alt+C',
  insertImage: 'Ctrl+Alt+I',
  clearHighlight: 'Ctrl+Shift+H',
  undo: 'Ctrl+Z',
  redo: 'Ctrl+Shift+Z',
  selectAll: 'Ctrl+A',
  clearFormat: 'Ctrl+\\',
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
    announcementDescription: '0.3.5에서는 0.3.3.0부터 0.3.3.2까지의 공지 이력을 보강하고, About 링크와 OC 설정 에디터, 단축키 설정을 계속 다듬었습니다.',
    announcementList1: '공지 보관함에 0.3.3.0, 0.3.3.1, 0.3.3.2, 0.3.4가 모두 포함되며, 목록은 버전 중심으로 간결하게 표시되고 오른쪽에 상세가 펼쳐집니다.',
    announcementList2: 'About 영역에 paper2gal 공식 사이트 버튼을 추가하고, 작성자와 GitHub 저장소 라벨도 정리했습니다.',
    announcementList3: 'OC 설정 에디터에는 접이식 툴바 그룹, 사용자 정의 글꼴, 사용자 정의 삽입, 더 많은 글꼴 목록, 조절 가능한 단축키가 추가되었습니다.',
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
    announcementDescription: 'La version 0.3.5 complète enfin la chaîne d’annonces 0.3.3.0 à 0.3.3.2 et poursuit les améliorations de la page About, de l’éditeur de fiches OC et des raccourcis.',
    announcementList1: 'L’archive inclut maintenant 0.3.3.0, 0.3.3.1, 0.3.3.2 et 0.3.4 avec une liste compacte centrée sur les versions et les détails affichés à droite.',
    announcementList2: 'La page About gagne un bouton vers le site paper2gal, et les libellés auteur / dépôt GitHub ont été harmonisés.',
    announcementList3: 'L’éditeur de fiches OC reçoit des groupes d’outils repliables, des polices personnalisées, des insertions personnalisées, davantage de polices et des raccourcis configurables.',
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
    announcementDescription: 'Version 0.3.5 ergänzt endlich die fehlende Ankündigungskette 0.3.3.0 bis 0.3.3.2 und erweitert weiterhin About-Seite, OC-Karteneditor und Shortcut-Einstellungen.',
    announcementList1: 'Das Archiv enthält nun 0.3.3.0, 0.3.3.1, 0.3.3.2 und 0.3.4 mit einer kompakten versionsbasierten Liste und Detailansicht auf der rechten Seite.',
    announcementList2: 'Die About-Seite hat jetzt einen paper2gal-Webseitenbutton, und die Beschriftungen für Autor und GitHub-Repository wurden vereinheitlicht.',
    announcementList3: 'Der OC-Karteneditor unterstützt jetzt einklappbare Toolbar-Gruppen, benutzerdefinierte Schriftarten, benutzerdefinierte Einfügewerkzeuge, eine größere Font-Liste und bearbeitbare Shortcuts.',
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
    announcementDescription: 'La versión 0.3.5 completa por fin la cadena de anuncios 0.3.3.0 a 0.3.3.2 y sigue mejorando la página About, el editor de fichas OC y la configuración de atajos.',
    announcementList1: 'El archivo de anuncios ahora incluye 0.3.3.0, 0.3.3.1, 0.3.3.2 y 0.3.4 con una lista compacta centrada en versiones y el detalle a la derecha.',
    announcementList2: 'La página About incorpora un botón hacia paper2gal, y también se ordenaron las etiquetas de autor y repositorio de GitHub.',
    announcementList3: 'El editor de fichas OC ahora tiene grupos plegables en la barra, fuentes personalizadas, inserciones personalizadas, más tipografías y atajos editables.',
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
    announcementDescription: 'La versione 0.3.5 completa la catena di annunci mancante da 0.3.3.0 a 0.3.3.2 e continua a migliorare la pagina About, l’editor delle schede OC e le scorciatoie.',
    announcementList1: 'L’archivio ora include 0.3.3.0, 0.3.3.1, 0.3.3.2 e 0.3.4 con una lista compatta centrata sulle versioni e i dettagli sul lato destro.',
    announcementList2: 'La pagina About ora ha anche un pulsante per il sito paper2gal, e le etichette per autore e repository GitHub sono state riordinate.',
    announcementList3: 'L’editor delle schede OC supporta gruppi toolbar pieghevoli, font personalizzati, inserimenti personalizzati, più font e scorciatoie modificabili.',
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
    announcementDescription: 'A versão 0.3.5 completa a cadeia de anúncios 0.3.3.0 a 0.3.3.2 e continua refinando a página About, o editor de fichas OC e as configurações de atalhos.',
    announcementList1: 'O arquivo agora inclui 0.3.3.0, 0.3.3.1, 0.3.3.2 e 0.3.4 com uma lista compacta focada em versões e detalhes exibidos à direita.',
    announcementList2: 'A página About ganhou um botão para o site paper2gal, e os rótulos de autor e repositório do GitHub foram reorganizados.',
    announcementList3: 'O editor de fichas OC agora tem grupos recolhíveis na barra, fontes personalizadas, inserções personalizadas, mais tipografias e atalhos editáveis.',
    pageFaceTitle: 'Face Maker',
    pageStyleTitle: 'Transferência de estilo',
    pagePromptTitle: 'Editor de fichas OC',
    pagePaperTitle: 'Geração de assets paper2gal',
  },
};

const announcementHistory = [
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
  language: 'zh',
  customFontFamily: '',
  interfaceMode: 'builtin',
  apiPreset: 'plato',
  apiBaseUrl: '',
  apiKey: '',
  fontPreset: 'sans',
  shortcutMap: defaultShortcutMap,
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

    if (nextSettings.apiPreset !== 'plato') {
      nextSettings.apiPreset = 'plato';
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

  // Keep UI preferences local-only so the shell behaves like a desktop-style tool launcher.
  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const resolvedLanguage = translationAliases[settings.language];
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
  ].join(' ');
  const appStyle = {
    ['--ui-contrast' as string]: `${settings.contrast}%`,
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
  }

  function navigateTo(nextScreen: Exclude<FeatureScreen, 'home'>) {
    setScreen(nextScreen);
    setModalStep(null);
  }

  function openSettings(tab: SettingsTab = 'style') {
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
          onOpenStart={() => setModalStep('root')}
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
      ) : screen === 'paper2gal' ? (
        <Paper2GalPage
          {...sharedPageProps}
          pageTitle={messages.pagePaperTitle}
          pageDescription={messages.pagePaperDescription}
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
          step={modalStep}
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
            <h2>{VERSION}</h2>
            <p>{messages.announcementDescription}</p>
            <ul className="home-announcement-list">
              <li>{messages.announcementList1}</li>
              <li>{messages.announcementList2}</li>
              <li>{messages.announcementList3}</li>
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
              <button className="workflow-item compact workflow-entry-button" type="button" onClick={() => onNavigate('paper2gal')}>
                <ActionIcon kind="paper2gal" />
                <span>{messages.featurePaper}</span>
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
    reset: '重置',
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
    reset: 'リセット',
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
    reset: 'Reset',
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
    reset: 'Сбросить',
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
            <button className="secondary-button small-button" type="button" onClick={resetDraft}>
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
  kind: 'face-maker' | 'style-transfer' | 'prompt-suite' | 'paper2gal';
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
    paper2gal: (
      <>
        <rect x="9" y="10" width="22" height="20" rx="4" />
        <circle cx="16" cy="17" r="2.5" />
        <path d="m13 27 5-5 4 4 4-6 4 7" />
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
  step,
  messages,
  onClose,
  onSelect,
}: {
  step: Exclude<StartModalStep, null>;
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
          <button className="action-tile" type="button" onClick={() => onSelect('paper2gal')}>
            <ActionIcon kind="paper2gal" />
            <strong>{messages.actionPaper2Gal}</strong>
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
    { key: 'api', label: messages.tabApi },
    { key: 'shortcuts', label: messages.tabShortcuts },
    { key: 'announcement', label: messages.tabAnnouncement },
    { key: 'about', label: messages.tabAbout },
  ];

  const shortcutLabelsForLanguage = shortcutLabels[resolvedLanguage];

  const selectedAnnouncement =
    announcementHistory.find((item) => item.version === selectedAnnouncementVersion) ?? announcementHistory[0];

  useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);

  function requestClose() {
    setIsClosing(true);
    window.setTimeout(onClose, MODAL_CLOSE_MS);
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
              </section>
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
                    <section className="settings-section">
                      <h3>{messages.apiBaseTitle}</h3>
                      <input
                        className="settings-input"
                        type="url"
                        placeholder={messages.apiBasePlaceholder}
                        value={settings.apiBaseUrl}
                        onChange={(event) => onUpdate({ apiBaseUrl: event.target.value })}
                      />
                      {apiEndpointIssue === 'direct-model-endpoint' && (
                        <p className="tiny-copy settings-warning">{messages.apiModelEndpointWarning}</p>
                      )}
                    </section>

                    <section className="settings-section">
                      <h3>{messages.apiKeyTitle}</h3>
                      <input
                        className="settings-input"
                        type="password"
                        placeholder={messages.apiKeyPlaceholder}
                        value={settings.apiKey}
                        onChange={(event) => onUpdate({ apiKey: event.target.value })}
                      />
                      <p className="muted-copy">{messages.apiHelp}</p>
                      <p className="muted-copy">{messages.apiHint}</p>
                    </section>
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

            {tab === 'shortcuts' && (
              <section className="settings-section">
                <h3>{messages.shortcutsTitle}</h3>
                <p className="muted-copy">{messages.shortcutsHint}</p>
                <div className="shortcut-grid">
                  {Object.entries(settings.shortcutMap).map(([action, value]) => (
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
        panelTitle: 'LLM / TTS Config',
        pipelineTitle: 'Generated Assets',
        todoOne: '补角色资料、Prompt 模板和导出逻辑',
        todoTwo: '补 LLM / TTS 服务封装与本地保存',
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
  }
}

export default App;
