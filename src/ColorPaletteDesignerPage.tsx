import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { playSound } from './audioEngine';
import type { AppLanguage, SettingsState } from './types';

// ─── Types ───

export type PaletteSlot = 'primary' | 'secondary' | 'accent' | 'text';

export type PaletteColor = {
  slot: PaletteSlot;
  hex: string;
  nameKey: string;
};

export type ColorPreset = {
  id: string;
  nameKey: string;
  colors: Record<PaletteSlot, string>;
};

export type PaletteSet = {
  id: string;
  name: string;
  createdAt: string;
  colors: Record<PaletteSlot, string>;
};

// ─── Color utilities ───

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const h = hex.replace('#', '');
  const bigint = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16);
  if (Number.isNaN(bigint)) return null;
  return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 };
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
}

function hexToHsl(hex: string): { h: number; s: number; l: number } | null {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  const { r, g, b } = rgb;
  const nr = r / 255;
  const ng = g / 255;
  const nb = b / 255;
  const max = Math.max(nr, ng, nb);
  const min = Math.min(nr, ng, nb);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case nr: h = ((ng - nb) / d + (ng < nb ? 6 : 0)) / 6; break;
      case ng: h = ((nb - nr) / d + 2) / 6; break;
      case nb: h = ((nr - ng) / d + 4) / 6; break;
    }
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
}

function hslToHex(h: number, s: number, l: number): string {
  const hr = h / 360;
  const sr = s / 100;
  const lr = l / 100;
  let r: number, g: number, b: number;
  if (sr === 0) {
    r = g = b = lr;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = lr < 0.5 ? lr * (1 + sr) : lr + sr - lr * sr;
    const p = 2 * lr - q;
    r = hue2rgb(p, q, hr + 1 / 3);
    g = hue2rgb(p, q, hr);
    b = hue2rgb(p, q, hr - 1 / 3);
  }
  return rgbToHex(Math.round(r * 255), Math.round(g * 255), Math.round(b * 255));
}

function luminance(hex: string): number {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;
  const { r, g, b } = rgb;
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function contrastRatio(a: string, b: string): number {
  const l1 = luminance(a);
  const l2 = luminance(b);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function generateHarmony(baseHex: string, mode: 'complementary' | 'analogous' | 'triadic' | 'split' | 'tetradic'): Record<PaletteSlot, string> {
  const hsl = hexToHsl(baseHex);
  if (!hsl) return { primary: baseHex, secondary: baseHex, accent: baseHex, text: '#eef4fb' };
  const { h, s, l } = hsl;
  switch (mode) {
    case 'complementary':
      return {
        primary: baseHex,
        secondary: hslToHex((h + 180) % 360, Math.max(20, s * 0.7), Math.min(85, l + 15)),
        accent: hslToHex((h + 180) % 360, s, Math.max(35, Math.min(65, l))),
        text: l > 50 ? '#1a2332' : '#eef4fb',
      };
    case 'analogous':
      return {
        primary: baseHex,
        secondary: hslToHex((h + 30) % 360, Math.max(25, s * 0.8), Math.min(85, l + 10)),
        accent: hslToHex((h - 30 + 360) % 360, Math.max(30, s * 0.9), Math.max(35, Math.min(65, l))),
        text: l > 50 ? '#1a2332' : '#eef4fb',
      };
    case 'triadic':
      return {
        primary: baseHex,
        secondary: hslToHex((h + 120) % 360, Math.max(20, s * 0.7), Math.min(85, l + 12)),
        accent: hslToHex((h + 240) % 360, Math.max(30, s * 0.8), Math.max(35, Math.min(65, l))),
        text: l > 50 ? '#1a2332' : '#eef4fb',
      };
    case 'split':
      return {
        primary: baseHex,
        secondary: hslToHex((h + 150) % 360, Math.max(20, s * 0.7), Math.min(85, l + 10)),
        accent: hslToHex((h + 210) % 360, Math.max(30, s * 0.8), Math.max(35, Math.min(65, l))),
        text: l > 50 ? '#1a2332' : '#eef4fb',
      };
    case 'tetradic':
      return {
        primary: baseHex,
        secondary: hslToHex((h + 90) % 360, Math.max(20, s * 0.7), Math.min(85, l + 8)),
        accent: hslToHex((h + 180) % 360, Math.max(30, s * 0.8), Math.max(35, Math.min(65, l))),
        text: l > 50 ? '#1a2332' : '#eef4fb',
      };
    default:
      return { primary: baseHex, secondary: baseHex, accent: baseHex, text: '#eef4fb' };
  }
}

// ─── Presets ───

const PRESETS: ColorPreset[] = [
  { id: 'classic-blue', nameKey: 'presetClassicBlue', colors: { primary: '#3b6ea5', secondary: '#8aa4c0', accent: '#f4a261', text: '#eef4fb' } },
  { id: 'rose-gold', nameKey: 'presetRoseGold', colors: { primary: '#d4a5a5', secondary: '#f2e2e2', accent: '#c9a227', text: '#2d1b1b' } },
  { id: 'forest-mist', nameKey: 'presetForestMist', colors: { primary: '#2d6a4f', secondary: '#74c69d', accent: '#d8f3dc', text: '#eef4fb' } },
  { id: 'sunset-ember', nameKey: 'presetSunsetEmber', colors: { primary: '#e76f51', secondary: '#f4a261', accent: '#e9c46a', text: '#1a0f0a' } },
  { id: 'cyber-neon', nameKey: 'presetCyberNeon', colors: { primary: '#0d0221', secondary: '#3d1e6d', accent: '#00f5d4', text: '#ffffff' } },
  { id: 'monochrome', nameKey: 'presetMonochrome', colors: { primary: '#2b2d42', secondary: '#8d99ae', accent: '#edf2f4', text: '#edf2f4' } },
  { id: 'pastel-dream', nameKey: 'presetPastelDream', colors: { primary: '#cdb4db', secondary: '#ffc8dd', accent: '#a2d2ff', text: '#3a2e3e' } },
  { id: 'dark-royal', nameKey: 'presetDarkRoyal', colors: { primary: '#240046', secondary: '#3c096c', accent: '#e0aaff', text: '#f0e6ff' } },
];

// ─── Storage helpers ───

const STORAGE_KEY = 'oc-maker.color-palette';
const HISTORY_KEY = 'oc-maker.color-palette-history';
const FAVORITES_KEY = 'oc-maker.color-palette-favorites';

function loadState<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed === null) return fallback;
      if (Array.isArray(fallback) && Array.isArray(parsed)) return parsed as T;
      if (!Array.isArray(fallback) && typeof parsed === 'object') return parsed as T;
    }
  } catch { /* ignore */ }
  return fallback;
}

function saveState(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch { /* ignore */ }
}

// ─── Extract dominant colors from image ───

function extractDominantColors(image: HTMLImageElement, count = 4): string[] {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return [];
  const size = 64;
  canvas.width = size;
  canvas.height = size;
  ctx.drawImage(image, 0, 0, size, size);
  let data: Uint8ClampedArray;
  try {
    data = ctx.getImageData(0, 0, size, size).data;
  } catch {
    return [];
  }
  const buckets = new Map<string, number>();
  for (let i = 0; i < data.length; i += 16) {
    const r = Math.round(data[i] / 16) * 16;
    const g = Math.round(data[i + 1] / 16) * 16;
    const b = Math.round(data[i + 2] / 16) * 16;
    const a = data[i + 3];
    if (a < 128) continue;
    const key = rgbToHex(r, g, b);
    buckets.set(key, (buckets.get(key) || 0) + 1);
  }
  const sorted = Array.from(buckets.entries()).sort((a, b) => b[1] - a[1]).slice(0, count);
  return sorted.map(([hex]) => hex);
}

// ─── Page props ───

type ColorPalettePageProps = {
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onNavigate?: (screen: Exclude<import('./types').FeatureScreen, 'home'>) => void;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onOpenDocs?: (toolId?: string, section?: string, errorCode?: string) => void;
};

// ─── Main component ───

export default function ColorPaletteDesignerPage({
  appSubtitle,
  backHome,
  openSettings,
  pageTitle,
  pageDescription,
  settings,
  language,
  onBack,
  onOpenSettings,
}: ColorPalettePageProps) {
  const [colors, setColors] = useState<Record<PaletteSlot, string>>(() => {
    const saved = loadState<Record<PaletteSlot, string>>(STORAGE_KEY, {} as Record<PaletteSlot, string>);
    if (saved && saved.primary && saved.secondary && saved.accent && saved.text) return saved;
    return { primary: '#4f9df7', secondary: '#8aa4c0', accent: '#f4a261', text: '#eef4fb' };
  });

  const [history, setHistory] = useState<PaletteSet[]>(() => loadState<PaletteSet[]>(HISTORY_KEY, []));
  const [favorites, setFavorites] = useState<PaletteSet[]>(() => loadState<PaletteSet[]>(FAVORITES_KEY, []));
  const [showHistory, setShowHistory] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [copied, setCopied] = useState(false);
  const [favorited, setFavorited] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const [extractedColors, setExtractedColors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const timeoutRefs = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Theme key derived from settings for re-render on theme change
  const themeKey = `${settings.stylePreset}-${settings.depth}-${settings.accent}-${settings.customAccentColor}`;

  useEffect(() => {
    return () => {
      timeoutRefs.current.forEach(clearTimeout);
      timeoutRefs.current = [];
    };
  }, []);

  useEffect(() => {
    saveState(STORAGE_KEY, colors);
  }, [colors]);

  useEffect(() => {
    saveState(HISTORY_KEY, history.slice(0, 50));
  }, [history]);

  useEffect(() => {
    saveState(FAVORITES_KEY, favorites.slice(0, 100));
  }, [favorites]);

  const updateColor = useCallback((slot: PaletteSlot, hex: string) => {
    setColors((prev) => ({ ...prev, [slot]: hex }));
  }, []);

  const applyPreset = useCallback((preset: ColorPreset) => {
    playSound('select');
    const next = { ...preset.colors };
    setColors(next);
    saveToHistory(next);
  }, [saveToHistory]);

  const applyHarmony = useCallback((mode: 'complementary' | 'analogous' | 'triadic' | 'split' | 'tetradic') => {
    playSound('workflowStart');
    const result = generateHarmony(colors.primary, mode);
    setColors(result);
    saveToHistory(result);
  }, [colors.primary, saveToHistory]);

  const randomizeColors = useCallback(() => {
    playSound('refresh');
    const h = Math.floor(Math.random() * 360);
    const s = 45 + Math.floor(Math.random() * 40);
    const l = 35 + Math.floor(Math.random() * 30);
    const base = hslToHex(h, s, l);
    const result = generateHarmony(base, ['complementary', 'analogous', 'triadic', 'split', 'tetradic'][Math.floor(Math.random() * 5)] as 'complementary');
    setColors(result);
    saveToHistory(result);
  }, [saveToHistory]);

  const copyPalette = useCallback(() => {
    const text = Object.entries(colors)
      .map(([slot, hex]) => `${labels[slot]}: ${hex}`)
      .join('\n');
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      playSound('copySound');
      timeoutRefs.current.push(setTimeout(() => setCopied(false), 1500));
    }).catch(() => {
      playSound('error');
    });
  }, [colors]);

  const exportJson = useCallback(() => {
    try {
      const payload = {
        tool: 'color-palette',
        generatedAt: new Date().toISOString(),
        language,
        colors,
        contrast: {
          primaryText: contrastRatio(colors.primary, colors.text).toFixed(2),
          secondaryText: contrastRatio(colors.secondary, colors.text).toFixed(2),
        },
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `color-palette-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      requestAnimationFrame(() => {
        a.remove();
        URL.revokeObjectURL(url);
      });
      playSound('downloadSound');
    } catch {
      playSound('error');
    }
  }, [colors, language]);

  const exportCss = useCallback(() => {
    try {
      const css = `:root {
  --oc-primary: ${colors.primary};
  --oc-secondary: ${colors.secondary};
  --oc-accent: ${colors.accent};
  --oc-text: ${colors.text};
}`;
      const blob = new Blob([css], { type: 'text/css' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'oc-color-palette.css';
      document.body.appendChild(a);
      a.click();
      requestAnimationFrame(() => {
        a.remove();
        URL.revokeObjectURL(url);
      });
      playSound('downloadSound');
    } catch {
      playSound('error');
    }
  }, [colors]);

  const addToFavorites = useCallback(() => {
    const snapshotColors = { ...colors };
    const isDuplicate = favorites.some((f) =>
      Object.entries(snapshotColors).every(([k, v]) => f.colors[k as PaletteSlot] === v),
    );
    if (isDuplicate) {
      playSound('error');
      return;
    }
    const snapshot: PaletteSet = {
      id: `${Date.now()}:${Math.random().toString(36).slice(2, 8)}`,
      name: `${labels.setPrefix} ${new Date().toLocaleTimeString()}`,
      createdAt: new Date().toISOString(),
      colors: snapshotColors,
    };
    setFavorites((prev) => [snapshot, ...prev].slice(0, 100));
    setFavorited(true);
    playSound('save');
    timeoutRefs.current.push(setTimeout(() => setFavorited(false), 1500));
  }, [colors, favorites]);

  const loadSet = useCallback((set: PaletteSet) => {
    setColors({ ...set.colors });
    setShowHistory(false);
    setShowFavorites(false);
    playSound('pageSwitch');
  }, []);

  const deleteFavorite = useCallback((id: string) => {
    setFavorites((prev) => prev.filter((f) => f.id !== id));
    playSound('deleteSound');
  }, []);

  const clearHistory = useCallback(() => {
    if (confirmClear) {
      setHistory([]);
      setConfirmClear(false);
      playSound('deleteSound');
    } else {
      setConfirmClear(true);
      timeoutRefs.current.push(setTimeout(() => setConfirmClear(false), 3000));
    }
  }, [confirmClear]);

  const resetAll = useCallback(() => {
    setColors({ primary: '#4f9df7', secondary: '#8aa4c0', accent: '#f4a261', text: '#eef4fb' });
    setExtractedColors([]);
    playSound('resetSound');
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const img = new Image();
    img.onload = () => {
      const dominant = extractDominantColors(img, 4);
      setExtractedColors(dominant);
      let nextColors: Record<PaletteSlot, string>;
      if (dominant.length >= 4) {
        nextColors = {
          primary: dominant[0],
          secondary: dominant[1],
          accent: dominant[2],
          text: dominant[3],
        };
        setColors(nextColors);
      } else if (dominant.length > 0) {
        nextColors = {
          primary: dominant[0] || colors.primary,
          secondary: dominant[1] || colors.secondary,
          accent: dominant[2] || colors.accent,
          text: dominant[3] || colors.text,
        };
        setColors(nextColors);
      } else {
        nextColors = { ...colors };
      }
      saveToHistory(nextColors);
      playSound('workflowStart');
    };
    const objectUrl = URL.createObjectURL(file);
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      playSound('error');
    };
    const origOnload = img.onload;
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      if (origOnload) origOnload.call(img);
    };
    img.src = objectUrl;
    e.target.value = '';
  }, [colors, saveToHistory]);

  const contrastPrimary = useMemo(() => contrastRatio(colors.primary, colors.text), [colors.primary, colors.text, themeKey]);
  const contrastSecondary = useMemo(() => contrastRatio(colors.secondary, colors.text), [colors.secondary, colors.text, themeKey]);

  const labels = useMemo(() => {
    const map: Record<string, Record<string, string>> = {
      zh: {
        primary: '主色', secondary: '辅色', accent: '点缀色', text: '文字色',
        presetLabel: '预设配色', harmonyLabel: '色彩和谐', randomize: '随机配色',
        copy: '复制全部', exportJson: '导出 JSON', exportCss: '导出 CSS',
        favorite: '收藏此方案', favorites: '收藏夹', history: '历史记录',
        emptyHistory: '暂无历史记录', emptyFavorites: '暂无收藏', load: '加载', delete: '删除',
        clearHistory: '清空历史', confirmClear: '再次点击确认清空', resetAll: '全部重置',
        saved: '已保存', copied: '已复制', setPrefix: '方案',
        complementary: '互补色', analogous: '类似色', triadic: '三角色',
        split: '分裂互补', tetradic: '四角色', previewLabel: '预览效果',
        contrastLabel: '对比度', contrastPass: '通过', contrastFail: '不足',
        extractLabel: '从图片提取', extractHint: '上传图片自动提取主色调',
        extractedLabel: '提取结果', applyExtracted: '应用提取色',
        presetClassicBlue: '经典蓝调', presetRoseGold: '玫瑰金', presetForestMist: '森林薄雾',
        presetSunsetEmber: '日落余烬', presetCyberNeon: '赛博霓虹', presetMonochrome: '单色简约',
        presetPastelDream: ' pastel 梦境', presetDarkRoyal: '暗黑皇室',
      },
      ja: {
        primary: 'メインカラー', secondary: 'サブカラー', accent: 'アクセント', text: '文字色',
        presetLabel: 'プリセット', harmonyLabel: 'カラーハーモニー', randomize: 'ランダム配色',
        copy: 'すべてコピー', exportJson: 'JSON 出力', exportCss: 'CSS 出力',
        favorite: 'お気に入り登録', favorites: 'お気に入り', history: '履歴',
        emptyHistory: '履歴はありません', emptyFavorites: 'お気に入りはありません', load: '読み込む', delete: '削除',
        clearHistory: '履歴を消去', confirmClear: 'もう一度タップして確認', resetAll: 'すべてリセット',
        saved: '保存しました', copied: 'コピーしました', setPrefix: 'セット',
        complementary: '補色', analogous: '類似色', triadic: 'トライアド',
        split: 'スプリット補色', tetradic: 'テトラード', previewLabel: 'プレビュー',
        contrastLabel: 'コントラスト', contrastPass: '合格', contrastFail: '不足',
        extractLabel: '画像から抽出', extractHint: '画像をアップロードしてメインカラーを自動抽出',
        extractedLabel: '抽出結果', applyExtracted: '抽出色を適用',
        presetClassicBlue: 'クラシックブルー', presetRoseGold: 'ローズゴールド', presetForestMist: 'フォレストミスト',
        presetSunsetEmber: 'サンセットエンバー', presetCyberNeon: 'サイバーネオン', presetMonochrome: 'モノクローム',
        presetPastelDream: 'パステルドリーム', presetDarkRoyal: 'ダークロイヤル',
      },
      en: {
        primary: 'Primary', secondary: 'Secondary', accent: 'Accent', text: 'Text',
        presetLabel: 'Presets', harmonyLabel: 'Color Harmony', randomize: 'Randomize',
        copy: 'Copy All', exportJson: 'Export JSON', exportCss: 'Export CSS',
        favorite: 'Add to Favorites', favorites: 'Favorites', history: 'History',
        emptyHistory: 'No history yet', emptyFavorites: 'No favorites yet', load: 'Load', delete: 'Delete',
        clearHistory: 'Clear History', confirmClear: 'Tap again to confirm', resetAll: 'Reset All',
        saved: 'Saved', copied: 'Copied', setPrefix: 'Set',
        complementary: 'Complementary', analogous: 'Analogous', triadic: 'Triadic',
        split: 'Split Complementary', tetradic: 'Tetradic', previewLabel: 'Preview',
        contrastLabel: 'Contrast', contrastPass: 'Pass', contrastFail: 'Fail',
        extractLabel: 'Extract from Image', extractHint: 'Upload an image to extract dominant colors',
        extractedLabel: 'Extracted Colors', applyExtracted: 'Apply Extracted',
        presetClassicBlue: 'Classic Blue', presetRoseGold: 'Rose Gold', presetForestMist: 'Forest Mist',
        presetSunsetEmber: 'Sunset Ember', presetCyberNeon: 'Cyber Neon', presetMonochrome: 'Monochrome',
        presetPastelDream: 'Pastel Dream', presetDarkRoyal: 'Dark Royal',
      },
      ru: {
        primary: 'Основной', secondary: 'Дополнительный', accent: 'Акцент', text: 'Текст',
        presetLabel: 'Шаблоны', harmonyLabel: 'Цветовая гармония', randomize: 'Случайно',
        copy: 'Копировать всё', exportJson: 'Экспорт JSON', exportCss: 'Экспорт CSS',
        favorite: 'В избранное', favorites: 'Избранное', history: 'История',
        emptyHistory: 'История пуста', emptyFavorites: 'Избранное пусто', load: 'Загрузить', delete: 'Удалить',
        clearHistory: 'Очистить историю', confirmClear: 'Нажмите ещё раз для подтверждения', resetAll: 'Сбросить всё',
        saved: 'Сохранено', copied: 'Скопировано', setPrefix: 'Набор',
        complementary: 'Комплементарные', analogous: 'Аналоговые', triadic: 'Триадные',
        split: 'Разделённые комплементарные', tetradic: 'Тетрадные', previewLabel: 'Предпросмотр',
        contrastLabel: 'Контраст', contrastPass: 'Пройден', contrastFail: 'Недостаточно',
        extractLabel: 'Извлечь из изображения', extractHint: 'Загрузите изображение для автоматического извлечения цветов',
        extractedLabel: 'Извлечённые цвета', applyExtracted: 'Применить извлечённые',
        presetClassicBlue: 'Классический синий', presetRoseGold: 'Розовое золото', presetForestMist: 'Лесной туман',
        presetSunsetEmber: 'Закатный уголёк', presetCyberNeon: 'Кибер-неон', presetMonochrome: 'Монохром',
        presetPastelDream: 'Пастельная мечта', presetDarkRoyal: 'Тёмное королевство',
      },
      ko: {
        primary: '주색', secondary: '보조색', accent: '강조색', text: '텍스트색',
        presetLabel: '프리셋', harmonyLabel: '색 조화', randomize: '랜덤 배색',
        copy: '전체 복사', exportJson: 'JSON 납품하기', exportCss: 'CSS 납품하기',
        favorite: '즐겨찾기에 추가', favorites: '즐겨찾기', history: '기록',
        emptyHistory: '기록이 없습니다', emptyFavorites: '즐겨찾기가 없습니다', load: '불러오기', delete: '삭제',
        clearHistory: '기록 지우기', confirmClear: '다시 탭하여 확인', resetAll: '전체 초기화',
        saved: '저장 완료', copied: '복사 완료', setPrefix: '세트',
        complementary: '보색', analogous: '유사색', triadic: '3색 조화',
        split: '분열보색', tetradic: '4색 조화', previewLabel: '미리보기',
        contrastLabel: '대비', contrastPass: '통과', contrastFail: '부족',
        extractLabel: '이미지에서 추출', extractHint: '이미지를 업로드하면 주요 색상을 자동 추출합니다',
        extractedLabel: '추출 결과', applyExtracted: '추출색 적용',
        presetClassicBlue: '클래식 블루', presetRoseGold: '로즈 골드', presetForestMist: '포레스트 미스트',
        presetSunsetEmber: '선셋 엠버', presetCyberNeon: '사이버 네온', presetMonochrome: '모노크롬',
        presetPastelDream: '파스텔 드림', presetDarkRoyal: '다크 로열',
      },
    };
    return map[language] ?? map.en;
  }, [language]);

  const saveToHistory = useCallback((newColors: Record<PaletteSlot, string>) => {
    const snapshot: PaletteSet = {
      id: `${Date.now()}:${Math.random().toString(36).slice(2, 8)}`,
      name: `${labels.setPrefix} ${new Date().toLocaleTimeString()}`,
      createdAt: new Date().toISOString(),
      colors: { ...newColors },
    };
    setHistory((prev) => [snapshot, ...prev].slice(0, 50));
  }, [labels.setPrefix]);


  const harmonyModes: { key: 'complementary' | 'analogous' | 'triadic' | 'split' | 'tetradic'; labelKey: string }[] = [
    { key: 'complementary', labelKey: 'complementary' },
    { key: 'analogous', labelKey: 'analogous' },
    { key: 'triadic', labelKey: 'triadic' },
    { key: 'split', labelKey: 'split' },
    { key: 'tetradic', labelKey: 'tetradic' },
  ];

  const paletteSlots: PaletteSlot[] = ['primary', 'secondary', 'accent', 'text'];

  return (
    <main className="feature-shell tool-page-shell">
      <header className="feature-header fade-up delay-1">
        <button className="secondary-button small-button" type="button" onClick={() => { playSound('back'); onBack(); }} data-sfx-handled>
          {backHome}
        </button>
        <div className="feature-header-meta">
          <button className="secondary-button small-button" type="button" onClick={() => { playSound('settingsOpen'); onOpenSettings(); }} data-sfx-handled>
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
            <button
              className="primary-button small-button"
              type="button"
              onClick={randomizeColors}
              data-sfx-handled
              title={labels.randomize}
            >
              {labels.randomize}
            </button>
            <button className="secondary-button small-button" type="button" onClick={resetAll} data-sfx-handled>
              {labels.resetAll}
            </button>
            <button className="secondary-button small-button" type="button" onClick={copyPalette} data-sfx-handled>
              {copied ? labels.copied : labels.copy}
            </button>
            <button className="secondary-button small-button" type="button" onClick={exportJson} data-sfx-handled>
              {labels.exportJson}
            </button>
            <button className="secondary-button small-button" type="button" onClick={exportCss} data-sfx-handled>
              {labels.exportCss}
            </button>
            <button className="secondary-button small-button" type="button" onClick={addToFavorites} data-sfx-handled>
              {favorited ? labels.saved : labels.favorite}
            </button>
            <button
              className={`secondary-button small-button ${showHistory ? 'active' : ''}`}
              type="button"
              onClick={() => { setShowHistory((v) => !v); setShowFavorites(false); playSound('select'); }}
              data-sfx-handled
            >
              {labels.history} ({history.length})
            </button>
            <button
              className={`secondary-button small-button ${showFavorites ? 'active' : ''}`}
              type="button"
              onClick={() => { setShowFavorites((v) => !v); setShowHistory(false); playSound('select'); }}
              data-sfx-handled
            >
              {labels.favorites} ({favorites.length})
            </button>
          </div>
        </div>

        {/* Preset selector */}
        <div style={{ marginBottom: 16, display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          <span className="card-caption">{labels.presetLabel}:</span>
          {PRESETS.map((p) => (
            <button
              key={p.id}
              className="choice-chip"
              type="button"
              onClick={() => applyPreset(p)}
              data-sfx-handled
              title={labels[p.nameKey] ?? p.id}
              style={{
                background: p.colors.primary,
                color: p.colors.text,
                borderColor: p.colors.accent,
                fontWeight: 500,
              }}
            >
              {labels[p.nameKey] ?? p.id}
            </button>
          ))}
        </div>

        {/* Harmony generator */}
        <div style={{ marginBottom: 16, display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          <span className="card-caption">{labels.harmonyLabel}:</span>
          {harmonyModes.map((m) => (
            <button
              key={m.key}
              className="choice-chip"
              type="button"
              onClick={() => applyHarmony(m.key)}
              data-sfx-handled
            >
              {labels[m.labelKey]}
            </button>
          ))}
        </div>

        {/* Image extraction */}
        <div style={{ marginBottom: 16 }}>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
            aria-label={labels.extractLabel}
          />
          <button
            className="secondary-button small-button"
            type="button"
            onClick={() => fileInputRef.current?.click()}
            data-sfx-handled
          >
            {labels.extractLabel}
          </button>
          <span className="card-caption" style={{ marginLeft: 10, fontSize: 12, opacity: 0.7 }}>{labels.extractHint}</span>
          {extractedColors.length > 0 && (
            <div style={{ display: 'flex', gap: 8, marginTop: 10, alignItems: 'center', flexWrap: 'wrap' }}>
              <span className="card-caption">{labels.extractedLabel}:</span>
              {extractedColors.map((c, i) => (
                <button
                  key={`${c}-${i}`}
                  className="tool-dot"
                  type="button"
                  onClick={() => {
                    const slot = paletteSlots[i % 4];
                    updateColor(slot, c);
                    playSound('select');
                  }}
                  data-sfx-handled
                  title={`${labels[paletteSlots[i % 4]]}: ${c}`}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: c,
                    border: '2px solid var(--border)',
                    cursor: 'pointer',
                  }}
                  aria-label={`${labels.extractedLabel} ${i + 1} ${c}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Main layout: color editor + preview */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))', gap: 20 }}>
          {/* Color editor */}
          <div className="tool-card" style={{ padding: 18 }}>
            <div className="tool-card-header" style={{ marginBottom: 14 }}>
              <span className="card-caption">{labels.presetLabel}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {paletteSlots.map((slot) => (
                <ColorRow
                  key={slot}
                  slot={slot}
                  hex={colors[slot]}
                  label={labels[slot]}
                  onChange={(hex) => updateColor(slot, hex)}
                />
              ))}
            </div>
          </div>

          {/* Preview panel */}
          <div className="tool-card" style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="tool-card-header" style={{ marginBottom: 4 }}>
              <span className="card-caption">{labels.previewLabel}</span>
            </div>
            <PalettePreview colors={colors} labels={labels} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
              <ContrastRow label={`${labels.primary} + ${labels.text}`} ratio={contrastPrimary} passLabel={labels.contrastPass} failLabel={labels.contrastFail} />
              <ContrastRow label={`${labels.secondary} + ${labels.text}`} ratio={contrastSecondary} passLabel={labels.contrastPass} failLabel={labels.contrastFail} />
            </div>
          </div>
        </div>
      </section>

      {showHistory && (
        <section className="tool-workbench fade-up" style={{ marginTop: 18 }} aria-live="polite">
          <div className="tool-header" style={{ borderBottom: '1px solid var(--border)', paddingBottom: 12 }}>
            <h3>{labels.history}</h3>
            <div className="tool-header-actions">
              <button className="secondary-button small-button" type="button" onClick={clearHistory} data-sfx-handled>
                {confirmClear ? labels.confirmClear : labels.clearHistory}
              </button>
              <button className="secondary-button small-button" type="button" aria-label="Close history" onClick={() => { setShowHistory(false); playSound('back'); }} data-sfx-handled>
                ✕
              </button>
            </div>
          </div>
          {history.length === 0 ? (
            <p className="muted-copy" style={{ padding: '20px 0' }}>{labels.emptyHistory}</p>
          ) : (
            <div className="tool-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(220px, 100%), 1fr))', gap: 12, marginTop: 12 }}>
              {history.map((set) => (
                <PaletteHistoryCard key={set.id} set={set} labels={labels} onLoad={() => loadSet(set)} />
              ))}
            </div>
          )}
        </section>
      )}

      {showFavorites && (
        <section className="tool-workbench fade-up" style={{ marginTop: 18 }} aria-live="polite">
          <div className="tool-header" style={{ borderBottom: '1px solid var(--border)', paddingBottom: 12 }}>
            <h3>{labels.favorites}</h3>
            <button className="secondary-button small-button" type="button" aria-label="Close favorites" onClick={() => { setShowFavorites(false); playSound('back'); }} data-sfx-handled>
              ✕
            </button>
          </div>
          {favorites.length === 0 ? (
            <p className="muted-copy" style={{ padding: '20px 0' }}>{labels.emptyFavorites}</p>
          ) : (
            <div className="tool-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(220px, 100%), 1fr))', gap: 12, marginTop: 12 }}>
              {favorites.map((set) => (
                <PaletteHistoryCard
                  key={set.id}
                  set={set}
                  labels={labels}
                  onLoad={() => loadSet(set)}
                  onDelete={() => deleteFavorite(set.id)}
                />
              ))}
            </div>
          )}
        </section>
      )}
    </main>
  );
}

// ─── Color row sub-component ───

function ColorRow({
  slot,
  hex,
  label,
  onChange,
}: {
  slot: PaletteSlot;
  hex: string;
  label: string;
  onChange: (hex: string) => void;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <span style={{ minWidth: 72, fontSize: 13, fontWeight: 500 }}>{label}</span>
      <input
        type="color"
        value={hex}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: 40,
          height: 40,
          border: '2px solid var(--border)',
          borderRadius: 8,
          background: 'none',
          cursor: 'pointer',
          padding: 2,
        }}
        aria-label={`${label} color picker`}
      />
      <input
        type="text"
        value={hex}
        onChange={(e) => {
          const v = e.target.value;
          if (/^#[0-9A-Fa-f]{0,6}$/.test(v)) onChange(v);
        }}
        style={{
          flex: 1,
          background: 'var(--panel)',
          border: '1px solid var(--border)',
          borderRadius: 6,
          padding: '6px 10px',
          color: 'var(--text-main)',
          fontSize: 13,
          fontFamily: 'monospace',
        }}
        aria-label={`${label} hex input`}
        maxLength={7}
      />
      <div
        style={{
          width: 24,
          height: 24,
          borderRadius: '50%',
          background: hex,
          border: '2px solid var(--border)',
          flexShrink: 0,
        }}
        aria-hidden="true"
      />
    </div>
  );
}

// ─── Preview panel ───

function PalettePreview({
  colors,
  labels,
}: {
  colors: Record<PaletteSlot, string>;
  labels: Record<string, string>;
}) {
  return (
    <div
      style={{
        background: colors.primary,
        borderRadius: 12,
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        border: `2px solid ${colors.accent}`,
        minHeight: 180,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: colors.secondary,
            border: `3px solid ${colors.accent}`,
            flexShrink: 0,
          }}
          aria-hidden="true"
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ color: colors.text, fontSize: 16, fontWeight: 600 }}>{labels.previewLabel}</span>
          <span style={{ color: colors.text, fontSize: 12, opacity: 0.75 }}>OC Character Preview</span>
        </div>
      </div>
      <div
        style={{
          background: colors.secondary,
          borderRadius: 8,
          padding: 12,
          display: 'flex',
          gap: 8,
          flexWrap: 'wrap',
        }}
      >
        {( ['primary', 'secondary', 'accent', 'text'] as PaletteSlot[]).map((slot) => (
          <div
            key={slot}
            style={{
              background: colors[slot],
              color: colors.text,
              padding: '4px 10px',
              borderRadius: 4,
              fontSize: 11,
              fontWeight: 500,
              border: slot === 'accent' ? `2px solid ${colors.text}` : '1px solid transparent',
            }}
          >
            {labels[slot]}
          </div>
        ))}
      </div>
      <div style={{ marginTop: 'auto', display: 'flex', gap: 6 }}>
        <div style={{ flex: 1, height: 6, background: colors.accent, borderRadius: 3, opacity: 0.6 }} />
        <div style={{ flex: 1, height: 6, background: colors.accent, borderRadius: 3, opacity: 0.4 }} />
        <div style={{ flex: 1, height: 6, background: colors.accent, borderRadius: 3, opacity: 0.2 }} />
      </div>
    </div>
  );
}

// ─── Contrast row ───

function ContrastRow({
  label,
  ratio,
  passLabel,
  failLabel,
}: {
  label: string;
  ratio: number;
  passLabel: string;
  failLabel: string;
}) {
  const pass = ratio >= 4.5;
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13 }}>
      <span style={{ opacity: 0.85 }}>{label}</span>
      <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontFamily: 'monospace', fontVariantNumeric: 'tabular-nums' }}>{ratio.toFixed(2)}:1</span>
        <span
          style={{
            padding: '2px 8px',
            borderRadius: 4,
            fontSize: 11,
            fontWeight: 600,
            background: pass ? 'rgba(var(--success-rgb), 0.18)' : 'rgba(var(--danger-rgb), 0.18)',
            color: pass ? 'var(--success)' : 'var(--danger)',
          }}
        >
          {pass ? `WCAG AA ${passLabel}` : failLabel}
        </span>
      </span>
    </div>
  );
}

// ─── History card sub-component ───

function PaletteHistoryCard({
  set,
  labels,
  onLoad,
  onDelete,
}: {
  set: PaletteSet;
  labels: Record<string, string>;
  onLoad: () => void;
  onDelete?: () => void;
}) {
  return (
    <div className="tool-card" style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 14 }}>
      <div style={{ display: 'flex', gap: 6 }}>
        {(['primary', 'secondary', 'accent', 'text'] as PaletteSlot[]).map((slot) => (
          <div
            key={slot}
            style={{
              flex: 1,
              height: 32,
              borderRadius: 6,
              background: set.colors[slot],
              border: '1px solid var(--border)',
            }}
            title={`${labels[slot]}: ${set.colors[slot]}`}
          />
        ))}
      </div>
      <span className="card-caption" style={{ fontSize: 11 }}>{set.name}</span>
      <div className="mini-action-row" style={{ marginTop: 'auto', paddingTop: 4 }}>
        <button className="secondary-button small-button" type="button" onClick={onLoad} data-sfx-handled>
          {labels.load}
        </button>
        {onDelete && (
          <button className="secondary-button small-button" type="button" onClick={onDelete} data-sfx-handled style={{ color: 'var(--danger, #ef476f)' }}>
            {labels.delete}
          </button>
        )}
      </div>
    </div>
  );
}
