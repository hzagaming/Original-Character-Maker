export type StylePreset = 'default' | 'paper2gal';
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
export type ApiPreset = 'plato';

export type FeatureScreen = 'home' | 'face-maker' | 'style-transfer' | 'prompt-suite' | 'paper2gal';
export type SettingsTab = 'style' | 'language' | 'audio' | 'animation' | 'api' | 'shortcuts' | 'announcement' | 'about';
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
  | 'clearFormat';

export type ShortcutMap = Record<ShortcutAction, string>;

export type SoundPreset =
  | 'classic' | 'electronic' | 'retro' | 'xylophone' | 'bell'
  | 'space' | 'drum' | 'piano' | 'synthwave' | 'chiptune'
  | 'strings' | 'wind' | 'jazz' | 'percussion' | 'ambient'
  | 'scifi' | 'cartoon' | 'horror' | 'nature' | 'mechanical';

export type MusicPreset =
  | 'orchestral' | 'ambient' | 'electronic' | 'piano' | 'synthwave'
  | 'nature' | 'jazz' | 'meditation' | 'cyber' | 'lofi';

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
}

export interface AnimationSettings {
  enabled: boolean;
  speed: number; // 20 ~ 200, percentage of base speed
  uiFadeIn: boolean;
  buttonHover: boolean;
  pageTransitions: boolean;
  modalTransitions: boolean;
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
  shortcutMap: ShortcutMap;
  audio: AudioSettings;
  animation: AnimationSettings;
}
