import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import type { AppLanguage, SettingsState } from './types';
import { playSound } from './audioEngine';

type SharedPageProps = {
  settings: SettingsState;
  language: AppLanguage;
  onBack: () => void;
  onOpenSettings: () => void;
  onOpenDocs?: () => void;
  pageTitle: string;
  pageDescription: string;
  backHome: string;
  openSettings: string;
};

type TemplateType = 'standard' | 'palette' | 'showcase';

type SheetColor = { name: string; hex: string };

type ReferenceSheetData = {
  template: TemplateType;
  characterName: string;
  mainImage: string | null;
  detailImages: string[];
  colors: SheetColor[];
  notes: string[];
};

const STORAGE_KEY = 'oc-maker.reference-sheet';
const MAX_DETAIL_IMAGES = 4;
const MAX_COLORS = 6;
const MAX_NOTES = 6;

function getDefaultColors(): SheetColor[] {
  return [
    { name: '主色', hex: '#4f9df7' },
    { name: '辅色', hex: '#86efac' },
    { name: '点缀', hex: '#f59e0b' },
    { name: '肤色', hex: '#ffdbac' },
    { name: '发色', hex: '#2a2a2a' },
    { name: '瞳色', hex: '#5bc0eb' },
  ];
}

function getDefaultData(): ReferenceSheetData {
  return {
    template: 'standard',
    characterName: '',
    mainImage: null,
    detailImages: [],
    colors: getDefaultColors(),
    notes: [''],
  };
}

function loadData(): ReferenceSheetData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Blob URLs expire on reload; discard them to avoid broken images
      const mainImage = typeof parsed.mainImage === 'string' && !parsed.mainImage.startsWith('blob:') ? parsed.mainImage : null;
      const detailImages = Array.isArray(parsed.detailImages)
        ? parsed.detailImages.filter((u: unknown) => typeof u === 'string' && !u.startsWith('blob:'))
        : [];
      return {
        template: parsed.template || 'standard',
        characterName: parsed.characterName || '',
        mainImage,
        detailImages,
        colors: Array.isArray(parsed.colors) && parsed.colors.length > 0 ? parsed.colors : getDefaultColors(),
        notes: Array.isArray(parsed.notes) ? parsed.notes : [''],
      };
    }
  } catch { /* ignore */ }
  return getDefaultData();
}

function saveData(data: ReferenceSheetData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch { /* ignore */ }
}

const UI_COPY: Record<string, Record<string, string>> = {
  zh: {
    templateLabel: '模板',
    templateStandard: '标准版',
    templatePalette: '配色版',
    templateShowcase: '展示版',
    characterName: '角色名',
    mainImage: '主立绘',
    detailImages: '细节图',
    colors: '配色板',
    colorName: '色名',
    colorHex: '色值',
    notes: '标注',
    noteText: '标注内容',
    uploadHint: '点击或拖拽上传',
    replaceImage: '更换',
    removeImage: '移除',
    addDetail: '添加细节图',
    exportPng: '导出参考表',
    exporting: '导出中…',
    emptyMainImage: '请先上传主立绘',
    dragDropHint: '拖拽图片到此处',
    tipStandard: '标准版：大立绘 + 配色板 + 标注',
    tipPalette: '配色版：大色块展示 + 色值 + 头像',
    tipShowcase: '展示版：多图网格 + 立绘',
    reset: '重置',
    resetConfirm: '确定重置当前参考表吗？所有未导出的内容将清空。',
    previewTitle: '预览',
  },
  ja: {
    templateLabel: 'テンプレート',
    templateStandard: 'スタンダード',
    templatePalette: 'パレット版',
    templateShowcase: 'ショーケース',
    characterName: 'キャラ名',
    mainImage: 'メイン立ち絵',
    detailImages: '詳細画像',
    colors: '配色板',
    colorName: '色名',
    colorHex: '色値',
    notes: '注釈',
    noteText: '注釈内容',
    uploadHint: 'クリックまたはドラッグでアップロード',
    replaceImage: '変更',
    removeImage: '削除',
    addDetail: '詳細画像を追加',
    exportPng: '参考表をエクスポート',
    exporting: 'エクスポート中…',
    emptyMainImage: 'メイン立ち絵をアップロードしてください',
    dragDropHint: 'ここに画像をドラッグ',
    tipStandard: 'スタンダード：大立ち絵＋配色板＋注釈',
    tipPalette: 'パレット版：大色块＋色値＋アイコン',
    tipShowcase: 'ショーケース：複数画像グリッド＋立ち絵',
    reset: 'リセット',
    resetConfirm: '参考表をリセットしますか？未エクスポートの内容は削除されます。',
    previewTitle: 'プレビュー',
  },
  en: {
    templateLabel: 'Template',
    templateStandard: 'Standard',
    templatePalette: 'Palette',
    templateShowcase: 'Showcase',
    characterName: 'Character Name',
    mainImage: 'Main Illustration',
    detailImages: 'Detail Images',
    colors: 'Color Palette',
    colorName: 'Color Name',
    colorHex: 'Hex',
    notes: 'Notes',
    noteText: 'Note text',
    uploadHint: 'Click or drag to upload',
    replaceImage: 'Replace',
    removeImage: 'Remove',
    addDetail: 'Add Detail Image',
    exportPng: 'Export Reference Sheet',
    exporting: 'Exporting…',
    emptyMainImage: 'Please upload a main illustration first',
    dragDropHint: 'Drag image here',
    tipStandard: 'Standard: Main art + color palette + notes',
    tipPalette: 'Palette: Large color blocks + hex values + icon',
    tipShowcase: 'Showcase: Multi-image grid + main art',
    reset: 'Reset',
    resetConfirm: 'Reset the reference sheet? Unexported content will be cleared.',
    previewTitle: 'Preview',
  },
  ru: {
    templateLabel: 'Шаблон',
    templateStandard: 'Стандарт',
    templatePalette: 'Палитра',
    templateShowcase: 'Витрина',
    characterName: 'Имя персонажа',
    mainImage: 'Основной арт',
    detailImages: 'Детальные изображения',
    colors: 'Цветовая палитра',
    colorName: 'Название',
    colorHex: 'Hex',
    notes: 'Заметки',
    noteText: 'Текст заметки',
    uploadHint: 'Нажмите или перетащите для загрузки',
    replaceImage: 'Заменить',
    removeImage: 'Удалить',
    addDetail: 'Добавить детальное изображение',
    exportPng: 'Экспортировать референс-таблицу',
    exporting: 'Экспорт…',
    emptyMainImage: 'Сначала загрузите основной арт',
    dragDropHint: 'Перетащите изображение сюда',
    tipStandard: 'Стандарт: Основной арт + палитра + заметки',
    tipPalette: 'Палитра: Большие цветовые блоки + hex + иконка',
    tipShowcase: 'Витрина: Сетка изображений + основной арт',
    reset: 'Сброс',
    resetConfirm: 'Сбросить референс-таблицу? Неэкспортированное содержимое будет удалено.',
    previewTitle: 'Предпросмотр',
  },
};

function getCopy(language: AppLanguage, key: string): string {
  const lang = language in UI_COPY ? language : 'zh';
  return UI_COPY[lang][key] || UI_COPY['zh'][key] || key;
}

export default function ReferenceSheetPage({
  settings,
  language,
  onBack,
  onOpenSettings,
  pageTitle,
  pageDescription,
  backHome,
  openSettings,
}: SharedPageProps) {
  const [data, setData] = useState<ReferenceSheetData>(loadData);
  const [exporting, setExporting] = useState(false);
  const [dragOver, setDragOver] = useState<string | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const detailInputRef = useRef<HTMLInputElement>(null);
  const objectUrlsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    saveData(data);
  }, [data]);

  useEffect(() => {
    return () => {
      objectUrlsRef.current.forEach((url) => {
        try { URL.revokeObjectURL(url); } catch { /* ignore */ }
      });
      objectUrlsRef.current.clear();
    };
  }, []);

  const copy = useCallback((key: string) => getCopy(language, key), [language]);

  const createObjectUrl = useCallback((file: File): string => {
    const url = URL.createObjectURL(file);
    objectUrlsRef.current.add(url);
    return url;
  }, []);

  const update = useCallback((patch: Partial<ReferenceSheetData>) => {
    setData((prev) => ({ ...prev, ...patch }));
  }, []);

  const handleMainImageUpload = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return;
    const url = createObjectUrl(file);
    update({ mainImage: url });
    playSound('uploadComplete');
  }, [createObjectUrl, update]);

  const handleDetailImageUpload = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return;
    if (data.detailImages.length >= MAX_DETAIL_IMAGES) return;
    const url = createObjectUrl(file);
    update({ detailImages: [...data.detailImages, url] });
    playSound('uploadComplete');
  }, [createObjectUrl, update, data.detailImages]);

  const removeDetailImage = useCallback((index: number) => {
    const url = data.detailImages[index];
    if (url) {
      try { URL.revokeObjectURL(url); } catch { /* ignore */ }
      objectUrlsRef.current.delete(url);
    }
    const next = [...data.detailImages];
    next.splice(index, 1);
    update({ detailImages: next });
    playSound('deleteSound');
  }, [data.detailImages, update]);

  const removeMainImage = useCallback(() => {
    if (data.mainImage) {
      try { URL.revokeObjectURL(data.mainImage); } catch { /* ignore */ }
      objectUrlsRef.current.delete(data.mainImage);
    }
    update({ mainImage: null });
    playSound('deleteSound');
  }, [data.mainImage, update]);

  const handleDrop = useCallback((e: React.DragEvent, target: 'main' | 'detail') => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(null);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    if (target === 'main') handleMainImageUpload(file);
    else handleDetailImageUpload(file);
  }, [handleMainImageUpload, handleDetailImageUpload]);

  const handleDragOver = useCallback((e: React.DragEvent, target: string) => {
    e.preventDefault();
    setDragOver(target);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(null);
  }, []);

  const updateColor = useCallback((index: number, patch: Partial<SheetColor>) => {
    const next = data.colors.map((c, i) => (i === index ? { ...c, ...patch } : c));
    update({ colors: next });
  }, [data.colors, update]);

  const updateNote = useCallback((index: number, value: string) => {
    const next = [...data.notes];
    next[index] = value;
    update({ notes: next });
  }, [data.notes, update]);

  const addNote = useCallback(() => {
    if (data.notes.length >= MAX_NOTES) return;
    update({ notes: [...data.notes, ''] });
    playSound('expand');
  }, [data.notes, update]);

  const removeNote = useCallback((index: number) => {
    if (data.notes.length <= 1) {
      update({ notes: [''] });
      return;
    }
    const next = [...data.notes];
    next.splice(index, 1);
    update({ notes: next });
    playSound('collapse');
  }, [data.notes, update]);

  const handleExport = useCallback(async () => {
    if (!previewRef.current) return;
    setExporting(true);
    playSound('exportStart');
    try {
      const dataUrl = await toPng(previewRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: settings.depth === 'light' ? '#ffffff' : '#0b1623',
      });
      const link = document.createElement('a');
      link.download = `${data.characterName || 'character'}-reference-sheet.png`;
      link.href = dataUrl;
      link.click();
      playSound('downloadSound');
    } catch {
      playSound('error');
    } finally {
      setExporting(false);
    }
  }, [settings.depth, data.characterName]);

  const handleReset = useCallback(() => {
    if (!window.confirm(copy('resetConfirm'))) return;
    if (data.mainImage) {
      try { URL.revokeObjectURL(data.mainImage); } catch { /* ignore */ }
      objectUrlsRef.current.delete(data.mainImage);
    }
    data.detailImages.forEach((url) => {
      try { URL.revokeObjectURL(url); } catch { /* ignore */ }
      objectUrlsRef.current.delete(url);
    });
    const defaults = getDefaultData();
    setData(defaults);
    saveData(defaults);
    playSound('resetSound');
  }, [data, copy]);

  const templateTip = useMemo(() => {
    if (data.template === 'standard') return copy('tipStandard');
    if (data.template === 'palette') return copy('tipPalette');
    return copy('tipShowcase');
  }, [data.template, copy]);

  const isLight = settings.depth === 'light';
  const previewBg = isLight ? '#ffffff' : '#0b1623';
  const previewText = isLight ? '#203246' : '#eef4fb';
  const previewMuted = isLight ? '#64798f' : '#9fb2c6';
  const previewBorder = isLight ? 'rgba(120,145,170,0.28)' : 'rgba(98,132,166,0.26)';

  const previewStyle = useMemo(() => ({
    background: previewBg,
    color: previewText,
    border: `1px solid ${previewBorder}`,
    borderRadius: 14,
    padding: 24,
    minHeight: 480,
  }), [previewBg, previewText, previewBorder]);

  return (
    <main className="feature-shell tool-page-shell">
      <header className="feature-header">
        <div>
          <button className="secondary-button small-button" type="button" data-sfx-handled onClick={() => { playSound('back'); onBack(); }}>
            {backHome}
          </button>
        </div>
        <div className="feature-header-meta">
          <span>{pageDescription}</span>
          <button className="secondary-button small-button" type="button" data-sfx-handled onClick={() => { playSound('settingsOpen'); onOpenSettings(); }}>
            {openSettings}
          </button>
        </div>
      </header>

      <section className="feature-intro-card" style={{ marginBottom: 18 }}>
        <h2>{pageTitle}</h2>
        <p style={{ marginTop: 10, color: 'var(--text-secondary)' }}>{pageDescription}</p>
      </section>

      <div className="feature-main" style={{ gridTemplateColumns: 'minmax(280px, 0.85fr) minmax(0, 1.15fr)' }}>
        {/* Left Panel */}
        <div className="layout-column">
          <div className="tool-workbench">
            <h3 className="section-label" style={{ marginBottom: 14 }}>{copy('templateLabel')}</h3>
            <div className="chip-row" style={{ marginBottom: 12 }}>
              {(['standard', 'palette', 'showcase'] as TemplateType[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  data-sfx-handled
                  className={`choice-chip ${data.template === t ? 'active' : ''}`}
                  onClick={() => { playSound('select'); update({ template: t }); }}
                  style={{ minHeight: 40, padding: '0 14px' }}
                >
                  {copy(`template${t.charAt(0).toUpperCase() + t.slice(1)}`)}
                </button>
              ))}
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 4 }}>{templateTip}</p>
          </div>

          <div className="tool-workbench">
            <h3 className="section-label" style={{ marginBottom: 14 }}>{copy('characterName')}</h3>
            <input
              type="text"
              className="text-input"
              value={data.characterName}
              onChange={(e) => update({ characterName: e.target.value })}
              placeholder={copy('characterName')}
              style={{
                width: '100%',
                minHeight: 44,
                padding: '0 14px',
                borderRadius: 12,
                border: '1px solid var(--border)',
                background: isLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.03)',
                color: 'var(--text-main)',
                fontSize: 15,
              }}
            />
          </div>

          <div className="tool-workbench">
            <h3 className="section-label" style={{ marginBottom: 14 }}>{copy('mainImage')}</h3>
            <div
              data-sfx-handled
              onClick={() => { playSound('buttonClick'); fileInputRef.current?.click(); }}
              onDrop={(e) => handleDrop(e, 'main')}
              onDragOver={(e) => handleDragOver(e, 'main')}
              onDragLeave={handleDragLeave}
              style={{
                border: `2px dashed ${dragOver === 'main' ? 'var(--accent-solid)' : 'var(--border)'}`,
                borderRadius: 12,
                minHeight: 140,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                background: dragOver === 'main' ? 'var(--accent-soft)' : 'transparent',
                transition: 'all 180ms ease',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {data.mainImage ? (
                <>
                  <img
                    src={data.mainImage}
                    alt="main"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 10 }}
                  />
                  <div style={{ position: 'absolute', bottom: 8, right: 8, display: 'flex', gap: 6 }}>
                    <button
                      type="button"
                      data-sfx-handled
                      className="secondary-button small-button"
                      style={{ fontSize: 12, minHeight: 32 }}
                      onClick={(e) => { e.stopPropagation(); playSound('buttonClick'); fileInputRef.current?.click(); }}
                    >
                      {copy('replaceImage')}
                    </button>
                    <button
                      type="button"
                      data-sfx-handled
                      className="icon-button danger"
                      style={{ minHeight: 32, minWidth: 32 }}
                      onClick={(e) => { e.stopPropagation(); playSound('deleteSound'); removeMainImage(); }}
                    >
                      ✕
                    </button>
                  </div>
                </>
              ) : (
                <span style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{copy('uploadHint')}</span>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleMainImageUpload(file);
                e.currentTarget.value = '';
              }}
            />
          </div>

          <div className="tool-workbench">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <h3 className="section-label" style={{ margin: 0 }}>{copy('detailImages')}</h3>
              {data.detailImages.length < MAX_DETAIL_IMAGES && (
                <button
                  type="button"
                  data-sfx-handled
                  className="secondary-button small-button"
                  style={{ fontSize: 12, minHeight: 32 }}
                  onClick={() => { playSound('buttonClick'); detailInputRef.current?.click(); }}
                >
                  {copy('addDetail')}
                </button>
              )}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
              {data.detailImages.map((url, idx) => (
                <div key={url + idx} style={{ position: 'relative', borderRadius: 10, overflow: 'hidden', border: '1px solid var(--border)', aspectRatio: '1' }}>
                  <img src={url} alt={`detail-${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button
                    type="button"
                    data-sfx-handled
                    className="icon-button danger"
                    style={{ position: 'absolute', top: 4, right: 4, minHeight: 28, minWidth: 28, fontSize: 12 }}
                    onClick={() => { playSound('deleteSound'); removeDetailImage(idx); }}
                  >
                    ✕
                  </button>
                </div>
              ))}
              {data.detailImages.length < MAX_DETAIL_IMAGES && (
                <div
                  data-sfx-handled
                  onClick={() => { playSound('buttonClick'); detailInputRef.current?.click(); }}
                  onDrop={(e) => handleDrop(e, 'detail')}
                  onDragOver={(e) => handleDragOver(e, 'detail')}
                  onDragLeave={handleDragLeave}
                  style={{
                    border: `2px dashed ${dragOver === 'detail' ? 'var(--accent-solid)' : 'var(--border)'}`,
                    borderRadius: 10,
                    aspectRatio: '1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    background: dragOver === 'detail' ? 'var(--accent-soft)' : 'transparent',
                    transition: 'all 180ms ease',
                  }}
                >
                  <span style={{ color: 'var(--text-secondary)', fontSize: 20 }}>+</span>
                </div>
              )}
            </div>
            <input
              ref={detailInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleDetailImageUpload(file);
                e.currentTarget.value = '';
              }}
            />
          </div>

          <div className="tool-workbench">
            <h3 className="section-label" style={{ marginBottom: 14 }}>{copy('colors')}</h3>
            <div style={{ display: 'grid', gap: 10 }}>
              {data.colors.map((color, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <input
                    type="color"
                    value={color.hex}
                    onChange={(e) => updateColor(idx, { hex: e.target.value })}
                    style={{ width: 40, height: 40, border: 'none', borderRadius: 8, cursor: 'pointer', padding: 0, background: 'transparent' }}
                    title={copy('colorHex')}
                  />
                  <input
                    type="text"
                    value={color.name}
                    onChange={(e) => updateColor(idx, { name: e.target.value })}
                    placeholder={copy('colorName')}
                    style={{
                      flex: 1,
                      minHeight: 40,
                      padding: '0 12px',
                      borderRadius: 10,
                      border: '1px solid var(--border)',
                      background: isLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.03)',
                      color: 'var(--text-main)',
                      fontSize: 14,
                    }}
                  />
                  <code style={{ fontSize: 12, color: 'var(--text-secondary)', fontFamily: 'monospace', minWidth: 60 }}>{color.hex}</code>
                </div>
              ))}
            </div>
          </div>

          <div className="tool-workbench">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <h3 className="section-label" style={{ margin: 0 }}>{copy('notes')}</h3>
              {data.notes.length < MAX_NOTES && (
                <button type="button" data-sfx-handled className="secondary-button small-button" style={{ fontSize: 12, minHeight: 32 }} onClick={() => { playSound('buttonClick'); addNote(); }}>
                  +
                </button>
              )}
            </div>
            <div style={{ display: 'grid', gap: 8 }}>
              {data.notes.map((note, idx) => (
                <div key={idx} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input
                    type="text"
                    value={note}
                    onChange={(e) => updateNote(idx, e.target.value)}
                    placeholder={`${copy('noteText')} ${idx + 1}`}
                    style={{
                      flex: 1,
                      minHeight: 40,
                      padding: '0 12px',
                      borderRadius: 10,
                      border: '1px solid var(--border)',
                      background: isLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.03)',
                      color: 'var(--text-main)',
                      fontSize: 14,
                    }}
                  />
                  <button
                    type="button"
                    data-sfx-handled
                    className="icon-button danger"
                    style={{ minHeight: 32, minWidth: 32, fontSize: 12 }}
                    onClick={() => { playSound('deleteSound'); removeNote(idx); }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="tool-workbench" style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button
              type="button"
              data-sfx-handled
              className="primary-button"
              style={{ flex: 1, minHeight: 52 }}
              onClick={() => { playSound('downloadSound'); handleExport(); }}
              disabled={exporting || !data.mainImage}
            >
              {exporting ? copy('exporting') : copy('exportPng')}
            </button>
            <button
              type="button"
              data-sfx-handled
              className="secondary-button"
              style={{ minHeight: 52 }}
              onClick={() => { playSound('resetSound'); handleReset(); }}
            >
              {copy('reset')}
            </button>
          </div>
        </div>

        {/* Right: Preview */}
        <div className="layout-column">
          <div className="tool-workbench">
            <h3 className="section-label" style={{ marginBottom: 14 }}>{copy('previewTitle')}</h3>
            <div ref={previewRef} style={previewStyle}>
              {/* Standard Template */}
              {data.template === 'standard' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 20, height: '100%' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {data.characterName && (
                      <h2 style={{ margin: 0, fontSize: 28, color: previewText, letterSpacing: '-0.02em' }}>{data.characterName}</h2>
                    )}
                    <div style={{ flex: 1, borderRadius: 12, overflow: 'hidden', border: `1px solid ${previewBorder}`, background: isLight ? '#f4f7fb' : '#09131f', minHeight: 280 }}>
                      {data.mainImage ? (
                        <img src={data.mainImage} alt="main" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                      ) : (
                        <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: previewMuted, fontSize: 14 }}>{copy('emptyMainImage')}</div>
                      )}
                    </div>
                    {data.detailImages.length > 0 && (
                      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(data.detailImages.length, 4)}, 1fr)`, gap: 10 }}>
                        {data.detailImages.map((url, idx) => (
                          <div key={idx} style={{ borderRadius: 8, overflow: 'hidden', border: `1px solid ${previewBorder}`, aspectRatio: '1' }}>
                            <img src={url} alt={`detail-${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div>
                      <h4 style={{ margin: '0 0 10px', fontSize: 14, color: previewMuted, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{copy('colors')}</h4>
                      <div style={{ display: 'grid', gap: 8 }}>
                        {data.colors.map((c, idx) => (
                          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ width: 32, height: 32, borderRadius: 6, background: c.hex, border: `1px solid ${previewBorder}`, flexShrink: 0 }} />
                            <div style={{ minWidth: 0 }}>
                              <div style={{ fontSize: 13, color: previewText, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</div>
                              <div style={{ fontSize: 11, color: previewMuted, fontFamily: 'monospace' }}>{c.hex}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    {data.notes.some((n) => n.trim()) && (
                      <div>
                        <h4 style={{ margin: '0 0 10px', fontSize: 14, color: previewMuted, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{copy('notes')}</h4>
                        <ul style={{ margin: 0, paddingLeft: 16, display: 'grid', gap: 6 }}>
                          {data.notes.filter((n) => n.trim()).map((note, idx) => (
                            <li key={idx} style={{ fontSize: 13, color: previewText, lineHeight: 1.5 }}>{note}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Palette Template */}
              {data.template === 'palette' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20, height: '100%' }}>
                  {data.characterName && (
                    <h2 style={{ margin: 0, fontSize: 28, color: previewText, textAlign: 'center', letterSpacing: '-0.02em' }}>{data.characterName}</h2>
                  )}
                  <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(data.colors.length, 3)}, 1fr)`, gap: 12, flex: 1 }}>
                    {data.colors.map((c, idx) => (
                      <div key={idx} style={{ borderRadius: 12, overflow: 'hidden', border: `1px solid ${previewBorder}`, display: 'flex', flexDirection: 'column' }}>
                        <div style={{ flex: 1, background: c.hex, minHeight: 120 }} />
                        <div style={{ padding: '10px 12px', background: isLight ? '#f4f7fb' : '#09131f' }}>
                          <div style={{ fontSize: 14, color: previewText, fontWeight: 600 }}>{c.name}</div>
                          <div style={{ fontSize: 12, color: previewMuted, fontFamily: 'monospace', marginTop: 2 }}>{c.hex}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: 16, alignItems: 'center', justifyContent: 'center' }}>
                    {data.mainImage ? (
                      <img src={data.mainImage} alt="main" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 999, border: `2px solid ${previewBorder}` }} />
                    ) : (
                      <div style={{ width: 80, height: 80, borderRadius: 999, border: `2px dashed ${previewBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: previewMuted, fontSize: 12 }}>?</div>
                    )}
                    {data.notes.filter((n) => n.trim()).length > 0 && (
                      <ul style={{ margin: 0, paddingLeft: 16, display: 'grid', gap: 4 }}>
                        {data.notes.filter((n) => n.trim()).map((note, idx) => (
                          <li key={idx} style={{ fontSize: 12, color: previewText }}>{note}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              )}

              {/* Showcase Template */}
              {data.template === 'showcase' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20, height: '100%' }}>
                  {data.characterName && (
                    <h2 style={{ margin: 0, fontSize: 28, color: previewText, letterSpacing: '-0.02em' }}>{data.characterName}</h2>
                  )}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, flex: 1 }}>
                    <div style={{ gridRow: 'span 2', borderRadius: 12, overflow: 'hidden', border: `1px solid ${previewBorder}`, background: isLight ? '#f4f7fb' : '#09131f' }}>
                      {data.mainImage ? (
                        <img src={data.mainImage} alt="main" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: previewMuted }}>{copy('emptyMainImage')}</div>
                      )}
                    </div>
                    {data.detailImages.slice(0, 2).map((url, idx) => (
                      <div key={idx} style={{ borderRadius: 12, overflow: 'hidden', border: `1px solid ${previewBorder}`, aspectRatio: '1' }}>
                        <img src={url} alt={`detail-${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    ))}
                    {data.detailImages.length < 2 && (
                      <div style={{ borderRadius: 12, border: `1px dashed ${previewBorder}`, aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: previewMuted, fontSize: 12 }}>
                        {copy('detailImages')}
                      </div>
                    )}
                  </div>
                  {data.detailImages.length > 2 && (
                    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(data.detailImages.length - 2, 4)}, 1fr)`, gap: 10 }}>
                      {data.detailImages.slice(2).map((url, idx) => (
                        <div key={idx + 2} style={{ borderRadius: 10, overflow: 'hidden', border: `1px solid ${previewBorder}`, aspectRatio: '1' }}>
                          <img src={url} alt={`detail-${idx + 2}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                      ))}
                    </div>
                  )}
                  {data.notes.some((n) => n.trim()) && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {data.notes.filter((n) => n.trim()).map((note, idx) => (
                        <span key={idx} style={{ fontSize: 12, color: previewText, background: isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)', padding: '6px 12px', borderRadius: 999, border: `1px solid ${previewBorder}` }}>
                          {note}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
