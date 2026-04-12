import { useEffect, useState } from 'react';
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

const VERSION = '0.1.1';
const STORAGE_KEY = 'oc-maker.settings';

type Messages = {
  appTitle: string;
  appSubtitle: string;
  versionLabel: string;
  overviewTitle: string;
  overviewDescription: string;
  workflowTitle: string;
  workflowDescription: string;
  workflowHint: string;
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

const translations: Record<AppLanguage, Messages> = {
  zh: {
    appTitle: 'Original Character Maker',
    appSubtitle: '自定义 OC 角色中控台',
    versionLabel: '版本',
    overviewTitle: '角色创作入口',
    overviewDescription:
      '把捏脸、转画风、角色 Prompt / LLM / TTS 封装与 paper2gal 素材生成统一到同一个入口页里，进入后就能按分支继续创作。',
    workflowTitle: '开始新的工作流',
    workflowDescription: '从这里进入功能分支，再选择捏脸、转画风或生成系列素材。',
    workflowHint: '进入入口页后，可以继续选择对应的创作流程。',
    startButton: '开始',
    settingsButton: '设置',
    progressTitle: '工作流进度',
    progressDescription: '还没有开始任何工作流。进入对应入口后，进度和任务日志会显示在这里。',
    outputTitle: '阶段输出',
    outputDescription: '暂无输出。后续在捏脸、转画风和素材生成流程里的中间结果都会放到这里。',
    privacyNote: '本网站所有信息均在本地保存，不会上传你的角色社卡、个人信息或 API 私钥。',
    footerNote: 'Copyright © 2026 Mirako Company. Developed by Hanazar Ochikawa.',
    metricModules: '4 个功能入口',
    metricLanguages: '4 种界面语言',
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
    announcementDescription: '0.1.1 版本完成了首页重排、样式同步和基础交互动效整理。',
    announcementList1: '首页布局改为顶栏、双列主体和底部双卡结构，开始与设置按钮已移入右侧主操作区。',
    announcementList2: '修正了设置面板与 paper2gal 主题不同步的问题，并新增字体设置。',
    announcementList3: '补充了渐显动画，清理了站内自述型文案，统一调整为面向用户的产品文案。',
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
    workflowHint: '現時点ではサイト骨組みと入口整理を優先しています。',
    startButton: '開始',
    settingsButton: '設定',
    progressTitle: 'ワークフロー進捗',
    progressDescription: 'まだワークフローは開始されていません。開始後に進捗とログがここへ表示されます。',
    outputTitle: '段階出力',
    outputDescription: '現在は出力がありません。今後の中間結果や完成物はここに集約されます。',
    privacyNote: 'このサイトの情報はすべてローカル保存です。キャラ資料、個人情報、API キーはアップロードしません。',
    footerNote: 'Copyright © 2026 Mirako Company. Developed by Hanazar Ochikawa.',
    metricModules: '4 つの入口',
    metricLanguages: '4 言語対応',
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
    announcementDescription: '0.1.1 ではホーム再設計、テーマ同期、基本アニメーションを整えました。',
    announcementList1: '開始ボタンと設定ボタンを右側の主操作カードへ移動しました。',
    announcementList2: 'paper2gal テーマと設定パネルの見た目を同期しました。',
    announcementList3: '文言を整理し、字体切替とフェード演出を追加しました。',
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
    workflowHint: 'This release focuses on the shell, layout, and navigation structure.',
    startButton: 'Start',
    settingsButton: 'Settings',
    progressTitle: 'Workflow progress',
    progressDescription: 'No workflow has started yet. Progress logs will appear here after you enter a tool.',
    outputTitle: 'Stage outputs',
    outputDescription: 'No output yet. Future intermediate and final assets will be shown here.',
    privacyNote: 'Everything on this site stays local. No OC sheets, personal data, or API secrets are uploaded.',
    footerNote: 'Copyright © 2026 Mirako Company. Developed by Hanazar Ochikawa.',
    metricModules: '4 feature entries',
    metricLanguages: '4 interface languages',
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
    announcementDescription: 'Version 0.1.1 refreshes the homepage layout, theme sync, and entrance flow polish.',
    announcementList1: 'Start and settings were moved into the main action area on the right.',
    announcementList2: 'paper2gal theme styling now syncs across the site and settings modal.',
    announcementList3: 'Font switching and fade-in transitions were added, and internal-sounding copy was removed.',
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
    workflowHint: 'Сейчас акцент сделан на каркасе сайта и маршрутах входа.',
    startButton: 'Старт',
    settingsButton: 'Настройки',
    progressTitle: 'Прогресс workflow',
    progressDescription: 'Workflow ещё не запускался. После входа логи и прогресс появятся здесь.',
    outputTitle: 'Промежуточные результаты',
    outputDescription: 'Пока результатов нет. Будущие материалы будут отображаться здесь.',
    privacyNote: 'Вся информация хранится локально. Данные персонажа, личная информация и API-ключи не загружаются.',
    footerNote: 'Copyright © 2026 Mirako Company. Developed by Hanazar Ochikawa.',
    metricModules: '4 входа',
    metricLanguages: '4 языка',
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
    announcementDescription: 'Версия 0.1.1 обновила главную страницу, синхронизацию тем и базовые анимации.',
    announcementList1: 'Кнопки старта и настроек перенесены в основную правую карточку.',
    announcementList2: 'Тема paper2gal синхронизирована с панелью настроек.',
    announcementList3: 'Добавлены смена шрифта и плавные появления элементов.',
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
  label: Record<AppLanguage, string>;
}> = [
  { value: 'ocean', swatch: '#4da3ff', label: { zh: '海蓝', ja: 'オーシャン', en: 'Ocean', ru: 'Океан' } },
  { value: 'emerald', swatch: '#45d08d', label: { zh: '翡翠', ja: 'エメラルド', en: 'Emerald', ru: 'Изумруд' } },
  { value: 'amber', swatch: '#f5b94f', label: { zh: '琥珀', ja: 'アンバー', en: 'Amber', ru: 'Янтарь' } },
  { value: 'rose', swatch: '#f36a9d', label: { zh: '玫瑰', ja: 'ローズ', en: 'Rose', ru: 'Роза' } },
  { value: 'violet', swatch: '#9370ff', label: { zh: '紫藤', ja: 'バイオレット', en: 'Violet', ru: 'Фиалка' } },
  { value: 'slate', swatch: '#9bb2c9', label: { zh: '石墨', ja: 'スレート', en: 'Slate', ru: 'Сланец' } },
];

const languageOptions: Array<{
  value: AppLanguage;
  label: Record<AppLanguage, string>;
}> = [
  { value: 'zh', label: { zh: '中文', ja: '中国語', en: 'Chinese', ru: 'Китайский' } },
  { value: 'ja', label: { zh: '日文', ja: '日本語', en: 'Japanese', ru: 'Японский' } },
  { value: 'en', label: { zh: '英文', ja: '英語', en: 'English', ru: 'Английский' } },
  { value: 'ru', label: { zh: '俄文', ja: 'ロシア語', en: 'Russian', ru: 'Русский' } },
];

const defaultSettings: SettingsState = {
  stylePreset: 'default',
  depth: 'deep',
  accent: 'ocean',
  language: 'zh',
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
      setSettings({ ...defaultSettings, ...parsed });
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  // Keep UI preferences local-only so the shell behaves like a desktop-style tool launcher.
  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const messages = translations[settings.language];
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

  function updateSettings(patch: Partial<SettingsState>) {
    setSettings((current) => ({ ...current, ...patch }));
  }

  function navigateTo(nextScreen: Exclude<FeatureScreen, 'home'>) {
    setScreen(nextScreen);
    setModalStep(null);
  }

  return (
    <div className={appClassName}>
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
  const features = [
    messages.featureFace,
    messages.featureStyle,
    messages.featureSeries,
    messages.featurePrompt,
    messages.featurePaper,
  ];

  return (
    <main className="home-shell">
      <section className="top-banner fade-up delay-1">
        <div className="top-banner-copy">
          <h1>{messages.appTitle}</h1>
          <p>{messages.appSubtitle}</p>
        </div>
        <div className="version-pill">
          <span>{messages.versionLabel}</span>
          <strong>{VERSION}</strong>
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
              <strong>4</strong>
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

          <div className="feature-pill-row">
            {features.map((feature) => (
              <span key={feature} className="feature-pill">
                {feature}
              </span>
            ))}
          </div>

          <div className="workflow-actions">
            <button className="primary-button giant-button" type="button" onClick={onOpenStart}>
              {messages.startButton}
            </button>
            <button className="secondary-button giant-button" type="button" onClick={onOpenSettings}>
              {messages.settingsButton}
            </button>
          </div>

          <p className="workflow-hint">{messages.workflowHint}</p>
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
        <p>{messages.privacyNote}</p>
        <p>{messages.footerNote}</p>
      </footer>
    </main>
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

      <p className="feature-hint fade-up delay-6">{messages.placeholderHint}</p>
    </main>
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

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <section className="modal-card action-modal fade-up delay-1" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
        <button className="modal-close" type="button" onClick={onClose} aria-label="Close">
          ×
        </button>

        <p className="section-label">{messages.appSubtitle}</p>
        <h2>{isSeriesStep ? messages.startModalSeriesTitle : messages.startModalTitle}</h2>
        <p className="modal-description">
          {isSeriesStep ? messages.startModalSeriesDescription : messages.startModalDescription}
        </p>

        <div className="action-grid">
          {!isSeriesStep ? (
            <>
              <button className="action-tile" type="button" onClick={() => onSelect('face-maker')}>
                <span>01</span>
                <strong>{messages.actionFace}</strong>
              </button>
              <button className="action-tile" type="button" onClick={() => onSelect('style-transfer')}>
                <span>02</span>
                <strong>{messages.actionStyle}</strong>
              </button>
              <button className="action-tile" type="button" onClick={onOpenSeries}>
                <span>03</span>
                <strong>{messages.actionSeries}</strong>
              </button>
            </>
          ) : (
            <>
              <button className="action-tile" type="button" onClick={() => onSelect('prompt-suite')}>
                <span>03-A</span>
                <strong>{messages.actionPromptSuite}</strong>
              </button>
              <button className="action-tile" type="button" onClick={() => onSelect('paper2gal')}>
                <span>03-B</span>
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
  const styleLocked = settings.stylePreset === 'paper2gal';
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

  const currentFontOptions = [
    { value: 'sans' as const, label: messages.fontSans },
    { value: 'rounded' as const, label: messages.fontRounded },
    { value: 'serif' as const, label: messages.fontSerif },
  ];

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <section className="modal-card settings-modal fade-up delay-1" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
        <button className="modal-close" type="button" onClick={onClose} aria-label="Close">
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
                        {item.label[settings.language]}
                      </button>
                    ))}
                  </div>
                </section>

                <section className="settings-section">
                  <h3>{messages.fontTitle}</h3>
                  <div className="palette-grid">
                    {currentFontOptions.map((item) => (
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
                      {item.label[settings.language]}
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

                <section className="settings-section tip-section">
                  <h3>{messages.apiEffectiveTitle}</h3>
                  <p className="muted-copy">{effectiveEndpoint}</p>
                  <p>{settings.interfaceMode === 'custom' ? messages.apiEffectiveCustom : messages.apiEffectiveBuiltin}</p>
                  <p className="tiny-copy">{messages.apiPrivacy}</p>
                </section>
              </>
            )}

            {tab === 'announcement' && (
              <section className="settings-section">
                <h3>{messages.announcementTitle}</h3>
                <p>{messages.announcementDescription}</p>
                <div className="announcement-card">
                  <strong>{VERSION}</strong>
                  <ul>
                    <li>{messages.announcementList1}</li>
                    <li>{messages.announcementList2}</li>
                    <li>{messages.announcementList3}</li>
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
