import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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

type EntryCategory = 'location' | 'organization' | 'race' | 'event' | 'item' | 'concept' | 'custom';

interface EncyclopediaEntry {
  id: string;
  title: string;
  category: EntryCategory;
  content: string;
  tags: string[];
  relatedCharacterIds: string[];
  createdAt: string;
}

interface RelNode {
  id: string;
  name: string;
  color: string;
}

const STORAGE_KEY = 'oc-maker.world-encyclopedia';

const CATEGORY_COLORS: Record<EntryCategory, string> = {
  location: '#22c55e',
  organization: '#3b82f6',
  race: '#f59e0b',
  event: '#ef4444',
  item: '#a855f7',
  concept: '#06b6d4',
  custom: '#64748b',
};

const CATEGORY_LABELS: Record<string, Record<EntryCategory, string>> = {
  zh: { location: '地点', organization: '组织', race: '种族', event: '事件', item: '物品', concept: '概念', custom: '自定义' },
  ja: { location: '場所', organization: '組織', race: '種族', event: 'イベント', item: 'アイテム', concept: '概念', custom: 'カスタム' },
  en: { location: 'Location', organization: 'Organization', race: 'Race', event: 'Event', item: 'Item', concept: 'Concept', custom: 'Custom' },
  ru: { location: 'Место', organization: 'Организация', race: 'Раса', event: 'Событие', item: 'Предмет', concept: 'Концепт', custom: 'Другое' },
  ko: { location: '장소', organization: '조직', race: '종족', event: '이벤트', item: '아이템', concept: '개념', custom: '사용자 정의' },
};

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function loadRelationshipNodes(): RelNode[] {
  try {
    const raw = window.localStorage.getItem('oc-maker.relationship-web.nodes');
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch { return []; }
}

function loadEntries(): EncyclopediaEntry[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (e): e is EncyclopediaEntry =>
        e && typeof e === 'object' && typeof e.id === 'string' && typeof e.title === 'string',
    );
  } catch { return []; }
}

function saveEntries(entries: EncyclopediaEntry[]) {
  try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries)); } catch { /* ignore */ }
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
    addEntry: '添加条目',
    editEntry: '编辑条目',
    deleteEntry: '删除条目',
    entryTitle: '标题',
    entryCategory: '分类',
    entryContent: '内容',
    tags: '标签',
    addTag: '添加标签',
    tagPlaceholder: '输入标签',
    relatedCharacters: '关联角色',
    searchPlaceholder: '搜索条目…',
    allCategories: '全部分类',
    listView: '列表',
    gridView: '卡片',
    entriesCount: '共 {count} 个条目',
    noEntries: '还没有条目',
    emptyHint: '点击「添加条目」开始构建你的世界观设定。可以创建地点、组织、种族、事件、物品、概念等多种类型的条目。',
    exportJson: '导出 JSON',
    copied: '已复制',
    cancel: '取消',
    save: '保存',
    delete: '删除',
    unnamed: '未命名',
    helpButton: '帮助',
    categoryLabels: CATEGORY_LABELS.zh,
  },
  ja: {
    addEntry: '項目追加',
    editEntry: '項目編集',
    deleteEntry: '項目削除',
    entryTitle: 'タイトル',
    entryCategory: 'カテゴリ',
    entryContent: '内容',
    tags: 'タグ',
    addTag: 'タグ追加',
    tagPlaceholder: 'タグを入力',
    relatedCharacters: '関連キャラ',
    searchPlaceholder: '項目を検索…',
    allCategories: '全カテゴリ',
    listView: 'リスト',
    gridView: 'カード',
    entriesCount: '計 {count} 項目',
    noEntries: '項目がありません',
    emptyHint: '「項目追加」をクリックして世界観設定を作りましょう。場所、組織、種族、イベント、アイテム、概念などの項目を作成できます。',
    exportJson: 'JSON 出力',
    copied: 'コピーしました',
    cancel: 'キャンセル',
    save: '保存',
    delete: '削除',
    unnamed: '名称未設定',
    helpButton: 'ヘルプ',
    categoryLabels: CATEGORY_LABELS.ja,
  },
  en: {
    addEntry: 'Add Entry',
    editEntry: 'Edit Entry',
    deleteEntry: 'Delete Entry',
    entryTitle: 'Title',
    entryCategory: 'Category',
    entryContent: 'Content',
    tags: 'Tags',
    addTag: 'Add Tag',
    tagPlaceholder: 'Enter tag',
    relatedCharacters: 'Related Characters',
    searchPlaceholder: 'Search entries…',
    allCategories: 'All Categories',
    listView: 'List',
    gridView: 'Grid',
    entriesCount: '{count} entries',
    noEntries: 'No entries yet',
    emptyHint: 'Click "Add Entry" to start building your world encyclopedia. Create locations, organizations, races, events, items, concepts, and more.',
    exportJson: 'Export JSON',
    copied: 'Copied',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    unnamed: 'Unnamed',
    helpButton: 'Help',
    categoryLabels: CATEGORY_LABELS.en,
  },
  ru: {
    addEntry: 'Добавить запись',
    editEntry: 'Редактировать',
    deleteEntry: 'Удалить',
    entryTitle: 'Название',
    entryCategory: 'Категория',
    entryContent: 'Содержание',
    tags: 'Теги',
    addTag: 'Добавить тег',
    tagPlaceholder: 'Введите тег',
    relatedCharacters: 'Связанные персонажи',
    searchPlaceholder: 'Поиск записей…',
    allCategories: 'Все категории',
    listView: 'Список',
    gridView: 'Сетка',
    entriesCount: '{count} записей',
    noEntries: 'Пока нет записей',
    emptyHint: 'Нажмите «Добавить запись», чтобы начать строить энциклопедию мира. Создавайте места, организации, расы, события, предметы, концепты и многое другое.',
    exportJson: 'Экспорт JSON',
    copied: 'Скопировано',
    cancel: 'Отмена',
    save: 'Сохранить',
    delete: 'Удалить',
    unnamed: 'Безымянный',
    helpButton: 'Справка',
    categoryLabels: CATEGORY_LABELS.ru,
  },
  ko: {
    addEntry: '항목 추가',
    editEntry: '항목 편집',
    deleteEntry: '항목 삭제',
    entryTitle: '제목',
    entryCategory: '카테고리',
    entryContent: '내용',
    tags: '태그',
    addTag: '태그 추가',
    tagPlaceholder: '태그 입력',
    relatedCharacters: '관련 캐릭터',
    searchPlaceholder: '항목 검색…',
    allCategories: '전체 카테고리',
    listView: '목록',
    gridView: '카드',
    entriesCount: '총 {count}개 항목',
    noEntries: '항목이 없습니다',
    emptyHint: '「항목 추가」를 클릭하여 세계관 설정을 구축하세요. 장소, 조직, 종족, 이벤트, 아이템, 개념 등의 항목을 생성할 수 있습니다.',
    exportJson: 'JSON 낳아오기',
    copied: '복사 완료',
    cancel: '취소',
    save: '저장',
    delete: '삭제',
    unnamed: '이름 없음',
    helpButton: '도움말',
    categoryLabels: CATEGORY_LABELS.ko,
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

function defaultEntry(): EncyclopediaEntry {
  return {
    id: uid(),
    title: '',
    category: 'custom',
    content: '',
    tags: [],
    relatedCharacterIds: [],
    createdAt: new Date().toISOString(),
  };
}

export default function WorldEncyclopediaPage({
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
  const [entries, setEntries] = useState<EncyclopediaEntry[]>(() => loadEntries());
  const [modalEntry, setModalEntry] = useState<EncyclopediaEntry | null>(null);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<EntryCategory | 'all'>('all');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
  const [relNodes, setRelNodes] = useState<RelNode[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useBeforeUnloadGuard(entries.length > 0);

  useEffect(() => { saveEntries(entries); }, [entries]);

  useEffect(() => {
    setRelNodes(loadRelationshipNodes());
  }, []);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2200);
  }, []);

  const filteredEntries = useMemo(() => {
    let result = [...entries];
    if (filterCategory !== 'all') {
      result = result.filter((e) => e.category === filterCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.content.toLowerCase().includes(q) ||
          e.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }
    return result;
  }, [entries, filterCategory, search]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: entries.length };
    for (const e of entries) {
      counts[e.category] = (counts[e.category] || 0) + 1;
    }
    return counts;
  }, [entries]);

  const handleAdd = useCallback(() => {
    setModalEntry(defaultEntry());
    playSound('modalOpen');
  }, []);

  const handleEdit = useCallback((entry: EncyclopediaEntry) => {
    setModalEntry({ ...entry });
    playSound('modalOpen');
  }, []);

  const handleDelete = useCallback((id: string) => {
    if (!window.confirm(copy.deleteEntry + '?')) return;
    setEntries((prev) => prev.filter((e) => e.id !== id));
    playSound('deleteSound');
  }, [copy.deleteEntry]);

  const handleSave = useCallback(() => {
    if (!modalEntry) return;
    const entry = { ...modalEntry };
    setEntries((prev) => {
      const existing = prev.find((e) => e.id === entry.id);
      if (existing) return prev.map((e) => (e.id === entry.id ? entry : e));
      return [...prev, entry];
    });
    setModalEntry(null);
    playSound('confirm');
  }, [modalEntry]);

  const handleExport = useCallback(() => {
    const data = JSON.stringify(entries, null, 2);
    navigator.clipboard.writeText(data).then(() => {
      showToast(copy.copied);
      playSound('confirm');
    }).catch(() => playSound('warning'));
  }, [entries, copy.copied, showToast]);

  const addTag = useCallback(() => {
    const text = window.prompt(copy.tagPlaceholder);
    if (!text || !text.trim()) return;
    setModalEntry((m) => m && { ...m, tags: [...m.tags, text.trim()] });
    playSound('confirm');
  }, [copy.tagPlaceholder]);

  const removeTag = useCallback((tag: string) => {
    setModalEntry((m) => m && { ...m, tags: m.tags.filter((t) => t !== tag) });
    playSound('deleteSound');
  }, []);

  const toggleRelCharacter = useCallback((charId: string) => {
    setModalEntry((m) => {
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
            {copy.entriesCount.replace('{count}', String(entries.length))}
          </span>
        </div>
        <div className="tool-header-actions">
          <button className="secondary-button small-button" type="button" data-sfx-handled onClick={() => { playSound('buttonClick'); handleAdd(); }}>
            {copy.addEntry}
          </button>
          <button className="secondary-button small-button" type="button" data-sfx-handled onClick={() => { playSound('buttonClick'); handleExport(); }} disabled={entries.length === 0}>
            {copy.exportJson}
          </button>
          <button className="secondary-button small-button" type="button" data-sfx-handled onClick={() => { playSound('buttonClick'); onOpenSettings(); }}>
            {openSettings}
          </button>
          {onOpenDocs && (
            <button className="secondary-button small-button" type="button" data-sfx-handled onClick={() => { playSound('buttonClick'); onOpenDocs('world-encyclopedia'); }}>
              {copy.helpButton}
            </button>
          )}
        </div>
      </header>

      <section className="tool-workbench fade-up delay-2 we-workbench">
        {/* Toolbar */}
        <div className="we-toolbar">
          <input
            type="text"
            className="tool-input we-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={copy.searchPlaceholder}
            data-sfx-handled
          />
          <div className="we-filter-row">
            <button
              type="button"
              className={`we-filter-chip ${filterCategory === 'all' ? 'active' : ''}`}
              data-sfx-handled
              onClick={() => { playSound('select'); setFilterCategory('all'); }}
            >
              {copy.allCategories} ({categoryCounts.all || 0})
            </button>
            {(Object.keys(CATEGORY_COLORS) as EntryCategory[]).map((c) => (
              <button
                key={c}
                type="button"
                className={`we-filter-chip ${filterCategory === c ? 'active' : ''}`}
                data-sfx-handled
                onClick={() => { playSound('select'); setFilterCategory(c); }}
              >
                <span className="we-filter-dot" style={{ background: CATEGORY_COLORS[c] }} />
                {copy.categoryLabels[c]} ({categoryCounts[c] || 0})
              </button>
            ))}
          </div>
          <div className="we-view-toggle">
            <button
              type="button"
              className={`we-view-btn ${viewMode === 'list' ? 'active' : ''}`}
              data-sfx-handled
              onClick={() => { playSound('select'); setViewMode('list'); }}
            >
              {copy.listView}
            </button>
            <button
              type="button"
              className={`we-view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              data-sfx-handled
              onClick={() => { playSound('select'); setViewMode('grid'); }}
            >
              {copy.gridView}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="we-content">
          {filteredEntries.length === 0 ? (
            <div className="we-empty">
              <p>{entries.length === 0 ? copy.noEntries : 'No matching entries'}</p>
              {entries.length === 0 && <p className="tiny-copy">{copy.emptyHint}</p>}
              {entries.length === 0 && (
                <button className="primary-button" type="button" data-sfx-handled onClick={() => { playSound('buttonClick'); handleAdd(); }} style={{ marginTop: 14 }}>
                  {copy.addEntry}
                </button>
              )}
            </div>
          ) : viewMode === 'grid' ? (
            <div className="we-grid">
              {filteredEntries.map((entry) => (
                <EntryCard
                  key={entry.id}
                  entry={entry}
                  relNodes={relNodes}
                  copy={copy}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ) : (
            <div className="we-list">
              {filteredEntries.map((entry) => (
                <EntryListItem
                  key={entry.id}
                  entry={entry}
                  relNodes={relNodes}
                  copy={copy}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Entry Modal */}
      {modalEntry && (
        <div className="modal-backdrop opening" role="presentation" onClick={() => setModalEntry(null)}>
          <section className="modal-card modal-surface opening" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 'min(560px, 94vw)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, padding: '18px 22px', borderBottom: '1px solid var(--border)' }}>
              <h3 style={{ margin: 0, fontSize: '1.15rem' }}>{copy.editEntry}</h3>
              <button className="modal-close" type="button" data-sfx-handled onClick={() => { setModalEntry(null); playSound('modalClose'); }} aria-label={copy.cancel}>×</button>
            </div>
            <div style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>{copy.entryTitle}</label>
                <input
                  type="text"
                  className="tool-input"
                  value={modalEntry.title}
                  onChange={(e) => setModalEntry((m) => m && { ...m, title: e.target.value })}
                  placeholder={copy.entryTitle}
                  data-sfx-handled
                  autoFocus
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>{copy.entryCategory}</label>
                <div className="we-type-row">
                  {(Object.keys(CATEGORY_COLORS) as EntryCategory[]).map((c) => (
                    <button
                      key={c}
                      type="button"
                      className={`we-type-chip ${modalEntry.category === c ? 'active' : ''}`}
                      data-sfx-handled
                      onClick={() => { playSound('select'); setModalEntry((m) => m && { ...m, category: c }); }}
                      aria-pressed={modalEntry.category === c}
                    >
                      <span className="we-type-dot" style={{ background: CATEGORY_COLORS[c] }} />
                      {copy.categoryLabels[c]}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>{copy.entryContent}</label>
                <textarea
                  className="tool-input"
                  rows={5}
                  value={modalEntry.content}
                  onChange={(e) => setModalEntry((m) => m && { ...m, content: e.target.value })}
                  data-sfx-handled
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>{copy.tags}</label>
                <div className="we-tag-row">
                  {modalEntry.tags.map((t) => (
                    <span key={t} className="we-tag" style={{ background: 'rgba(var(--accent-rgb),0.08)', color: 'var(--text-main)', border: '1px solid var(--border)' }}>
                      {t}
                      <button type="button" data-sfx-handled className="we-tag-remove" onClick={() => removeTag(t)} aria-label={copy.delete}>×</button>
                    </span>
                  ))}
                  <button className="secondary-button small-button" type="button" data-sfx-handled onClick={addTag}>{copy.addTag}</button>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>{copy.relatedCharacters}</label>
                {relNodes.length === 0 ? (
                  <p className="tiny-copy" style={{ color: 'var(--text-secondary)' }}>No characters in Relationship Web</p>
                ) : (
                  <div className="we-rel-row">
                    {relNodes.map((node) => (
                      <button
                        key={node.id}
                        type="button"
                        className={`we-rel-chip ${modalEntry.relatedCharacterIds.includes(node.id) ? 'active' : ''}`}
                        data-sfx-handled
                        onClick={() => { playSound('select'); toggleRelCharacter(node.id); }}
                        aria-pressed={modalEntry.relatedCharacterIds.includes(node.id)}
                      >
                        <span className="we-rel-dot" style={{ background: node.color }} />
                        {node.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 6 }}>
                <button className="secondary-button small-button" type="button" data-sfx-handled onClick={() => { setModalEntry(null); playSound('modalClose'); }}>{copy.cancel}</button>
                <button className="primary-button small-button" type="button" data-sfx-handled onClick={handleSave}>{copy.save}</button>
              </div>
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

/* ---------- Entry Card (Grid) ---------- */
function EntryCard({
  entry,
  relNodes,
  copy,
  onEdit,
  onDelete,
}: {
  entry: EncyclopediaEntry;
  relNodes: RelNode[];
  copy: ReturnType<typeof getCopy>;
  onEdit: (e: EncyclopediaEntry) => void;
  onDelete: (id: string) => void;
}) {
  const color = CATEGORY_COLORS[entry.category];
  const rels = entry.relatedCharacterIds.map((id) => relNodes.find((n) => n.id === id)).filter(Boolean) as RelNode[];

  return (
    <div
      className="we-card"
      data-sfx-handled
      onClick={() => { onEdit(entry); playSound('select'); }}
    >
      <div className="we-card-bar" style={{ background: color }} />
      <div className="we-card-body">
        <div className="we-card-meta">
          <span className="we-card-category" style={{ color }}>{copy.categoryLabels[entry.category]}</span>
          <button
            className="we-card-delete"
            type="button"
            data-sfx-handled
            onClick={(e) => { e.stopPropagation(); onDelete(entry.id); }}
            aria-label={copy.delete}
          >
            ×
          </button>
        </div>
        <h4 className="we-card-title">{entry.title || copy.unnamed}</h4>
        {entry.content && <p className="we-card-content">{entry.content}</p>}
        {entry.tags.length > 0 && (
          <div className="we-card-tags">
            {entry.tags.map((t) => (
              <span key={t} className="we-card-tag">{t}</span>
            ))}
          </div>
        )}
        {rels.length > 0 && (
          <div className="we-card-chars">
            {rels.map((r) => (
              <span key={r.id} className="we-card-char-dot" style={{ background: r.color }} title={r.name} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- Entry List Item ---------- */
function EntryListItem({
  entry,
  relNodes,
  copy,
  onEdit,
  onDelete,
}: {
  entry: EncyclopediaEntry;
  relNodes: RelNode[];
  copy: ReturnType<typeof getCopy>;
  onEdit: (e: EncyclopediaEntry) => void;
  onDelete: (id: string) => void;
}) {
  const color = CATEGORY_COLORS[entry.category];
  const rels = entry.relatedCharacterIds.map((id) => relNodes.find((n) => n.id === id)).filter(Boolean) as RelNode[];

  return (
    <div
      className="we-list-item"
      data-sfx-handled
      onClick={() => { onEdit(entry); playSound('select'); }}
    >
      <div className="we-list-bar" style={{ background: color }} />
      <div className="we-list-body">
        <div className="we-list-header">
          <span className="we-list-category" style={{ color }}>{copy.categoryLabels[entry.category]}</span>
          <h4 className="we-list-title">{entry.title || copy.unnamed}</h4>
        </div>
        {entry.content && <p className="we-list-content">{entry.content}</p>}
        <div className="we-list-footer">
          {entry.tags.length > 0 && (
            <div className="we-list-tags">
              {entry.tags.map((t) => (
                <span key={t} className="we-list-tag">{t}</span>
              ))}
            </div>
          )}
          {rels.length > 0 && (
            <div className="we-list-chars">
              {rels.map((r) => (
                <span key={r.id} className="we-list-char-dot" style={{ background: r.color }} title={r.name} />
              ))}
            </div>
          )}
        </div>
      </div>
      <button
        className="we-list-delete"
        type="button"
        data-sfx-handled
        onClick={(e) => { e.stopPropagation(); onDelete(entry.id); }}
        aria-label={copy.delete}
      >
        ×
      </button>
    </div>
  );
}
