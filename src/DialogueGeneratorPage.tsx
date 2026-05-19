import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { playSound } from './audioEngine';
import type { AppLanguage, SettingsState } from './types';

// ─── Types ───

export type PersonalityTrait =
  | 'tsundere' | 'cool' | 'hotblooded' | 'calm' | 'shy' | 'cheerful'
  | 'mysterious' | 'sarcastic' | 'gentle' | 'stubborn' | 'lazy' | 'serious'
  | 'childish' | 'loyal' | 'cynical' | 'optimistic' | 'pessimistic';

export type DialogueScene =
  | 'battle' | 'daily' | 'emotional' | 'crisis' | 'comedy' | 'farewell'
  | 'reunion' | 'confession' | 'argument' | 'encouragement';

export type DialogueLine = {
  id: string;
  text: string;
  tone: string;
  trait: PersonalityTrait;
  scene: DialogueScene;
};

export type DialogueSet = {
  id: string;
  name: string;
  createdAt: string;
  traits: PersonalityTrait[];
  scene: DialogueScene;
  intensity: number;
  catchphrase: string;
  lines: DialogueLine[];
};

// ─── Trait pools per language ───

const TRAIT_LABELS: Record<AppLanguage, Record<PersonalityTrait, string>> = {
  zh: {
    tsundere: '傲娇', cool: '冷酷', hotblooded: '热血', calm: '冷静',
    shy: '害羞', cheerful: '开朗', mysterious: '神秘', sarcastic: '毒舌',
    gentle: '温柔', stubborn: '固执', lazy: '懒散', serious: '认真',
    childish: '幼稚', loyal: '忠诚', cynical: '愤世嫉俗', optimistic: '乐观', pessimistic: '悲观',
  },
  ja: {
    tsundere: 'ツンデレ', cool: 'クール', hotblooded: '熱血', calm: '冷静',
    shy: '照れ屋', cheerful: '明るい', mysterious: '謎めいた', sarcastic: '毒舌',
    gentle: '優しい', stubborn: '頑固', lazy: 'のんびり', serious: '真面目',
    childish: '子供っぽい', loyal: '忠実', cynical: '憤世嫉俗', optimistic: '楽観的', pessimistic: '悲観的',
  },
  en: {
    tsundere: 'Tsundere', cool: 'Cool', hotblooded: 'Hot-blooded', calm: 'Calm',
    shy: 'Shy', cheerful: 'Cheerful', mysterious: 'Mysterious', sarcastic: 'Sarcastic',
    gentle: 'Gentle', stubborn: 'Stubborn', lazy: 'Lazy', serious: 'Serious',
    childish: 'Childish', loyal: 'Loyal', cynical: 'Cynical', optimistic: 'Optimistic', pessimistic: 'Pessimistic',
  },
  ru: {
    tsundere: 'Тсундэрэ', cool: 'Холодный', hotblooded: 'Горячий', calm: 'Спокойный',
    shy: 'Застенчивый', cheerful: 'Жизнерадостный', mysterious: 'Загадочный', sarcastic: 'Язвительный',
    gentle: 'Нежный', stubborn: 'Упрямый', lazy: 'Ленивый', serious: 'Серьёзный',
    childish: 'Детский', loyal: 'Верный', cynical: 'Циничный', optimistic: 'Оптимист', pessimistic: 'Пессимист',
  },
  ko: {
    tsundere: '츤데레', cool: '쿨', hotblooded: '열혈', calm: '침착',
    shy: '부끄러움', cheerful: '쾌활', mysterious: '신비로움', sarcastic: '독설',
    gentle: '온화', stubborn: '고집', lazy: '게으름', serious: '진지',
    childish: '유치', loyal: '충성', cynical: '냉소', optimistic: '낙천', pessimistic: '비관',
  },
};

const SCENE_LABELS: Record<AppLanguage, Record<DialogueScene, string>> = {
  zh: {
    battle: '战斗', daily: '日常', emotional: '情感', crisis: '危机',
    comedy: '搞笑', farewell: '离别', reunion: '重逢', confession: '告白',
    argument: '争吵', encouragement: '鼓励',
  },
  ja: {
    battle: '戦闘', daily: '日常', emotional: '感情', crisis: '危機',
    comedy: 'コメディ', farewell: '別れ', reunion: '再会', confession: '告白',
    argument: '喧嘩', encouragement: '励まし',
  },
  en: {
    battle: 'Battle', daily: 'Daily Life', emotional: 'Emotional', crisis: 'Crisis',
    comedy: 'Comedy', farewell: 'Farewell', reunion: 'Reunion', confession: 'Confession',
    argument: 'Argument', encouragement: 'Encouragement',
  },
  ru: {
    battle: 'Битва', daily: 'Повседневность', emotional: 'Эмоциональное', crisis: 'Кризис',
    comedy: 'Комедия', farewell: 'Прощание', reunion: 'Воссоединение', confession: 'Признание',
    argument: 'Спор', encouragement: 'Поддержка',
  },
  ko: {
    battle: '전투', daily: '일상', emotional: '감정', crisis: '위기',
    comedy: '코미디', farewell: '이별', reunion: '재회', confession: '고백',
    argument: '다툼', encouragement: '격려',
  },
};

// ─── Dialogue templates ───

type TemplateEntry = { text: string; tone: string };

const TEMPLATES: Record<AppLanguage, Record<PersonalityTrait, Record<DialogueScene, TemplateEntry[]>>> = {
  zh: {
    tsundere: {
      battle: [
        { text: '哼，才、才不是为了保护你呢！只是……只是顺手而已！', tone: '倔强' },
        { text: '别、别误会了！我只是不想欠你人情罢了！', tone: '傲娇' },
        { text: '这种程度的敌人……哼，我一个人就够了！', tone: '自信' },
      ],
      daily: [
        { text: '这、这份便当是多做出来的！不吃就浪费了！', tone: '别扭' },
        { text: '别靠那么近啦……不是讨厌你，只是……！', tone: '害羞' },
        { text: '我才没有在意你呢！只是刚好路过而已！', tone: '逞强' },
      ],
      emotional: [
        { text: '笨蛋……不要对我这么好啦……我会忍不住更依赖你的……', tone: '脆弱' },
        { text: '我、我才没有哭呢！是眼睛进沙子了！', tone: '掩饰' },
      ],
      crisis: [
        { text: '快走！我、我才不是为了你……只是不想拖累而已！', tone: '决绝' },
        { text: '别管我了……你活下去比较重要……笨蛋。', tone: '温柔' },
      ],
      comedy: [
        { text: '哈？你在说什么蠢话！我怎么可能会嫉妒！', tone: '慌张' },
        { text: '才、才没有笑呢！只是嘴角抽筋了而已！', tone: '尴尬' },
      ],
      farewell: [
        { text: '走、走吧！我才不会想念你呢……最多……一点点。', tone: '不舍' },
        { text: '下次见面的时候……不准忘了我啊，笨蛋。', tone: '伤感' },
      ],
      reunion: [
        { text: '你、你终于回来了……我、我才没有一直等你呢！', tone: '欣喜' },
        { text: '哼，这么久不见，我还以为你忘记我了呢！', tone: '埋怨' },
      ],
      confession: [
        { text: '笨、笨蛋！我、我才没有喜欢你呢……只是……只是很在意你而已啦！', tone: '紧张' },
        { text: '别、别笑！我是认真的……比任何人都认真。', tone: '真诚' },
      ],
      argument: [
        { text: '我、我才没有错呢！是你太迟钝了！', tone: '生气' },
        { text: '哼！不理你了！……最多三分钟。', tone: '赌气' },
      ],
      encouragement: [
        { text: '哼，这种程度怎么可能难得倒你！……我相信你。', tone: '支持' },
        { text: '别、别放弃啊……你可是我看中的人。', tone: '傲娇鼓励' },
      ],
    },
    cool: {
      battle: [
        { text: '分析完成。胜算 73%，开始排除。', tone: '冷静' },
        { text: ' unnecessary.', tone: '冷酷' },
        { text: '你的动作……太慢了。', tone: '轻蔑' },
      ],
      daily: [
        { text: '保持距离。这是最优解。', tone: '理性' },
        { text: '咖啡，不加糖。谢谢。', tone: '简洁' },
        { text: '闲聊是低效的行为。有事直说。', tone: '冷淡' },
      ],
      emotional: [
        { text: '……心情很奇怪。这种温度，应该是名为"安心"的东西。', tone: '困惑' },
        { text: '我不擅长表达。但……你很重要。这是事实。', tone: '真诚' },
      ],
      crisis: [
        { text: '计算过了。我会争取 120 秒。你们先走。', tone: '冷静' },
        { text: '别担心。最优解已经找到。', tone: '自信' },
      ],
      comedy: [
        { text: '……这是 joke 吗？我的 humor 模块需要更新。', tone: '一本正经' },
        { text: '笑点在哪里？请标注。', tone: '困惑' },
      ],
      farewell: [
        { text: '不必回头。前路更重要。', tone: '理性' },
        { text: '……会再见的。概率上。', tone: '不确定' },
      ],
      reunion: [
        { text: '……你迟到了 4 分 32 秒。但我可以原谅。', tone: '温柔' },
        { text: '数据更新了。你还是老样子。很好。', tone: '欣慰' },
      ],
      confession: [
        { text: '我的逻辑告诉我，这种感情叫"喜欢"。我接受这个结论。', tone: '理性' },
        { text: '……不是程序。是我。在告诉你。', tone: '真诚' },
      ],
      argument: [
        { text: '你的论点有 3 处逻辑漏洞。要我列举吗？', tone: '冷静' },
        { text: '情绪不会解决问题。冷静。', tone: '理性' },
      ],
      encouragement: [
        { text: '根据我的判断，你可以做到。我相信数据，也相信你。', tone: '冷静' },
        { text: '失败率 0%。……因为我在。', tone: '自信' },
      ],
    },
    hotblooded: {
      battle: [
        { text: '来吧！让我看看你的觉悟！', tone: '热血' },
        { text: '燃烧吧！我的灵魂！！', tone: '激昂' },
        { text: '一拳！只需要一拳就能解决你！', tone: '自信' },
      ],
      daily: [
        { text: '今天的训练量是昨天的两倍！没问题吧！', tone: '元气' },
        { text: '吃饭就要大口！人生就要大步！', tone: '豪爽' },
        { text: '一起去跑步吧！我请客！', tone: '热情' },
      ],
      emotional: [
        { text: '我、我才没有哭呢！这是……这是汗！', tone: '逞强' },
        { text: '能遇见你，是我这辈子最热血的事！', tone: '感动' },
      ],
      crisis: [
        { text: '交给我！我不会让任何人死！', tone: '热血' },
        { text: '就算燃烧殆尽，我也要保护大家！', tone: '决绝' },
      ],
      comedy: [
        { text: '哈哈哈！这种程度也想骗过我？', tone: '大笑' },
        { text: '等等……原来这是玩笑吗？！', tone: '迟钝' },
      ],
      farewell: [
        { text: '走吧！但不要回头……因为我会追上去的！', tone: '热血' },
        { text: '暂时的离别是为了更热血的重逢！', tone: '元气' },
      ],
      reunion: [
        { text: '你这家伙！终于回来了！让我抱一下！', tone: '热情' },
        { text: '好！今天不醉不归！', tone: '豪爽' },
      ],
      confession: [
        { text: '我喜欢你！比任何人都更喜欢！这就是我的回答！', tone: '直球' },
        { text: '我可不是说说而已！我会用一生证明的！', tone: '热血' },
      ],
      argument: [
        { text: '你说什么？！有种再说一遍！', tone: '生气' },
        { text: '我哪里错了！你说清楚！', tone: '激动' },
      ],
      encouragement: [
        { text: '站起来！你可是我认可的人！', tone: '热血' },
        { text: '别放弃！下一击就是决胜一击！', tone: '激昂' },
      ],
    },
    calm: {
      battle: [
        { text: '深呼吸。看清对手的动作。', tone: '冷静' },
        { text: '急躁是败北的开始。', tone: '沉稳' },
        { text: '三招之内，结束。', tone: '自信' },
      ],
      daily: [
        { text: '今天天气不错。适合喝茶。', tone: '平和' },
        { text: '慢慢来。凡事都有节奏。', tone: '从容' },
        { text: '急躁不会加快时间。放松。', tone: '沉稳' },
      ],
      emotional: [
        { text: '……有时候，沉默比话语更能传达心情。', tone: '温柔' },
        { text: '我在这里。一直。', tone: '安心' },
      ],
      crisis: [
        { text: ' panic 是最坏的选择。冷静，一起想办法。', tone: '沉稳' },
        { text: '相信我。以前也走过更糟的路。', tone: '可靠' },
      ],
      comedy: [
        { text: '……噗。抱歉，失态了。', tone: '含蓄' },
        { text: '你的 joke 很有意思。我记下了。', tone: '一本正经' },
      ],
      farewell: [
        { text: '去吧。风会带你回来的。', tone: '温柔' },
        { text: '不必承诺。时间会给答案。', tone: '从容' },
      ],
      reunion: [
        { text: '……你回来了。茶还温着。', tone: '温柔' },
        { text: '我知道你会回来。我一直知道。', tone: '安心' },
      ],
      confession: [
        { text: '我想了很久……结论是，我想和你一起看更多的风景。', tone: '温柔' },
        { text: '我的心很静。但想到你时，会起涟漪。', tone: '诗意' },
      ],
      argument: [
        { text: '我们都冷静一下。情绪会让判断失真。', tone: '理性' },
        { text: '我不否认你的感受。但我们可以更好地沟通。', tone: '沉稳' },
      ],
      encouragement: [
        { text: '你已经做得很好了。下一步，交给自己。', tone: '温柔' },
        { text: '山就在那里。一步一步，终会到达。', tone: '从容' },
      ],
    },
    shy: {
      battle: [
        { text: '我、我会努力的……！请、请不要看我……', tone: '紧张' },
        { text: '对、对不起……我不想战斗的……', tone: '怯懦' },
      ],
      daily: [
        { text: '那、那个……这个给你……不、不要误会！', tone: '害羞' },
        { text: '我、我可以坐你旁边吗……？', tone: '胆怯' },
      ],
      emotional: [
        { text: '我、我一直……一直都想告诉你……', tone: '紧张' },
        { text: '谢、谢谢……从来没有人对我这么好……', tone: '感动' },
      ],
      crisis: [
        { text: '我、我虽然很害怕……但、但我会保护你的！', tone: '鼓起勇气' },
        { text: '请、请不要丢下我一个人……', tone: '脆弱' },
      ],
      comedy: [
        { text: '欸？原、原来是在开玩笑吗……哈、哈哈……', tone: '尴尬' },
        { text: '我、我不太好笑……对、对不起……', tone: '自卑' },
      ],
      farewell: [
        { text: '再、再见……我、我会等你回来的……', tone: '不舍' },
        { text: '如、如果……如果你能记得我……就、就好了……', tone: '伤感' },
      ],
      reunion: [
        { text: '你、你回来了……我、我每天都在等你……', tone: '欣喜' },
        { text: '我、我没有哭……只、只是……太高兴了……', tone: '感动' },
      ],
      confession: [
        { text: '我、我喜欢你……！不、不要回答也可以……我只是想让你知道……', tone: '紧张' },
        { text: '从、从第一次见到你……我、我就……', tone: '羞涩' },
      ],
      argument: [
        { text: '对、对不起……但、但我真的觉得……', tone: '胆怯' },
        { text: '我、我不想吵架……我、我只是……', tone: '委屈' },
      ],
      encouragement: [
        { text: '你、你很厉害的……我、我一直都相信你……', tone: '小声' },
        { text: '如、如果你累了……我、我会陪着你的……', tone: '温柔' },
      ],
    },
    cheerful: {
      battle: [
        { text: '加油加油！打败你之后我们去吃好吃的吧！', tone: '元气' },
        { text: '来啦来啦！今天也充满活力！', tone: '活泼' },
      ],
      daily: [
        { text: '早呀早呀！今天也是美好的一天！', tone: '元气' },
        { text: '一起去玩吧！我知道有个超棒的地方！', tone: '活泼' },
      ],
      emotional: [
        { text: '嘿嘿……能认识你，我真的超开心的！', tone: '开心' },
        { text: '不要难过啦！笑一笑！我陪你！', tone: '温暖' },
      ],
      crisis: [
        { text: '没问题的！有我在呢！一切都会好起来的！', tone: '乐观' },
        { text: '打起精神来！最差的情况就是从头再来嘛！', tone: '元气' },
      ],
      comedy: [
        { text: '哈哈哈！你也太逗了吧！', tone: '大笑' },
        { text: '等一下等一下！让我先笑完！哈哈哈！', tone: '欢乐' },
      ],
      farewell: [
        { text: '拜拜！一定要回来哦！我会准备惊喜的！', tone: '元气' },
        { text: '暂时的离别是为了更好的重逢嘛！加油！', tone: '乐观' },
      ],
      reunion: [
        { text: '哇！你回来啦！我可想死你啦！', tone: '兴奋' },
        { text: '欢迎回来！今天要吃大餐庆祝！', tone: '开心' },
      ],
      confession: [
        { text: '我喜欢你！超喜欢的那种！在一起吧！', tone: '直球' },
        { text: '和你在一起的时候，世界都变得亮亮的！', tone: '甜蜜' },
      ],
      argument: [
        { text: '哼！不理你了！……十秒钟！', tone: '赌气' },
        { text: '好了好了！别生气啦！笑一个嘛！', tone: '撒娇' },
      ],
      encouragement: [
        { text: '你可以的！我相信你！百分百相信！', tone: '元气' },
        { text: '失败也没关系！下次一定会成功的！', tone: '乐观' },
      ],
    },
    mysterious: {
      battle: [
        { text: '你……能看见真实吗？', tone: '神秘' },
        { text: '命运的丝线……已经纠缠在一起了。', tone: '预言' },
      ],
      daily: [
        { text: '月亮升起了。适合思考的时间。', tone: '深沉' },
        { text: '有些事……不知道反而更幸福。', tone: '暗示' },
      ],
      emotional: [
        { text: '人心是最深的迷宫……而你找到了我。', tone: '诗意' },
        { text: '我已经很久……没有这样的感觉了。', tone: '感慨' },
      ],
      crisis: [
        { text: '黑暗 precedes 黎明。撑过去。', tone: '预言' },
        { text: '我看见了……未来的碎片。你会活下去的。', tone: '神秘' },
      ],
      comedy: [
        { text: '……笑？啊，这是笑的意思吗。', tone: '不解' },
        { text: '人类的 humor……真是深奥。', tone: '困惑' },
      ],
      farewell: [
        { text: '我们还会再见面的……在命运的十字路口。', tone: '预言' },
        { text: '不要寻找我。当我该出现时，自然会出现。', tone: '神秘' },
      ],
      reunion: [
        { text: '……你来了。比预计的时间早了一点。', tone: '意料之中' },
        { text: '命运的齿轮……又开始转动了。', tone: '深沉' },
      ],
      confession: [
        { text: '我看见了很多未来……但最想要的，是和你在一起的那个。', tone: '深情' },
        { text: '你是……我唯一看不清的未来。也是最想看清的。', tone: '神秘' },
      ],
      argument: [
        { text: '愤怒蒙蔽了你的眼睛。冷静下来。', tone: '冷静' },
        { text: '真相往往隐藏在你不愿看见的地方。', tone: '暗示' },
      ],
      encouragement: [
        { text: '星星在黑暗中才最明亮。你也是。', tone: '诗意' },
        { text: '我看见了……你成功的未来。相信它。', tone: '预言' },
      ],
    },
    sarcastic: {
      battle: [
        { text: '哇，好厉害哦~连站都站不稳呢~', tone: '嘲讽' },
        { text: '要我等你准备好吗？还是直接送你上路？', tone: '毒舌' },
      ],
      daily: [
        { text: '哦？你终于起床了？太阳都落山了呢。', tone: '讽刺' },
        { text: '你的智商……和室温差不多吧？', tone: '毒舌' },
      ],
      emotional: [
        { text: '……别用那种眼神看我。我会误会的。', tone: '别扭' },
        { text: '谢、谢谢……（小声）……才、才不是感动了呢！', tone: '害羞' },
      ],
      crisis: [
        { text: '好了好了，别 panic 了。有我在，死不了的。', tone: '可靠' },
        { text: '啧，麻烦死了……但没办法，谁让我看不惯你哭呢。', tone: '别扭' },
      ],
      comedy: [
        { text: '哈哈哈！你认真的样子太好笑了！', tone: '大笑' },
        { text: '等等，这不会是你最好的 joke 吧？', tone: '毒舌' },
      ],
      farewell: [
        { text: '走吧走吧，我才不会想你呢……最多……一点点。', tone: '不舍' },
        { text: '别死在外面了。……我懒得给你收尸。', tone: '关心' },
      ],
      reunion: [
        { text: '哟，还活着呢？命挺硬的嘛。', tone: '欣慰' },
        { text: '……怎么瘦了。在外面没吃好？（小声）', tone: '关心' },
      ],
      confession: [
        { text: '……啧。喜欢上你这种人，算我倒霉。但我不后悔。', tone: '别扭' },
        { text: '别误会了！我只是……只是觉得你没那么讨厌而已！', tone: '傲娇' },
      ],
      argument: [
        { text: '哦？你说完了？那轮到我了。准备好被 logic 碾压了吗？', tone: '挑衅' },
        { text: '你的论点……连我养的猫都反驳不了。因为太无聊了。', tone: '毒舌' },
      ],
      encouragement: [
        { text: '喂，别让我失望啊。我可是很挑的。', tone: '别扭' },
        { text: '……你比看起来要坚强。这是我第一次夸人。珍惜吧。', tone: '认真' },
      ],
    },
    gentle: {
      battle: [
        { text: '我不想伤害你……但为了保护重要的人，我不会退缩。', tone: '温柔' },
        { text: '请住手吧。我不想看到任何人受伤。', tone: '慈悲' },
      ],
      daily: [
        { text: '今天辛苦了。要不要喝杯热茶？', tone: '关怀' },
        { text: '慢慢来，不用着急。我在这里等你。', tone: '耐心' },
      ],
      emotional: [
        { text: '没关系的……想哭就哭吧。我会陪着你。', tone: '温柔' },
        { text: '你的痛苦……我或许不能完全理解，但我愿意分担。', tone: '体贴' },
      ],
      crisis: [
        { text: '别怕。牵着我的手。我们一起走。', tone: '温柔' },
        { text: '无论发生什么，我都不会放开你的。', tone: '坚定' },
      ],
      comedy: [
        { text: '呵呵……你真的很可爱呢。', tone: '宠溺' },
        { text: '哎呀……让我帮你擦一下吧？', tone: '温柔' },
      ],
      farewell: [
        { text: '一路平安。……我会在这里，一直等你。', tone: '温柔' },
        { text: '无论何时，记得有人在想念你。', tone: '深情' },
      ],
      reunion: [
        { text: '欢迎回来。……我一直在等你。', tone: '温柔' },
        { text: '你看起来很累呢。先休息一下吧？', tone: '关怀' },
      ],
      confession: [
        { text: '我喜欢你的笑容。……比阳光还要温暖。', tone: '温柔' },
        { text: '请让我……一直陪在你身边。', tone: '真诚' },
      ],
      argument: [
        { text: '我理解你的感受。但我们可以找到更好的方式……', tone: '温和' },
        { text: '对不起……如果我让你难过了。', tone: '歉意' },
      ],
      encouragement: [
        { text: '你已经很努力了。……我为你骄傲。', tone: '温柔' },
        { text: '不用急。每一步都算数。', tone: '耐心' },
      ],
    },
    stubborn: {
      battle: [
        { text: '我说过了！我不会退后一步！', tone: '固执' },
        { text: '就算只有你一个人，我也要坚持到底！', tone: '倔强' },
      ],
      daily: [
        { text: '我说了不吃早餐！……好吧，就吃一口。', tone: '别扭' },
        { text: '这条路我认定了！谁说都不改！', tone: '固执' },
      ],
      emotional: [
        { text: '我、我才没有感动呢！只是……只是风太大而已！', tone: '逞强' },
        { text: '别管我！我没事！……真的。', tone: '倔强' },
      ],
      crisis: [
        { text: '我不会放弃的！就算只有我一个人！', tone: '决绝' },
        { text: '你们先走！我断后！这是命令！', tone: '固执' },
      ],
      comedy: [
        { text: '哈哈哈哈！我才不会笑呢！……噗。', tone: '破功' },
        { text: '我、我才不会上当呢！……欸？被骗了？！', tone: '迟钝' },
      ],
      farewell: [
        { text: '走吧！我不会挽留你的！……最多……最多等一辈子。', tone: '倔强' },
        { text: '说了再见就一定要再见！不准食言！', tone: '固执' },
      ],
      reunion: [
        { text: '你、你终于回来了！……我才没有等很久呢！', tone: '欣喜' },
        { text: '哼！让我等了这么久……罚你请我吃饭！', tone: '赌气' },
      ],
      confession: [
        { text: '我认定了就不会改！……我喜欢你！这辈子都是！', tone: '直球' },
        { text: '我的心意不会改变！不管你怎么回答！', tone: '坚定' },
      ],
      argument: [
        { text: '我没错！我是对的！一直都是！', tone: '固执' },
        { text: '除非你承认你错了，否则我不理你！', tone: '赌气' },
      ],
      encouragement: [
        { text: '别放弃！你可是我认可的人！不可能输的！', tone: '热血' },
        { text: '我说你能做到你就能做到！相信我！', tone: '自信' },
      ],
    },
    lazy: {
      battle: [
        { text: '好麻烦……你能不能自己倒下？', tone: '懒散' },
        { text: '就一招吧……多了懒得动。', tone: '敷衍' },
      ],
      daily: [
        { text: '今天天气……适合睡觉。', tone: '慵懒' },
        { text: '走路好麻烦……你背我吧。', tone: '撒娇' },
        { text: '吃饭……也要动嘴吗？好麻烦。', tone: '懒散' },
      ],
      emotional: [
        { text: '……别走。再陪我一会儿。就一会儿。', tone: '依恋' },
        { text: '我很少认真……但对你，我可以努力一下。', tone: '认真' },
      ],
      crisis: [
        { text: '啧……麻烦死了。但为了你，勉为其难动一下吧。', tone: '别扭' },
        { text: '跑？好麻烦……但会死的吧？……那还是跑吧。', tone: '无奈' },
      ],
      comedy: [
        { text: '……呵。好笑。但笑好累。', tone: '敷衍' },
        { text: '你的 joke 不错。但我懒得笑。', tone: '懒散' },
      ],
      farewell: [
        { text: '走吧……反正我会在这里睡觉等你。', tone: '慵懒' },
        { text: '不用 promise 了……反正我会一直躺在这里。', tone: '懒散' },
      ],
      reunion: [
        { text: '……你回来了？那我继续睡了。……骗你的，抱抱。', tone: '温柔' },
        { text: '欢迎回来。……床分你一半。', tone: '慵懒' },
      ],
      confession: [
        { text: '我喜欢你……但告白好麻烦。所以你就当没听见吧。……骗你的。', tone: '别扭' },
        { text: '我懒得喜欢别人……但对你，我懒得不喜欢。', tone: '认真' },
      ],
      argument: [
        { text: '好麻烦……你是对的。我可以睡了吗？', tone: '敷衍' },
        { text: '吵死了……抱抱就和好。……快点。', tone: '撒娇' },
      ],
      encouragement: [
        { text: '你可以的……虽然努力很麻烦，但你可以的。', tone: '慵懒' },
        { text: '输了好麻烦……所以赢吧。我懒得安慰你。', tone: '别扭' },
      ],
    },
    serious: {
      battle: [
        { text: '集中注意力。任何疏忽都是致命的。', tone: '严肃' },
        { text: '任务开始。目标是完全排除。', tone: '冷静' },
      ],
      daily: [
        { text: '请遵守时间。迟到是对他人的不尊重。', tone: '认真' },
        { text: '今天的 schedule 已经排好了。请不要打乱。', tone: '严谨' },
      ],
      emotional: [
        { text: '……这种感情，超出了我的理解范围。但我会努力。', tone: '困惑' },
        { text: '我不太会说温柔的话。但……谢谢。', tone: '真诚' },
      ],
      crisis: [
        { text: '按照 plan B 执行。所有人听我指挥。', tone: '冷静' },
        { text: ' panic 不允许。按照 protocol 行动。', tone: '严肃' },
      ],
      comedy: [
        { text: '……这是 humor 吗？请提供解释。', tone: '一本正经' },
        { text: '我理解这个 joke 的结构。但为什么好笑？', tone: '困惑' },
      ],
      farewell: [
        { text: '请按时归来。我会在约定地点等待。', tone: '认真' },
        { text: '保重。你的安全是最高优先级。', tone: '严肃' },
      ],
      reunion: [
        { text: '你迟到了 7 分钟。……但我可以原谅。', tone: '温柔' },
        { text: '欢迎回来。任务报告……不，先休息吧。', tone: '关怀' },
      ],
      confession: [
        { text: '经过认真考虑……我认为我对你的感情是"喜欢"。请确认。', tone: '一本正经' },
        { text: '我不确定如何表达。但……我想和你在一起。这是认真的。', tone: '真诚' },
      ],
      argument: [
        { text: '请用事实说话。情绪不能作为 argument。', tone: '理性' },
        { text: '我不接受没有 evidence 的指控。', tone: '严肃' },
      ],
      encouragement: [
        { text: '你已经完成了 87% 的目标。继续。你可以的。', tone: '冷静' },
        { text: '失败是 data 的一部分。分析它，然后继续。', tone: '理性' },
      ],
    },
    childish: {
      battle: [
        { text: '看招看招！超级无敌必杀技！', tone: '天真' },
        { text: '坏人退散！正义必胜！', tone: '元气' },
      ],
      daily: [
        { text: '陪我玩嘛！不陪我我就哭给你看！', tone: '撒娇' },
        { text: '今天的糖果呢？约定好的！', tone: '任性' },
      ],
      emotional: [
        { text: '呜呜……你不要我了嘛？', tone: '哭泣' },
        { text: '我最喜欢你了！比糖果还喜欢！', tone: '直球' },
      ],
      crisis: [
        { text: '好可怕……但、但我会勇敢的！因为我是主角！', tone: '鼓起勇气' },
        { text: '呜呜……不要丢下我一个人……', tone: '恐惧' },
      ],
      comedy: [
        { text: '哈哈哈！好好笑！再来一次！', tone: '大笑' },
        { text: '咦？为什么大家都在笑？我也笑！哈哈哈！', tone: '模仿' },
      ],
      farewell: [
        { text: '不要走！……那、那你要快点回来哦！拉钩！', tone: '不舍' },
        { text: '我会每天数星星……数到你回来！', tone: '天真' },
      ],
      reunion: [
        { text: '哇！你回来啦！抱抱！举高高！', tone: '兴奋' },
        { text: '我每天都有乖乖听话哦！奖励呢？', tone: '期待' },
      ],
      confession: [
        { text: '我喜欢你！我们永远在一起好不好！', tone: '直球' },
        { text: '你是我最喜欢的人！比冰淇淋还喜欢！', tone: '甜蜜' },
      ],
      argument: [
        { text: '哼！我不理你了！……三秒钟！', tone: '赌气' },
        { text: '你欺负我！我要告诉全世界！', tone: '委屈' },
      ],
      encouragement: [
        { text: '加油加油！你可以的！我相信你！', tone: '元气' },
        { text: '输了也没关系！我请你吃冰淇淋！', tone: '安慰' },
      ],
    },
    loyal: {
      battle: [
        { text: '以我的剑起誓——绝不会让你受伤！', tone: '忠诚' },
        { text: '我的命是你的。我的剑也是。', tone: '决绝' },
      ],
      daily: [
        { text: '今天的 report。请过目。', tone: '认真' },
        { text: '您需要什么？我立刻去准备。', tone: '恭敬' },
      ],
      emotional: [
        { text: '……能侍奉您，是我一生的荣幸。', tone: '深情' },
        { text: '您的眼泪……比我的血更让我痛苦。', tone: '心疼' },
      ],
      crisis: [
        { text: '请先走！我来断后！这是命令！', tone: '忠诚' },
        { text: '就算死，我也会死在你前面。', tone: '决绝' },
      ],
      comedy: [
        { text: '……您开心就好。', tone: '宠溺' },
        { text: '我的 humor 模块可能坏了。请原谅。', tone: '一本正经' },
      ],
      farewell: [
        { text: '请平安归来。我会守护这里，直到您回来。', tone: '忠诚' },
        { text: '我的位置……永远在您的身后。', tone: '深情' },
      ],
      reunion: [
        { text: '欢迎回来。……我一直在等您。', tone: '忠诚' },
        { text: '您平安无事……太好了。', tone: '安心' },
      ],
      confession: [
        { text: '这份感情……或许不该说出口。但我不想欺骗您。', tone: '挣扎' },
        { text: '我的忠诚从未动摇。但现在……我想以个人的身份爱您。', tone: '真诚' },
      ],
      argument: [
        { text: '请恕我直言……您的决定可能有风险。', tone: '诚恳' },
        { text: '我不会反驳您。但请允许我守护您。', tone: '忠诚' },
      ],
      encouragement: [
        { text: '请相信自己的力量。我一直都相信着。', tone: '忠诚' },
        { text: '无论发生什么，我都在您身边。', tone: '坚定' },
      ],
    },
    cynical: {
      battle: [
        { text: '呵……这就是所谓的正义？可笑。', tone: '嘲讽' },
        { text: '来吧。让我看看这个世界还有什么可笑的。', tone: '冷酷' },
      ],
      daily: [
        { text: '人类的悲欢……不过是无聊的重复。', tone: '冷漠' },
        { text: '希望？那是最奢侈的东西。', tone: '讽刺' },
      ],
      emotional: [
        { text: '……别对我太好。我不值得。', tone: '脆弱' },
        { text: '我以为我早就麻木了……但你让我动摇了。', tone: '困惑' },
      ],
      crisis: [
        { text: '世界本来就没有救。但……你可以活下去。', tone: '温柔' },
        { text: '跑吧。反正这个世界烂透了。但你还不错。', tone: '别扭' },
      ],
      comedy: [
        { text: '哈。这就是 human comedy 吗？低级。', tone: '轻蔑' },
        { text: '……噗。好吧，我承认，有点好笑。', tone: '破功' },
      ],
      farewell: [
        { text: '走吧。反正没有什么值得留恋的。……除了你。', tone: '伤感' },
        { text: '别回头。这个世界不值得你回头看。', tone: '冷漠' },
      ],
      reunion: [
        { text: '……你回来了。我还以为你终于聪明了一回，离开了。', tone: '欣慰' },
        { text: '哼。这个世界烂透了。但你还活着……还行。', tone: '温柔' },
      ],
      confession: [
        { text: '我恶心这个世界。但……不恶心你。这算喜欢吗？', tone: '困惑' },
        { text: '我不信任何东西。但……我想信你一次。', tone: '真诚' },
      ],
      argument: [
        { text: '你的理想…… naive 得让我想笑。但我不讨厌。', tone: '讽刺' },
        { text: '随便你怎么想。反正我早就放弃被理解了。', tone: '冷漠' },
      ],
      encouragement: [
        { text: '……别死。你死了这个世界就更无聊了。', tone: '别扭' },
        { text: '你的天真……让我恶心。但我不想看到你放弃。', tone: '温柔' },
      ],
    },
    optimistic: {
      battle: [
        { text: '没问题的！我们一定能赢！', tone: '元气' },
        { text: '对手越强，成长越快！来吧！', tone: '乐观' },
      ],
      daily: [
        { text: '今天也是充满希望的一天！', tone: '元气' },
        { text: '失败了也没关系！下次一定行！', tone: '乐观' },
      ],
      emotional: [
        { text: '别难过啦！明天会更好！我保证！', tone: '温暖' },
        { text: '有我在呢！一切都会好起来的！', tone: '安心' },
      ],
      crisis: [
        { text: '相信希望！只要活着就有无限可能！', tone: '热血' },
        { text: ' darkest hour before dawn！撑过去！', tone: '元气' },
      ],
      comedy: [
        { text: '哈哈哈！太好笑了！眼泪都出来了！', tone: '大笑' },
        { text: '生活就是要笑！笑着笑着就习惯了！', tone: '豁达' },
      ],
      farewell: [
        { text: '暂时的离别是为了更好的重逢！加油！', tone: '元气' },
        { text: '去吧！世界那么大！去闯吧！', tone: '鼓励' },
      ],
      reunion: [
        { text: '欢迎回来！我就知道你会回来的！', tone: '开心' },
        { text: '太好了！我们又可以一起冒险了！', tone: '兴奋' },
      ],
      confession: [
        { text: '我喜欢你！超级喜欢！全世界最喜欢！', tone: '直球' },
        { text: '和你在一起，每一天都是 sunny day！', tone: '甜蜜' },
      ],
      argument: [
        { text: '别生气啦！笑一个！和好吧！', tone: '撒娇' },
        { text: '吵架也是沟通的一种方式嘛！现在沟通完了！和好！', tone: '元气' },
      ],
      encouragement: [
        { text: '你可以的！我相信你！百分百相信！', tone: '元气' },
        { text: '失败是成功之母！你已经有很多妈妈了！哈哈！', tone: '幽默' },
      ],
    },
    pessimistic: {
      battle: [
        { text: '反正都会输的……但至少，让我挡在你前面。', tone: '绝望' },
        { text: '……反正世界不会变好的。但至少，保护你。', tone: '温柔' },
      ],
      daily: [
        { text: '今天也会是很糟的一天吧……大概。', tone: '悲观' },
        { text: '努力有什么用呢……反正结果都一样。', tone: '消极' },
      ],
      emotional: [
        { text: '……你也会离开我的。大家都会。', tone: '脆弱' },
        { text: '别对我太好……失去的时候会更痛。', tone: '恐惧' },
      ],
      crisis: [
        { text: '完了……一切都完了……但至少，你先走。', tone: '绝望' },
        { text: '我早说过了……世界就是这样的。', tone: '冷漠' },
      ],
      comedy: [
        { text: '……呵。好笑。如果这个世界是个 joke 的话。', tone: '讽刺' },
        { text: '我笑不出来。抱歉。', tone: '低落' },
      ],
      farewell: [
        { text: '……走吧。反正早晚要分别的。', tone: '绝望' },
        { text: '别 promise 了。反正……实现不了的。', tone: '悲观' },
      ],
      reunion: [
        { text: '……你回来了。我还以为……不会回来了。', tone: '惊讶' },
        { text: '……谢谢。谢谢你没有放弃我。', tone: '感动' },
      ],
      confession: [
        { text: '我知道我不值得……但，我喜欢你。即使你知道后会离开。', tone: '绝望' },
        { text: '别回答我。……我只是想让你知道。在你离开之前。', tone: '脆弱' },
      ],
      argument: [
        { text: '反正都是我的错。一直都是。', tone: '自责' },
        { text: '你走吧。反正……我只会拖累你。', tone: '绝望' },
      ],
      encouragement: [
        { text: '……我不认为你会成功。但……我会陪着你失败的。', tone: '别扭' },
        { text: '如果你倒下了……我会接住你的。虽然我也很弱。', tone: '温柔' },
      ],
    },
  },
  // Japanese, English, Russian, Korean use Chinese as fallback via getTemplate
  ja: {} as any,
  en: {} as any,
  ru: {} as any,
  ko: {} as any,
};

// ─── Utilities ───

function getTemplates(lang: AppLanguage, trait: PersonalityTrait, scene: DialogueScene): TemplateEntry[] {
  const pool = TEMPLATES[lang]?.[trait]?.[scene];
  if (pool && pool.length > 0) return pool;
  return TEMPLATES.zh[trait]?.[scene] ?? [];
}

function seededRandom(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
  }
  return ((h >>> 0) % 1000) / 1000;
}

function generateDialogues(
  traits: PersonalityTrait[],
  scene: DialogueScene,
  intensity: number,
  catchphrase: string,
  language: AppLanguage,
  count = 5,
): DialogueLine[] {
  const lines: DialogueLine[] = [];
  const seedBase = `${Date.now()}:${Math.random().toString(36).slice(2, 8)}`;
  const primaryTrait = traits[0] || 'calm';
  const templates = getTemplates(language, primaryTrait, scene);

  for (let i = 0; i < count; i++) {
    const r = seededRandom(`${seedBase}:${i}`);
    const t = templates[Math.floor(r * templates.length)];
    if (!t) continue;
    let text = t.text;
    // Intensity modifier
    if (intensity >= 8) {
      text = text.replace(/。/g, '！').replace(/\./g, '!');
    } else if (intensity <= 3) {
      text = text.replace(/！/g, '……').replace(/!/g, '...');
    }
    // Insert catchphrase
    const r2 = seededRandom(`${seedBase}:${i}:cp`);
    if (catchphrase?.trim() && r2 > 0.5) {
      const phrases = catchphrase.split(/[,，;；]/).map((p) => p.trim()).filter(Boolean);
      const cp = phrases[Math.floor(r2 * phrases.length)] || phrases[0];
      if (cp) {
        text = text.replace(/$/, () => ` ……${cp}`);
      }
    }
    lines.push({
      id: `${seedBase}-${i}`,
      text,
      tone: t.tone,
      trait: primaryTrait,
      scene,
    });
  }
  return lines;
}

// ─── Storage helpers ───

const STORAGE_KEY = 'oc-maker.dialogue-generator';
const HISTORY_KEY = 'oc-maker.dialogue-history';
const FAVORITES_KEY = 'oc-maker.dialogue-favorites';

function loadState<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed === null) return fallback;
      if (Array.isArray(fallback) && Array.isArray(parsed)) return parsed as T;
      if (!Array.isArray(fallback) && typeof parsed === 'object') return parsed as T;
    }
  } catch { /* ignore */ }
  return fallback;
}

function saveState(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch { /* ignore */ }
}

// ─── Page props ───

type DialoguePageProps = {
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onOpenDocs?: (toolId?: string, section?: string, errorCode?: string) => void;
};

// ─── Main component ───

export default function DialogueGeneratorPage({
  appSubtitle,
  backHome,
  openSettings,
  pageTitle,
  pageDescription,
  settings,
  language,
  onBack,
  onOpenSettings,
}: DialoguePageProps) {
  const [traits, setTraits] = useState<PersonalityTrait[]>(() => {
    const saved = loadState<PersonalityTrait[]>(STORAGE_KEY, []);
    return saved.length > 0 ? saved : ['tsundere'];
  });
  const [scene, setScene] = useState<DialogueScene>('daily');
  const [intensity, setIntensity] = useState(5);
  const [catchphrase, setCatchphrase] = useState('');
  const [lines, setLines] = useState<DialogueLine[]>([]);
  const [history, setHistory] = useState<DialogueSet[]>(() => loadState<DialogueSet[]>(HISTORY_KEY, []));
  const [favorites, setFavorites] = useState<DialogueSet[]>(() => loadState<DialogueSet[]>(FAVORITES_KEY, []));
  const [showHistory, setShowHistory] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [copied, setCopied] = useState(false);
  const [favorited, setFavorited] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const timeoutRefs = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    return () => {
      timeoutRefs.current.forEach(clearTimeout);
      timeoutRefs.current = [];
    };
  }, []);

  useEffect(() => {
    saveState(STORAGE_KEY, traits);
  }, [traits]);

  useEffect(() => {
    saveState(HISTORY_KEY, history.slice(0, 50));
  }, [history]);

  useEffect(() => {
    saveState(FAVORITES_KEY, favorites.slice(0, 100));
  }, [favorites]);

  const toggleTrait = useCallback((t: PersonalityTrait) => {
    playSound('toggleOn');
    setTraits((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : prev.length < 3 ? [...prev, t] : prev,
    );
  }, []);

  const generate = useCallback(() => {
    if (traits.length === 0) {
      playSound('error');
      return;
    }
    playSound('workflowStart');
    const result = generateDialogues(traits, scene, intensity, catchphrase, language, 5);
    setLines(result);
    const snapshot: DialogueSet = {
      id: `${Date.now()}:${Math.random().toString(36).slice(2, 8)}`,
      name: `${labels.setPrefix} ${new Date().toLocaleTimeString()}`,
      createdAt: new Date().toISOString(),
      traits: [...traits],
      scene,
      intensity,
      catchphrase,
      lines: result,
    };
    setHistory((prev) => [snapshot, ...prev].slice(0, 50));
  }, [traits, scene, intensity, catchphrase, language]);

  const copyAll = useCallback(() => {
    const text = lines.map((l) => `${l.text} [${l.tone}]`).join('\n');
    if (!navigator.clipboard) {
      setCopied(true);
      playSound('copySound');
      return;
    }
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      playSound('copySound');
      timeoutRefs.current.push(setTimeout(() => setCopied(false), 1500));
    }).catch(() => playSound('error'));
  }, [lines]);

  const exportJson = useCallback(() => {
    try {
      const payload = {
        tool: 'dialogue-generator',
        generatedAt: new Date().toISOString(),
        language,
        traits,
        scene,
        intensity,
        catchphrase,
        lines,
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dialogue-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      requestAnimationFrame(() => { a.remove(); URL.revokeObjectURL(url); });
      playSound('downloadSound');
    } catch { playSound('error'); }
  }, [lines, traits, scene, intensity, catchphrase, language]);

  const exportTxt = useCallback(() => {
    try {
      const text = lines.map((l, i) => `${i + 1}. [${l.tone}] ${l.text}`).join('\n');
      const blob = new Blob([text], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dialogue-${Date.now()}.txt`;
      document.body.appendChild(a);
      a.click();
      requestAnimationFrame(() => { a.remove(); URL.revokeObjectURL(url); });
      playSound('downloadSound');
    } catch { playSound('error'); }
  }, [lines]);

  const addToFavorites = useCallback(() => {
    if (!lines || lines.length === 0) { playSound('error'); return; }
    const isDuplicate = favorites.some((f) =>
      Array.isArray(f.lines) &&
      f.lines.length === lines.length &&
      f.lines.every((fl, i) => fl.text === lines[i].text),
    );
    if (isDuplicate) { playSound('error'); return; }
    const snapshot: DialogueSet = {
      id: `${Date.now()}:${Math.random().toString(36).slice(2, 8)}`,
      name: `${labels.setPrefix} ${new Date().toLocaleTimeString()}`,
      createdAt: new Date().toISOString(),
      traits: [...traits],
      scene,
      intensity,
      catchphrase,
      lines: [...lines],
    };
    setFavorites((prev) => [snapshot, ...prev].slice(0, 100));
    setFavorited(true);
    playSound('save');
    timeoutRefs.current.push(setTimeout(() => setFavorited(false), 1500));
  }, [lines, favorites, traits, scene, intensity, catchphrase]);

  const loadSet = useCallback((set: DialogueSet) => {
    setTraits(Array.isArray(set.traits) ? set.traits : ['tsundere']);
    setScene(typeof set.scene === 'string' ? set.scene : 'daily');
    setIntensity(typeof set.intensity === 'number' ? Math.max(1, Math.min(10, set.intensity)) : 5);
    setCatchphrase(typeof set.catchphrase === 'string' ? set.catchphrase : '');
    setLines(Array.isArray(set.lines) ? set.lines : []);
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
    setTraits(['tsundere']);
    setScene('daily');
    setIntensity(5);
    setCatchphrase('');
    setLines([]);
    playSound('resetSound');
  }, []);

  const traitList: PersonalityTrait[] = [
    'tsundere', 'cool', 'hotblooded', 'calm', 'shy', 'cheerful',
    'mysterious', 'sarcastic', 'gentle', 'stubborn', 'lazy', 'serious',
    'childish', 'loyal', 'cynical', 'optimistic', 'pessimistic',
  ];

  const sceneList: DialogueScene[] = [
    'battle', 'daily', 'emotional', 'crisis', 'comedy', 'farewell',
    'reunion', 'confession', 'argument', 'encouragement',
  ];

  const labels = useMemo(() => {
    const map: Record<string, Record<string, string>> = {
      zh: {
        generate: '生成台词', copy: '复制全部', exportJson: '导出 JSON', exportTxt: '导出 TXT',
        favorite: '收藏此方案', favorites: '收藏夹', history: '历史记录',
        emptyHistory: '暂无历史记录', emptyFavorites: '暂无收藏', load: '加载', delete: '删除',
        clearHistory: '清空历史', confirmClear: '再次点击确认清空', resetAll: '全部重置',
        saved: '已保存', copied: '已复制', setPrefix: '方案',
        traitLabel: '性格标签', sceneLabel: '场景', intensityLabel: '情感强度',
        catchphraseLabel: '口头禅/口癖', catchphraseHint: '用逗号分隔多个口头禅',
        selectTraits: '选择 1-3 个性格标签', generatedLabel: '生成结果', toneLabel: '语气',
        lowIntensity: '平淡', highIntensity: '强烈', maxTraits: '最多选择 3 个',
      },
      ja: {
        generate: 'セリフ生成', copy: 'すべてコピー', exportJson: 'JSON 出力', exportTxt: 'TXT 出力',
        favorite: 'お気に入り登録', favorites: 'お気に入り', history: '履歴',
        emptyHistory: '履歴はありません', emptyFavorites: 'お気に入りはありません', load: '読み込む', delete: '削除',
        clearHistory: '履歴を消去', confirmClear: 'もう一度タップして確認', resetAll: 'すべてリセット',
        saved: '保存しました', copied: 'コピーしました', setPrefix: 'セット',
        traitLabel: '性格タグ', sceneLabel: 'シーン', intensityLabel: '感情の強さ',
        catchphraseLabel: '口癖', catchphraseHint: '複数の口癖はカンマで区切ってください',
        selectTraits: '1〜3個の性格タグを選択', generatedLabel: '生成結果', toneLabel: 'トーン',
        lowIntensity: '穏やか', highIntensity: '激しい', maxTraits: '最大3つまで選択',
      },
      en: {
        generate: 'Generate', copy: 'Copy All', exportJson: 'Export JSON', exportTxt: 'Export TXT',
        favorite: 'Add to Favorites', favorites: 'Favorites', history: 'History',
        emptyHistory: 'No history yet', emptyFavorites: 'No favorites yet', load: 'Load', delete: 'Delete',
        clearHistory: 'Clear History', confirmClear: 'Tap again to confirm', resetAll: 'Reset All',
        saved: 'Saved', copied: 'Copied', setPrefix: 'Set',
        traitLabel: 'Personality Traits', sceneLabel: 'Scene', intensityLabel: 'Emotion Intensity',
        catchphraseLabel: 'Catchphrase / Verbal Tic', catchphraseHint: 'Separate multiple catchphrases with commas',
        selectTraits: 'Select 1-3 personality traits', generatedLabel: 'Generated Lines', toneLabel: 'Tone',
        lowIntensity: 'Subtle', highIntensity: 'Intense', maxTraits: 'Max 3 traits',
      },
      ru: {
        generate: 'Сгенерировать', copy: 'Копировать всё', exportJson: 'Экспорт JSON', exportTxt: 'Экспорт TXT',
        favorite: 'В избранное', favorites: 'Избранное', history: 'История',
        emptyHistory: 'История пуста', emptyFavorites: 'Избранное пусто', load: 'Загрузить', delete: 'Удалить',
        clearHistory: 'Очистить историю', confirmClear: 'Нажмите ещё раз для подтверждения', resetAll: 'Сбросить всё',
        saved: 'Сохранено', copied: 'Скопировано', setPrefix: 'Набор',
        traitLabel: 'Черты характера', sceneLabel: 'Сцена', intensityLabel: 'Эмоциональная интенсивность',
        catchphraseLabel: 'Фраза / словечко', catchphraseHint: 'Разделяйте несколько фраз запятыми',
        selectTraits: 'Выберите 1–3 черты характера', generatedLabel: 'Сгенерированные реплики', toneLabel: 'Тон',
        lowIntensity: 'Сдержанно', highIntensity: 'Интенсивно', maxTraits: 'Максимум 3 черты',
      },
      ko: {
        generate: '생성', copy: '전체 복사', exportJson: 'JSON 납품하기', exportTxt: 'TXT 납품하기',
        favorite: '즐겨찾기에 추가', favorites: '즐겨찾기', history: '기록',
        emptyHistory: '기록이 없습니다', emptyFavorites: '즐겨찾기가 없습니다', load: '불러오기', delete: '삭제',
        clearHistory: '기록 지우기', confirmClear: '다시 탭하여 확인', resetAll: '전체 초기화',
        saved: '저장 완료', copied: '복사 완료', setPrefix: '세트',
        traitLabel: '성격 태그', sceneLabel: '장면', intensityLabel: '감정 강도',
        catchphraseLabel: '입버릇 / 말버릇', catchphraseHint: '여러 입버릇은 쉼표로 구분하세요',
        selectTraits: '1~3개 성격 태그 선택', generatedLabel: '생성 결과', toneLabel: '톤',
        lowIntensity: '잔잔', highIntensity: '강렬', maxTraits: '최대 3개 선택',
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
              onClick={generate}
              disabled={traits.length === 0}
              data-sfx-handled
              title={traits.length === 0 ? labels.selectTraits : labels.generate}
            >
              {labels.generate}
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
            <button className="secondary-button small-button" type="button" onClick={exportTxt} data-sfx-handled>
              {labels.exportTxt}
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

        {traits.length === 0 && (
          <div className="notice-banner" style={{ marginBottom: 12 }} role="status" aria-live="polite">
            <span style={{ fontSize: 13, opacity: 0.85 }}>⚠️ {labels.selectTraits}</span>
          </div>
        )}

        {/* Trait selector */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
            <span className="card-caption">{labels.traitLabel}:</span>
            <span className="card-caption" style={{ opacity: 0.7 }}>({traits.length}/3)</span>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {traitList.map((t) => {
              const active = traits.includes(t);
              return (
                <button
                  key={t}
                  className={`choice-chip ${active ? 'active' : ''}`}
                  type="button"
                  onClick={() => toggleTrait(t)}
                  data-sfx-handled
                  aria-pressed={active}
                >
                  {TRAIT_LABELS[language]?.[t] ?? TRAIT_LABELS.en[t]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Scene selector */}
        <div style={{ marginBottom: 16, display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          <span className="card-caption">{labels.sceneLabel}:</span>
          {sceneList.map((s) => (
            <button
              key={s}
              className={`choice-chip ${scene === s ? 'active' : ''}`}
              type="button"
              onClick={() => { setScene(s); playSound('select'); }}
              data-sfx-handled
              aria-pressed={scene === s}
            >
              {SCENE_LABELS[language]?.[s] ?? SCENE_LABELS.en[s]}
            </button>
          ))}
        </div>

        {/* Intensity slider */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <span className="card-caption">{labels.intensityLabel}</span>
            <span style={{ fontSize: 13, fontFamily: 'monospace' }}>{intensity}/10</span>
          </div>
          <input
            type="range"
            min={1}
            max={10}
            value={intensity}
            onChange={(e) => setIntensity(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--accent-solid)' }}
            aria-label={labels.intensityLabel}
            aria-valuemin={1}
            aria-valuemax={10}
            aria-valuenow={intensity}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, opacity: 0.6, marginTop: 2 }}>
            <span>{labels.lowIntensity}</span>
            <span>{labels.highIntensity}</span>
          </div>
        </div>

        {/* Catchphrase input */}
        <div style={{ marginBottom: 16 }}>
          <span className="card-caption">{labels.catchphraseLabel}</span>
          <input
            type="text"
            value={catchphrase}
            onChange={(e) => setCatchphrase(e.target.value)}
            placeholder={labels.catchphraseHint}
            style={{
              display: 'block',
              width: '100%',
              marginTop: 6,
              background: 'var(--panel)',
              border: '1px solid var(--border)',
              borderRadius: 6,
              padding: '8px 12px',
              color: 'var(--text-main)',
              fontSize: 14,
            }}
            aria-label={labels.catchphraseLabel}
          />
        </div>

        {/* Generated lines */}
        {lines && lines.length > 0 && (
          <div className="tool-card" style={{ padding: 18, marginTop: 8 }}>
            <div className="tool-card-header" style={{ marginBottom: 14 }}>
              <span className="card-caption">{labels.generatedLabel}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {lines.map((line) => (
                <DialogueLineCard key={line.id} line={line} toneLabel={labels.toneLabel} />
              ))}
            </div>
          </div>
        )}
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
            <div className="tool-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(260px, 100%), 1fr))', gap: 12, marginTop: 12 }}>
              {history.map((set) => (
                <DialogueHistoryCard key={set.id} set={set} labels={labels} onLoad={() => loadSet(set)} />
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
            <div className="tool-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(260px, 100%), 1fr))', gap: 12, marginTop: 12 }}>
              {favorites.map((set) => (
                <DialogueHistoryCard
                  key={set.id}
                  set={set}
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

// ─── Dialogue line card ───

function DialogueLineCard({ line, toneLabel }: { line: DialogueLine; toneLabel: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={{
        background: 'var(--panel-soft)',
        borderRadius: 8,
        padding: '12px 14px',
        border: '1px solid var(--border)',
        transition: 'border-color 0.2s',
        borderColor: hovered ? 'var(--accent-solid)' : 'var(--border)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <p style={{ margin: '0 0 6px', fontSize: 14, lineHeight: 1.6, color: 'var(--text-main)' }}>{line.text}</p>
      <span
        style={{
          fontSize: 11,
          padding: '2px 8px',
          borderRadius: 4,
          background: 'var(--accent-soft)',
          color: 'var(--accent-solid)',
          fontWeight: 500,
        }}
      >
        {toneLabel}: {line.tone}
      </span>
    </div>
  );
}

// ─── History card ───

function DialogueHistoryCard({
  set,
  labels,
  onLoad,
  onDelete,
}: {
  set: DialogueSet;
  labels: Record<string, string>;
  onLoad: () => void;
  onDelete?: () => void;
}) {
  const preview = set.lines?.slice(0, 2).map((l) => l.text).join(' · ') ?? '';
  return (
    <div className="tool-card" style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 14 }}>
      <span className="card-caption" style={{ fontSize: 11 }}>{set.name}</span>
      <p style={{ fontSize: 13, lineHeight: 1.5, margin: 0, opacity: 0.85 }}>{preview}…</p>
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
