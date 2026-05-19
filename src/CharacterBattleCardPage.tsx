import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import { playSound } from './audioEngine';
import type { AppLanguage, FeatureScreen, SettingsState } from './types';

// ─── Types ───

export type BattleStat = {
  id: string;
  name: string;
  value: number;
  max: number;
  color: string;
};

export type BattleSkill = {
  id: string;
  name: string;
  type: string;
  level: number;
  maxLevel: number;
  description: string;
};

export type BattleCardSet = {
  id: string;
  characterName: string;
  title: string;
  level: number;
  stats: BattleStat[];
  skills: BattleSkill[];
  createdAt: string;
};

// ─── Translation helpers ───

const STAT_NAMES: Record<string, Record<string, string>> = {
  zh: { hp: '生命值', mp: '魔力值', atk: '攻击力', def: '防御力', spd: '速度', crt: '暴击率' },
  ja: { hp: 'HP', mp: 'MP', atk: '攻撃力', def: '防御力', spd: '素早さ', crt: '会心率' },
  en: { hp: 'HP', mp: 'MP', atk: 'ATK', def: 'DEF', spd: 'SPD', crt: 'CRT' },
  ru: { hp: 'HP', mp: 'MP', atk: 'АТК', def: 'ЗАЩ', spd: 'СКО', crt: 'КРИТ' },
  ko: { hp: 'HP', mp: 'MP', atk: '공격력', def: '방어력', spd: '속도', crt: '치명타' },
};

const ATTR_NAMES: Record<string, Record<string, string>> = {
  zh: { str: '力量', dex: '敏捷', con: '体质', int: '智力', wis: '感知', cha: '魅力', vit: '耐力', luc: '幸运' },
  ja: { str: '筋力', dex: '敏捷', con: '体力', int: '知性', wis: '感知', cha: '魅力', vit: '耐力', luc: '運' },
  en: { str: 'STR', dex: 'DEX', con: 'CON', int: 'INT', wis: 'WIS', cha: 'CHA', vit: 'VIT', luc: 'LUC' },
  ru: { str: 'СИЛ', dex: 'ЛОВ', con: 'ТЕЛ', int: 'ИНТ', wis: 'МУД', cha: 'ХАР', vit: 'ЖИВ', luc: 'УДА' },
  ko: { str: '힘', dex: '민첩', con: '천성', int: '지능', wis: '감각', cha: '매력', vit: '활력', luc: '행운' },
};

function getStatName(id: string, lang: AppLanguage): string {
  return STAT_NAMES[lang]?.[id] ?? STAT_NAMES.en[id] ?? id.toUpperCase();
}

function getAttrName(id: string, lang: AppLanguage): string {
  return ATTR_NAMES[lang]?.[id] ?? ATTR_NAMES.en[id] ?? id.toUpperCase();
}

// ─── Utilities ───

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

function getLinkedStats(): Record<string, number> {
  try {
    const raw = localStorage.getItem('oc-maker.character-stats');
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    const arr = Array.isArray(parsed) ? parsed : parsed?.attributes;
    if (Array.isArray(arr)) {
      const map: Record<string, number> = {};
      for (const attr of arr) {
        if (attr?.id && typeof attr.value === 'number') {
          map[attr.id] = attr.value;
        }
      }
      return map;
    }
  } catch { /* ignore */ }
  return {};
}

function getLinkedSkills(): BattleSkill[] {
  try {
    const raw = localStorage.getItem('oc-maker.skill-tree.nodes');
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((n: any) => n?.currentLevel > 0)
      .map((n: any) => ({
        id: String(n.id ?? ''),
        name: String(n.name ?? ''),
        type: String(n.type ?? 'active'),
        level: Math.max(0, Number.isNaN(Number(n.currentLevel)) ? 0 : Number(n.currentLevel ?? 0)),
        maxLevel: Math.max(1, Number.isNaN(Number(n.maxLevel)) ? 1 : Number(n.maxLevel ?? 1)),
        description: String(n.description ?? ''),
      }));
  } catch { /* ignore */ }
  return [];
}

function calculateBattleStats(stats: Record<string, number>): Record<string, number> {
  const s = (id: string) => stats[id] ?? 0;
  return {
    hp: Math.round((s('vit') + s('con')) * 5 + 100),
    mp: Math.round((s('mag') + s('int')) * 5 + 50),
    atk: Math.round(s('str') * 2 + s('atk')),
    def: Math.round(s('con') * 2 + s('def')),
    spd: Math.round(s('dex') + s('spd')),
    crt: Math.round((s('luc') * 0.5 + s('dex') * 0.3) * 10) / 10,
  };
}

// ─── Component ───

export default function CharacterBattleCardPage({
  appSubtitle,
  language,
  settings,
  onNavigate,
  onBack,
  onOpenSettings,
  openSettings,
  pageTitle,
  pageDescription,
}: {
  appSubtitle: string;
  language: AppLanguage;
  settings: SettingsState;
  onNavigate: (screen: FeatureScreen) => void;
  onBack: () => void;
  onOpenSettings: () => void;
  openSettings: string;
  pageTitle: string;
  pageDescription: string;
}) {
  const themeKey = settings.stylePreset ?? 'default';
  const cardRef = useRef<HTMLDivElement>(null);

  const labels = useMemo(() => {
    const dict: Record<string, Record<string, string>> = {
      zh: {
        backHome: '返回首页', readData: '读取关联数据', noLinkedData: '暂无关联数据，请先创建角色属性或技能树。',
        characterName: '角色名称', title: '称号', level: '等级', className: '职业',
        typeActive: '主动', typePassive: '被动', typeUltimate: '终极', typeTrait: '特质', typeSpecial: '特殊',
        exportPng: '导出 PNG', exportJson: '导出 JSON', copyJson: '复制 JSON', copied: '已复制',
        battleStats: '战斗属性', skills: '技能', unlockedSkills: '已解锁技能', noSkills: '暂无解锁技能',
        warrior: '战士', mage: '法师', assassin: '刺客', support: '辅助', custom: '自定义', unknown: '未知',
        totalAttributes: '总属性', skillPoints: '技能点', generateTitle: '生成称号',
        hpFull: '生命值', mpFull: '魔力值', atkFull: '攻击力', defFull: '防御力', spdFull: '速度', crtFull: '暴击率',
        noticeExportSuccess: '导出成功', noticeExportError: '导出失败',
      },
      ja: {
        backHome: 'ホームへ戻る', readData: '連携データ読込', noLinkedData: '連携データがありません。先にキャラステータスまたはスキルツリーを作成してください。',
        characterName: 'キャラ名', title: '称号', level: 'レベル', className: '職業',
        typeActive: 'アクティブ', typePassive: 'パッシブ', typeUltimate: 'アルティメット', typeTrait: '特性', typeSpecial: '特殊',
        exportPng: 'PNG 出力', exportJson: 'JSON 出力', copyJson: 'JSON コピー', copied: 'コピー済',
        battleStats: '戦闘ステータス', skills: 'スキル', unlockedSkills: '解放済スキル', noSkills: '解放済スキルなし',
        warrior: '戦士', mage: '魔導士', assassin: '暗殺者', support: 'サポート', custom: 'カスタム', unknown: '不明',
        totalAttributes: '合計ステータス', skillPoints: 'スキルポイント', generateTitle: '称号生成',
        hpFull: 'HP', mpFull: 'MP', atkFull: '攻撃力', defFull: '防御力', spdFull: '素早さ', crtFull: '会心率',
        noticeExportSuccess: '出力成功', noticeExportError: '出力失敗',
      },
      en: {
        backHome: 'Back home', readData: 'Read linked data', noLinkedData: 'No linked data yet. Create character stats or a skill tree first.',
        characterName: 'Name', title: 'Title', level: 'Level', className: 'Class',
        typeActive: 'Active', typePassive: 'Passive', typeUltimate: 'Ultimate', typeTrait: 'Trait', typeSpecial: 'Special',
        exportPng: 'Export PNG', exportJson: 'Export JSON', copyJson: 'Copy JSON', copied: 'Copied',
        battleStats: 'Battle Stats', skills: 'Skills', unlockedSkills: 'Unlocked Skills', noSkills: 'No unlocked skills',
        warrior: 'Warrior', mage: 'Mage', assassin: 'Assassin', support: 'Support', custom: 'Custom', unknown: 'Unknown',
        totalAttributes: 'Total Attributes', skillPoints: 'Skill Points', generateTitle: 'Generate Title',
        hpFull: 'HP', mpFull: 'MP', atkFull: 'ATK', defFull: 'DEF', spdFull: 'SPD', crtFull: 'CRT Rate',
        noticeExportSuccess: 'Export successful', noticeExportError: 'Export failed',
      },
      ru: {
        backHome: 'На главную', readData: 'Считать данные', noLinkedData: 'Нет связанных данных. Сначала создайте характеристики или дерево навыков.',
        characterName: 'Имя', title: 'Титул', level: 'Уровень', className: 'Класс',
        typeActive: 'Активный', typePassive: 'Пассивный', typeUltimate: 'Ультимат', typeTrait: 'Черта', typeSpecial: 'Особый',
        exportPng: 'Экспорт PNG', exportJson: 'Экспорт JSON', copyJson: 'Копировать JSON', copied: 'Скопировано',
        battleStats: 'Боевые хар-ки', skills: 'Навыки', unlockedSkills: 'Разблокировано', noSkills: 'Нет разблокированных',
        warrior: 'Воин', mage: 'Маг', assassin: 'Ассасин', support: 'Поддержка', custom: 'Свой', unknown: 'Неизвестно',
        totalAttributes: 'Всего хар-к', skillPoints: 'Очки навыков', generateTitle: 'Сгенерировать титул',
        hpFull: 'HP', mpFull: 'MP', atkFull: 'АТК', defFull: 'ЗАЩ', spdFull: 'СКО', crtFull: 'Шанс крита',
        noticeExportSuccess: 'Экспорт успешен', noticeExportError: 'Ошибка экспорта',
      },
      ko: {
        backHome: '홈으로', readData: '연동 데이터 읽기', noLinkedData: '연동 데이터가 없습니다. 먼저 캐릭터 스탯이나 스킬 트리를 생성하세요.',
        characterName: '이름', title: '칭호', level: '레벨', className: '직업',
        typeActive: '액티브', typePassive: '패시브', typeUltimate: '궁극', typeTrait: '특성', typeSpecial: '특수',
        exportPng: 'PNG 납품하기', exportJson: 'JSON 납품하기', copyJson: 'JSON 복사', copied: '복사됨',
        battleStats: '전투 스탯', skills: '스킬', unlockedSkills: '해금된 스킬', noSkills: '해금된 스킬 없음',
        warrior: '전사', mage: '마법사', assassin: '암살자', support: '서포터', custom: '커스텀', unknown: '알 수 없음',
        totalAttributes: '총 스탯', skillPoints: '스킬 포인트', generateTitle: '칭호 생성',
        hpFull: 'HP', mpFull: 'MP', atkFull: '공격력', defFull: '방어력', spdFull: '속도', crtFull: '치명타율',
        noticeExportSuccess: '납품 성공', noticeExportError: '납품 실패',
      },
    };
    const base = dict[language] ?? dict.en;
    return { ...dict.en, ...base };
  }, [language]);

  const [characterName, setCharacterName] = useState('');
  const [title, setTitle] = useState('');
  const [className, setClassName] = useState('');
  const [linkedStats, setLinkedStats] = useState<Record<string, number>>({});
  const [linkedSkills, setLinkedSkills] = useState<BattleSkill[]>([]);
  const [notice, setNotice] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const noticeTimeoutRef = useRef<number>(0);
  const isMountedRef = useRef<boolean>(true);

  const battleStats = useMemo(() => calculateBattleStats(linkedStats), [linkedStats]);

  const totalAttr = useMemo(() => {
    return Object.values(linkedStats).reduce((sum, v) => sum + (typeof v === 'number' ? v : 0), 0);
  }, [linkedStats]);

  const level = useMemo(() => Math.max(1, Math.floor(totalAttr / 10)), [totalAttr]);

  const skillPoints = useMemo(() => {
    return linkedSkills.reduce((sum, s) => sum + s.level, 0);
  }, [linkedSkills]);

  const displayStats: BattleStat[] = useMemo(() => {
    const maxMap: Record<string, number> = { hp: 1000, mp: 500, atk: 300, def: 300, spd: 200, crt: 100 };
    const colorMap: Record<string, string> = { hp: '#f87171', mp: '#60a5fa', atk: '#fbbf24', def: '#34d399', spd: '#a78bfa', crt: '#f472b6' };
    return (['hp', 'mp', 'atk', 'def', 'spd', 'crt'] as const).map((id) => ({
      id,
      name: getStatName(id, language),
      value: battleStats[id] ?? 0,
      max: maxMap[id] ?? 100,
      color: colorMap[id] ?? '#94a3b8',
    }));
  }, [battleStats, language]);

  const readLinkedData = useCallback(() => {
    const stats = getLinkedStats();
    const skills = getLinkedSkills();
    setLinkedStats(stats);
    setLinkedSkills(skills);

    // Try to infer class from skill tree preset
    try {
      const historyRaw = localStorage.getItem('oc-maker.skill-tree.history');
      if (historyRaw) {
        const history = JSON.parse(historyRaw);
        if (Array.isArray(history) && history[0]?.name) {
          const name = String(history[0].name);
          if (name.includes('战士') || name.includes('Warrior') || name.includes('戦士') || name.includes('Воин') || name.includes('전사')) setClassName(labels.warrior);
          else if (name.includes('法师') || name.includes('Mage') || name.includes('魔導士') || name.includes('Маг') || name.includes('마법사')) setClassName(labels.mage);
          else if (name.includes('刺客') || name.includes('Assassin') || name.includes('暗殺者') || name.includes('Ассасин') || name.includes('암살자')) setClassName(labels.assassin);
          else if (name.includes('辅助') || name.includes('Support') || name.includes('サポート') || name.includes('Поддержка') || name.includes('서포터')) setClassName(labels.support);
          else setClassName(labels.custom);
        } else {
          setClassName(labels.custom);
        }
      } else {
        setClassName(labels.custom);
      }
    } catch { setClassName(labels.custom); }

    playSound('buttonClick');
  }, [labels.warrior, labels.mage, labels.assassin, labels.support, labels.custom]);

  useEffect(() => {
    readLinkedData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (noticeTimeoutRef.current) clearTimeout(noticeTimeoutRef.current);
    };
  }, []);

  const showNotice = useCallback((text: string, type: 'success' | 'error') => {
    if (noticeTimeoutRef.current) clearTimeout(noticeTimeoutRef.current);
    setNotice({ text, type });
    noticeTimeoutRef.current = window.setTimeout(() => {
      if (isMountedRef.current) setNotice(null);
      noticeTimeoutRef.current = 0;
    }, 2500);
  }, []);

  const generateTitle = useCallback(() => {
    const titles: Record<string, string[]> = {
      zh: ['无名之辈', '初出茅庐', '崭露头角', '声名鹊起', '名震一方', '传说之始', '王者降临', '神话缔造者'],
      ja: ['名もなき者', '駆け出し', '頭角を現す', '名声高き', '一方の名', '伝説の始まり', '王者降臨', '神話の創造者'],
      en: ['Nobody', 'Novice', 'Rising Star', 'Renowned', 'Local Legend', 'Legend Begins', 'King Arrives', 'Myth Maker'],
      ru: ['Никто', 'Новичок', 'Восходящая звезда', 'Известный', 'Местная легенда', 'Начало легенды', 'Прибытие короля', 'Создатель мифов'],
      ko: ['무명씨', '초보자', '떠오르는 별', '유명인', '지역 전설', '전설의 시작', '왕의 강림', '신화 창조자'],
    };
    const pool = titles[language] ?? titles.en;
    const idx = Math.min(pool.length - 1, Math.floor(level / 10));
    const chosen = pool[Math.max(0, idx)] ?? pool[0] ?? '?';
    setTitle(chosen);
    playSound('buttonClick');
  }, [language, level]);

  const exportPng = useCallback(async () => {
    if (!cardRef.current || isExporting) return;
    setIsExporting(true);
    try {
      const dataUrl = await toPng(cardRef.current, { pixelRatio: 2, backgroundColor: 'transparent' });
      if (!isMountedRef.current) return;
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `battle-card-${(characterName || 'oc').replace(/[^a-zA-Z0-9_\-\u4e00-\u9fa5\u3040-\u309F\u30A0-\u30FF\uAC00-\uD7AF]/g, '_')}.png`;
      document.body.appendChild(a);
      a.click();
      requestAnimationFrame(() => { a.remove(); });
      showNotice(labels.noticeExportSuccess, 'success');
      playSound('buttonClick');
    } catch {
      if (isMountedRef.current) showNotice(labels.noticeExportError, 'error');
    } finally {
      if (isMountedRef.current) setIsExporting(false);
    }
  }, [characterName, labels.noticeExportSuccess, labels.noticeExportError, showNotice, isExporting]);

  const exportJson = useCallback(() => {
    const data: BattleCardSet = {
      id: `${Date.now()}:${Math.random().toString(36).slice(2, 8)}`,
      characterName: characterName || 'OC',
      title: title || labels.unknown,
      level,
      stats: displayStats.map((s) => ({ ...s })),
      skills: linkedSkills.map((s) => ({ ...s })),
      createdAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `battle-card-${(characterName || 'oc').replace(/[^a-zA-Z0-9_\-\u4e00-\u9fa5\u3040-\u309F\u30A0-\u30FF\uAC00-\uD7AF]/g, '_')}.json`;
    document.body.appendChild(a);
    a.click();
    requestAnimationFrame(() => { a.remove(); URL.revokeObjectURL(url); });
    showNotice(labels.noticeExportSuccess, 'success');
    playSound('buttonClick');
  }, [characterName, title, level, displayStats, linkedSkills, labels.unknown, labels.noticeExportSuccess, showNotice]);

  const copyJson = useCallback(async () => {
    const data = { characterName: characterName || 'OC', title, level, stats: displayStats, skills: linkedSkills };
    const text = JSON.stringify(data, null, 2);
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        showNotice(labels.copied, 'success');
      }
    } catch { /* ignore */ }
  }, [characterName, title, level, displayStats, linkedSkills, labels.copied, showNotice]);

  const hasData = Object.keys(linkedStats).length > 0 || linkedSkills.length > 0;

  return (
    <main className="feature-shell tool-page-shell">
      <header className="feature-header fade-up delay-1">
        <div className="feature-header-meta">
          <button className="back-link" type="button" data-sfx-handled onClick={() => { playSound('back'); onBack(); }}>
            ← {labels.backHome}
          </button>
        </div>
        <div className="tool-header-actions">
          <button className="secondary-button small-button" type="button" onClick={() => { playSound('buttonClick'); readLinkedData(); }} data-sfx-handled>
            {labels.readData}
          </button>
          <button className="primary-button small-button" type="button" onClick={() => { playSound('buttonClick'); exportPng(); }} data-sfx-handled disabled={!hasData || isExporting}>
            {isExporting ? 'Exporting…' : labels.exportPng}
          </button>
          <button className="secondary-button small-button" type="button" onClick={() => { playSound('buttonClick'); onOpenSettings(); }} data-sfx-handled>
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
        </div>

        {notice && (
          <div className={`notice-banner ${notice.type}`}>
            {notice.text}
          </div>
        )}

        {!hasData && (
          <div className="notice-banner error" style={{ marginBottom: '16px' }}>
            {labels.noLinkedData}
          </div>
        )}

        {/* Battle Card */}
      <div
        ref={cardRef}
        className="battle-card-panel"
        style={{
          background: 'linear-gradient(135deg, var(--surface) 0%, var(--bg) 100%)',
          borderRadius: '20px',
          border: '2px solid var(--border)',
          padding: '28px',
          maxWidth: '720px',
          margin: '0 auto',
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        }}
      >
        {/* Header row */}
        <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap' }}>
          {/* Avatar placeholder */}
          <div role="img" aria-label={labels.characterName || 'Character avatar'} style={{
            width: '96px', height: '96px', borderRadius: '50%',
            background: 'var(--bg)', border: '3px solid var(--accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2.2rem', flexShrink: 0,
          }}>
            ⚔️
          </div>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '8px' }}>
              <input
                type="text"
                value={characterName}
                onChange={(e) => setCharacterName(e.target.value)}
                placeholder={labels.characterName}
                style={{ padding: '6px 12px', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: '1.1rem', fontWeight: 600, width: '160px' }}
              />
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={labels.title}
                style={{ padding: '6px 12px', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: '0.9rem', width: '140px' }}
              />
              <button className="secondary-button small-button" type="button" onClick={() => { playSound('buttonClick'); generateTitle(); }} data-sfx-handled>
                {labels.generateTitle}
              </button>
            </div>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              <span>{labels.level}: <strong style={{ color: 'var(--accent)' }}>{level}</strong></span>
              <span>{labels.className}: <strong style={{ color: 'var(--accent)' }}>{className || labels.unknown}</strong></span>
              <span>{labels.totalAttributes}: <strong>{totalAttr}</strong></span>
              <span>{labels.skillPoints}: <strong>{skillPoints}</strong></span>
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {labels.battleStats}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '14px' }}>
            {displayStats.map((stat) => {
              const pct = Math.min(100, (stat.value / stat.max) * 100);
              return (
                <div key={stat.id} style={{ background: 'var(--bg)', borderRadius: '12px', padding: '12px', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{stat.name}</span>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text)', fontWeight: 700 }}>{stat.value}</span>
                  </div>
                  <div style={{ height: '8px', background: 'var(--surface)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: stat.color, borderRadius: '4px', transition: 'width 0.5s ease' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Skills */}
        <div>
          <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {labels.unlockedSkills} ({linkedSkills.length})
          </div>
          {linkedSkills.length === 0 ? (
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', padding: '16px', textAlign: 'center', background: 'var(--bg)', borderRadius: '12px' }}>
              {labels.noSkills}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '380px', overflowY: 'auto', paddingRight: '4px' }}>
              {linkedSkills.map((skill) => (
                <div key={skill.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', background: 'var(--bg)', borderRadius: '10px', border: '1px solid var(--border)' }}>
                  <span style={{
                    fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', padding: '2px 8px', borderRadius: '6px',
                    background: skill.type === 'active' ? 'rgba(248,113,113,0.15)' : skill.type === 'passive' ? 'rgba(96,165,250,0.15)' : skill.type === 'ultimate' ? 'rgba(167,139,250,0.15)' : skill.type === 'trait' ? 'rgba(52,211,153,0.15)' : 'rgba(251,191,36,0.15)',
                    color: skill.type === 'active' ? '#f87171' : skill.type === 'passive' ? '#60a5fa' : skill.type === 'ultimate' ? '#a78bfa' : skill.type === 'trait' ? '#34d399' : '#fbbf24',
                  }}>
                    {labels[`type${skill.type.charAt(0).toUpperCase() + skill.type.slice(1)}` as keyof typeof labels] ?? skill.type}
                  </span>
                  <span style={{ fontWeight: 600, color: 'var(--text)', fontSize: '0.9rem', flex: 1 }}>{skill.name}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Lv.{skill.level}/{skill.maxLevel}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Linked raw stats (compact) */}
        {Object.keys(linkedStats).length > 0 && (
          <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
              {labels.totalAttributes}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {Object.entries(linkedStats).map(([k, v]) => (
                <span key={k} style={{ fontSize: '0.75rem', color: 'var(--text)', background: 'var(--surface)', padding: '3px 10px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                  {getAttrName(k, language)}: {v}
                </span>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
