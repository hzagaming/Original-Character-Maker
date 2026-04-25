export type StylePreset = 'default' | 'paper2gal' | 'preset1' | 'preset2';
export type ThemeDepth = 'light' | 'deep';
export type AccentPalette =
  | 'ocean'
  | 'emerald'
  | 'amber'
  | 'rose'
  | 'violet'
  | 'slate'
  | 'crimson'
  | 'teal'
  | 'gold'
  | 'cyan'
  | 'custom';

export type AppLanguage =
  | 'zh'
  | 'ja'
  | 'en'
  | 'ru'
  | 'ko'
  | 'fr'
  | 'de'
  | 'es'
  | 'it'
  | 'pt'
  | 'cs'
  | 'da'
  | 'nl'
  | 'el'
  | 'hi'
  | 'hu'
  | 'id'
  | 'no'
  | 'pl'
  | 'ro'
  | 'sk'
  | 'sv'
  | 'th'
  | 'tr'
  | 'uk'
  | 'vi'
  | 'ms'
  | 'fi'
  | 'bg'
  | 'lt';

export type FontPreset =
  | 'sans'
  | 'serif'
  | 'mono'
  | 'heiti'
  | 'songti'
  | 'kaiti'
  | 'georgia'
  | 'times'
  | 'verdana'
  | 'fira'
  | 'custom';

export type InterfaceMode = 'builtin' | 'custom';
export type ApiPreset = 'plato' | 'custom1' | 'custom2' | 'custom3';

export type FeatureScreen = 'home' | 'face-maker' | 'style-transfer' | 'prompt-suite' | 'llm-hub' | 'tts-export' | 'paper2gal' | 'image-converter' | 'docs';
export type SettingsTab = 'style' | 'language' | 'audio' | 'animation' | 'performance' | 'api' | 'llm' | 'shortcuts' | 'others' | 'announcement' | 'about';
export type StartModalStep = 'root' | null;

export type ShortcutAction =
  | 'saveDocument'
  | 'bold'
  | 'italic'
  | 'underline'
  | 'strikeThrough'
  | 'subscript'
  | 'superscript'
  | 'blockquote'
  | 'heading1'
  | 'heading2'
  | 'heading3'
  | 'heading4'
  | 'heading5'
  | 'heading6'
  | 'unorderedList'
  | 'orderedList'
  | 'justifyLeft'
  | 'justifyCenter'
  | 'justifyRight'
  | 'justifyFull'
  | 'indent'
  | 'outdent'
  | 'insertLink'
  | 'insertTable'
  | 'insertHr'
  | 'insertCodeBlock'
  | 'insertImage'
  | 'clearHighlight'
  | 'undo'
  | 'redo'
  | 'selectAll'
  | 'clearFormat'
  | 'goHome'
  | 'openSettings'
  | 'startWorkflow'
  | 'abortWorkflow'
  | 'exportDocument'
  | 'copySelection'
  | 'pasteSelection'
  | 'undoAction'
  | 'redoAction'
  | 'focusSearch'
  | 'toggleSidebar'
  | 'nextTab'
  | 'prevTab'
  | 'toggleTheme'
  | 'toggleFullscreen'
  | 'refreshPage'
  | 'toggleMute';

export type ShortcutMap = Record<ShortcutAction, string>;

export type SoundPreset =
  | 'classic' | 'electronic' | 'retro' | 'xylophone' | 'bell'
  | 'space' | 'drum' | 'piano' | 'synthwave' | 'chiptune'
  | 'strings' | 'wind' | 'jazz' | 'percussion' | 'ambient'
  | 'scifi' | 'cartoon' | 'horror' | 'nature' | 'mechanical';

export type MusicPreset =
  | 'orchestral' | 'ambient' | 'electronic' | 'piano' | 'synthwave'
  | 'nature' | 'jazz' | 'meditation' | 'cyber' | 'lofi'
  | 'rock' | 'blues' | 'folk' | 'reggae' | 'funk'
  | 'soul' | 'gospel' | 'country' | 'celtic' | 'oriental'
  | 'tribal' | 'space' | 'underwater' | 'rain' | 'windchime'
  | 'fireplace' | 'night' | 'sunrise' | 'dreamy' | 'energetic'
  | 'battle' | 'adventure' | 'mystery' | 'romantic' | 'nostalgic'
  | 'hopeful' | 'epic' | 'chill' | 'study' | 'focus';

export interface AudioSettings {
  masterVolume: number;
  sfxVolume: number;
  musicVolume: number;
  sfxEnabled: boolean;
  musicEnabled: boolean;
  soundOnInteract: boolean;
  sfxPreset: SoundPreset;
  musicPreset: MusicPreset;
  sfxPitch: number;
  sfxDurationScale: number;
  sfxFilterFreq: number;
  sfxDetune: number;
  sfxReverb: number;
  musicPitch: number;
  musicTempo: number;
  // advanced granular controls
  sfxAttack: number;
  sfxDecay: number;
  sfxSustain: number;
  sfxRelease: number;
  sfxPan: number;
  musicReverb: number;
  musicFilter: number;
  musicStereoWidth: number;
  // custom audio files
  useCustomSfx: boolean;
  useCustomMusic: boolean;
  customSfxDataUrl: string | null;
  customMusicDataUrl: string | null;
  customSfxName: string;
  customMusicName: string;
}

export interface AnimationSettings {
  enabled: boolean;
  speed: number; // 20 ~ 200, percentage of base speed
  uiFadeIn: boolean;
  buttonHover: boolean;
  pageTransitions: boolean;
  modalTransitions: boolean;
}

export interface PerformanceSettings {
  reduceAnimations: boolean;
  disableGlassmorphism: boolean;
  lowResolutionPreviews: boolean;
  lazyLoadModules: boolean;
  disableParticles: boolean;
  aggressiveCaching: boolean;
  devMode: boolean;
  imagePreviewQuality: 'low' | 'medium' | 'high';
  maxConcurrentRequests: number;
}

export interface OtherSettings {
  showTooltips: boolean;
  confirmDestructiveActions: boolean;
  showKeyboardHints: boolean;
  smoothScroll: boolean;
  enableNotificationSound: boolean;
  autoSaveInterval: number; // minutes, 0 = off
  dateFormat: 'iso' | 'locale' | 'friendly';
  showClock: boolean;
  enableStatusBar: boolean;
  highContrastFocus: boolean;
}

export interface SavedStylePreset {
  name: string;
  stylePreset: StylePreset;
  depth: ThemeDepth;
  accent: AccentPalette;
  customAccentColor: string;
  contrast: number;
  borderWidth: number;
  fontPreset: FontPreset;
  customFontFamily: string;
}

export interface LlmSettings {
  model: string;
  temperature: number;
  topP: number;
  maxTokens: number;
  frequencyPenalty: number;
  presencePenalty: number;
  stopSequences: string;
  responseFormat: 'text' | 'json_object';
  seed: number;
  topK: number;
  systemPrompt: string;
  timeoutMs: number;
  retryCount: number;
}

export interface SettingsState {
  stylePreset: StylePreset;
  depth: ThemeDepth;
  accent: AccentPalette;
  customAccentColor: string;
  contrast: number;
  borderWidth: number;
  language: AppLanguage;
  fontPreset: FontPreset;
  customFontFamily: string;
  interfaceMode: InterfaceMode;
  apiPreset: ApiPreset;
  apiBaseUrl: string;
  apiKey: string;
  apiBaseUrl2: string;
  apiKey2: string;
  apiBaseUrl3: string;
  apiKey3: string;
  apiCustom1ForStyleTransfer: boolean;
  apiCustom1ForPaper2Gal: boolean;
  apiCustom2ForStyleTransfer: boolean;
  apiCustom2ForPaper2Gal: boolean;
  apiCustom3ForStyleTransfer: boolean;
  apiCustom3ForPaper2Gal: boolean;
  shortcutMap: ShortcutMap;
  audio: AudioSettings;
  animation: AnimationSettings;
  performance: PerformanceSettings;
  others: OtherSettings;
  llm: LlmSettings;
  savedPresets: [SavedStylePreset | null, SavedStylePreset | null];
}
