export type StylePreset = 'default' | 'paper2gal';
export type ThemeDepth = 'light' | 'deep';
export type AccentPalette = 'ocean' | 'emerald' | 'amber' | 'rose' | 'violet' | 'slate';
export type AppLanguage = 'zh' | 'ja' | 'en' | 'ru';
export type FontPreset = 'sans' | 'rounded' | 'serif';
export type InterfaceMode = 'builtin' | 'custom';
export type FeatureScreen = 'home' | 'face-maker' | 'style-transfer' | 'prompt-suite' | 'paper2gal';
export type SettingsTab = 'style' | 'language' | 'api' | 'announcement' | 'about';
export type StartModalStep = 'root' | 'series' | null;

export interface SettingsState {
  stylePreset: StylePreset;
  depth: ThemeDepth;
  accent: AccentPalette;
  language: AppLanguage;
  fontPreset: FontPreset;
  interfaceMode: InterfaceMode;
  apiBaseUrl: string;
  apiKey: string;
}
