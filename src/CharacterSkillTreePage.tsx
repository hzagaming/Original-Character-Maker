import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { playSound } from './audioEngine';
import type { AppLanguage, FeatureScreen, SettingsState } from './types';

// ─── Types ───

export type SkillType = 'active' | 'passive' | 'ultimate' | 'trait' | 'special';

export type SkillNode = {
  id: string;
  name: string;
  description: string;
  type: SkillType;
  tier: number; // 1-5, visual ring
  x: number; // 0-100 percentage within tree container
  y: number; // 0-100 percentage
  parentIds: string[];
  requiredStats: Record<string, number>;
  maxLevel: number;
  currentLevel: number;
  color: string;
};

export type SkillTreeSet = {
  id: string;
  name: string;
  characterName: string;
  nodes: SkillNode[];
  createdAt: string;
  updatedAt: string;
};

// ─── Translation helpers ───

const SKILL_TYPE_NAMES: Record<string, Record<SkillType, string>> = {
  zh: { active: '主动', passive: '被动', ultimate: '终极', trait: '特质', special: '特殊' },
  ja: { active: 'アクティブ', passive: 'パッシブ', ultimate: 'アルティメット', trait: '特性', special: '特殊' },
  en: { active: 'Active', passive: 'Passive', ultimate: 'Ultimate', trait: 'Trait', special: 'Special' },
  ru: { active: 'Активное', passive: 'Пассивное', ultimate: 'Ультимативное', trait: 'Черта', special: 'Особое' },
  ko: { active: '액티브', passive: '패시브', ultimate: '궁극기', trait: '특성', special: '특수' },
};

const TIER_NAMES: Record<string, string[]> = {
  zh: ['基础', '进阶', '精通', '大师', '传说'],
  ja: ['基礎', '進階', '精通', '達人', '伝説'],
  en: ['Basic', 'Advanced', 'Master', 'Grandmaster', 'Legend'],
  ru: ['Базовый', 'Продвинутый', 'Мастер', 'Грандмастер', 'Легенда'],
  ko: ['기초', '진階', '정통', '달인', '전설'],
};

function getTypeName(type: SkillType, lang: AppLanguage): string {
  return SKILL_TYPE_NAMES[lang]?.[type] ?? SKILL_TYPE_NAMES.en[type] ?? type;
}

function getTierName(tier: number, lang: AppLanguage): string {
  const arr = TIER_NAMES[lang] ?? TIER_NAMES.en;
  return arr[Math.max(0, Math.min(tier - 1, arr.length - 1))] ?? '';
}

// ─── Color by type ───
const TYPE_COLORS: Record<SkillType, string> = {
  active: '#f87171',
  passive: '#60a5fa',
  ultimate: '#a78bfa',
  trait: '#34d399',
  special: '#fbbf24',
};

// ─── Attribute names (shared with CharacterStatsDesignerPage) ───
const ATTR_NAMES: Record<string, Record<string, string>> = {
  zh: { str: '力量', dex: '敏捷', con: '体质', int: '智力', wis: '感知', cha: '魅力', vit: '耐力', luc: '幸运', atk: '攻击力', def: '防御力', mag: '魔法力', spd: '速度' },
  ja: { str: '筋力', dex: '敏捷', con: '体力', int: '知性', wis: '感知', cha: '魅力', vit: '耐力', luc: '運', atk: '攻撃力', def: '防御力', mag: '魔法力', spd: '素早さ' },
  en: { str: 'STR', dex: 'DEX', con: 'CON', int: 'INT', wis: 'WIS', cha: 'CHA', vit: 'VIT', luc: 'LUC', atk: 'ATK', def: 'DEF', mag: 'MAG', spd: 'SPD' },
  ru: { str: 'СИЛ', dex: 'ЛОВ', con: 'ТЕЛ', int: 'ИНТ', wis: 'МУД', cha: 'ХАР', vit: 'ЖИВ', luc: 'УДА', atk: 'АТК', def: 'ЗАЩ', mag: 'МАГ', spd: 'СКО' },
  ko: { str: '힘', dex: '민첩', con: '천성', int: '지능', wis: '감각', cha: '매력', vit: '활력', luc: '행운', atk: '공격력', def: '방어력', mag: '마법력', spd: '속도' },
};

function getAttrShort(id: string, lang: AppLanguage): string {
  return ATTR_NAMES[lang]?.[id] ?? ATTR_NAMES.en?.[id] ?? id.toUpperCase();
}

// ─── Preset templates ───

function makeId() {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function warriorPreset(): SkillNode[] {
  const ids = Array.from({ length: 12 }, makeId);
  return [
    { id: ids[0], name: '剑术基础', description: '掌握基本的剑术技巧，提升近战伤害。', type: 'trait', tier: 1, x: 50, y: 50, parentIds: [], requiredStats: { str: 5 }, maxLevel: 5, currentLevel: 0, color: TYPE_COLORS.trait },
    { id: ids[1], name: '重击', description: '蓄力一击，造成额外伤害。', type: 'active', tier: 1, x: 30, y: 30, parentIds: [ids[0]], requiredStats: { str: 8 }, maxLevel: 5, currentLevel: 0, color: TYPE_COLORS.active },
    { id: ids[2], name: '铁壁', description: '短时间内大幅提升防御力。', type: 'active', tier: 1, x: 70, y: 30, parentIds: [ids[0]], requiredStats: { def: 8 }, maxLevel: 5, currentLevel: 0, color: TYPE_COLORS.active },
    { id: ids[3], name: '战意', description: '生命值越低，攻击力越高。', type: 'passive', tier: 2, x: 20, y: 50, parentIds: [ids[1]], requiredStats: { str: 12, vit: 10 }, maxLevel: 3, currentLevel: 0, color: TYPE_COLORS.passive },
    { id: ids[4], name: '旋风斩', description: '旋转攻击周围所有敌人。', type: 'active', tier: 2, x: 50, y: 20, parentIds: [ids[1], ids[2]], requiredStats: { str: 15, dex: 10 }, maxLevel: 5, currentLevel: 0, color: TYPE_COLORS.active },
    { id: ids[5], name: '不屈意志', description: '受到致命伤害时保留1点生命值。', type: 'passive', tier: 2, x: 80, y: 50, parentIds: [ids[2]], requiredStats: { vit: 15, wis: 8 }, maxLevel: 1, currentLevel: 0, color: TYPE_COLORS.passive },
    { id: ids[6], name: '破甲', description: '攻击无视目标部分防御。', type: 'trait', tier: 3, x: 15, y: 70, parentIds: [ids[3]], requiredStats: { str: 20, atk: 15 }, maxLevel: 3, currentLevel: 0, color: TYPE_COLORS.trait },
    { id: ids[7], name: '狂暴', description: '大幅提升攻速和伤害，但降低防御。', type: 'active', tier: 3, x: 40, y: 75, parentIds: [ids[3], ids[4]], requiredStats: { str: 22, vit: 12 }, maxLevel: 3, currentLevel: 0, color: TYPE_COLORS.active },
    { id: ids[8], name: '守护之盾', description: '为队友分担伤害。', type: 'special', tier: 3, x: 60, y: 75, parentIds: [ids[4], ids[5]], requiredStats: { def: 20, cha: 10 }, maxLevel: 3, currentLevel: 0, color: TYPE_COLORS.special },
    { id: ids[9], name: '战神降临', description: '短时间内进入无敌状态，全属性提升。', type: 'ultimate', tier: 4, x: 30, y: 88, parentIds: [ids[6], ids[7]], requiredStats: { str: 30, vit: 20, wis: 15 }, maxLevel: 1, currentLevel: 0, color: TYPE_COLORS.ultimate },
    { id: ids[10], name: '剑圣之心', description: '剑术达到极致，所有剑技伤害翻倍。', type: 'passive', tier: 5, x: 50, y: 92, parentIds: [ids[9]], requiredStats: { str: 40, dex: 25 }, maxLevel: 1, currentLevel: 0, color: TYPE_COLORS.passive },
    { id: ids[11], name: '终极审判', description: '召唤圣剑之力，对全场敌人造成毁灭性打击。', type: 'ultimate', tier: 5, x: 70, y: 88, parentIds: [ids[8]], requiredStats: { str: 35, mag: 20, cha: 15 }, maxLevel: 1, currentLevel: 0, color: TYPE_COLORS.ultimate },
  ];
}

function magePreset(): SkillNode[] {
  const ids = Array.from({ length: 12 }, makeId);
  return [
    { id: ids[0], name: '魔法感知', description: '感知周围的魔法流动。', type: 'trait', tier: 1, x: 50, y: 50, parentIds: [], requiredStats: { int: 5 }, maxLevel: 5, currentLevel: 0, color: TYPE_COLORS.trait },
    { id: ids[1], name: '火球术', description: '发射一枚火球攻击敌人。', type: 'active', tier: 1, x: 30, y: 30, parentIds: [ids[0]], requiredStats: { int: 8 }, maxLevel: 5, currentLevel: 0, color: TYPE_COLORS.active },
    { id: ids[2], name: '魔法护盾', description: '生成吸收伤害的魔法屏障。', type: 'active', tier: 1, x: 70, y: 30, parentIds: [ids[0]], requiredStats: { int: 8, wis: 5 }, maxLevel: 5, currentLevel: 0, color: TYPE_COLORS.active },
    { id: ids[3], name: '魔力亲和', description: '魔法回复速度提升。', type: 'passive', tier: 2, x: 20, y: 50, parentIds: [ids[1]], requiredStats: { int: 12 }, maxLevel: 3, currentLevel: 0, color: TYPE_COLORS.passive },
    { id: ids[4], name: '冰霜新星', description: '冻结周围所有敌人。', type: 'active', tier: 2, x: 50, y: 20, parentIds: [ids[1], ids[2]], requiredStats: { int: 15, mag: 10 }, maxLevel: 5, currentLevel: 0, color: TYPE_COLORS.active },
    { id: ids[5], name: '元素共鸣', description: '根据环境获得元素加成。', type: 'passive', tier: 2, x: 80, y: 50, parentIds: [ids[2]], requiredStats: { wis: 15 }, maxLevel: 3, currentLevel: 0, color: TYPE_COLORS.passive },
    { id: ids[6], name: '陨石术', description: '召唤陨石轰击目标区域。', type: 'active', tier: 3, x: 15, y: 70, parentIds: [ids[3]], requiredStats: { int: 20, mag: 15 }, maxLevel: 3, currentLevel: 0, color: TYPE_COLORS.active },
    { id: ids[7], name: '时间缓流', description: '减缓周围时间流速。', type: 'special', tier: 3, x: 40, y: 75, parentIds: [ids[3], ids[4]], requiredStats: { int: 22, wis: 15 }, maxLevel: 2, currentLevel: 0, color: TYPE_COLORS.special },
    { id: ids[8], name: '灵魂链接', description: '与队友共享生命值与魔力。', type: 'special', tier: 3, x: 60, y: 75, parentIds: [ids[4], ids[5]], requiredStats: { wis: 20, cha: 10 }, maxLevel: 2, currentLevel: 0, color: TYPE_COLORS.special },
    { id: ids[9], name: '禁咒·灭世', description: '释放禁忌魔法，代价巨大。', type: 'ultimate', tier: 4, x: 30, y: 88, parentIds: [ids[6], ids[7]], requiredStats: { int: 35, mag: 25 }, maxLevel: 1, currentLevel: 0, color: TYPE_COLORS.ultimate },
    { id: ids[10], name: '大魔导师', description: '魔法伤害无视抗性。', type: 'passive', tier: 5, x: 50, y: 92, parentIds: [ids[9]], requiredStats: { int: 40, wis: 25 }, maxLevel: 1, currentLevel: 0, color: TYPE_COLORS.passive },
    { id: ids[11], name: '创世之光', description: '召唤创世级别的神圣光辉。', type: 'ultimate', tier: 5, x: 70, y: 88, parentIds: [ids[8]], requiredStats: { int: 35, mag: 30, cha: 15 }, maxLevel: 1, currentLevel: 0, color: TYPE_COLORS.ultimate },
  ];
}

function assassinPreset(): SkillNode[] {
  const ids = Array.from({ length: 12 }, makeId);
  return [
    { id: ids[0], name: '暗影步', description: '在阴影中快速移动。', type: 'trait', tier: 1, x: 50, y: 50, parentIds: [], requiredStats: { dex: 5 }, maxLevel: 5, currentLevel: 0, color: TYPE_COLORS.trait },
    { id: ids[1], name: '背刺', description: '从背后攻击造成暴击。', type: 'active', tier: 1, x: 30, y: 30, parentIds: [ids[0]], requiredStats: { dex: 8 }, maxLevel: 5, currentLevel: 0, color: TYPE_COLORS.active },
    { id: ids[2], name: '烟雾弹', description: '释放烟雾逃脱或掩护。', type: 'active', tier: 1, x: 70, y: 30, parentIds: [ids[0]], requiredStats: { dex: 8, int: 5 }, maxLevel: 5, currentLevel: 0, color: TYPE_COLORS.active },
    { id: ids[3], name: '毒刃', description: '武器附加毒素效果。', type: 'passive', tier: 2, x: 20, y: 50, parentIds: [ids[1]], requiredStats: { dex: 12, int: 8 }, maxLevel: 3, currentLevel: 0, color: TYPE_COLORS.passive },
    { id: ids[4], name: '瞬身斩', description: '瞬间接近并攻击目标。', type: 'active', tier: 2, x: 50, y: 20, parentIds: [ids[1], ids[2]], requiredStats: { dex: 15, spd: 10 }, maxLevel: 5, currentLevel: 0, color: TYPE_COLORS.active },
    { id: ids[5], name: '潜行大师', description: '大幅提升隐身持续时间。', type: 'passive', tier: 2, x: 80, y: 50, parentIds: [ids[2]], requiredStats: { dex: 15, wis: 8 }, maxLevel: 3, currentLevel: 0, color: TYPE_COLORS.passive },
    { id: ids[6], name: '连斩', description: '对同一目标进行多次快速斩击。', type: 'active', tier: 3, x: 15, y: 70, parentIds: [ids[3]], requiredStats: { dex: 20, atk: 15 }, maxLevel: 3, currentLevel: 0, color: TYPE_COLORS.active },
    { id: ids[7], name: '影分身', description: '制造幻影迷惑敌人。', type: 'special', tier: 3, x: 40, y: 75, parentIds: [ids[3], ids[4]], requiredStats: { dex: 22, int: 12 }, maxLevel: 2, currentLevel: 0, color: TYPE_COLORS.special },
    { id: ids[8], name: '暗杀标记', description: '标记目标，下次攻击必暴击。', type: 'special', tier: 3, x: 60, y: 75, parentIds: [ids[4], ids[5]], requiredStats: { dex: 20, wis: 15 }, maxLevel: 2, currentLevel: 0, color: TYPE_COLORS.special },
    { id: ids[9], name: '死亡莲华', description: '在敌人之间快速穿梭斩杀。', type: 'ultimate', tier: 4, x: 30, y: 88, parentIds: [ids[6], ids[7]], requiredStats: { dex: 30, spd: 20 }, maxLevel: 1, currentLevel: 0, color: TYPE_COLORS.ultimate },
    { id: ids[10], name: '影之王', description: '完全融入暗影，攻击无视闪避。', type: 'passive', tier: 5, x: 50, y: 92, parentIds: [ids[9]], requiredStats: { dex: 40, int: 20 }, maxLevel: 1, currentLevel: 0, color: TYPE_COLORS.passive },
    { id: ids[11], name: '终焉之刃', description: '一击必杀，无视防御与闪避。', type: 'ultimate', tier: 5, x: 70, y: 88, parentIds: [ids[8]], requiredStats: { dex: 35, atk: 25, wis: 15 }, maxLevel: 1, currentLevel: 0, color: TYPE_COLORS.ultimate },
  ];
}

function supportPreset(): SkillNode[] {
  const ids = Array.from({ length: 12 }, makeId);
  return [
    { id: ids[0], name: '治愈之光', description: '恢复友方生命值。', type: 'trait', tier: 1, x: 50, y: 50, parentIds: [], requiredStats: { wis: 5 }, maxLevel: 5, currentLevel: 0, color: TYPE_COLORS.trait },
    { id: ids[1], name: '祝福', description: '提升友方攻击力。', type: 'active', tier: 1, x: 30, y: 30, parentIds: [ids[0]], requiredStats: { wis: 8, cha: 5 }, maxLevel: 5, currentLevel: 0, color: TYPE_COLORS.active },
    { id: ids[2], name: '净化', description: '移除友方负面效果。', type: 'active', tier: 1, x: 70, y: 30, parentIds: [ids[0]], requiredStats: { wis: 8, int: 5 }, maxLevel: 5, currentLevel: 0, color: TYPE_COLORS.active },
    { id: ids[3], name: '鼓舞', description: '周围友方攻速提升。', type: 'passive', tier: 2, x: 20, y: 50, parentIds: [ids[1]], requiredStats: { cha: 12 }, maxLevel: 3, currentLevel: 0, color: TYPE_COLORS.passive },
    { id: ids[4], name: '神圣护盾', description: '为友方施加强力护盾。', type: 'active', tier: 2, x: 50, y: 20, parentIds: [ids[1], ids[2]], requiredStats: { wis: 15, def: 10 }, maxLevel: 5, currentLevel: 0, color: TYPE_COLORS.active },
    { id: ids[5], name: '复苏', description: '复活倒下的队友。', type: 'special', tier: 2, x: 80, y: 50, parentIds: [ids[2]], requiredStats: { wis: 20, vit: 10 }, maxLevel: 1, currentLevel: 0, color: TYPE_COLORS.special },
    { id: ids[6], name: '群体治愈', description: '恢复所有友方生命值。', type: 'active', tier: 3, x: 15, y: 70, parentIds: [ids[3]], requiredStats: { wis: 20, mag: 15 }, maxLevel: 3, currentLevel: 0, color: TYPE_COLORS.active },
    { id: ids[7], name: '圣光领域', description: '范围内友方持续恢复。', type: 'special', tier: 3, x: 40, y: 75, parentIds: [ids[3], ids[4]], requiredStats: { wis: 22, cha: 12 }, maxLevel: 2, currentLevel: 0, color: TYPE_COLORS.special },
    { id: ids[8], name: '牺牲', description: '以自身生命值换取队友完全恢复。', type: 'special', tier: 3, x: 60, y: 75, parentIds: [ids[4], ids[5]], requiredStats: { wis: 20, vit: 20 }, maxLevel: 1, currentLevel: 0, color: TYPE_COLORS.special },
    { id: ids[9], name: '天使降临', description: '化身为天使，全面强化辅助能力。', type: 'ultimate', tier: 4, x: 30, y: 88, parentIds: [ids[6], ids[7]], requiredStats: { wis: 30, cha: 20 }, maxLevel: 1, currentLevel: 0, color: TYPE_COLORS.ultimate },
    { id: ids[10], name: '神之恩宠', description: '所有治疗效果翻倍。', type: 'passive', tier: 5, x: 50, y: 92, parentIds: [ids[9]], requiredStats: { wis: 40, cha: 25 }, maxLevel: 1, currentLevel: 0, color: TYPE_COLORS.passive },
    { id: ids[11], name: '永恒圣歌', description: '全队进入不死状态，持续数秒。', type: 'ultimate', tier: 5, x: 70, y: 88, parentIds: [ids[8]], requiredStats: { wis: 35, vit: 25, cha: 15 }, maxLevel: 1, currentLevel: 0, color: TYPE_COLORS.ultimate },
  ];
}

function emptyPreset(): SkillNode[] {
  return [];
}

const PRESETS: { id: string; nameKey: string; factory: () => SkillNode[] }[] = [
  { id: 'warrior', nameKey: 'presetWarrior', factory: warriorPreset },
  { id: 'mage', nameKey: 'presetMage', factory: magePreset },
  { id: 'assassin', nameKey: 'presetAssassin', factory: assassinPreset },
  { id: 'support', nameKey: 'presetSupport', factory: supportPreset },
  { id: 'custom', nameKey: 'presetCustom', factory: emptyPreset },
];

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
    if (Array.isArray(parsed?.attributes)) {
      const map: Record<string, number> = {};
      for (const attr of parsed.attributes) {
        if (attr?.id && typeof attr.value === 'number') {
          map[attr.id] = attr.value;
        }
      }
      return map;
    }
  } catch { /* ignore */ }
  return {};
}

function seededRandom(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
  }
  return ((h >>> 0) % 1000000) / 1000000;
}

// ─── Component ───

export default function CharacterSkillTreePage({
  language,
  settings,
  onNavigate,
  pageTitle,
  pageDescription,
}: {
  language: AppLanguage;
  settings: SettingsState;
  onNavigate: (screen: FeatureScreen) => void;
  pageTitle: string;
  pageDescription: string;
}) {
  const themeKey = settings.stylePreset ?? 'default';

  const labels = useMemo(() => {
    const dict: Record<string, Record<string, string>> = {
      zh: {
        presetWarrior: '战士', presetMage: '法师', presetAssassin: '刺客', presetSupport: '辅助', presetCustom: '自定义',
        backHome: '返回首页', newSkill: '新建技能', deleteSkill: '删除', saveSet: '保存方案', loadSet: '加载方案', exportJson: '导出 JSON',
        history: '历史', favorites: '收藏', clearAll: '清空', linkedStats: '关联属性',
        availablePoints: '可用技能点', totalPoints: '总技能点', unlocked: '已解锁', locked: '未解锁',
        skillName: '技能名称', skillDesc: '技能描述', skillType: '类型', skillTier: '层级',
        skillLevel: '等级', maxLevel: '最大等级', parentSkills: '前置技能', requiredStats: '需求属性',
        addNode: '添加节点', nodeSelected: '选中节点', noSelection: '点击节点查看详情',
        treeEmpty: '技能树为空，选择预设或添加节点开始。', applyPreset: '应用预设', resetTree: '重置',
        importedSuccess: '导入成功', importedError: '导入失败：格式错误',
        setPrefix: '方案', favorited: '已收藏', unnamed: '未命名',
        copyJson: '复制 JSON', copied: '已复制',
        pointHint: '基于关联的角色属性自动计算。', readFromStats: '读取属性',
        confirmDelete: '确定要删除此技能吗？', confirmClear: '确定要清空整个技能树吗？',
      },
      ja: {
        presetWarrior: '戦士', presetMage: '魔導士', presetAssassin: '暗殺者', presetSupport: 'サポート', presetCustom: 'カスタム',
        backHome: 'ホームへ戻る', newSkill: '新規スキル', deleteSkill: '削除', saveSet: '保存', loadSet: '読込', exportJson: 'JSON 出力',
        history: '履歴', favorites: 'お気に入り', clearAll: '全削除', linkedStats: '連携ステータス',
        availablePoints: '使用可能ポイント', totalPoints: '合計ポイント', unlocked: '解放済', locked: '未解放',
        skillName: 'スキル名', skillDesc: '説明', skillType: 'タイプ', skillTier: 'ティア',
        skillLevel: 'レベル', maxLevel: '最大レベル', parentSkills: '前提スキル', requiredStats: '必要ステータス',
        addNode: 'ノード追加', nodeSelected: '選択中', noSelection: 'ノードをクリックして詳細を表示',
        treeEmpty: 'スキルツリーが空です。プリセットを選ぶかノードを追加してください。', applyPreset: 'プリセット適用', resetTree: 'リセット',
        importedSuccess: 'インポート成功', importedError: 'インポート失敗：形式エラー',
        setPrefix: 'セット', favorited: 'お気に入り済', unnamed: '名称未設定',
        copyJson: 'JSON コピー', copied: 'コピー済',
        pointHint: '連携キャラクターのステータスから自動計算されます。', readFromStats: 'ステータス読込',
        confirmDelete: 'このスキルを削除しますか？', confirmClear: 'スキルツリーを全削除しますか？',
      },
      en: {
        presetWarrior: 'Warrior', presetMage: 'Mage', presetAssassin: 'Assassin', presetSupport: 'Support', presetCustom: 'Custom',
        backHome: 'Back home', newSkill: 'New Skill', deleteSkill: 'Delete', saveSet: 'Save Set', loadSet: 'Load Set', exportJson: 'Export JSON',
        history: 'History', favorites: 'Favorites', clearAll: 'Clear All', linkedStats: 'Linked Stats',
        availablePoints: 'Available Points', totalPoints: 'Total Points', unlocked: 'Unlocked', locked: 'Locked',
        skillName: 'Skill Name', skillDesc: 'Description', skillType: 'Type', skillTier: 'Tier',
        skillLevel: 'Level', maxLevel: 'Max Level', parentSkills: 'Prerequisites', requiredStats: 'Stat Requirements',
        addNode: 'Add Node', nodeSelected: 'Selected', noSelection: 'Click a node to view details',
        treeEmpty: 'The skill tree is empty. Choose a preset or add a node to begin.', applyPreset: 'Apply Preset', resetTree: 'Reset',
        importedSuccess: 'Import successful', importedError: 'Import failed: invalid format',
        setPrefix: 'Set', favorited: 'Favorited', unnamed: 'Unnamed',
        copyJson: 'Copy JSON', copied: 'Copied',
        pointHint: 'Auto-calculated from linked character stats.', readFromStats: 'Read Stats',
        confirmDelete: 'Delete this skill?', confirmClear: 'Clear the entire skill tree?',
      },
      ru: {
        presetWarrior: 'Воин', presetMage: 'Маг', presetAssassin: 'Ассасин', presetSupport: 'Поддержка', presetCustom: 'Свой',
        backHome: 'На главную', newSkill: 'Новый навык', deleteSkill: 'Удалить', saveSet: 'Сохранить', loadSet: 'Загрузить', exportJson: 'Экспорт JSON',
        history: 'История', favorites: 'Избранное', clearAll: 'Очистить', linkedStats: 'Связанные хар-ки',
        availablePoints: 'Доступно очков', totalPoints: 'Всего очков', unlocked: 'Разблокировано', locked: 'Заблокировано',
        skillName: 'Название', skillDesc: 'Описание', skillType: 'Тип', skillTier: 'Уровень',
        skillLevel: 'Уровень навыка', maxLevel: 'Макс. уровень', parentSkills: 'Требования', requiredStats: 'Нужные хар-ки',
        addNode: 'Добавить узел', nodeSelected: 'Выбрано', noSelection: 'Нажмите на узел для просмотра',
        treeEmpty: 'Дерево пусто. Выберите шаблон или добавьте узел.', applyPreset: 'Применить шаблон', resetTree: 'Сброс',
        importedSuccess: 'Импорт успешен', importedError: 'Ошибка импорта: неверный формат',
        setPrefix: 'Набор', favorited: 'В избранном', unnamed: 'Без названия',
        copyJson: 'Копировать JSON', copied: 'Скопировано',
        pointHint: 'Авторасчёт из связанных характеристик.', readFromStats: 'Считать хар-ки',
        confirmDelete: 'Удалить этот навык?', confirmClear: 'Очистить всё дерево?',
      },
      ko: {
        backHome: '홈으로', presetWarrior: '전사', presetMage: '마법사', presetAssassin: '암살자', presetSupport: '서포터', presetCustom: '커스텀',
        newSkill: '신규 스킬', deleteSkill: '삭제', saveSet: '저장', loadSet: '불러오기', exportJson: 'JSON 내보내기',
        history: '히스토리', favorites: '즐겨찾기', clearAll: '전체 삭제', linkedStats: '연동 스탯',
        availablePoints: '사용 가능 포인트', totalPoints: '총 포인트', unlocked: '해금됨', locked: '잠김',
        skillName: '스킬명', skillDesc: '설명', skillType: '타입', skillTier: '티어',
        skillLevel: '레벨', maxLevel: '최대 레벨', parentSkills: '선행 스킬', requiredStats: '필요 스탯',
        addNode: '노드 추가', nodeSelected: '선택됨', noSelection: '노드를 클릭하면 상세 정보가 표시됩니다',
        treeEmpty: '스킬 트리가 비어 있습니다. 프리셋을 선택하거나 노드를 추가하세요.', applyPreset: '프리셋 적용', resetTree: '리셋',
        importedSuccess: '가져오기 성공', importedError: '가져오기 실패: 형식 오류',
        setPrefix: '세트', favorited: '즐겨찾기됨', unnamed: '이름 없음',
        copyJson: 'JSON 복사', copied: '복사됨',
        pointHint: '연동된 캐릭터 스탯으로 자동 계산됩니다.', readFromStats: '스탯 읽기',
        confirmDelete: '이 스킬을 삭제하시겠습니까?', confirmClear: '전체 스킬 트리를 삭제하시겠습니까?',
      },
    };
    const base = dict[language] ?? dict.en;
    // Fallback for all other languages
    const full = { ...dict.en, ...base };
    return full;
  }, [language]);

  const [nodes, setNodes] = useState<SkillNode[]>(() => loadState<SkillNode[]>('oc-maker.skill-tree.nodes', []));
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [history, setHistory] = useState<SkillTreeSet[]>(() => loadState<SkillTreeSet[]>('oc-maker.skill-tree.history', []));
  const [favorites, setFavorites] = useState<SkillTreeSet[]>(() => loadState<SkillTreeSet[]>('oc-maker.skill-tree.favorites', []));
  const [showHistory, setShowHistory] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [notice, setNotice] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [linkedStats, setLinkedStats] = useState<Record<string, number>>({});
  const [characterName, setCharacterName] = useState('');
  const treeRef = useRef<HTMLDivElement>(null);
  const timeoutRefs = useRef<number[]>([]);

  // Load linked stats on mount
  useEffect(() => {
    setLinkedStats(getLinkedStats());
    const savedName = localStorage.getItem('oc-maker.skill-tree.character-name') ?? '';
    setCharacterName(savedName);
  }, []);

  // Persist nodes
  useEffect(() => {
    try { localStorage.setItem('oc-maker.skill-tree.nodes', JSON.stringify(nodes)); } catch { /* ignore */ }
  }, [nodes]);

  // Persist history/favorites
  useEffect(() => {
    try { localStorage.setItem('oc-maker.skill-tree.history', JSON.stringify(history)); } catch { /* ignore */ }
  }, [history]);
  useEffect(() => {
    try { localStorage.setItem('oc-maker.skill-tree.favorites', JSON.stringify(favorites)); } catch { /* ignore */ }
  }, [favorites]);

  useEffect(() => {
    try { localStorage.setItem('oc-maker.skill-tree.character-name', characterName); } catch { /* ignore */ }
  }, [characterName]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      for (const id of timeoutRefs.current) clearTimeout(id);
      timeoutRefs.current = [];
    };
  }, []);

  const addTimeout = useCallback((fn: () => void, ms: number) => {
    const id = window.setTimeout(() => {
      fn();
      timeoutRefs.current = timeoutRefs.current.filter((t) => t !== id);
    }, ms);
    timeoutRefs.current.push(id);
  }, []);

  const showNotice = useCallback((text: string, type: 'success' | 'error') => {
    setNotice({ text, type });
    addTimeout(() => setNotice(null), 2500);
  }, [addTimeout]);

  const totalPoints = useMemo(() => {
    return Object.values(linkedStats).reduce((sum, v) => sum + (typeof v === 'number' ? v : 0), 0);
  }, [linkedStats]);

  const usedPoints = useMemo(() => {
    return nodes.reduce((sum, n) => sum + n.currentLevel, 0);
  }, [nodes]);

  const availablePoints = Math.max(0, Math.floor(totalPoints / 3) - usedPoints);

  const isUnlocked = useCallback((node: SkillNode): boolean => {
    // Check parent requirements
    for (const pid of node.parentIds) {
      const parent = nodes.find((n) => n.id === pid);
      if (!parent || parent.currentLevel <= 0) return false;
    }
    // Check stat requirements
    for (const [key, val] of Object.entries(node.requiredStats)) {
      if ((linkedStats[key] ?? 0) < val) return false;
    }
    return true;
  }, [nodes, linkedStats]);

  const applyPreset = useCallback((factory: () => SkillNode[]) => {
    const fresh = factory().map((n) => ({ ...n, id: makeId() }));
    setNodes(fresh);
    setSelectedId(null);
    playSound('ui-click');
  }, []);

  const addNode = useCallback(() => {
    const id = makeId();
    const newNode: SkillNode = {
      id,
      name: labels.newSkill,
      description: '',
      type: 'active',
      tier: 1,
      x: 50,
      y: 50,
      parentIds: [],
      requiredStats: {},
      maxLevel: 5,
      currentLevel: 0,
      color: TYPE_COLORS.active,
    };
    setNodes((prev) => [...prev, newNode]);
    setSelectedId(id);
    playSound('ui-click');
  }, [labels.newSkill]);

  const updateNode = useCallback((id: string, patch: Partial<SkillNode>) => {
    setNodes((prev) => prev.map((n) => (n.id === id ? { ...n, ...patch } : n)));
  }, []);

  const deleteNode = useCallback((id: string) => {
    if (!window.confirm(labels.confirmDelete)) return;
    setNodes((prev) => {
      const filtered = prev.filter((n) => n.id !== id);
      // Also remove this id from parentIds of other nodes
      return filtered.map((n) => ({
        ...n,
        parentIds: n.parentIds.filter((pid) => pid !== id),
      }));
    });
    if (selectedId === id) setSelectedId(null);
    playSound('ui-click');
  }, [labels.confirmDelete, selectedId]);

  const clearAll = useCallback(() => {
    if (!window.confirm(labels.confirmClear)) return;
    setNodes([]);
    setSelectedId(null);
    playSound('ui-click');
  }, [labels.confirmClear]);

  const levelUp = useCallback((node: SkillNode) => {
    if (!isUnlocked(node)) {
      showNotice(labels.locked, 'error');
      return;
    }
    if (node.currentLevel >= node.maxLevel) return;
    if (availablePoints <= 0) {
      showNotice(labels.locked, 'error');
      return;
    }
    updateNode(node.id, { currentLevel: node.currentLevel + 1 });
    playSound('ui-click');
  }, [isUnlocked, availablePoints, updateNode, labels.locked, showNotice]);

  const levelDown = useCallback((node: SkillNode) => {
    if (node.currentLevel <= 0) return;
    updateNode(node.id, { currentLevel: node.currentLevel - 1 });
    playSound('ui-click');
  }, [updateNode]);

  const saveSet = useCallback(() => {
    const set: SkillTreeSet = {
      id: `${Date.now()}:${Math.random().toString(36).slice(2, 8)}`,
      name: `${labels.setPrefix} ${new Date().toLocaleTimeString()}`,
      characterName,
      nodes: nodes.map((n) => ({ ...n })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setHistory((prev) => [set, ...prev].slice(0, 50));
    showNotice(labels.saveSet + ' ' + labels.importedSuccess, 'success');
    playSound('ui-click');
  }, [nodes, characterName, labels.setPrefix, labels.saveSet, labels.importedSuccess, showNotice]);

  const loadSet = useCallback((set: SkillTreeSet) => {
    if (!set || !Array.isArray(set.nodes)) {
      showNotice(labels.importedError, 'error');
      return;
    }
    setNodes(set.nodes.map((n) => ({ ...n })));
    if (set.characterName) setCharacterName(set.characterName);
    setSelectedId(null);
    showNotice(labels.loadSet + ' ' + labels.importedSuccess, 'success');
    playSound('ui-click');
  }, [labels.importedError, labels.loadSet, labels.importedSuccess, showNotice]);

  const toggleFavorite = useCallback((set: SkillTreeSet) => {
    setFavorites((prev) => {
      const exists = prev.find((s) => s.id === set.id);
      if (exists) return prev.filter((s) => s.id !== set.id);
      return [set, ...prev].slice(0, 30);
    });
    playSound('ui-click');
  }, []);

  const exportJson = useCallback(() => {
    const data: SkillTreeSet = {
      id: makeId(),
      name: characterName || labels.unnamed,
      characterName,
      nodes: nodes.map((n) => ({ ...n })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `skill-tree-${characterName || 'oc'}.json`;
    document.body.appendChild(a);
    a.click();
    requestAnimationFrame(() => { a.remove(); URL.revokeObjectURL(url); });
    playSound('ui-click');
  }, [nodes, characterName, labels.unnamed]);

  const copyJson = useCallback(async () => {
    const data = { characterName, nodes };
    const text = JSON.stringify(data, null, 2);
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        showNotice(labels.copied, 'success');
      }
    } catch { /* ignore */ }
  }, [nodes, characterName, labels.copied, showNotice]);

  const importJson = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        if (!parsed || !Array.isArray(parsed.nodes)) {
          showNotice(labels.importedError, 'error');
          return;
        }
        loadSet(parsed as SkillTreeSet);
      } catch {
        showNotice(labels.importedError, 'error');
      }
    };
    reader.readAsText(file);
  }, [labels.importedError, showNotice, loadSet]);

  const readFromStats = useCallback(() => {
    setLinkedStats(getLinkedStats());
    playSound('ui-click');
  }, []);

  const selectedNode = nodes.find((n) => n.id === selectedId) ?? null;

  // Recompute node colors if type changed
  useEffect(() => {
    if (!selectedNode) return;
    const expectedColor = TYPE_COLORS[selectedNode.type];
    if (selectedNode.color !== expectedColor) {
      updateNode(selectedNode.id, { color: expectedColor });
    }
  }, [selectedNode?.type]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="page-container" data-theme={themeKey}>
      <div className="page-header">
        <div className="page-header-left">
          <button className="back-button" type="button" onClick={() => { playSound('ui-click'); onNavigate('home'); }} data-sfx-handled>
            ← {labels.backHome}
          </button>
          <h1 className="page-title">{pageTitle}</h1>
          <p className="page-description">{pageDescription}</p>
        </div>
      </div>

      {notice && (
        <div className={`notice-banner ${notice.type}`}>
          {notice.text}
        </div>
      )}

      {/* Top stats bar */}
      <div className="skill-tree-stats-bar" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', padding: '12px 16px', marginBottom: '12px', background: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{labels.linkedStats}</span>
          <input
            type="text"
            value={characterName}
            onChange={(e) => setCharacterName(e.target.value)}
            placeholder={labels.unnamed}
            style={{ padding: '4px 10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: '0.85rem', width: '140px' }}
          />
        </div>
        <button className="secondary-button" type="button" onClick={() => { playSound('ui-click'); readFromStats(); }} data-sfx-handled>
          {labels.readFromStats}
        </button>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
          {Object.entries(linkedStats).length === 0 ? (
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{labels.pointHint}</span>
          ) : (
            Object.entries(linkedStats).slice(0, 8).map(([k, v]) => (
              <span key={k} style={{ fontSize: '0.8rem', color: 'var(--text)', background: 'var(--bg)', padding: '2px 8px', borderRadius: '6px', border: '1px solid var(--border)' }}>
                {getAttrShort(k, language)}: {v}
              </span>
            ))
          )}
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '16px', alignItems: 'center' }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--text)' }}>
            {labels.totalPoints}: <strong>{Math.floor(totalPoints / 3)}</strong>
          </span>
          <span style={{ fontSize: '0.9rem', color: 'var(--text)' }}>
            {labels.availablePoints}: <strong style={{ color: availablePoints > 0 ? 'var(--success)' : 'var(--danger)' }}>{availablePoints}</strong>
          </span>
        </div>
      </div>

      {/* Presets */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
        {PRESETS.map((p) => (
          <button
            key={p.id}
            className="choice-chip"
            type="button"
            onClick={() => { playSound('ui-click'); applyPreset(p.factory); }}
            data-sfx-handled
          >
            {labels[p.nameKey] ?? p.nameKey}
          </button>
        ))}
        <button className="secondary-button" type="button" onClick={() => { playSound('ui-click'); addNode(); }} data-sfx-handled>
          + {labels.addNode}
        </button>
        <button className="secondary-button" type="button" onClick={() => { playSound('ui-click'); clearAll(); }} data-sfx-handled>
          {labels.resetTree}
        </button>
        <button className="primary-button" type="button" onClick={() => { playSound('ui-click'); saveSet(); }} data-sfx-handled>
          {labels.saveSet}
        </button>
        <button className="secondary-button" type="button" onClick={() => { playSound('ui-click'); exportJson(); }} data-sfx-handled>
          {labels.exportJson}
        </button>
        <button className="secondary-button" type="button" onClick={() => { playSound('ui-click'); copyJson(); }} data-sfx-handled>
          {labels.copyJson}
        </button>
        <label className="secondary-button" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}>
          <span>{labels.loadSet}</span>
          <input
            type="file"
            accept=".json,application/json"
            style={{ display: 'none' }}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) { playSound('ui-click'); importJson(file); }
              e.currentTarget.value = '';
            }}
          />
        </label>
      </div>

      {/* Main layout: tree + detail panel */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '16px' }}>
        {/* Tree area */}
        <div
          ref={treeRef}
          className="skill-tree-canvas"
          style={{
            position: 'relative',
            minHeight: '520px',
            background: 'var(--surface)',
            borderRadius: '16px',
            border: '1px solid var(--border)',
            overflow: 'hidden',
          }}
        >
          {nodes.length === 0 ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '520px', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              {labels.treeEmpty}
            </div>
          ) : (
            <>
              {/* SVG connections */}
              <svg
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }}
              >
                {nodes.flatMap((node) =>
                  node.parentIds
                    .map((pid) => nodes.find((n) => n.id === pid))
                    .filter(Boolean)
                    .map((parent) => {
                      const px = (parent!.x / 100) * 100;
                      const py = (parent!.y / 100) * 100;
                      const cx = (node.x / 100) * 100;
                      const cy = (node.y / 100) * 100;
                      const isActive = parent!.currentLevel > 0 && node.currentLevel > 0;
                      return (
                        <line
                          key={`${parent!.id}-${node.id}`}
                          x1={`${px}%`}
                          y1={`${py}%`}
                          x2={`${cx}%`}
                          y2={`${cy}%`}
                          stroke={isActive ? 'var(--accent)' : 'var(--border)'}
                          strokeWidth={isActive ? 2.5 : 1.5}
                          strokeDasharray={isActive ? undefined : '4 4'}
                          opacity={isActive ? 0.9 : 0.45}
                        />
                      );
                    })
                )}
              </svg>

              {/* Nodes */}
              {nodes.map((node) => {
                const unlocked = isUnlocked(node);
                const active = node.currentLevel > 0;
                return (
                  <button
                    key={node.id}
                    type="button"
                    onClick={() => { playSound('ui-click'); setSelectedId(node.id); }}
                    data-sfx-handled
                    style={{
                      position: 'absolute',
                      left: `${node.x}%`,
                      top: `${node.y}%`,
                      transform: 'translate(-50%, -50%)',
                      zIndex: 2,
                      width: selectedId === node.id ? 64 : 52,
                      height: selectedId === node.id ? 64 : 52,
                      borderRadius: '50%',
                      border: `2.5px solid ${active ? node.color : unlocked ? 'var(--text-secondary)' : 'var(--border)'}`,
                      background: active ? `${node.color}22` : unlocked ? 'var(--surface)' : 'var(--bg)',
                      boxShadow: active ? `0 0 12px ${node.color}66` : 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      opacity: unlocked || active ? 1 : 0.55,
                    }}
                    title={node.name}
                  >
                    <span style={{ fontSize: selectedId === node.id ? '1.1rem' : '0.85rem', color: active ? node.color : unlocked ? 'var(--text-secondary)' : 'var(--text-disabled)', fontWeight: 700 }}>
                      {node.currentLevel}/{node.maxLevel}
                    </span>
                  </button>
                );
              })}
            </>
          )}
        </div>

        {/* Detail panel */}
        <div style={{ background: 'var(--surface)', borderRadius: '16px', border: '1px solid var(--border)', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '700px', overflowY: 'auto' }}>
          {selectedNode ? (
            <>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {labels.nodeSelected}
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>{labels.skillName}</label>
                <input
                  type="text"
                  value={selectedNode.name}
                  onChange={(e) => updateNode(selectedNode.id, { name: e.target.value })}
                  style={{ width: '100%', padding: '6px 10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: '0.9rem' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>{labels.skillDesc}</label>
                <textarea
                  value={selectedNode.description}
                  onChange={(e) => updateNode(selectedNode.id, { description: e.target.value })}
                  rows={3}
                  style={{ width: '100%', padding: '6px 10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: '0.85rem', resize: 'vertical' }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>{labels.skillType}</label>
                  <select
                    value={selectedNode.type}
                    onChange={(e) => updateNode(selectedNode.id, { type: e.target.value as SkillType })}
                    style={{ width: '100%', padding: '6px 8px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: '0.85rem' }}
                  >
                    {(['active', 'passive', 'ultimate', 'trait', 'special'] as SkillType[]).map((t) => (
                      <option key={t} value={t}>{getTypeName(t, language)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>{labels.skillTier}</label>
                  <select
                    value={selectedNode.tier}
                    onChange={(e) => updateNode(selectedNode.id, { tier: Number(e.target.value) })}
                    style={{ width: '100%', padding: '6px 8px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: '0.85rem' }}
                  >
                    {[1, 2, 3, 4, 5].map((t) => (
                      <option key={t} value={t}>{getTierName(t, language)}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  {labels.skillLevel}: {selectedNode.currentLevel} / {selectedNode.maxLevel}
                </label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <button className="secondary-button" type="button" onClick={() => levelDown(selectedNode)} data-sfx-handled disabled={selectedNode.currentLevel <= 0}>
                    -1
                  </button>
                  <div style={{ flex: 1, height: '8px', background: 'var(--bg)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${(selectedNode.currentLevel / Math.max(1, selectedNode.maxLevel)) * 100}%`, height: '100%', background: selectedNode.color, borderRadius: '4px', transition: 'width 0.2s' }} />
                  </div>
                  <button className="secondary-button" type="button" onClick={() => levelUp(selectedNode)} data-sfx-handled disabled={!isUnlocked(selectedNode) || selectedNode.currentLevel >= selectedNode.maxLevel || availablePoints <= 0}>
                    +1
                  </button>
                </div>
                {!isUnlocked(selectedNode) && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--danger)' }}>{labels.locked}</span>
                )}
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>{labels.maxLevel}</label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={selectedNode.maxLevel}
                  onChange={(e) => updateNode(selectedNode.id, { maxLevel: Math.max(1, Math.min(20, Number(e.target.value) || 1)) })}
                  style={{ width: '100%', padding: '6px 10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: '0.9rem' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>{labels.parentSkills}</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {nodes.filter((n) => n.id !== selectedNode.id).map((n) => {
                    const isParent = selectedNode.parentIds.includes(n.id);
                    return (
                      <button
                        key={n.id}
                        type="button"
                        className="choice-chip"
                        onClick={() => {
                          playSound('ui-click');
                          updateNode(selectedNode.id, {
                            parentIds: isParent
                              ? selectedNode.parentIds.filter((pid) => pid !== n.id)
                              : [...selectedNode.parentIds, n.id],
                          });
                        }}
                        data-sfx-handled
                        style={{
                          opacity: isParent ? 1 : 0.6,
                          borderColor: isParent ? 'var(--accent)' : undefined,
                        }}
                      >
                        {n.name}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>{labels.requiredStats}</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                  {Object.keys(ATTR_NAMES[language] ?? ATTR_NAMES.en).map((key) => (
                    <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', width: '40px' }}>{getAttrShort(key, language)}</span>
                      <input
                        type="number"
                        min={0}
                        max={999}
                        value={selectedNode.requiredStats[key] ?? ''}
                        onChange={(e) => {
                          const val = e.target.value === '' ? undefined : Math.max(0, Number(e.target.value));
                          const next = { ...selectedNode.requiredStats };
                          if (val === undefined) delete next[key];
                          else next[key] = val;
                          updateNode(selectedNode.id, { requiredStats: next });
                        }}
                        style={{ flex: 1, padding: '4px 6px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: '0.8rem' }}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '4px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>X</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={selectedNode.x}
                    onChange={(e) => updateNode(selectedNode.id, { x: Math.max(0, Math.min(100, Number(e.target.value) || 0)) })}
                    style={{ width: '100%', padding: '4px 6px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: '0.8rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Y</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={selectedNode.y}
                    onChange={(e) => updateNode(selectedNode.id, { y: Math.max(0, Math.min(100, Number(e.target.value) || 0)) })}
                    style={{ width: '100%', padding: '4px 6px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: '0.8rem' }}
                  />
                </div>
              </div>
              <button className="danger-button" type="button" onClick={() => { playSound('ui-click'); deleteNode(selectedNode.id); }} data-sfx-handled style={{ marginTop: '8px' }}>
                {labels.deleteSkill}
              </button>
            </>
          ) : (
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textAlign: 'center', padding: '40px 0' }}>
              {labels.noSelection}
            </div>
          )}
        </div>
      </div>

      {/* History / Favorites toggles */}
      <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
        <button className="secondary-button" type="button" onClick={() => { playSound('ui-click'); setShowHistory((s) => !s); setShowFavorites(false); }} data-sfx-handled>
          {labels.history} ({history.length})
        </button>
        <button className="secondary-button" type="button" onClick={() => { playSound('ui-click'); setShowFavorites((s) => !s); setShowHistory(false); }} data-sfx-handled>
          {labels.favorites} ({favorites.length})
        </button>
      </div>

      {/* History list */}
      {showHistory && (
        <div className="set-list" style={{ marginTop: '12px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '10px' }}>
          {history.map((set) => (
            <div key={set.id} className="set-card" style={{ background: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--border)', padding: '12px' }}>
              <div style={{ fontWeight: 600, color: 'var(--text)', marginBottom: '4px' }}>{set.name}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                {set.characterName || labels.unnamed} · {set.nodes.length} {labels.skillName}
              </div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                <button className="secondary-button" type="button" onClick={() => { playSound('ui-click'); loadSet(set); }} data-sfx-handled>
                  {labels.loadSet}
                </button>
                <button className="secondary-button" type="button" onClick={() => { playSound('ui-click'); toggleFavorite(set); }} data-sfx-handled>
                  {labels.favorited}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Favorites list */}
      {showFavorites && (
        <div className="set-list" style={{ marginTop: '12px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '10px' }}>
          {favorites.map((set) => (
            <div key={set.id} className="set-card" style={{ background: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--border)', padding: '12px' }}>
              <div style={{ fontWeight: 600, color: 'var(--text)', marginBottom: '4px' }}>{set.name}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                {set.characterName || labels.unnamed} · {set.nodes.length} {labels.skillName}
              </div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                <button className="secondary-button" type="button" onClick={() => { playSound('ui-click'); loadSet(set); }} data-sfx-handled>
                  {labels.loadSet}
                </button>
                <button className="danger-button" type="button" onClick={() => { playSound('ui-click'); toggleFavorite(set); }} data-sfx-handled>
                  {labels.deleteSkill}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

