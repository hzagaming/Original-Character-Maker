import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { playSound } from './audioEngine';
import type { AppLanguage, SettingsState } from './types';

// ─── Data pools per language ───

export type InspirationCategory =
  | 'personality'
  | 'appearance'
  | 'outfit'
  | 'background'
  | 'catchphrase'
  | 'flaw'
  | 'secret'
  | 'hobby';

export type InspirationEntry = {
  category: InspirationCategory;
  value: string;
  locked: boolean;
};

export type InspirationSet = {
  id: string;
  createdAt: string;
  entries: InspirationEntry[];
};

type PoolMap = Record<AppLanguage, Record<InspirationCategory, string[]>>;

const POOLS: PoolMap = {
  zh: {
    personality: [
      '傲娇但内心温柔', '天然呆', '冷静理性', '热血冲动', '腹黑', '乐观开朗', '忧郁寡言', '毒舌',
      '温柔体贴', '懒散随性', '认真固执', '叛逆不羁', '胆小害羞', '自信张扬', '神秘莫测',
      '正义感爆棚', '悲观消极', '好奇心旺盛', '占有欲强', '容易嫉妒', '极度自律', '随性而为',
      '忠诚可靠', '反复无常', '爱撒娇', '老成稳重', '幼稚天真', '冷漠疏离', '热情好客',
    ],
    appearance: [
      '异色瞳', '银色长发', '双马尾', '单眼罩', '泪痣', '猫耳', '机械义肢', '精灵耳',
      '红发及腰', '短发利落', '麻花辫', '狼尾发型', '遮眼刘海', '挑染发色', '虎牙',
      '高挑修长', '娇小玲珑', '肌肉线条明显', '苍白肤色', '小麦色皮肤', '瓷娃娃般精致',
      '左眼下疤痕', '纹身', '瞳孔有花纹', '总是戴着手套', '脖子上系着丝带',
    ],
    outfit: [
      '哥特洛丽塔', '和风浴衣', '骑士铠甲', '现代便服', '魔法使长袍', '军装制服',
      '连帽卫衣', '水手服', '和服振袖', '西装革履', '朋克风格', '田园风连衣裙',
      '机械风外骨骼', '忍者装束', '教会修女服', '运动套装', '燕尾服', '旗袍',
      '斗篷披风', '皮革夹克', '围裙', '实验白大褂', '舞娘服饰', '狩衣',
    ],
    background: [
      '没落贵族后裔', '孤儿院长大的孩子', '被诅咒的皇族', '边境村落的猎人',
      '大图书馆的管理员', '流浪艺人', '前特种兵', '天才发明家的助手',
      '被实验改造的人造人', '深海打捞者', '星际走私商人', '古老神社的巫女',
      '地下城探险者', '王室替身', '被追杀的刺客', '普通高中生（隐藏身份）',
      '异世界转生者', '失去记忆的旅人', '龙族与人类混血', '被收养的外来者',
    ],
    catchphrase: [
      '哼，才、才不是为了你呢！', '这次就饶了你。', '事情变得有趣起来了呢。',
      '交给我吧，肯定没问题。', '……无聊。', '哎呀，这不是很明显吗？',
      '不要靠近我。', '让我来保护大家！', '这种小事不值一提。', '才不要！',
      '我相信你。', '真是的，拿你没办法。', '这就是命运吧。', '等着瞧吧。',
      '好困……再睡五分钟。', '因为我是最强的啊。', '别碰我的东西。',
    ],
    flaw: [
      '路痴', '恐高', '社交恐惧', '过于执着', '容易冲动', '懒癌晚期', '选择困难症',
      '过度保护欲', '不信任他人', '完美主义', '容易嫉妒', '情绪化严重', '嗜甜如命',
      '怕黑', '强迫症', '言不由衷', '容易放弃', '过于天真', '报复心强', '健忘',
    ],
    secret: [
      '其实拥有双重人格', '深夜会偷偷哭泣', '背负着灭族之仇', '身体里有另一个灵魂',
      '其实是王室私生子', '掌握着毁灭世界的钥匙', '曾经亲手杀死过挚友',
      '一直在假扮另一个人', '拥有预知未来的能力（但不想用）', '其实是非人类',
      '暗恋着最不该喜欢的人', '掌握着足以颠覆国家的证据', '一直在寻找失散的孪生兄妹',
      '其实是时间旅行者', '拥有不老不死的能力', '体内封印着古代恶灵',
    ],
    hobby: [
      '收集奇怪的小石头', '烹饪（但味道很怪）', '观星', '写日记', '练习剑术',
      '画画（只画风景）', '养植物', '拼图', '钓鱼', '制作手工艺品',
      '阅读推理小说', '编辫子', '收集古董', '练书法', '听老唱片',
      '拆解机械再组装', '茶道', '雕刻', '占卜', '极限运动',
    ],
  },
  ja: {
    personality: [
      'ツンデレ', '天然ボケ', 'クール', '熱血', '腹黒', '明るく前向き', '憂鬱で無口', '毒舌',
      '優しく思いやりがある', 'のんびり', '真面目で頑固', '反抗的', '臆病で照れ屋', '自信家', '謎めいている',
      '正義感が強い', '悲観的', '好奇心旺盛', '独占欲が強い', '嫉妬深い', '極度に規律正しい', '気まま',
      '忠実で信頼できる', '気まぐれ', '甘えん坊', '老成している', '幼い', '冷たく無関心', '温かく世話好き',
    ],
    appearance: [
      'オッドアイ', '銀のロングヘア', 'ツインテール', '眼帯', '泣きぼくろ', '猫耳', '義手', 'エルフ耳',
      '腰まで届く赤髪', 'ショートヘア', '三つ編み', 'ウルフカット', '目隠し前髪', 'インナーカラー', '八重歯',
      '高身長スレンダー', '小柄', '筋肉質', '青白い肌', '小麦色の肌', '陶器のように整った顔立ち',
      '左目の下の傷跡', 'タトゥー', '瞳に模様', '常に手袋', '首にリボン',
    ],
    outfit: [
      'ゴスロリ', '浴衣', '騎士の鎧', 'カジュアル', '魔法使いのローブ', '軍服',
      'パーカー', 'セーラー服', '振袖', 'スーツ', 'パンクファッション', 'カントリードレス',
      'メカニカルエクソスケルトン', '忍者装束', '修道服', 'ジャージ', 'タキシード', 'チャイナドレス',
      'マント', 'レザージャケット', 'エプロン', '白衣', 'ベリーダンス衣装', '狩衣',
    ],
    background: [
      '没落した貴族の末裔', '孤児院で育った子', '呪われた皇族', '辺境の村の狩人',
      '大図書館の司書', '旅芸人', '元特殊部隊員', '天才発明家の助手',
      '実験で改造された人造人間', '深海のサルベージャー', '星間密輸商人', '古い神社の巫女',
      'ダンジョン探検者', '王族の影武者', '追われる刺客', '普通の高校生（隠し身分あり）',
      '異世界転生者', '記憶を失った旅人', '人間とドラゴンの混血', '引き取られた外部者',
    ],
    catchphrase: [
      'べ、別にあんたのためじゃないんだから！', '今回だけ許してあげる。', '面白くなってきたわね。',
      '任せて、絶対大丈夫。', '……つまらない。', 'あら、明らかじゃない？',
      '近寄らないで。', 'みんなを守る！', 'そんなこと大したことないわ。', 'やだ！',
      '信じてる。', 'もう、仕方ないわね。', 'これが運命なのね。', '見てなさい。',
      '眠い……あと五分。', 'だって私最強だもん。', '私のものに触らないで。',
    ],
    flaw: [
      '方向音痴', '高所恐怖症', '社交不安', '執着が強い', '衝動的', '重度の怠け者', '優柔不断',
      '過保護', '他人を信じられない', '完璧主義', '嫉妬深い', '感情的', '甘党',
      '暗闇が怖い', '強迫性障害', '素直になれない', '簡単に諦める', '甘すぎる', '復讐心が強い', '忘っちゃう',
    ],
    secret: [
      '実は多重人格', '夜中こっそり泣いている', '一族を滅ぼされた復讐を抱えている', '体に別の魂がいる',
      '実は王族の隠し子', '世界を破滅させる鍵を握っている', 'かつて親友を手にかけた',
      'ずっと誰かの成りすましをしている', '未来予知の能力を持つ（使いたくない）', '実は人間じゃない',
      'ありえない相手を密かに想っている', '国家を覆す証拠を握っている', '離れた双子の兄弟を探している',
      '実は時間旅行者', '不老不死の能力を持つ', '体内に古代の悪霊を封じている',
    ],
    hobby: [
      '変な石を集める', '料理（味は微妙）', '天体観測', '日記を書く', '剣術の修行',
      '絵を描く（風景だけ）', '植物を育てる', 'ジグソーパズル', '釣り', '手作り',
      '推理小説を読む', '編み物', '骨董品を集める', '書道', '古いレコードを聴く',
      '機械を分解して組み立てる', '茶道', '彫刻', '占い', 'エクストリームスポーツ',
    ],
  },
  en: {
    personality: [
      'Tsundere', 'Airhead', 'Cool-headed', 'Hot-blooded', 'Scheming', 'Cheerful', 'Melancholic', 'Sharp-tongued',
      'Gentle & caring', 'Easygoing', 'Serious & stubborn', 'Rebellious', 'Timid & shy', 'Confident', 'Mysterious',
      'Strong sense of justice', 'Pessimistic', 'Insatiably curious', 'Possessive', 'Jealous', 'Extremely disciplined', 'Free-spirited',
      'Loyal & reliable', 'Fickle', 'Clingy', 'Mature', 'Childish', 'Aloof', 'Hospitable',
    ],
    appearance: [
      'Heterochromia', 'Silver long hair', 'Twin-tails', 'Eyepatch', 'Beauty mark under eye', 'Cat ears', 'Prosthetic limb', 'Elf ears',
      'Waist-length red hair', 'Short cropped hair', 'Braids', 'Wolf cut', 'Bangs covering one eye', 'Highlighted streaks', 'Fangs',
      'Tall & slender', 'Petite', 'Muscular build', 'Pale skin', 'Tanned skin', 'Porcelain-doll features',
      'Scar under left eye', 'Tattoos', 'Patterned irises', 'Always wears gloves', 'Ribbon around neck',
    ],
    outfit: [
      'Gothic Lolita', 'Yukata', 'Knight armor', 'Casual modern', 'Mage robe', 'Military uniform',
      'Hoodie', 'Sailor uniform', 'Furisode kimono', 'Business suit', 'Punk style', 'Country dress',
      'Mechanical exoskeleton', 'Ninja garb', 'Nun habit', 'Tracksuit', 'Tuxedo', 'Cheongsam',
      'Cloak & cape', 'Leather jacket', 'Apron', 'Lab coat', 'Dancer outfit', 'Hunting robe',
    ],
    background: [
      'Last heir of a fallen noble house', 'Orphanage-raised', 'Cursed royalty', 'Border village hunter',
      'Grand library curator', 'Wandering performer', 'Ex-special forces', 'Assistant to a genius inventor',
      'Experiment-altered homunculus', 'Deep-sea salvager', 'Interstellar smuggler', 'Shrine maiden of an ancient shrine',
      'Dungeon delver', 'Royal body double', 'Hunted assassin', 'Ordinary high-schooler (secret identity)',
      'Otherworld reincarnate', 'Amnesiac traveler', 'Half-dragon hybrid', 'Adopted outsider',
    ],
    catchphrase: [
      "Hmph, i-it's not like I did this for you!", "I'll let you off this once.", "Things are getting interesting.",
      "Leave it to me, it'll be fine.", "...Boring.", "Oh? Isn't it obvious?",
      "Don't come near me.", "I'll protect everyone!", "That\'s nothing special.", "No way!",
      "I believe in you.", "Geez, I guess I have no choice.", "This must be fate.", "Just you wait.",
      "So sleepy... five more minutes.", "Because I'm the strongest, obviously.", "Don't touch my things.",
    ],
    flaw: [
      'Hopeless sense of direction', 'Acrophobia', 'Social anxiety', 'Obsessive', 'Impulsive', 'Chronic procrastinator', 'Indecisive',
      'Overprotective', 'Trust issues', 'Perfectionist', 'Jealous', 'Overly emotional', 'Sweet tooth',
      'Afraid of the dark', 'OCD tendencies', 'Can\'t be honest', 'Gives up easily', 'Too naive', 'Vindictive', 'Forgetful',
    ],
    secret: [
      'Actually has a split personality', 'Cries alone at night', 'Bears a clan-extermination grudge', 'Houses another soul inside',
      'Secretly royal bastard', 'Holds the key to destroying the world', 'Once killed a close friend with own hands',
      'Has been impersonating someone all along', 'Can see the future (refuses to use it)', 'Not actually human',
      'Secretly in love with the worst possible person', 'Holds evidence that could topple a nation', 'Searching for a lost twin sibling',
      'Actually a time traveler', 'Possesses immortality', 'Seals an ancient evil spirit within body',
    ],
    hobby: [
      'Collecting odd stones', 'Cooking (taste is questionable)', 'Stargazing', 'Keeping a diary', 'Sword practice',
      'Drawing (landscapes only)', 'Growing plants', 'Jigsaw puzzles', 'Fishing', 'Handicrafts',
      'Reading detective novels', 'Braiding hair', 'Collecting antiques', 'Calligraphy', 'Listening to old records',
      'Disassembling & reassembling machines', 'Tea ceremony', 'Sculpting', 'Fortune-telling', 'Extreme sports',
    ],
  },
  ru: {
    personality: [
      'Цундэрэ', 'Природная забывчивость', 'Хладнокровие', 'Горячая кровь', 'Коварство', 'Оптимизм', 'Меланхоличность', 'Язвительность',
      'Нежность и забота', 'Беззаботность', 'Серьёзность и упрямство', 'Бунтарство', 'Застенчивость', 'Уверенность', 'Загадочность',
      'Сильное чувство справедливости', 'Пессимизм', 'Неутолимое любопытство', 'Собственничество', 'Ревность', 'Дисциплинированность', 'Свободолюбие',
      'Верность', 'Капризность', 'Нежность', 'Зрелость', 'Детскость', 'Холодная отстранённость', 'Гостеприимство',
    ],
    appearance: [
      'Разноглазие', 'Серебристые длинные волосы', 'Два хвостика', 'Повязка на глаз', 'Родинка под глазом', 'Кошачьи ушки', 'Протез', 'Эльфийские уши',
      'Рыжие волосы до пояса', 'Короткая стрижка', 'Косички', 'Волчья стрижка', 'Чёлка закрывает глаз', 'Цветные пряди', 'Клыки',
      'Высокий и стройный', 'Миниатюрный', 'Мускулистый', 'Бледная кожа', 'Загорелая кожа', 'Фарфоровая внешность',
      'Шрам под левым глазом', 'Татуировки', 'Узоры в глазах', 'Всегда в перчатках', 'Лента на шее',
    ],
    outfit: [
      'Готическая лолита', 'Юката', 'Рыцарские доспехи', 'Повседневная одежда', 'Мантия мага', 'Военная форма',
      'Худи', 'Морячка', 'Кимоно фуросодэ', 'Деловой костюм', 'Панк', 'Сельское платье',
      'Механический экзоскелет', 'Одеяние ниндзя', 'Монашеский наряд', 'Спортивный костюм', 'Смокинг', 'Платье ципао',
      'Плащ', 'Кожаная куртка', 'Фартук', 'Лабораторный халат', 'Костюм танцовщицы', 'Охотничий наряд',
    ],
    background: [
      'Последний наследник падшего рода', 'Воспитанный в сиротском приюте', 'Проклятая королевская кровь', 'Охотник приграничной деревни',
      'Хранитель великой библиотеки', 'Бродячий артист', 'Бывший спецназовец', 'Помощник гения-изобретателя',
      'Гомункул после эксперимента', 'Глубоководный добытчик', 'Межзвёздный контрабандист', 'Жрица древнего храма',
      'Исследователь подземелий', 'Двойник королевской особы', 'Преследуемый ассасин', 'Обычный старшеклассник (с секретом)',
      'Реинкарнант из другого мира', 'Путник без памяти', 'Полукровка дракона и человека', 'Приёмный аутсайдер',
    ],
    catchphrase: [
      'Хм, н-не из-за тебя это!', 'На этот раз прощу.', 'Становится интересно.',
      'Поручи мне, всё будет хорошо.', '...Скучно.', 'Разве не очевидно?',
      'Не подходи ко мне.', 'Я защищу всех!', 'Это ничего не значит.', 'Ни за что!',
      'Я верю в тебя.', 'Ладно, у меня нет выбора.', 'Это судьба.', 'Только посмотри.',
      'Так сонно... ещё пять минут.', 'Потому что я сильнейшая.', 'Не трогай мои вещи.',
    ],
    flaw: [
      'Полное отсутствие чувства направления', 'Боязнь высоты', 'Социофобия', 'Одержимость', 'Импульсивность', 'Хронический лентяй', 'Нерешительность',
      'Избыточная опека', 'Недоверие', 'Перфекционизм', 'Ревнивость', 'Эмоциональность', 'Сладкоежка',
      'Боязнь темноты', 'Навязчивые мысли', 'Неспособность быть честным', 'Склонность сдаваться', 'Наивность', 'Мстительность', 'Забывчивость',
    ],
    secret: [
      'На самом деле раздвоение личности', 'Плачет по ночам в одиночестве', 'Несёт жажду мести за род', 'Внутри живёт другая душа',
      'Тайный бастард королевской крови', 'Владеет ключом к разрушению мира', 'Когда-то убил близкого друга',
      'Всё это время выдаёт себя за другого', 'Видит будущее (но отказывается использовать)', 'На самом деле не человек',
      'Тайно влюблён в худшего из возможных кандидатов', 'Владеет уликами против правительства', 'Ищет потерянного близнеца',
      'На самом деле путешественник во времени', 'Бессмертен', 'В теле запечатан древний демон',
    ],
    hobby: [
      'Собирает странные камешки', 'Готовит (вкус сомнителен)', 'Наблюдение за звёздами', 'Ведение дневника', 'Тренировки с мечом',
      'Рисование (только пейзажи)', 'Выращивание растений', 'Пазлы', 'Рыбалка', 'Рукоделие',
      'Чтение детективов', 'Плетение косичек', 'Коллекционирование антиквариата', 'Каллиграфия', 'Старые пластинки',
      'Разборка и сборка механизмов', 'Чайная церемония', 'Скульптура', 'Гадание', 'Экстремальные виды спорта',
    ],
  },
};

// Fallback to English for unsupported languages
function getPool(language: AppLanguage): Record<InspirationCategory, string[]> {
  return POOLS[language as keyof typeof POOLS] ?? POOLS.en;
}

function getCategoryLabel(category: InspirationCategory, language: AppLanguage): string {
  const map: Record<string, Record<InspirationCategory, string>> = {
    zh: { personality: '性格', appearance: '外貌', outfit: '服装', background: '背景', catchphrase: '口头禅', flaw: '缺陷', secret: '秘密', hobby: '爱好' },
    ja: { personality: '性格', appearance: '外見', outfit: '服装', background: '背景', catchphrase: '口癖', flaw: '欠点', secret: '秘密', hobby: '趣味' },
    en: { personality: 'Personality', appearance: 'Appearance', outfit: 'Outfit', background: 'Background', catchphrase: 'Catchphrase', flaw: 'Flaw', secret: 'Secret', hobby: 'Hobby' },
    ru: { personality: 'Характер', appearance: 'Внешность', outfit: 'Одежда', background: 'Прошлое', catchphrase: 'Фраза', flaw: 'Недостаток', secret: 'Тайна', hobby: 'Хобби' },
    ko: { personality: '성격', appearance: '외모', outfit: '의상', background: '배경', catchphrase: '입버릇', flaw: '결점', secret: '비밀', hobby: '취미' },
  };
  return (map[language] ?? map.en)[category];
}

function getCategoryIcon(category: InspirationCategory): string {
  const icons: Record<InspirationCategory, string> = {
    personality: '✦', appearance: '✧', outfit: '👘', background: '✉', catchphrase: '💬', flaw: '⚡', secret: '🔒', hobby: '♪',
  };
  return icons[category];
}

function seededRandom(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
  }
  const v = (h >>> 0) / 4294967296;
  return v;
}

function pickRandom<T>(arr: T[], seedBase: string, index: number): T {
  const r = seededRandom(`${seedBase}:${index}`);
  return arr[Math.floor(r * arr.length)];
}

function generateSet(language: AppLanguage, seedBase?: string): InspirationEntry[] {
  const pool = getPool(language);
  const seed = seedBase || `${Date.now()}:${Math.random().toString(36).slice(2, 8)}`;
  const categories: InspirationCategory[] = ['personality', 'appearance', 'outfit', 'background', 'catchphrase', 'flaw', 'secret', 'hobby'];
  return categories.map((category, i) => ({
    category,
    value: pickRandom(pool[category], seed, i),
    locked: false,
  }));
}

// ─── Local storage helpers ───

const STORAGE_KEY = 'oc-maker.inspiration-generator';
const HISTORY_KEY = 'oc-maker.inspiration-history';
const FAVORITES_KEY = 'oc-maker.inspiration-favorites';

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

// ─── Page component ───

type InspirationGeneratorPageProps = {
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
  onOpenDocs?: (toolId?: string, section?: string, errorCode?: string) => void;
};

export default function InspirationGeneratorPage({
  appSubtitle,
  backHome,
  openSettings,
  pageTitle,
  pageDescription,
  settings,
  language,
  onBack,
  onOpenSettings,
}: InspirationGeneratorPageProps) {
  const pool = useMemo(() => getPool(language), [language]);

  const [entries, setEntries] = useState<InspirationEntry[]>(() => {
    const saved = loadState<InspirationEntry[]>(STORAGE_KEY, []);
    if (saved && saved.length > 0) return saved;
    return generateSet(language);
  });

  const [history, setHistory] = useState<InspirationSet[]>(() => loadState<InspirationSet[]>(HISTORY_KEY, []));
  const [favorites, setFavorites] = useState<InspirationSet[]>(() => loadState<InspirationSet[]>(FAVORITES_KEY, []));
  const [showHistory, setShowHistory] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [copied, setCopied] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [favorited, setFavorited] = useState(false);
  const timeoutRefs = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    return () => {
      timeoutRefs.current.forEach(clearTimeout);
      timeoutRefs.current = [];
    };
  }, []);

  useEffect(() => {
    saveState(STORAGE_KEY, entries);
  }, [entries]);

  useEffect(() => {
    saveState(HISTORY_KEY, history.slice(0, 50));
  }, [history]);

  useEffect(() => {
    saveState(FAVORITES_KEY, favorites.slice(0, 100));
  }, [favorites]);

  const regenerateAll = useCallback(() => {
    playSound('workflowStart');
    const seed = `${Date.now()}:${Math.random().toString(36).slice(2, 10)}`;
    let nextEntries: InspirationEntry[] = [];
    setEntries((prev) => {
      nextEntries = prev.map((entry, i) =>
        entry.locked ? entry : { ...entry, value: pickRandom(pool[entry.category], seed, i) },
      );
      return nextEntries;
    });
    const snapshot: InspirationSet = { id: seed, createdAt: new Date().toISOString(), entries: nextEntries };
    setHistory((h) => [snapshot, ...h].slice(0, 50));
  }, [pool]);

  const regenerateOne = useCallback((category: InspirationCategory) => {
    playSound('refresh');
    const seed = `${Date.now()}:${Math.random().toString(36).slice(2, 10)}`;
    setEntries((prev) =>
      prev.map((entry, i) =>
        entry.category === category && !entry.locked
          ? { ...entry, value: pickRandom(pool[category], seed, i) }
          : entry,
      ),
    );
    setAnimationKey((k) => k + 1);
  }, [pool]);

  const toggleLock = useCallback((category: InspirationCategory) => {
    setEntries((prev) =>
      prev.map((entry) => {
        if (entry.category !== category) return entry;
        const nextLocked = !entry.locked;
        playSound(nextLocked ? 'toggleOn' : 'toggleOff');
        return { ...entry, locked: nextLocked };
      }),
    );
  }, []);

  const copyAll = useCallback(() => {
    const text = entries
      .map((e) => `${getCategoryLabel(e.category, language)}: ${e.value}`)
      .join('\n');
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      playSound('copySound');
      timeoutRefs.current.push(setTimeout(() => setCopied(false), 1500));
    }).catch(() => {
      playSound('error');
    });
  }, [entries, language]);

  const exportJson = useCallback(() => {
    try {
      const payload = {
        tool: 'inspiration-generator',
        generatedAt: new Date().toISOString(),
        language,
        entries: entries.map((e) => ({
          category: e.category,
          label: getCategoryLabel(e.category, language),
          value: e.value,
          locked: e.locked,
        })),
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `inspiration-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      timeoutRefs.current.push(setTimeout(() => {
        a.remove();
        URL.revokeObjectURL(url);
      }, 0));
      playSound('downloadSound');
    } catch {
      playSound('error');
    }
  }, [entries, language]);

  const addToFavorites = useCallback(() => {
    const snapshotEntries = entries.map((e) => ({ ...e }));
    const isDuplicate = favorites.some((f) =>
      f.entries.length === snapshotEntries.length &&
      f.entries.every((fe, i) => fe.category === snapshotEntries[i].category && fe.value === snapshotEntries[i].value)
    );
    if (isDuplicate) {
      playSound('error');
      return;
    }
    const snapshot: InspirationSet = {
      id: `${Date.now()}:${Math.random().toString(36).slice(2, 8)}`,
      createdAt: new Date().toISOString(),
      entries: snapshotEntries,
    };
    setFavorites((prev) => [snapshot, ...prev].slice(0, 100));
    setFavorited(true);
    playSound('save');
    timeoutRefs.current.push(setTimeout(() => setFavorited(false), 1500));
  }, [entries, favorites]);

  const loadSet = useCallback((set: InspirationSet) => {
    setEntries(set.entries.map((e) => ({ ...e })));
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
    setEntries(generateSet(language));
    playSound('resetSound');
  }, [language]);

  const allLocked = entries.every((e) => e.locked);
  const anyLocked = entries.some((e) => e.locked);

  const labels = useMemo(() => {
    const map: Record<string, Record<string, string>> = {
      zh: {
        generateAll: '一键生成', regenerate: '刷新', lock: '锁定', unlock: '解锁', copy: '复制全部',
        exportJson: '导出 JSON', favorite: '收藏此组合', favorites: '收藏夹', history: '历史记录',
        emptyHistory: '暂无历史记录', emptyFavorites: '暂无收藏', load: '加载', delete: '删除',
        clearHistory: '清空历史', confirmClear: '再次点击确认清空', resetAll: '全部重置',
        lockedHint: '已锁定的条目不会被刷新', allLockedWarning: '所有条目均已锁定，请先解锁部分条目再生成',
        saved: '已保存', copied: '已复制', generateHint: '点击生成随机角色灵感组合。锁定的条目会保留。',
      },
      ja: {
        generateAll: '一括生成', regenerate: '更新', lock: 'ロック', unlock: '解除', copy: 'すべてコピー',
        exportJson: 'JSON 出力', favorite: 'お気に入り登録', favorites: 'お気に入り', history: '履歴',
        emptyHistory: '履歴はありません', emptyFavorites: 'お気に入りはありません', load: '読み込む', delete: '削除',
        clearHistory: '履歴を消去', confirmClear: 'もう一度タップして確認', resetAll: 'すべてリセット',
        lockedHint: 'ロック中の項目は更新されません', allLockedWarning: 'すべてロック中です。一部解除してから生成してください',
        saved: '保存しました', copied: 'コピーしました', generateHint: 'ランダムなキャラ灵感を生成します。ロック中の項目は保持されます。',
      },
      en: {
        generateAll: 'Generate All', regenerate: 'Reroll', lock: 'Lock', unlock: 'Unlock', copy: 'Copy All',
        exportJson: 'Export JSON', favorite: 'Add to Favorites', favorites: 'Favorites', history: 'History',
        emptyHistory: 'No history yet', emptyFavorites: 'No favorites yet', load: 'Load', delete: 'Delete',
        clearHistory: 'Clear History', confirmClear: 'Tap again to confirm', resetAll: 'Reset All',
        lockedHint: 'Locked items are preserved when generating', allLockedWarning: 'All items are locked. Unlock some before generating.',
        saved: 'Saved', copied: 'Copied', generateHint: 'Click to generate a random character inspiration combo. Locked items stay.',
      },
      ru: {
        generateAll: 'Сгенерировать всё', regenerate: 'Обновить', lock: 'Заблокировать', unlock: 'Разблокировать', copy: 'Копировать всё',
        exportJson: 'Экспорт JSON', favorite: 'В избранное', favorites: 'Избранное', history: 'История',
        emptyHistory: 'История пуста', emptyFavorites: 'Избранное пусто', load: 'Загрузить', delete: 'Удалить',
        clearHistory: 'Очистить историю', confirmClear: 'Нажмите ещё раз для подтверждения', resetAll: 'Сбросить всё',
        lockedHint: 'Заблокированные пункты сохраняются при генерации', allLockedWarning: 'Всё заблокировано. Разблокируйте что-нибудь перед генерацией.',
        saved: 'Сохранено', copied: 'Скопировано', generateHint: 'Нажмите для генерации случайного образа. Заблокированные пункты останутся.',
      },
      ko: {
        generateAll: '전체 생성', regenerate: '새로고침', lock: '잠금', unlock: '잠금 해제', copy: '전체 복사',
        exportJson: 'JSON 납품하기', favorite: '즐겨찾기에 추가', favorites: '즐겨찾기', history: '기록',
        emptyHistory: '기록이 없습니다', emptyFavorites: '즐겨찾기가 없습니다', load: '불러오기', delete: '삭제',
        clearHistory: '기록 지우기', confirmClear: '다시 탭하여 확인', resetAll: '전체 초기화',
        lockedHint: '잠금된 항목은 생성 시 보존', allLockedWarning: '모두 잠금 상태입니다. 생성 전 일부를 해제하세요.',
        saved: '저장 완료', copied: '복사 완료', generateHint: '랜덤 캐릭터灵감 콤보를 생성합니다. 잠금된 항목은 유지됩니다.',
      },
    };
    return map[language] ?? map.en;
  }, [language]);

  return (
    <main className="feature-shell tool-page-shell">
      <header className="feature-header fade-up delay-1">
        <div className="feature-header-meta">
          <button className="back-link" type="button" data-sfx-handled onClick={() => { playSound('back'); onBack(); }}>
            ← {backHome}
          </button>
        </div>
        <div className="tool-header-actions">
          <button className="secondary-button small-button" type="button" data-sfx-handled onClick={() => { playSound('settingsOpen'); onOpenSettings(); }}>
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
              title={allLocked ? labels.allLockedWarning : labels.generateHint}
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

        <div className="tool-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
          {entries.map((entry) => (
            <InspirationCard
              key={`${entry.category}-${animationKey}`}
              entry={entry}
              language={language}
              labels={labels}
              reduceAnimations={settings.performance.reduceAnimations}
              onRegenerate={() => regenerateOne(entry.category)}
              onToggleLock={() => toggleLock(entry.category)}
            />
          ))}
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
            <div className="tool-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12, marginTop: 12 }}>
              {history.map((set) => (
                <HistoryCard key={set.id} set={set} language={language} labels={labels} onLoad={() => loadSet(set)} />
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
            <div className="tool-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12, marginTop: 12 }}>
              {favorites.map((set) => (
                <HistoryCard
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

// ─── Sub-components ───

function InspirationCard({
  entry,
  language,
  labels,
  reduceAnimations,
  onRegenerate,
  onToggleLock,
}: {
  entry: InspirationEntry;
  language: AppLanguage;
  labels: Record<string, string>;
  reduceAnimations?: boolean;
  onRegenerate: () => void;
  onToggleLock: () => void;
}) {
  const [show, setShow] = useState(!!reduceAnimations);
  useEffect(() => {
    if (reduceAnimations) {
      setShow(true);
      return;
    }
    const t = setTimeout(() => setShow(true), 60);
    return () => clearTimeout(t);
  }, [reduceAnimations]);

  return (
    <div
      className="tool-card"
      style={{
        opacity: show ? 1 : 0,
        transform: show ? 'translateY(0)' : 'translateY(12px)',
        transition: 'opacity 260ms ease, transform 260ms ease',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {entry.locked && (
        <div
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            fontSize: 18,
            opacity: 0.6,
          }}
          title="Locked"
          aria-hidden="true"
        >
          🔒
        </div>
      )}
      <div className="tool-card-header" style={{ marginBottom: 10 }}>
        <div>
          <span className="card-caption">
            {getCategoryIcon(entry.category)} {getCategoryLabel(entry.category, language)}
          </span>
        </div>
      </div>
      <p
        style={{
          fontSize: '1.18rem',
          lineHeight: 1.45,
          margin: '0 0 16px',
          minHeight: 56,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {entry.value}
      </p>
      <div className="mini-action-row">
        <button
          className="secondary-button small-button"
          type="button"
          onClick={onRegenerate}
          disabled={entry.locked}
          data-sfx-handled
        >
          {labels.regenerate}
        </button>
        <button
          className={`secondary-button small-button ${entry.locked ? 'active' : ''}`}
          type="button"
          onClick={onToggleLock}
          aria-pressed={entry.locked}
          data-sfx-handled
        >
          {entry.locked ? labels.unlock : labels.lock}
        </button>
      </div>
    </div>
  );
}

function HistoryCard({
  set,
  language,
  labels,
  onLoad,
  onDelete,
}: {
  set: InspirationSet;
  language: AppLanguage;
  labels: Record<string, string>;
  onLoad: () => void;
  onDelete?: () => void;
}) {
  const date = new Date(set.createdAt).toLocaleString(language === 'zh' ? 'zh-CN' : language === 'ja' ? 'ja-JP' : language === 'ko' ? 'ko-KR' : language === 'ru' ? 'ru-RU' : 'en-US');
  const preview = set.entries.slice(0, 3).map((e) => `${getCategoryLabel(e.category, language)}: ${e.value}`).join(' · ');

  return (
    <div className="tool-card" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <span className="card-caption" style={{ fontSize: 11 }}>{date}</span>
      <p style={{ fontSize: 13, lineHeight: 1.5, margin: 0, opacity: 0.85, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
        {preview}…
      </p>
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
