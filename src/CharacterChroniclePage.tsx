import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import { playSound } from './audioEngine';
import type { AppLanguage, SettingsState } from './types';

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

type EventType = 'birth' | 'meet' | 'separate' | 'growth' | 'battle' | 'turning_point' | 'custom';

interface ChronicleEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  eventType: EventType;
  relatedCharacterIds: string[];
  imageAssetId: string | null;
  color: string;
}

interface GalleryImage {
  id: string;
  name: string;
  dataUrl: string;
}

interface RelNode {
  id: string;
  name: string;
  color: string;
  avatarAssetId?: string;
}

const STORAGE_KEY = 'oc-maker.character-chronicle';

const EVENT_TYPE_COLORS: Record<EventType, string> = {
  birth: '#f59e0b',
  meet: '#22c55e',
  separate: '#ef4444',
  growth: '#3b82f6',
  battle: '#f97316',
  turning_point: '#a855f7',
  custom: '#64748b',
};

const EVENT_TYPE_LABELS: Record<string, Record<EventType, string>> = {
  zh: { birth: '诞生', meet: '相遇', separate: '离别', growth: '成长', battle: '战斗', turning_point: '转折', custom: '自定义' },
  ja: { birth: '誕生', meet: '出会い', separate: '別れ', growth: '成長', battle: '戦闘', turning_point: '転換点', custom: 'カスタム' },
  en: { birth: 'Birth', meet: 'Meet', separate: 'Separate', growth: 'Growth', battle: 'Battle', turning_point: 'Turning Point', custom: 'Custom' },
  ru: { birth: 'Рождение', meet: 'Встреча', separate: 'Разлука', growth: 'Рост', battle: 'Битва', turning_point: 'Поворот', custom: 'Другое' },
  ko: { birth: '탄생', meet: '만남', separate: '이별', growth: '성장', battle: '전투', turning_point: '전환점', custom: '사용자 정의' },
};

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function loadGalleryImages(): GalleryImage[] {
  try {
    const raw = window.localStorage.getItem('oc-maker.asset-gallery');
    if (!raw) return [];
    const metas = JSON.parse(raw) as Array<{ id: string; name: string; type?: string }>;
    const imgs: GalleryImage[] = [];
    for (const m of metas) {
      if (!m || m.type !== 'image') continue;
      const d = window.localStorage.getItem(`oc-maker.asset-data.${m.id}`);
      if (d) imgs.push({ id: m.id, name: m.name, dataUrl: d });
    }
    return imgs;
  } catch { return []; }
}

function loadRelationshipNodes(): RelNode[] {
  try {
    const raw = window.localStorage.getItem('oc-maker.relationship-web.nodes');
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch { return []; }
}

function loadEvents(): ChronicleEvent[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (e): e is ChronicleEvent =>
        e && typeof e === 'object' && typeof e.id === 'string' && typeof e.date === 'string' && typeof e.title === 'string',
    );
  } catch { return []; }
}

function saveEvents(events: ChronicleEvent[]) {
  try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(events)); } catch { /* ignore */ }
}

function useBeforeUnloadGuard(isDirty: boolean) {
  useEffect(() => {
    if (!isDirty) return;
    function handler(e: BeforeUnloadEvent) {
      e.preventDefault();
      e.returnValue = '';
    }
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isDirty]);
}

const copyBase = {
  zh: {
    addEvent: '添加事件',
    editEvent: '编辑事件',
    deleteEvent: '删除事件',
    eventDate: '日期',
    eventTitle: '标题',
    eventDescription: '描述',
    eventType: '事件类型',
    eventImage: '事件图片',
    relatedCharacters: '关联角色',
    selectImage: '选择图片',
    clearImage: '清除图片',
    cancel: '取消',
    save: '保存',
    delete: '删除',
    noEvents: '还没有事件',
    emptyHint: '点击「添加事件」开始构建角色的时间线。每个事件可以关联关系网中的角色和资产库图片。',
    eventsCount: '共 {count} 个事件',
    exportTimeline: '导出时间轴',
    exporting: '导出中…',
    helpButton: '帮助',
    timelineHint: '按日期排序的可视化角色时间线，支持事件类型颜色编码和关联角色展示',
    exportSuccess: '时间轴导出成功',
    exportError: '导出失败，请尝试缩小图片或降低质量',
    previewTitle: '时间轴预览',
    unnamed: '未命名',
    noImage: '无图片',
    noRelCharacters: '关系网中没有角色',
    eventTypes: EVENT_TYPE_LABELS.zh,
  },
  ja: {
    addEvent: 'イベント追加',
    editEvent: 'イベント編集',
    deleteEvent: 'イベント削除',
    eventDate: '日付',
    eventTitle: 'タイトル',
    eventDescription: '詳細',
    eventType: 'イベントタイプ',
    eventImage: 'イベント画像',
    relatedCharacters: '関連キャラ',
    selectImage: '画像を選択',
    clearImage: '画像を削除',
    cancel: 'キャンセル',
    save: '保存',
    delete: '削除',
    noEvents: 'イベントがありません',
    emptyHint: '「イベント追加」をクリックしてキャラのタイムラインを作りましょう。関係図のキャラやアセットライブラリの画像と関連付けられます。',
    eventsCount: '計 {count} イベント',
    exportTimeline: 'タイムライン出力',
    exporting: '出力中…',
    helpButton: 'ヘルプ',
    timelineHint: '日付順の可視化キャラタイムライン。イベントタイプの色分けと関連キャラ表示に対応',
    exportSuccess: 'タイムラインを出力しました',
    previewTitle: 'タイムラインプレビュー',
    unnamed: '名称未設定',
    noImage: '画像なし',
    noRelCharacters: '関係図にキャラがいません',
    eventTypes: EVENT_TYPE_LABELS.ja,
  },
  en: {
    addEvent: 'Add Event',
    editEvent: 'Edit Event',
    deleteEvent: 'Delete Event',
    eventDate: 'Date',
    eventTitle: 'Title',
    eventDescription: 'Description',
    eventType: 'Event Type',
    eventImage: 'Event Image',
    relatedCharacters: 'Related Characters',
    selectImage: 'Select Image',
    clearImage: 'Clear Image',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    noEvents: 'No events yet',
    emptyHint: 'Click "Add Event" to start building a character timeline. Each event can link to characters from the Relationship Web and images from the Asset Gallery.',
    eventsCount: '{count} events',
    exportTimeline: 'Export Timeline',
    exporting: 'Exporting…',
    helpButton: 'Help',
    timelineHint: 'A date-sorted visual character timeline with event type color-coding and related character display',
    exportSuccess: 'Timeline exported successfully',
    exportError: 'Export failed. Try a smaller image or lower quality.',
    previewTitle: 'Timeline Preview',
    unnamed: 'Unnamed',
    noImage: 'No image',
    noRelCharacters: 'No characters in Relationship Web',
    eventTypes: EVENT_TYPE_LABELS.en,
  },
  ru: {
    addEvent: 'Добавить событие',
    editEvent: 'Редактировать',
    deleteEvent: 'Удалить',
    eventDate: 'Дата',
    eventTitle: 'Название',
    eventDescription: 'Описание',
    eventType: 'Тип события',
    eventImage: 'Изображение',
    relatedCharacters: 'Связанные персонажи',
    selectImage: 'Выбрать',
    clearImage: 'Убрать',
    cancel: 'Отмена',
    save: 'Сохранить',
    delete: 'Удалить',
    noEvents: 'Пока нет событий',
    emptyHint: 'Нажмите «Добавить событие», чтобы начать строить хронологию персонажа. Каждое событие можно связать с персонажами из Сети отношений и изображениями из галереи активов.',
    eventsCount: '{count} событий',
    exportTimeline: 'Экспорт хронологии',
    exporting: 'Экспорт…',
    helpButton: 'Справка',
    timelineHint: 'Визуальная хронология персонажа, отсортированная по дате, с цветовой кодировкой типов событий и отображением связанных персонажей',
    exportSuccess: 'Хронология экспортирована',
    exportError: 'Ошибка экспорта. Попробуйте уменьшить изображение или понизить качество.',
    previewTitle: 'Предпросмотр',
    unnamed: 'Безымянный',
    noImage: 'Нет изображения',
    noRelCharacters: 'В Сети отношений нет персонажей',
    eventTypes: EVENT_TYPE_LABELS.ru,
  },
  ko: {
    addEvent: '이벤트 추가',
    editEvent: '이벤트 편집',
    deleteEvent: '이벤트 삭제',
    eventDate: '날짜',
    eventTitle: '제목',
    eventDescription: '설명',
    eventType: '이벤트 유형',
    eventImage: '이벤트 이미지',
    relatedCharacters: '관련 캐릭터',
    selectImage: '이미지 선택',
    clearImage: '이미지 삭제',
    cancel: '취소',
    save: '저장',
    delete: '삭제',
    noEvents: '이벤트가 없습니다',
    emptyHint: '「이벤트 추가」를 클릭하여 캐릭터 타임라인을 구축하세요. 각 이벤트는 관계망의 캐릭터 및 에셋 갤러리의 이미지와 연동할 수 있습니다.',
    eventsCount: '총 {count}개 이벤트',
    exportTimeline: '타임라인 낳아오기',
    exporting: '낳아오는 중…',
    helpButton: '도움말',
    timelineHint: '날짜순으로 정렬된 시각적 캐릭터 타임라인. 이벤트 유형 색상 코딩 및 관련 캐릭터 표시 지원',
    exportSuccess: '타임라인을 내보내왔습니다',
    exportError: '낳아오기 실패. 이미지 크기를 줄이거나 품질을 낮춰 보세요.',
    previewTitle: '타임라인 미리보기',
    unnamed: '이름 없음',
    noImage: '이미지 없음',
    noRelCharacters: '관계망에 캐릭터가 없습니다',
    eventTypes: EVENT_TYPE_LABELS.ko,
  },
};

function getCopy(lang: AppLanguage) {
  const base = copyBase.en;
  if (lang === 'zh') return { ...base, ...copyBase.zh };
  if (lang === 'ja') return { ...base, ...copyBase.ja };
  if (lang === 'ru') return { ...base, ...copyBase.ru };
  if (lang === 'ko') return { ...base, ...copyBase.ko };
  return base;
}

function defaultEvent(): ChronicleEvent {
  return {
    id: uid(),
    date: new Date().toISOString().split('T')[0],
    title: '',
    description: '',
    eventType: 'custom',
    relatedCharacterIds: [],
    imageAssetId: null,
    color: EVENT_TYPE_COLORS.custom,
  };
}

export default function CharacterChroniclePage({
  appSubtitle,
  backHome,
  openSettings,
  pageTitle,
  pageDescription,
  language,
  onBack,
  onOpenSettings,
  onOpenDocs,
}: SharedPageProps) {
  const copy = useMemo(() => getCopy(language), [language]);
  const [events, setEvents] = useState<ChronicleEvent[]>(() => loadEvents());
  const [modalEvent, setModalEvent] = useState<ChronicleEvent | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [imagePickerOpen, setImagePickerOpen] = useState(false);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [relNodes, setRelNodes] = useState<RelNode[]>([]);
  const timelineRef = useRef<HTMLDivElement>(null);
  const galleryCache = useRef<Map<string, GalleryImage>>(new Map());
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useBeforeUnloadGuard(events.length > 0);

  useEffect(() => { saveEvents(events); }, [events]);

  useEffect(() => {
    const imgs = loadGalleryImages();
    galleryCache.current = new Map(imgs.map((i) => [i.id, i]));
    setGalleryImages(imgs);
    setRelNodes(loadRelationshipNodes());
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key !== 'Escape') return;
      if (imagePickerOpen) {
        setImagePickerOpen(false);
        playSound('modalClose');
      } else if (modalEvent) {
        setModalEvent(null);
        playSound('modalClose');
      }
    }
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [imagePickerOpen, modalEvent]);

  const sortedEvents = useMemo(() => {
    return [...events].sort((a, b) => a.date.localeCompare(b.date));
  }, [events]);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2200);
  }, []);

  const handleAddEvent = useCallback(() => {
    setModalEvent(defaultEvent());
  }, []);

  const handleEditEvent = useCallback((evt: ChronicleEvent) => {
    setModalEvent({ ...evt });
  }, []);

  const handleDeleteEvent = useCallback((id: string) => {
    if (!window.confirm(copy.deleteEvent + '?')) return;
    setEvents((prev) => prev.filter((e) => e.id !== id));
    playSound('deleteSound');
  }, [copy.deleteEvent]);

  const handleSaveEvent = useCallback(() => {
    if (!modalEvent) return;
    const evt = { ...modalEvent, color: EVENT_TYPE_COLORS[modalEvent.eventType] || EVENT_TYPE_COLORS.custom };
    setEvents((prev) => {
      const existing = prev.find((e) => e.id === evt.id);
      if (existing) return prev.map((e) => (e.id === evt.id ? evt : e));
      return [...prev, evt];
    });
    setModalEvent(null);
    playSound('confirm');
  }, [modalEvent]);

  const handleExport = useCallback(async () => {
    if (!timelineRef.current || sortedEvents.length === 0) return;
    setIsExporting(true);
    try {
      await new Promise((r) => setTimeout(r, 300));
      let dataUrl: string;
      try {
        dataUrl = await toPng(timelineRef.current, {
          pixelRatio: 2,
          cacheBust: true,
          backgroundColor: 'transparent',
        });
      } catch {
        dataUrl = await toPng(timelineRef.current, {
          pixelRatio: 1,
          cacheBust: true,
          backgroundColor: 'transparent',
        });
      }
      const link = document.createElement('a');
      const firstDate = sortedEvents[0]?.date || 'timeline';
      link.download = `${copy.exportTimeline || 'timeline'}-${firstDate}.png`;
      link.href = dataUrl;
      link.click();
      showToast(copy.exportSuccess);
      playSound('confirm');
    } catch {
      playSound('warning');
      showToast(copy.exportError || 'Export failed');
    } finally {
      setIsExporting(false);
    }
  }, [sortedEvents, copy.exportSuccess, copy.exportTimeline, copy.exportError, showToast]);

  const toggleRelCharacter = useCallback((charId: string) => {
    setModalEvent((m) => {
      if (!m) return m;
      const set = new Set(m.relatedCharacterIds);
      if (set.has(charId)) set.delete(charId);
      else set.add(charId);
      return { ...m, relatedCharacterIds: Array.from(set) };
    });
  }, []);

  return (
    <main className="feature-shell tool-page-shell">
      <header className="feature-header fade-up delay-1">
        <div className="feature-header-meta">
          <button className="back-link" type="button" data-sfx-handled onClick={() => { playSound('back'); onBack(); }}>
            ← {backHome}
          </button>
          <span className="version-pill" style={{ minHeight: 40, padding: '0 14px' }}>
            {copy.eventsCount.replace('{count}', String(events.length))}
          </span>
        </div>
        <div className="tool-header-actions">
          <button className="secondary-button small-button" type="button" data-sfx-handled onClick={() => { playSound('modalOpen'); handleAddEvent(); }}>
            {copy.addEvent}
          </button>
          <button className="secondary-button small-button" type="button" data-sfx-handled onClick={() => { playSound('buttonClick'); handleExport(); }} disabled={isExporting || sortedEvents.length === 0}>
            {isExporting ? copy.exporting : copy.exportTimeline}
          </button>
          <button className="secondary-button small-button" type="button" data-sfx-handled onClick={() => { playSound('buttonClick'); onOpenSettings(); }}>
            {openSettings}
          </button>
          {onOpenDocs && (
            <button className="secondary-button small-button" type="button" data-sfx-handled onClick={() => { playSound('buttonClick'); onOpenDocs('character-chronicle'); }}>
              {copy.helpButton}
            </button>
          )}
        </div>
      </header>

      <section className="tool-workbench fade-up delay-2 ch-workbench">
        <div className="tool-header">
          <div>
            <p className="section-label">{appSubtitle}</p>
            <h2>{pageTitle}</h2>
            <p>{pageDescription}</p>
          </div>
        </div>
        {/* Event List (Editor) */}
        <div className="ch-editor">
          {sortedEvents.length === 0 ? (
            <div className="ch-empty">
              <p>{copy.noEvents}</p>
              <p className="tiny-copy">{copy.emptyHint}</p>
              <button className="primary-button" type="button" data-sfx-handled onClick={() => { playSound('modalOpen'); handleAddEvent(); }} style={{ marginTop: 14 }}>
                {copy.addEvent}
              </button>
            </div>
          ) : (
            <div className="ch-event-list">
              {sortedEvents.map((evt, idx) => (
                <div
                  key={evt.id}
                  className="ch-event-item"
                  tabIndex={0}
                  role="button"
                  data-sfx-handled
                  aria-label={`${copy.editEvent}: ${evt.title || copy.unnamed}`}
                  onClick={() => { handleEditEvent(evt); playSound('modalOpen'); }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleEditEvent(evt);
                      playSound('modalOpen');
                    }
                  }}
                  style={{ borderLeftColor: evt.color }}
                >
                  <div className="ch-event-bar" style={{ background: evt.color }} />
                  <div className="ch-event-content">
                    <div className="ch-event-meta">
                      <span className="ch-event-date">{evt.date}</span>
                      <span className="ch-event-type-chip" style={{ background: `${evt.color}22`, color: evt.color, border: `1px solid ${evt.color}44` }}>
                        {copy.eventTypes[evt.eventType] || evt.eventType}
                      </span>
                    </div>
                    <h4 className="ch-event-title">{evt.title || copy.unnamed}</h4>
                    {evt.description && <p className="ch-event-desc">{evt.description}</p>}
                    {evt.relatedCharacterIds.length > 0 && (
                      <div className="ch-event-chars">
                        {evt.relatedCharacterIds.map((cid) => {
                          const node = relNodes.find((n) => n.id === cid);
                          if (!node) return null;
                          return (
                            <span key={cid} className="ch-event-char-dot" style={{ background: node.color }} title={node.name} />
                          );
                        })}
                      </div>
                    )}
                  </div>
                  <button
                    className="ch-event-delete"
                    type="button"
                    data-sfx-handled
                    onClick={(e) => { e.stopPropagation(); handleDeleteEvent(evt.id); }}
                    aria-label={copy.delete}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Timeline Preview */}
        <div className="ch-preview">
          <div className="ch-preview-label">{copy.previewTitle}</div>
          <div className="ch-preview-scroll">
            {sortedEvents.length === 0 ? (
              <div className="ch-preview-empty">
                <p className="tiny-copy">{copy.timelineHint}</p>
              </div>
            ) : (
              <div ref={timelineRef} className="ch-timeline">
                <div className="ch-timeline-line" />
                {sortedEvents.map((evt, idx) => (
                  <TimelineNode
                    key={evt.id}
                    evt={evt}
                    idx={idx}
                    relNodes={relNodes}
                    galleryCache={galleryCache}
                    copy={copy}
                    isLeft={idx % 2 === 0}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Event Modal */}
      {modalEvent && (
        <div className="modal-backdrop opening" role="presentation" onClick={() => setModalEvent(null)}>
          <section className="modal-card modal-surface opening" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 'min(560px, 94vw)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, padding: '18px 22px', borderBottom: '1px solid var(--border)' }}>
              <h3 style={{ margin: 0, fontSize: '1.15rem' }}>{copy.editEvent}</h3>
              <button className="modal-close" type="button" data-sfx-handled onClick={() => { setModalEvent(null); playSound('modalClose'); }} aria-label={copy.cancel}>×</button>
            </div>
            <div style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>{copy.eventDate}</label>
                <input
                  type="date"
                  className="tool-input"
                  value={modalEvent.date}
                  onChange={(e) => setModalEvent((m) => m && { ...m, date: e.target.value })}
                  data-sfx-handled
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>{copy.eventTitle}</label>
                <input
                  type="text"
                  className="tool-input"
                  value={modalEvent.title}
                  onChange={(e) => setModalEvent((m) => m && { ...m, title: e.target.value })}
                  placeholder={copy.eventTitle}
                  data-sfx-handled
                  autoFocus
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>{copy.eventType}</label>
                <div className="ch-type-row">
                  {(Object.keys(EVENT_TYPE_COLORS) as EventType[]).map((t) => (
                    <button
                      key={t}
                      type="button"
                      className={`ch-type-chip ${modalEvent.eventType === t ? 'active' : ''}`}
                      data-sfx-handled
                      onClick={() => { playSound('select'); setModalEvent((m) => m && { ...m, eventType: t, color: EVENT_TYPE_COLORS[t] }); }}
                      aria-pressed={modalEvent.eventType === t}
                    >
                      <span className="ch-type-dot" style={{ background: EVENT_TYPE_COLORS[t] }} />
                      {copy.eventTypes[t] || t}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>{copy.eventDescription}</label>
                <textarea
                  className="tool-input"
                  rows={3}
                  value={modalEvent.description}
                  onChange={(e) => setModalEvent((m) => m && { ...m, description: e.target.value })}
                  data-sfx-handled
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>{copy.relatedCharacters}</label>
                {relNodes.length === 0 ? (
                  <p className="tiny-copy" style={{ color: 'var(--text-secondary)' }}>{copy.noRelCharacters}</p>
                ) : (
                  <div className="ch-rel-row">
                    {relNodes.map((node) => (
                      <button
                        key={node.id}
                        type="button"
                        className={`ch-rel-chip ${modalEvent.relatedCharacterIds.includes(node.id) ? 'active' : ''}`}
                        data-sfx-handled
                        onClick={() => { playSound('select'); toggleRelCharacter(node.id); }}
                        aria-pressed={modalEvent.relatedCharacterIds.includes(node.id)}
                      >
                        <span className="ch-rel-dot" style={{ background: node.color }} />
                        {node.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>{copy.eventImage}</label>
                <div className="cc-image-picker">
                  {modalEvent.imageAssetId ? (
                    <div className="cc-thumb" style={{ backgroundImage: `url(${galleryCache.current.get(modalEvent.imageAssetId)?.dataUrl || ''})` }} />
                  ) : (
                    <div className="cc-thumb empty">{copy.noImage}</div>
                  )}
                  <div className="cc-image-actions">
                    <button className="secondary-button small-button" type="button" data-sfx-handled onClick={() => { setImagePickerOpen(true); playSound('modalOpen'); }}>
                      {copy.selectImage}
                    </button>
                    {modalEvent.imageAssetId && (
                      <button className="secondary-button small-button" type="button" data-sfx-handled onClick={() => { setModalEvent((m) => m && { ...m, imageAssetId: null }); playSound('deleteSound'); }}>
                        {copy.clearImage}
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 6 }}>
                <button className="secondary-button small-button" type="button" data-sfx-handled onClick={() => { setModalEvent(null); playSound('modalClose'); }}>{copy.cancel}</button>
                <button className="primary-button small-button" type="button" data-sfx-handled onClick={handleSaveEvent}>{copy.save}</button>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* Image Picker Modal */}
      {imagePickerOpen && (
        <div className="modal-backdrop opening" role="presentation" onClick={() => setImagePickerOpen(false)}>
          <section className="modal-card modal-surface opening" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 'min(600px, 94vw)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, padding: '18px 22px', borderBottom: '1px solid var(--border)' }}>
              <h3 style={{ margin: 0, fontSize: '1.15rem' }}>{copy.selectImage}</h3>
              <button className="modal-close" type="button" data-sfx-handled onClick={() => { setImagePickerOpen(false); playSound('modalClose'); }} aria-label={copy.cancel}>×</button>
            </div>
            <div style={{ padding: 22, maxHeight: 'min(420px, 60vh)', overflow: 'auto' }}>
              {galleryImages.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                  <p>{copy.noImage}</p>
                </div>
              ) : (
                <div className="cc-image-grid">
                  {galleryImages.map((img) => (
                    <button
                      key={img.id}
                      type="button"
                      className="cc-image-grid-item"
                      data-sfx-handled
                      aria-label={img.name}
                      onClick={() => {
                        setModalEvent((m) => m && { ...m, imageAssetId: img.id });
                        setImagePickerOpen(false);
                        playSound('select');
                      }}
                    >
                      <img src={img.dataUrl} alt="" draggable={false} />
                      <span className="tiny-copy">{img.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      )}

      {toast && (
        <div className="toast-enter" role="alert" aria-live="polite" style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 9999 }}>
          <div className="toast-surface">{toast}</div>
        </div>
      )}
    </main>
  );
}

/* ---------- Timeline Node Component ---------- */
function TimelineNode({
  evt,
  idx,
  relNodes,
  galleryCache,
  copy,
  isLeft,
}: {
  evt: ChronicleEvent;
  idx: number;
  relNodes: RelNode[];
  galleryCache: React.RefObject<Map<string, GalleryImage>>;
  copy: ReturnType<typeof getCopy>;
  isLeft: boolean;
}) {
  const img = galleryCache.current?.get(evt.imageAssetId ?? '');
  const rels = evt.relatedCharacterIds.map((id) => relNodes.find((n) => n.id === id)).filter(Boolean) as RelNode[];

  return (
    <div className={`ch-tnode ${isLeft ? 'left' : 'right'}`}>
      <div className="ch-tnode-connector" style={{ background: evt.color }} />
      <div className="ch-tnode-card" style={{ borderColor: `${evt.color}44` }}>
        <div className="ch-tnode-header">
          <span className="ch-tnode-date">{evt.date}</span>
          <span className="ch-tnode-type" style={{ color: evt.color }}>{copy.eventTypes[evt.eventType] || evt.eventType}</span>
        </div>
        <h4 className="ch-tnode-title">{evt.title || copy.unnamed}</h4>
        {evt.description && <p className="ch-tnode-desc">{evt.description}</p>}
        {img && <img src={img.dataUrl} alt="" className="ch-tnode-img" />}
        {rels.length > 0 && (
          <div className="ch-tnode-rels">
            {rels.map((r) => (
              <span key={r.id} className="ch-tnode-rel" style={{ background: `${r.color}18`, color: r.color, border: `1px solid ${r.color}44` }}>
                <span className="ch-tnode-rel-dot" style={{ background: r.color }} />
                {r.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
