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
type InterviewMode = 'classic' | 'late-night' | 'casual' | 'confrontational';

interface InterviewQA {
  id: string;
  question: string;
  answer: string;
}

interface InterviewSession {
  id: string;
  characterName: string;
  characterInfo: string;
  mode: InterviewMode;
  qa: InterviewQA[];
  createdAt: string;
  updatedAt: string;
}

interface CardData {
  name: string;
  alias: string;
  avatarAssetId: string | null;
  mainImageAssetId: string | null;
  themeColor: string;
  fields: Array<{ id: string; label: string; value: string }>;
  tags: Array<{ id: string; text: string; color: string }>;
  bio: string;
}

// ─── Localization ───
const UI_COPY: Record<string, Record<string, string>> = {
  zh: {
    newInterview: '新建访谈',
    loadCharacter: '加载角色',
    manualCharacter: '手动输入',
    characterName: '角色名称',
    characterInfo: '角色简介',
    selectMode: '选择访谈模式',
    modeClassic: '经典问答',
    modeClassicDesc: '15 个经典角色开发问题，深入挖掘角色内核',
    modeLateNight: '深夜电台',
    modeLateNightDesc: '更私人的问题，探索角色不为人知的一面',
    modeCasual: '轻松闲聊',
    modeCasualDesc: '日常生活话题，让角色展现自然的一面',
    modeConfrontational: '对抗性访谈',
    modeConfrontationalDesc: '尖锐的问题，测试角色在压力下的反应',
    startInterview: '开始访谈',
    question: '提问',
    answer: '回答',
    answerPlaceholder: '输入角色的回答…',
    aiSuggest: 'AI 建议',
    aiSuggestDesc: '基于角色信息生成回答建议',
    generating: '生成中…',
    saveSession: '保存记录',
    exportMarkdown: '导出 Markdown',
    copy: '复制',
    copied: '已复制',
    copyFailed: '复制失败，请手动复制',
    close: '关闭',
    emptyAnswer: '（尚未回答）',
    progress: '进度',
    history: '历史记录',
    noHistory: '暂无访谈记录',
    deleteConfirm: '确定要删除这条访谈记录吗？',
    saveFailed: '保存失败：浏览器存储配额已满',
    untitled: '未命名角色',
    back: '返回',
    help: '帮助',
    settings: '设置',
    selectCharacter: '选择已有角色',
    or: '或',
    clearAll: '清空全部',
    confirmClear: '确定要清空所有回答吗？',
    randomQuestion: '随机问题',
    jumpToUnanswered: '跳转到未回答',
    allAnswered: '全部已回答',
    exportTitle: '导出访谈',
    copySuffix: '的访谈',
    useApiKey: '使用 API Key 生成更精准的回答建议',
  },
  ja: {
    newInterview: '新規インタビュー',
    loadCharacter: 'キャラ読込',
    manualCharacter: '手動入力',
    characterName: 'キャラ名',
    characterInfo: 'キャラ紹介',
    selectMode: 'インタビューモード選択',
    modeClassic: 'クラシックQ&A',
    modeClassicDesc: 'キャラ開発の定番15問で核心に迫る',
    modeLateNight: '深夜ラジオ',
    modeLateNightDesc: 'よりプライベートな質問で知られざる一面を探る',
    modeCasual: 'カジュアル雑談',
    modeCasualDesc: '日常トークで自然な一面を見せる',
    modeConfrontational: '対抗的インタビュー',
    modeConfrontationalDesc: '鋭い質問でプレッシャー下の反応を試す',
    startInterview: 'インタビュー開始',
    question: '質問',
    answer: '回答',
    answerPlaceholder: 'キャラの回答を入力…',
    aiSuggest: 'AI提案',
    aiSuggestDesc: 'キャラ情報から回答案を生成',
    generating: '生成中…',
    saveSession: '記録を保存',
    exportMarkdown: 'Markdown出力',
    copy: 'コピー',
    copied: 'コピー完了',
    copyFailed: 'コピーに失敗しました。手動でコピーしてください。',
    close: '閉じる',
    emptyAnswer: '（未回答）',
    progress: '進捗',
    history: '履歴',
    noHistory: 'インタビュー履歴はありません',
    deleteConfirm: 'このインタビュー記録を削除しますか？',
    saveFailed: '保存失敗：ブラウザのストレージ容量が不足しています',
    untitled: '無名キャラ',
    back: '戻る',
    help: 'ヘルプ',
    settings: '設定',
    selectCharacter: '既存キャラを選択',
    or: 'または',
    clearAll: '全てクリア',
    confirmClear: '全ての回答を削除しますか？',
    randomQuestion: 'ランダム質問',
    jumpToUnanswered: '未回答へジャンプ',
    allAnswered: '全て回答済み',
    exportTitle: 'インタビュー出力',
    copySuffix: 'のインタビュー',
    useApiKey: 'API Key を使ってより正確な回答案を生成',
  },
  en: {
    newInterview: 'New Interview',
    loadCharacter: 'Load Character',
    manualCharacter: 'Manual Entry',
    characterName: 'Character Name',
    characterInfo: 'Character Info',
    selectMode: 'Select Interview Mode',
    modeClassic: 'Classic Q&A',
    modeClassicDesc: '15 classic character development questions to dig deep',
    modeLateNight: 'Late Night Radio',
    modeLateNightDesc: 'More personal questions to explore hidden sides',
    modeCasual: 'Casual Chat',
    modeCasualDesc: 'Everyday topics that let the character feel natural',
    modeConfrontational: 'Confrontational',
    modeConfrontationalDesc: 'Sharp questions to test reactions under pressure',
    startInterview: 'Start Interview',
    question: 'Question',
    answer: 'Answer',
    answerPlaceholder: "Type the character's response…",
    aiSuggest: 'AI Suggest',
    aiSuggestDesc: 'Generate an answer suggestion based on character info',
    generating: 'Generating…',
    saveSession: 'Save Session',
    exportMarkdown: 'Export Markdown',
    copy: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy failed. Please copy manually.',
    close: 'Close',
    emptyAnswer: '(Not answered yet)',
    progress: 'Progress',
    history: 'History',
    noHistory: 'No interview history yet',
    deleteConfirm: 'Delete this interview record?',
    saveFailed: 'Save failed: browser storage quota exceeded',
    untitled: 'Unnamed Character',
    back: 'Back',
    help: 'Help',
    settings: 'Settings',
    selectCharacter: 'Select Existing Character',
    or: 'or',
    clearAll: 'Clear All',
    confirmClear: 'Clear all answers?',
    randomQuestion: 'Random Question',
    jumpToUnanswered: 'Jump to Unanswered',
    allAnswered: 'All Answered',
    exportTitle: 'Export Interview',
    copySuffix: "'s Interview",
    useApiKey: 'Use API Key for more accurate suggestions',
  },
  ru: {
    newInterview: 'Новое интервью',
    loadCharacter: 'Загрузить персонажа',
    manualCharacter: 'Ручной ввод',
    characterName: 'Имя персонажа',
    characterInfo: 'Описание персонажа',
    selectMode: 'Выберите режим интервью',
    modeClassic: 'Классические вопросы',
    modeClassicDesc: '15 классических вопросов для разработки персонажа',
    modeLateNight: 'Ночное радио',
    modeLateNightDesc: 'Более личные вопросы для изучения скрытых сторон',
    modeCasual: 'Лёгкая беседа',
    modeCasualDesc: 'Повседневные темы, чтобы персонаж раскрылся естественно',
    modeConfrontational: 'Агрессивное интервью',
    modeConfrontationalDesc: 'Острые вопросы для проверки реакции под давлением',
    startInterview: 'Начать интервью',
    question: 'Вопрос',
    answer: 'Ответ',
    answerPlaceholder: 'Введите ответ персонажа…',
    aiSuggest: 'Предложение ИИ',
    aiSuggestDesc: 'Сгенерировать вариант ответа на основе информации о персонаже',
    generating: 'Генерация…',
    saveSession: 'Сохранить запись',
    exportMarkdown: 'Экспорт в Markdown',
    copy: 'Копировать',
    copied: 'Скопировано',
    copyFailed: 'Не удалось скопировать. Скопируйте вручную.',
    close: 'Закрыть',
    emptyAnswer: '(Пока без ответа)',
    progress: 'Прогресс',
    history: 'История',
    noHistory: 'История интервью пуста',
    deleteConfirm: 'Удалить эту запись интервью?',
    saveFailed: 'Ошибка сохранения: превышена квота хранилища браузера',
    untitled: 'Безымянный персонаж',
    back: 'Назад',
    help: 'Справка',
    settings: 'Настройки',
    selectCharacter: 'Выбрать существующего персонажа',
    or: 'или',
    clearAll: 'Очистить всё',
    confirmClear: 'Очистить все ответы?',
    randomQuestion: 'Случайный вопрос',
    jumpToUnanswered: 'К неотвеченным',
    allAnswered: 'Все отвечены',
    exportTitle: 'Экспорт интервью',
    copySuffix: ' — интервью',
    useApiKey: 'Используйте API Key для более точных предложений',
  },
  ko: {
    newInterview: '새 인터뷰',
    loadCharacter: '캐릭터 불러오기',
    manualCharacter: '수동 입력',
    characterName: '캐릭터 이름',
    characterInfo: '캐릭터 소개',
    selectMode: '인터뷰 모드 선택',
    modeClassic: '클래식 Q&A',
    modeClassicDesc: '캐릭터 핵심을 파고드는 15개의 클래식 질문',
    modeLateNight: '심야 라디오',
    modeLateNightDesc: '더욱 사적인 질문으로 알려지지 않은 면을 탐구',
    modeCasual: '가벼운 수다',
    modeCasualDesc: '일상적인 주제로 자연스러운 모습을 보여줍니다',
    modeConfrontational: '대립형 인터뷰',
    modeConfrontationalDesc: '날카로운 질문으로 압박 상황에서의 반응을 테스트',
    startInterview: '인터뷰 시작',
    question: '질문',
    answer: '답변',
    answerPlaceholder: '캐릭터의 답변을 입력하세요…',
    aiSuggest: 'AI 제안',
    aiSuggestDesc: '캐릭터 정보를 바탕으로 답변 안을 생성',
    generating: '생성 중…',
    saveSession: '기록 저장',
    exportMarkdown: 'Markdown 내보내기',
    copy: '복사',
    copied: '복사 완료',
    copyFailed: '복사 실패. 수동으로 복사해 주세요.',
    close: '닫기',
    emptyAnswer: '(아직 답변 없음)',
    progress: '진행률',
    history: '기록',
    noHistory: '인터뷰 기록이 없습니다',
    deleteConfirm: '이 인터뷰 기록을 삭제하시겠습니까?',
    saveFailed: '저장 실패: 브라우저 저장 공간이 부족합니다',
    untitled: '이름 없는 캐릭터',
    back: '뒤로',
    help: '도움말',
    settings: '설정',
    selectCharacter: '기존 캐릭터 선택',
    or: '또는',
    clearAll: '전체 삭제',
    confirmClear: '모든 답변을 삭제하시겠습니까?',
    randomQuestion: '랜덤 질문',
    jumpToUnanswered: '미답변으로 이동',
    allAnswered: '모두 답변 완료',
    exportTitle: '인터뷰 내보내기',
    copySuffix: '의 인터뷰',
    useApiKey: 'API Key를 사용하여 더 정확한 제안 생성',
  },
};

// ─── Question banks ───
const QUESTION_BANKS: Record<InterviewMode, Record<string, string[]>> = {
  classic: {
    zh: [
      '请用一句话介绍你自己。',
      '你最大的优点是什么？',
      '你最大的缺点是什么？',
      '你最害怕失去什么？',
      '你人生中最后悔的事是什么？',
      '你最珍视的回忆是什么？',
      '如果可以和任何人共进晚餐，你会选谁？',
      '你认为什么是正义？',
      '你会为了什么不惜一切代价？',
      '你最讨厌什么样的人？',
      '你理想中的生活是什么样的？',
      '你心中最大的秘密是什么？',
      '你对死亡有什么看法？',
      '如果可以改变过去的一件事，你会选择什么？',
      '你觉得自己最大的成就是什么？',
    ],
    ja: [
      '一言で自己紹介をしてください。',
      'あなたの最大の強みは何ですか？',
      '最大の弱点は何ですか？',
      '何を失うのが一番恐ろしいですか？',
      '人生で一番後悔していることは？',
      '最も大切にしている思い出は？',
      '誰とでも夕食が取れるとしたら、誰を選びますか？',
      '正義とは何だと思いますか？',
      '何のためになんでも惜しみませんか？',
      'どんな人が一番嫌いですか？',
      '理想の生活とは？',
      '心の中で最大の秘密は？',
      '死についてどう思いますか？',
      '過去を一つ変えられるとしたら、何を変えますか？',
      '自分の最大の成果は何だと思いますか？',
    ],
    en: [
      'Introduce yourself in one sentence.',
      'What is your greatest strength?',
      'What is your greatest weakness?',
      'What are you most afraid of losing?',
      'What do you regret the most in life?',
      'What is your most treasured memory?',
      'If you could have dinner with anyone, who would you choose?',
      'What do you think justice is?',
      'What would you do anything for?',
      'What kind of person do you dislike the most?',
      'What does your ideal life look like?',
      'What is your deepest secret?',
      'How do you feel about death?',
      'If you could change one thing from your past, what would it be?',
      'What do you consider your greatest achievement?',
    ],
    ru: [
      'Представьтесь в одном предложении.',
      'Ваша главная сила?',
      'Ваш главный недостаток?',
      'Чего вы больше всего боитесь потерять?',
      'О чём вы больше всего сожалеете в жизни?',
      'Какое воспоминание вы цените больше всего?',
      'С кем бы вы поужинали, если бы могли выбрать кого угодно?',
      'Что такое справедливость по-вашему?',
      'Ради чего вы готовы на всё?',
      'Какие люди вам больше всего неприятны?',
      'Как выглядит ваша идеальная жизнь?',
      'Какая у вас самая глубокая тайна?',
      'Как вы относитесь к смерти?',
      'Если бы вы могли изменить одно событие в прошлом, что бы вы выбрали?',
      'Что вы считаете своим величайшим достижением?',
    ],
    ko: [
      '한 문장으로 자신을 소개해 주세요.',
      '당신의 가장 큰 장점은 무엇인가요?',
      '가장 큰 단점은 무엇인가요?',
      '무엇을 잃는 것이 가장 두렵나요?',
      '인생에서 가장 후회하는 일은 무엇인가요?',
      '가장 소중히 여기는 추억은 무엇인가요?',
      '누구와든 저녁 식사를 할 수 있다면 누구를 고르겠습니까?',
      '정의란 무엇이라고 생각하나요?',
      '무엇을 위해라도 모든 것을 바치겠습니까?',
      '어떤 사람이 가장 싫습니까?',
      '이상적인 삶은 어떤 모습인가요?',
      '마음속 가장 큰 비밀은 무엇인가요?',
      '죽음에 대해 어떻게 생각하나요?',
      '과거의 한 가지를 바꿀 수 있다면 무엇을 바꾸겠습니까?',
      '자신의 최대 성취는 무엇이라고 생각하나요?',
    ],
  },
  'late-night': {
    zh: [
      '深夜独处时，你通常会想什么？',
      '有没有一个人，你从未告诉过他你真实的感受？',
      '你做过最疯狂的事是什么？',
      '如果可以匿名说一件事，你想说什么？',
      '你有没有偷偷羡慕过别人？',
      '你最想对过去的自己说什么？',
      '你觉得别人对你最大的误解是什么？',
      '如果明天是世界末日，你今天会做什么？',
      '你有没有一个从未实现的梦想？',
      '你最脆弱的时候是什么样的？',
      '如果可以穿越到未来，你最想看什么？',
      '你心中有没有一个永远无法放下的人？',
      '你觉得孤独是什么感觉？',
      '有没有一首歌让你一听到就想起某个人？',
      '如果可以删除一段记忆，你会选哪段？',
    ],
    ja: [
      '深夜ひとりのとき、普段何を考えていますか？',
      '本当の気持ちを伝えたことがない人はいますか？',
      '今までで一番狂ったことは？',
      '匿名で一つ言えるとしたら、何を言いますか？',
      'こっそり羨ましいと思った人はいますか？',
      '過去の自分に一番伝えたいことは？',
      '他人からの最大の誤解は何だと思いますか？',
      'もし明日が世界の終わりなら、今日何をしますか？',
      '叶わなかった夢はありますか？',
      '一番弱っているときはどんなときですか？',
      '未来に行けるとしたら、何が見たいですか？',
      '心から忘れられない人はいますか？',
      '孤独とはどんな感覚だと思いますか？',
      '誰かを思い出す一曲はありますか？',
      '一つだけ記憶を消せるとしたら、何を消しますか？',
    ],
    en: [
      'What do you usually think about when you are alone late at night?',
      'Is there someone you have never told your true feelings to?',
      'What is the craziest thing you have ever done?',
      'If you could say one thing anonymously, what would it be?',
      'Have you ever secretly envied someone?',
      'What do you most want to say to your past self?',
      'What do you think is the biggest misunderstanding others have about you?',
      'If tomorrow were the end of the world, what would you do today?',
      'Is there a dream you have never fulfilled?',
      'What are you like at your most vulnerable?',
      'If you could travel to the future, what would you want to see?',
      'Is there someone you can never let go of?',
      'What does loneliness feel like to you?',
      'Is there a song that instantly reminds you of someone?',
      'If you could erase one memory, which one would you choose?',
    ],
    ru: [
      'О чём вы обычно думаете, когда остаётесь один поздно ночью?',
      'Есть ли человек, которому вы никогда не говорили о своих истинных чувствах?',
      'Что самое безумное вы когда-либо делали?',
      'Если бы вы могли анонимно что-то сказать, что бы это было?',
      'Вы когда-нибудь тайно завидовали кому-то?',
      'Что вы больше всего хотели бы сказать своему прошлому я?',
      'Какое, по-вашему, самое большое заблуждение окружающих о вас?',
      'Если бы завтра был конец света, что бы вы сделали сегодня?',
      'Есть ли у вас несбывшаяся мечта?',
      'Какой вы в самые уязвимые моменты?',
      'Если бы вы могли отправиться в будущее, что бы вы хотели увидеть?',
      'Есть ли человек, которого вы никогда не сможете отпустить?',
      'Что для вас означает одиночество?',
      'Есть ли песня, которая сразу напоминает вам о ком-то?',
      'Если бы вы могли стерть одно воспоминание, какое бы вы выбрали?',
    ],
    ko: [
      '늦은 밤 혼자 있을 때 보통 무엇을 생각하나요?',
      '진심을 전한 적 없는 사람이 있나요?',
      '지금까지 한 가장 미친 짓은 무엇인가요?',
      '익명으로 한 가지 말할 수 있다면 무엇을 말하겠습니까?',
      '몰래 부러워했던 사람이 있나요?',
      '과거의 자신에게 가장 전하고 싶은 말은 무엇인가요?',
      '타인이 당신에 대해 가장 크게 오해하는 것은 무엇이라고 생각하나요?',
      '내일이 세상의 마지막이라면 오늘 무엇을 하겠습니까?',
      '이루지 못한 꿈이 있나요?',
      '가장 취약할 때의 당신은 어떤 모습인가요?',
      '미래로 갈 수 있다면 무엇을 보고 싶나요?',
      '마음속에 영원히 놓을 수 없는 사람이 있나요?',
      '고독은 어떤 느낌인가요?',
      '누군가를 떠올리게 하는 노래가 있나요?',
      '한 가지 기억만 지울 수 있다면 어떤 기억을 지우겠습니까?',
    ],
  },
  casual: {
    zh: [
      '你平时喜欢吃什么？',
      '你空闲时间最喜欢做什么？',
      '你有养宠物吗？或者想养什么？',
      '你喜欢什么季节？为什么？',
      '你最喜欢的颜色是什么？',
      '你平时怎么打发无聊的时间？',
      '你有没有什么特别的收藏？',
      '你喜欢听音乐吗？什么类型的？',
      '你最喜欢的电影是哪一部？',
      '你平时几点睡觉？是夜猫子还是早起型？',
      '你喜欢旅行吗？最想去的地方是哪里？',
      '你平时喝咖啡还是茶？',
      '你下雨的时候喜欢做什么？',
      '你觉得自己是内向还是外向？',
      '如果有一天的假期，你会怎么安排？',
    ],
    ja: [
      '普段好きな食べ物は何ですか？',
      '暇なときに一番好きなことは？',
      'ペットは飼っていますか？飼いたい動物は？',
      '好きな季節は何ですか？その理由は？',
      '一番好きな色は何ですか？',
      '退屈なときどうやって時間を潰しますか？',
      '特別なコレクションはありますか？',
      '音楽は好きですか？どんなジャンルが？',
      '一番好きな映画は何ですか？',
      '普段何時に寝ますか？夜型ですか朝型ですか？',
      '旅行は好きですか？一番行きたい場所は？',
      '普段コーヒー派ですかお茶派ですか？',
      '雨の日は何をするのが好きですか？',
      '自分は内向的だと思いますか、それとも外向的？',
      'もし一日休みがあったら、どう過ごしますか？',
    ],
    en: [
      'What do you usually like to eat?',
      'What do you enjoy doing in your free time?',
      'Do you have a pet? Or what would you like to have?',
      'What is your favorite season? Why?',
      'What is your favorite color?',
      'How do you usually pass the time when bored?',
      'Do you have any special collections?',
      'Do you like listening to music? What kind?',
      'What is your favorite movie?',
      'What time do you usually go to bed? Night owl or early bird?',
      'Do you like traveling? Where would you most like to go?',
      'Do you prefer coffee or tea?',
      'What do you like to do when it rains?',
      'Do you think you are introverted or extroverted?',
      'If you had one day off, how would you spend it?',
    ],
    ru: [
      'Что вы обычно любите есть?',
      'Чем вы любите заниматься в свободное время?',
      'У вас есть питомец? Или какого бы вы хотели?',
      'Какое ваше любимое время года? Почему?',
      'Какой ваш любимый цвет?',
      'Как вы обычно убиваете время, когда скучно?',
      'У вас есть какие-то особенные коллекции?',
      'Вы любите слушать музыку? Какую?',
      'Какой ваш любимый фильм?',
      'Во сколько вы обычно ложитесь спать? Сова или жаворонок?',
      'Вы любите путешествовать? Куда бы вы больше всего хотели поехать?',
      'Вы предпочитаете кофе или чай?',
      'Что вы любите делать, когда идёт дождь?',
      'Вы считаете себя интровертом или экстравертом?',
      'Если бы у вас был один выходной, как бы вы его провели?',
    ],
    ko: [
      '평소에 무엇을 좋아하나요?',
      '여가 시간에 가장 좋아하는 활동은 무엇인가요?',
      '반려동물을 키우나요? 키우고 싶은 동물은?',
      '가장 좋아하는 계절은 무엇인가요? 이유는?',
      '가장 좋아하는 색깔은 무엇인가요?',
      '지루할 때 보통 어떻게 시간을 보내나요?',
      '특별한 수집품이 있나요?',
      '음악을 좋아하나요? 어떤 장르를?',
      '가장 좋아하는 영화는 무엇인가요?',
      '보통 몇 시에 자나요? 올빼미형인가요 일찍 일어나는 편인가요?',
      '여행을 좋아하나요? 가장 가고 싶은 곳은 어디인가요?',
      '커피와 차 중 무엇을 더 좋아하나요?',
      '비 오는 날 무엇을 하는 것을 좋아하나요?',
      '자신이 내향적인 사람이라고 생각하나요, 아니면 외향적인 사람인가요?',
      '하루 휴가가 있다면 어떻게 보내겠습니까?',
    ],
  },
  confrontational: {
    zh: [
      '你做过什么无法原谅自己的事？',
      '如果有人背叛了你，你会怎么做？',
      '你有没有为了目的不择手段的时候？',
      '你觉得道德和利益冲突时，该选哪个？',
      '你能接受为了大局牺牲少数人吗？',
      '你有没有嫉妒到想毁掉别人的时刻？',
      '如果必须说谎才能保护重要的人，你会说吗？',
      '你觉得自己是个好人吗？为什么？',
      '你有没有利用过别人的信任？',
      '如果复仇能解决问题，你会选择复仇吗？',
      '你觉得你值得被原谅吗？',
      '你有没有假装善良的时候？',
      '如果你发现最信任的人在骗你，你会怎么做？',
      '你觉得弱者的存在有意义吗？',
      '如果可以不留痕迹地做一件坏事，你会做吗？',
    ],
    ja: [
      '自分が許せないことをしたことはありますか？',
      '誰かに裏切られたら、どうしますか？',
      '目的のためなら手段を選ばなかったことはありますか？',
      '道徳と利益が衝突したとき、どちらを選びますか？',
      '大局のため少数を犠牲にすることを受け入れられますか？',
      '妬みで誰かを壊したいと思ったことはありますか？',
      '大切な人を守るために嘘をつく必要があれば、つきますか？',
      '自分は善人だと思いますか？その理由は？',
      '誰かの信頼を利用したことはありますか？',
      '復讐で解決できるなら、復讐を選びますか？',
      '自分は許される価値があると思いますか？',
      '優良を装ったことはありますか？',
      '最も信頼している人が嘘をついていたら、どうしますか？',
      '弱者の存在に意味があると思いますか？',
      '痕跡を残さず悪事ができるなら、しますか？',
    ],
    en: [
      'Have you ever done something you cannot forgive yourself for?',
      'If someone betrayed you, what would you do?',
      'Have you ever done whatever it takes to achieve a goal?',
      'When morality and interest conflict, which should you choose?',
      'Can you accept sacrificing a few for the greater good?',
      'Have you ever been so jealous you wanted to destroy someone?',
      'If you had to lie to protect someone important, would you?',
      'Do you think you are a good person? Why?',
      'Have you ever taken advantage of someone\'s trust?',
      'If revenge could solve the problem, would you choose it?',
      'Do you think you deserve forgiveness?',
      'Have you ever pretended to be kind?',
      'If you found out the person you trust most is lying to you, what would you do?',
      'Do you think the existence of the weak has meaning?',
      'If you could do something bad without leaving a trace, would you?',
    ],
    ru: [
      'Вы когда-нибудь делали что-то, чего не можете себе простить?',
      'Что бы вы сделали, если бы вас предали?',
      'Вы когда-нибудь шли на всё ради достижения цели?',
      'Когда мораль и интерес конфликтуют, что выбрать?',
      'Можете ли вы принести жертву ради большего блага?',
      'Вы когда-нибудь испытывали такую зависть, что хотели уничтожить человека?',
      'Если бы вам пришлось солгать, чтобы защитить близкого человека, вы бы соврали?',
      'Вы считаете себя хорошим человеком? Почему?',
      'Вы когда-нибудь злоупотребляли чьим-то доверием?',
      'Если бы месть могла решить проблему, вы бы выбрали её?',
      'Вы думаете, что заслуживаете прощения?',
      'Вы когда-нибудь притворялись добрым?',
      'Если бы вы узнали, что человек, которому вы больше всего доверяете, врёт вам, что бы вы сделали?',
      'Вы думаете, что существование слабых имеет смысл?',
      'Если бы вы могли сделать что-то плохое, не оставив следов, вы бы сделали это?',
    ],
    ko: [
      '자신이 용서할 수 없는 짓을 한 적이 있나요?',
      '누군가 당신을 배신한다면 어떻게 하겠습니까?',
      '목적을 위해 수단을 가리지 않은 적이 있나요?',
      '도덕과 이익이 충돌할 때 어떤 것을 선택해야 한다고 생각하나요?',
      '더 큰 선을 위해 소수를 희생하는 것을 받아들일 수 있나요?',
      '질투심에 누군가를 망치고 싶었던 적이 있나요?',
      '소중한 사람을 지키기 위해 거짓말을 해야 한다면 하겠습니까?',
      '당신은 착한 사람이라고 생각하나요? 이유는?',
      '누군가의 신뢰를 이용한 적이 있나요?',
      '복수가 문제를 해결할 수 있다면 복수를 선택하겠습니까?',
      '당신은 용서받을 가치가 있다고 생각하나요?',
      '선한 척한 적이 있나요?',
      '가장 신뢰하는 사람이 거짓말을 하고 있다는 것을 알게 된다면 어떻게 하겠습니까?',
      '약자의 존재에 의미가 있다고 생각하나요?',
      '흔적을 남기지 않고 나쁜 짓을 할 수 있다면 하겠습니까?',
    ],
  },
};

const STORAGE_KEY = 'oc-maker.character-interview';

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function loadSessions(): InterviewSession[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown[];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((item): InterviewSession | null => {
        if (!item || typeof item !== 'object') return null;
        const s = item as Record<string, unknown>;
        const qaRaw = Array.isArray(s.qa) ? s.qa : [];
        const qa = qaRaw
          .map((q): InterviewQA | null => {
            if (!q || typeof q !== 'object') return null;
            const r = q as Record<string, unknown>;
            return {
              id: typeof r.id === 'string' ? r.id : uid(),
              question: typeof r.question === 'string' ? r.question : '',
              answer: typeof r.answer === 'string' ? r.answer : '',
            };
          })
          .filter((x): x is InterviewQA => x !== null);
        return {
          id: typeof s.id === 'string' && s.id ? s.id : uid(),
          characterName: typeof s.characterName === 'string' ? s.characterName : '',
          characterInfo: typeof s.characterInfo === 'string' ? s.characterInfo : '',
          mode: (['classic', 'late-night', 'casual', 'confrontational'] as InterviewMode[]).includes(s.mode as InterviewMode)
            ? (s.mode as InterviewMode)
            : 'classic',
          qa,
          createdAt: typeof s.createdAt === 'string' ? s.createdAt : new Date().toISOString(),
          updatedAt: typeof s.updatedAt === 'string' ? s.updatedAt : new Date().toISOString(),
        };
      })
      .filter((x): x is InterviewSession => x !== null);
  } catch {
    return [];
  }
}

function saveSessions(sessions: InterviewSession[]): boolean {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    return true;
  } catch {
    return false;
  }
}

function loadCharacters(): { name: string; info: string }[] {
  try {
    const raw = window.localStorage.getItem('oc-maker.character-card');
    if (!raw) return [];
    const data = JSON.parse(raw) as CardData;
    const infoParts: string[] = [];
    if (data.bio) infoParts.push(data.bio);
    if (Array.isArray(data.fields)) {
      data.fields.forEach((f) => {
        if (f.value) infoParts.push(`${f.label}: ${f.value}`);
      });
    }
    if (Array.isArray(data.tags)) {
      infoParts.push(`Tags: ${data.tags.map((t) => t.text).join(', ')}`);
    }
    return [{ name: data.name || 'Unnamed', info: infoParts.join('\n') }];
  } catch {
    return [];
  }
}

function getModeQuestions(mode: InterviewMode, language: AppLanguage): string[] {
  return QUESTION_BANKS[mode][language] ?? QUESTION_BANKS[mode].en ?? [];
}

function createSession(mode: InterviewMode, characterName: string, characterInfo: string, language: AppLanguage): InterviewSession {
  const questions = getModeQuestions(mode, language);
  return {
    id: uid(),
    characterName: characterName.trim() || (UI_COPY[language]?.untitled ?? 'Unnamed'),
    characterInfo,
    mode,
    qa: questions.map((q, i) => ({ id: `${mode}-${i}`, question: q, answer: '' })),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

async function generateAiSuggestion(
  characterInfo: string,
  question: string,
  apiKey: string,
  apiBaseUrl: string
): Promise<string> {
  const system =
    'You are an expert character writer. Given a character\'s background info and an interview question, write a compelling in-character response (1-3 sentences, in the same language as the question). Stay true to the character\'s voice and personality.';
  const prompt = `Character info:\n${characterInfo || 'No additional info'}\n\nInterview question: ${question}\n\nWrite the character's response:`;
  try {
    const res = await fetch(`${apiBaseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: prompt },
        ],
        temperature: 0.85,
        max_tokens: 120,
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
export default function CharacterInterviewPage({
  settings,
  language,
  onBack,
  onOpenSettings,
  onOpenDocs,
  pageTitle,
  pageDescription,
}: SharedPageProps) {
  const copy = UI_COPY[language] ?? UI_COPY.en;
  const [sessions, setSessions] = useState<InterviewSession[]>(loadSessions);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [showSetup, setShowSetup] = useState(true);
  const [characterName, setCharacterName] = useState('');
  const [characterInfo, setCharacterInfo] = useState('');
  const [selectedMode, setSelectedMode] = useState<InterviewMode>('classic');
  const [availableChars, setAvailableChars] = useState<{ name: string; info: string }[]>([]);
  const [saveToast, setSaveToast] = useState('');
  const [copied, setCopied] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const copyTimerRef = useRef<number | null>(null);
  const saveTimerRef = useRef<number | null>(null);
  const answerRefs = useRef<Record<string, HTMLTextAreaElement | null>>({});
  const mountedRef = useRef(true);

  const maybeConfirm = useCallback(
    (message: string, action: () => void) => {
      if (!settings.others.confirmDestructiveActions || window.confirm(message)) {
        action();
      }
    },
    [settings.others.confirmDestructiveActions]
  );

  const activeSession = useMemo(
    () => sessions.find((s) => s.id === activeSessionId) ?? null,
    [sessions, activeSessionId]
  );

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
      return characterName.trim().length > 0 || characterInfo.trim().length > 0;
    }
    if (!activeSession) return false;
    return activeSession.qa.some((q) => q.answer.trim().length > 0);
  }, [showSetup, characterName, characterInfo, activeSession]);
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

  useEffect(() => {
    answerRefs.current = {};
  }, [activeSessionId]);

  useEffect(() => {
    if (!showExport && !showHistory) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        if (showExport) setShowExport(false);
        if (showHistory) setShowHistory(false);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [showExport, showHistory]);

  const startInterview = useCallback(() => {
    if (isStarting) return;
    setIsStarting(true);
    const name = characterName.trim() || copy.untitled;
    const session = createSession(selectedMode, name, characterInfo, language);
    const next = [session, ...sessions];
    if (!saveSessions(next)) {
      setSaveToast(copy.saveFailed);
      playSound('error');
      setIsStarting(false);
      return;
    }
    setSessions(next);
    setActiveSessionId(session.id);
    setShowSetup(false);
    setIsStarting(false);
    playSound('confirm');
  }, [characterName, characterInfo, selectedMode, language, sessions, isStarting, copy.untitled, copy.saveFailed]);

  const updateAnswer = useCallback((sessionId: string, qaId: string, answer: string) => {
    const prev = sessions;
    const next = sessions.map((s) => {
      if (s.id !== sessionId) return s;
      return {
        ...s,
        qa: s.qa.map((q) => (q.id === qaId ? { ...q, answer } : q)),
        updatedAt: new Date().toISOString(),
      };
    });
    setSessions(next);
    if (!saveSessions(next)) {
      setSessions(prev);
      setSaveToast(copy.saveFailed);
      playSound('error');
    }
  }, [sessions, copy.saveFailed]);

  const handleAiSuggest = useCallback(
    async (sessionId: string, qaId: string) => {
      const session = sessions.find((s) => s.id === sessionId);
      if (!session) return;
      const qa = session.qa.find((q) => q.id === qaId);
      if (!qa) return;
      setGeneratingId(qaId);
      const suggestion = await generateAiSuggestion(
        session.characterInfo,
        qa.question,
        settings.apiKey,
        settings.apiBaseUrl || 'https://api.openai.com/v1'
      );
      if (mountedRef.current) {
        setGeneratingId(null);
        if (suggestion) {
          updateAnswer(sessionId, qaId, suggestion);
          playSound('success');
        } else {
          playSound('error');
        }
      }
    },
    [sessions, settings.apiKey, settings.apiBaseUrl, updateAnswer]
  );

  const exportMarkdown = useCallback(
    (session: InterviewSession) => {
      const lines: string[] = [
        `# ${session.characterName}${copy.copySuffix}`,
        '',
        `**Mode:** ${session.mode}`,
        `**Date:** ${new Date(session.createdAt).toLocaleDateString()}`,
        '',
        '---',
        '',
      ];
      session.qa.forEach((q, i) => {
        lines.push(`### ${copy.question} ${i + 1}`);
        lines.push(q.question);
        lines.push('');
        lines.push(`**${copy.answer}:**`);
        lines.push(q.answer || copy.emptyAnswer);
        lines.push('');
      });
      return lines.join('\n');
    },
    [copy]
  );

  const handleCopy = useCallback(() => {
    if (!activeSession) return;
    navigator.clipboard.writeText(exportMarkdown(activeSession))
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
  }, [activeSession, exportMarkdown, copy.copyFailed]);

  const handleDeleteSession = useCallback(
    (id: string) => {
      maybeConfirm(copy.deleteConfirm, () => {
        const next = sessions.filter((s) => s.id !== id);
        if (!saveSessions(next)) {
          setSaveToast(copy.saveFailed);
          playSound('error');
          return;
        }
        setSessions(next);
        if (activeSessionId === id) {
          setActiveSessionId(null);
          setShowSetup(true);
          setCharacterName('');
          setCharacterInfo('');
        }
        playSound('deleteSound');
      });
    },
    [activeSessionId, sessions, copy.deleteConfirm, copy.saveFailed, maybeConfirm]
  );

  const handleClearAll = useCallback(() => {
    if (!activeSession) return;
    maybeConfirm(copy.confirmClear, () => {
      const next = sessions.map((s) =>
        s.id === activeSession.id
          ? { ...s, qa: s.qa.map((q) => ({ ...q, answer: '' })), updatedAt: new Date().toISOString() }
          : s
      );
      if (!saveSessions(next)) {
        setSaveToast(copy.saveFailed);
        playSound('error');
        return;
      }
      setSessions(next);
      playSound('resetSound');
    });
  }, [activeSession, sessions, copy.confirmClear, copy.saveFailed, maybeConfirm]);

  const handleJumpToUnanswered = useCallback(() => {
    if (!activeSession) return;
    const firstUnanswered = activeSession.qa.find((q) => !q.answer.trim());
    if (firstUnanswered && answerRefs.current[firstUnanswered.id]) {
      answerRefs.current[firstUnanswered.id]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      answerRefs.current[firstUnanswered.id]?.focus();
    } else {
      playSound('info');
    }
  }, [activeSession]);

  const answeredCount = activeSession ? activeSession.qa.filter((q) => q.answer.trim()).length : 0;
  const totalCount = activeSession ? activeSession.qa.length : 0;

  return (
    <div className="editor-layout interview-layout">
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
                  onClick={() => { playSound('buttonClick'); onOpenDocs('character-interview'); }}
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
            <div className="interview-setup">
              <h3 className="scene-section-title">{copy.newInterview}</h3>

              <div className="interview-character-section">
                <h4 className="interview-section-label">{copy.selectCharacter}</h4>
                {availableChars.length > 0 ? (
                  <div className="interview-char-list">
                    {availableChars.map((c, i) => (
                      <button
                        key={i}
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
                  <p className="muted-copy">{copy.noHistory}</p>
                )}
                <p className="interview-or">{copy.or}</p>
                <input
                  className="scene-input"
                  type="text"
                  placeholder={copy.characterName}
                  aria-label={copy.characterName}
                  value={characterName}
                  onChange={(e) => setCharacterName(e.target.value)}
                />
                <textarea
                  className="scene-textarea"
                  rows={3}
                  placeholder={copy.characterInfo}
                  aria-label={copy.characterInfo}
                  value={characterInfo}
                  onChange={(e) => setCharacterInfo(e.target.value)}
                />
              </div>

              <div className="interview-mode-section">
                <h4 className="interview-section-label">{copy.selectMode}</h4>
                {([
                  { id: 'classic', label: copy.modeClassic, desc: copy.modeClassicDesc },
                  { id: 'late-night', label: copy.modeLateNight, desc: copy.modeLateNightDesc },
                  { id: 'casual', label: copy.modeCasual, desc: copy.modeCasualDesc },
                  { id: 'confrontational', label: copy.modeConfrontational, desc: copy.modeConfrontationalDesc },
                ] as Array<{ id: InterviewMode; label: string; desc: string }>).map((m) => (
                  <button
                    key={m.id}
                    className={`interview-mode-card ${selectedMode === m.id ? 'active' : ''}`}
                    type="button"
                    data-sfx-handled
                    onClick={() => {
                      playSound(selectedMode === m.id ? 'deselect' : 'select');
                      setSelectedMode(m.id);
                    }}
                  >
                    <div className="interview-mode-title">{m.label}</div>
                    <div className="interview-mode-desc">{m.desc}</div>
                  </button>
                ))}
              </div>

              <button
                className="primary-button"
                type="button"
                data-sfx-handled
                disabled={isStarting}
                style={{ width: '100%', marginTop: 12 }}
                onClick={startInterview}
              >
                {copy.startInterview}
              </button>

              {sessions.length > 0 && (
                <button
                  className="secondary-button"
                  type="button"
                  data-sfx-handled
                  style={{ width: '100%', marginTop: 8 }}
                  onClick={() => { playSound('buttonClick'); setShowHistory(true); }}
                >
                  {copy.history} ({sessions.length})
                </button>
              )}
            </div>
          )}

          {!showSetup && activeSession && (
            <div className="interview-active-sidebar">
              <h3 className="scene-section-title">{activeSession.characterName}</h3>
              <p className="muted-copy" style={{ marginBottom: 12 }}>
                {copy.progress}: {answeredCount}/{totalCount}
              </p>
              <div className="interview-progress-bar">
                <div
                  className="interview-progress-fill"
                  style={{ width: `${totalCount > 0 ? (answeredCount / totalCount) * 100 : 0}%` }}
                />
              </div>
              <div className="interview-sidebar-actions">
                <button
                  className="secondary-button small-button"
                  type="button"
                  onClick={handleJumpToUnanswered}
                >
                  {copy.jumpToUnanswered}
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
                  onClick={() => { playSound('buttonClick'); setShowExport(true); }}
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
                  setActiveSessionId(null);
                  setCharacterName('');
                  setCharacterInfo('');
                }}
              >
                {copy.newInterview}
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main */}
      <main className="editor-main-panel">
        {activeSession ? (
          <div className="interview-qa-list">
            {activeSession.qa.map((q, idx) => (
              <div key={q.id} className={`interview-qa-item ${q.answer.trim() ? 'answered' : ''}`}>
                <div className="interview-question">
                  <span className="interview-question-num">{idx + 1}</span>
                  <span className="interview-question-text">{q.question}</span>
                </div>
                <textarea
                  ref={(el) => { answerRefs.current[q.id] = el; }}
                  className="interview-answer-input"
                  rows={3}
                  placeholder={copy.answerPlaceholder}
                  aria-label={`${copy.answer} ${idx + 1}`}
                  value={q.answer}
                  onChange={(e) => updateAnswer(activeSession.id, q.id, e.target.value)}
                />
                <div className="interview-qa-actions">
                  {settings.apiKey && (
                    <button
                      className="secondary-button small-button"
                      type="button"
                      disabled={generatingId === q.id}
                      onClick={() => handleAiSuggest(activeSession.id, q.id)}
                      title={copy.aiSuggestDesc}
                    >
                      {generatingId === q.id ? copy.generating : copy.aiSuggest}
                    </button>
                  )}
                  {!settings.apiKey && (
                    <span className="muted-copy tiny-copy">{copy.useApiKey}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="scene-empty-state">
            <div className="scene-empty-icon">🎙️</div>
            <p>{copy.noHistory}</p>
          </div>
        )}
      </main>

      {/* Export Modal */}
      {showExport && activeSession && (
        <div className="modal-backdrop" role="presentation" onClick={() => setShowExport(false)}>
          <div className="modal-surface" role="dialog" aria-modal="true" aria-label={copy.exportTitle} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{copy.exportTitle}</h3>
              <button
                className="icon-button modal-close"
                type="button"
                aria-label={copy.close}
                onClick={() => setShowExport(false)}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <textarea className="scene-export-textarea" readOnly rows={16} value={exportMarkdown(activeSession)} aria-label={copy.exportTitle} />
              <div className="scene-export-actions">
                <button className="primary-button" type="button" data-sfx-handled onClick={handleCopy}>
                  {copied ? copy.copied : copy.copy}
                </button>
                <button
                  className="secondary-button"
                  type="button"
                  data-sfx-handled
                  onClick={() => { playSound('modalClose'); setShowExport(false); }}
                >
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
          <div className="modal-surface" role="dialog" aria-modal="true" aria-label={copy.history} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{copy.history}</h3>
              <button
                className="icon-button modal-close"
                type="button"
                aria-label={copy.close}
                onClick={() => setShowHistory(false)}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              {sessions.length === 0 ? (
                <p className="muted-copy">{copy.noHistory}</p>
              ) : (
                <div className="interview-history-list">
                  {sessions.map((s) => (
                    <div key={s.id} className="interview-history-item">
                      <button
                        className="interview-history-main"
                        type="button"
                        data-sfx-handled
                        onClick={() => {
                          playSound('buttonClick');
                          setActiveSessionId(s.id);
                          setShowSetup(false);
                          setShowHistory(false);
                        }}
                      >
                        <div className="interview-history-name">{s.characterName}</div>
                        <div className="interview-history-meta">
                          {s.mode} · {s.qa.filter((q) => q.answer.trim()).length}/{s.qa.length} ·{' '}
                          {new Date(s.updatedAt).toLocaleDateString()}
                        </div>
                      </button>
                      <button
                        className="icon-button danger"
                        type="button"
                        aria-label={copy.deleteConfirm}
                        data-sfx-handled
                        onClick={() => handleDeleteSession(s.id)}
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
