import { useEffect, useState, type CSSProperties } from 'react';
import type {
  AccentPalette,
  AppLanguage,
  FeatureScreen,
  FontPreset,
  SettingsState,
  SettingsTab,
  StartModalStep,
  ThemeDepth,
} from './types';

const VERSION = '0.2.1';
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
  tabAnnouncement: string;
  tabAbout: string;
  stylePresetTitle: string;
  stylePresetDefault: string;
  stylePresetPaper2Gal: string;
  themeModeTitle: string;
  themeLight: string;
  themeDeep: string;
  accentTitle: string;
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
  apiBaseTitle: string;
  apiBasePlaceholder: string;
  apiKeyTitle: string;
  apiKeyPlaceholder: string;
  apiHelp: string;
  apiHint: string;
  apiEffectiveTitle: string;
  apiEffectiveBuiltin: string;
  apiEffectiveCustom: string;
  apiPrivacy: string;
  announcementTitle: string;
  announcementDescription: string;
  announcementList1: string;
  announcementList2: string;
  announcementList3: string;
  aboutTitle: string;
  aboutDescription: string;
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
  workflowDescription: '从这里进入功能分支，再选择捏脸、转画风或生成系列素材。',
  workflowHint: '点击开始后会打开功能入口弹窗。',
  workflowFormats: '支持 PNG / JPG / WEBP，推荐上传单人立绘或清晰半身图。',
    startButton: '开始',
    settingsButton: '设置',
    progressTitle: '工作流进度',
    progressDescription: '还没有开始任何工作流。进入对应入口后，进度和任务日志会显示在这里。',
    outputTitle: '阶段输出',
    outputDescription: '暂无输出。后续在捏脸、转画风和素材生成流程里的中间结果都会放到这里。',
    privacyNote: '本网站所有信息均在本地保存，不会上传你的角色社卡、个人信息或 API 私钥。',
    footerNote: 'Copyright © 2026 Mirako Company. Developed by Hanazar Ochikawa.',
    metricModules: '4 个功能入口',
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
    startModalTitle: '选择功能入口',
    startModalDescription: '先进入你现在要使用的功能分支。',
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
    tabAnnouncement: '公告',
    tabAbout: '关于',
    stylePresetTitle: '样式预设',
    stylePresetDefault: '默认样式',
    stylePresetPaper2Gal: 'paper2gal 官方样式',
    themeModeTitle: '模式',
    themeLight: '浅色',
    themeDeep: '深色',
    accentTitle: '配色样式',
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
    apiBaseTitle: 'API 地址',
    apiBasePlaceholder: 'https://your-api.example.com',
    apiKeyTitle: 'API Key',
    apiKeyPlaceholder: '填写你自己的 API Key',
    apiHelp: '所有接口配置只保存在当前浏览器本地。',
    apiHint: '静态页面只会读取这里填写的地址和密钥，不会主动上传其他角色信息。',
    apiEffectiveTitle: '当前生效地址',
    apiEffectiveBuiltin: '当前使用内置模型占位配置，后续可替换为你自己的本地或远程服务。',
    apiEffectiveCustom: '当前优先使用你填写的自定义 API 地址。',
    apiPrivacy: '本网站所有信息均在本地保存，不会上传任何角色社卡、个人信息或私钥。',
    announcementTitle: '公告',
    announcementDescription: '0.2.1 版本把捏脸编辑器切成 VRoid 风格三栏结构，并正式补上历史公告面板。',
    announcementList1: '捏脸页现在是左侧资产栏、中间透明画布、右侧参数栏，上方同时加入工具栏。',
    announcementList2: '返回首页前会判断当前项目是否保存，未保存时弹出更明确的提醒弹窗。',
    announcementList3: '公告页扩展为当前版本 + 历史版本列表，并补齐 0.1.0 到 0.2.0 的记录。',
    aboutTitle: '关于',
    aboutDescription: '这个项目会作为你的 OC 角色创作入口，集中管理角色编辑、画风处理和系列素材生成。',
    profileLinkLabel: 'GitHub 主页',
    repoLinkLabel: '仓库地址',
    pageFaceTitle: '捏脸编辑器',
    pageFaceDescription: '这里会放角色编辑器的主画布、部位切换、颜色控制和导出逻辑。',
    pageStyleTitle: '转画风',
    pageStyleDescription: '这里会放画风转换的输入输出、参数控制、任务状态与结果预览。',
    pagePromptTitle: '角色 Prompt + LLM / TTS 封装',
    pagePromptDescription: '这里会放角色资料、Prompt 模板、LLM 请求和语音封装配置。',
    pagePaperTitle: 'paper2gal 图片素材生成',
    pagePaperDescription: '这里会放 paper2gal 图片素材生成流程和后续的仓库联动入口。',
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
    workflowDescription: 'まず入口ページから機能分岐に入り、その後に各フローへ進めます。',
    workflowHint: '開始ボタンを押すと入口モーダルが開きます。',
    workflowFormats: 'PNG / JPG / WEBP に対応。単体キャラ立ち絵や鮮明な半身図を推奨します。',
    startButton: '開始',
    settingsButton: '設定',
    progressTitle: 'ワークフロー進捗',
    progressDescription: 'まだワークフローは開始されていません。開始後に進捗とログがここへ表示されます。',
    outputTitle: '段階出力',
    outputDescription: '現在は出力がありません。今後の中間結果や完成物はここに集約されます。',
    privacyNote: 'このサイトの情報はすべてローカル保存です。キャラ資料、個人情報、API キーはアップロードしません。',
    footerNote: 'Copyright © 2026 Mirako Company. Developed by Hanazar Ochikawa.',
    metricModules: '4 つの入口',
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
    startModalTitle: '機能入口を選択',
    startModalDescription: 'まず利用したい分岐を選んでください。',
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
    tabAnnouncement: 'お知らせ',
    tabAbout: '情報',
    stylePresetTitle: 'スタイルプリセット',
    stylePresetDefault: 'デフォルト',
    stylePresetPaper2Gal: 'paper2gal 公式',
    themeModeTitle: 'モード',
    themeLight: 'ライト',
    themeDeep: 'ダーク',
    accentTitle: '配色',
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
    apiBaseTitle: 'API URL',
    apiBasePlaceholder: 'https://your-api.example.com',
    apiKeyTitle: 'API Key',
    apiKeyPlaceholder: '自分の API Key を入力',
    apiHelp: 'すべての設定は現在のブラウザにだけ保存されます。',
    apiHint: 'ここで設定した URL とキーのみを読み取り、他のデータは送信しません。',
    apiEffectiveTitle: '現在の有効先',
    apiEffectiveBuiltin: '現在は内蔵プレースホルダー設定を使用しています。',
    apiEffectiveCustom: '現在は入力されたカスタム API を優先します。',
    apiPrivacy: 'このサイトの情報はすべてローカル保存です。',
    announcementTitle: 'お知らせ',
    announcementDescription: '0.2.1 では顔編集ページを VRoid 風の 3 カラム構成に作り替え、履歴公告も正式に整理しました。',
    announcementList1: '顔編集ページは左アセット欄・中央の透明キャンバス・右パラメータ欄の構成になりました。',
    announcementList2: 'ホームへ戻る前に保存状態を確認し、未保存ならより明確な警告モーダルを表示します。',
    announcementList3: '公告タブを現行バージョンと履歴一覧の二段構成に拡張し、0.1.0 からの履歴を補いました。',
    aboutTitle: '情報',
    aboutDescription: 'このプロジェクトは OC 制作の統合入口として機能します。',
    profileLinkLabel: 'GitHub プロフィール',
    repoLinkLabel: 'リポジトリ',
    pageFaceTitle: '顔編集',
    pageFaceDescription: 'ここには顔編集ワークスペースを配置します。',
    pageStyleTitle: '画風変換',
    pageStyleDescription: 'ここには画風変換フローを配置します。',
    pagePromptTitle: 'Prompt + LLM / TTS',
    pagePromptDescription: 'ここには Prompt 生成と音声封装を配置します。',
    pagePaperTitle: 'paper2gal 素材生成',
    pagePaperDescription: 'ここには paper2gal 画像素材フローを配置します。',
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
    workflowDescription: 'Enter through the main entry page first, then branch into the actual tool you want to use.',
    workflowHint: 'Press Start to open the entry selection modal.',
    workflowFormats: 'Supports PNG / JPG / WEBP. Single-character art or a clean half-body image is recommended.',
    startButton: 'Start',
    settingsButton: 'Settings',
    progressTitle: 'Workflow progress',
    progressDescription: 'No workflow has started yet. Progress logs will appear here after you enter a tool.',
    outputTitle: 'Stage outputs',
    outputDescription: 'No output yet. Future intermediate and final assets will be shown here.',
    privacyNote: 'Everything on this site stays local. No OC sheets, personal data, or API secrets are uploaded.',
    footerNote: 'Copyright © 2026 Mirako Company. Developed by Hanazar Ochikawa.',
    metricModules: '4 feature entries',
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
    startModalTitle: 'Choose an entry',
    startModalDescription: 'Select the branch you want to enter first.',
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
    tabAnnouncement: 'Announcement',
    tabAbout: 'About',
    stylePresetTitle: 'Style preset',
    stylePresetDefault: 'Default',
    stylePresetPaper2Gal: 'paper2gal official',
    themeModeTitle: 'Mode',
    themeLight: 'Light',
    themeDeep: 'Deep',
    accentTitle: 'Accent palette',
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
    apiBaseTitle: 'API endpoint',
    apiBasePlaceholder: 'https://your-api.example.com',
    apiKeyTitle: 'API key',
    apiKeyPlaceholder: 'Enter your API key',
    apiHelp: 'All interface settings stay in the current browser only.',
    apiHint: 'The static page reads only the address and key configured here.',
    apiEffectiveTitle: 'Current endpoint',
    apiEffectiveBuiltin: 'The app is using the built-in placeholder configuration right now.',
    apiEffectiveCustom: 'The app currently prioritizes your custom API endpoint.',
    apiPrivacy: 'Everything stays local in this browser.',
    announcementTitle: 'Announcement',
    announcementDescription: 'Version 0.2.1 reshapes the face maker into a VRoid-style three-panel editor and formalizes the history feed.',
    announcementList1: 'The face maker now uses a left asset rail, a central transparent stage, and a right parameter panel with a top toolbar.',
    announcementList2: 'Returning home now checks whether the draft is saved and warns more clearly when edits are still unsaved.',
    announcementList3: 'The announcement tab now includes the current release plus a historical changelog back to version 0.1.0.',
    aboutTitle: 'About',
    aboutDescription: 'This project is the unified entry point for your OC creation workflow.',
    profileLinkLabel: 'GitHub profile',
    repoLinkLabel: 'Repository',
    pageFaceTitle: 'Face Maker',
    pageFaceDescription: 'This page will host the face editor workspace.',
    pageStyleTitle: 'Style Transfer',
    pageStyleDescription: 'This page will host the style transfer workflow.',
    pagePromptTitle: 'Prompt + LLM / TTS',
    pagePromptDescription: 'This page will host prompt and voice tooling.',
    pagePaperTitle: 'paper2gal Asset Generation',
    pagePaperDescription: 'This page will host the paper2gal asset workflow.',
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
    workflowDescription: 'Сначала выберите входной раздел, а потом переходите в нужный инструмент.',
    workflowHint: 'Кнопка старта открывает модальное окно выбора входа.',
    workflowFormats: 'Поддерживаются PNG / JPG / WEBP. Рекомендуется одиночный персонаж или чистый полуторс.',
    startButton: 'Старт',
    settingsButton: 'Настройки',
    progressTitle: 'Прогресс workflow',
    progressDescription: 'Workflow ещё не запускался. После входа логи и прогресс появятся здесь.',
    outputTitle: 'Промежуточные результаты',
    outputDescription: 'Пока результатов нет. Будущие материалы будут отображаться здесь.',
    privacyNote: 'Вся информация хранится локально. Данные персонажа, личная информация и API-ключи не загружаются.',
    footerNote: 'Copyright © 2026 Mirako Company. Developed by Hanazar Ochikawa.',
    metricModules: '4 входа',
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
    startModalTitle: 'Выберите вход',
    startModalDescription: 'Сначала выберите нужную ветку.',
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
    tabAnnouncement: 'Объявление',
    tabAbout: 'О проекте',
    stylePresetTitle: 'Пресет стиля',
    stylePresetDefault: 'По умолчанию',
    stylePresetPaper2Gal: 'paper2gal',
    themeModeTitle: 'Режим',
    themeLight: 'Светлый',
    themeDeep: 'Тёмный',
    accentTitle: 'Палитра',
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
    apiBaseTitle: 'Адрес API',
    apiBasePlaceholder: 'https://your-api.example.com',
    apiKeyTitle: 'API-ключ',
    apiKeyPlaceholder: 'Введите API-ключ',
    apiHelp: 'Все настройки сохраняются только в текущем браузере.',
    apiHint: 'Страница читает только адрес и ключ, указанные здесь.',
    apiEffectiveTitle: 'Текущий адрес',
    apiEffectiveBuiltin: 'Сейчас используется встроенная заглушка.',
    apiEffectiveCustom: 'Сейчас приоритет у вашего адреса API.',
    apiPrivacy: 'Всё остаётся локально в браузере.',
    announcementTitle: 'Объявление',
    announcementDescription: 'Версия 0.2.1 переводит редактор лица в VRoid-подобную трёхпанельную схему и оформляет историю объявлений.',
    announcementList1: 'Редактор лица теперь состоит из левой панели ассетов, центральной прозрачной сцены и правой панели параметров.',
    announcementList2: 'Перед возвратом на главную теперь проверяется сохранённость черновика и показывается более явное предупреждение.',
    announcementList3: 'Во вкладке объявлений появился текущий релиз и полный список истории, начиная с версии 0.1.0.',
    aboutTitle: 'О проекте',
    aboutDescription: 'Этот проект служит единым входом в ваш рабочий процесс создания OC.',
    profileLinkLabel: 'GitHub профиль',
    repoLinkLabel: 'Репозиторий',
    pageFaceTitle: 'Редактор лица',
    pageFaceDescription: 'Здесь будет рабочее пространство редактора лица.',
    pageStyleTitle: 'Перенос стиля',
    pageStyleDescription: 'Здесь будет размещён workflow переноса стиля.',
    pagePromptTitle: 'Prompt + LLM / TTS',
    pagePromptDescription: 'Здесь будут prompt и голосовые инструменты.',
    pagePaperTitle: 'paper2gal генерация',
    pagePaperDescription: 'Здесь будет workflow генерации материалов paper2gal.',
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

const announcementHistory = [
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

const defaultSettings: SettingsState = {
  stylePreset: 'default',
  depth: 'deep',
  accent: 'ocean',
  language: 'zh',
  customFontFamily: '',
  interfaceMode: 'builtin',
  apiBaseUrl: '',
  apiKey: '',
  fontPreset: 'sans',
};

function App() {
  const [settings, setSettings] = useState<SettingsState>(defaultSettings);
  const [screen, setScreen] = useState<FeatureScreen>('home');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [modalStep, setModalStep] = useState<StartModalStep>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved) as Partial<SettingsState>;
      const nextSettings = { ...defaultSettings, ...parsed };

      if ((nextSettings as { fontPreset?: string }).fontPreset === 'rounded') {
        nextSettings.fontPreset = 'sans';
      }

      setSettings(nextSettings);
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  // Keep UI preferences local-only so the shell behaves like a desktop-style tool launcher.
  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const resolvedLanguage = translationAliases[settings.language];
  const messages = translations[resolvedLanguage];
  const effectivePreset = settings.stylePreset;
  const effectiveDepth: ThemeDepth = effectivePreset === 'paper2gal' ? 'light' : settings.depth;
  const effectiveAccent: AccentPalette = effectivePreset === 'paper2gal' ? 'rose' : settings.accent;

  const appClassName = [
    'app-shell',
    `preset-${effectivePreset}`,
    `depth-${effectiveDepth}`,
    `accent-${effectiveAccent}`,
    `font-${settings.fontPreset}`,
  ].join(' ');
  const appStyle =
    settings.fontPreset === 'custom' && settings.customFontFamily
      ? ({ ['--custom-font-family' as string]: settings.customFontFamily } as CSSProperties)
      : undefined;

  function updateSettings(patch: Partial<SettingsState>) {
    setSettings((current) => ({ ...current, ...patch }));
  }

  function navigateTo(nextScreen: Exclude<FeatureScreen, 'home'>) {
    setScreen(nextScreen);
    setModalStep(null);
  }

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
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenStart={() => setModalStep('root')}
        />
      ) : screen === 'face-maker' ? (
        <FaceMakerPage
          messages={messages}
          onBack={() => setScreen('home')}
          onOpenSettings={() => setIsSettingsOpen(true)}
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
          onBack={() => setModalStep('root')}
          onOpenSeries={() => setModalStep('series')}
          onSelect={navigateTo}
        />
      )}

      {isSettingsOpen && (
        <SettingsModal
          messages={messages}
          settings={settings}
          onClose={() => setIsSettingsOpen(false)}
          onUpdate={updateSettings}
        />
      )}
    </div>
  );
}

function HomeScreen({
  messages,
  onOpenSettings,
  onOpenStart,
}: {
  messages: Messages;
  onOpenSettings: () => void;
  onOpenStart: () => void;
}) {
  return (
    <main className="home-shell">
      <section className="top-banner fade-up delay-1">
        <div className="top-banner-copy">
          <h1>{messages.appTitle}</h1>
          <p>{messages.appSubtitle}</p>
        </div>
        <div className="top-banner-side">
          <div className="version-pill">
            <span>{messages.versionLabel}</span>
            <strong>{VERSION}</strong>
          </div>
          <button className="secondary-button top-settings-button" type="button" onClick={onOpenSettings}>
            {messages.settingsButton}
          </button>
        </div>
      </section>

      <section className="home-grid">
        <article className="home-card overview-card fade-up delay-2">
          <h2>{messages.overviewTitle}</h2>
          <p>{messages.overviewDescription}</p>

          <div className="metrics-row">
            <div className="metric-box">
              <strong>4</strong>
              <span>{messages.metricModules}</span>
            </div>
            <div className="metric-box">
              <strong>{languageOptions.length}</strong>
              <span>{messages.metricLanguages}</span>
            </div>
            <div className="metric-box">
              <strong>Local</strong>
              <span>{messages.metricStorage}</span>
            </div>
          </div>
        </article>

        <article className="home-card workflow-card fade-up delay-3">
          <h2>{messages.workflowTitle}</h2>
          <p>{messages.workflowDescription}</p>
          <div className="workflow-list horizontal">
            <div className="workflow-item compact">
              <ActionIcon kind="face-maker" />
              <span>{messages.featureFace}</span>
            </div>
            <div className="workflow-item compact">
              <ActionIcon kind="style-transfer" />
              <span>{messages.featureStyle}</span>
            </div>
            <div className="workflow-item compact">
              <ActionIcon kind="series" />
              <span>{messages.featureSeries}</span>
            </div>
          </div>

          <div className="upload-shell">
            <span className="upload-label">角色图片</span>
            <div className="upload-row">
              <button className="secondary-button upload-button" type="button">
                选择文件
              </button>
              <span className="upload-description">{messages.workflowFormats}</span>
            </div>
          </div>

          <div className="workflow-actions">
            <button className="primary-button giant-button" type="button" onClick={onOpenStart}>
              {messages.startButton}
            </button>
          </div>

          <p className="workflow-hint">{messages.workflowFormats}</p>
          <p className="workflow-subhint">{messages.workflowHint}</p>
        </article>
      </section>

      <section className="home-grid lower-grid">
        <article className="home-card fade-up delay-4">
          <h2>{messages.progressTitle}</h2>
          <p>{messages.progressDescription}</p>
        </article>

        <article className="home-card fade-up delay-5">
          <h2>{messages.outputTitle}</h2>
          <p>{messages.outputDescription}</p>
        </article>
      </section>

      <footer className="home-footer fade-up delay-6">
        <div className="notice-banner">{messages.privacyNote}</div>
        <p>{messages.footerNote}</p>
      </footer>
    </main>
  );
}

function FaceMakerPage({
  messages,
  onBack,
  onOpenSettings,
}: {
  messages: Messages;
  onBack: () => void;
  onOpenSettings: () => void;
}) {
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

  const assetGroups = [
    {
      title: '发型资产',
      key: 'hair' as const,
      items: [
        { value: 'air-bob', label: '空气波波' },
        { value: 'long-straight', label: '直长发' },
        { value: 'twin-tail', label: '双马尾' },
        { value: 'wolf-cut', label: '狼尾层次' },
      ],
    },
    {
      title: '眼型资产',
      key: 'eyes' as const,
      items: [
        { value: 'soft-round', label: '圆润眼' },
        { value: 'sharp', label: '上挑眼' },
        { value: 'sleepy', label: '慵懒眼' },
        { value: 'idol', label: '偶像眼' },
      ],
    },
    {
      title: '配件资产',
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
          <span>{isDirty ? '未保存' : '已保存'}</span>
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
            <span className={`save-indicator ${isDirty ? 'dirty' : 'clean'}`}>{isDirty ? '你还没保存' : '当前内容已保存'}</span>
            <button className="secondary-button small-button" type="button" onClick={resetDraft}>
              重置
            </button>
            <button className="secondary-button small-button" type="button" onClick={saveDraft}>
              保存草稿
            </button>
            <button className="primary-button small-button" type="button">
              导出
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
              <span>工作画板</span>
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
              <h3>参数调整</h3>
              <label className="slider-row">
                <span>头部比例</span>
                <input type="range" min="40" max="70" value={draft.headScale} onChange={(event) => updateDraft('headScale', Number(event.target.value))} />
              </label>
              <label className="slider-row">
                <span>眼睛大小</span>
                <input type="range" min="38" max="62" value={draft.eyeScale} onChange={(event) => updateDraft('eyeScale', Number(event.target.value))} />
              </label>
              <label className="slider-row">
                <span>嘴角弧度</span>
                <input type="range" min="40" max="64" value={draft.mouthCurve} onChange={(event) => updateDraft('mouthCurve', Number(event.target.value))} />
              </label>
              <label className="slider-row">
                <span>整体倾角</span>
                <input type="range" min="-10" max="10" value={draft.tilt} onChange={(event) => updateDraft('tilt', Number(event.target.value))} />
              </label>
            </section>

            <section className="editor-panel-block">
              <h3>项目状态</h3>
              <div className="status-stack">
                <div className="status-card-mini">
                  <strong>{draft.hair}</strong>
                  <span>当前发型</span>
                </div>
                <div className="status-card-mini">
                  <strong>{draft.eyes}</strong>
                  <span>当前眼型</span>
                </div>
                <div className="status-card-mini">
                  <strong>{draft.accessory}</strong>
                  <span>当前配件</span>
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
          isDirty={isDirty}
          onCancel={() => setIsConfirmOpen(false)}
          onConfirm={onBack}
        />
      )}
    </main>
  );
}

function ConfirmReturnModal({
  isDirty,
  onCancel,
  onConfirm,
}: {
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

  return (
    <div className={`modal-backdrop ${isClosing ? 'closing' : 'opening'}`} role="presentation" onClick={requestClose}>
      <section className={`modal-card confirm-modal modal-surface ${isClosing ? 'closing' : 'opening'}`} role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
        <button className="modal-close" type="button" onClick={requestClose} aria-label="Close">
          ×
        </button>
        <p className="section-label">返回提醒</p>
        <h2>确定返回首页吗？</h2>
        <p className="modal-description">{isDirty ? '你还没保存当前捏脸项目，返回后未保存的调整不会保留。' : '当前内容已经保存，返回首页后可以稍后再继续编辑。'}</p>
        <div className="confirm-actions">
          <button className="secondary-button" type="button" onClick={requestClose}>
            继续编辑
          </button>
          <button className="primary-button" type="button" onClick={confirmLeave}>
            确认返回
          </button>
        </div>
      </section>
    </div>
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
  kind: 'face-maker' | 'style-transfer' | 'series' | 'prompt-suite' | 'paper2gal';
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
    series: (
      <>
        <rect x="7" y="10" width="10" height="14" rx="3" />
        <rect x="17" y="16" width="10" height="14" rx="3" />
        <rect x="27" y="9" width="6" height="10" rx="2" />
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
  onBack,
  onOpenSeries,
  onSelect,
}: {
  step: Exclude<StartModalStep, null>;
  messages: Messages;
  onClose: () => void;
  onBack: () => void;
  onOpenSeries: () => void;
  onSelect: (screen: Exclude<FeatureScreen, 'home'>) => void;
}) {
  const isSeriesStep = step === 'series';
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
        <h2>{isSeriesStep ? messages.startModalSeriesTitle : messages.startModalTitle}</h2>
        <p className="modal-description">
          {isSeriesStep ? messages.startModalSeriesDescription : messages.startModalDescription}
        </p>

        <div className={`action-grid ${isSeriesStep ? 'series-grid' : 'root-grid'}`}>
          {!isSeriesStep ? (
            <>
              <button className="action-tile" type="button" onClick={() => onSelect('face-maker')}>
                <ActionIcon kind="face-maker" />
                <strong>{messages.actionFace}</strong>
              </button>
              <button className="action-tile" type="button" onClick={() => onSelect('style-transfer')}>
                <ActionIcon kind="style-transfer" />
                <strong>{messages.actionStyle}</strong>
              </button>
              <button className="action-tile" type="button" onClick={onOpenSeries}>
                <ActionIcon kind="series" />
                <strong>{messages.actionSeries}</strong>
              </button>
            </>
          ) : (
            <>
              <button className="action-tile" type="button" onClick={() => onSelect('prompt-suite')}>
                <ActionIcon kind="prompt-suite" />
                <strong>{messages.actionPromptSuite}</strong>
              </button>
              <button className="action-tile" type="button" onClick={() => onSelect('paper2gal')}>
                <ActionIcon kind="paper2gal" />
                <strong>{messages.actionPaper2Gal}</strong>
              </button>
            </>
          )}
        </div>

        {isSeriesStep && (
          <button className="back-link" type="button" onClick={onBack}>
            {messages.actionBack}
          </button>
        )}
      </section>
    </div>
  );
}

function SettingsModal({
  messages,
  settings,
  onClose,
  onUpdate,
}: {
  messages: Messages;
  settings: SettingsState;
  onClose: () => void;
  onUpdate: (patch: Partial<SettingsState>) => void;
}) {
  const [tab, setTab] = useState<SettingsTab>('style');
  const [isClosing, setIsClosing] = useState(false);
  const [selectedAnnouncementVersion, setSelectedAnnouncementVersion] = useState<
    (typeof announcementHistory)[number]['version']
  >(announcementHistory[0].version);
  const styleLocked = settings.stylePreset === 'paper2gal';
  const resolvedLanguage = translationAliases[settings.language];
  const effectiveEndpoint =
    settings.interfaceMode === 'custom' && settings.apiBaseUrl
      ? settings.apiBaseUrl
      : settings.interfaceMode === 'custom'
        ? 'https://your-api.example.com'
        : 'builtin://placeholder-model';

  const tabs: Array<{ key: SettingsTab; label: string }> = [
    { key: 'style', label: messages.tabStyle },
    { key: 'language', label: messages.tabLanguage },
    { key: 'api', label: messages.tabApi },
    { key: 'announcement', label: messages.tabAnnouncement },
    { key: 'about', label: messages.tabAbout },
  ];

  const selectedAnnouncement =
    announcementHistory.find((item) => item.version === selectedAnnouncementVersion) ?? announcementHistory[0];

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

                {settings.interfaceMode === 'custom' && (
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
                  <p className="muted-copy">{effectiveEndpoint}</p>
                  <p>{settings.interfaceMode === 'custom' ? messages.apiEffectiveCustom : messages.apiEffectiveBuiltin}</p>
                  <p className="tiny-copy">{messages.apiPrivacy}</p>
                </section>
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
                      <span>{item.date}</span>
                      <strong>{item.version}</strong>
                      <p>{item.summary}</p>
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
