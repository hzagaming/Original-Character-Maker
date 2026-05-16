import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { playSound } from './audioEngine';
import type { AppLanguage, SettingsState } from './types';

type AssetType = 'image' | 'audio' | 'gif' | 'video' | 'other';

interface AssetItem {
  id: string;
  name: string;
  type: AssetType;
  dataUrl: string;
  size: number;
  sourceTool?: string;
  createdAt: string;
}

interface AssetMeta {
  id: string;
  name: string;
  type: AssetType;
  size: number;
  sourceTool?: string;
  createdAt: string;
}

type SharedPageProps = {
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
  onSwitchTool?: (toolId: string) => void;
  onOpenDocs?: (toolId?: string, section?: string, errorCode?: string) => void;
};

function useBeforeUnloadGuard(isDirty: boolean) {
  useEffect(() => {
    if (!isDirty) return;
    function handleBeforeUnload(event: BeforeUnloadEvent) {
      event.preventDefault();
      event.returnValue = '';
    }
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);
}

const ASSETS_STORAGE_KEY = 'oc-maker.asset-gallery';
const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB
const MAX_ASSETS = 200;

function detectTypeFromMime(mime: string): AssetType {
  if (mime.startsWith('image/')) {
    return mime === 'image/gif' ? 'gif' : 'image';
  }
  if (mime.startsWith('audio/')) return 'audio';
  if (mime.startsWith('video/')) return 'video';
  return 'other';
}

function detectTypeFromName(name: string): AssetType {
  const ext = name.split('.').pop()?.toLowerCase() ?? '';
  if (['png', 'jpg', 'jpeg', 'webp', 'bmp', 'svg'].includes(ext)) return 'image';
  if (ext === 'gif') return 'gif';
  if (['mp3', 'wav', 'ogg', 'flac', 'm4a', 'aac', 'webm'].includes(ext)) return 'audio';
  if (['mp4', 'mov', 'avi', 'mkv'].includes(ext)) return 'video';
  return 'other';
}

function formatBytes(n: number): string {
  if (!isFinite(n) || n < 0) return '0 B';
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}

function loadAssetMetas(): AssetMeta[] {
  try {
    const raw = window.localStorage.getItem(ASSETS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is AssetMeta =>
        item && typeof item === 'object' && typeof item.id === 'string' && typeof item.name === 'string',
    );
  } catch {
    return [];
  }
}

function saveAssetMetas(metas: AssetMeta[]) {
  try {
    window.localStorage.setItem(ASSETS_STORAGE_KEY, JSON.stringify(metas));
  } catch {
    // ignore quota errors
  }
}

function metaKey(id: string) {
  return `oc-maker.asset-data.${id}`;
}

function loadAssetDataUrl(id: string): string | null {
  try {
    return window.localStorage.getItem(metaKey(id));
  } catch {
    return null;
  }
}

function saveAssetDataUrl(id: string, dataUrl: string) {
  try {
    window.localStorage.setItem(metaKey(id), dataUrl);
  } catch {
    // ignore quota errors
  }
}

function removeAssetDataUrl(id: string) {
  try {
    window.localStorage.removeItem(metaKey(id));
  } catch {
    // ignore
  }
}

const uiCopy: Record<
  'zh' | 'ja' | 'en' | 'ru' | 'ko',
  {
    importTitle: string;
    importHint: string;
    searchPlaceholder: string;
    filterAll: string;
    filterImage: string;
    filterAudio: string;
    filterGif: string;
    filterVideo: string;
    emptyTitle: string;
    emptyHint: string;
    selectAll: string;
    deselectAll: string;
    deleteSelected: string;
    downloadSelected: string;
    itemsCount: string;
    itemsSelected: string;
    previewTitle: string;
    closePreview: string;
    downloadOne: string;
    deleteOne: string;
    sourceTool: string;
    createdAt: string;
    fileSize: string;
    dropHint: string;
    dropActiveHint: string;
    maxFilesWarning: string;
    fileTooLarge: string;
    quotaWarning: string;
    importSuccess: string;
    deleteConfirm: string;
    deleteConfirmPlural: string;
    assetOverview: string;
  }
> = {
  zh: {
    importTitle: '导入资产',
    importHint: '支持 PNG / JPG / GIF / WEBP / MP3 / WAV / FLAC 等格式',
    searchPlaceholder: '搜索资产…',
    filterAll: '全部',
    filterImage: '图片',
    filterAudio: '音频',
    filterGif: 'GIF',
    filterVideo: '视频',
    emptyTitle: '资产库为空',
    emptyHint: '拖拽文件到此处，或点击右上角「导入」按钮开始收集你的角色素材。',
    selectAll: '全选',
    deselectAll: '取消全选',
    deleteSelected: '删除选中',
    downloadSelected: '下载选中',
    itemsCount: '共 {count} 项',
    itemsSelected: '已选 {count} 项',
    previewTitle: '预览',
    closePreview: '关闭预览',
    downloadOne: '下载',
    deleteOne: '删除',
    sourceTool: '来源',
    createdAt: '创建时间',
    fileSize: '大小',
    dropHint: '拖拽文件到此处导入',
    dropActiveHint: '释放以导入',
    maxFilesWarning: '资产库已达上限（{max}），请先删除部分资产。',
    fileTooLarge: '文件过大：{name}（>{max}）',
    quotaWarning: '存储空间不足，部分资产可能未能保存。',
    importSuccess: '已导入：{name}',
    deleteConfirm: '确定要删除「{name}」吗？此操作不可撤销。',
    deleteConfirmPlural: '确定要删除选中的 {count} 项资产吗？此操作不可撤销。',
    assetOverview: '资产概览',
  },
  ja: {
    importTitle: 'アセットをインポート',
    importHint: 'PNG / JPG / GIF / WEBP / MP3 / WAV / FLAC などに対応',
    searchPlaceholder: 'アセットを検索…',
    filterAll: 'すべて',
    filterImage: '画像',
    filterAudio: 'オーディオ',
    filterGif: 'GIF',
    filterVideo: '動画',
    emptyTitle: 'アセットライブラリは空です',
    emptyHint: 'ファイルをここにドラッグするか、右上の「インポート」ボタンをクリックしてください。',
    selectAll: 'すべて選択',
    deselectAll: '選択解除',
    deleteSelected: '選択を削除',
    downloadSelected: '選択をダウンロード',
    itemsCount: '計 {count} 件',
    itemsSelected: '{count} 件選択中',
    previewTitle: 'プレビュー',
    closePreview: 'プレビューを閉じる',
    downloadOne: 'ダウンロード',
    deleteOne: '削除',
    sourceTool: 'ソース',
    createdAt: '作成日時',
    fileSize: 'サイズ',
    dropHint: 'ファイルをドラッグしてインポート',
    dropActiveHint: 'ドロップしてインポート',
    maxFilesWarning: 'アセット上限（{max}）に達しました。一部を削除してください。',
    fileTooLarge: 'ファイルが大きすぎます：{name}（>{max}）',
    quotaWarning: 'ストレージ容量不足のため、一部のアセットが保存できない可能性があります。',
    importSuccess: 'インポート完了：{name}',
    deleteConfirm: '「{name}」を削除してもよろしいですか？この操作は元に戻せません。',
    deleteConfirmPlural: '選択した {count} 件のアセットを削除してもよろしいですか？この操作は元に戻せません。',
    assetOverview: 'アセット概要',
  },
  en: {
    importTitle: 'Import Assets',
    importHint: 'Supports PNG / JPG / GIF / WEBP / MP3 / WAV / FLAC and more',
    searchPlaceholder: 'Search assets…',
    filterAll: 'All',
    filterImage: 'Images',
    filterAudio: 'Audio',
    filterGif: 'GIF',
    filterVideo: 'Video',
    emptyTitle: 'Asset Gallery is Empty',
    emptyHint: 'Drag files here, or click the Import button in the top-right to start collecting your character assets.',
    selectAll: 'Select All',
    deselectAll: 'Deselect All',
    deleteSelected: 'Delete Selected',
    downloadSelected: 'Download Selected',
    itemsCount: '{count} items',
    itemsSelected: '{count} selected',
    previewTitle: 'Preview',
    closePreview: 'Close Preview',
    downloadOne: 'Download',
    deleteOne: 'Delete',
    sourceTool: 'Source',
    createdAt: 'Created',
    fileSize: 'Size',
    dropHint: 'Drag files here to import',
    dropActiveHint: 'Drop to import',
    maxFilesWarning: 'Asset limit reached ({max}). Please delete some assets first.',
    fileTooLarge: 'File too large: {name} (>{max})',
    quotaWarning: 'Storage quota may be insufficient; some assets might not be saved.',
    importSuccess: 'Imported: {name}',
    deleteConfirm: 'Delete "{name}"? This cannot be undone.',
    deleteConfirmPlural: 'Delete {count} selected assets? This cannot be undone.',
    assetOverview: 'Asset Overview',
  },
  ru: {
    importTitle: 'Импорт активов',
    importHint: 'Поддерживает PNG / JPG / GIF / WEBP / MP3 / WAV / FLAC и другие',
    searchPlaceholder: 'Поиск активов…',
    filterAll: 'Все',
    filterImage: 'Изображения',
    filterAudio: 'Аудио',
    filterGif: 'GIF',
    filterVideo: 'Видео',
    emptyTitle: 'Галерея активов пуста',
    emptyHint: 'Перетащите файлы сюда или нажмите кнопку «Импорт» в правом верхнем углу.',
    selectAll: 'Выбрать все',
    deselectAll: 'Снять выделение',
    deleteSelected: 'Удалить выбранное',
    downloadSelected: 'Скачать выбранное',
    itemsCount: '{count} элементов',
    itemsSelected: 'Выбрано: {count}',
    previewTitle: 'Предпросмотр',
    closePreview: 'Закрыть предпросмотр',
    downloadOne: 'Скачать',
    deleteOne: 'Удалить',
    sourceTool: 'Источник',
    createdAt: 'Создано',
    fileSize: 'Размер',
    dropHint: 'Перетащите файлы сюда для импорта',
    dropActiveHint: 'Отпустите для импорта',
    maxFilesWarning: 'Достигнут лимит активов ({max}). Удалите часть активов.',
    fileTooLarge: 'Файл слишком большой: {name} (>{max})',
    quotaWarning: 'Недостаточно места; некоторые активы могут не сохраниться.',
    importSuccess: 'Импортировано: {name}',
    deleteConfirm: 'Удалить «{name}»? Это действие нельзя отменить.',
    deleteConfirmPlural: 'Удалить {count} выбранных активов? Это действие нельзя отменить.',
    assetOverview: 'Обзор активов',
  },
  ko: {
    importTitle: '에셋 가져오기',
    importHint: 'PNG / JPG / GIF / WEBP / MP3 / WAV / FLAC 등 지원',
    searchPlaceholder: '에셋 검색…',
    filterAll: '전체',
    filterImage: '이미지',
    filterAudio: '오디오',
    filterGif: 'GIF',
    filterVideo: '비디오',
    emptyTitle: '에셋 갤러리가 비어 있습니다',
    emptyHint: '파일을 여기로 드래그하거나 오른쪽 상단의 「가져오기」 버튼을 클릭하세요.',
    selectAll: '전체 선택',
    deselectAll: '선택 해제',
    deleteSelected: '선택 항목 삭제',
    downloadSelected: '선택 항목 다운로드',
    itemsCount: '총 {count}개',
    itemsSelected: '{count}개 선택됨',
    previewTitle: '미리보기',
    closePreview: '미리보기 닫기',
    downloadOne: '다운로드',
    deleteOne: '삭제',
    sourceTool: '출처',
    createdAt: '생성일',
    fileSize: '크기',
    dropHint: '파일을 드래그하여 가져오기',
    dropActiveHint: '놓아서 가져오기',
    maxFilesWarning: '에셋 한도({max})에 도달했습니다. 일부를 삭제해 주세요.',
    fileTooLarge: '파일이 너무 큽니다: {name} (>{max})',
    quotaWarning: '저장 공간이 부족하여 일부 에셋이 저장되지 않을 수 있습니다.',
    importSuccess: '가져오기 완료: {name}',
    deleteConfirm: '「{name}」을(를) 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.',
    deleteConfirmPlural: '선택한 {count}개의 에셋을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.',
    assetOverview: '에셋 개요',
  },
};

function getCopy(lang: AppLanguage) {
  const base = uiCopy.en;
  if (lang === 'zh') return { ...base, ...uiCopy.zh };
  if (lang === 'ja') return { ...base, ...uiCopy.ja };
  if (lang === 'ru') return { ...base, ...uiCopy.ru };
  if (lang === 'ko') return { ...base, ...uiCopy.ko };
  return base;
}

export function AssetGalleryPage({
  appSubtitle,
  backHome,
  openSettings,
  privacyNote,
  pageTitle,
  pageDescription,
  settings: _settings,
  language,
  onBack,
  onOpenSettings,
  onSwitchTool: _onSwitchTool,
  onOpenDocs,
}: SharedPageProps) {
  const copy = getCopy(language);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);

  const [assets, setAssets] = useState<AssetItem[]>(() => {
    const metas = loadAssetMetas();
    return metas
      .map((m) => {
        const dataUrl = loadAssetDataUrl(m.id);
        if (!dataUrl) return null;
        return { ...m, dataUrl };
      })
      .filter((a): a is AssetItem => a !== null);
  });

  const [filter, setFilter] = useState<AssetType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [previewAsset, setPreviewAsset] = useState<AssetItem | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [isClosingPreview, setIsClosingPreview] = useState(false);

  // Persist meta list whenever assets change
  useEffect(() => {
    const metas: AssetMeta[] = assets.map((a) => ({
      id: a.id,
      name: a.name,
      type: a.type,
      size: a.size,
      sourceTool: a.sourceTool,
      createdAt: a.createdAt,
    }));
    saveAssetMetas(metas);
  }, [assets]);

  // Toast auto-dismiss
  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(null), 2600);
    return () => window.clearTimeout(id);
  }, [toast]);

  const filteredAssets = useMemo(() => {
    let list = assets;
    if (filter !== 'all') {
      list = list.filter((a) => a.type === filter);
    }
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter((a) => a.name.toLowerCase().includes(q));
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [assets, filter, searchQuery]);

  const handleImportFile = useCallback(
    async (file: File) => {
      if (assets.length >= MAX_ASSETS) {
        setToast(copy.maxFilesWarning.replace('{max}', String(MAX_ASSETS)));
        playSound('warning');
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        setToast(copy.fileTooLarge.replace('{name}', file.name).replace('{max}', formatBytes(MAX_FILE_SIZE)));
        playSound('warning');
        return;
      }
      try {
        playSound('uploadStart');
        const dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result));
          reader.onerror = () => reject(new Error('read failed'));
          reader.readAsDataURL(file);
        });
        const type = detectTypeFromMime(file.type) || detectTypeFromName(file.name);
        const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
        const item: AssetItem = {
          id,
          name: file.name,
          type,
          dataUrl,
          size: file.size,
          createdAt: new Date().toISOString(),
        };
        saveAssetDataUrl(id, dataUrl);
        setAssets((prev) => [item, ...prev]);
        setToast(copy.importSuccess.replace('{name}', file.name));
        playSound('uploadComplete');
      } catch {
        setToast(copy.quotaWarning);
        playSound('error');
      }
    },
    [assets.length, copy],
  );

  const handleDelete = useCallback(
    (id: string) => {
      const item = assets.find((a) => a.id === id);
      if (!item) return;
      if (!window.confirm(copy.deleteConfirm.replace('{name}', item.name))) return;
      removeAssetDataUrl(id);
      setAssets((prev) => prev.filter((a) => a.id !== id));
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      playSound('deleteSound');
    },
    [assets, copy],
  );

  const handleDeleteSelected = useCallback(() => {
    if (selectedIds.size === 0) return;
    if (!window.confirm(copy.deleteConfirmPlural.replace('{count}', String(selectedIds.size)))) return;
    selectedIds.forEach((id) => removeAssetDataUrl(id));
    setAssets((prev) => prev.filter((a) => !selectedIds.has(a.id)));
    setSelectedIds(new Set());
    playSound('deleteSound');
  }, [selectedIds, copy]);

  const handleDownload = useCallback((item: AssetItem) => {
    const a = document.createElement('a');
    a.href = item.dataUrl;
    a.download = item.name;
    a.click();
    playSound('downloadSound');
  }, []);

  const handleDownloadSelected = useCallback(() => {
    const selected = assets.filter((a) => selectedIds.has(a.id));
    selected.forEach((item, i) => {
      window.setTimeout(() => {
        const a = document.createElement('a');
        a.href = item.dataUrl;
        a.download = item.name;
        a.click();
      }, i * 200);
    });
    if (selected.length > 0) playSound('downloadSound');
  }, [assets, selectedIds]);

  const toggleSelect = useCallback(
    (id: string, isCtrl: boolean) => {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        if (isCtrl) {
          if (next.has(id)) {
            next.delete(id);
            playSound('deselect');
          } else {
            next.add(id);
            playSound('select');
          }
        } else {
          if (next.has(id) && next.size === 1) {
            // Already the only selection — keep it to prevent double-click flicker
            return prev;
          }
          next.clear();
          next.add(id);
          playSound('select');
        }
        return next;
      });
    },
    [],
  );

  const selectAll = useCallback(() => {
    setSelectedIds(new Set(filteredAssets.map((a) => a.id)));
    playSound('select');
  }, [filteredAssets]);

  const deselectAll = useCallback(() => {
    setSelectedIds(new Set());
    playSound('deselect');
  }, []);

  // Drag & drop
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current += 1;
    const types = Array.from(e.dataTransfer.types);
    if (types.includes('Files')) setIsDragOver(true);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current -= 1;
    if (dragCounter.current <= 0) {
      dragCounter.current = 0;
      setIsDragOver(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      dragCounter.current = 0;
      setIsDragOver(false);
      const files = Array.from(e.dataTransfer.files);
      files.forEach((f) => handleImportFile(f));
    },
    [handleImportFile],
  );

  const openPreview = useCallback((item: AssetItem) => {
    setPreviewAsset(item);
    playSound('modalOpen');
  }, []);

  const closePreview = useCallback(() => {
    setIsClosingPreview(true);
    window.setTimeout(() => {
      setPreviewAsset(null);
      setIsClosingPreview(false);
    }, 220);
    playSound('modalClose');
  }, []);

  const closePreviewSilent = useCallback(() => {
    setIsClosingPreview(true);
    window.setTimeout(() => {
      setPreviewAsset(null);
      setIsClosingPreview(false);
    }, 220);
  }, []);

  const totalSize = useMemo(() => assets.reduce((sum, a) => sum + a.size, 0), [assets]);

  useBeforeUnloadGuard(assets.length > 0);

  return (
    <main
      className="feature-shell tool-page-shell"
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <header className="feature-header fade-up delay-1">
        <div className="feature-header-meta">
          <button className="back-link" type="button" data-sfx-handled onClick={() => { playSound('back'); onBack(); }}>
            ← {backHome}
          </button>
          <span className="version-pill" style={{ minHeight: 40, padding: '0 14px' }}>
            {copy.itemsCount.replace('{count}', String(assets.length))} · {formatBytes(totalSize)}
          </span>
        </div>
        <div className="tool-header-actions">
          <button className="secondary-button small-button" type="button" data-sfx-handled onClick={() => { playSound('buttonClick'); fileInputRef.current?.click(); }}>
            {copy.importTitle}
          </button>
          <button className="secondary-button small-button" type="button" data-sfx-handled onClick={() => { playSound('buttonClick'); onOpenSettings(); }}>
            {openSettings}
          </button>
          {onOpenDocs && (
            <button className="secondary-button small-button" type="button" data-sfx-handled onClick={() => { playSound('buttonClick'); onOpenDocs('asset-gallery'); }}>
              {language === 'zh' ? '帮助' : language === 'ja' ? 'ヘルプ' : language === 'ru' ? 'Справка' : language === 'ko' ? '도움말' : 'Help'}
            </button>
          )}
        </div>
      </header>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        aria-label={copy.importTitle}
        accept="image/*,audio/*,video/*,.gif,.png,.jpg,.jpeg,.webp,.mp3,.wav,.ogg,.flac,.m4a,.aac,.mp4,.mov"
        hidden
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []);
          files.forEach((f) => handleImportFile(f));
          e.target.value = '';
        }}
      />

      <section className="tool-workbench fade-up delay-2">
        <div className="tool-header">
          <div>
            <h2>{pageTitle}</h2>
            <p>{pageDescription}</p>
          </div>
        </div>

        <div className="tool-grid transfer-grid">
          <div className="tool-column">
            {/* Toolbar */}
            <section className="tool-card" style={{ padding: 18 }}>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                <div className="chip-row">
                  {(['all', 'image', 'audio', 'gif', 'video'] as const).map((f) => (
                    <button
                      key={f}
                      className={`choice-chip ${filter === f ? 'active' : ''}`}
                      type="button"
                      onClick={() => { playSound('select'); setFilter(f); }}
                      data-sfx-handled
                    >
                      {f === 'all' ? copy.filterAll : f === 'image' ? copy.filterImage : f === 'audio' ? copy.filterAudio : f === 'gif' ? copy.filterGif : copy.filterVideo}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  className="tool-input"
                  placeholder={copy.searchPlaceholder}
                  aria-label={copy.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ minWidth: 200, maxWidth: 320 }}
                />
              </div>

              {selectedIds.size > 0 && (
                <div style={{ marginTop: 14, display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                  <span className="tiny-copy" style={{ color: 'var(--accent-solid)' }}>
                    {copy.itemsSelected.replace('{count}', String(selectedIds.size))}
                  </span>
                  <button className="secondary-button small-button" type="button" data-sfx-handled onClick={selectAll}>{copy.selectAll}</button>
                  <button className="secondary-button small-button" type="button" data-sfx-handled onClick={deselectAll}>{copy.deselectAll}</button>
                  <button className="secondary-button small-button" type="button" data-sfx-handled onClick={handleDownloadSelected}>{copy.downloadSelected}</button>
                  <button className="secondary-button small-button" type="button" data-sfx-handled style={{ color: '#ff6b6b' }} onClick={handleDeleteSelected}>{copy.deleteSelected}</button>
                </div>
              )}
            </section>

            {/* Gallery grid */}
            {filteredAssets.length === 0 ? (
              <section className="tool-card empty-state" style={{ minHeight: 320, display: 'grid', placeItems: 'center', textAlign: 'center' }}>
                <div>
                  <h3>{copy.emptyTitle}</h3>
                  <p className="muted-copy">{copy.emptyHint}</p>
                  <p className="tiny-copy" style={{ marginTop: 8 }}>{copy.importHint}</p>
                </div>
              </section>
            ) : (
              <div
                className="asset-gallery-grid"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                  gap: 14,
                }}
              >
                {filteredAssets.map((item) => {
                  const isSelected = selectedIds.has(item.id);
                  return (
                    <div
                      key={item.id}
                      className={`asset-card ${isSelected ? 'active' : ''}`}
                      role="button"
                      tabIndex={0}
                      data-sfx-handled
                      aria-label={`${item.name}, ${formatBytes(item.size)}`}
                      onClick={(e) => toggleSelect(item.id, e.ctrlKey || e.metaKey)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          toggleSelect(item.id, e.ctrlKey || e.metaKey);
                        }
                      }}
                      onDoubleClick={() => openPreview(item)}
                    >
                      <div className="asset-thumb-wrap">
                        {item.type === 'image' || item.type === 'gif' ? (
                          <img src={item.dataUrl} alt="" loading="lazy" className="asset-thumb" />
                        ) : item.type === 'audio' ? (
                          <div className="asset-thumb audio-thumb">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="32" height="32" aria-hidden="true">
                              <path d="M9 18V5l12-2v13" />
                              <circle cx="6" cy="18" r="3" />
                              <circle cx="18" cy="16" r="3" />
                            </svg>
                          </div>
                        ) : item.type === 'video' ? (
                          <div className="asset-thumb video-thumb">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="32" height="32" aria-hidden="true">
                              <rect x="2" y="6" width="20" height="12" rx="2" />
                              <polygon points="10,10 16,12 10,14" fill="currentColor" stroke="none" />
                            </svg>
                          </div>
                        ) : (
                          <div className="asset-thumb file-thumb">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="32" height="32" aria-hidden="true">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                              <polyline points="14 2 14 8 20 8" />
                            </svg>
                          </div>
                        )}
                        {isSelected && <div className="asset-selected-badge">✓</div>}
                      </div>
                      <div className="asset-meta">
                        <span className="asset-name" title={item.name}>{item.name}</span>
                        <span className="asset-sub">
                          {formatBytes(item.size)} · {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="asset-actions">
                        <button
                          className="asset-action-btn"
                          type="button"
                          title={copy.downloadOne}
                          data-sfx-handled
                          onClick={(e) => { e.stopPropagation(); handleDownload(item); }}
                        >
                          ↓
                        </button>
                        <button
                          className="asset-action-btn"
                          type="button"
                          title={copy.deleteOne}
                          data-sfx-handled
                          onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Side info panel */}
          <div className="tool-column side">
            <section className="tool-card info-panel">
              <h3>{copy.assetOverview}</h3>
              <div className="metric-box" style={{ marginTop: 12 }}>
                <strong>{assets.length}</strong>
                <span>{copy.itemsCount.replace('{count}', String(assets.length))}</span>
              </div>
              <div className="metric-box" style={{ marginTop: 10 }}>
                <strong>{formatBytes(totalSize)}</strong>
                <span>{language === 'zh' ? '总占用' : language === 'ja' ? '合計容量' : language === 'ru' ? 'Общий размер' : language === 'ko' ? '총 용량' : 'Total Size'}</span>
              </div>
              <div className="tool-card-divider" />
              <p className="tiny-copy">{copy.importHint}</p>
              <p className="tiny-copy" style={{ marginTop: 8 }}>{privacyNote}</p>
            </section>
          </div>
        </div>
      </section>

      {/* Drag overlay */}
      {isDragOver && (
        <div
          className="modal-backdrop"
          style={{ background: 'rgba(3,9,18,0.75)', zIndex: 90 }}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div
            className="upload-dropzone"
            style={{
              position: 'absolute',
              inset: 40,
              display: 'grid',
              placeItems: 'center',
              border: '2px dashed var(--accent)',
              background: 'rgba(var(--accent-rgb), 0.08)',
              borderRadius: 28,
              fontSize: '1.25rem',
              color: 'var(--text-main)',
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '1.4rem', margin: '0 0 8px' }}>📥</p>
              <p>{copy.dropActiveHint}</p>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div
          className="notice-banner"
          role="alert"
          aria-live="polite"
          style={{
            position: 'fixed',
            bottom: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 120,
            minWidth: 260,
            maxWidth: 'min(560px, 92vw)',
            textAlign: 'center',
            animation: 'fadeUp 300ms ease',
          }}
        >
          {toast}
        </div>
      )}

      {/* Preview Modal */}
      {previewAsset && (
        <div
          className={`modal-backdrop ${isClosingPreview ? 'closing' : 'opening'}`}
          role="presentation"
          onClick={closePreview}
          style={{ zIndex: 100 }}
        >
          <section
            className={`modal-card modal-surface ${isClosingPreview ? 'closing' : 'opening'}`}
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: 'min(900px, 94vw)', maxHeight: 'min(760px, 92vh)', display: 'flex', flexDirection: 'column' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, padding: '18px 22px', borderBottom: '1px solid var(--border)' }}>
              <h3 style={{ margin: 0, fontSize: '1.15rem' }}>{copy.previewTitle}</h3>
              <button className="modal-close" type="button" data-sfx-handled onClick={closePreview} aria-label={copy.closePreview}>×</button>
            </div>
            <div style={{ flex: 1, overflow: 'auto', padding: 22, display: 'grid', placeItems: 'center', minHeight: 200 }}>
              {previewAsset.type === 'image' || previewAsset.type === 'gif' ? (
                <img src={previewAsset.dataUrl} alt={previewAsset.name} style={{ maxWidth: '100%', maxHeight: 'min(560px, 70vh)', borderRadius: 16, objectFit: 'contain' }} />
              ) : previewAsset.type === 'audio' ? (
                <audio controls src={previewAsset.dataUrl} style={{ width: '100%', maxWidth: 520 }} />
              ) : previewAsset.type === 'video' ? (
                <video controls src={previewAsset.dataUrl} style={{ maxWidth: '100%', maxHeight: 'min(480px, 60vh)', borderRadius: 16 }} />
              ) : (
                <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                  <p style={{ fontSize: '2.5rem', margin: 0 }}>📄</p>
                  <p>{previewAsset.name}</p>
                </div>
              )}
            </div>
            <div style={{ padding: '14px 22px', borderTop: '1px solid var(--border)', display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
              <div className="tiny-copy" style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                <span>{copy.fileSize}: {formatBytes(previewAsset.size)}</span>
                <span>{copy.createdAt}: {new Date(previewAsset.createdAt).toLocaleString()}</span>
                {previewAsset.sourceTool && <span>{copy.sourceTool}: {previewAsset.sourceTool}</span>}
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="secondary-button small-button" type="button" onClick={() => handleDownload(previewAsset)}>{copy.downloadOne}</button>
                <button className="secondary-button small-button" type="button" style={{ color: '#ff6b6b' }} onClick={() => { handleDelete(previewAsset.id); closePreviewSilent(); }}>{copy.deleteOne}</button>
              </div>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
