import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { playSound } from './audioEngine';
import type { AppLanguage, SettingsState } from './types';

type EdgeType = 'friend' | 'enemy' | 'family' | 'lover' | 'mentor' | 'rival' | 'ally' | 'custom';

interface RelNode {
  id: string;
  name: string;
  avatarAssetId?: string;
  color: string;
  notes: string;
  x: number;
  y: number;
}

interface RelEdge {
  id: string;
  sourceId: string;
  targetId: string;
  type: EdgeType;
  label: string;
  notes: string;
}

interface GalleryImage {
  id: string;
  name: string;
  dataUrl: string;
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
  onOpenDocs?: (toolId?: string, section?: string, errorCode?: string) => void;
};

const NODES_KEY = 'oc-maker.relationship-web.nodes';
const EDGES_KEY = 'oc-maker.relationship-web.edges';
const NODE_SIZE = 72;
const NODE_RADIUS = NODE_SIZE / 2;

const PRESET_COLORS = [
  '#60a5fa', '#f87171', '#34d399', '#fbbf24', '#a78bfa',
  '#f472b6', '#22d3ee', '#fb923c', '#a3e635', '#e879f9',
];

const EDGE_COLORS: Record<EdgeType, string> = {
  friend: '#4ade80',
  enemy: '#f87171',
  family: '#60a5fa',
  lover: '#f472b6',
  mentor: '#a78bfa',
  rival: '#fb923c',
  ally: '#34d399',
  custom: '#94a3b8',
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

function loadNodes(): RelNode[] {
  try {
    const raw = window.localStorage.getItem(NODES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (n): n is RelNode =>
        n && typeof n === 'object' && typeof n.id === 'string' && typeof n.name === 'string' &&
        typeof n.x === 'number' && typeof n.y === 'number' && typeof n.color === 'string',
    ).map((n) => ({
      ...n,
      color: n.color || PRESET_COLORS[0],
      notes: n.notes || '',
    }));
  } catch {
    return [];
  }
}

function saveNodes(nodes: RelNode[]) {
  try { window.localStorage.setItem(NODES_KEY, JSON.stringify(nodes)); } catch {}
}

function loadEdges(): RelEdge[] {
  try {
    const raw = window.localStorage.getItem(EDGES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (e): e is RelEdge =>
        e && typeof e === 'object' && typeof e.id === 'string' &&
        typeof e.sourceId === 'string' && typeof e.targetId === 'string' &&
        typeof e.type === 'string' && typeof e.label === 'string' &&
        typeof e.notes === 'string',
    ).map((e) => ({
      ...e,
      type: (EDGE_COLORS as Record<string, string>)[e.type] ? e.type : 'custom',
      label: e.label || '',
      notes: e.notes || '',
    }));
  } catch {
    return [];
  }
}

function saveEdges(edges: RelEdge[]) {
  try { window.localStorage.setItem(EDGES_KEY, JSON.stringify(edges)); } catch {}
}

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function loadGalleryImages(): GalleryImage[] {
  try {
    const raw = window.localStorage.getItem('oc-maker.asset-gallery');
    if (!raw) return [];
    const metas = JSON.parse(raw) as Array<{ id: string; name: string; type: string }>;
    return metas
      .filter((m) => m.type === 'image' || m.type === 'gif')
      .map((m) => {
        const dataUrl = window.localStorage.getItem(`oc-maker.asset-data.${m.id}`);
        return dataUrl ? { id: m.id, name: m.name, dataUrl } : null;
      })
      .filter(Boolean) as GalleryImage[];
  } catch {
    return [];
  }
}

const copyBase = {
  zh: {
    addNode: '添加角色',
    editNode: '编辑角色',
    deleteNode: '删除角色',
    nodeName: '角色名称',
    nodeNotes: '备注',
    nodeColor: '颜色',
    nodeAvatar: '头像',
    noAvatar: '无头像',
    selectAvatar: '选择头像',
    clearAvatar: '清除头像',
    addEdge: '添加关系',
    editEdge: '编辑关系',
    deleteEdge: '删除关系',
    edgeType: '关系类型',
    edgeLabel: '标签',
    edgeNotes: '备注',
    sourceNode: '源角色',
    targetNode: '目标角色',
    selectTarget: '选择目标角色',
    cancel: '取消',
    save: '保存',
    deleteConfirmNode: '确定要删除角色「{name}」吗？相关的关系也会被删除。',
    deleteConfirmEdge: '确定要删除这条关系吗？',
    emptyNodes: '还没有角色',
    emptyHint: '点击「添加角色」开始构建你的角色关系网。你也可以从资产库导入头像。',
    nodesCount: '共 {count} 个角色',
    edgesCount: '{count} 条关系',
    canvasHint: '滚轮缩放 · 拖拽移动 · 点击选中 · 双击编辑',
    zoomIn: '放大',
    zoomOut: '缩小',
    resetView: '重置视图',
    relationFriend: '朋友',
    relationEnemy: '敌人',
    relationFamily: '家人',
    relationLover: '恋人',
    relationMentor: '师徒',
    relationRival: '对手',
    relationAlly: '盟友',
    relationCustom: '自定义',
    fromAssetGallery: '从资产库选择',
    unnamed: '未命名',
    selectColor: '选择颜色',
    helpButton: '帮助',
    edgeHint: '点击另一个角色以创建关系',
    edgeLabelPlaceholder: '可选标签',
    noImagesInGallery: '资产库中没有图片',
    importImagesFirst: '请先前往资产库导入角色图片',
  },
  ja: {
    addNode: 'キャラ追加',
    editNode: 'キャラ編集',
    deleteNode: 'キャラ削除',
    nodeName: 'キャラ名',
    nodeNotes: 'メモ',
    nodeColor: '色',
    nodeAvatar: 'アイコン',
    noAvatar: 'なし',
    selectAvatar: 'アイコン選択',
    clearAvatar: 'アイコン削除',
    addEdge: '関係追加',
    editEdge: '関係編集',
    deleteEdge: '関係削除',
    edgeType: '関係タイプ',
    edgeLabel: 'ラベル',
    edgeNotes: 'メモ',
    sourceNode: 'ソース',
    targetNode: 'ターゲット',
    selectTarget: 'ターゲット選択',
    cancel: 'キャンセル',
    save: '保存',
    deleteConfirmNode: '「{name}」を削除しますか？関連する関係も削除されます。',
    deleteConfirmEdge: 'この関係を削除しますか？',
    emptyNodes: 'キャラがいません',
    emptyHint: '「キャラ追加」ボタンをクリックして関係図を作りましょう。アセットライブラリからアイコンを選ぶこともできます。',
    nodesCount: '計 {count} キャラ',
    edgesCount: '{count} 件の関係',
    canvasHint: 'ホイールでズーム · ドラッグで移動 · クリックで選択 · ダブルクリックで編集',
    zoomIn: '拡大',
    zoomOut: '縮小',
    resetView: '表示リセット',
    relationFriend: '友達',
    relationEnemy: '敵',
    relationFamily: '家族',
    relationLover: '恋人',
    relationMentor: '師弟',
    relationRival: 'ライバル',
    relationAlly: '同盟',
    relationCustom: 'カスタム',
    fromAssetGallery: 'アセットから選択',
    unnamed: '名称未設定',
    selectColor: '色を選択',
    helpButton: 'ヘルプ',
    edgeHint: '別のキャラをクリックして関係を作成',
    edgeLabelPlaceholder: '任意ラベル',
    noImagesInGallery: 'アセットライブラリに画像がありません',
    importImagesFirst: '先にアセットライブラリでキャラ画像をインポートしてください',
  },
  en: {
    addNode: 'Add Character',
    editNode: 'Edit Character',
    deleteNode: 'Delete Character',
    nodeName: 'Name',
    nodeNotes: 'Notes',
    nodeColor: 'Color',
    nodeAvatar: 'Avatar',
    noAvatar: 'No avatar',
    selectAvatar: 'Select Avatar',
    clearAvatar: 'Clear Avatar',
    addEdge: 'Add Relation',
    editEdge: 'Edit Relation',
    deleteEdge: 'Delete Relation',
    edgeType: 'Relation Type',
    edgeLabel: 'Label',
    edgeNotes: 'Notes',
    sourceNode: 'Source',
    targetNode: 'Target',
    selectTarget: 'Select Target',
    cancel: 'Cancel',
    save: 'Save',
    deleteConfirmNode: 'Delete character "{name}"? Related relations will also be removed.',
    deleteConfirmEdge: 'Delete this relation?',
    emptyNodes: 'No characters yet',
    emptyHint: 'Click "Add Character" to start building your relationship web. You can also pick avatars from the Asset Gallery.',
    nodesCount: '{count} characters',
    edgesCount: '{count} relations',
    canvasHint: 'Wheel to zoom · Drag to pan · Click to select · Double-click to edit',
    zoomIn: 'Zoom In',
    zoomOut: 'Zoom Out',
    resetView: 'Reset View',
    relationFriend: 'Friend',
    relationEnemy: 'Enemy',
    relationFamily: 'Family',
    relationLover: 'Lover',
    relationMentor: 'Mentor',
    relationRival: 'Rival',
    relationAlly: 'Ally',
    relationCustom: 'Custom',
    fromAssetGallery: 'From Asset Gallery',
    unnamed: 'Unnamed',
    selectColor: 'Select Color',
    helpButton: 'Help',
    edgeHint: 'Click another character to create a relation',
    edgeLabelPlaceholder: 'Optional label',
    noImagesInGallery: 'No images in Asset Gallery',
    importImagesFirst: 'Please import character images to Asset Gallery first',
  },
  ru: {
    addNode: 'Добавить персонажа',
    editNode: 'Редактировать',
    deleteNode: 'Удалить',
    nodeName: 'Имя',
    nodeNotes: 'Заметки',
    nodeColor: 'Цвет',
    nodeAvatar: 'Аватар',
    noAvatar: 'Нет аватара',
    selectAvatar: 'Выбрать аватар',
    clearAvatar: 'Убрать аватар',
    addEdge: 'Добавить связь',
    editEdge: 'Редактировать связь',
    deleteEdge: 'Удалить связь',
    edgeType: 'Тип связи',
    edgeLabel: 'Метка',
    edgeNotes: 'Заметки',
    sourceNode: 'Источник',
    targetNode: 'Цель',
    selectTarget: 'Выбрать цель',
    cancel: 'Отмена',
    save: 'Сохранить',
    deleteConfirmNode: 'Удалить персонажа «{name}»? Связанные связи также будут удалены.',
    deleteConfirmEdge: 'Удалить эту связь?',
    emptyNodes: 'Пока нет персонажей',
    emptyHint: 'Нажмите «Добавить персонажа», чтобы начать строить сеть отношений. Также можно выбрать аватар из галереи активов.',
    nodesCount: '{count} персонажей',
    edgesCount: '{count} связей',
    canvasHint: 'Колёсико — масштаб · Перетаскивание — панорама · Клик — выбор · Двойной клик — редактирование',
    zoomIn: 'Приблизить',
    zoomOut: 'Отдалить',
    resetView: 'Сбросить вид',
    relationFriend: 'Друг',
    relationEnemy: 'Враг',
    relationFamily: 'Семья',
    relationLover: 'Возлюбленный',
    relationMentor: 'Наставник',
    relationRival: 'Соперник',
    relationAlly: 'Союзник',
    relationCustom: 'Другое',
    fromAssetGallery: 'Из галереи активов',
    unnamed: 'Безымянный',
    selectColor: 'Выбрать цвет',
    helpButton: 'Справка',
    edgeHint: 'Кликните другого персонажа для создания связи',
    edgeLabelPlaceholder: 'Опциональная метка',
    noImagesInGallery: 'В галерее активов нет изображений',
    importImagesFirst: 'Сначала импортируйте изображения персонажей в галерею активов',
  },
  ko: {
    addNode: '캐릭터 추가',
    editNode: '캐릭터 편집',
    deleteNode: '캐릭터 삭제',
    nodeName: '이름',
    nodeNotes: '메모',
    nodeColor: '색상',
    nodeAvatar: '아바타',
    noAvatar: '없음',
    selectAvatar: '아바타 선택',
    clearAvatar: '아바타 삭제',
    addEdge: '관계 추가',
    editEdge: '관계 편집',
    deleteEdge: '관계 삭제',
    edgeType: '관계 유형',
    edgeLabel: '라벨',
    edgeNotes: '메모',
    sourceNode: '출발',
    targetNode: '도착',
    selectTarget: '대상 선택',
    cancel: '취소',
    save: '저장',
    deleteConfirmNode: '「{name}」을(를) 삭제하시겠습니까? 관련 관계도 함께 삭제됩니다.',
    deleteConfirmEdge: '이 관계를 삭제하시겠습니까?',
    emptyNodes: '캐릭터가 없습니다',
    emptyHint: '「캐릭터 추가」를 클릭하여 관계망을 구축하세요. 에셋 갤러리에서 아바타를 선택할 수도 있습니다.',
    nodesCount: '총 {count}개 캐릭터',
    edgesCount: '{count}개 관계',
    canvasHint: '휠 확대/축소 · 드래그 이동 · 클릭 선택 · 더블클릭 편집',
    zoomIn: '확대',
    zoomOut: '축소',
    resetView: '보기 재설정',
    relationFriend: '친구',
    relationEnemy: '적',
    relationFamily: '가족',
    relationLover: '연인',
    relationMentor: '스승',
    relationRival: '라이벌',
    relationAlly: '동맹',
    relationCustom: '사용자 정의',
    fromAssetGallery: '에셋 갤러리에서',
    unnamed: '이름 없음',
    selectColor: '색상 선택',
    helpButton: '도움말',
    edgeHint: '다른 캐릭터를 클릭하여 관계를 생성',
    edgeLabelPlaceholder: '선택적 라벨',
    noImagesInGallery: '에셋 갤러리에 이미지가 없습니다',
    importImagesFirst: '먼저 에셋 갤러리에서 캐릭터 이미지를 가져오세요',
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

function getEdgeTypeLabel(lang: AppLanguage, type: EdgeType): string {
  const c = copyBase[lang as keyof typeof copyBase] || copyBase.en;
  const key = `relation${type.charAt(0).toUpperCase() + type.slice(1)}` as keyof typeof c;
  return (c[key] as string) || type;
}
export function RelationshipWebPage({
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
  onOpenDocs,
}: SharedPageProps) {
  const copy = getCopy(language);
  const [nodes, setNodes] = useState<RelNode[]>(() => loadNodes());
  const [edges, setEdges] = useState<RelEdge[]>(() => loadEdges());
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const panStart = useRef({ x: 0, y: 0, px: 0, py: 0 });
  const [nodeModal, setNodeModal] = useState<RelNode | null>(null);
  const [edgeModal, setEdgeModal] = useState<RelEdge | null>(null);
  const [isAddingEdge, setIsAddingEdge] = useState(false);
  const [edgeSourceId, setEdgeSourceId] = useState<string | null>(null);
  const [avatarPickerOpen, setAvatarPickerOpen] = useState(false);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const galleryCache = useRef<Map<string, GalleryImage>>(new Map());
  const canvasRef = useRef<HTMLDivElement>(null);
  const isDraggingNode = useRef(false);
  const dragNodeId = useRef<string | null>(null);
  const dragOffset = useRef({ x: 0, y: 0 });
  const selectedNodeIdRef = useRef<string | null>(null);
  const selectedEdgeIdRef = useRef<string | null>(null);
  const isAddingEdgeRef = useRef(false);
  const nodesRef = useRef<RelNode[]>(nodes);
  const edgesRef = useRef<RelEdge[]>(edges);
  const touchStartPos = useRef<{ x: number; y: number } | null>(null);
  const isTouchDragging = useRef(false);

  // Persist
  useEffect(() => { saveNodes(nodes); }, [nodes]);
  useEffect(() => { saveEdges(edges); }, [edges]);
  useBeforeUnloadGuard(nodes.length > 0 || edges.length > 0);

  // Keep refs in sync to avoid effect re-registration
  useEffect(() => { nodesRef.current = nodes; }, [nodes]);
  useEffect(() => { edgesRef.current = edges; }, [edges]);
  useEffect(() => { selectedNodeIdRef.current = selectedNodeId; }, [selectedNodeId]);
  useEffect(() => { selectedEdgeIdRef.current = selectedEdgeId; }, [selectedEdgeId]);
  useEffect(() => { isAddingEdgeRef.current = isAddingEdge; }, [isAddingEdge]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (nodeModal || edgeModal || avatarPickerOpen) {
        if (e.key === 'Escape') {
          e.preventDefault();
          if (avatarPickerOpen) setAvatarPickerOpen(false);
          else if (edgeModal) setEdgeModal(null);
          else if (nodeModal) setNodeModal(null);
          playSound('modalClose');
        }
        return;
      }
      if (e.key === 'Escape') {
        if (isAddingEdgeRef.current) {
          setIsAddingEdge(false);
          setEdgeSourceId(null);
          playSound('deselect');
        } else if (selectedEdgeIdRef.current) {
          setSelectedEdgeId(null);
          playSound('deselect');
        } else if (selectedNodeIdRef.current) {
          setSelectedNodeId(null);
          playSound('deselect');
        }
      }
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedNodeIdRef.current) {
          const node = nodesRef.current.find((n) => n.id === selectedNodeIdRef.current);
          if (node && window.confirm(copy.deleteConfirmNode.replace('{name}', node.name))) {
            setNodes((prev) => prev.filter((n) => n.id !== selectedNodeIdRef.current));
            setEdges((prev) => prev.filter((e) => e.sourceId !== selectedNodeIdRef.current && e.targetId !== selectedNodeIdRef.current));
            setSelectedNodeId(null);
            playSound('deleteSound');
          }
        } else if (selectedEdgeIdRef.current) {
          if (window.confirm(copy.deleteConfirmEdge)) {
            setEdges((prev) => prev.filter((e) => e.id !== selectedEdgeIdRef.current));
            setSelectedEdgeId(null);
            playSound('deleteSound');
          }
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [nodeModal, edgeModal, avatarPickerOpen, copy.deleteConfirmNode, copy.deleteConfirmEdge]);

  // Load gallery images when picker opens (cached)
  useEffect(() => {
    if (avatarPickerOpen) {
      const imgs = loadGalleryImages();
      galleryCache.current = new Map(imgs.map((i) => [i.id, i]));
      setGalleryImages(imgs);
    }
  }, [avatarPickerOpen]);

  const selectedNode = useMemo(() => nodes.find((n) => n.id === selectedNodeId) ?? null, [nodes, selectedNodeId]);
  const selectedEdge = useMemo(() => edges.find((e) => e.id === selectedEdgeId) ?? null, [edges, selectedEdgeId]);

  const nodeEdges = useMemo(() => {
    if (!selectedNodeId) return [];
    return edges.filter((e) => e.sourceId === selectedNodeId || e.targetId === selectedNodeId);
  }, [edges, selectedNodeId]);

  // Canvas interactions
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    setZoom((prevZoom) => {
      const newZoom = Math.min(Math.max(prevZoom * delta, 0.3), 3);
      setPan((prevPan) => {
        const worldX = (mouseX - prevPan.x) / prevZoom;
        const worldY = (mouseY - prevPan.y) / prevZoom;
        return {
          x: mouseX - worldX * newZoom,
          y: mouseY - worldY * newZoom,
        };
      });
      return newZoom;
    });
  }, []);

  const handleMouseDownCanvas = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.rel-node')) return;
    setIsPanning(true);
    panStart.current = { x: e.clientX, y: e.clientY, px: pan.x, py: pan.y };
  }, [pan.x, pan.y]);

  const handleMouseMoveCanvas = useCallback((e: React.MouseEvent) => {
    if (isPanning) {
      setPan({
        x: panStart.current.px + (e.clientX - panStart.current.x),
        y: panStart.current.py + (e.clientY - panStart.current.y),
      });
    }
    if (isDraggingNode.current && dragNodeId.current) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      const cx = (e.clientX - rect.left - pan.x) / zoom - dragOffset.current.x;
      const cy = (e.clientY - rect.top - pan.y) / zoom - dragOffset.current.y;
      setNodes((prev) => prev.map((n) => (n.id === dragNodeId.current ? { ...n, x: cx, y: cy } : n)));
    }
  }, [isPanning, pan.x, pan.y, zoom]);

  const handleMouseUpCanvas = useCallback((e: React.MouseEvent) => {
    if (isPanning) {
      const dx = e.clientX - panStart.current.x;
      const dy = e.clientY - panStart.current.y;
      if (Math.sqrt(dx * dx + dy * dy) < 5) {
        // Click on empty canvas — deselect
        setSelectedNodeId(null);
        setSelectedEdgeId(null);
        setIsAddingEdge(false);
        setEdgeSourceId(null);
      }
    }
    setIsPanning(false);
    isDraggingNode.current = false;
    dragNodeId.current = null;
  }, [isPanning]);

  const handleNodeMouseDown = useCallback((e: React.MouseEvent, node: RelNode) => {
    e.stopPropagation();
    if (isAddingEdge && edgeSourceId) {
      if (edgeSourceId !== node.id) {
        setEdges((prev) => {
          const existing = prev.find((ed) =>
            (ed.sourceId === edgeSourceId && ed.targetId === node.id) ||
            (ed.sourceId === node.id && ed.targetId === edgeSourceId),
          );
          if (existing) {
            playSound('warning');
            return prev;
          }
          const newEdge: RelEdge = {
            id: uid(),
            sourceId: edgeSourceId,
            targetId: node.id,
            type: 'friend',
            label: '',
            notes: '',
          };
          setSelectedEdgeId(newEdge.id);
          setEdgeModal(newEdge);
          playSound('confirm');
          return [...prev, newEdge];
        });
      } else {
        playSound('deselect');
      }
      setIsAddingEdge(false);
      setEdgeSourceId(null);
      return;
    }
    setSelectedNodeId(node.id);
    setSelectedEdgeId(null);
    playSound('select');
    isDraggingNode.current = true;
    dragNodeId.current = node.id;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      dragOffset.current = {
        x: (e.clientX - rect.left - pan.x) / zoom - node.x,
        y: (e.clientY - rect.top - pan.y) / zoom - node.y,
      };
    }
  }, [isAddingEdge, edgeSourceId, pan.x, pan.y, zoom]);

  const handleNodeDoubleClick = useCallback((e: React.MouseEvent, node: RelNode) => {
    e.stopPropagation();
    setNodeModal({ ...node });
    setSelectedNodeId(node.id);
    setSelectedEdgeId(null);
    playSound('modalOpen');
  }, []);

  // Touch support
  const handleTouchStartCanvas = useCallback((e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    const touch = e.touches[0];
    const target = touch.target as HTMLElement;
    if (target.closest('.rel-node')) return; // Let node handler deal with it
    touchStartPos.current = { x: touch.clientX, y: touch.clientY };
    isTouchDragging.current = false;
    panStart.current = { x: touch.clientX, y: touch.clientY, px: pan.x, py: pan.y };
  }, [pan.x, pan.y]);

  const handleTouchMoveCanvas = useCallback((e: React.TouchEvent) => {
    if (e.touches.length !== 1 || !touchStartPos.current) return;
    e.preventDefault();
    const touch = e.touches[0];
    const dx = touch.clientX - touchStartPos.current.x;
    const dy = touch.clientY - touchStartPos.current.y;
    if (!isTouchDragging.current && Math.sqrt(dx * dx + dy * dy) > 5) {
      isTouchDragging.current = true;
      setIsPanning(true);
    }
    if (isTouchDragging.current) {
      if (isDraggingNode.current && dragNodeId.current) {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (rect) {
          const cx = (touch.clientX - rect.left - pan.x) / zoom - dragOffset.current.x;
          const cy = (touch.clientY - rect.top - pan.y) / zoom - dragOffset.current.y;
          setNodes((prev) => prev.map((n) => (n.id === dragNodeId.current ? { ...n, x: cx, y: cy } : n)));
        }
      } else {
        setPan({
          x: panStart.current.px + (touch.clientX - panStart.current.x),
          y: panStart.current.py + (touch.clientY - panStart.current.y),
        });
      }
    }
  }, [pan.x, pan.y, zoom]);

  const handleTouchEndCanvas = useCallback((e: React.TouchEvent) => {
    if (!touchStartPos.current) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartPos.current.x;
    const dy = touch.clientY - touchStartPos.current.y;
    if (!isTouchDragging.current && Math.sqrt(dx * dx + dy * dy) < 10) {
      // Tap on empty canvas — deselect
      setSelectedNodeId(null);
      setSelectedEdgeId(null);
      setIsAddingEdge(false);
      setEdgeSourceId(null);
    }
    touchStartPos.current = null;
    isTouchDragging.current = false;
    setIsPanning(false);
  }, []);

  const handleNodeTouchStart = useCallback((e: React.TouchEvent, node: RelNode) => {
    e.stopPropagation();
    const touch = e.touches[0];
    touchStartPos.current = { x: touch.clientX, y: touch.clientY };
    isTouchDragging.current = false;
    if (isAddingEdge && edgeSourceId) {
      if (edgeSourceId !== node.id) {
        setEdges((prev) => {
          const existing = prev.find((ed) =>
            (ed.sourceId === edgeSourceId && ed.targetId === node.id) ||
            (ed.sourceId === node.id && ed.targetId === edgeSourceId),
          );
          if (existing) { playSound('warning'); return prev; }
          const newEdge: RelEdge = {
            id: uid(), sourceId: edgeSourceId, targetId: node.id,
            type: 'friend', label: '', notes: '',
          };
          setSelectedEdgeId(newEdge.id);
          setEdgeModal(newEdge);
          playSound('confirm');
          return [...prev, newEdge];
        });
      } else {
        playSound('deselect');
      }
      setIsAddingEdge(false);
      setEdgeSourceId(null);
      return;
    }
    setSelectedNodeId(node.id);
    setSelectedEdgeId(null);
    playSound('select');
    isDraggingNode.current = true;
    dragNodeId.current = node.id;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      dragOffset.current = {
        x: (touch.clientX - rect.left - pan.x) / zoom - node.x,
        y: (touch.clientY - rect.top - pan.y) / zoom - node.y,
      };
    }
  }, [isAddingEdge, edgeSourceId, pan.x, pan.y, zoom]);

  const handleEdgeClick = useCallback((e: React.MouseEvent, edge: RelEdge) => {
    e.stopPropagation();
    setSelectedEdgeId(edge.id);
    setSelectedNodeId(null);
    playSound('select');
  }, []);

  const handleAddNode = useCallback(() => {
    const newNode: RelNode = {
      id: uid(),
      name: copy.unnamed,
      color: PRESET_COLORS[nodes.length % PRESET_COLORS.length],
      notes: '',
      x: -pan.x / zoom + 200,
      y: -pan.y / zoom + 200,
    };
    setNodes((prev) => [...prev, newNode]);
    setSelectedNodeId(newNode.id);
    setSelectedEdgeId(null);
    setNodeModal({ ...newNode });
    playSound('confirm');
  }, [nodes.length, pan.x, pan.y, zoom, copy.unnamed]);

  const handleDeleteNode = useCallback((id: string) => {
    const node = nodes.find((n) => n.id === id);
    if (!node) return;
    if (!window.confirm(copy.deleteConfirmNode.replace('{name}', node.name))) return;
    setNodes((prev) => prev.filter((n) => n.id !== id));
    setEdges((prev) => prev.filter((e) => e.sourceId !== id && e.targetId !== id));
    if (selectedNodeId === id) setSelectedNodeId(null);
    playSound('deleteSound');
  }, [nodes, copy.deleteConfirmNode, selectedNodeId]);

  const handleDeleteEdge = useCallback((id: string) => {
    if (!window.confirm(copy.deleteConfirmEdge)) return;
    setEdges((prev) => prev.filter((e) => e.id !== id));
    if (selectedEdgeId === id) setSelectedEdgeId(null);
    playSound('deleteSound');
  }, [copy.deleteConfirmEdge, selectedEdgeId]);

  const handleSaveNode = useCallback(() => {
    if (!nodeModal) return;
    setNodes((prev) => prev.map((n) => (n.id === nodeModal.id ? nodeModal : n)));
    setNodeModal(null);
    playSound('confirm');
  }, [nodeModal]);

  const handleSaveEdge = useCallback(() => {
    if (!edgeModal) return;
    setEdges((prev) => prev.map((e) => (e.id === edgeModal.id ? edgeModal : e)));
    setEdgeModal(null);
    playSound('confirm');
  }, [edgeModal]);

  const handleStartAddEdge = useCallback(() => {
    if (!selectedNodeId) return;
    setIsAddingEdge(true);
    setEdgeSourceId(selectedNodeId);
    setSelectedEdgeId(null);
    playSound('select');
  }, [selectedNodeId]);

  const handleResetView = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    playSound('buttonClick');
  }, []);

  // Compute edge SVG paths (O(1) node lookup via Map)
  const edgePaths = useMemo(() => {
    const nodeMap = new Map(nodes.map((n) => [n.id, n]));
    return edges.map((edge) => {
      const s = nodeMap.get(edge.sourceId);
      const t = nodeMap.get(edge.targetId);
      if (!s || !t) return null;
      const dx = t.x - s.x;
      const dy = t.y - s.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const sx = s.x + (dx / dist) * NODE_RADIUS;
      const sy = s.y + (dy / dist) * NODE_RADIUS;
      const tx = t.x - (dx / dist) * NODE_RADIUS;
      const ty = t.y - (dy / dist) * NODE_RADIUS;
      const mx = (sx + tx) / 2;
      const my = (sy + ty) / 2;
      return { edge, sx, sy, tx, ty, mx, my };
    }).filter(Boolean);
  }, [edges, nodes]);

  return (
    <main className="feature-shell tool-page-shell">
      <header className="feature-header fade-up delay-1">
        <div className="feature-header-meta">
          <button className="back-link" type="button" data-sfx-handled onClick={() => { playSound('back'); onBack(); }}>
            ← {backHome}
          </button>
          <span className="version-pill" style={{ minHeight: 40, padding: '0 14px' }}>
            {copy.nodesCount.replace('{count}', String(nodes.length))} · {copy.edgesCount.replace('{count}', String(edges.length))}
          </span>
        </div>
        <div className="tool-header-actions">
          <button className="secondary-button small-button" type="button" data-sfx-handled onClick={() => { playSound('buttonClick'); handleAddNode(); }}>
            {copy.addNode}
          </button>
          <button className="secondary-button small-button" type="button" data-sfx-handled onClick={() => { playSound('buttonClick'); onOpenSettings(); }}>
            {openSettings}
          </button>
          {onOpenDocs && (
            <button className="secondary-button small-button" type="button" data-sfx-handled onClick={() => { playSound('buttonClick'); onOpenDocs('relationship-web'); }}>
              {copy.helpButton}
            </button>
          )}
        </div>
      </header>

      <section className="tool-workbench fade-up delay-2" style={{ padding: 0, overflow: 'hidden', display: 'flex' }}>
        <div className="tool-header" style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 5, padding: '14px 20px', pointerEvents: 'none' }}>
          <div>
            <h2>{pageTitle}</h2>
            <p>{pageDescription}</p>
          </div>
        </div>
        {/* Canvas */}
        <div
          ref={canvasRef}
          className="rel-canvas"
          onWheel={handleWheel}
          onMouseDown={handleMouseDownCanvas}
          onMouseMove={handleMouseMoveCanvas}
          onMouseUp={handleMouseUpCanvas}
          onMouseLeave={() => {
            setIsPanning(false);
            isDraggingNode.current = false;
            dragNodeId.current = null;
          }}
          onTouchStart={handleTouchStartCanvas}
          onTouchMove={handleTouchMoveCanvas}
          onTouchEnd={handleTouchEndCanvas}
          style={{ cursor: isPanning ? 'grabbing' : isAddingEdge ? 'crosshair' : 'default', touchAction: 'none' }}
        >
          <div
            className="rel-world"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: '0 0',
            }}
          >
            {/* Edges SVG layer */}
            <svg className="rel-edges-svg">
              {edgePaths.map((ep) => ep && (
                <g key={ep.edge.id} className={`rel-edge-group ${selectedEdgeId === ep.edge.id ? 'active' : ''}`}>
                  <line
                    x1={ep.sx}
                    y1={ep.sy}
                    x2={ep.tx}
                    y2={ep.ty}
                    stroke={EDGE_COLORS[ep.edge.type]}
                    strokeWidth={selectedEdgeId === ep.edge.id ? 3 : 2}
                    strokeOpacity={0.85}
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={(e) => handleEdgeClick(e, ep.edge)}
                    style={{ cursor: 'pointer' }}
                  />
                  <circle cx={ep.sx} cy={ep.sy} r={3} fill={EDGE_COLORS[ep.edge.type]} />
                  <circle cx={ep.tx} cy={ep.ty} r={3} fill={EDGE_COLORS[ep.edge.type]} />
                  {ep.edge.label && (
                    <text
                      x={ep.mx}
                      y={ep.my - 6}
                      textAnchor="middle"
                      fontSize={11}
                      fill="var(--text-main)"
                      style={{ pointerEvents: 'none', fontWeight: 600 }}
                    >
                      {ep.edge.label}
                    </text>
                  )}
                  <text
                    x={ep.mx}
                    y={ep.my + (ep.edge.label ? 10 : 4)}
                    textAnchor="middle"
                    fontSize={10}
                    fill={EDGE_COLORS[ep.edge.type]}
                    style={{ pointerEvents: 'none' }}
                  >
                    {getEdgeTypeLabel(language, ep.edge.type)}
                  </text>
                </g>
              ))}
            </svg>

            {/* Nodes */}
            {nodes.map((node) => {
              const isSelected = selectedNodeId === node.id;
              const isSource = isAddingEdge && edgeSourceId === node.id;
              return (
                <div
                  key={node.id}
                  className={`rel-node ${isSelected ? 'active' : ''} ${isSource ? 'source' : ''}`}
                  style={{
                    left: node.x - NODE_RADIUS,
                    top: node.y - NODE_RADIUS,
                    width: NODE_SIZE,
                    height: NODE_SIZE,
                  }}
                  onMouseDown={(e) => handleNodeMouseDown(e, node)}
                  onTouchStart={(e) => handleNodeTouchStart(e, node)}
                  onTouchEnd={(e) => { e.stopPropagation(); isDraggingNode.current = false; dragNodeId.current = null; touchStartPos.current = null; isTouchDragging.current = false; setIsPanning(false); }}
                  onDoubleClick={(e) => handleNodeDoubleClick(e, node)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      if (e.shiftKey && selectedNodeId && selectedNodeId !== node.id) {
                        // Shift+Enter quick-add edge
                        setEdges((prev) => {
                          const existing = prev.find((ed) =>
                            (ed.sourceId === selectedNodeId && ed.targetId === node.id) ||
                            (ed.sourceId === node.id && ed.targetId === selectedNodeId),
                          );
                          if (existing) return prev;
                          const newEdge: RelEdge = {
                            id: uid(), sourceId: selectedNodeId, targetId: node.id,
                            type: 'friend', label: '', notes: '',
                          };
                          setSelectedEdgeId(newEdge.id);
                          playSound('confirm');
                          return [...prev, newEdge];
                        });
                      } else {
                        setSelectedNodeId(node.id);
                        setSelectedEdgeId(null);
                        playSound('select');
                      }
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  data-sfx-handled
                  aria-label={node.name}
                >
                  <div
                    className="rel-node-avatar"
                    style={{
                      backgroundColor: node.color,
                      boxShadow: isSelected ? `0 0 0 3px ${node.color}66` : 'none',
                    }}
                  >
                    {node.avatarAssetId ? (
                      <img
                        src={(() => {
                          const img = galleryCache.current.get(node.avatarAssetId)
                            || galleryImages.find((g) => g.id === node.avatarAssetId);
                          return img?.dataUrl || '';
                        })()}
                        alt=""
                        draggable={false}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                      />
                    ) : (
                      <span style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-main, #fff)' }}>
                        {(node.name || '?').charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <span className="rel-node-name">{node.name}</span>
                </div>
              );
            })}
          </div>

          {/* Canvas controls */}
          <div className="rel-canvas-controls">
            <button className="rel-canvas-btn" type="button" data-sfx-handled onClick={() => { playSound('buttonClick'); setZoom((z) => Math.min(z * 1.15, 3)); }} title={copy.zoomIn}>+</button>
            <button className="rel-canvas-btn" type="button" data-sfx-handled onClick={() => { playSound('buttonClick'); setZoom((z) => Math.max(z / 1.15, 0.3)); }} title={copy.zoomOut}>−</button>
            <button className="rel-canvas-btn" type="button" data-sfx-handled onClick={handleResetView} title={copy.resetView}>⌖</button>
          </div>

          {/* Canvas hint */}
          <div className="rel-canvas-hint">{copy.canvasHint}</div>

          {/* Adding edge indicator */}
          {isAddingEdge && (
            <div className="rel-edge-hint">
              {copy.edgeHint}
            </div>
          )}
        </div>

        {/* Side panel */}
        <aside className={`rel-side-panel ${selectedNode || selectedEdge ? 'open' : ''}`}>
          {selectedNode ? (
            <div className="rel-panel-content">
              <h4>{selectedNode.name}</h4>
              {selectedNode.notes && <p className="rel-panel-notes">{selectedNode.notes}</p>}
              <div className="rel-panel-actions">
                <button className="secondary-button small-button" type="button" data-sfx-handled onClick={() => { setNodeModal({ ...selectedNode }); playSound('modalOpen'); }}>
                  {copy.editNode}
                </button>
                <button className="secondary-button small-button" type="button" data-sfx-handled onClick={() => { handleStartAddEdge(); }}>
                  {copy.addEdge}
                </button>
                <button className="secondary-button small-button" type="button" style={{ color: 'var(--danger, #ef476f)' }} data-sfx-handled onClick={() => { handleDeleteNode(selectedNode.id); }}>
                  {copy.deleteNode}
                </button>
              </div>

              {nodeEdges.length > 0 && (
                <div className="rel-panel-section">
                  <h5>{copy.edgesCount.replace('{count}', String(nodeEdges.length))}</h5>
                  <div className="rel-edge-list">
                    {nodeEdges.map((edge) => {
                      const otherId = edge.sourceId === selectedNode.id ? edge.targetId : edge.sourceId;
                      const other = nodes.find((n) => n.id === otherId);
                      return (
                        <button
                          key={edge.id}
                          className={`rel-edge-item ${selectedEdgeId === edge.id ? 'active' : ''}`}
                          type="button"
                          data-sfx-handled
                          onClick={() => { setSelectedEdgeId(edge.id); setSelectedNodeId(null); playSound('select'); }}
                        >
                          <span className="rel-edge-dot" style={{ background: EDGE_COLORS[edge.type] }} />
                          <span className="rel-edge-text">
                            {other?.name || '?'} · {getEdgeTypeLabel(language, edge.type)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : selectedEdge ? (
            <div className="rel-panel-content">
              <h4>{copy.editEdge}</h4>
              <div className="rel-edge-info">
                <div className="rel-edge-row">
                  <span className="rel-edge-dot" style={{ background: EDGE_COLORS[selectedEdge.type] }} />
                  <span>{getEdgeTypeLabel(language, selectedEdge.type)}</span>
                </div>
                {selectedEdge.label && <p className="rel-panel-notes">{selectedEdge.label}</p>}
                {selectedEdge.notes && <p className="rel-panel-notes">{selectedEdge.notes}</p>}
              </div>
              <div className="rel-panel-actions">
                <button className="secondary-button small-button" type="button" data-sfx-handled onClick={() => { setEdgeModal({ ...selectedEdge }); playSound('modalOpen'); }}>
                  {copy.editEdge}
                </button>
                <button className="secondary-button small-button" type="button" style={{ color: 'var(--danger, #ef476f)' }} data-sfx-handled onClick={() => { handleDeleteEdge(selectedEdge.id); }}>
                  {copy.deleteEdge}
                </button>
              </div>
            </div>
          ) : (
            <div className="rel-panel-empty">
              <p>{copy.emptyNodes}</p>
              <p className="muted-copy">{copy.emptyHint}</p>
            </div>
          )}
        </aside>
      </section>

      {/* Node Modal */}
      {nodeModal && (
        <div className="modal-backdrop opening" role="presentation" onClick={() => setNodeModal(null)}>
          <section className="modal-card modal-surface opening" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, padding: '18px 22px', borderBottom: '1px solid var(--border)' }}>
              <h3 style={{ margin: 0, fontSize: '1.15rem' }}>{copy.editNode}</h3>
              <button className="modal-close" type="button" data-sfx-handled onClick={() => { setNodeModal(null); playSound('modalClose'); }} aria-label={copy.cancel}>×</button>
            </div>
            <div style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>{copy.nodeName}</label>
                <input
                  type="text"
                  className="tool-input"
                  value={nodeModal.name}
                  onChange={(e) => setNodeModal((m) => m && { ...m, name: e.target.value })}
                  aria-label={copy.nodeName}
                  autoFocus
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>{copy.nodeColor}</label>
                <div className="rel-color-row">
                  {PRESET_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      className={`rel-color-swatch ${nodeModal.color === c ? 'active' : ''}`}
                      style={{ background: c }}
                      data-sfx-handled
                      onClick={() => { playSound('select'); setNodeModal((m) => m && { ...m, color: c }); }}
                      aria-pressed={nodeModal.color === c}
                      aria-label={`${copy.selectColor || 'Select color'} ${c}`}
                    />
                  ))}
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>{copy.nodeAvatar}</label>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                  {nodeModal.avatarAssetId ? (
                    <>
                      <div className="rel-node-avatar-preview" style={{ background: nodeModal.color }}>
                        <img
                          src={galleryCache.current.get(nodeModal.avatarAssetId)?.dataUrl
                            || galleryImages.find((g) => g.id === nodeModal.avatarAssetId)?.dataUrl
                            || ''}
                          alt=""
                          draggable={false}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                        />
                      </div>
                      <button className="secondary-button small-button" type="button" data-sfx-handled onClick={() => setAvatarPickerOpen(true)}>
                        {copy.selectAvatar}
                      </button>
                      <button className="secondary-button small-button" type="button" data-sfx-handled onClick={() => setNodeModal((m) => m && { ...m, avatarAssetId: undefined })}>
                        {copy.clearAvatar}
                      </button>
                    </>
                  ) : (
                    <button className="secondary-button small-button" type="button" data-sfx-handled onClick={() => setAvatarPickerOpen(true)}>
                      {copy.fromAssetGallery}
                    </button>
                  )}
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>{copy.nodeNotes}</label>
                <textarea
                  className="tool-input"
                  rows={3}
                  value={nodeModal.notes}
                  onChange={(e) => setNodeModal((m) => m && { ...m, notes: e.target.value })}
                  aria-label={copy.nodeNotes}
                />
              </div>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 6 }}>
                <button className="secondary-button small-button" type="button" data-sfx-handled onClick={() => { setNodeModal(null); playSound('modalClose'); }}>{copy.cancel}</button>
                <button className="primary-button small-button" type="button" data-sfx-handled onClick={handleSaveNode}>{copy.save}</button>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* Edge Modal */}
      {edgeModal && (
        <div className="modal-backdrop opening" role="presentation" onClick={() => setEdgeModal(null)}>
          <section className="modal-card modal-surface opening" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, padding: '18px 22px', borderBottom: '1px solid var(--border)' }}>
              <h3 style={{ margin: 0, fontSize: '1.15rem' }}>{copy.editEdge}</h3>
              <button className="modal-close" type="button" data-sfx-handled onClick={() => { setEdgeModal(null); playSound('modalClose'); }} aria-label={copy.cancel}>×</button>
            </div>
            <div style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>{copy.edgeType}</label>
                <div className="rel-edge-type-row">
                  {(Object.keys(EDGE_COLORS) as EdgeType[]).map((t) => (
                    <button
                      key={t}
                      type="button"
                      className={`rel-edge-type-chip ${edgeModal.type === t ? 'active' : ''}`}
                      data-sfx-handled
                      onClick={() => { playSound('select'); setEdgeModal((m) => m && { ...m, type: t }); }}
                      aria-pressed={edgeModal.type === t}
                    >
                      <span className="rel-edge-dot" style={{ background: EDGE_COLORS[t] }} />
                      {getEdgeTypeLabel(language, t)}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>{copy.edgeLabel}</label>
                <input
                  type="text"
                  className="tool-input"
                  value={edgeModal.label}
                  onChange={(e) => setEdgeModal((m) => m && { ...m, label: e.target.value })}
                  placeholder={copy.edgeLabelPlaceholder}
                  aria-label={copy.edgeLabel}
                  autoFocus
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>{copy.edgeNotes}</label>
                <textarea
                  className="tool-input"
                  rows={3}
                  value={edgeModal.notes}
                  onChange={(e) => setEdgeModal((m) => m && { ...m, notes: e.target.value })}
                  aria-label={copy.edgeNotes}
                />
              </div>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 6 }}>
                <button className="secondary-button small-button" type="button" data-sfx-handled onClick={() => { setEdgeModal(null); playSound('modalClose'); }}>{copy.cancel}</button>
                <button className="primary-button small-button" type="button" data-sfx-handled onClick={handleSaveEdge}>{copy.save}</button>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* Avatar Picker Modal */}
      {avatarPickerOpen && (
        <div className="modal-backdrop opening" role="presentation" onClick={() => setAvatarPickerOpen(false)}>
          <section className="modal-card modal-surface opening" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 'min(600px, 94vw)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, padding: '18px 22px', borderBottom: '1px solid var(--border)' }}>
              <h3 style={{ margin: 0, fontSize: '1.15rem' }}>{copy.selectAvatar}</h3>
              <button className="modal-close" type="button" data-sfx-handled onClick={() => { setAvatarPickerOpen(false); playSound('modalClose'); }} aria-label={copy.cancel}>×</button>
            </div>
            <div style={{ padding: 22, maxHeight: 'min(420px, 60vh)', overflow: 'auto' }}>
              {galleryImages.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                  <p>{copy.noImagesInGallery}</p>
                  <p className="tiny-copy">{copy.importImagesFirst}</p>
                </div>
              ) : (
                <div className="rel-avatar-grid">
                  {galleryImages.map((img) => (
                    <button
                      key={img.id}
                      type="button"
                      className="rel-avatar-item"
                      data-sfx-handled
                      aria-label={img.name}
                      onClick={() => {
                        setNodeModal((m) => m && { ...m, avatarAssetId: img.id });
                        setAvatarPickerOpen(false);
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
    </main>
  );
}
