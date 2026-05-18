import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { playSound } from './audioEngine';
import type { AppLanguage, SettingsState } from './types';

// ─── Types ───

export type StatAttribute = {
  id: string;
  nameKey: string;
  value: number;
  locked: boolean;
};

export type StatPreset = {
  id: string;
  nameKey: string;
  attributes: { id: string; nameKey: string }[];
};

export type StatSet = {
  id: string;
  name: string;
  createdAt: string;
  attributes: StatAttribute[];
};

// ─── Translation maps for attribute names ───

const ATTRIBUTE_NAMES: Record<string, Record<string, string>> = {
  zh: {
    str: '力量', dex: '敏捷', con: '体质', int: '智力', wis: '感知', cha: '魅力',
    vit: '耐力', luc: '幸运', atk: '攻击力', def: '防御力', mag: '魔法力', spd: '速度',
    creativity: '创造力', empathy: '共情力', leadership: '领导力', willpower: '意志力',
    humor: '幽默感', courage: '勇气', caution: '谨慎', curiosity: '好奇心',
  },
  ja: {
    str: '筋力', dex: '敏捷', con: '体力', int: '知性', wis: '感知', cha: '魅力',
    vit: '耐力', luc: '運', atk: '攻撃力', def: '防御力', mag: '魔法力', spd: '素早さ',
    creativity: '創造力', empathy: '共感力', leadership: '指導力', willpower: '意志力',
    humor: 'ユーモア', courage: '勇気', caution: '慎重', curiosity: '好奇心',
  },
  en: {
    str: 'Strength', dex: 'Dexterity', con: 'Constitution', int: 'Intelligence', wis: 'Wisdom', cha: 'Charisma',
    vit: 'Vitality', luc: 'Luck', atk: 'Attack', def: 'Defense', mag: 'Magic', spd: 'Speed',
    creativity: 'Creativity', empathy: 'Empathy', leadership: 'Leadership', willpower: 'Willpower',
    humor: 'Humor', courage: 'Courage', caution: 'Caution', curiosity: 'Curiosity',
  },
  ru: {
    str: 'Сила', dex: 'Ловкость', con: 'Телосложение', int: 'Интеллект', wis: 'Мудрость', cha: 'Харизма',
    vit: 'Живучесть', luc: 'Удача', atk: 'Атака', def: 'Защита', mag: 'Магия', spd: 'Скорость',
    creativity: 'Креативность', empathy: 'Эмпатия', leadership: 'Лидерство', willpower: 'Воля',
    humor: 'Юмор', courage: 'Смелость', caution: 'Осторожность', curiosity: 'Любопытство',
  },
  ko: {
    str: '힘', dex: '민첩', con: '천성', int: '지능', wis: '감각', cha: '매력',
    vit: '활력', luc: '행운', atk: '공격력', def: '방어력', mag: '마법력', spd: '속도',
    creativity: '창의력', empathy: '공감력', leadership: '리더십', willpower: '의지력',
    humor: '유머', courage: '용기', caution: '신중', curiosity: '호기심',
  },
};

function getAttrName(id: string, language: AppLanguage): string {
  return ATTRIBUTE_NAMES[language]?.[id] ?? ATTRIBUTE_NAMES.en[id] ?? id;
}

// ─── Presets ───

const PRESETS: StatPreset[] = [
  {
    id: 'standard-six',
    nameKey: 'presetStandardSix',
    attributes: [
      { id: 'str', nameKey: 'str' }, { id: 'dex', nameKey: 'dex' },
      { id: 'vit', nameKey: 'vit' }, { id: 'int', nameKey: 'int' },
      { id: 'wis', nameKey: 'wis' }, { id: 'cha', nameKey: 'cha' },
    ],
  },
  {
    id: 'dd-classic',
    nameKey: 'presetDnD',
    attributes: [
      { id: 'str', nameKey: 'str' }, { id: 'dex', nameKey: 'dex' },
      { id: 'con', nameKey: 'con' }, { id: 'int', nameKey: 'int' },
      { id: 'wis', nameKey: 'wis' }, { id: 'cha', nameKey: 'cha' },
    ],
  },
  {
    id: 'jrpg',
    nameKey: 'presetJrpg',
    attributes: [
      { id: 'atk', nameKey: 'atk' }, { id: 'def', nameKey: 'def' },
      { id: 'mag', nameKey: 'mag' }, { id: 'spd', nameKey: 'spd' },
      { id: 'luc', nameKey: 'luc' }, { id: 'vit', nameKey: 'vit' },
    ],
  },
  {
    id: 'social',
    nameKey: 'presetSocial',
    attributes: [
      { id: 'cha', nameKey: 'cha' }, { id: 'empathy', nameKey: 'empathy' },
      { id: 'leadership', nameKey: 'leadership' }, { id: 'humor', nameKey: 'humor' },
      { id: 'creativity', nameKey: 'creativity' }, { id: 'willpower', nameKey: 'willpower' },
    ],
  },
  {
    id: 'creative',
    nameKey: 'presetCreative',
    attributes: [
      { id: 'creativity', nameKey: 'creativity' }, { id: 'curiosity', nameKey: 'curiosity' },
      { id: 'int', nameKey: 'int' }, { id: 'empathy', nameKey: 'empathy' },
      { id: 'cha', nameKey: 'cha' }, { id: 'caution', nameKey: 'caution' },
    ],
  },
];

// ─── Utilities ───

function seededRandomFloat(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
  }
  return ((h >>> 0) % 1000) / 1000;
}

function randomValue(seedBase: string, index: number, bias?: number): number {
  const r = seededRandomFloat(`${seedBase}:${index}`);
  const base = Math.floor(r * 100);
  if (typeof bias === 'number') {
    return Math.min(100, Math.max(0, Math.round(base * 0.6 + bias * 0.4)));
  }
  return base;
}

function makeDefaultAttributes(presetId: string, language: AppLanguage): StatAttribute[] {
  const preset = PRESETS.find((p) => p.id === presetId) ?? PRESETS[0];
  return preset.attributes.map((a) => ({
    id: a.id,
    nameKey: a.nameKey,
    value: 50,
    locked: false,
  }));
}

function generateRandomAttributes(
  presetId: string,
  language: AppLanguage,
  seedBase?: string,
): StatAttribute[] {
  const preset = PRESETS.find((p) => p.id === presetId) ?? PRESETS[0];
  const seed = seedBase || `${Date.now()}:${Math.random().toString(36).slice(2, 8)}`;
  return preset.attributes.map((a, i) => ({
    id: a.id,
    nameKey: a.nameKey,
    value: randomValue(seed, i),
    locked: false,
  }));
}

// ─── Storage helpers ───

const STORAGE_KEY = 'oc-maker.character-stats';
const HISTORY_KEY = 'oc-maker.character-stats-history';
const FAVORITES_KEY = 'oc-maker.character-stats-favorites';

function loadState<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed as T;
    }
  } catch { /* ignore */ }
  return fallback;
}

function saveState(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch { /* ignore */ }
}

// ─── Canvas radar chart ───

function getCssVar(name: string, fallback: string): string {
  if (typeof window === 'undefined') return fallback;
  const shell = document.querySelector('.app-shell');
  if (!shell) return fallback;
  const val = getComputedStyle(shell).getPropertyValue(name).trim();
  return val || fallback;
}

function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace('#', '');
  const bigint = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function withAlpha(color: string, alpha: number): string {
  if (color.startsWith('rgba(')) {
    const parts = color.slice(5, -1).split(',');
    if (parts.length >= 3) return `rgba(${parts[0]}, ${parts[1]}, ${parts[2]}, ${alpha})`;
  }
  if (color.startsWith('rgb(')) {
    const parts = color.slice(4, -1).split(',');
    if (parts.length >= 3) return `rgba(${parts[0]}, ${parts[1]}, ${parts[2]}, ${alpha})`;
  }
  if (color.startsWith('#')) return hexToRgba(color, alpha);
  return `rgba(159, 178, 198, ${alpha})`;
}

function resolveCanvasColor(raw: string, fallback: string): string {
  const c = raw || fallback;
  if (c.startsWith('#')) return c;
  if (c.startsWith('rgb')) return c;
  if (c.startsWith('hsl')) return c;
  return fallback;
}

function drawRadarChart(
  canvas: HTMLCanvasElement,
  attributes: StatAttribute[],
  language: AppLanguage,
) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  if (!rect.width || !rect.height) return;
  canvas.width = Math.round(rect.width * dpr);
  canvas.height = Math.round(rect.height * dpr);
  ctx.scale(dpr, dpr);

  const w = rect.width;
  const h = rect.height;
  const cx = w / 2;
  const cy = h / 2;
  const radius = Math.max(10, Math.min(w, h) / 2 - 48);
  const count = attributes.length;
  if (count < 3) return;

  // Read theme-aware colors from CSS variables
  const accentRaw = getCssVar('--accent-solid', '#4f9df7');
  const bgRaw = getCssVar('--bg', '#09131f');
  const textSecondaryRaw = getCssVar('--text-secondary', '#9fb2c6');
  const textMainRaw = getCssVar('--text-main', '#eef4fb');
  const accentColor = resolveCanvasColor(accentRaw, '#4f9df7');
  const bgColor = resolveCanvasColor(bgRaw, '#09131f');
  const textSecondary = resolveCanvasColor(textSecondaryRaw, '#9fb2c6');
  const textMain = resolveCanvasColor(textMainRaw, '#eef4fb');

  ctx.clearRect(0, 0, w, h);

  // Grid rings
  const rings = 5;
  ctx.strokeStyle = withAlpha(textSecondary, 0.18);
  ctx.lineWidth = 1;
  for (let r = 1; r <= rings; r++) {
    ctx.beginPath();
    const rRadius = (radius / rings) * r;
    for (let i = 0; i <= count; i++) {
      const angle = (Math.PI * 2 / count) * i - Math.PI / 2;
      const x = cx + Math.cos(angle) * rRadius;
      const y = cy + Math.sin(angle) * rRadius;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();
  }

  // Axis lines
  ctx.strokeStyle = withAlpha(textSecondary, 0.22);
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 / count) * i - Math.PI / 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius);
    ctx.stroke();
  }

  // Data polygon
  ctx.beginPath();
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 / count) * i - Math.PI / 2;
    const val = Math.min(100, Math.max(0, attributes[i].value));
    const r = (val / 100) * radius;
    const x = cx + Math.cos(angle) * r;
    const y = cy + Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();

  // Fill
  if (accentColor.startsWith('#')) {
    ctx.fillStyle = hexToRgba(accentColor, 0.18);
  } else if (accentColor.startsWith('rgb')) {
    ctx.fillStyle = accentColor.replace(')', ', 0.18)').replace('rgb', 'rgba');
  } else {
    ctx.fillStyle = 'rgba(79, 157, 247, 0.18)';
  }
  ctx.fill();

  // Stroke
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Dots
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 / count) * i - Math.PI / 2;
    const val = Math.min(100, Math.max(0, attributes[i].value));
    const r = (val / 100) * radius;
    const x = cx + Math.cos(angle) * r;
    const y = cy + Math.sin(angle) * r;
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fillStyle = accentColor;
    ctx.fill();
    ctx.strokeStyle = bgColor;
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  // Labels
  ctx.font = '12px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = textSecondary;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 / count) * i - Math.PI / 2;
    const labelRadius = radius + 22;
    const x = cx + Math.cos(angle) * labelRadius;
    const y = cy + Math.sin(angle) * labelRadius;
    const label = getAttrName(attributes[i].id, language);
    ctx.fillText(label, x, y);
    // Value below label
    ctx.fillStyle = textMain;
    ctx.fillText(String(attributes[i].value), x, y + 14);
    ctx.fillStyle = textSecondary;
  }
}

// ─── Page props ───

type CharacterStatsPageProps = {
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
  onNavigate?: (screen: Exclude<import('./types').FeatureScreen, 'home'>) => void;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onOpenDocs?: (toolId?: string, section?: string, errorCode?: string) => void;
};

// ─── Main component ───

export default function CharacterStatsDesignerPage({
  appSubtitle,
  backHome,
  openSettings,
  pageTitle,
  pageDescription,
  settings,
  language,
  onBack,
  onOpenSettings,
}: CharacterStatsPageProps) {
  const [attributes, setAttributes] = useState<StatAttribute[]>(() => {
    const saved = loadState<StatAttribute[]>(STORAGE_KEY, []);
    if (saved && saved.length > 0) return saved;
    return makeDefaultAttributes('standard-six', language);
  });

  const [presetId, setPresetId] = useState('standard-six');
  const [history, setHistory] = useState<StatSet[]>(() => loadState<StatSet[]>(HISTORY_KEY, []));
  const [favorites, setFavorites] = useState<StatSet[]>(() => loadState<StatSet[]>(FAVORITES_KEY, []));
  const [showHistory, setShowHistory] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [copied, setCopied] = useState(false);
  const [favorited, setFavorited] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timeoutRefs = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Derive a theme key from settings so canvas re-draws when theme changes
  const themeKey = `${settings.stylePreset}-${settings.depth}-${settings.accent}-${settings.customAccentColor}`;

  useEffect(() => {
    return () => {
      timeoutRefs.current.forEach(clearTimeout);
      timeoutRefs.current = [];
    };
  }, []);

  useEffect(() => {
    saveState(STORAGE_KEY, attributes);
  }, [attributes]);

  useEffect(() => {
    saveState(HISTORY_KEY, history.slice(0, 50));
  }, [history]);

  useEffect(() => {
    saveState(FAVORITES_KEY, favorites.slice(0, 100));
  }, [favorites]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    drawRadarChart(canvas, attributes, language);
    const ro = new ResizeObserver(() => {
      drawRadarChart(canvas, attributes, language);
    });
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [attributes, language, themeKey]);

  const regenerateAll = useCallback(() => {
    playSound('workflowStart');
    const seed = `${Date.now()}:${Math.random().toString(36).slice(2, 10)}`;
    let nextAttrs: StatAttribute[] = [];
    setAttributes((prev) => {
      nextAttrs = prev.map((a, i) =>
        a.locked ? a : { ...a, value: randomValue(seed, i) },
      );
      return nextAttrs;
    });
    const snapshot: StatSet = {
      id: seed,
      name: `${labels.setPrefix} ${new Date().toLocaleTimeString()}`,
      createdAt: new Date().toISOString(),
      attributes: nextAttrs.map((a) => ({ ...a })),
    };
    setHistory((h) => [snapshot, ...h].slice(0, 50));
  }, [labels]);

  const regenerateOne = useCallback((id: string) => {
    playSound('refresh');
    const seed = `${Date.now()}:${Math.random().toString(36).slice(2, 10)}`;
    setAttributes((prev) =>
      prev.map((a, i) =>
        a.id === id && !a.locked ? { ...a, value: randomValue(seed, i) } : a,
      ),
    );
  }, []);

  const toggleLock = useCallback((id: string) => {
    setAttributes((prev) =>
      prev.map((a) => {
        if (a.id !== id) return a;
        const nextLocked = !a.locked;
        playSound(nextLocked ? 'toggleOn' : 'toggleOff');
        return { ...a, locked: nextLocked };
      }),
    );
  }, []);

  const updateValue = useCallback((id: string, value: number) => {
    setAttributes((prev) =>
      prev.map((a) => (a.id === id ? { ...a, value: Math.min(100, Math.max(0, value)) } : a)),
    );
  }, []);

  const applyPreset = useCallback((pid: string) => {
    playSound('select');
    setPresetId(pid);
    const preset = PRESETS.find((p) => p.id === pid);
    if (!preset) return;
    setAttributes((prev) => {
      const kept: StatAttribute[] = [];
      preset.attributes.forEach((pa) => {
        const existing = prev.find((a) => a.id === pa.id);
        if (existing) {
          kept.push({ ...existing, nameKey: pa.nameKey });
        } else {
          kept.push({ id: pa.id, nameKey: pa.nameKey, value: 50, locked: false });
        }
      });
      return kept;
    });
  }, []);

  const copyAll = useCallback(() => {
    const text = attributes
      .map((a) => `${getAttrName(a.id, language)}: ${a.value}`)
      .join('\n');
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      playSound('copySound');
      timeoutRefs.current.push(setTimeout(() => setCopied(false), 1500));
    }).catch(() => {
      playSound('error');
    });
  }, [attributes, language]);

  const exportJson = useCallback(() => {
    try {
      const payload = {
        tool: 'character-stats',
        generatedAt: new Date().toISOString(),
        language,
        preset: presetId,
        attributes: attributes.map((a) => ({
          id: a.id,
          name: getAttrName(a.id, language),
          value: a.value,
          locked: a.locked,
        })),
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `character-stats-${Date.now()}.json`;
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
  }, [attributes, language, presetId]);

  const addToFavorites = useCallback(() => {
    const snapshotAttrs = attributes.map((a) => ({ ...a }));
    const isDuplicate = favorites.some((f) =>
      f.attributes.length === snapshotAttrs.length &&
      f.attributes.every((fa, i) => fa.id === snapshotAttrs[i].id && fa.value === snapshotAttrs[i].value),
    );
    if (isDuplicate) {
      playSound('error');
      return;
    }
    const snapshot: StatSet = {
      id: `${Date.now()}:${Math.random().toString(36).slice(2, 8)}`,
      name: `${labels.setPrefix} ${new Date().toLocaleTimeString()}`,
      createdAt: new Date().toISOString(),
      attributes: snapshotAttrs,
    };
    setFavorites((prev) => [snapshot, ...prev].slice(0, 100));
    setFavorited(true);
    playSound('save');
    timeoutRefs.current.push(setTimeout(() => setFavorited(false), 1500));
  }, [attributes, favorites]);

  const loadSet = useCallback((set: StatSet) => {
    setAttributes(set.attributes.map((a) => ({ ...a })));
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
    setAttributes(makeDefaultAttributes(presetId, language));
    playSound('resetSound');
  }, [presetId, language]);

  const allLocked = attributes.every((a) => a.locked);
  const anyLocked = attributes.some((a) => a.locked);

  const labels = useMemo(() => {
    const map: Record<string, Record<string, string>> = {
      zh: {
        generateAll: '随机生成', regenerate: '刷新', lock: '锁定', unlock: '解锁', copy: '复制全部',
        exportJson: '导出 JSON', favorite: '收藏此方案', favorites: '收藏夹', history: '历史记录',
        emptyHistory: '暂无历史记录', emptyFavorites: '暂无收藏', load: '加载', delete: '删除',
        clearHistory: '清空历史', confirmClear: '再次点击确认清空', resetAll: '全部重置',
        lockedHint: '已锁定的属性不会被刷新', allLockedWarning: '所有属性均已锁定，请先解锁部分属性再生成',
        saved: '已保存', copied: '已复制', presetLabel: '预设模板', presetStandardSix: '标准六维',
        presetDnD: 'D&D 经典', presetJrpg: '日系RPG', presetSocial: '社交属性', presetCreative: '创作能力',
        setPrefix: '方案',
        radarChart: '雷达图',
      },
      ja: {
        generateAll: 'ランダム生成', regenerate: '更新', lock: 'ロック', unlock: '解除', copy: 'すべてコピー',
        exportJson: 'JSON 出力', favorite: 'お気に入り登録', favorites: 'お気に入り', history: '履歴',
        emptyHistory: '履歴はありません', emptyFavorites: 'お気に入りはありません', load: '読み込む', delete: '削除',
        clearHistory: '履歴を消去', confirmClear: 'もう一度タップして確認', resetAll: 'すべてリセット',
        lockedHint: 'ロック中の属性は更新されません', allLockedWarning: 'すべてロック中です。一部解除してから生成してください',
        saved: '保存しました', copied: 'コピーしました', presetLabel: 'プリセット', presetStandardSix: '標準6次元',
        presetDnD: 'D&D クラシック', presetJrpg: 'JRPG', presetSocial: '社交属性', presetCreative: '創作能力',
        setPrefix: 'セット',
        radarChart: 'レーダーチャート',
      },
      en: {
        generateAll: 'Randomize All', regenerate: 'Reroll', lock: 'Lock', unlock: 'Unlock', copy: 'Copy All',
        exportJson: 'Export JSON', favorite: 'Add to Favorites', favorites: 'Favorites', history: 'History',
        emptyHistory: 'No history yet', emptyFavorites: 'No favorites yet', load: 'Load', delete: 'Delete',
        clearHistory: 'Clear History', confirmClear: 'Tap again to confirm', resetAll: 'Reset All',
        lockedHint: 'Locked stats are preserved when generating', allLockedWarning: 'All stats are locked. Unlock some before generating.',
        saved: 'Saved', copied: 'Copied', presetLabel: 'Preset', presetStandardSix: 'Standard Six',
        presetDnD: 'D&D Classic', presetJrpg: 'JRPG Style', presetSocial: 'Social Traits', presetCreative: 'Creative Mind',
        setPrefix: 'Set',
        radarChart: 'Radar Chart',
      },
      ru: {
        generateAll: 'Сгенерировать всё', regenerate: 'Обновить', lock: 'Заблокировать', unlock: 'Разблокировать', copy: 'Копировать всё',
        exportJson: 'Экспорт JSON', favorite: 'В избранное', favorites: 'Избранное', history: 'История',
        emptyHistory: 'История пуста', emptyFavorites: 'Избранное пусто', load: 'Загрузить', delete: 'Удалить',
        clearHistory: 'Очистить историю', confirmClear: 'Нажмите ещё раз для подтверждения', resetAll: 'Сбросить всё',
        lockedHint: 'Заблокированные атрибуты сохраняются при генерации', allLockedWarning: 'Всё заблокировано. Разблокируйте что-нибудь перед генерацией.',
        saved: 'Сохранено', copied: 'Скопировано', presetLabel: 'Шаблон', presetStandardSix: 'Стандарт 6',
        presetDnD: 'D&D Классика', presetJrpg: 'JRPG', presetSocial: 'Социальные', presetCreative: 'Креативные',
        setPrefix: 'Набор',
        radarChart: 'Радар-график',
      },
      ko: {
        generateAll: '전체 생성', regenerate: '새로고침', lock: '잠금', unlock: '잠금 해제', copy: '전체 복사',
        exportJson: 'JSON 납품하기', favorite: '즐겨찾기에 추가', favorites: '즐겨찾기', history: '기록',
        emptyHistory: '기록이 없습니다', emptyFavorites: '즐겨찾기가 없습니다', load: '불러오기', delete: '삭제',
        clearHistory: '기록 지우기', confirmClear: '다시 탭하여 확인', resetAll: '전체 초기화',
        lockedHint: '잠금된 속성은 생성 시 보존', allLockedWarning: '모두 잠금 상태입니다. 생성 전 일부를 해제하세요.',
        saved: '저장 완료', copied: '복사 완료', presetLabel: '프리셋', presetStandardSix: '표준 6차원',
        presetDnD: 'D&D 클래식', presetJrpg: 'JRPG', presetSocial: '사교 속성', presetCreative: '창작 능력',
        setPrefix: '세트',
        radarChart: '레이더 차트',
      },
    };
    return map[language] ?? map.en;
  }, [language]);

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
              onClick={regenerateAll}
              disabled={allLocked}
              data-sfx-handled
              title={allLocked ? labels.allLockedWarning : labels.generateAll}
            >
              {labels.generateAll}
            </button>
            <button className="secondary-button small-button" type="button" onClick={resetAll} data-sfx-handled>
              {labels.resetAll}
            </button>
            <button className="secondary-button small-button" type="button" onClick={copyAll} data-sfx-handled>
              {copied ? labels.copied : labels.copy}
            </button>
            <button className="secondary-button small-button" type="button" onClick={exportJson} data-sfx-handled>
              {labels.exportJson}
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

        {allLocked && (
          <div className="notice-banner" style={{ marginBottom: 12 }} role="status" aria-live="polite">
            <span style={{ fontSize: 13, opacity: 0.85 }}>🔒 {labels.allLockedWarning}</span>
          </div>
        )}
        {anyLocked && !allLocked && (
          <div className="notice-banner" style={{ marginBottom: 12 }} role="status" aria-live="polite">
            <span style={{ fontSize: 13, opacity: 0.85 }}>🔒 {labels.lockedHint}</span>
          </div>
        )}

        {/* Preset selector */}
        <div style={{ marginBottom: 16, display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          <span className="card-caption">{labels.presetLabel}:</span>
          {PRESETS.map((p) => (
            <button
              key={p.id}
              className={`choice-chip ${presetId === p.id ? 'active' : ''}`}
              type="button"
              onClick={() => applyPreset(p.id)}
              data-sfx-handled
            >
              {labels[p.nameKey] ?? p.id}
            </button>
          ))}
        </div>

        {/* Main layout: stats list + radar chart */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))', gap: 20 }}>
          {/* Stat sliders */}
          <div className="tool-card" style={{ padding: 18 }}>
            <div className="tool-card-header" style={{ marginBottom: 14 }}>
              <span className="card-caption">{labels.presetLabel}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {attributes.map((attr) => (
                <StatRow
                  key={attr.id}
                  attr={attr}
                  language={language}
                  labels={labels}
                  onChange={(v) => updateValue(attr.id, v)}
                  onRegenerate={() => regenerateOne(attr.id)}
                  onToggleLock={() => toggleLock(attr.id)}
                />
              ))}
            </div>
          </div>

          {/* Radar chart */}
          <div className="tool-card" style={{ padding: 18, display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: 360 }}>
            <div className="tool-card-header" style={{ marginBottom: 14, width: '100%' }}>
              <span className="card-caption">{labels.radarChart}</span>
            </div>
            <canvas
              ref={canvasRef}
              style={{ width: '100%', height: '100%', maxWidth: 420, maxHeight: 420 }}
              aria-label="Character stats radar chart"
              role="img"
            />
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
                <StatHistoryCard key={set.id} set={set} language={language} labels={labels} onLoad={() => loadSet(set)} />
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
                <StatHistoryCard
                  key={set.id}
                  set={set}
                  language={language}
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

// ─── Stat row sub-component ───

function StatRow({
  attr,
  language,
  labels,
  onChange,
  onRegenerate,
  onToggleLock,
}: {
  attr: StatAttribute;
  language: AppLanguage;
  labels: Record<string, string>;
  onChange: (value: number) => void;
  onRegenerate: () => void;
  onToggleLock: () => void;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <span style={{ minWidth: 72, fontSize: 13, fontWeight: 500 }}>{getAttrName(attr.id, language)}</span>
      <input
        type="range"
        min={0}
        max={100}
        value={attr.value}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={attr.locked}
        style={{ flex: 1, accentColor: 'var(--accent-solid)' }}
        aria-label={`${getAttrName(attr.id, language)} value`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={attr.value}
      />
      <span style={{ minWidth: 32, fontSize: 13, fontVariantNumeric: 'tabular-nums', textAlign: 'right' }}>{attr.value}</span>
      <div className="mini-action-row" style={{ gap: 4 }}>
        <button
          className="secondary-button small-button"
          type="button"
          onClick={onRegenerate}
          disabled={attr.locked}
          data-sfx-handled
          title={labels.regenerate}
          aria-label={labels.regenerate}
        >
          ⟳
        </button>
        <button
          className={`secondary-button small-button ${attr.locked ? 'active' : ''}`}
          type="button"
          onClick={onToggleLock}
          aria-pressed={attr.locked}
          data-sfx-handled
          title={attr.locked ? labels.unlock : labels.lock}
          aria-label={attr.locked ? labels.unlock : labels.lock}
        >
          {attr.locked ? '🔒' : '🔓'}
        </button>
      </div>
    </div>
  );
}

// ─── History card sub-component ───

function StatHistoryCard({
  set,
  language,
  labels,
  onLoad,
  onDelete,
}: {
  set: StatSet;
  language: AppLanguage;
  labels: Record<string, string>;
  onLoad: () => void;
  onDelete?: () => void;
}) {
  const date = new Date(set.createdAt).toLocaleString(
    language === 'zh' ? 'zh-CN' : language === 'ja' ? 'ja-JP' : language === 'ko' ? 'ko-KR' : language === 'ru' ? 'ru-RU' : 'en-US',
  );
  const preview = set.attributes.slice(0, 4).map((a) => `${getAttrName(a.id, language)}:${a.value}`).join(' · ');

  return (
    <div className="tool-card" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <span className="card-caption" style={{ fontSize: 11 }}>{date}</span>
      <p style={{ fontSize: 13, lineHeight: 1.5, margin: 0, opacity: 0.85 }}>{preview}…</p>
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
