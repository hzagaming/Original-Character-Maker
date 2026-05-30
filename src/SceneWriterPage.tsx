import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { playSound } from './audioEngine';
import type { AppLanguage, SettingsState } from './types';

// ─── Types ───

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

export type SceneLineType = 'dialogue' | 'action';

export type SceneLine = {
  id: string;
  type: SceneLineType;
  speaker?: string;
  emotion?: string;
  text: string;
};

export type Scene = {
  id: string;
  title: string;
  location: string;
  time: string;
  weather: string;
  mood: string;
  cast: string[];
  lines: SceneLine[];
  createdAt: string;
  updatedAt: string;
};

export type SceneWriterState = {
  scenes: Scene[];
  activeSceneId: string | null;
};

// ─── Localization ───

const UI_COPY: Record<string, Record<string, string>> = {
  zh: {
    newScene: '新建场景',
    deleteScene: '删除场景',
    deleteSceneConfirm: '确定要删除这个场景吗？',
    sceneTitle: '场景标题',
    location: '地点',
    time: '时间',
    weather: '天气',
    mood: '氛围',
    cast: '出场角色',
    addCast: '添加角色',
    castPlaceholder: '输入角色名',
    lines: '剧本内容',
    addDialogue: '添加台词',
    addAction: '添加动作/旁白',
    speaker: '说话人',
    emotion: '情绪',
    text: '文本',
    preview: '预览',
    exportMarkdown: '导出 Markdown',
    emptyScene: '暂无场景，点击上方按钮创建',
    emptyLines: '还没有剧本内容，开始创作吧',
    lineDialogue: '台词',
    lineAction: '动作/旁白',
    copy: '复制',
    copied: '已复制',
    autoGenerate: '随机生成场景',
    dragHint: '拖拽排序',
    sceneCount: '个场景',
    exportTitle: '导出剧本',
    close: '关闭',
    sceneSettings: '场景设定',
    scriptEditor: '剧本编辑',
  },
  ja: {
    newScene: '新規シーン',
    deleteScene: 'シーン削除',
    deleteSceneConfirm: 'このシーンを削除しますか？',
    sceneTitle: 'シーンタイトル',
    location: '場所',
    time: '時間',
    weather: '天気',
    mood: '雰囲気',
    cast: '登場キャラ',
    addCast: 'キャラ追加',
    castPlaceholder: 'キャラ名を入力',
    lines: '脚本内容',
    addDialogue: 'セリフ追加',
    addAction: 'アクション/ナレ追加',
    speaker: '話者',
    emotion: '感情',
    text: 'テキスト',
    preview: 'プレビュー',
    exportMarkdown: 'Markdown 出力',
    emptyScene: 'シーンがありません。上のボタンで作成してください。',
    emptyLines: 'まだ内容がありません。作成を始めましょう。',
    lineDialogue: 'セリフ',
    lineAction: 'アクション/ナレ',
    copy: 'コピー',
    copied: 'コピー完了',
    autoGenerate: 'ランダム生成',
    dragHint: 'ドラッグ並べ替え',
    sceneCount: 'シーン',
    exportTitle: '脚本出力',
    close: '閉じる',
    sceneSettings: 'シーン設定',
    scriptEditor: '脚本編集',
  },
  en: {
    newScene: 'New Scene',
    deleteScene: 'Delete Scene',
    deleteSceneConfirm: 'Are you sure you want to delete this scene?',
    sceneTitle: 'Scene Title',
    location: 'Location',
    time: 'Time',
    weather: 'Weather',
    mood: 'Mood',
    cast: 'Cast',
    addCast: 'Add Character',
    castPlaceholder: 'Enter character name',
    lines: 'Script Content',
    addDialogue: 'Add Dialogue',
    addAction: 'Add Action/Narration',
    speaker: 'Speaker',
    emotion: 'Emotion',
    text: 'Text',
    preview: 'Preview',
    exportMarkdown: 'Export Markdown',
    emptyScene: 'No scenes yet. Click the button above to create one.',
    emptyLines: 'No script content yet. Start writing!',
    lineDialogue: 'Dialogue',
    lineAction: 'Action/Narration',
    copy: 'Copy',
    copied: 'Copied',
    autoGenerate: 'Random Scene',
    dragHint: 'Drag to reorder',
    sceneCount: 'scenes',
    exportTitle: 'Export Script',
    close: 'Close',
    sceneSettings: 'Scene Settings',
    scriptEditor: 'Script Editor',
  },
  ru: {
    newScene: 'Новая сцена',
    deleteScene: 'Удалить сцену',
    deleteSceneConfirm: 'Удалить эту сцену?',
    sceneTitle: 'Название сцены',
    location: 'Место',
    time: 'Время',
    weather: 'Погода',
    mood: 'Настроение',
    cast: 'Персонажи',
    addCast: 'Добавить персонажа',
    castPlaceholder: 'Введите имя',
    lines: 'Содержание',
    addDialogue: 'Добавить реплику',
    addAction: 'Добавить действие',
    speaker: 'Говорящий',
    emotion: 'Эмоция',
    text: 'Текст',
    preview: 'Предпросмотр',
    exportMarkdown: 'Экспорт Markdown',
    emptyScene: 'Пока нет сцен. Нажмите кнопку выше.',
    emptyLines: 'Пока пусто. Начните писать!',
    lineDialogue: 'Реплика',
    lineAction: 'Действие',
    copy: 'Копировать',
    copied: 'Скопировано',
    autoGenerate: 'Случайная сцена',
    dragHint: 'Перетащите',
    sceneCount: 'сцен',
    exportTitle: 'Экспорт сценария',
    close: 'Закрыть',
    sceneSettings: 'Настройки сцены',
    scriptEditor: 'Редактор сценария',
  },
  ko: {
    newScene: '새 장면',
    deleteScene: '장면 삭제',
    deleteSceneConfirm: '이 장면을 삭제하시겠습니까?',
    sceneTitle: '장면 제목',
    location: '장소',
    time: '시간',
    weather: '날씨',
    mood: '분위기',
    cast: '등장인물',
    addCast: '캐릭터 추가',
    castPlaceholder: '캐릭터명 입력',
    lines: '대본 내용',
    addDialogue: '대사 추가',
    addAction: '액션/나레이션 추가',
    speaker: '화자',
    emotion: '감정',
    text: '텍스트',
    preview: '미리보기',
    exportMarkdown: 'Markdown 내보내기',
    emptyScene: '장면이 없습니다. 위 버튼으로 생성하세요.',
    emptyLines: '내용이 없습니다. 작성을 시작하세요!',
    lineDialogue: '대사',
    lineAction: '액션/나레이션',
    copy: '복사',
    copied: '복사됨',
    autoGenerate: '랜덤 생성',
    dragHint: '드래그로 정렬',
    sceneCount: '장면',
    exportTitle: '대본 내보내기',
    close: '닫기',
    sceneSettings: '장면 설정',
    scriptEditor: '대본 편집기',
  },
};

// ─── Generator Pools ───

const GEN_POOLS: Record<string, Record<string, string[]>> = {
  zh: {
    location: ['古城广场', '森林深处', '魔法学院教室', '酒馆角落', '战舰甲板', '神社境内', '地下迷宫', '繁华街市', '废墟遗迹', '温泉旅馆', '城堡书房', '草原高地'],
    time: ['清晨', '正午', '黄昏', '深夜', '雨夜', '雪后的早晨', '满月之夜', '黎明前夕'],
    weather: ['晴朗', '小雨', '大雪', '浓雾', '沙尘', '雷雨', '微风', '阴天'],
    mood: ['紧张', '温馨', '悲伤', '激昂', '神秘', '轻松', '压抑', '浪漫', '悬疑', '欢快'],
    title: ['不期而遇', '最后的告别', '真相大白', '暗中较量', '意外发现', '重逢', '决裂', '暗中守护', '秘密会谈', '命运的转折'],
    dialogue: ['你……为什么会在这里？', '这件事，我不会放弃的。', '看来，我们都被骗了。', '还记得那个约定吗？', '放手吧，已经结束了。', '我绝不会让你得逞！', '原来……你一直在等我。', '这就是你的答案吗？'],
    action: ['远处传来脚步声，逐渐靠近。', '风突然停了，四周陷入死寂。', '灯光闪烁了几下，随即熄灭。', '他低下头，握紧了拳头。', '天空划过一道闪电，照亮了两人的面庞。', '门缓缓打开，一个熟悉的身影出现在门口。'],
  },
  en: {
    location: ['Ancient Plaza', 'Deep Forest', 'Magic Academy Classroom', 'Tavern Corner', 'Warship Deck', 'Shrine Grounds', 'Underground Labyrinth', 'Bustling Market', 'Ruins', 'Hot Spring Inn', 'Castle Study', 'Grassland Heights'],
    time: ['Early Morning', 'Noon', 'Dusk', 'Late Night', 'Rainy Night', 'Morning After Snow', 'Full Moon Night', 'Before Dawn'],
    weather: ['Clear', 'Light Rain', 'Heavy Snow', 'Thick Fog', 'Sandstorm', 'Thunderstorm', 'Breeze', 'Overcast'],
    mood: ['Tense', 'Warm', 'Sad', 'Passionate', 'Mysterious', 'Relaxed', 'Oppressive', 'Romantic', 'Suspenseful', 'Cheerful'],
    title: ['Unexpected Encounter', 'The Final Farewell', 'Truth Revealed', 'Hidden Contest', 'Surprising Discovery', 'Reunion', 'Breakup', 'Silent Guardianship', 'Secret Meeting', 'Turning Point'],
    dialogue: ['Why... why are you here?', "I won't give up on this.", 'It seems we were both deceived.', 'Do you remember that promise?', "Let it go. It's over.", "I won't let you get away with this!", 'So... you were waiting for me all along.', 'Is this your answer?'],
    action: ['Footsteps echo from afar, gradually approaching.', 'The wind suddenly stops, and silence envelops everything.', 'The lights flicker a few times, then go out.', 'He lowers his head and clenches his fists.', 'A flash of lightning illuminates both their faces.', 'The door slowly opens, and a familiar figure appears.'],
  },
};

// ─── Helpers ───

function uid() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getCopy(language: AppLanguage) {
  return UI_COPY[language] ?? UI_COPY.en;
}

function getPools(language: AppLanguage) {
  return GEN_POOLS[language] ?? GEN_POOLS.en;
}

function createEmptyScene(): Scene {
  const now = new Date().toISOString();
  return {
    id: uid(),
    title: '',
    location: '',
    time: '',
    weather: '',
    mood: '',
    cast: [],
    lines: [],
    createdAt: now,
    updatedAt: now,
  };
}

const STORAGE_KEY = 'oc-maker.scene-writer';

function readState(): SceneWriterState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as SceneWriterState;
      if (Array.isArray(parsed.scenes)) {
        return { scenes: parsed.scenes, activeSceneId: parsed.activeSceneId ?? null };
      }
    }
  } catch { /* ignore */ }
  return { scenes: [], activeSceneId: null };
}

function writeState(state: SceneWriterState): boolean {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

// ─── Component ───

export default function SceneWriterPage({
  pageTitle,
  pageDescription,
  language,
  onBack,
  onOpenSettings,
  onOpenDocs,
}: SharedPageProps) {
  const copy = getCopy(language);
  const [state, setState] = useState<SceneWriterState>(readState);
  const [showExport, setShowExport] = useState(false);
  const [exportText, setExportText] = useState('');
  const [copied, setCopied] = useState(false);
  const [draggingLineId, setDraggingLineId] = useState<string | null>(null);
  const dragOverLineIdRef = useRef<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { scenes, activeSceneId } = state;
  const activeScene = useMemo(() => scenes.find((s) => s.id === activeSceneId) ?? null, [scenes, activeSceneId]);

  useEffect(() => {
    writeState(state);
  }, [state]);

  const updateScene = useCallback((sceneId: string, updater: (s: Scene) => Scene) => {
    setState((prev) => {
      const now = new Date().toISOString();
      const nextScenes = prev.scenes.map((s) => (s.id === sceneId ? updater({ ...s, updatedAt: now }) : s));
      return { ...prev, scenes: nextScenes };
    });
  }, []);

  const createScene = useCallback(() => {
    playSound('confirm');
    const scene = createEmptyScene();
    setState((prev) => ({ ...prev, scenes: [...prev.scenes, scene], activeSceneId: scene.id }));
  }, []);

  const deleteScene = useCallback((sceneId: string) => {
    playSound('deleteSound');
    setState((prev) => {
      const nextScenes = prev.scenes.filter((s) => s.id !== sceneId);
      let nextActive = prev.activeSceneId;
      if (prev.activeSceneId === sceneId) {
        nextActive = nextScenes.length > 0 ? nextScenes[0].id : null;
      }
      return { ...prev, scenes: nextScenes, activeSceneId: nextActive };
    });
  }, []);

  const duplicateScene = useCallback((scene: Scene) => {
    playSound('copySound');
    const copyScene: Scene = {
      ...scene,
      id: uid(),
      title: `${scene.title || copy.newScene} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setState((prev) => ({ ...prev, scenes: [...prev.scenes, copyScene], activeSceneId: copyScene.id }));
  }, [copy.newScene]);

  const addLine = useCallback((sceneId: string, type: SceneLineType) => {
    playSound('buttonClick');
    updateScene(sceneId, (s) => ({
      ...s,
      lines: [...s.lines, { id: uid(), type, text: '', speaker: s.cast[0] || '', emotion: '' }],
    }));
  }, [updateScene]);

  const updateLine = useCallback((sceneId: string, lineId: string, patch: Partial<SceneLine>) => {
    updateScene(sceneId, (s) => ({
      ...s,
      lines: s.lines.map((l) => (l.id === lineId ? { ...l, ...patch } : l)),
    }));
  }, [updateScene]);

  const deleteLine = useCallback((sceneId: string, lineId: string) => {
    playSound('deleteSound');
    updateScene(sceneId, (s) => ({
      ...s,
      lines: s.lines.filter((l) => l.id !== lineId),
    }));
  }, [updateScene]);

  const moveLine = useCallback((sceneId: string, fromIndex: number, toIndex: number) => {
    updateScene(sceneId, (s) => {
      const lines = [...s.lines];
      const [moved] = lines.splice(fromIndex, 1);
      lines.splice(toIndex, 0, moved);
      return { ...s, lines };
    });
  }, [updateScene]);

  const handleDragStart = useCallback((lineId: string) => {
    setDraggingLineId(lineId);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, lineId: string) => {
    e.preventDefault();
    dragOverLineIdRef.current = lineId;
  }, []);

  const handleDrop = useCallback((sceneId: string, targetLineId: string) => {
    if (!draggingLineId || draggingLineId === targetLineId) {
      setDraggingLineId(null);
      dragOverLineIdRef.current = null;
      return;
    }
    const scene = scenes.find((s) => s.id === sceneId);
    if (!scene) return;
    const fromIndex = scene.lines.findIndex((l) => l.id === draggingLineId);
    const toIndex = scene.lines.findIndex((l) => l.id === targetLineId);
    if (fromIndex !== -1 && toIndex !== -1) {
      moveLine(sceneId, fromIndex, toIndex);
      playSound('drop');
    }
    setDraggingLineId(null);
    dragOverLineIdRef.current = null;
  }, [draggingLineId, scenes, moveLine]);

  const autoGenerate = useCallback(() => {
    playSound('confirm');
    const pools = getPools(language);
    const castNames = ['主角', '配角A', '配角B'];
    const scene: Scene = {
      id: uid(),
      title: pick(pools.title),
      location: pick(pools.location),
      time: pick(pools.time),
      weather: pick(pools.weather),
      mood: pick(pools.mood),
      cast: [...castNames],
      lines: [
        { id: uid(), type: 'action', text: pick(pools.action) },
        { id: uid(), type: 'dialogue', speaker: castNames[0], emotion: '严肃', text: pick(pools.dialogue) },
        { id: uid(), type: 'action', text: '沉默在空气中蔓延。' },
        { id: uid(), type: 'dialogue', speaker: castNames[1], emotion: '惊讶', text: pick(pools.dialogue) },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setState((prev) => ({ ...prev, scenes: [...prev.scenes, scene], activeSceneId: scene.id }));
  }, [language]);

  const generateMarkdown = useCallback((scene: Scene): string => {
    const lines = [
      `# ${scene.title || 'Untitled Scene'}`,
      '',
      `**Location:** ${scene.location || '-'}  `,
      `**Time:** ${scene.time || '-'}  `,
      `**Weather:** ${scene.weather || '-'}  `,
      `**Mood:** ${scene.mood || '-'}  `,
      `**Cast:** ${scene.cast.join(', ') || '-'}`,
      '',
      '---',
      '',
      ...scene.lines.map((line) => {
        if (line.type === 'action') {
          return `*${line.text}*`;
        }
        const speaker = line.speaker ? `**${line.speaker}**` : '';
        const emotion = line.emotion ? ` *(${line.emotion})*` : '';
        return `${speaker}${emotion}\n> ${line.text}`;
      }),
      '',
      '---',
      `*Generated by OC Maker Scene Writer*`,
    ];
    return lines.join('\n');
  }, []);

  const openExport = useCallback(() => {
    if (!activeScene) return;
    playSound('modalOpen');
    setExportText(generateMarkdown(activeScene));
    setShowExport(true);
  }, [activeScene, generateMarkdown]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(exportText);
      setCopied(true);
      playSound('success');
      setTimeout(() => setCopied(false), 1500);
    } catch {
      playSound('error');
    }
  }, [exportText]);

  const handleImport = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result));
        if (Array.isArray(data.scenes)) {
          setState((prev) => ({ ...prev, scenes: data.scenes, activeSceneId: data.scenes[0]?.id ?? null }));
          playSound('success');
        }
      } catch {
        playSound('error');
      }
    };
    reader.readAsText(file);
  }, []);

  const addCastMember = useCallback((sceneId: string, name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    updateScene(sceneId, (s) => {
      if (s.cast.includes(trimmed)) return s;
      return { ...s, cast: [...s.cast, trimmed] };
    });
  }, [updateScene]);

  const removeCastMember = useCallback((sceneId: string, name: string) => {
    updateScene(sceneId, (s) => ({
      ...s,
      cast: s.cast.filter((c) => c !== name),
      lines: s.lines.map((l) => (l.speaker === name ? { ...l, speaker: '' } : l)),
    }));
  }, [updateScene]);

  // ─── Render ───

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header-row">
        <div>
          <h2 className="page-title">{pageTitle}</h2>
          <p className="page-subtitle">{pageDescription}</p>
        </div>
        <div className="page-header-actions">
          {onOpenDocs && (
            <button className="secondary-button small-button" type="button" data-sfx-handled onClick={() => { playSound('buttonClick'); onOpenDocs('scene-writer'); }}>
              ?
            </button>
          )}
          <button className="secondary-button small-button" type="button" data-sfx-handled onClick={() => { playSound('buttonClick'); onOpenSettings(); }}>
            ⚙
          </button>
          <button className="secondary-button small-button" type="button" data-sfx-handled onClick={() => { playSound('back'); onBack(); }}>
            ←
          </button>
        </div>
      </div>

      <div className="scene-writer-layout">
        {/* Sidebar */}
        <aside className="scene-sidebar">
          <div className="scene-sidebar-header">
            <button className="primary-button small-button" type="button" data-sfx-handled onClick={createScene}>
              + {copy.newScene}
            </button>
            <button className="secondary-button small-button" type="button" data-sfx-handled onClick={autoGenerate}>
              ✦ {copy.autoGenerate}
            </button>
          </div>

          <div className="scene-list">
            {scenes.length === 0 && (
              <div className="scene-empty">{copy.emptyScene}</div>
            )}
            {scenes.map((scene) => (
              <div
                key={scene.id}
                className={`scene-list-item ${scene.id === activeSceneId ? 'active' : ''}`}
                onClick={() => { playSound('buttonClick'); setState((prev) => ({ ...prev, activeSceneId: scene.id })); }}
                draggable
                onDragStart={() => {}}
                onDragOver={() => {}}
                onDrop={() => {}}
              >
                <div className="scene-list-title">{scene.title || copy.newScene}</div>
                <div className="scene-list-meta">
                  {scene.location} · {scene.mood}
                </div>
                <div className="scene-list-actions">
                  <button
                    className="icon-button"
                    type="button"
                    title={copy.copy}
                    onClick={(e) => { e.stopPropagation(); duplicateScene(scene); }}
                  >
                    📋
                  </button>
                  <button
                    className="icon-button danger"
                    type="button"
                    title={copy.deleteScene}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm(copy.deleteSceneConfirm)) {
                        deleteScene(scene.id);
                      }
                    }}
                  >
                    🗑
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="scene-sidebar-footer">
            {scenes.length} {copy.sceneCount}
          </div>
        </aside>

        {/* Main Editor */}
        <main className="scene-editor">
          {!activeScene ? (
            <div className="scene-empty-state">
              <div className="scene-empty-icon">🎬</div>
              <p>{copy.emptyScene}</p>
            </div>
          ) : (
            <>
              {/* Scene Meta */}
              <div className="scene-meta-card">
                <h3 className="scene-section-title">{copy.sceneSettings}</h3>
                <div className="scene-meta-grid">
                  <input
                    className="scene-input"
                    type="text"
                    placeholder={copy.sceneTitle}
                    value={activeScene.title}
                    onChange={(e) => updateScene(activeScene.id, (s) => ({ ...s, title: e.target.value }))}
                  />
                  <input
                    className="scene-input"
                    type="text"
                    placeholder={copy.location}
                    value={activeScene.location}
                    onChange={(e) => updateScene(activeScene.id, (s) => ({ ...s, location: e.target.value }))}
                  />
                  <input
                    className="scene-input"
                    type="text"
                    placeholder={copy.time}
                    value={activeScene.time}
                    onChange={(e) => updateScene(activeScene.id, (s) => ({ ...s, time: e.target.value }))}
                  />
                  <input
                    className="scene-input"
                    type="text"
                    placeholder={copy.weather}
                    value={activeScene.weather}
                    onChange={(e) => updateScene(activeScene.id, (s) => ({ ...s, weather: e.target.value }))}
                  />
                  <input
                    className="scene-input"
                    type="text"
                    placeholder={copy.mood}
                    value={activeScene.mood}
                    onChange={(e) => updateScene(activeScene.id, (s) => ({ ...s, mood: e.target.value }))}
                  />
                </div>

                {/* Cast */}
                <div className="scene-cast-section">
                  <label className="scene-label">{copy.cast}</label>
                  <div className="scene-cast-list">
                    {activeScene.cast.map((member) => (
                      <span key={member} className="scene-cast-chip">
                        {member}
                        <button type="button" className="scene-cast-remove" onClick={() => removeCastMember(activeScene.id, member)}>×</button>
                      </span>
                    ))}
                    <input
                      className="scene-cast-input"
                      type="text"
                      placeholder={copy.castPlaceholder}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          addCastMember(activeScene.id, (e.target as HTMLInputElement).value);
                          (e.target as HTMLInputElement).value = '';
                        }
                      }}
                      onBlur={(e) => {
                        addCastMember(activeScene.id, e.target.value);
                        e.target.value = '';
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Script Editor */}
              <div className="scene-script-card">
                <div className="scene-script-header">
                  <h3 className="scene-section-title">{copy.scriptEditor}</h3>
                  <div className="scene-script-actions">
                    <button className="secondary-button small-button" type="button" data-sfx-handled onClick={() => addLine(activeScene.id, 'dialogue')}>
                      + {copy.addDialogue}
                    </button>
                    <button className="secondary-button small-button" type="button" data-sfx-handled onClick={() => addLine(activeScene.id, 'action')}>
                      + {copy.addAction}
                    </button>
                    <button className="primary-button small-button" type="button" data-sfx-handled onClick={openExport}>
                      {copy.exportMarkdown}
                    </button>
                  </div>
                </div>

                {activeScene.lines.length === 0 ? (
                  <div className="scene-empty-lines">{copy.emptyLines}</div>
                ) : (
                  <div className="scene-lines">
                    {activeScene.lines.map((line, index) => (
                      <div
                        key={line.id}
                        className={`scene-line ${line.type} ${draggingLineId === line.id ? 'dragging' : ''}`}
                        draggable
                        onDragStart={() => handleDragStart(line.id)}
                        onDragOver={(e) => handleDragOver(e, line.id)}
                        onDrop={() => handleDrop(activeScene.id, line.id)}
                      >
                        <div className="scene-line-handle" title={copy.dragHint}>⋮⋮</div>
                        <div className="scene-line-badge">{line.type === 'dialogue' ? copy.lineDialogue : copy.lineAction}</div>

                        {line.type === 'dialogue' && (
                          <div className="scene-line-dialogue-fields">
                            <select
                              className="scene-select"
                              value={line.speaker || ''}
                              onChange={(e) => updateLine(activeScene.id, line.id, { speaker: e.target.value })}
                            >
                              <option value="">{copy.speaker}</option>
                              {activeScene.cast.map((c) => (
                                <option key={c} value={c}>{c}</option>
                              ))}
                            </select>
                            <input
                              className="scene-input emotion"
                              type="text"
                              placeholder={copy.emotion}
                              value={line.emotion || ''}
                              onChange={(e) => updateLine(activeScene.id, line.id, { emotion: e.target.value })}
                            />
                          </div>
                        )}

                        <textarea
                          className="scene-textarea"
                          rows={2}
                          placeholder={line.type === 'dialogue' ? copy.text : copy.addAction}
                          value={line.text}
                          onChange={(e) => updateLine(activeScene.id, line.id, { text: e.target.value })}
                        />

                        <button
                          className="icon-button danger"
                          type="button"
                          title={copy.deleteScene}
                          onClick={() => deleteLine(activeScene.id, line.id)}
                        >
                          🗑
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </main>
      </div>

      {/* Export Modal */}
      {showExport && (
        <div className="modal-backdrop" onClick={() => { playSound('modalClose'); setShowExport(false); }}>
          <div className="modal-surface" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{copy.exportTitle}</h3>
              <button className="icon-button" type="button" onClick={() => { playSound('modalClose'); setShowExport(false); }}>✕</button>
            </div>
            <div className="modal-body">
              <textarea className="scene-export-textarea" readOnly rows={16} value={exportText} />
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
    </div>
  );
}
