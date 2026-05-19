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

interface CardField {
  id: string;
  label: string;
  value: string;
}

interface CardTag {
  id: string;
  text: string;
  color: string;
}

type CardTemplate = 'minimal' | 'detailed' | 'gallery';
type BgStyle = 'solid' | 'gradient' | 'dots';

interface CardData {
  name: string;
  alias: string;
  avatarAssetId: string | null;
  mainImageAssetId: string | null;
  themeColor: string;
  fields: CardField[];
  tags: CardTag[];
  bio: string;
  importRelations: boolean;
  template: CardTemplate;
  bgStyle: BgStyle;
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

interface RelEdge {
  id: string;
  sourceId: string;
  targetId: string;
  type: string;
}

const STORAGE_KEY = 'oc-maker.character-card';
const PRESET_COLORS = [
  '#ef4444', '#f97316', '#f59e0b', '#84cc16', '#22c55e',
  '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6',
  '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899',
  '#f43f5e', '#78716c', '#475569', '#334155',
];

const TAG_COLORS = [
  '#ef4444', '#f97316', '#f59e0b', '#22c55e',
  '#0ea5e9', '#6366f1', '#a855f7', '#ec4899',
];

const EDGE_TYPE_LABELS: Record<string, Record<string, string>> = {
  zh: { friend: '朋友', enemy: '敌人', family: '家人', lover: '恋人', mentor: '师徒', rival: '对手', ally: '盟友', custom: '自定义' },
  ja: { friend: '友達', enemy: '敵', family: '家族', lover: '恋人', mentor: '師弟', rival: 'ライバル', ally: '同盟', custom: 'カスタム' },
  en: { friend: 'Friend', enemy: 'Enemy', family: 'Family', lover: 'Lover', mentor: 'Mentor', rival: 'Rival', ally: 'Ally', custom: 'Custom' },
  ru: { friend: 'Друг', enemy: 'Враг', family: 'Семья', lover: 'Возлюбленный', mentor: 'Наставник', rival: 'Соперник', ally: 'Союзник', custom: 'Другое' },
  ko: { friend: '친구', enemy: '적', family: '가족', lover: '연인', mentor: '스승', rival: '라이벌', ally: '동맹', custom: '사용자 정의' },
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

function loadRelationshipData(): { nodes: RelNode[]; edges: RelEdge[] } {
  try {
    const nodesRaw = window.localStorage.getItem('oc-maker.relationship-web.nodes');
    const edgesRaw = window.localStorage.getItem('oc-maker.relationship-web.edges');
    const nodes = nodesRaw ? JSON.parse(nodesRaw) : [];
    const edges = edgesRaw ? JSON.parse(edgesRaw) : [];
    return { nodes: Array.isArray(nodes) ? nodes : [], edges: Array.isArray(edges) ? edges : [] };
  } catch { return { nodes: [], edges: [] }; }
}

function loadCard(): CardData {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultCard();
    const parsed = JSON.parse(raw) as Partial<CardData>;
    const base = defaultCard();
    return {
      name: typeof parsed.name === 'string' ? parsed.name : base.name,
      alias: typeof parsed.alias === 'string' ? parsed.alias : base.alias,
      avatarAssetId: parsed.avatarAssetId ?? base.avatarAssetId,
      mainImageAssetId: parsed.mainImageAssetId ?? base.mainImageAssetId,
      themeColor: typeof parsed.themeColor === 'string' ? parsed.themeColor : base.themeColor,
      fields: Array.isArray(parsed.fields) ? parsed.fields : base.fields,
      tags: Array.isArray(parsed.tags) ? parsed.tags : base.tags,
      bio: typeof parsed.bio === 'string' ? parsed.bio : base.bio,
      importRelations: typeof parsed.importRelations === 'boolean' ? parsed.importRelations : base.importRelations,
      template: (parsed.template as CardTemplate) || base.template,
      bgStyle: (parsed.bgStyle as BgStyle) || base.bgStyle,
    };
  } catch { return defaultCard(); }
}

function saveCard(data: CardData) {
  try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch { /* ignore */ }
}

function defaultCard(): CardData {
  return {
    name: '',
    alias: '',
    avatarAssetId: null,
    mainImageAssetId: null,
    themeColor: PRESET_COLORS[9],
    fields: [
      { id: uid(), label: 'Age', value: '' },
      { id: uid(), label: 'Height', value: '' },
      { id: uid(), label: 'Birthday', value: '' },
      { id: uid(), label: 'Personality', value: '' },
    ],
    tags: [],
    bio: '',
    importRelations: false,
    template: 'detailed',
    bgStyle: 'gradient',
  };
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
    cardName: '角色名称', cardAlias: '别名', themeColor: '主题色', avatar: '头像',
    mainImage: '主视觉图', selectImage: '选择图片', clearImage: '清除',
    bio: '角色简介', tags: '标签', addTag: '添加标签', tagPlaceholder: '输入标签',
    fields: '设定字段', addField: '添加字段', fieldLabel: '字段名', fieldValue: '内容',
    importRelations: '从关系网导入关联角色', template: '模板',
    templateMinimal: '简约卡', templateDetailed: '详细卡', templateGallery: '画廊卡',
    bgStyle: '背景', bgSolid: '纯色', bgGradient: '渐变', bgDots: '点阵',
    previewTitle: '实时预览', exportCard: '导出卡片', exporting: '导出中…',
    emptyNameHint: '输入角色名称以开始', noImage: '无图片', dragHint: '拖拽调整位置',
    cancel: '取消', save: '保存', delete: '删除', duplicate: '复制',
    helpButton: '帮助', cardHint: '选择模板并填写信息，右侧实时预览并导出 PNG 图片',
    exportSuccess: '卡片导出成功',
    exportError: '导出失败，请尝试缩小图片或降低质量',
  },
  ja: {
    cardName: 'キャラ名', cardAlias: '別名', themeColor: 'テーマカラー', avatar: 'アイコン',
    mainImage: 'メインビジュアル', selectImage: '画像を選択', clearImage: '削除',
    bio: 'キャラ紹介', tags: 'タグ', addTag: 'タグ追加', tagPlaceholder: 'タグを入力',
    fields: '設定項目', addField: '項目追加', fieldLabel: '項目名', fieldValue: '内容',
    importRelations: '関係図から関連キャラをインポート', template: 'テンプレート',
    templateMinimal: 'シンプル', templateDetailed: '詳細', templateGallery: 'ギャラリー',
    bgStyle: '背景', bgSolid: '単色', bgGradient: 'グラデ', bgDots: 'ドット',
    previewTitle: 'リアルタイムプレビュー', exportCard: 'カード出力', exporting: '出力中…',
    emptyNameHint: 'キャラ名を入力して開始', noImage: '画像なし', dragHint: '位置を調整',
    cancel: 'キャンセル', save: '保存', delete: '削除', duplicate: '複製',
    helpButton: 'ヘルプ', cardHint: 'テンプレートを選んで情報を入力し、プレビュー確認後 PNG を出力',
    exportSuccess: 'カードを出力しました',
    exportError: '出力に失敗しました。画像を小さくするか品質を下げてお試しください',
  },
  en: {
    cardName: 'Character Name', cardAlias: 'Alias', themeColor: 'Theme Color', avatar: 'Avatar',
    mainImage: 'Main Visual', selectImage: 'Select Image', clearImage: 'Clear',
    bio: 'Character Bio', tags: 'Tags', addTag: 'Add Tag', tagPlaceholder: 'Enter tag',
    fields: 'Profile Fields', addField: 'Add Field', fieldLabel: 'Label', fieldValue: 'Value',
    importRelations: 'Import related characters from Relationship Web', template: 'Template',
    templateMinimal: 'Minimal', templateDetailed: 'Detailed', templateGallery: 'Gallery',
    bgStyle: 'Background', bgSolid: 'Solid', bgGradient: 'Gradient', bgDots: 'Dots',
    previewTitle: 'Live Preview', exportCard: 'Export Card', exporting: 'Exporting…',
    emptyNameHint: 'Enter a character name to start', noImage: 'No image', dragHint: 'Drag to adjust',
    cancel: 'Cancel', save: 'Save', delete: 'Delete', duplicate: 'Duplicate',
    helpButton: 'Help', cardHint: 'Choose a template, fill in the info, preview live, then export PNG',
    exportSuccess: 'Card exported successfully',
    exportError: 'Export failed. Try a smaller image or lower quality.',
  },
  ru: {
    cardName: 'Имя персонажа', cardAlias: 'Псевдоним', themeColor: 'Цвет темы', avatar: 'Аватар',
    mainImage: 'Главное изображение', selectImage: 'Выбрать', clearImage: 'Убрать',
    bio: 'Описание', tags: 'Теги', addTag: 'Добавить тег', tagPlaceholder: 'Введите тег',
    fields: 'Поля профиля', addField: 'Добавить поле', fieldLabel: 'Название', fieldValue: 'Значение',
    importRelations: 'Импорт связанных персонажей из Сети отношений', template: 'Шаблон',
    templateMinimal: 'Минимальный', templateDetailed: 'Подробный', templateGallery: 'Галерея',
    bgStyle: 'Фон', bgSolid: 'Сплошной', bgGradient: 'Градиент', bgDots: 'Точки',
    previewTitle: 'Предпросмотр', exportCard: 'Экспорт', exporting: 'Экспорт…',
    emptyNameHint: 'Введите имя персонажа', noImage: 'Нет изображения', dragHint: 'Перетащите',
    cancel: 'Отмена', save: 'Сохранить', delete: 'Удалить', duplicate: 'Дублировать',
    helpButton: 'Справка', cardHint: 'Выберите шаблон, заполните данные, посмотрите превью и экспортируйте PNG',
    exportSuccess: 'Карточка экспортирована',
    exportError: 'Ошибка экспорта. Попробуйте уменьшить изображение или понизить качество.',
  },
  ko: {
    cardName: '캐릭터 이름', cardAlias: '별명', themeColor: '테마 색상', avatar: '아바타',
    mainImage: '메인 비주얼', selectImage: '이미지 선택', clearImage: '삭제',
    bio: '캐릭터 소개', tags: '태그', addTag: '태그 추가', tagPlaceholder: '태그 입력',
    fields: '설정 항목', addField: '항목 추가', fieldLabel: '항목명', fieldValue: '내용',
    importRelations: '관계망에서 관련 캐릭터 가져오기', template: '템플릿',
    templateMinimal: '심플', templateDetailed: '상세', templateGallery: '갤러리',
    bgStyle: '배경', bgSolid: '단색', bgGradient: '그라데이션', bgDots: '도트',
    previewTitle: '실시간 미리보기', exportCard: '카드 내보내기', exporting: '내보내는 중…',
    emptyNameHint: '캐릭터 이름을 입력하세요', noImage: '이미지 없음', dragHint: '위치 조정',
    cancel: '취소', save: '저장', delete: '삭제', duplicate: '복제',
    helpButton: '도움말', cardHint: '템플릿을 선택하고 정보를 입력한 뒤 PNG로 내보내세요',
    exportSuccess: '카드를 내보내왔습니다',
    exportError: '내보내기 실패. 이미지 크기를 줄이거나 품질을 낮춰 보세요.',
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

export default function CharacterCardPage({
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
  const [card, setCard] = useState<CardData>(loadCard);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [pickerMode, setPickerMode] = useState<'avatar' | 'main' | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const galleryCache = useRef<Map<string, GalleryImage>>(new Map());
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useBeforeUnloadGuard(card.name.length > 0);

  useEffect(() => { saveCard(card); }, [card]);

  useEffect(() => {
    const imgs = loadGalleryImages();
    galleryCache.current = new Map(imgs.map((i) => [i.id, i]));
    setGalleryImages(imgs);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key !== 'Escape') return;
      if (pickerMode) {
        setPickerMode(null);
        playSound('modalClose');
      }
    }
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [pickerMode]);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2200);
  }, []);

  const handleExport = useCallback(async () => {
    if (!cardRef.current || !card.name.trim()) return;
    setIsExporting(true);
    try {
      await new Promise((r) => setTimeout(r, 300));
      let dataUrl: string;
      try {
        dataUrl = await toPng(cardRef.current, {
          pixelRatio: 2,
          cacheBust: true,
          backgroundColor: 'transparent',
        });
      } catch {
        dataUrl = await toPng(cardRef.current, {
          pixelRatio: 1,
          cacheBust: true,
          backgroundColor: 'transparent',
        });
      }
      const link = document.createElement('a');
      link.download = `${card.name || 'character'}-card.png`;
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
  }, [card.name, copy.exportSuccess, copy.exportError, showToast]);

  const addField = useCallback(() => {
    setCard((c) => ({
      ...c,
      fields: [...c.fields, { id: uid(), label: '', value: '' }],
    }));
    playSound('buttonClick');
  }, []);

  const removeField = useCallback((id: string) => {
    setCard((c) => ({ ...c, fields: c.fields.filter((f) => f.id !== id) }));
    playSound('deleteSound');
  }, []);

  const updateField = useCallback((id: string, patch: Partial<CardField>) => {
    setCard((c) => ({
      ...c,
      fields: c.fields.map((f) => (f.id === id ? { ...f, ...patch } : f)),
    }));
  }, []);

  const addTag = useCallback(() => {
    const text = window.prompt(copy.tagPlaceholder);
    if (!text || !text.trim()) return;
    const color = TAG_COLORS[Math.floor(Math.random() * TAG_COLORS.length)];
    setCard((c) => ({
      ...c,
      tags: [...c.tags, { id: uid(), text: text.trim(), color }],
    }));
    playSound('confirm');
  }, [copy.tagPlaceholder]);

  const removeTag = useCallback((id: string) => {
    setCard((c) => ({ ...c, tags: c.tags.filter((t) => t.id !== id) }));
    playSound('deleteSound');
  }, []);

  const importedRelations = useMemo(() => {
    if (!card.importRelations || !card.name) return [];
    const { nodes, edges } = loadRelationshipData();
    const nodeMap = new Map(nodes.map((n) => [n.id, n]));
    const myNode = nodes.find((n) => n.name === card.name);
    if (!myNode) return [];
    return edges
      .filter((e) => e.sourceId === myNode.id || e.targetId === myNode.id)
      .map((e) => {
        const otherId = e.sourceId === myNode.id ? e.targetId : e.sourceId;
        const other = nodeMap.get(otherId);
        const typeKey = e.type || 'custom';
        const labels = EDGE_TYPE_LABELS[language] || EDGE_TYPE_LABELS.en;
        return {
          name: other?.name || '?',
          typeLabel: labels[typeKey] || labels.custom || typeKey,
          color: other?.color || '#94a3b8',
        };
      })
      .slice(0, 8);
  }, [card.importRelations, card.name, language]);

  const avatarImg = useMemo(
    () => galleryCache.current.get(card.avatarAssetId ?? '') || galleryImages.find((g) => g.id === card.avatarAssetId),
    [card.avatarAssetId, galleryImages],
  );

  const mainImg = useMemo(
    () => galleryCache.current.get(card.mainImageAssetId ?? '') || galleryImages.find((g) => g.id === card.mainImageAssetId),
    [card.mainImageAssetId, galleryImages],
  );

  const cardBgStyle = useMemo(() => {
    switch (card.bgStyle) {
      case 'gradient':
        return {
          background: `linear-gradient(135deg, ${card.themeColor}18 0%, ${card.themeColor}08 50%, var(--bg-soft) 100%)`,
        };
      case 'dots':
        return {
          background: `radial-gradient(circle at 1px 1px, ${card.themeColor}22 1px, transparent 0), var(--bg-soft)`,
          backgroundSize: '20px 20px, auto',
        };
      default:
        return { background: 'var(--bg-soft)' };
    }
  }, [card.bgStyle, card.themeColor]);

  return (
    <main className="feature-shell tool-page-shell">
      <header className="feature-header fade-up delay-1">
        <div className="feature-header-meta">
          <button className="back-link" type="button" data-sfx-handled onClick={() => { playSound('back'); onBack(); }}>
            ← {backHome}
          </button>
        </div>
        <div className="tool-header-actions">
          <button className="secondary-button small-button" type="button" data-sfx-handled onClick={() => { playSound('buttonClick'); handleExport(); }} disabled={isExporting || !card.name.trim()}>
            {isExporting ? copy.exporting : copy.exportCard}
          </button>
          <button className="secondary-button small-button" type="button" data-sfx-handled onClick={() => { playSound('buttonClick'); onOpenSettings(); }}>
            {openSettings}
          </button>
          {onOpenDocs && (
            <button className="secondary-button small-button" type="button" data-sfx-handled onClick={() => { playSound('buttonClick'); onOpenDocs('character-card'); }}>
              {copy.helpButton}
            </button>
          )}
        </div>
      </header>

      <section className="tool-workbench fade-up delay-2 cc-workbench">
        <div className="tool-header">
          <div>
            <h2>{pageTitle}</h2>
            <p>{pageDescription}</p>
          </div>
        </div>
        <div className="cc-editor">
          <div className="cc-section">
            <h4>{copy.cardName}</h4>
            <input
              type="text"
              className="tool-input"
              value={card.name}
              onChange={(e) => setCard((c) => ({ ...c, name: e.target.value }))}
              placeholder={copy.emptyNameHint}
              data-sfx-handled
            />
          </div>

          <div className="cc-section">
            <h4>{copy.cardAlias}</h4>
            <input
              type="text"
              className="tool-input"
              value={card.alias}
              onChange={(e) => setCard((c) => ({ ...c, alias: e.target.value }))}
              data-sfx-handled
            />
          </div>

          <div className="cc-section">
            <h4>{copy.themeColor}</h4>
            <div className="cc-color-row">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`cc-color-swatch ${card.themeColor === c ? 'active' : ''}`}
                  style={{ background: c }}
                  data-sfx-handled
                  onClick={() => { playSound('select'); setCard((prev) => ({ ...prev, themeColor: c })); }}
                  aria-pressed={card.themeColor === c}
                  aria-label={`${copy.themeColor} ${c}`}
                />
              ))}
            </div>
          </div>

          <div className="cc-section">
            <h4>{copy.avatar}</h4>
            <div className="cc-image-picker">
              {avatarImg ? (
                <div className="cc-thumb" style={{ backgroundImage: `url(${avatarImg.dataUrl})` }} />
              ) : (
                <div className="cc-thumb empty">{copy.noImage}</div>
              )}
              <div className="cc-image-actions">
                <button className="secondary-button small-button" type="button" data-sfx-handled onClick={() => { setPickerMode('avatar'); playSound('modalOpen'); }}>
                  {copy.selectImage}
                </button>
                {card.avatarAssetId && (
                  <button className="secondary-button small-button" type="button" data-sfx-handled onClick={() => { setCard((c) => ({ ...c, avatarAssetId: null })); playSound('deleteSound'); }}>
                    {copy.clearImage}
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="cc-section">
            <h4>{copy.mainImage}</h4>
            <div className="cc-image-picker">
              {mainImg ? (
                <div className="cc-thumb" style={{ backgroundImage: `url(${mainImg.dataUrl})` }} />
              ) : (
                <div className="cc-thumb empty">{copy.noImage}</div>
              )}
              <div className="cc-image-actions">
                <button className="secondary-button small-button" type="button" data-sfx-handled onClick={() => { setPickerMode('main'); playSound('modalOpen'); }}>
                  {copy.selectImage}
                </button>
                {card.mainImageAssetId && (
                  <button className="secondary-button small-button" type="button" data-sfx-handled onClick={() => { setCard((c) => ({ ...c, mainImageAssetId: null })); playSound('deleteSound'); }}>
                    {copy.clearImage}
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="cc-section">
            <h4>{copy.tags}</h4>
            <div className="cc-tag-row">
              {card.tags.map((t) => (
                <span key={t.id} className="cc-tag" style={{ background: `${t.color}22`, color: t.color, border: `1px solid ${t.color}44` }}>
                  {t.text}
                  <button type="button" data-sfx-handled className="cc-tag-remove" onClick={() => removeTag(t.id)} aria-label={copy.delete}>×</button>
                </span>
              ))}
              <button className="secondary-button small-button" type="button" data-sfx-handled onClick={addTag}>{copy.addTag}</button>
            </div>
          </div>

          <div className="cc-section">
            <h4>{copy.bio}</h4>
            <textarea
              className="tool-input"
              rows={4}
              value={card.bio}
              onChange={(e) => setCard((c) => ({ ...c, bio: e.target.value }))}
              data-sfx-handled
            />
          </div>

          <div className="cc-section">
            <h4>{copy.fields}</h4>
            <div className="cc-field-list">
              {card.fields.map((f) => (
                <div key={f.id} className="cc-field-row">
                  <input
                    type="text"
                    className="tool-input cc-field-label"
                    value={f.label}
                    placeholder={copy.fieldLabel}
                    onChange={(e) => updateField(f.id, { label: e.target.value })}
                    data-sfx-handled
                  />
                  <input
                    type="text"
                    className="tool-input cc-field-value"
                    value={f.value}
                    placeholder={copy.fieldValue}
                    onChange={(e) => updateField(f.id, { value: e.target.value })}
                    data-sfx-handled
                  />
                  <button className="secondary-button small-button" type="button" data-sfx-handled onClick={() => removeField(f.id)} aria-label={copy.delete}>
                    {copy.delete}
                  </button>
                </div>
              ))}
            </div>
            <button className="secondary-button small-button" type="button" data-sfx-handled onClick={addField} style={{ marginTop: 8 }}>
              {copy.addField}
            </button>
          </div>

          <div className="cc-section">
            <label className="cc-checkbox">
              <input
                type="checkbox"
                checked={card.importRelations}
                onChange={(e) => setCard((c) => ({ ...c, importRelations: e.target.checked }))}
                data-sfx-handled
              />
              <span>{copy.importRelations}</span>
            </label>
          </div>

          <div className="cc-section">
            <h4>{copy.template}</h4>
            <div className="cc-template-row">
              {(['minimal', 'detailed', 'gallery'] as CardTemplate[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  className={`cc-template-btn ${card.template === t ? 'active' : ''}`}
                  data-sfx-handled
                  onClick={() => { playSound('select'); setCard((c) => ({ ...c, template: t })); }}
                  aria-pressed={card.template === t}
                >
                  {t === 'minimal' ? copy.templateMinimal : t === 'detailed' ? copy.templateDetailed : copy.templateGallery}
                </button>
              ))}
            </div>
          </div>

          <div className="cc-section">
            <h4>{copy.bgStyle}</h4>
            <div className="cc-template-row">
              {(['solid', 'gradient', 'dots'] as BgStyle[]).map((b) => (
                <button
                  key={b}
                  type="button"
                  className={`cc-template-btn ${card.bgStyle === b ? 'active' : ''}`}
                  data-sfx-handled
                  onClick={() => { playSound('select'); setCard((c) => ({ ...c, bgStyle: b })); }}
                  aria-pressed={card.bgStyle === b}
                >
                  {b === 'solid' ? copy.bgSolid : b === 'gradient' ? copy.bgGradient : copy.bgDots}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="cc-preview-area">
          <div className="cc-preview-label">{copy.previewTitle}</div>
          <div className="cc-preview-scroll">
            <div
              ref={cardRef}
              className={`cc-card cc-card-${card.template}`}
              style={cardBgStyle}
            >
              {card.template === 'minimal' && (
                <MinimalCardTemplate
                  card={card}
                  avatarUrl={avatarImg?.dataUrl}
                  relations={importedRelations}
                />
              )}
              {card.template === 'detailed' && (
                <DetailedCardTemplate
                  card={card}
                  avatarUrl={avatarImg?.dataUrl}
                  mainUrl={mainImg?.dataUrl}
                  relations={importedRelations}
                />
              )}
              {card.template === 'gallery' && (
                <GalleryCardTemplate
                  card={card}
                  avatarUrl={avatarImg?.dataUrl}
                  mainUrl={mainImg?.dataUrl}
                  relations={importedRelations}
                />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Image Picker Modal */}
      {pickerMode && (
        <div className="modal-backdrop opening" role="presentation" onClick={() => setPickerMode(null)}>
          <section className="modal-card modal-surface opening" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 'min(640px, 94vw)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, padding: '18px 22px', borderBottom: '1px solid var(--border)' }}>
              <h3 style={{ margin: 0, fontSize: '1.15rem' }}>{copy.selectImage}</h3>
              <button className="modal-close" type="button" data-sfx-handled onClick={() => { setPickerMode(null); playSound('modalClose'); }} aria-label={copy.cancel}>×</button>
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
                        setCard((c) => ({
                          ...c,
                          avatarAssetId: pickerMode === 'avatar' ? img.id : c.avatarAssetId,
                          mainImageAssetId: pickerMode === 'main' ? img.id : c.mainImageAssetId,
                        }));
                        setPickerMode(null);
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

/* ---------- Card Templates ---------- */

function MinimalCardTemplate({
  card,
  avatarUrl,
  relations,
}: {
  card: CardData;
  avatarUrl?: string;
  relations: { name: string; typeLabel: string; color: string }[];
}) {
  const accent = card.themeColor;
  return (
    <div className="cc-tmpl-minimal-inner">
      <div className="cc-tmpl-minimal-header">
        {avatarUrl ? (
          <img src={avatarUrl} alt="" className="cc-tmpl-avatar" />
        ) : (
          <div className="cc-tmpl-avatar-placeholder" style={{ background: `${accent}30`, color: accent }}>
            {(card.name || '?').charAt(0).toUpperCase()}
          </div>
        )}
        <div className="cc-tmpl-name-block">
          <h2 style={{ margin: 0, color: 'var(--text-main)', fontSize: '1.6rem' }}>{card.name || 'Unnamed'}</h2>
          {card.alias && <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{card.alias}</p>}
        </div>
      </div>

      {card.tags.length > 0 && (
        <div className="cc-tmpl-tags">
          {card.tags.map((t) => (
            <span key={t.id} className="cc-tmpl-tag" style={{ background: `${t.color}22`, color: t.color, border: `1px solid ${t.color}44` }}>
              {t.text}
            </span>
          ))}
        </div>
      )}

      {card.bio && <p className="cc-tmpl-bio">{card.bio}</p>}

      {card.fields.some((f) => f.label && f.value) && (
        <div className="cc-tmpl-fields">
          {card.fields.filter((f) => f.label && f.value).map((f) => (
            <div key={f.id} className="cc-tmpl-field-item">
              <span className="cc-tmpl-field-label">{f.label}</span>
              <span className="cc-tmpl-field-value">{f.value}</span>
            </div>
          ))}
        </div>
      )}

      {relations.length > 0 && (
        <div className="cc-tmpl-relations">
          <div className="cc-tmpl-section-title" style={{ color: accent }}>Relations</div>
          <div className="cc-tmpl-relation-list">
            {relations.map((r, i) => (
              <span key={i} className="cc-tmpl-relation-chip" style={{ background: `${r.color}18`, color: r.color, border: `1px solid ${r.color}44` }}>
                <span className="cc-tmpl-relation-dot" style={{ background: r.color }} />
                {r.name} · {r.typeLabel}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="cc-tmpl-footer">
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.7rem' }}>Made with OC Maker</span>
      </div>
    </div>
  );
}

function DetailedCardTemplate({
  card,
  avatarUrl,
  mainUrl,
  relations,
}: {
  card: CardData;
  avatarUrl?: string;
  mainUrl?: string;
  relations: { name: string; typeLabel: string; color: string }[];
}) {
  const accent = card.themeColor;
  return (
    <div className="cc-tmpl-detailed-inner">
      {mainUrl && (
        <div className="cc-tmpl-detailed-hero">
          <img src={mainUrl} alt="" />
          <div className="cc-tmpl-detailed-hero-overlay" style={{ background: `linear-gradient(to top, ${accent}55 0%, transparent 60%)` }} />
        </div>
      )}

      <div className="cc-tmpl-detailed-header">
        {avatarUrl ? (
          <img src={avatarUrl} alt="" className="cc-tmpl-detailed-avatar" style={{ borderColor: accent }} />
        ) : (
          <div className="cc-tmpl-detailed-avatar-placeholder" style={{ background: `${accent}30`, color: accent, borderColor: accent }}>
            {(card.name || '?').charAt(0).toUpperCase()}
          </div>
        )}
        <div className="cc-tmpl-detailed-title">
          <h2 style={{ margin: 0, color: 'var(--text-main)', fontSize: '1.5rem' }}>{card.name || 'Unnamed'}</h2>
          {card.alias && <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)' }}>{card.alias}</p>}
        </div>
      </div>

      {card.tags.length > 0 && (
        <div className="cc-tmpl-detailed-tags">
          {card.tags.map((t) => (
            <span key={t.id} className="cc-tmpl-tag" style={{ background: `${t.color}22`, color: t.color, border: `1px solid ${t.color}44` }}>
              {t.text}
            </span>
          ))}
        </div>
      )}

      {card.fields.some((f) => f.label && f.value) && (
        <div className="cc-tmpl-detailed-section">
          <div className="cc-tmpl-section-title" style={{ color: accent }}>Profile</div>
          <div className="cc-tmpl-detailed-grid">
            {card.fields.filter((f) => f.label && f.value).map((f) => (
              <div key={f.id} className="cc-tmpl-detailed-grid-item">
                <span className="cc-tmpl-grid-label">{f.label}</span>
                <span className="cc-tmpl-grid-value">{f.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {card.bio && (
        <div className="cc-tmpl-detailed-section">
          <div className="cc-tmpl-section-title" style={{ color: accent }}>Bio</div>
          <p className="cc-tmpl-detailed-bio">{card.bio}</p>
        </div>
      )}

      {relations.length > 0 && (
        <div className="cc-tmpl-detailed-section">
          <div className="cc-tmpl-section-title" style={{ color: accent }}>Relations</div>
          <div className="cc-tmpl-detailed-relations">
            {relations.map((r, i) => (
              <div key={i} className="cc-tmpl-detailed-relation-item">
                <span className="cc-tmpl-relation-dot" style={{ background: r.color }} />
                <span className="cc-tmpl-relation-name">{r.name}</span>
                <span className="cc-tmpl-relation-type" style={{ color: r.color }}>{r.typeLabel}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="cc-tmpl-footer">
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.7rem' }}>Made with OC Maker</span>
      </div>
    </div>
  );
}

function GalleryCardTemplate({
  card,
  avatarUrl,
  mainUrl,
  relations,
}: {
  card: CardData;
  avatarUrl?: string;
  mainUrl?: string;
  relations: { name: string; typeLabel: string; color: string }[];
}) {
  const accent = card.themeColor;
  return (
    <div className="cc-tmpl-gallery-inner">
      <div className="cc-tmpl-gallery-center">
        {avatarUrl ? (
          <img src={avatarUrl} alt="" className="cc-tmpl-gallery-avatar" style={{ borderColor: accent }} />
        ) : (
          <div className="cc-tmpl-gallery-avatar-placeholder" style={{ background: `${accent}30`, color: accent, borderColor: accent }}>
            {(card.name || '?').charAt(0).toUpperCase()}
          </div>
        )}
        <h2 style={{ margin: '12px 0 4px', color: 'var(--text-main)', fontSize: '1.4rem', textAlign: 'center' }}>{card.name || 'Unnamed'}</h2>
        {card.alias && <p style={{ margin: 0, color: 'var(--text-secondary)', textAlign: 'center' }}>{card.alias}</p>}
      </div>

      {card.tags.length > 0 && (
        <div className="cc-tmpl-gallery-tags">
          {card.tags.map((t) => (
            <span key={t.id} className="cc-tmpl-tag" style={{ background: `${t.color}22`, color: t.color, border: `1px solid ${t.color}44` }}>
              {t.text}
            </span>
          ))}
        </div>
      )}

      {mainUrl && (
        <div className="cc-tmpl-gallery-main">
          <img src={mainUrl} alt="" />
        </div>
      )}

      {card.fields.some((f) => f.label && f.value) && (
        <div className="cc-tmpl-gallery-fields">
          {card.fields.filter((f) => f.label && f.value).map((f) => (
            <div key={f.id} className="cc-tmpl-gallery-field">
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>{f.label}</span>
              <span style={{ color: 'var(--text-main)', fontWeight: 600, fontSize: '0.92rem' }}>{f.value}</span>
            </div>
          ))}
        </div>
      )}

      {card.bio && <p className="cc-tmpl-gallery-bio">{card.bio}</p>}

      {relations.length > 0 && (
        <div className="cc-tmpl-gallery-relations">
          <div className="cc-tmpl-section-title" style={{ color: accent, textAlign: 'center' }}>Relations</div>
          <div className="cc-tmpl-gallery-relation-grid">
            {relations.map((r, i) => (
              <div key={i} className="cc-tmpl-gallery-relation-item" style={{ borderColor: `${r.color}44` }}>
                <span className="cc-tmpl-relation-dot" style={{ background: r.color }} />
                <span style={{ color: 'var(--text-main)', fontWeight: 600, fontSize: '0.85rem' }}>{r.name}</span>
                <span style={{ color: r.color, fontSize: '0.75rem' }}>{r.typeLabel}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="cc-tmpl-footer" style={{ marginTop: 16 }}>
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.7rem' }}>Made with OC Maker</span>
      </div>
    </div>
  );
}
