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

// ─── Data models ───
type ArcType = 'positive' | 'negative' | 'flat' | 'transformation';

interface ArcStage {
  id: string;
  title: string;
  description: string;
  beliefs: string;
  flaws: string;
  goals: string;
  events: string;
  emotionalState: string;
}

interface CharacterArc {
  id: string;
  name: string;
  characterName: string;
  arcType: ArcType;
  theme: string;
  stages: ArcStage[];
  createdAt: string;
  updatedAt: string;
}

interface CardData {
  name: string;
  alias: string;
  bio: string;
}

// ─── Localization ───
const UI_COPY: Record<string, Record<string, string>> = {
  zh: {
    newArc: '新建弧线',
    arcName: '弧线名称',
    characterName: '角色名称',
    selectType: '选择弧线类型',
    theme: '主题',
    typePositive: '积极成长',
    typePositiveDesc: '角色克服困难，实现自我提升与蜕变',
    typeNegative: '堕落弧线',
    typeNegativeDesc: '角色被欲望或恐惧吞噬，走向衰败',
    typeFlat: '平坦弧线',
    typeFlatDesc: '角色本身不变，但改变了周围的世界',
    typeTransformation: '蜕变弧线',
    typeTransformationDesc: '角色经历根本性改变，成为另一个人',
    stageTitle: '阶段标题',
    stageDescription: '阶段描述',
    beliefs: '核心信念',
    flaws: '缺陷与盲点',
    goals: '目标与动机',
    events: '关键事件',
    emotionalState: '情绪状态',
    addStage: '添加阶段',
    deleteStage: '删除阶段',
    reorderStage: '调整顺序',
    moveUp: '上移',
    moveDown: '下移',
    noAvailableChars: '暂无可用角色',
    exportMarkdown: '导出 Markdown',
    copy: '复制',
    copied: '已复制',
    copyFailed: '复制失败，请手动复制',
    close: '关闭',
    emptyArcList: '暂无成长弧线',
    emptyStageList: '暂无阶段，点击上方按钮添加',
    emptyTheme: '（未指定）',
    progress: '进度',
    history: '历史记录',
    noHistory: '暂无历史记录',
    deleteConfirm: '确定要删除这条成长弧线吗？',
    saveFailed: '保存失败：浏览器存储配额已满',
    untitled: '未命名弧线',
    back: '返回',
    help: '帮助',
    settings: '设置',
    selectCharacter: '选择已有角色',
    or: '或',
    clearAll: '清空全部',
    confirmClear: '确定要清空所有阶段内容吗？',
    exportTitle: '导出成长弧线',
    copySuffix: '的成长弧线',
    useApiKey: '使用 API Key 生成更精准的阶段建议',
    aiSuggest: 'AI 建议',
    aiSuggestDesc: '基于角色信息生成阶段内容建议',
    aiSuggestFailed: 'AI 建议生成失败，请检查 API 设置或稍后重试',
    generating: '生成中…',
    stageCount: '阶段',
    completed: '已完成',
    of: '/',
  },
  ja: {
    newArc: '新規アーク',
    arcName: 'アーク名',
    characterName: 'キャラ名',
    selectType: 'アークタイプ選択',
    theme: 'テーマ',
    typePositive: 'ポジティブ成長',
    typePositiveDesc: 'キャラが困難を克服し、自己向上と変容を遂げる',
    typeNegative: '堕落アーク',
    typeNegativeDesc: 'キャラが欲望や恐怖に飲まれ、衰退へ向かう',
    typeFlat: 'フラットアーク',
    typeFlatDesc: 'キャラ自体は変わらず、周囲の世界を変える',
    typeTransformation: '変容アーク',
    typeTransformationDesc: 'キャラが根本的な変化を経験し、別人となる',
    stageTitle: 'ステージタイトル',
    stageDescription: 'ステージ説明',
    beliefs: '核心信念',
    flaws: '欠点と盲点',
    goals: '目標と動機',
    events: '重要イベント',
    emotionalState: '感情状態',
    addStage: 'ステージ追加',
    deleteStage: 'ステージ削除',
    reorderStage: '順序変更',
    moveUp: '上へ',
    moveDown: '下へ',
    noAvailableChars: '既存キャラはありません',
    exportMarkdown: 'Markdown出力',
    copy: 'コピー',
    copied: 'コピー完了',
    copyFailed: 'コピーに失敗しました。手動でコピーしてください。',
    close: '閉じる',
    emptyArcList: '成長アークはありません',
    emptyStageList: 'ステージがありません。上のボタンで追加してください。',
    emptyTheme: '（未指定）',
    progress: '進捗',
    history: '履歴',
    noHistory: '履歴はありません',
    deleteConfirm: 'この成長アークを削除しますか？',
    saveFailed: '保存失敗：ブラウザのストレージ容量が不足しています',
    untitled: '無名アーク',
    back: '戻る',
    help: 'ヘルプ',
    settings: '設定',
    selectCharacter: '既存キャラを選択',
    or: 'または',
    clearAll: '全てクリア',
    confirmClear: '全ステージの内容を削除しますか？',
    exportTitle: '成長アーク出力',
    copySuffix: 'の成長アーク',
    useApiKey: 'API Key を使ってより正確なステージ案を生成',
    aiSuggest: 'AI提案',
    aiSuggestDesc: 'キャラ情報からステージ内容案を生成',
    aiSuggestFailed: 'AI提案の生成に失敗しました。API設定を確認するか、後で再試行してください。',
    generating: '生成中…',
    stageCount: 'ステージ',
    completed: '完了',
    of: '/',
  },
  en: {
    newArc: 'New Arc',
    arcName: 'Arc Name',
    characterName: 'Character Name',
    selectType: 'Select Arc Type',
    theme: 'Theme',
    typePositive: 'Positive Growth',
    typePositiveDesc: 'The character overcomes adversity and achieves self-improvement',
    typeNegative: 'Fall Arc',
    typeNegativeDesc: 'The character is consumed by desire or fear and declines',
    typeFlat: 'Flat Arc',
    typeFlatDesc: 'The character does not change, but changes the world around them',
    typeTransformation: 'Transformation Arc',
    typeTransformationDesc: 'The character undergoes fundamental change and becomes someone else',
    stageTitle: 'Stage Title',
    stageDescription: 'Stage Description',
    beliefs: 'Core Beliefs',
    flaws: 'Flaws and Blind Spots',
    goals: 'Goals and Motivations',
    events: 'Key Events',
    emotionalState: 'Emotional State',
    addStage: 'Add Stage',
    deleteStage: 'Delete Stage',
    reorderStage: 'Reorder',
    moveUp: 'Move up',
    moveDown: 'Move down',
    noAvailableChars: 'No existing characters',
    exportMarkdown: 'Export Markdown',
    copy: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy failed. Please copy manually.',
    close: 'Close',
    emptyArcList: 'No character arcs yet',
    emptyStageList: 'No stages yet. Click the button above to add one.',
    emptyTheme: '(Not specified)',
    progress: 'Progress',
    history: 'History',
    noHistory: 'No history yet',
    deleteConfirm: 'Delete this character arc?',
    saveFailed: 'Save failed: browser storage quota exceeded',
    untitled: 'Unnamed Arc',
    back: 'Back',
    help: 'Help',
    settings: 'Settings',
    selectCharacter: 'Select Existing Character',
    or: 'or',
    clearAll: 'Clear All',
    confirmClear: 'Clear all stage content?',
    exportTitle: 'Export Arc',
    copySuffix: "'s Character Arc",
    useApiKey: 'Use API Key for more accurate stage suggestions',
    aiSuggest: 'AI Suggest',
    aiSuggestDesc: 'Generate stage content suggestions based on character info',
    aiSuggestFailed: 'AI suggestion failed. Please check API settings or try again later.',
    generating: 'Generating…',
    stageCount: 'Stage',
    completed: 'Completed',
    of: '/',
  },
  ru: {
    newArc: 'Новая дуга',
    arcName: 'Название дуги',
    characterName: 'Имя персонажа',
    selectType: 'Выберите тип дуги',
    theme: 'Тема',
    typePositive: 'Позитивный рост',
    typePositiveDesc: 'Персонаж преодолевает трудности и достигает самосовершенствования',
    typeNegative: 'Дуга падения',
    typeNegativeDesc: 'Персонаж поглощается желанием или страхом и приходит в упадок',
    typeFlat: 'Плоская дуга',
    typeFlatDesc: 'Персонаж не меняется, но меняет мир вокруг себя',
    typeTransformation: 'Дуга трансформации',
    typeTransformationDesc: 'Персонаж претерпевает коренные изменения и становится другим человеком',
    stageTitle: 'Название этапа',
    stageDescription: 'Описание этапа',
    beliefs: 'Основные убеждения',
    flaws: 'Недостатки и слепые зоны',
    goals: 'Цели и мотивация',
    events: 'Ключевые события',
    emotionalState: 'Эмоциональное состояние',
    addStage: 'Добавить этап',
    deleteStage: 'Удалить этап',
    reorderStage: 'Изменить порядок',
    moveUp: 'Вверх',
    moveDown: 'Вниз',
    noAvailableChars: 'Нет существующих персонажей',
    exportMarkdown: 'Экспорт в Markdown',
    copy: 'Копировать',
    copied: 'Скопировано',
    copyFailed: 'Не удалось скопировать. Скопируйте вручную.',
    close: 'Закрыть',
    emptyArcList: 'Дуг развития пока нет',
    emptyStageList: 'Этапов пока нет. Нажмите кнопку выше, чтобы добавить.',
    emptyTheme: '(Не указана)',
    progress: 'Прогресс',
    history: 'История',
    noHistory: 'История пуста',
    deleteConfirm: 'Удалить эту дугу развития?',
    saveFailed: 'Ошибка сохранения: превышена квота хранилища браузера',
    untitled: 'Безымянная дуга',
    back: 'Назад',
    help: 'Справка',
    settings: 'Настройки',
    selectCharacter: 'Выбрать существующего персонажа',
    or: 'или',
    clearAll: 'Очистить всё',
    confirmClear: 'Очистить содержимое всех этапов?',
    exportTitle: 'Экспорт дуги',
    copySuffix: ' — дуга развития',
    useApiKey: 'Используйте API Key для более точных предложений',
    aiSuggest: 'Предложение ИИ',
    aiSuggestDesc: 'Сгенерировать варианты содержания этапа на основе информации о персонаже',
    aiSuggestFailed: 'Не удалось сгенерировать предложение ИИ. Проверьте настройки API или повторите попытку позже.',
    generating: 'Генерация…',
    stageCount: 'Этап',
    completed: 'Завершено',
    of: '/',
  },
  ko: {
    newArc: '새 아크',
    arcName: '아크 이름',
    characterName: '캐릭터 이름',
    selectType: '아크 타입 선택',
    theme: '테마',
    typePositive: '긍정적 성장',
    typePositiveDesc: '캐릭터가 역경을 극복하고 자기계발을 이룹니다',
    typeNegative: '타락 아크',
    typeNegativeDesc: '캐릭터가 욕망이나 공포에 삼켜져 쇠퇴합니다',
    typeFlat: '플랫 아크',
    typeFlatDesc: '캐릭터 자신은 변하지 않고 주변 세계를 바꿉니다',
    typeTransformation: '변신 아크',
    typeTransformationDesc: '캐릭터가 근본적인 변화를 겪어 다른 사람이 됩니다',
    stageTitle: '단계 제목',
    stageDescription: '단계 설명',
    beliefs: '핵심 신념',
    flaws: '결점과 맹점',
    goals: '목표와 동기',
    events: '핵심 사건',
    emotionalState: '감정 상태',
    addStage: '단계 추가',
    deleteStage: '단계 삭제',
    reorderStage: '순서 조정',
    moveUp: '위로',
    moveDown: '아래로',
    noAvailableChars: '기존 캐릭터가 없습니다',
    exportMarkdown: 'Markdown 납볼',
    copy: '복사',
    copied: '복사 완료',
    copyFailed: '복사 실패. 수동으로 복사해 주세요.',
    close: '닫기',
    emptyArcList: '성장 아크가 없습니다',
    emptyStageList: '단계가 없습니다. 위 버튼을 클릭하여 추가하세요.',
    emptyTheme: '(미지정)',
    progress: '진행률',
    history: '기록',
    noHistory: '기록이 없습니다',
    deleteConfirm: '이 성장 아크를 삭제하시겠습니까?',
    saveFailed: '저장 실패: 브라우저 저장소 용량 초과',
    untitled: '무명 아크',
    back: '뒤로',
    help: '도움말',
    settings: '설정',
    selectCharacter: '기존 캐릭터 선택',
    or: '또는',
    clearAll: '전체 삭제',
    confirmClear: '모든 단계 내용을 삭제하시겠습니까?',
    exportTitle: '아크 납볼',
    copySuffix: '의 성장 아크',
    useApiKey: 'API Key를 사용하여 더 정확한 단계 제안 생성',
    aiSuggest: 'AI 제안',
    aiSuggestDesc: '캐릭터 정보를 바탕으로 단계 내용 제안 생성',
    aiSuggestFailed: 'AI 제안 생성에 실패했습니다. API 설정을 확인하거나 나중에 다시 시도하세요.',
    generating: '생성 중…',
    stageCount: '단계',
    completed: '완료',
    of: '/',
  },
};

// ─── Arc type presets ───
const ARC_TYPE_PRESETS: Record<ArcType, { color: string; stages: Array<{ title: string; description: string }> }> = {
  positive: {
    color: '#28a050',
    stages: [
      { title: 'Starting Point', description: 'The character lives with flaws and blind spots' },
      { title: 'Catalyst', description: 'A key event that breaks balance and forces the character to face their problems' },
      { title: 'Struggle', description: 'The character tries to solve new problems with old methods and faces setbacks' },
      { title: 'Crisis', description: 'All hope seems lost as the character hits rock bottom' },
      { title: 'Transformation', description: 'The character accepts the truth and overcomes challenges in a new way' },
    ],
  },
  negative: {
    color: '#c03030',
    stages: [
      { title: 'Starting Point', description: 'The character has a bright future but hides a fatal flaw' },
      { title: 'Temptation', description: 'The character faces a shortcut or temptation that violates their principles' },
      { title: 'Compromise', description: 'The character begins making excuses for their desires, crossing boundaries step by step' },
      { title: 'Corruption', description: 'The character completely abandons their original ideals and loses something precious' },
      { title: 'Destruction', description: 'The character pays the ultimate price for their choices' },
    ],
  },
  flat: {
    color: '#3070c0',
    stages: [
      { title: 'Starting Point', description: 'The character already holds firm core beliefs' },
      { title: 'Challenge', description: 'The external world questions the character\'s beliefs' },
      { title: 'Perseverance', description: 'The character holds to their beliefs under pressure, paying a price' },
      { title: 'Influence', description: 'The character\'s persistence begins to change those around them' },
      { title: 'Victory', description: 'The character\'s beliefs are ultimately proven correct' },
    ],
  },
  transformation: {
    color: '#a050c0',
    stages: [
      { title: 'Starting Point', description: 'The character is bound by an identity, belief, or way of life' },
      { title: 'Awakening', description: 'The character realizes the old life no longer suits them' },
      { title: 'Conflict', description: 'An intense internal struggle between the old and new self' },
      { title: 'Choice', description: 'The character must completely abandon the old self and embrace the new' },
      { title: 'Rebirth', description: 'The character faces the world with a new identity and perspective' },
    ],
  },
};

// ─── Utils ───
const STORAGE_KEY = 'oc-maker.character-arc';

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function loadArcs(): CharacterArc[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown[];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((item): CharacterArc | null => {
        if (!item || typeof item !== 'object') return null;
        const s = item as Record<string, unknown>;
        const stagesRaw = Array.isArray(s.stages) ? s.stages : [];
        const stages = stagesRaw
          .map((st): ArcStage | null => {
            if (!st || typeof st !== 'object') return null;
            const r = st as Record<string, unknown>;
            return {
              id: typeof r.id === 'string' && r.id ? r.id : uid(),
              title: typeof r.title === 'string' ? r.title : '',
              description: typeof r.description === 'string' ? r.description : '',
              beliefs: typeof r.beliefs === 'string' ? r.beliefs : '',
              flaws: typeof r.flaws === 'string' ? r.flaws : '',
              goals: typeof r.goals === 'string' ? r.goals : '',
              events: typeof r.events === 'string' ? r.events : '',
              emotionalState: typeof r.emotionalState === 'string' ? r.emotionalState : '',
            };
          })
          .filter((x): x is ArcStage => x !== null);
        const validTypes: ArcType[] = ['positive', 'negative', 'flat', 'transformation'];
        return {
          id: typeof s.id === 'string' && s.id ? s.id : uid(),
          name: typeof s.name === 'string' ? s.name : '',
          characterName: typeof s.characterName === 'string' ? s.characterName : '',
          arcType: validTypes.includes(s.arcType as ArcType) ? (s.arcType as ArcType) : 'positive',
          theme: typeof s.theme === 'string' ? s.theme : '',
          stages,
          createdAt: typeof s.createdAt === 'string' ? s.createdAt : new Date().toISOString(),
          updatedAt: typeof s.updatedAt === 'string' ? s.updatedAt : new Date().toISOString(),
        };
      })
      .filter((x): x is CharacterArc => x !== null);
  } catch {
    return [];
  }
}

function saveArcs(arcs: CharacterArc[]): boolean {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(arcs));
    return true;
  } catch {
    return false;
  }
}

function loadCharacters(): { name: string; info: string }[] {
  try {
    const raw = window.localStorage.getItem('oc-maker.character-card');
    if (!raw) return [];
    const data = JSON.parse(raw) as unknown;
    if (!data || typeof data !== 'object' || Array.isArray(data)) return [];
    const card = data as CardData;
    const infoParts: string[] = [];
    if (card.bio) infoParts.push(card.bio);
    return [{ name: card.name || 'Unnamed', info: infoParts.join('\n') }];
  } catch {
    return [];
  }
}

function createDefaultStages(type: ArcType): ArcStage[] {
  return ARC_TYPE_PRESETS[type].stages.map((s, i) => ({
    id: uid(),
    title: s.title,
    description: s.description,
    beliefs: '',
    flaws: '',
    goals: '',
    events: '',
    emotionalState: '',
  }));
}

function createArc(type: ArcType, name: string, characterName: string, theme: string): CharacterArc {
  return {
    id: uid(),
    name: name.trim() || 'Unnamed Arc',
    characterName: characterName.trim() || 'Unnamed Character',
    arcType: type,
    theme: theme.trim(),
    stages: createDefaultStages(type),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

async function generateAiSuggestion(
  characterInfo: string,
  stageTitle: string,
  arcType: string,
  apiKey: string,
  apiBaseUrl: string,
  model: string,
  temperature: number,
  maxTokens: number,
): Promise<string> {
  const system =
    'You are an expert character development writer. Given a character\'s background info, an arc stage title, and arc type, write a compelling stage description (2-4 sentences, in the same language as the stage title). Focus on the character\'s internal journey, conflicts, and emotional shifts.';
  const prompt = `Character info:\n${characterInfo || 'No additional info'}\n\nArc type: ${arcType}\nStage title: ${stageTitle}\n\nWrite the stage description:`;
  try {
    const res = await fetch(`${apiBaseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: prompt },
        ],
        temperature,
        max_tokens: maxTokens,
      }),
    });
    if (!res.ok) throw new Error('API error');
    const data = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
    return data.choices?.[0]?.message?.content?.trim() || '';
  } catch {
    return '';
  }
}

function useBeforeUnloadGuard(isDirty: boolean) {
  useEffect(() => {
    if (!isDirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isDirty]);
}

// ─── Component ───
export default function CharacterArcPage({
  settings,
  language,
  onBack,
  onOpenSettings,
  onOpenDocs,
  pageTitle,
  pageDescription,
}: SharedPageProps) {
  const copy = UI_COPY[language] ?? UI_COPY.en;
  const [arcs, setArcs] = useState<CharacterArc[]>(loadArcs);
  const [activeArcId, setActiveArcId] = useState<string | null>(null);
  const [showSetup, setShowSetup] = useState(true);
  const [arcName, setArcName] = useState('');
  const [characterName, setCharacterName] = useState('');
  const [theme, setTheme] = useState('');
  const [selectedType, setSelectedType] = useState<ArcType>('positive');
  const [availableChars, setAvailableChars] = useState<{ name: string; info: string }[]>([]);
  const [saveToast, setSaveToast] = useState('');
  const [copied, setCopied] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const copyTimerRef = useRef<number | null>(null);
  const saveTimerRef = useRef<number | null>(null);
  const mountedRef = useRef(true);
  const savedSnapshotRef = useRef<string>(JSON.stringify(loadArcs()));

  const maybeConfirm = useCallback(
    (message: string, action: () => void) => {
      if (!settings.others.confirmDestructiveActions || window.confirm(message)) {
        action();
      }
    },
    [settings.others.confirmDestructiveActions]
  );

  const persistArcs = useCallback((next: CharacterArc[]): boolean => {
    const ok = saveArcs(next);
    if (ok) {
      savedSnapshotRef.current = JSON.stringify(next);
    }
    return ok;
  }, []);

  const activeArc = useMemo(() => arcs.find((a) => a.id === activeArcId) ?? null, [arcs, activeArcId]);

  const getArcTypeLabel = useCallback((type: ArcType) => {
    switch (type) {
      case 'positive': return copy.typePositive;
      case 'negative': return copy.typeNegative;
      case 'flat': return copy.typeFlat;
      case 'transformation': return copy.typeTransformation;
      default: return type;
    }
  }, [copy.typePositive, copy.typeNegative, copy.typeFlat, copy.typeTransformation]);

  useEffect(() => {
    setAvailableChars(loadCharacters());
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const hasUnsaved = useMemo(() => {
    if (showSetup) {
      return arcName.trim().length > 0 || characterName.trim().length > 0 || theme.trim().length > 0;
    }
    return JSON.stringify(arcs) !== savedSnapshotRef.current;
  }, [showSetup, arcName, characterName, theme, arcs]);
  useBeforeUnloadGuard(hasUnsaved);

  useEffect(() => {
    if (saveToast) {
      if (saveTimerRef.current) window.clearTimeout(saveTimerRef.current);
      saveTimerRef.current = window.setTimeout(() => setSaveToast(''), 3000);
    }
    return () => {
      if (saveTimerRef.current) window.clearTimeout(saveTimerRef.current);
    };
  }, [saveToast]);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current) window.clearTimeout(copyTimerRef.current);
      if (saveTimerRef.current) window.clearTimeout(saveTimerRef.current);
    };
  }, []);

  const topModalRef = useRef<'export' | 'history' | null>(null);
  useEffect(() => {
    if (showExport) topModalRef.current = 'export';
    else if (showHistory) topModalRef.current = 'history';
    else topModalRef.current = null;
  }, [showExport, showHistory]);

  useEffect(() => {
    if (!showExport && !showHistory) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        if (topModalRef.current === 'export') setShowExport(false);
        else if (topModalRef.current === 'history') setShowHistory(false);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [showExport, showHistory]);

  const startArc = useCallback(() => {
    if (isCreating) return;
    setIsCreating(true);
    const name = arcName.trim() || copy.untitled;
    const arc = createArc(selectedType, name, characterName, theme);
    const next = [arc, ...arcs];
    if (!persistArcs(next)) {
      setSaveToast(copy.saveFailed);
      playSound('error');
      setIsCreating(false);
      return;
    }
    setArcs(next);
    setActiveArcId(arc.id);
    setShowSetup(false);
    setIsCreating(false);
    playSound('confirm');
  }, [arcName, characterName, theme, selectedType, arcs, isCreating, copy.untitled, copy.saveFailed]);

  const updateStage = useCallback(
    (arcId: string, stageId: string, field: keyof ArcStage, value: string) => {
      const next = arcs.map((a) => {
        if (a.id !== arcId) return a;
        return {
          ...a,
          stages: a.stages.map((s) => (s.id === stageId ? { ...s, [field]: value } : s)),
          updatedAt: new Date().toISOString(),
        };
      });
      if (!persistArcs(next)) {
        setSaveToast(copy.saveFailed);
        playSound('error');
        return;
      }
      setArcs(next);
    },
    [arcs, copy.saveFailed]
  );

  const handleAiSuggest = useCallback(
    async (arcId: string, stageId: string) => {
      const arc = arcs.find((a) => a.id === arcId);
      if (!arc) return;
      const stage = arc.stages.find((s) => s.id === stageId);
      if (!stage) return;
      setGeneratingId(stageId);
      const suggestion = await generateAiSuggestion(
        arc.characterName + '\n' + arc.theme,
        stage.title,
        arc.arcType,
        settings.apiKey,
        settings.apiBaseUrl || 'https://api.openai.com/v1',
        settings.llm?.model || 'gpt-4',
        settings.llm?.temperature ?? 0.85,
        settings.llm?.maxTokens ?? 150,
      );
      if (mountedRef.current) {
        setGeneratingId(null);
        if (suggestion) {
          updateStage(arcId, stageId, 'description', suggestion);
          playSound('success');
        } else {
          setSaveToast(copy.aiSuggestFailed);
          playSound('error');
        }
      }
    },
    [arcs, settings.apiKey, settings.apiBaseUrl, updateStage]
  );

  const exportMarkdown = useCallback(
    (arc: CharacterArc) => {
      const lines: string[] = [
        `# ${arc.characterName}${copy.copySuffix}: ${arc.name}`,
        '',
        `**Type:** ${arc.arcType}`,
        `**Theme:** ${arc.theme || copy.emptyTheme}`,
        `**Date:** ${new Date(arc.createdAt).toLocaleDateString()}`,
        '',
        '---',
        '',
      ];
      arc.stages.forEach((s, i) => {
        lines.push(`## ${copy.stageCount} ${i + 1}: ${s.title}`);
        if (s.description) {
          lines.push(s.description);
          lines.push('');
        }
        if (s.beliefs) lines.push(`**${copy.beliefs}:** ${s.beliefs}`);
        if (s.flaws) lines.push(`**${copy.flaws}:** ${s.flaws}`);
        if (s.goals) lines.push(`**${copy.goals}:** ${s.goals}`);
        if (s.events) lines.push(`**${copy.events}:** ${s.events}`);
        if (s.emotionalState) lines.push(`**${copy.emotionalState}:** ${s.emotionalState}`);
        lines.push('');
      });
      return lines.join('\n');
    },
    [copy]
  );

  const handleCopy = useCallback(() => {
    if (!activeArc) return;
    navigator.clipboard.writeText(exportMarkdown(activeArc))
      .then(() => {
        if (!mountedRef.current) return;
        setCopied(true);
        playSound('copySound');
        if (copyTimerRef.current) window.clearTimeout(copyTimerRef.current);
        copyTimerRef.current = window.setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        if (!mountedRef.current) return;
        setSaveToast(copy.copyFailed);
        playSound('error');
      });
  }, [activeArc, exportMarkdown, copy.copyFailed]);

  const handleDeleteArc = useCallback(
    (id: string) => {
      maybeConfirm(copy.deleteConfirm, () => {
        const next = arcs.filter((a) => a.id !== id);
        if (!persistArcs(next)) {
          setSaveToast(copy.saveFailed);
          playSound('error');
          return;
        }
        setArcs(next);
        if (activeArcId === id) {
          setActiveArcId(null);
          setShowSetup(true);
        }
        playSound('deleteSound');
      });
    },
    [activeArcId, arcs, copy.deleteConfirm, copy.saveFailed, maybeConfirm]
  );

  const handleClearAll = useCallback(() => {
    if (!activeArc) return;
    maybeConfirm(copy.confirmClear, () => {
      const next = arcs.map((a) =>
        a.id === activeArc.id
          ? {
              ...a,
              stages: a.stages.map((s) => ({
                ...s,
                description: '',
                beliefs: '',
                flaws: '',
                goals: '',
                events: '',
                emotionalState: '',
              })),
              updatedAt: new Date().toISOString(),
            }
          : a
      );
      if (!persistArcs(next)) {
        setSaveToast(copy.saveFailed);
        playSound('error');
        return;
      }
      setArcs(next);
      playSound('resetSound');
    });
  }, [activeArc, arcs, copy.confirmClear, copy.saveFailed, maybeConfirm]);

  const handleAddStage = useCallback(() => {
    if (!activeArc) return;
    const next = arcs.map((a) => {
      if (a.id !== activeArc.id) return a;
      return {
        ...a,
        stages: [
          ...a.stages,
          { id: uid(), title: `${copy.stageCount} ${a.stages.length + 1}`, description: '', beliefs: '', flaws: '', goals: '', events: '', emotionalState: '' },
        ],
        updatedAt: new Date().toISOString(),
      };
    });
    if (!persistArcs(next)) {
      setSaveToast(copy.saveFailed);
      playSound('error');
      return;
    }
    setArcs(next);
    playSound('confirm');
  }, [activeArc, arcs, copy.stageCount, copy.saveFailed]);

  const handleDeleteStage = useCallback(
    (stageId: string) => {
      if (!activeArc) return;
      maybeConfirm(copy.deleteConfirm, () => {
        const next = arcs.map((a) => {
          if (a.id !== activeArc.id) return a;
          return {
            ...a,
            stages: a.stages.filter((s) => s.id !== stageId),
            updatedAt: new Date().toISOString(),
          };
        });
        if (!persistArcs(next)) {
          setSaveToast(copy.saveFailed);
          playSound('error');
          return;
        }
        setArcs(next);
        playSound('deleteSound');
      });
    },
    [activeArc, arcs, copy.deleteConfirm, copy.saveFailed, maybeConfirm]
  );

  const handleMoveStage = useCallback(
    (stageId: string, direction: 'up' | 'down') => {
      if (!activeArc) return;
      const idx = activeArc.stages.findIndex((s) => s.id === stageId);
      if (idx < 0) return;
      const newIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (newIdx < 0 || newIdx >= activeArc.stages.length) return;
      const next = arcs.map((a) => {
        if (a.id !== activeArc.id) return a;
        const stages = [...a.stages];
        const temp = stages[idx];
        stages[idx] = stages[newIdx];
        stages[newIdx] = temp;
        return { ...a, stages, updatedAt: new Date().toISOString() };
      });
      if (!persistArcs(next)) {
        setSaveToast(copy.saveFailed);
        playSound('error');
        return;
      }
      setArcs(next);
      playSound('select');
    },
    [activeArc, arcs, copy.saveFailed]
  );

  const completedCount = activeArc ? activeArc.stages.filter((s) => s.description.trim()).length : 0;
  const totalCount = activeArc ? activeArc.stages.length : 0;

  return (
    <div className="editor-layout arc-layout">
      {/* Sidebar */}
      <aside className="editor-sidebar">
        <div className="editor-panel-block">
          <div className="page-header-row" style={{ marginBottom: 16 }}>
            <div>
              <h2 className="page-title">{pageTitle}</h2>
              <p className="page-subtitle">{pageDescription}</p>
            </div>
            <div className="page-header-actions">
              {onOpenDocs && (
                <button
                  className="secondary-button small-button"
                  type="button"
                  aria-label={copy.help}
                  data-sfx-handled
                  onClick={() => { playSound('buttonClick'); onOpenDocs('character-arc'); }}
                >
                  ?
                </button>
              )}
              <button
                className="secondary-button small-button"
                type="button"
                aria-label={copy.settings}
                data-sfx-handled
                onClick={() => { playSound('buttonClick'); onOpenSettings(); }}
              >
                ⚙
              </button>
              <button
                className="secondary-button small-button"
                type="button"
                aria-label={copy.back}
                data-sfx-handled
                onClick={() => { playSound('back'); onBack(); }}
              >
                ←
              </button>
            </div>
          </div>

          {showSetup && (
            <div className="arc-setup">
              <h3 className="scene-section-title">{copy.newArc}</h3>

              <div className="arc-character-section">
                <h4 className="arc-section-label">{copy.selectCharacter}</h4>
                {availableChars.length > 0 ? (
                  <div className="arc-char-list">
                    {availableChars.map((c, i) => (
                      <button
                        key={i}
                        className={`choice-chip ${characterName === c.name ? 'active' : ''}`}
                        type="button"
                        data-sfx-handled
                        onClick={() => {
                          playSound('select');
                          setCharacterName(c.name);
                        }}
                      >
                        {c.name}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="muted-copy">{copy.noAvailableChars}</p>
                )}
                <p className="arc-or">{copy.or}</p>
                <input
                  className="scene-input"
                  type="text"
                  placeholder={copy.characterName}
                  aria-label={copy.characterName}
                  maxLength={100}
                  value={characterName}
                  onChange={(e) => setCharacterName(e.target.value)}
                />
              </div>

              <input
                className="scene-input"
                type="text"
                placeholder={copy.arcName}
                aria-label={copy.arcName}
                maxLength={100}
                value={arcName}
                onChange={(e) => setArcName(e.target.value)}
                style={{ marginTop: 8 }}
              />

              <input
                className="scene-input"
                type="text"
                placeholder={copy.theme}
                aria-label={copy.theme}
                maxLength={200}
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                style={{ marginTop: 8 }}
              />

              <div className="arc-type-section">
                <h4 className="arc-section-label">{copy.selectType}</h4>
                {([
                  { id: 'positive', label: copy.typePositive, desc: copy.typePositiveDesc },
                  { id: 'negative', label: copy.typeNegative, desc: copy.typeNegativeDesc },
                  { id: 'flat', label: copy.typeFlat, desc: copy.typeFlatDesc },
                  { id: 'transformation', label: copy.typeTransformation, desc: copy.typeTransformationDesc },
                ] as Array<{ id: ArcType; label: string; desc: string }>).map((t) => (
                  <button
                    key={t.id}
                    className={`arc-type-card ${selectedType === t.id ? 'active' : ''}`}
                    type="button"
                    data-sfx-handled
                    onClick={() => {
                      playSound(selectedType === t.id ? 'deselect' : 'select');
                      setSelectedType(t.id);
                    }}
                  >
                    <div className="arc-type-title">{t.label}</div>
                    <div className="arc-type-desc">{t.desc}</div>
                  </button>
                ))}
              </div>

              <button
                className="primary-button"
                type="button"
                data-sfx-handled
                disabled={isCreating}
                style={{ width: '100%', marginTop: 12 }}
                onClick={startArc}
              >
                {copy.newArc}
              </button>

              {arcs.length > 0 && (
                <button
                  className="secondary-button"
                  type="button"
                  data-sfx-handled
                  style={{ width: '100%', marginTop: 8 }}
                  onClick={() => { playSound('modalOpen'); setShowHistory(true); }}
                >
                  {copy.history} ({arcs.length})
                </button>
              )}
            </div>
          )}

          {!showSetup && activeArc && (
            <div className="arc-active-sidebar">
              <h3 className="scene-section-title">{activeArc.name}</h3>
              <p className="muted-copy" style={{ marginBottom: 12 }}>
                {copy.progress}: {completedCount}/{totalCount}
              </p>
              <div className="arc-progress-bar" role="progressbar" aria-valuenow={completedCount} aria-valuemin={0} aria-valuemax={totalCount} aria-label={copy.progress}>
                <div
                  className="arc-progress-fill"
                  style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
                />
              </div>
              <div className="arc-sidebar-actions">
                <button className="secondary-button small-button" type="button" data-sfx-handled onClick={handleAddStage}>
                  {copy.addStage}
                </button>
                <button
                  className="secondary-button small-button"
                  type="button"
                  data-sfx-handled
                  onClick={handleClearAll}
                >
                  {copy.clearAll}
                </button>
                <button
                  className="secondary-button small-button"
                  type="button"
                  data-sfx-handled
                  onClick={() => { playSound('modalOpen'); setShowExport(true); }}
                >
                  {copy.exportMarkdown}
                </button>
              </div>
              <button
                className="back-link"
                type="button"
                data-sfx-handled
                onClick={() => {
                  playSound('back');
                  setShowSetup(true);
                  setActiveArcId(null);
                  setArcName('');
                  setCharacterName('');
                  setTheme('');
                }}
              >
                {copy.newArc}
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main */}
      <main className="editor-main-panel">
        {activeArc ? (
          <div className="arc-stage-list">
            {activeArc.stages.length === 0 ? (
              <div className="scene-empty-state">
                <div className="scene-empty-icon" aria-hidden="true">📈</div>
                <p className="muted-copy">{copy.emptyStageList}</p>
              </div>
            ) : (
            activeArc.stages.map((stage, idx) => (
              <div key={stage.id} className={`arc-stage-card ${stage.description.trim() ? 'completed' : ''}`}>
                <div className="arc-stage-header">
                  <span className="arc-stage-num">{idx + 1}</span>
                  <input
                    className="arc-stage-title-input"
                    type="text"
                    aria-label={`${copy.stageTitle} ${idx + 1}`}
                    maxLength={100}
                    value={stage.title}
                    onChange={(e) => updateStage(activeArc.id, stage.id, 'title', e.target.value)}
                  />
                  <div className="arc-stage-actions">
                    <button
                      className="icon-button small-button"
                      type="button"
                      aria-label={copy.moveUp}
                      disabled={idx === 0}
                      data-sfx-handled
                      onClick={() => handleMoveStage(stage.id, 'up')}
                      title={copy.moveUp}
                    >
                      ↑
                    </button>
                    <button
                      className="icon-button small-button"
                      type="button"
                      aria-label={copy.moveDown}
                      disabled={idx === activeArc.stages.length - 1}
                      data-sfx-handled
                      onClick={() => handleMoveStage(stage.id, 'down')}
                      title={copy.moveDown}
                    >
                      ↓
                    </button>
                    <button
                      className="icon-button danger"
                      type="button"
                      aria-label={copy.deleteStage}
                      data-sfx-handled
                      onClick={() => handleDeleteStage(stage.id)}
                    >
                      ✕
                    </button>
                  </div>
                </div>
                <textarea
                  className="arc-textarea"
                  rows={3}
                  placeholder={copy.stageDescription}
                  aria-label={`${copy.stageDescription} ${idx + 1}`}
                  maxLength={5000}
                  value={stage.description}
                  onChange={(e) => updateStage(activeArc.id, stage.id, 'description', e.target.value)}
                />
                <div className="arc-fields-grid">
                  <input
                    className="scene-input"
                    type="text"
                    placeholder={copy.beliefs}
                    aria-label={`${copy.beliefs} ${idx + 1}`}
                    maxLength={500}
                    value={stage.beliefs}
                    onChange={(e) => updateStage(activeArc.id, stage.id, 'beliefs', e.target.value)}
                  />
                  <input
                    className="scene-input"
                    type="text"
                    placeholder={copy.flaws}
                    aria-label={`${copy.flaws} ${idx + 1}`}
                    maxLength={500}
                    value={stage.flaws}
                    onChange={(e) => updateStage(activeArc.id, stage.id, 'flaws', e.target.value)}
                  />
                  <input
                    className="scene-input"
                    type="text"
                    placeholder={copy.goals}
                    aria-label={`${copy.goals} ${idx + 1}`}
                    maxLength={500}
                    value={stage.goals}
                    onChange={(e) => updateStage(activeArc.id, stage.id, 'goals', e.target.value)}
                  />
                  <input
                    className="scene-input"
                    type="text"
                    placeholder={copy.events}
                    aria-label={`${copy.events} ${idx + 1}`}
                    maxLength={500}
                    value={stage.events}
                    onChange={(e) => updateStage(activeArc.id, stage.id, 'events', e.target.value)}
                  />
                  <input
                    className="scene-input"
                    type="text"
                    placeholder={copy.emotionalState}
                    aria-label={`${copy.emotionalState} ${idx + 1}`}
                    maxLength={500}
                    value={stage.emotionalState}
                    onChange={(e) => updateStage(activeArc.id, stage.id, 'emotionalState', e.target.value)}
                  />
                </div>
                <div className="arc-stage-footer">
                  {settings.apiKey && (
                    <button
                      className="secondary-button small-button"
                      type="button"
                      disabled={generatingId !== null}
                      data-sfx-handled
                      onClick={() => { playSound('buttonClick'); handleAiSuggest(activeArc.id, stage.id); }}
                      title={copy.aiSuggestDesc}
                    >
                      {generatingId === stage.id ? copy.generating : copy.aiSuggest}
                    </button>
                  )}
                  {!settings.apiKey && (
                    <span className="muted-copy tiny-copy">{copy.useApiKey}</span>
                  )}
                </div>
              </div>
            )))}
          </div>
        ) : (
          <div className="scene-empty-state">
            <div className="scene-empty-icon" aria-hidden="true">📈</div>
            <p>{copy.emptyArcList}</p>
          </div>
        )}
      </main>

      {/* Export Modal */}
      {showExport && activeArc && (
        <div className="modal-backdrop" role="presentation" onClick={() => setShowExport(false)}>
          <div className="modal-card modal-surface" role="dialog" aria-modal="true" aria-label={copy.exportTitle} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{copy.exportTitle}</h3>
              <button className="icon-button modal-close" type="button" aria-label={copy.close} data-sfx-handled onClick={() => setShowExport(false)}>
                ✕
              </button>
            </div>
            <div className="modal-body">
              <textarea className="scene-export-textarea" readOnly rows={16} value={exportMarkdown(activeArc)} aria-label={copy.exportTitle} />
              <div className="scene-export-actions">
                <button className="primary-button" type="button" data-sfx-handled onClick={handleCopy}>
                  {copied ? copy.copied : copy.copy}
                </button>
                <button className="secondary-button" type="button" data-sfx-handled onClick={() => { playSound('modalClose'); setShowExport(false); }}>
                  {copy.close}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* History Modal */}
      {showHistory && (
        <div className="modal-backdrop" role="presentation" onClick={() => setShowHistory(false)}>
          <div className="modal-card modal-surface" role="dialog" aria-modal="true" aria-label={copy.history} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{copy.history}</h3>
              <button className="icon-button modal-close" type="button" aria-label={copy.close} data-sfx-handled onClick={() => setShowHistory(false)}>
                ✕
              </button>
            </div>
            <div className="modal-body">
              {arcs.length === 0 ? (
                <p className="muted-copy">{copy.noHistory}</p>
              ) : (
                <div className="arc-history-list">
                  {arcs.map((a) => (
                    <div key={a.id} className="arc-history-item">
                      <button
                        className="arc-history-main"
                        type="button"
                        data-sfx-handled
                        onClick={() => {
                          playSound('buttonClick');
                          setActiveArcId(a.id);
                          setShowSetup(false);
                          setShowHistory(false);
                        }}
                      >
                        <div className="arc-history-name">{a.name}</div>
                        <div className="arc-history-meta">
                          {getArcTypeLabel(a.arcType)} · {a.stages.filter((s) => s.description.trim()).length}/{a.stages.length} · {new Date(a.updatedAt).toLocaleDateString()}
                        </div>
                      </button>
                      <button
                        className="icon-button danger"
                        type="button"
                        aria-label={copy.deleteConfirm}
                        data-sfx-handled
                        onClick={() => handleDeleteArc(a.id)}
                      >
                        🗑
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {saveToast && (
        <div className="editor-toast error" role="alert" aria-live="polite" style={{ position: 'fixed', top: 72, left: '50%', transform: 'translateX(-50%)' }}>
          {saveToast}
        </div>
      )}
    </div>
  );
}
