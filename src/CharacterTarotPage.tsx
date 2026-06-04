import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
};

// ─── Types ───
type TarotPosition = 'upright' | 'reversed';

interface TarotCardData {
  id: number;
  nameZh: string;
  nameJa: string;
  nameEn: string;
  nameRu: string;
  nameKo: string;
  keywords: string[];
  meaningUpright: string;
  meaningReversed: string;
  element: string;
}

type SpreadType = 'single' | 'three' | 'five';

interface DrawnCard {
  card: TarotCardData;
  position: TarotPosition;
  index: number;
}

interface TarotReading {
  id: string;
  characterName: string;
  spreadType: SpreadType;
  cards: DrawnCard[];
  interpretation: string;
  createdAt: string;
}

// ─── Tarot Deck (22 Major Arcana) ───
const TAROT_DECK: TarotCardData[] = [
  { id: 0, nameZh: '愚者', nameJa: '愚者', nameEn: 'The Fool', nameRu: 'Шут', nameKo: '바보', keywords: ['beginnings', 'innocence', 'spontaneity'], meaningUpright: '新的开始，无限的潜力，纯真的信任，冒险精神。', meaningReversed: '鲁莽，缺乏方向，忽视风险，不成熟。', element: 'Air' },
  { id: 1, nameZh: '魔术师', nameJa: '魔術師', nameEn: 'The Magician', nameRu: 'Маг', nameKo: '마법사', keywords: ['manifestation', 'resourcefulness', 'power'], meaningUpright: '显化力量，资源整合，创造力，自信行动。', meaningReversed: '欺骗，操纵，才能未发挥，缺乏信心。', element: 'Air' },
  { id: 2, nameZh: '女祭司', nameJa: '女教皇', nameEn: 'The High Priestess', nameRu: 'Верховная Жрица', nameKo: '여교황', keywords: ['intuition', 'unconscious', 'mystery'], meaningUpright: '直觉引导，内在智慧，潜意识启示，神秘知识。', meaningReversed: '忽视直觉，表面判断，秘密被隐藏。', element: 'Water' },
  { id: 3, nameZh: '女皇', nameJa: '女帝', nameEn: 'The Empress', nameRu: 'Императрица', nameKo: '여황제', keywords: ['fertility', 'nurturing', 'abundance'], meaningUpright: '丰饶与创造，母性关怀，自然之美，感官享受。', meaningReversed: '依赖，过度保护，创造力受阻，不孕。', element: 'Earth' },
  { id: 4, nameZh: '皇帝', nameJa: '皇帝', nameEn: 'The Emperor', nameRu: 'Император', nameKo: '황제', keywords: ['authority', 'structure', 'control'], meaningUpright: '稳定与秩序，父性权威，结构化思维，领导能力。', meaningReversed: '专制，僵化，滥用权力，缺乏纪律。', element: 'Fire' },
  { id: 5, nameZh: '教皇', nameJa: '教皇', nameEn: 'The Hierophant', nameRu: 'Жрец', nameKo: '교황', keywords: ['tradition', 'conformity', 'morality'], meaningUpright: '传统智慧，精神指引，遵循规则，集体价值。', meaningReversed: '反叛传统，非正统，打破规则，个人信仰。', element: 'Earth' },
  { id: 6, nameZh: '恋人', nameJa: '恋人', nameEn: 'The Lovers', nameRu: 'Влюблённые', nameKo: '연인', keywords: ['love', 'harmony', 'choices'], meaningUpright: '深刻的联结，和谐关系，重要选择，价值观统一。', meaningReversed: '关系失衡，错误选择，价值观冲突，分离。', element: 'Air' },
  { id: 7, nameZh: '战车', nameJa: '戦車', nameEn: 'The Chariot', nameRu: 'Колесница', nameKo: '전차', keywords: ['control', 'willpower', 'victory'], meaningUpright: '意志的力量，克服障碍，坚定目标，胜利在望。', meaningReversed: '失控，侵略性，缺乏方向，挫败感。', element: 'Water' },
  { id: 8, nameZh: '力量', nameJa: '力', nameEn: 'Strength', nameRu: 'Сила', nameKo: '힘', keywords: ['courage', 'persuasion', 'influence'], meaningUpright: '内在勇气，温柔 persuasion，耐心，情绪控制。', meaningReversed: '自我怀疑，软弱，失去耐心，情绪爆发。', element: 'Fire' },
  { id: 9, nameZh: '隐者', nameJa: '隠者', nameEn: 'The Hermit', nameRu: 'Отшельник', nameKo: '은둔자', keywords: ['soul-searching', 'introspection', 'guidance'], meaningUpright: '内省之旅，寻求真理，孤独中的智慧，导师启示。', meaningReversed: '孤立，逃避，过度孤独，拒绝帮助。', element: 'Earth' },
  { id: 10, nameZh: '命运之轮', nameJa: '運命の輪', nameEn: 'Wheel of Fortune', nameRu: 'Колесо Фортуны', nameKo: '운명의 바퀴', keywords: ['change', 'cycles', 'luck'], meaningUpright: '命运转折，周期循环，好运降临，顺应变化。', meaningReversed: '厄运，抗拒改变，恶性循环，错失良机。', element: 'Fire' },
  { id: 11, nameZh: '正义', nameJa: '正義', nameEn: 'Justice', nameRu: 'Правосудие', nameKo: '정의', keywords: ['fairness', 'truth', 'law'], meaningUpright: '公正裁决，因果报应，诚实面对，平衡取舍。', meaningReversed: '不公，逃避责任，不诚实，偏见判断。', element: 'Air' },
  { id: 12, nameZh: '倒吊人', nameJa: '吊るされた男', nameEn: 'The Hanged Man', nameRu: 'Повешенный', nameKo: '매달린 남자', keywords: ['sacrifice', 'release', 'new perspective'], meaningUpright: '暂停与等待，牺牲小我，换角度看问题，精神觉醒。', meaningReversed: '抗拒改变，无意义的牺牲，停滞，固执。', element: 'Water' },
  { id: 13, nameZh: '死神', nameJa: '死神', nameEn: 'Death', nameRu: 'Смерть', nameKo: '사신', keywords: ['endings', 'transformation', 'transition'], meaningUpright: '结束与新生，必然转变，放下过去，深刻蜕变。', meaningReversed: '抗拒结束，停滞不前，恐惧改变，延迟转变。', element: 'Water' },
  { id: 14, nameZh: '节制', nameJa: '節制', nameEn: 'Temperance', nameRu: 'Умеренность', nameKo: '절제', keywords: ['balance', 'moderation', 'patience'], meaningUpright: '平衡与调和，适度节制，耐心融合，身心和谐。', meaningReversed: '极端，失衡，过度放纵，缺乏耐心。', element: 'Fire' },
  { id: 15, nameZh: '恶魔', nameJa: '悪魔', nameEn: 'The Devil', nameRu: 'Дьявол', nameKo: '악마', keywords: ['shadow self', 'attachment', 'addiction'], meaningUpright: '物质束缚，欲望陷阱，自我限制，阴影面对。', meaningReversed: '打破枷锁，摆脱依赖，重获自由，觉醒。', element: 'Earth' },
  { id: 16, nameZh: '塔', nameJa: '塔', nameEn: 'The Tower', nameRu: 'Башня', nameKo: '탑', keywords: ['sudden change', 'upheaval', 'revelation'], meaningUpright: '突然剧变，打破幻象，真相揭露，必要毁灭。', meaningReversed: '逃避灾难，渐进改变，内在崩溃，恐惧剧变。', element: 'Fire' },
  { id: 17, nameZh: '星星', nameJa: '星', nameEn: 'The Star', nameRu: 'Звезда', nameKo: '별', keywords: ['hope', 'faith', 'renewal'], meaningUpright: '希望之光，灵性指引，疗愈与更新，保持信念。', meaningReversed: '绝望，失去信心，缺乏灵感，自我怀疑。', element: 'Air' },
  { id: 18, nameZh: '月亮', nameJa: '月', nameEn: 'The Moon', nameRu: 'Луна', nameKo: '달', keywords: ['illusion', 'fear', 'subconscious'], meaningUpright: '潜意识探索，面对恐惧，直觉导航，幻觉背后。', meaningReversed: '恐惧消散，真相浮现，混乱结束， clarity。', element: 'Water' },
  { id: 19, nameZh: '太阳', nameJa: '太陽', nameEn: 'The Sun', nameRu: 'Солнце', nameKo: '태양', keywords: ['joy', 'success', 'vitality'], meaningUpright: '纯粹喜悦，成功与成就，活力四射，内在光明。', meaningReversed: '暂时的忧郁，过度乐观，自我膨胀，被遮蔽。', element: 'Fire' },
  { id: 20, nameZh: '审判', nameJa: '審判', nameEn: 'Judgement', nameRu: 'Страшный Суд', nameKo: '심판', keywords: ['rebirth', 'inner calling', 'absolution'], meaningUpright: '灵魂觉醒，因果清算，宽恕与重生，听从召唤。', meaningReversed: '自我批判，拒绝宽恕，逃避召唤，未解决的过去。', element: 'Fire' },
  { id: 21, nameZh: '世界', nameJa: '世界', nameEn: 'The World', nameRu: 'Мир', nameKo: '세계', keywords: ['completion', 'integration', 'fulfillment'], meaningUpright: '圆满完成，整合统一，成就达成，循环闭合。', meaningReversed: '未完成， shortcuts，缺乏 closure，延迟成功。', element: 'Earth' },
];

// ─── UI Copy ───
const UI_COPY: Record<string, Record<string, string>> = {
  zh: {
    back: '返回',
    help: '帮助',
    settings: '设置',
    selectCharacter: '选择角色',
    noCharacters: '暂无角色卡，请先在角色卡页面创建角色',
    characterName: '角色名称',
    or: '或',
    spreadType: '牌阵',
    spreadSingle: '单张牌',
    spreadSingleDesc: '抽取一张牌，获得当下的核心启示',
    spreadThree: '过去·现在·未来',
    spreadThreeDesc: '三张牌揭示角色的时间线演变',
    spreadFive: '角色五维分析',
    spreadFiveDesc: '五张牌分析角色的性格、动机、冲突、成长与结局',
    drawCards: '开始占卜',
    drawing: '抽牌中…',
    upright: '正位',
    reversed: '逆位',
    interpretation: '解读',
    aiInterpret: 'AI 深度解读',
    aiInterpretDesc: '基于角色设定生成深度塔罗解读',
    generating: '生成中…',
    history: '占卜历史',
    noHistory: '暂无占卜记录',
    deleteConfirm: '确定删除这条占卜记录吗？',
    clearAll: '清空历史',
    confirmClear: '确定清空所有占卜记录吗？',
    exportMarkdown: '导出 Markdown',
    exportTitle: '导出占卜记录',
    copy: '复制',
    copied: '已复制',
    copyFailed: '复制失败，请手动复制',
    close: '关闭',
    saveFailed: '保存失败',
    untitled: '未命名',
    emptyName: '无名角色',
    cardPosition1: '核心启示',
    cardPosition2: '过去',
    cardPosition3: '现在',
    cardPosition4: '未来',
    cardPosition5: '性格本质',
    cardPosition6: '内在动机',
    cardPosition7: '核心冲突',
    cardPosition8: '成长路径',
    cardPosition9: '命运结局',
    flipCard: '翻牌',
    readingFor: '为 {name} 占卜',
    date: '日期',
    drawAgain: '再抽一次',
    newReading: '新占卜',
    saveReading: '保存占卜',
    saving: '保存中…',
    apiKeyRequired: '请配置 API Key 以使用 AI 解读',
  },
  ja: {
    back: '戻る',
    help: 'ヘルプ',
    settings: '設定',
    selectCharacter: 'キャラ選択',
    noCharacters: 'キャラカードがありません。先にキャラカードページで作成してください',
    characterName: 'キャラ名',
    or: 'または',
    spreadType: 'スプレッド',
    spreadSingle: '一枚引き',
    spreadSingleDesc: '一枚のカードで今の核心启示を得る',
    spreadThree: '過去·現在·未来',
    spreadThreeDesc: '三枚のカードでキャラのタイムライン変遷を示す',
    spreadFive: '五面分析',
    spreadFiveDesc: '五枚のカードでキャラの性格·動機·葛藤·成長·結末を分析',
    drawCards: '占い開始',
    drawing: '抽选中…',
    upright: '正位置',
    reversed: '逆位置',
    interpretation: '解釈',
    aiInterpret: 'AI 深層解釈',
    aiInterpretDesc: 'キャラ設定に基づく深層タロット解釈を生成',
    generating: '生成中…',
    history: '履歴',
    noHistory: '占い履歴がありません',
    deleteConfirm: 'この記録を削除しますか？',
    clearAll: '履歴クリア',
    confirmClear: 'すべての占い履歴を削除しますか？',
    exportMarkdown: 'Markdown 出力',
    exportTitle: '占い記録の出力',
    copy: 'コピー',
    copied: 'コピー完了',
    copyFailed: 'コピーに失敗しました',
    close: '閉じる',
    saveFailed: '保存失敗',
    untitled: '無題',
    emptyName: '名無しキャラ',
    cardPosition1: '核心启示',
    cardPosition2: '過去',
    cardPosition3: '現在',
    cardPosition4: '未来',
    cardPosition5: '性格本質',
    cardPosition6: '内在動機',
    cardPosition7: '核心葛藤',
    cardPosition8: '成長道',
    cardPosition9: '運命結末',
    flipCard: 'カードをひっくり返す',
    readingFor: '{name} の占い',
    date: '日付',
    drawAgain: 'もう一度',
    newReading: '新規占い',
    saveReading: '占いを保存',
    saving: '保存中…',
    apiKeyRequired: 'AI解釈を使用するにはAPI Keyを設定してください',
  },
  en: {
    back: 'Back',
    help: 'Help',
    settings: 'Settings',
    selectCharacter: 'Select Character',
    noCharacters: 'No character cards yet. Create one in the Character Card page first',
    characterName: 'Character Name',
    or: 'or',
    spreadType: 'Spread',
    spreadSingle: 'Single Card',
    spreadSingleDesc: 'Draw one card for the core revelation of the moment',
    spreadThree: 'Past · Present · Future',
    spreadThreeDesc: 'Three cards reveal the character\'s timeline evolution',
    spreadFive: 'Five-Dimension Analysis',
    spreadFiveDesc: 'Five cards analyze personality, motive, conflict, growth, and ending',
    drawCards: 'Start Reading',
    drawing: 'Drawing…',
    upright: 'Upright',
    reversed: 'Reversed',
    interpretation: 'Interpretation',
    aiInterpret: 'AI Deep Reading',
    aiInterpretDesc: 'Generate a deep tarot reading based on character settings',
    generating: 'Generating…',
    history: 'History',
    noHistory: 'No reading history yet',
    deleteConfirm: 'Delete this reading?',
    clearAll: 'Clear History',
    confirmClear: 'Clear all reading history?',
    exportMarkdown: 'Export Markdown',
    exportTitle: 'Export Reading',
    copy: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    close: 'Close',
    saveFailed: 'Save failed',
    untitled: 'Untitled',
    emptyName: 'Unnamed Character',
    cardPosition1: 'Core Revelation',
    cardPosition2: 'Past',
    cardPosition3: 'Present',
    cardPosition4: 'Future',
    cardPosition5: 'Personality',
    cardPosition6: 'Inner Motive',
    cardPosition7: 'Core Conflict',
    cardPosition8: 'Growth Path',
    cardPosition9: 'Final Destiny',
    flipCard: 'Flip Card',
    readingFor: 'Reading for {name}',
    date: 'Date',
    drawAgain: 'Draw Again',
    newReading: 'New Reading',
    saveReading: 'Save Reading',
    saving: 'Saving…',
    apiKeyRequired: 'Configure an API Key to use AI interpretation',
  },
  ru: {
    back: 'Назад',
    help: 'Справка',
    settings: 'Настройки',
    selectCharacter: 'Выбрать персонажа',
    noCharacters: 'Карточек персонажей пока нет. Сначала создайте одну на странице карточки',
    characterName: 'Имя персонажа',
    or: 'или',
    spreadType: 'Расклад',
    spreadSingle: 'Одна карта',
    spreadSingleDesc: 'Вытяните одну карту для главного откровения',
    spreadThree: 'Прошлое · Настоящее · Будущее',
    spreadThreeDesc: 'Три карты раскрывают эволюцию персонажа во времени',
    spreadFive: 'Пятимерный анализ',
    spreadFiveDesc: 'Пять карт анализируют личность, мотив, конфликт, рост и финал',
    drawCards: 'Начать гадание',
    drawing: 'Гадание…',
    upright: 'Прямое',
    reversed: 'Перевёрнутое',
    interpretation: 'Толкование',
    aiInterpret: 'AI-Толкование',
    aiInterpretDesc: 'Сгенерировать глубокое толкование на основе данных персонажа',
    generating: 'Генерация…',
    history: 'История',
    noHistory: 'История гаданий пуста',
    deleteConfirm: 'Удалить эту запись?',
    clearAll: 'Очистить историю',
    confirmClear: 'Очистить всю историю гаданий?',
    exportMarkdown: 'Экспорт Markdown',
    exportTitle: 'Экспорт гадания',
    copy: 'Копировать',
    copied: 'Скопировано',
    copyFailed: 'Не удалось скопировать',
    close: 'Закрыть',
    saveFailed: 'Ошибка сохранения',
    untitled: 'Без названия',
    emptyName: 'Безымянный персонаж',
    cardPosition1: 'Главное откровение',
    cardPosition2: 'Прошлое',
    cardPosition3: 'Настоящее',
    cardPosition4: 'Будущее',
    cardPosition5: 'Личность',
    cardPosition6: 'Внутренний мотив',
    cardPosition7: 'Конфликт',
    cardPosition8: 'Путь роста',
    cardPosition9: 'Финальная судьба',
    flipCard: 'Перевернуть карту',
    readingFor: 'Гадание для {name}',
    date: 'Дата',
    drawAgain: 'Ещё раз',
    newReading: 'Новое гадание',
    saveReading: 'Сохранить гадание',
    saving: 'Сохранение…',
    apiKeyRequired: 'Настройте API Key для использования AI-толкования',
  },
  ko: {
    back: '뒤로',
    help: '도움말',
    settings: '설정',
    selectCharacter: '캐릭터 선택',
    noCharacters: '캐릭터 카드가 없습니다. 먼저 캐릭터 카드 페이지에서 생성하세요',
    characterName: '캐릭터 이름',
    or: '또는',
    spreadType: '스프레드',
    spreadSingle: '한 장',
    spreadSingleDesc: '한 장의 카드로 현재의 핵심 계시를 얻습니다',
    spreadThree: '과거·현재·미래',
    spreadThreeDesc: '세 장의 카드가 캐릭터의 시간선 변화를 보여줍니다',
    spreadFive: '5차원 분석',
    spreadFiveDesc: '다섯 장의 카드로 성격, 동기, 갈등, 성장, 결말을 분석합니다',
    drawCards: '점 시작',
    drawing: '뽑는 중…',
    upright: '정위치',
    reversed: '역위치',
    interpretation: '해석',
    aiInterpret: 'AI 심층 해석',
    aiInterpretDesc: '캐릭터 설정을 바탕으로 심층 타로 해석을 생성합니다',
    generating: '생성 중…',
    history: '기록',
    noHistory: '점 기록이 없습니다',
    deleteConfirm: '이 기록을 삭제하시겠습니까?',
    clearAll: '기록 지우기',
    confirmClear: '모든 점 기록을 지우시겠습니까?',
    exportMarkdown: 'Markdown 납품',
    exportTitle: '점 기록 납품',
    copy: '복사',
    copied: '복사됨',
    copyFailed: '복사 실패',
    close: '닫기',
    saveFailed: '저장 실패',
    untitled: '무제',
    emptyName: '이름 없는 캐릭터',
    cardPosition1: '핵심 계시',
    cardPosition2: '과거',
    cardPosition3: '현재',
    cardPosition4: '미래',
    cardPosition5: '성격 본질',
    cardPosition6: '내면 동기',
    cardPosition7: '핵심 갈등',
    cardPosition8: '성장 길',
    cardPosition9: '운명 결말',
    flipCard: '카드 뒤집기',
    readingFor: '{name}의 점',
    date: '날짜',
    drawAgain: '다시 뽑기',
    newReading: '새 점',
    saveReading: '점 저장',
    saving: '저장 중…',
    apiKeyRequired: 'AI 해석을 사용하려면 API Key를 설정하세요',
  },
};

// ─── Helpers ───
function uid(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function shuffleDeck(): TarotCardData[] {
  const deck = [...TAROT_DECK];
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

function drawCards(spread: SpreadType): DrawnCard[] {
  const deck = shuffleDeck();
  const count = spread === 'single' ? 1 : spread === 'three' ? 3 : 5;
  return deck.slice(0, count).map((card, i) => ({
    card,
    position: Math.random() > 0.5 ? 'upright' : 'reversed',
    index: i,
  }));
}

function getPositionLabels(spread: SpreadType): string[] {
  switch (spread) {
    case 'single': return ['cardPosition1'];
    case 'three': return ['cardPosition2', 'cardPosition3', 'cardPosition4'];
    case 'five': return ['cardPosition5', 'cardPosition6', 'cardPosition7', 'cardPosition8', 'cardPosition9'];
  }
}

function getCardName(card: TarotCardData, language: AppLanguage): string {
  switch (language) {
    case 'zh': return card.nameZh;
    case 'ja': return card.nameJa;
    case 'ru': return card.nameRu;
    case 'ko': return card.nameKo;
    default: return card.nameEn;
  }
}

const STORAGE_KEY = 'oc-maker.character-tarot';

function loadReadings(): TarotReading[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown[];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((item): TarotReading | null => {
        if (!item || typeof item !== 'object') return null;
        const r = item as Record<string, unknown>;
        const cardsRaw = Array.isArray(r.cards) ? r.cards : [];
        const cards = cardsRaw
          .map((c): DrawnCard | null => {
            if (!c || typeof c !== 'object') return null;
            const cr = c as Record<string, unknown>;
            const cardId = typeof cr.card === 'number' ? cr.card : -1;
            const card = TAROT_DECK.find((d) => d.id === cardId);
            if (!card) return null;
            return {
              card,
              position: cr.position === 'reversed' ? 'reversed' : 'upright',
              index: typeof cr.index === 'number' ? cr.index : 0,
            };
          })
          .filter((x): x is DrawnCard => x !== null);
        return {
          id: typeof r.id === 'string' ? r.id : uid(),
          characterName: typeof r.characterName === 'string' ? r.characterName : '',
          spreadType: ['single', 'three', 'five'].includes(r.spreadType as string) ? (r.spreadType as SpreadType) : 'single',
          cards,
          interpretation: typeof r.interpretation === 'string' ? r.interpretation : '',
          createdAt: typeof r.createdAt === 'string' ? r.createdAt : new Date().toISOString(),
        };
      })
      .filter((x): x is TarotReading => x !== null);
  } catch {
    return [];
  }
}

function saveReadings(readings: TarotReading[]): boolean {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(readings));
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
    const card = data as Record<string, unknown>;
    const infoParts: string[] = [];
    if (typeof card.bio === 'string') infoParts.push(card.bio);
    return [{ name: typeof card.name === 'string' ? card.name : 'Unnamed', info: infoParts.join('\n') }];
  } catch {
    return [];
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

async function generateAiInterpretation(
  characterInfo: string,
  cards: DrawnCard[],
  spreadLabel: string,
  uprightLabel: string,
  reversedLabel: string,
  apiKey: string,
  apiBase: string,
  language: AppLanguage,
  model: string,
  temperature: number,
  maxTokens: number,
): Promise<string> {
  const langMap: Record<string, string> = { zh: 'Chinese', ja: 'Japanese', en: 'English', ru: 'Russian', ko: 'Korean' };
  const lang = langMap[language] || 'English';
  const cardsDesc = cards.map((c, i) => {
    const pos = c.position === 'upright' ? uprightLabel : reversedLabel;
    const name = getCardName(c.card, language);
    return `${i + 1}. ${name} (${pos}) - ${c.position === 'upright' ? c.card.meaningUpright : c.card.meaningReversed}`;
  }).join('\n');
  const prompt = `You are a master tarot reader. Please perform a deep tarot reading for the following character in ${lang}.

Character Information:
${characterInfo || 'Unnamed Character'}

Spread: ${spreadLabel}
Drawn Cards:
${cardsDesc}

Please generate a 300-500 word deep interpretation that weaves the tarot meanings with the character's background, providing insightful plot suggestions. Write in a coherent, literary style.`;

  try {
    const res = await fetch(`${apiBase}/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ model, messages: [{ role: 'user', content: prompt }], temperature, max_tokens: maxTokens }),
    });
    if (!res.ok) return '';
    const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    return data.choices?.[0]?.message?.content?.trim() || '';
  } catch {
    return '';
  }
}

// ─── Component ───
export default function CharacterTarotPage({
  settings,
  language,
  onBack,
  onOpenSettings,
  onOpenDocs,
  pageTitle,
  pageDescription,
}: SharedPageProps) {
  const copy = UI_COPY[language] ?? UI_COPY.en;
  const [readings, setReadings] = useState<TarotReading[]>(loadReadings);
  const [characterName, setCharacterName] = useState('');
  const [characterInfo, setCharacterInfo] = useState('');
  const [availableChars, setAvailableChars] = useState<{ name: string; info: string }[]>([]);
  const [selectedSpread, setSelectedSpread] = useState<SpreadType>('single');
  const [currentCards, setCurrentCards] = useState<DrawnCard[] | null>(null);
  const [interpretation, setInterpretation] = useState('');
  const [isDrawing, setIsDrawing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [saveToast, setSaveToast] = useState('');
  const [copied, setCopied] = useState(false);
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());
  const [activeReadingId, setActiveReadingId] = useState<string | null>(null);
  const mountedRef = useRef(true);
  const copyTimerRef = useRef<number | null>(null);
  const saveTimerRef = useRef<number | null>(null);
  const drawTimerRef = useRef<number | null>(null);
  const savedInterpretationRef = useRef('');

  const maybeConfirm = useCallback(
    (message: string, action: () => void) => {
      if (!settings.others.confirmDestructiveActions || window.confirm(message)) {
        action();
      }
    },
    [settings.others.confirmDestructiveActions]
  );

  const persistReadings = useCallback((next: TarotReading[]): boolean => {
    const ok = saveReadings(next);
    if (ok) setReadings(next);
    return ok;
  }, []);

  useEffect(() => {
    setAvailableChars(loadCharacters());
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

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
      if (drawTimerRef.current) window.clearTimeout(drawTimerRef.current);
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

  const hasUnsaved = currentCards !== null && interpretation.trim().length > 0 && interpretation !== savedInterpretationRef.current;
  useBeforeUnloadGuard(hasUnsaved);

  const handleDraw = useCallback(() => {
    if (isDrawing) return;
    setIsDrawing(true);
    setFlippedCards(new Set());
    setInterpretation('');
    savedInterpretationRef.current = '';
    setActiveReadingId(null);
    playSound('buttonClick');
    // Simulate draw delay for suspense
    if (drawTimerRef.current) window.clearTimeout(drawTimerRef.current);
    drawTimerRef.current = window.setTimeout(() => {
      if (!mountedRef.current) return;
      const cards = drawCards(selectedSpread);
      setCurrentCards(cards);
      setIsDrawing(false);
      playSound('confirm');
    }, 800);
  }, [isDrawing, selectedSpread]);

  const handleFlipCard = useCallback((index: number) => {
    setFlippedCards((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
        playSound('select');
      }
      return next;
    });
  }, []);

  const handleAiInterpret = useCallback(async () => {
    if (!currentCards || isGenerating) return;
    setIsGenerating(true);
    const spreadLabel = copy[selectedSpread === 'single' ? 'spreadSingle' : selectedSpread === 'three' ? 'spreadThree' : 'spreadFive'];
    const result = await generateAiInterpretation(
      characterName + '\n' + characterInfo,
      currentCards,
      spreadLabel,
      copy.upright,
      copy.reversed,
      settings.apiKey,
      settings.apiBaseUrl || 'https://api.openai.com/v1',
      language,
      settings.llm?.model || 'gpt-4',
      settings.llm?.temperature ?? 0.8,
      settings.llm?.maxTokens ?? 800,
    );
    if (mountedRef.current) {
      setIsGenerating(false);
      if (result) {
        setInterpretation(result);
        playSound('success');
      } else {
        setSaveToast(copy.saveFailed);
        playSound('error');
      }
    }
  }, [currentCards, isGenerating, characterName, characterInfo, selectedSpread, settings.apiKey, settings.apiBaseUrl, language, copy.saveFailed]);

  const handleSaveReading = useCallback(() => {
    if (!currentCards || isSaving) return;
    setIsSaving(true);
    const reading: TarotReading = {
      id: uid(),
      characterName: characterName.trim() || copy.emptyName,
      spreadType: selectedSpread,
      cards: currentCards,
      interpretation,
      createdAt: new Date().toISOString(),
    };
    const next = [reading, ...readings];
    if (!persistReadings(next)) {
      setSaveToast(copy.saveFailed);
      playSound('error');
    } else {
      playSound('confirm');
      setActiveReadingId(reading.id);
      savedInterpretationRef.current = interpretation;
    }
    setIsSaving(false);
  }, [currentCards, isSaving, characterName, selectedSpread, interpretation, readings, persistReadings, copy.saveFailed, copy.emptyName]);

  const handleDeleteReading = useCallback((id: string) => {
    maybeConfirm(copy.deleteConfirm, () => {
      const next = readings.filter((r) => r.id !== id);
      if (!persistReadings(next)) {
        setSaveToast(copy.saveFailed);
        playSound('error');
      } else {
        playSound('deleteSound');
        if (activeReadingId === id) {
          setActiveReadingId(null);
          setCurrentCards(null);
          setInterpretation('');
        }
      }
    });
  }, [readings, persistReadings, maybeConfirm, copy.deleteConfirm, copy.saveFailed, activeReadingId]);

  const handleClearAll = useCallback(() => {
    maybeConfirm(copy.confirmClear, () => {
      if (!persistReadings([])) {
        setSaveToast(copy.saveFailed);
        playSound('error');
      } else {
        playSound('resetSound');
        setActiveReadingId(null);
        setCurrentCards(null);
        setInterpretation('');
      }
    });
  }, [persistReadings, maybeConfirm, copy.confirmClear, copy.saveFailed]);

  const handleLoadReading = useCallback((reading: TarotReading) => {
    setActiveReadingId(reading.id);
    setCharacterName(reading.characterName);
    setSelectedSpread(reading.spreadType);
    setCurrentCards(reading.cards);
    setInterpretation(reading.interpretation);
    savedInterpretationRef.current = reading.interpretation;
    setFlippedCards(new Set(reading.cards.map((c) => c.index)));
    setShowHistory(false);
    playSound('select');
  }, []);

  const handleNewReading = useCallback(() => {
    setCurrentCards(null);
    setInterpretation('');
    savedInterpretationRef.current = '';
    setFlippedCards(new Set());
    setActiveReadingId(null);
    setCharacterName('');
    setCharacterInfo('');
    playSound('back');
  }, []);

  const exportMarkdown = useCallback((reading: TarotReading) => {
    const lines: string[] = [
      `# ${copy.readingFor.replace('{name}', reading.characterName)}`,
      '',
      `**${copy.spreadType}:** ${reading.spreadType === 'single' ? copy.spreadSingle : reading.spreadType === 'three' ? copy.spreadThree : copy.spreadFive}`,
      `**${copy.characterName}:** ${reading.characterName}`,
      `**${copy.date}:** ${new Date(reading.createdAt).toLocaleDateString()}`,
      '',
      '---',
      '',
    ];
    const labels = getPositionLabels(reading.spreadType);
    reading.cards.forEach((c, i) => {
      const label = copy[labels[i]] || `${copy.cardPosition1} ${i + 1}`;
      const pos = c.position === 'upright' ? copy.upright : copy.reversed;
      lines.push(`## ${label}: ${getCardName(c.card, language)} (${pos})`);
      lines.push(c.position === 'upright' ? c.card.meaningUpright : c.card.meaningReversed);
      lines.push('');
    });
    if (reading.interpretation) {
      lines.push(`## ${copy.interpretation}`);
      lines.push(reading.interpretation);
      lines.push('');
    }
    return lines.join('\n');
  }, [copy, language]);

  const handleCopy = useCallback(() => {
    if (!activeReading) return;
    navigator.clipboard.writeText(exportMarkdown(activeReading))
      .then(() => {
        setCopied(true);
        playSound('copySound');
        if (copyTimerRef.current) window.clearTimeout(copyTimerRef.current);
        copyTimerRef.current = window.setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        setSaveToast(copy.copyFailed);
        playSound('error');
      });
  }, [activeReadingId, readings, exportMarkdown, copy.copyFailed]);

  const activeReading = useMemo(() => {
    if (activeReadingId) {
      return readings.find((r) => r.id === activeReadingId) ?? null;
    }
    if (!currentCards) return null;
    return {
      id: 'current',
      characterName: characterName.trim() || copy.emptyName,
      spreadType: selectedSpread,
      cards: currentCards,
      interpretation,
      createdAt: new Date().toISOString(),
    };
  }, [readings, activeReadingId, currentCards, characterName, selectedSpread, interpretation, copy.emptyName]);
  const positionLabels = getPositionLabels(selectedSpread);

  return (
    <div className="editor-layout tarot-layout">
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
                <button className="secondary-button small-button" type="button" aria-label={copy.help} data-sfx-handled onClick={onOpenDocs}>
                  ?
                </button>
              )}
              <button className="secondary-button small-button" type="button" aria-label={copy.settings} data-sfx-handled onClick={onOpenSettings}>
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

          {/* Character Selection */}
          <div className="tarot-section">
            <h4 className="arc-section-label">{copy.selectCharacter}</h4>
            {availableChars.length > 0 ? (
              <div className="arc-char-list">
                {availableChars.map((c) => (
                  <button
                    key={c.name}
                    className={`choice-chip ${characterName === c.name ? 'active' : ''}`}
                    type="button"
                    data-sfx-handled
                    onClick={() => {
                      playSound('select');
                      setCharacterName(c.name);
                      setCharacterInfo(c.info);
                    }}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            ) : (
              <p className="muted-copy">{copy.noCharacters}</p>
            )}
            <input
              className="scene-input"
              type="text"
              placeholder={copy.characterName}
              aria-label={copy.characterName}
              maxLength={100}
              value={characterName}
              onChange={(e) => setCharacterName(e.target.value)}
              style={{ marginTop: 8 }}
            />
          </div>

          {/* Spread Selection */}
          <div className="tarot-section">
            <h4 className="arc-section-label">{copy.spreadType}</h4>
            <div className="tarot-spread-list">
              {([
                { id: 'single' as SpreadType, label: copy.spreadSingle, desc: copy.spreadSingleDesc },
                { id: 'three' as SpreadType, label: copy.spreadThree, desc: copy.spreadThreeDesc },
                { id: 'five' as SpreadType, label: copy.spreadFive, desc: copy.spreadFiveDesc },
              ]).map((s) => (
                <button
                  key={s.id}
                  className={`tarot-spread-card ${selectedSpread === s.id ? 'active' : ''}`}
                  type="button"
                  data-sfx-handled
                  onClick={() => {
                    playSound('select');
                    setSelectedSpread(s.id);
                    setCurrentCards(null);
                    setFlippedCards(new Set());
                    setInterpretation('');
                    savedInterpretationRef.current = '';
                    setActiveReadingId(null);
                  }}
                >
                  <div className="tarot-spread-name">{s.label}</div>
                  <div className="tarot-spread-desc">{s.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="arc-sidebar-actions">
            <button className="secondary-button small-button" type="button" data-sfx-handled onClick={handleDraw} disabled={isDrawing}>
              {isDrawing ? copy.drawing : copy.drawCards}
            </button>
            {currentCards && (
              <button className="secondary-button small-button" type="button" data-sfx-handled onClick={handleNewReading}>
                {copy.newReading}
              </button>
            )}
            <button className="secondary-button small-button" type="button" data-sfx-handled onClick={() => { playSound('modalOpen'); setShowHistory(true); }}>
              {copy.history} ({readings.length})
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="editor-main-panel">
        {!currentCards ? (
          <div className="scene-empty-state">
            <div className="scene-empty-icon" aria-hidden="true">🃏</div>
            <p className="muted-copy">{copy.selectCharacter}，{copy.drawCards}</p>
          </div>
        ) : (
          <div className="tarot-reading-area">
            {/* Cards */}
            <div className={`tarot-cards-grid spread-${selectedSpread}`}>
              {currentCards.map((drawn, i) => {
                const isFlipped = flippedCards.has(i);
                return (
                  <div key={i} className="tarot-card-wrapper">
                    <div className="tarot-card-position">{copy[positionLabels[i]]}</div>
                    <button
                      className={`tarot-card ${isFlipped ? 'flipped' : ''} ${drawn.position === 'reversed' ? 'reversed' : ''}`}
                      type="button"
                      aria-label={`${copy.flipCard}: ${getCardName(drawn.card, language)}`}
                      data-sfx-handled
                      onClick={() => handleFlipCard(i)}
                    >
                      <div className="tarot-card-face tarot-card-back">
                        <div className="tarot-card-back-pattern" aria-hidden="true">✦</div>
                      </div>
                      <div className="tarot-card-face tarot-card-front">
                        <div className="tarot-card-number">{drawn.card.id}</div>
                        <div className="tarot-card-name">{getCardName(drawn.card, language)}</div>
                        <div className={`tarot-card-position-badge ${drawn.position}`}>
                          {drawn.position === 'upright' ? copy.upright : copy.reversed}
                        </div>
                        <div className="tarot-card-meaning">
                          {drawn.position === 'upright' ? drawn.card.meaningUpright : drawn.card.meaningReversed}
                        </div>
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Interpretation */}
            {Array.from(flippedCards).length === currentCards.length && (
              <div className="tarot-interpretation-area">
                <div className="tarot-interpretation-header">
                  <h3>{copy.interpretation}</h3>
                  <div className="tarot-interpretation-actions">
                    {settings.apiKey && (
                      <button
                        className="secondary-button small-button"
                        type="button"
                        disabled={isGenerating}
                        data-sfx-handled
                        onClick={handleAiInterpret}
                        title={copy.aiInterpretDesc}
                      >
                        {isGenerating ? copy.generating : copy.aiInterpret}
                      </button>
                    )}
                    <button className="secondary-button small-button" type="button" data-sfx-handled onClick={handleSaveReading} disabled={isSaving || isGenerating}>
                      {isSaving ? copy.saving : copy.saveReading}
                    </button>
                    <button
                      className="secondary-button small-button"
                      type="button"
                      data-sfx-handled
                      onClick={() => { playSound('modalOpen'); setShowExport(true); }}
                      disabled={isGenerating}
                    >
                      {copy.exportMarkdown}
                    </button>
                  </div>
                </div>
                {interpretation ? (
                  <div className="tarot-interpretation-text">{interpretation}</div>
                ) : (
                  <p className="muted-copy">{settings.apiKey ? copy.aiInterpretDesc : copy.apiKeyRequired}</p>
                )}
              </div>
            )}
          </div>
        )}
      </main>

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
              {readings.length === 0 ? (
                <p className="muted-copy">{copy.noHistory}</p>
              ) : (
                <div className="tarot-history-list">
                  {readings.map((r) => (
                    <div key={r.id} className="tarot-history-item">
                      <button
                        className="tarot-history-main"
                        type="button"
                        data-sfx-handled
                        onClick={() => handleLoadReading(r)}
                      >
                        <div className="tarot-history-name">{r.characterName}</div>
                        <div className="tarot-history-meta">
                          {r.spreadType === 'single' ? copy.spreadSingle : r.spreadType === 'three' ? copy.spreadThree : copy.spreadFive} · {r.cards.length} {copy.drawCards} · {new Date(r.createdAt).toLocaleDateString()}
                        </div>
                      </button>
                      <button
                        className="icon-button danger"
                        type="button"
                        aria-label={copy.deleteConfirm}
                        data-sfx-handled
                        onClick={() => handleDeleteReading(r.id)}
                      >
                        🗑
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {readings.length > 0 && (
                <button className="secondary-button small-button" type="button" data-sfx-handled onClick={handleClearAll}>
                  {copy.clearAll}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Export Modal */}
      {showExport && activeReading && (
        <div className="modal-backdrop" role="presentation" onClick={() => setShowExport(false)}>
          <div className="modal-card modal-surface" role="dialog" aria-modal="true" aria-label={copy.exportTitle} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{copy.exportTitle}</h3>
              <button className="icon-button modal-close" type="button" aria-label={copy.close} data-sfx-handled onClick={() => setShowExport(false)}>
                ✕
              </button>
            </div>
            <div className="modal-body">
              <textarea className="scene-export-textarea" readOnly rows={16} value={exportMarkdown(activeReading)} aria-label={copy.exportTitle} />
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

      {/* Toast */}
      {saveToast && (
        <div className="editor-toast error" role="alert" aria-live="polite" style={{ position: 'fixed', top: 72, left: '50%', transform: 'translateX(-50%)' }}>
          {saveToast}
        </div>
      )}
    </div>
  );
}
