import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { AppLanguage, SettingsState } from './types';
import { DraggableErrorPanel } from './components/DraggableErrorPanel';
import { playSound } from './audioEngine';

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
  onNavigate?: (screen: 'image-converter' | 'docs') => void;
  onOpenDocs?: (toolId?: string, section?: string, errorCode?: string) => void;
  onSwitchTool?: (toolId: string) => void;
};

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type LogLevel = 'info' | 'success' | 'error' | 'debug';
type WorkflowLog = { time: string; level: LogLevel; text: string };

type ExportRecord = {
  id: string;
  fileName: string;
  format: string;
  blob: Blob;
  url: string;
  duration: number;
  size: number;
  createdAt: string;
};

/* ------------------------------------------------------------------ */
/*  Utilities                                                          */
/* ------------------------------------------------------------------ */

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

function timestamp(): string {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}.${String(now.getMilliseconds()).padStart(3, '0')}`;
}

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return '0:00.000';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 1000);
  return `${m}:${String(s).padStart(2, '0')}.${String(ms).padStart(3, '0')}`;
}

function formatBytes(bytes: number): string {
  if (bytes <= 0 || !isFinite(bytes)) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(k)), sizes.length - 1);
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

function generateWaveformData(buffer: AudioBuffer, width: number): number[] {
  if (!buffer || width <= 0) return [];
  const channel = buffer.getChannelData(0);
  const step = Math.max(1, Math.floor(channel.length / width));
  const peaks: number[] = [];
  for (let i = 0; i < width; i++) {
    let max = 0;
    const start = i * step;
    const end = Math.min(start + step, channel.length);
    for (let j = start; j < end; j++) {
      const v = Math.abs(channel[j]);
      if (v > max) max = v;
    }
    peaks.push(max);
  }
  return peaks;
}

function trimAudioBuffer(buffer: AudioBuffer, start: number, end: number): AudioBuffer {
  const sampleRate = buffer.sampleRate;
  const startSample = Math.max(0, Math.floor(start * sampleRate));
  const endSample = Math.min(buffer.length, Math.floor(end * sampleRate));
  const len = Math.max(0, endSample - startSample);
  const trimmed = new AudioBuffer({ numberOfChannels: buffer.numberOfChannels, length: len, sampleRate });
  for (let ch = 0; ch < buffer.numberOfChannels; ch++) {
    trimmed.copyToChannel(buffer.getChannelData(ch).subarray(startSample, endSample), ch);
  }
  return trimmed;
}

function splitAt(buffer: AudioBuffer, time: number): [AudioBuffer, AudioBuffer] {
  const sampleRate = buffer.sampleRate;
  const splitSample = Math.max(0, Math.min(buffer.length, Math.floor(time * sampleRate)));
  const len1 = splitSample;
  const len2 = buffer.length - splitSample;
  const left = new AudioBuffer({ numberOfChannels: buffer.numberOfChannels, length: len1, sampleRate });
  const right = new AudioBuffer({ numberOfChannels: buffer.numberOfChannels, length: len2, sampleRate });
  for (let ch = 0; ch < buffer.numberOfChannels; ch++) {
    const src = buffer.getChannelData(ch);
    if (len1 > 0) left.copyToChannel(src.subarray(0, splitSample), ch);
    if (len2 > 0) right.copyToChannel(src.subarray(splitSample), ch);
  }
  return [left, right];
}

function applyFade(buffer: AudioBuffer, fadeIn: number, fadeOut: number): AudioBuffer {
  if (fadeIn <= 0 && fadeOut <= 0) return buffer;
  const sr = buffer.sampleRate;
  const inSamples = Math.floor(fadeIn * sr);
  const outSamples = Math.floor(fadeOut * sr);
  const result = new AudioBuffer({ numberOfChannels: buffer.numberOfChannels, length: buffer.length, sampleRate: sr });
  for (let ch = 0; ch < buffer.numberOfChannels; ch++) {
    const src = buffer.getChannelData(ch);
    const dst = result.getChannelData(ch);
    for (let i = 0; i < src.length; i++) {
      let gain = 1;
      if (inSamples > 0 && i < inSamples) gain = i / (inSamples - 1 || 1);
      if (outSamples > 0 && i >= src.length - outSamples) gain = Math.max(0, (src.length - 1 - i) / (outSamples - 1 || 1));
      dst[i] = src[i] * gain;
    }
  }
  return result;
}

function applyReverse(buffer: AudioBuffer): AudioBuffer {
  const result = new AudioBuffer({ numberOfChannels: buffer.numberOfChannels, length: buffer.length, sampleRate: buffer.sampleRate });
  for (let ch = 0; ch < buffer.numberOfChannels; ch++) {
    const src = buffer.getChannelData(ch);
    const dst = result.getChannelData(ch);
    for (let i = 0; i < src.length; i++) dst[i] = src[src.length - 1 - i];
  }
  return result;
}

function mixToMono(buffer: AudioBuffer): AudioBuffer {
  if (buffer.numberOfChannels === 1) return buffer;
  const mono = new AudioBuffer({ numberOfChannels: 1, length: buffer.length, sampleRate: buffer.sampleRate });
  const dst = mono.getChannelData(0);
  for (let i = 0; i < buffer.length; i++) {
    let sum = 0;
    for (let ch = 0; ch < buffer.numberOfChannels; ch++) sum += buffer.getChannelData(ch)[i];
    dst[i] = sum / buffer.numberOfChannels;
  }
  return mono;
}

function normalizeBuffer(buffer: AudioBuffer): AudioBuffer {
  let peak = 0;
  for (let ch = 0; ch < buffer.numberOfChannels; ch++) {
    const data = buffer.getChannelData(ch);
    for (let i = 0; i < data.length; i++) peak = Math.max(peak, Math.abs(data[i]));
  }
  if (peak === 0 || peak >= 0.999) return buffer;
  const gain = 0.999 / peak;
  const result = new AudioBuffer({ numberOfChannels: buffer.numberOfChannels, length: buffer.length, sampleRate: buffer.sampleRate });
  for (let ch = 0; ch < buffer.numberOfChannels; ch++) {
    const src = buffer.getChannelData(ch);
    const dst = result.getChannelData(ch);
    for (let i = 0; i < src.length; i++) dst[i] = src[i] * gain;
  }
  return result;
}

function applyNoiseReduction(buffer: AudioBuffer, intensity: number): AudioBuffer {
  if (intensity <= 0) return buffer;
  const threshold = (intensity / 100) * 0.02;
  const result = new AudioBuffer({ numberOfChannels: buffer.numberOfChannels, length: buffer.length, sampleRate: buffer.sampleRate });
  for (let ch = 0; ch < buffer.numberOfChannels; ch++) {
    const src = buffer.getChannelData(ch);
    const dst = result.getChannelData(ch);
    for (let i = 0; i < src.length; i++) {
      const v = Math.abs(src[i]);
      if (v < threshold) {
        dst[i] = src[i] * (v / threshold);
      } else {
        dst[i] = src[i];
      }
    }
  }
  return result;
}

/* ---- WAV Exporters ---- */

function audioBufferToWav(buffer: AudioBuffer, bitDepth: 8 | 16 | 32 = 16): Blob {
  const numOfChan = buffer.numberOfChannels;
  const bytesPerSample = bitDepth === 8 ? 1 : bitDepth === 16 ? 2 : 4;
  const blockAlign = numOfChan * bytesPerSample;
  const dataSize = buffer.length * blockAlign;
  const headerSize = 44;
  const arr = new ArrayBuffer(headerSize + dataSize);
  const view = new DataView(arr);
  let pos = 0;

  function writeString(s: string) { for (let i = 0; i < s.length; i++) view.setUint8(pos++, s.charCodeAt(i)); }
  function writeUint16(v: number) { view.setUint16(pos, v, true); pos += 2; }
  function writeUint32(v: number) { view.setUint32(pos, v, true); pos += 4; }

  writeString('RIFF');
  writeUint32(headerSize + dataSize - 8);
  writeString('WAVE');
  writeString('fmt ');
  writeUint32(16);
  writeUint16(bitDepth === 32 ? 3 : 1);
  writeUint16(numOfChan);
  writeUint32(buffer.sampleRate);
  writeUint32(buffer.sampleRate * blockAlign);
  writeUint16(blockAlign);
  writeUint16(bytesPerSample * 8);
  writeString('data');
  writeUint32(dataSize);

  for (let i = 0; i < buffer.length; i++) {
    for (let ch = 0; ch < numOfChan; ch++) {
      let sample = buffer.getChannelData(ch)[i];
      if (bitDepth === 8) {
        sample = Math.max(-1, Math.min(1, sample));
        view.setUint8(pos, (sample + 1) * 127.5);
        pos += 1;
      } else if (bitDepth === 16) {
        sample = Math.max(-1, Math.min(1, sample));
        view.setInt16(pos, (sample < 0 ? sample * 32768 : sample * 32767) | 0, true);
        pos += 2;
      } else {
        view.setFloat32(pos, sample, true);
        pos += 4;
      }
    }
  }

  return new Blob([arr], { type: 'audio/wav' });
}

/* ---- MediaRecorder-based export ---- */

function getSupportedMimeTypes(): string[] {
  if (typeof MediaRecorder === 'undefined' || !MediaRecorder.isTypeSupported) return [];
  const types = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/ogg;codecs=opus',
    'audio/ogg',
    'audio/mp3',
    'audio/mp4',
    'audio/mpeg',
  ];
  return types.filter((t) => MediaRecorder.isTypeSupported(t));
}

async function exportViaMediaRecorder(buffer: AudioBuffer, mimeType: string): Promise<Blob> {
  const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) throw new Error('Web Audio API not supported');
  const ctx = new AC();
  const source = ctx.createBufferSource();
  source.buffer = buffer;

  const dest = ctx.createMediaStreamDestination();
  source.connect(dest);

  const recorder = new MediaRecorder(dest.stream, { mimeType });
  const chunks: Blob[] = [];
  recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };

  return new Promise((resolve, reject) => {
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: mimeType });
      ctx.close().catch(() => {});
      if (blob.size === 0) reject(new Error('Empty recording'));
      else resolve(blob);
    };
    recorder.onerror = () => {
      ctx.close().catch(() => {});
      reject(new Error('MediaRecorder error'));
    };

    recorder.start();
    source.start(0);
    source.onended = () => { try { recorder.stop(); } catch {} };
  });
}

/* ------------------------------------------------------------------ */
/*  Audio Editor Page                                                  */
/* ------------------------------------------------------------------ */

export function AudioEditorPage({
  appSubtitle,
  pageTitle,
  pageDescription,
  backHome,
  openSettings,
  settings: _settings,
  language,
  onBack,
  onOpenSettings,
  onOpenDocs,
  onSwitchTool,
}: SharedPageProps) {
  const labels = useMemo(() => {
    const dict: Record<string, Record<string, string>> = {
      zh: {
        resetAll: '全部重置', source: '来源', importAudio: '导入音频', replace: '替换',
        operations: '操作', play: '播放', pause: '暂停', stop: '停止',
        undo: '撤销', redo: '重做', export: '导出', exporting: '导出中…',
        exportComplete: '导出完成', ready: '就绪', noExportsYet: '暂无导出结果', download: '下载', remove: '移除',
        help: '帮助', tutorial: '教程', audioConverter: '音频转换', decoding: '解码音频中…', dropHint: '点击或拖入 MP3、WAV、OGG、FLAC、M4A',
        waveform: '波形', editor: '编辑器', zoom: '缩放', selection: '选区', edit: '编辑', trim: '裁剪', split: '分割', delete: '删除',
        duplicate: '复制片段', reverse: '反转', fade: '淡化', normalize: '标准化', mono: '单声道', resetFx: '重置效果', newFile: '新文件',
        effects: '效果', parameters: '参数', volume: '音量', panLR: '声像（左/右）', speed: '速度', pitchCents: '音高（音分）',
        fadeIn: '淡入', fadeOut: '淡出', lowGain: '低频增益', midGain: '中频增益', highGain: '高频增益', threshold: '阈值',
        ratio: '压缩比', attack: '起音', release: '释放', roomSize: '房间大小', damping: '阻尼', wetDry: '干湿比', noiseReduction: '降噪',
        mute: '静音', loop: '循环', exportSettings: '导出设置', exportFormat: '导出格式', debug: '调试', workflowLogs: '工作流日志',
        hide: '收起', show: '展开', copy: '复制', clear: '清空', noLogsYet: '暂无日志。', error: '错误', stage: '阶段', message: '信息',
        hint: '提示', details: '详情', copyText: '复制', downloadJson: '下载 JSON', openDocs: '打开文档', retry: '重试',
      },
      ja: {
        resetAll: 'すべてリセット', source: 'ソース', importAudio: '音声をインポート', replace: '置換',
        operations: '操作', play: '再生', pause: '一時停止', stop: '停止',
        undo: '元に戻す', redo: 'やり直し', export: '書き出し', exporting: '書き出し中…',
        exportComplete: '書き出し完了', ready: '準備完了', noExportsYet: '書き出し履歴なし', download: 'ダウンロード', remove: '削除',
        help: 'ヘルプ', tutorial: 'チュートリアル', audioConverter: '音声変換', decoding: '音声をデコード中…', dropHint: 'MP3、WAV、OGG、FLAC、M4A をクリックまたはドラッグ',
        waveform: '波形', editor: 'エディタ', zoom: 'ズーム', selection: '選択範囲', edit: '編集', trim: 'トリム', split: '分割', delete: '削除',
        duplicate: '複製', reverse: '反転', fade: 'フェード', normalize: '正規化', mono: 'モノラル', resetFx: 'FX リセット', newFile: '新規ファイル',
        effects: 'エフェクト', parameters: 'パラメータ', volume: '音量', panLR: 'パン（左/右）', speed: '速度', pitchCents: 'ピッチ（セント）',
        fadeIn: 'フェードイン', fadeOut: 'フェードアウト', lowGain: '低域ゲイン', midGain: '中域ゲイン', highGain: '高域ゲイン', threshold: 'しきい値',
        ratio: '比率', attack: 'アタック', release: 'リリース', roomSize: 'ルームサイズ', damping: 'ダンピング', wetDry: 'ウェット/ドライ', noiseReduction: 'ノイズ低減',
        mute: 'ミュート', loop: 'ループ', exportSettings: '書き出し設定', exportFormat: '書き出し形式', debug: 'デバッグ', workflowLogs: 'ワークフローログ',
        hide: '隠す', show: '表示', copy: 'コピー', clear: 'クリア', noLogsYet: 'ログはまだありません。', error: 'エラー', stage: '段階', message: 'メッセージ',
        hint: 'ヒント', details: '詳細', copyText: 'コピー', downloadJson: 'JSON ダウンロード', openDocs: 'ドキュメントを開く', retry: '再試行',
      },
      en: {
        resetAll: 'Reset All', source: 'Source', importAudio: 'Import Audio', replace: 'Replace',
        operations: 'Operations', play: 'Play', pause: 'Pause', stop: 'Stop',
        undo: 'Undo', redo: 'Redo', export: 'Export', exporting: 'Exporting…',
        exportComplete: 'Export complete', ready: 'Ready', noExportsYet: 'No exports yet.', download: 'Download', remove: 'Remove',
        help: 'Help', tutorial: 'Tutorial', audioConverter: 'Audio Converter', decoding: 'Decoding audio…', dropHint: 'Click or drag MP3, WAV, OGG, FLAC, M4A here',
        waveform: 'Waveform', editor: 'Editor', zoom: 'Zoom', selection: 'Selection', edit: 'Edit', trim: 'Trim', split: 'Split', delete: 'Delete',
        duplicate: 'Duplicate', reverse: 'Reverse', fade: 'Fade', normalize: 'Normalize', mono: 'Mono', resetFx: 'Reset FX', newFile: 'New File',
        effects: 'Effects', parameters: 'Parameters', volume: 'Volume', panLR: 'Pan (L/R)', speed: 'Speed', pitchCents: 'Pitch (cents)',
        fadeIn: 'Fade In', fadeOut: 'Fade Out', lowGain: 'Low Gain', midGain: 'Mid Gain', highGain: 'High Gain', threshold: 'Threshold',
        ratio: 'Ratio', attack: 'Attack', release: 'Release', roomSize: 'Room Size', damping: 'Damping', wetDry: 'Wet/Dry', noiseReduction: 'Noise Reduction',
        mute: 'Mute', loop: 'Loop', exportSettings: 'Export Settings', exportFormat: 'Export format', debug: 'Debug', workflowLogs: 'Workflow Logs',
        hide: 'Hide', show: 'Show', copy: 'Copy', clear: 'Clear', noLogsYet: 'No logs yet.', error: 'Error', stage: 'Stage', message: 'Message',
        hint: 'Hint', details: 'Details', copyText: 'Copy', downloadJson: 'Download JSON', openDocs: 'Open Docs', retry: 'Retry',
      },
      ru: {
        resetAll: 'Сбросить все', source: 'Источник', importAudio: 'Импорт аудио', replace: 'Заменить',
        operations: 'Операции', play: 'Воспроизвести', pause: 'Пауза', stop: 'Стоп',
        undo: 'Отменить', redo: 'Повторить', export: 'Экспорт', exporting: 'Экспорт…',
        exportComplete: 'Экспорт завершён', ready: 'Готово', noExportsYet: 'Нет экспортов', download: 'Скачать', remove: 'Удалить',
        help: 'Помощь', tutorial: 'Обучение', audioConverter: 'Аудиоконвертер', decoding: 'Декодирование аудио…', dropHint: 'Нажмите или перетащите MP3, WAV, OGG, FLAC, M4A',
        waveform: 'Волна', editor: 'Редактор', zoom: 'Масштаб', selection: 'Выделение', edit: 'Правка', trim: 'Обрезать', split: 'Разделить', delete: 'Удалить',
        duplicate: 'Дублировать', reverse: 'Реверс', fade: 'Фейд', normalize: 'Нормализовать', mono: 'Моно', resetFx: 'Сброс FX', newFile: 'Новый файл',
        effects: 'Эффекты', parameters: 'Параметры', volume: 'Громкость', panLR: 'Пан (Л/П)', speed: 'Скорость', pitchCents: 'Высота (центы)',
        fadeIn: 'Плавное начало', fadeOut: 'Плавное затухание', lowGain: 'Низкие', midGain: 'Средние', highGain: 'Высокие', threshold: 'Порог',
        ratio: 'Коэф.', attack: 'Атака', release: 'Релиз', roomSize: 'Размер комнаты', damping: 'Демпфирование', wetDry: 'Wet/Dry', noiseReduction: 'Шумоподавление',
        mute: 'Без звука', loop: 'Цикл', exportSettings: 'Настройки экспорта', exportFormat: 'Формат экспорта', debug: 'Отладка', workflowLogs: 'Логи процесса',
        hide: 'Скрыть', show: 'Показать', copy: 'Копировать', clear: 'Очистить', noLogsYet: 'Логов пока нет.', error: 'Ошибка', stage: 'Этап', message: 'Сообщение',
        hint: 'Подсказка', details: 'Детали', copyText: 'Копировать', downloadJson: 'Скачать JSON', openDocs: 'Открыть документацию', retry: 'Повторить',
      },
      ko: {
        resetAll: '모두 초기화', source: '소스', importAudio: '오디오 가져오기', replace: '교체',
        operations: '작업', play: '재생', pause: '일시정지', stop: '정지',
        undo: '실행 취소', redo: '다시 실행', export: '납품', exporting: '납품 중…',
        exportComplete: '납품 완료', ready: '준비 완료', noExportsYet: '납품 내역 없음', download: '다운로드', remove: '제거',
        help: '도움말', tutorial: '튜토리얼', audioConverter: '오디오 변환기', decoding: '오디오 디코딩 중…', dropHint: 'MP3, WAV, OGG, FLAC, M4A를 클릭하거나 드래그',
        waveform: '파형', editor: '편집기', zoom: '줌', selection: '선택 영역', edit: '편집', trim: '자르기', split: '분할', delete: '삭제',
        duplicate: '복제', reverse: '반전', fade: '페이드', normalize: '정규화', mono: '모노', resetFx: 'FX 초기화', newFile: '새 파일',
        effects: '효과', parameters: '매개변수', volume: '음량', panLR: '팬 (좌/우)', speed: '속도', pitchCents: '피치 (센트)',
        fadeIn: '페이드 인', fadeOut: '페이드 아웃', lowGain: '저역 게인', midGain: '중역 게인', highGain: '고역 게인', threshold: '임계값',
        ratio: '비율', attack: '어택', release: '릴리즈', roomSize: '공간 크기', damping: '댐핑', wetDry: 'Wet/Dry', noiseReduction: '노이즈 감소',
        mute: '음소거', loop: '루프', exportSettings: '내보내기 설정', exportFormat: '내보내기 형식', debug: '디버그', workflowLogs: '워크플로 로그',
        hide: '접기', show: '펼치기', copy: '복사', clear: '비우기', noLogsYet: '아직 로그가 없습니다.', error: '오류', stage: '단계', message: '메시지',
        hint: '힌트', details: '세부 정보', copyText: '복사', downloadJson: 'JSON 다운로드', openDocs: '문서 열기', retry: '재시도',
      },
    };
    return dict[language] ?? dict.en;
  }, [language]);
  /* ---- Single shared AudioContext ---- */
  const audioCtxRef = useRef<AudioContext | null>(null);

  /* ---- Audio state ---- */
  const [sourceBuffer, setSourceBuffer] = useState<AudioBuffer | null>(null);
  const [editBuffer, setEditBuffer] = useState<AudioBuffer | null>(null);
  const [fileName, setFileName] = useState('');
  const [duration, setDuration] = useState(0);

  /* ---- Playback ---- */
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const playStartTimeRef = useRef(0);
  const playOffsetRef = useRef(0);
  const rafRef = useRef<number>(0);

  /* ---- Waveform display ---- */
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [peaks, setPeaks] = useState<number[]>([]);
  const [zoom, setZoom] = useState(1);
  const [panOffset, setPanOffset] = useState(0);
  const [selection, setSelection] = useState<{ start: number; end: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragCounter = useRef(0);
  const dragModeRef = useRef<'select' | 'pan' | 'seek'>('select');
  const dragStartXRef = useRef(0);
  const dragStartOffsetRef = useRef(0);
  const dragStartSelectionRef = useRef<{ start: number; end: number } | null>(null);
  const didDragRef = useRef(false);

  /* ---- Effect parameters ---- */
  const [volume, setVolume] = useState(100);
  const [speed, setSpeed] = useState(100);
  const [pitch, setPitch] = useState(0);
  const [fadeIn, setFadeIn] = useState(0);
  const [fadeOut, setFadeOut] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isReversed, setIsReversed] = useState(false);
  const [isLoop, setIsLoop] = useState(false);
  const [noiseReduction, setNoiseReduction] = useState(0);
  const [doNormalize, setDoNormalize] = useState(false);
  const [eqLow, setEqLow] = useState(0);
  const [eqMid, setEqMid] = useState(0);
  const [eqHigh, setEqHigh] = useState(0);
  const [compThreshold, setCompThreshold] = useState(-24);
  const [compRatio, setCompRatio] = useState(4);
  const [compAttack, setCompAttack] = useState(3);
  const [compRelease, setCompRelease] = useState(50);
  const [reverbSize, setReverbSize] = useState(30);
  const [reverbDamp, setReverbDamp] = useState(50);
  const [reverbMix, setReverbMix] = useState(20);
  const [pan, setPan] = useState(0);

  /* ---- History ---- */
  const [history, setHistory] = useState<AudioBuffer[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);

  /* ---- Logs ---- */
  const [logs, setLogs] = useState<WorkflowLog[]>([]);
  const [isLogsOpen, setIsLogsOpen] = useState(true);
  const MAX_LOGS = 500;

  /* ---- Export / Results ---- */
  const [exports, setExports] = useState<ExportRecord[]>([]);

  const [exportFormat, setExportFormat] = useState<'wav-16' | 'wav-8' | 'wav-32' | 'webm' | 'ogg' | 'mp3' | 'mp4'>('wav-16');
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const MAX_EXPORTS = 50;

  /* ---- Error panel ---- */
  const [errors, setErrors] = useState<{ code: string; message: string; hint: string }[]>([]);

  /* ---- Refs for real-time nodes ---- */
  const gainNodeRef = useRef<GainNode | null>(null);
  const panNodeRef = useRef<StereoPannerNode | null>(null);
  const nodeChainRef = useRef<AudioNode[]>([]);

  /* ---- Mutable refs to avoid stale closures ---- */
  const speedRef = useRef(speed);
  const isLoopRef = useRef(isLoop);
  const editBufferRef = useRef(editBuffer);
  const exportsRef = useRef<ExportRecord[]>([]);
  const reversedBufferRef = useRef<AudioBuffer | null>(null);
  const importTimeoutRef = useRef<number | null>(null);
  const exportTimeoutRef = useRef<number | null>(null);
  const isImportingRef = useRef(false);
  const isExportingRef = useRef(false);
  const isMountedRef = useRef(true);

  /* ---- Sync mutable refs ---- */
  useEffect(() => { speedRef.current = speed; }, [speed]);
  useEffect(() => { isLoopRef.current = isLoop; }, [isLoop]);
  useEffect(() => { editBufferRef.current = editBuffer; }, [editBuffer]);
  useEffect(() => { exportsRef.current = exports; }, [exports]);
  useEffect(() => {
    reversedBufferRef.current = isReversed && editBuffer ? applyReverse(editBuffer) : null;
  }, [editBuffer, isReversed]);

  /* ---- SFX throttle ---- */
  const sliderThrottleRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const playSliderSound = useCallback(() => {
    if (sliderThrottleRef.current) return;
    playSound('sliderChange');
    sliderThrottleRef.current = window.setTimeout(() => { sliderThrottleRef.current = null; }, 50);
  }, []);

  useEffect(() => {
    return () => {
      if (sliderThrottleRef.current) window.clearTimeout(sliderThrottleRef.current);
    };
  }, []);

  /* ---- Dirty state guard ---- */
  const isDirty = editBuffer !== null || exports.length > 0 || logs.length > 0;
  useBeforeUnloadGuard(isDirty);

  /* ---- Drag & drop ---- */
  const [isDragOver, setIsDragOver] = useState(false);

  /* ================================================================== */
  /*  Lifecycle & Cleanup                                                */
  /* ================================================================== */
  /* ---- Redraw waveform on resize ---- */
  useEffect(() => {
    function onResize() {
      if (editBuffer && canvasRef.current) {
        const w = canvasRef.current.clientWidth || 800;
        setPeaks(generateWaveformData(editBuffer, w));
      }
    }
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [editBuffer]);

  /* ---- Clamp panOffset when zoom changes ---- */
  useEffect(() => {
    if (duration > 0) {
      setPanOffset((prev) => Math.max(0, Math.min(duration - duration / zoom, prev)));
    }
  }, [zoom, duration]);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      // Stop playback first, then close context
      stopPlayback();
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close().catch(() => {});
        audioCtxRef.current = null;
      }
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (importTimeoutRef.current) window.clearTimeout(importTimeoutRef.current);
      if (exportTimeoutRef.current) window.clearTimeout(exportTimeoutRef.current);
      if (sliderThrottleRef.current) window.clearTimeout(sliderThrottleRef.current);
      // Revoke all export URLs
      exportsRef.current.forEach((rec) => URL.revokeObjectURL(rec.url));
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ================================================================== */
  /*  Logging                                                            */
  /* ================================================================== */
  const addLog = useCallback((level: LogLevel, text: string) => {
    setLogs((current) => {
      const next = [...current, { time: timestamp(), level, text }];
      if (next.length > MAX_LOGS) next.splice(0, next.length - MAX_LOGS);
      return next;
    });
  }, []);

  const clearLogs = useCallback(() => setLogs([]), []);

  const logsText = logs.map((l) => `[${l.time}] ${l.level.toUpperCase()}: ${l.text}`).join('\n');

  /* ================================================================== */
  /*  Playback                                                           */
  /* ================================================================== */
  const stopPlayback = useCallback(() => {
    if (sourceRef.current) {
      try { sourceRef.current.stop(); } catch { /* already stopped */ }
      try { sourceRef.current.disconnect(); } catch { /* ignore */ }
      sourceRef.current = null;
    }
    nodeChainRef.current.forEach((n) => { try { n.disconnect(); } catch {} });
    nodeChainRef.current = [];
    gainNodeRef.current = null;
    panNodeRef.current = null;
    // NOTE: Do NOT close the AudioContext here — reuse it on next play.
    // The unmount effect will close it when the component unmounts.
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = 0;
    setIsPlaying(false);
  }, []);

  /* ================================================================== */
  /*  Audio import                                                       */
  /* ================================================================== */
  const handleImport = useCallback(
    async (file: File) => {
      if (isImportingRef.current) return;
      isImportingRef.current = true;
      stopPlayback();
      if (importTimeoutRef.current) window.clearTimeout(importTimeoutRef.current);
      try {
        setIsImporting(true);
        setImportProgress(10);
        playSound('uploadStart');
        addLog('info', `Importing: ${file.name} (${formatBytes(file.size)})`);

        let ctx = audioCtxRef.current;
        if (!ctx || ctx.state === 'closed') {
          ctx = new AudioContext();
          audioCtxRef.current = ctx;
        }
        setImportProgress(30);
        const arrayBuffer = await file.arrayBuffer();
        setImportProgress(60);
        const decoded = await ctx.decodeAudioData(arrayBuffer);
        setImportProgress(85);
        setSourceBuffer(decoded);
        setEditBuffer(decoded);
        setFileName(file.name);
        setDuration(decoded.duration);
        setHistory([decoded]);
        setHistoryIdx(0);
        setSelection(null);
        setCurrentTime(0);
        setErrors([]);
        setImportProgress(100);
        playSound('uploadComplete');
        addLog('success', `Import complete: ${decoded.numberOfChannels}ch, ${decoded.sampleRate}Hz, ${formatTime(decoded.duration)}`);

        const canvas = canvasRef.current;
        if (canvas) {
          const w = canvas.clientWidth || 800;
          setPeaks(generateWaveformData(decoded, w));
        }
        importTimeoutRef.current = window.setTimeout(() => { if (isMountedRef.current) setIsImporting(false); }, 400);
      } catch (err) {
        if (!isMountedRef.current) return;
        setIsImporting(false);
        setImportProgress(0);
        const msg = String(err);
        setErrors([{ code: 'IMPORT_FAILED', message: 'Failed to decode audio file', hint: msg }]);
        addLog('error', `Import failed: ${msg}`);
        playSound('error');
      } finally {
        isImportingRef.current = false;
      }
    },
    [addLog, stopPlayback]
  );

  const startPlayback = useCallback(
    (offset: number) => {
      if (!editBuffer) return;
      offset = Math.max(0, Math.min(offset, editBuffer.duration));
      stopPlayback();

      // Create or re-create context if needed
      let ctx = audioCtxRef.current;
      if (!ctx || ctx.state === 'closed') {
        ctx = new AudioContext();
        audioCtxRef.current = ctx;
      }

      // Resume context if suspended (browser autoplay policy)
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }

      const source = ctx.createBufferSource();
      source.buffer = reversedBufferRef.current || editBuffer;
      source.playbackRate.value = speed / 100;
      source.detune.value = pitch;
      source.loop = isLoop;
      if (isLoop && selection) {
        source.loopStart = selection.start;
        source.loopEnd = selection.end;
      }

      // EQ chain
      const eqLowNode = ctx.createBiquadFilter();
      eqLowNode.type = 'lowshelf';
      eqLowNode.frequency.value = 200;
      eqLowNode.gain.value = eqLow;

      const eqMidNode = ctx.createBiquadFilter();
      eqMidNode.type = 'peaking';
      eqMidNode.frequency.value = 1000;
      eqMidNode.gain.value = eqMid;

      const eqHighNode = ctx.createBiquadFilter();
      eqHighNode.type = 'highshelf';
      eqHighNode.frequency.value = 5000;
      eqHighNode.gain.value = eqHigh;

      // Compressor
      const compNode = ctx.createDynamicsCompressor();
      compNode.threshold.value = compThreshold;
      compNode.ratio.value = compRatio;
      compNode.attack.value = compAttack / 1000;
      compNode.release.value = compRelease / 1000;

      // Reverb
      const convolver = ctx.createConvolver();
      if (reverbSize > 0) {
        const sr = ctx.sampleRate;
        const dur = 0.5 + (reverbSize / 100) * 3.5;
        const len = Math.floor(sr * dur);
        const impulse = ctx.createBuffer(2, len, sr);
        for (let ch = 0; ch < 2; ch++) {
          const data = impulse.getChannelData(ch);
          for (let i = 0; i < len; i++) {
            const decay = Math.pow(1 - i / len, 1 + (reverbDamp / 100) * 3);
            data[i] = (Math.random() * 2 - 1) * decay;
          }
        }
        convolver.buffer = impulse;
      }

      const dryGain = ctx.createGain();
      dryGain.gain.value = 1 - (reverbMix / 100);

      const wetGain = ctx.createGain();
      wetGain.gain.value = reverbMix / 100;

      // Master gain & pan
      const gain = ctx.createGain();
      gain.gain.value = isMuted ? 0 : volume / 100;
      gainNodeRef.current = gain;

      const panner = ctx.createStereoPanner();
      panner.pan.value = Math.max(-1, Math.min(1, pan / 100));
      panNodeRef.current = panner;

      // Connect chain
      source.connect(eqLowNode).connect(eqMidNode).connect(eqHighNode).connect(compNode);
      compNode.connect(dryGain).connect(gain);
      compNode.connect(convolver).connect(wetGain).connect(gain);
      gain.connect(panner).connect(ctx.destination);

      nodeChainRef.current = [source, eqLowNode, eqMidNode, eqHighNode, compNode, dryGain, convolver, wetGain, gain, panner];

      source.start(0, offset);
      sourceRef.current = source;
      playStartTimeRef.current = ctx.currentTime;
      playOffsetRef.current = offset;
      setIsPlaying(true);

      const tick = () => {
        if (!audioCtxRef.current || !sourceRef.current) return;
        const elapsed = audioCtxRef.current.currentTime - playStartTimeRef.current;
        const t = playOffsetRef.current + elapsed * (speedRef.current / 100);
        const buffer = editBufferRef.current;
        if (buffer && t >= buffer.duration && !isLoopRef.current) {
          stopPlayback();
          setCurrentTime(buffer.duration);
          return;
        }
        setCurrentTime(Math.min(t, buffer ? buffer.duration : 0));
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);

      source.onended = () => {
        stopPlayback();
        if (!isLoopRef.current) {
          addLog('debug', 'Playback finished');
        }
      };
    },
    [editBuffer, speed, pitch, isLoop, selection, volume, isMuted, pan, stopPlayback, addLog, eqLow, eqMid, eqHigh, compThreshold, compRatio, compAttack, compRelease, reverbSize, reverbDamp, reverbMix, isReversed]
  );

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      stopPlayback();
      playOffsetRef.current = currentTime;
    } else {
      startPlayback(currentTime);
    }
  }, [isPlaying, currentTime, startPlayback, stopPlayback]);

  /* ---- Real-time parameter updates ---- */
  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (panNodeRef.current) {
      panNodeRef.current.pan.value = Math.max(-1, Math.min(1, pan / 100));
    }
  }, [pan]);

  /* ================================================================== */
  /*  Effects processing                                                 */
  /* ================================================================== */
  const MAX_HISTORY = 50;
  const pushHistory = useCallback(
    (buffer: AudioBuffer) => {
      const newHistory = history.slice(0, historyIdx + 1);
      newHistory.push(buffer);
      if (newHistory.length > MAX_HISTORY) newHistory.shift();
      setHistory(newHistory);
      setHistoryIdx(newHistory.length - 1);
      setEditBuffer(buffer);
      setDuration(buffer.duration);
      const canvas = canvasRef.current;
      if (canvas) {
        const w = canvas.clientWidth || 800;
        setPeaks(generateWaveformData(buffer, w));
      }
    },
    [history, historyIdx]
  );

  const applyEdit = useCallback(
    (name: string) => {
      if (!editBuffer) return;
      stopPlayback();
      let result = editBuffer;

      switch (name) {
        case 'trim': {
          if (!selection) return;
          if (selection.start >= selection.end || selection.start >= editBuffer.duration) {
            addLog('info', 'Invalid selection for trim');
            return;
          }
          result = trimAudioBuffer(editBuffer, selection.start, Math.min(selection.end, editBuffer.duration));
          setSelection(null);
          setCurrentTime(0);
          addLog('success', `Trimmed to ${formatTime(result.duration)} (${formatTime(selection.start)}–${formatTime(Math.min(selection.end, editBuffer.duration))})`);
          playSound('success');
          break;
        }
        case 'split': {
          if (!selection) return;
          const splitTime = Math.max(0, Math.min(selection.start, editBuffer.duration));
          const [left, right] = splitAt(editBuffer, splitTime);
          // Concatenate left + right (split is effectively a marker, keeping both parts)
          const len = left.length + right.length;
          const merged = new AudioBuffer({ numberOfChannels: editBuffer.numberOfChannels, length: len, sampleRate: editBuffer.sampleRate });
          for (let ch = 0; ch < editBuffer.numberOfChannels; ch++) {
            merged.getChannelData(ch).set(left.getChannelData(ch), 0);
            merged.getChannelData(ch).set(right.getChannelData(ch), left.length);
          }
          result = merged;
          setSelection(null);
          setCurrentTime(splitTime);
          addLog('success', `Split at ${formatTime(splitTime)}`);
          playSound('success');
          break;
        }
        case 'delete': {
          if (!selection) return;
          const s = Math.max(0, selection.start);
          const e = Math.min(selection.end, editBuffer.duration);
          if (s >= e) { addLog('info', 'Invalid selection for delete'); return; }
          if (s <= 0 && e >= editBuffer.duration) {
            addLog('info', 'Cannot delete entire audio');
            return;
          }
          const [left] = splitAt(editBuffer, s);
          const [, right] = splitAt(editBuffer, e);
          const len = left.length + right.length;
          const merged = new AudioBuffer({ numberOfChannels: editBuffer.numberOfChannels, length: len, sampleRate: editBuffer.sampleRate });
          for (let ch = 0; ch < editBuffer.numberOfChannels; ch++) {
            merged.getChannelData(ch).set(left.getChannelData(ch), 0);
            merged.getChannelData(ch).set(right.getChannelData(ch), left.length);
          }
          result = merged;
          setSelection(null);
          setCurrentTime(s);
          addLog('success', `Deleted region ${formatTime(s)}–${formatTime(e)}`);
          playSound('deleteSound');
          break;
        }
        case 'duplicate': {
          if (!selection) return;
          const s = Math.max(0, selection.start);
          const e = Math.min(selection.end, editBuffer.duration);
          if (s >= e) { addLog('info', 'Invalid selection for duplicate'); return; }
          const selected = trimAudioBuffer(editBuffer, s, e);
          const len = editBuffer.length + selected.length;
          const merged = new AudioBuffer({ numberOfChannels: editBuffer.numberOfChannels, length: len, sampleRate: editBuffer.sampleRate });
          for (let ch = 0; ch < editBuffer.numberOfChannels; ch++) {
            merged.getChannelData(ch).set(editBuffer.getChannelData(ch), 0);
            merged.getChannelData(ch).set(selected.getChannelData(ch), editBuffer.length);
          }
          result = merged;
          setSelection(null);
          addLog('success', `Duplicated region ${formatTime(s)}–${formatTime(e)}`);
          playSound('success');
          break;
        }
        case 'reverse': {
          result = applyReverse(editBuffer);
          setIsReversed(false);
          addLog('success', 'Reversed audio');
          playSound('success');
          break;
        }
        case 'fade': {
          result = applyFade(editBuffer, fadeIn, fadeOut);
          setFadeIn(0);
          setFadeOut(0);
          addLog('success', `Applied fade: in=${fadeIn}s, out=${fadeOut}s`);
          playSound('success');
          break;
        }
        case 'normalize': {
          result = normalizeBuffer(editBuffer);
          addLog('success', 'Normalized peak levels');
          playSound('success');
          break;
        }
        case 'mono': {
          result = mixToMono(editBuffer);
          addLog('success', `Mixed to mono (${result.numberOfChannels}ch)`);
          playSound('success');
          break;
        }
        default:
          return;
      }

      if (result !== editBuffer) {
        pushHistory(result);
      }
    },
    [editBuffer, selection, fadeIn, fadeOut, pushHistory, addLog, stopPlayback]
  );

  const undo = useCallback(() => {
    if (historyIdx > 0) {
      stopPlayback();
      const idx = historyIdx - 1;
      setHistoryIdx(idx);
      setEditBuffer(history[idx]);
      setDuration(history[idx].duration);
      const canvas = canvasRef.current;
      if (canvas) {
        const w = canvas.clientWidth || 800;
        setPeaks(generateWaveformData(history[idx], w));
      }
      addLog('info', `Undo: restored step ${idx}`);
      playSound('undo');
    }
  }, [history, historyIdx, addLog, stopPlayback]);

  const redo = useCallback(() => {
    if (historyIdx < history.length - 1) {
      stopPlayback();
      const idx = historyIdx + 1;
      setHistoryIdx(idx);
      setEditBuffer(history[idx]);
      setDuration(history[idx].duration);
      const canvas = canvasRef.current;
      if (canvas) {
        const w = canvas.clientWidth || 800;
        setPeaks(generateWaveformData(history[idx], w));
      }
      addLog('info', `Redo: restored step ${idx}`);
      playSound('redo');
    }
  }, [history, historyIdx, addLog, stopPlayback]);

  const resetEffects = useCallback(() => {
    setVolume(100);
    setSpeed(100);
    setPitch(0);
    setFadeIn(0);
    setFadeOut(0);
    setIsMuted(false);
    setIsReversed(false);
    setIsLoop(false);
    setNoiseReduction(0);
    setDoNormalize(false);
    setEqLow(0);
    setEqMid(0);
    setEqHigh(0);
    setCompThreshold(-24);
    setCompRatio(4);
    setCompAttack(3);
    setCompRelease(50);
    setReverbSize(30);
    setReverbDamp(50);
    setReverbMix(20);
    setPan(0);
    addLog('info', 'All effect parameters reset to defaults');
    playSound('resetSound');
  }, [addLog]);

  const resetAll = useCallback(() => {
    stopPlayback();
    setSourceBuffer(null);
    setEditBuffer(null);
    setFileName('');
    setDuration(0);
    setIsPlaying(false);
    setCurrentTime(0);
    setZoom(1);
    setPanOffset(0);
    setSelection(null);
    setVolume(100);
    setPan(0);
    setSpeed(100);
    setPitch(0);
    setFadeIn(0);
    setFadeOut(0);
    setEqLow(0);
    setEqMid(0);
    setEqHigh(0);
    setCompThreshold(-24);
    setCompRatio(4);
    setCompAttack(3);
    setCompRelease(50);
    setReverbSize(30);
    setReverbDamp(50);
    setReverbMix(20);
    setNoiseReduction(0);
    setIsReversed(false);
    setDoNormalize(false);
    setIsMuted(false);
    setIsLoop(false);
    setHistory([]);
    setHistoryIdx(-1);
    setLogs([]);
    setExports((prev) => { prev.forEach((rec) => URL.revokeObjectURL(rec.url)); return []; });
    setExportFormat('wav-16');
    setIsExporting(false);
    isExportingRef.current = false;
    setExportProgress(0);

    setIsLogsOpen(true);
    setErrors([]);
    gainNodeRef.current = null;
    panNodeRef.current = null;
    addLog('info', 'Workspace reset');
    playSound('resetSound');
  }, [addLog, stopPlayback]);

  /* ================================================================== */
  /*  Export                                                             */
  /* ================================================================== */
  const supportedFormats = useMemo(() => {
    const wav = [
      { key: 'wav-16', label: 'WAV 16-bit PCM' },
      { key: 'wav-8', label: 'WAV 8-bit PCM' },
      { key: 'wav-32', label: 'WAV 32-bit Float' },
    ];
    const compressed = getSupportedMimeTypes().map((t) => {
      if (t.includes('webm')) return { key: 'webm', label: 'WebM / Opus' };
      if (t.includes('ogg')) return { key: 'ogg', label: 'OGG / Opus' };
      if (t.includes('mp3') || t.includes('mpeg')) return { key: 'mp3', label: 'MP3' };
      if (t.includes('mp4')) return { key: 'mp4', label: 'MP4 / AAC' };
      return { key: t, label: t };
    });
    const seen = new Set<string>();
    const all = [...wav];
    for (const c of compressed) {
      if (!seen.has(c.key)) {
        seen.add(c.key);
        all.push(c);
      }
    }
    return all;
  }, []);

  const handleExport = useCallback(
    async () => {
      if (isExportingRef.current) return;
      if (!editBuffer) {
        addLog('info', 'Cannot export: no audio loaded');
        playSound('error');
        return;
      }
      isExportingRef.current = true;
      setIsExporting(true);
      setExportProgress(10);
      addLog('info', `Starting export: ${exportFormat.toUpperCase()}`);
      playSound('exportStart');

      try {
        let output = editBuffer;
        if (noiseReduction > 0) {
          output = applyNoiseReduction(output, noiseReduction);
          setExportProgress(25);
        }
        if (fadeIn > 0 || fadeOut > 0) {
          output = applyFade(output, fadeIn, fadeOut);
          setExportProgress(40);
        }
        if (isReversed) {
          output = applyReverse(output);
          setExportProgress(55);
        }
        if (doNormalize) {
          output = normalizeBuffer(output);
          setExportProgress(70);
        }

        let blob: Blob;
        let ext: string;

        if (exportFormat === 'wav-16') {
          blob = audioBufferToWav(output, 16);
          ext = 'wav';
        } else if (exportFormat === 'wav-8') {
          blob = audioBufferToWav(output, 8);
          ext = 'wav';
        } else if (exportFormat === 'wav-32') {
          blob = audioBufferToWav(output, 32);
          ext = 'wav';
        } else {
          const mimeMap: Record<string, string> = {
            webm: 'audio/webm;codecs=opus',
            ogg: 'audio/ogg;codecs=opus',
            mp3: 'audio/mp3',
            mp4: 'audio/mp4',
          };
          const mime = mimeMap[exportFormat] || 'audio/webm';
          blob = await exportViaMediaRecorder(output, mime);
          ext = exportFormat;
        }

        setExportProgress(100);
        const url = URL.createObjectURL(blob);
        const record: ExportRecord = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          fileName: `${fileName.replace(/\.[^.]+$/, '')}_edited.${ext}`,
          format: exportFormat.toUpperCase(),
          blob,
          url,
          duration: output.duration,
          size: blob.size,
          createdAt: timestamp(),
        };
        setExports((prev) => {
          const next = [record, ...prev];
          if (next.length > MAX_EXPORTS) {
            const removed = next.splice(MAX_EXPORTS);
            removed.forEach((r) => URL.revokeObjectURL(r.url));
          }
          return next;
        });
        addLog('success', `Export complete: ${record.fileName} (${formatBytes(record.size)})`);
        playSound('workflowComplete');

        const a = document.createElement('a');
        a.href = url;
        a.download = record.fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } catch (err) {
        if (!isMountedRef.current) return;
        const msg = String(err);
        setErrors([{ code: 'EXPORT_FAILED', message: 'Export failed', hint: msg }]);
        addLog('error', `Export failed: ${msg}`);
        playSound('workflowFail');
      } finally {
        isExportingRef.current = false;
        if (isMountedRef.current) {
          setIsExporting(false);
          if (exportTimeoutRef.current) window.clearTimeout(exportTimeoutRef.current);
          exportTimeoutRef.current = window.setTimeout(() => { if (isMountedRef.current) setExportProgress(0); }, 600);
        }
      }
    },
    [editBuffer, exportFormat, fileName, fadeIn, fadeOut, isReversed, doNormalize, noiseReduction, addLog]
  );

  const removeExport = useCallback((id: string) => {
    setExports((prev) => {
      const rec = prev.find((p) => p.id === id);
      if (rec) URL.revokeObjectURL(rec.url);
      return prev.filter((p) => p.id !== id);
    });
    playSound('deleteSound');
  }, []);

  /* ================================================================== */
  /*  Waveform canvas drawing                                            */
  /* ================================================================== */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || peaks.length === 0 || duration <= 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;
    const half = h / 2;

    ctx.clearRect(0, 0, w, h);

    // Background grid
    ctx.strokeStyle = 'rgba(148,163,184,0.1)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let y = 0; y < h; y += 20) { ctx.moveTo(0, y); ctx.lineTo(w, y); }
    ctx.stroke();

    // Center line
    ctx.strokeStyle = 'rgba(148,163,184,0.3)';
    ctx.beginPath();
    ctx.moveTo(0, half);
    ctx.lineTo(w, half);
    ctx.stroke();

    // Waveform
    const totalVisible = Math.floor(peaks.length / zoom);
    const startIdx = Math.max(0, Math.floor((panOffset / duration) * peaks.length));
    const endIdx = Math.min(startIdx + totalVisible, peaks.length);
    const samplesPerPixel = Math.max(1, (endIdx - startIdx) / w);

    ctx.strokeStyle = '#4f9df7';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let x = 0; x < w; x++) {
      const sampleStart = Math.floor(startIdx + x * samplesPerPixel);
      const sampleEnd = Math.min(Math.floor(startIdx + (x + 1) * samplesPerPixel), peaks.length);
      let max = 0;
      for (let i = sampleStart; i < sampleEnd; i++) max = Math.max(max, peaks[i] ?? 0);
      ctx.moveTo(x, half - max * half * 0.9);
      ctx.lineTo(x, half + max * half * 0.9);
    }
    ctx.stroke();

    // Selection overlay
    if (selection && duration > 0) {
      const selStartX = ((selection.start / duration) * peaks.length - startIdx) / samplesPerPixel;
      const selEndX = ((selection.end / duration) * peaks.length - startIdx) / samplesPerPixel;
      if (selEndX > 0 && selStartX < w) {
        ctx.fillStyle = 'rgba(124,92,255,0.25)';
        ctx.fillRect(Math.max(0, selStartX), 0, Math.max(0, Math.min(w, selEndX) - Math.max(0, selStartX)), h);
        ctx.strokeStyle = '#4f9df7';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(Math.max(0, selStartX), 0);
        ctx.lineTo(Math.max(0, selStartX), h);
        ctx.moveTo(Math.min(w, selEndX), 0);
        ctx.lineTo(Math.min(w, selEndX), h);
        ctx.stroke();
      }
    }

    // Playhead
    if (duration > 0) {
      const headX = ((currentTime / duration) * peaks.length - startIdx) / samplesPerPixel;
      if (headX >= 0 && headX <= w) {
        ctx.strokeStyle = '#f45a5a';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(headX, 0);
        ctx.lineTo(headX, h);
        ctx.stroke();
      }
    }
  }, [peaks, zoom, panOffset, selection, currentTime, duration]);

  /* ================================================================== */
  /*  Canvas interactions                                                */
  /* ================================================================== */
  const getTimeFromX = useCallback(
    (clientX: number): number => {
      const canvas = canvasRef.current;
      if (!canvas || duration <= 0) return 0;
      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const ratio = x / rect.width;
      const totalVisible = Math.floor(peaks.length / zoom);
      const startIdx = Math.max(0, Math.floor((panOffset / duration) * peaks.length));
      const sampleIdx = startIdx + ratio * totalVisible;
      return Math.max(0, Math.min(duration, (sampleIdx / peaks.length) * duration));
    },
    [duration, peaks.length, zoom, panOffset]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!editBuffer) return;
      if (e.shiftKey) {
        dragModeRef.current = 'pan';
        dragStartXRef.current = e.clientX;
        dragStartOffsetRef.current = panOffset;
      } else {
        dragModeRef.current = 'select';
        const t = getTimeFromX(e.clientX);
        dragStartSelectionRef.current = { start: t, end: t };
        setSelection({ start: t, end: t });
      }
      didDragRef.current = false;
      setIsDragging(true);
    },
    [editBuffer, getTimeFromX, panOffset]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return;
      if (dragModeRef.current === 'pan') {
        const dx = e.clientX - dragStartXRef.current;
        const canvas = canvasRef.current;
        if (!canvas || duration <= 0) return;
        const ratio = dx / canvas.getBoundingClientRect().width;
        const newOffset = dragStartOffsetRef.current - ratio * duration;
        setPanOffset(Math.max(0, Math.min(duration - duration / zoom, newOffset)));
      } else if (dragModeRef.current === 'select') {
        didDragRef.current = true;
        const t = getTimeFromX(e.clientX);
        const start = dragStartSelectionRef.current?.start ?? t;
        setSelection({ start: Math.min(start, t), end: Math.max(start, t) });
      }
    },
    [isDragging, getTimeFromX, duration, zoom]
  );

  const handleMouseUp = useCallback(() => {
    if (dragModeRef.current === 'pan') didDragRef.current = true;
    setIsDragging(false);
    dragModeRef.current = 'select';
  }, []);

  const handleCanvasClick = useCallback(
    (e: React.MouseEvent) => {
      if (isDragging) return;
      if (didDragRef.current) return;
      const t = getTimeFromX(e.clientX);
      setCurrentTime(t);
      if (isPlaying) startPlayback(t);
    },
    [isDragging, getTimeFromX, isPlaying, startPlayback]
  );

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      if (e.ctrlKey || e.metaKey) {
        const newZoom = Math.max(1, Math.min(50, zoom + (e.deltaY > 0 ? 1 : -1) * Math.max(1, zoom * 0.1)));
        setZoom(newZoom);
      } else {
        const canvas = canvasRef.current;
        if (!canvas || duration <= 0) return;
        const rectWidth = canvas.getBoundingClientRect().width;
        if (!rectWidth) return;
        const ratio = e.deltaX / rectWidth;
        const newOffset = panOffset + ratio * duration;
        setPanOffset(Math.max(0, Math.min(duration - duration / zoom, newOffset)));
      }
    },
    [zoom, panOffset, duration]
  );

  /* ---- Drag & drop handlers ---- */
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current += 1;
    const types = Array.from(e.dataTransfer.types);
    if (types.includes('Files')) setIsDragOver(true);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current -= 1;
    if (dragCounter.current <= 0) {
      dragCounter.current = 0;
      setIsDragOver(false);
    }
  }, []);

  const isAudioFile = useCallback((file: File | undefined) => {
    if (!file) return false;
    if (file.type.startsWith('audio/') || file.type === 'application/octet-stream') return true;
    const ext = file.name.split('.').pop()?.toLowerCase();
    return ['mp3', 'wav', 'ogg', 'flac', 'm4a', 'aac', 'webm'].includes(ext || '');
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current = 0;
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && isAudioFile(file)) {
      handleImport(file);
    } else if (file) {
      addLog('info', 'Dropped file is not an audio file');
      playSound('error');
    }
  }, [handleImport, addLog, isAudioFile]);

  /* ================================================================== */
  /*  Keyboard shortcuts                                                 */
  /* ================================================================== */
  const togglePlayRef = useRef(togglePlay);
  const undoRef = useRef(undo);
  const redoRef = useRef(redo);
  useEffect(() => { togglePlayRef.current = togglePlay; }, [togglePlay]);
  useEffect(() => { undoRef.current = undo; }, [undo]);
  useEffect(() => { redoRef.current = redo; }, [redo]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.repeat) return;
      // Ignore if user is typing in an input/textarea/select
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select' || (e.target as HTMLElement)?.isContentEditable) {
        return;
      }
      if (e.key === ' ') {
        e.preventDefault();
        togglePlayRef.current();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) redoRef.current(); else undoRef.current();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  /* ================================================================== */
  /*  Render                                                             */
  /* ================================================================== */
  return (
    <main className="feature-shell tool-page-shell">
      <header className="feature-header fade-up delay-1">
        <div className="feature-header-meta">
          <button className="secondary-button small-button back-link" type="button" data-sfx-handled onClick={() => { playSound('back'); onBack(); }}>
            ← {backHome}
          </button>
        </div>
        <div className="tool-header-actions">
          <button className="secondary-button small-button" type="button" data-sfx-handled onClick={() => { playSound('buttonClick'); onOpenDocs?.('audio-editor', 'overview'); }}>{labels.help}</button>
          <button className="secondary-button small-button" type="button" data-sfx-handled onClick={() => { playSound('buttonClick'); onOpenDocs?.('audio-editor', 'buttons'); }}>{labels.tutorial}</button>
          <button className="secondary-button small-button" type="button" data-sfx-handled onClick={() => { playSound('pageSwitch'); onSwitchTool?.('audio-converter'); }}>{labels.audioConverter}</button>
          <button className="secondary-button small-button" type="button" data-sfx-handled onClick={() => { playSound('settingsOpen'); onOpenSettings(); }}>{openSettings}</button>
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
            <button className="secondary-button small-button" type="button" disabled={isImporting || isExporting} data-sfx-handled onClick={() => { resetAll(); }}>{labels.resetAll}</button>
          </div>
        </div>

        <div className="tool-grid transfer-grid">
          <div className="tool-column">
            {/* Import area */}
            <section className="tool-card">
              <div className="tool-card-header">
                <div>
                  <span className="card-caption">{labels.source}</span>
                  <h3>{editBuffer ? fileName : labels.importAudio}</h3>
                </div>
                {editBuffer && (
                  <button className="secondary-button small-button" type="button" disabled={isImporting} data-sfx-handled onClick={() => { playSound('buttonClick'); fileInputRef.current?.click(); }}>
                    {labels.replace}
                  </button>
                )}
              </div>
              <div className={`preview-surface ${!editBuffer ? 'compact' : ''}`}>
                {!editBuffer ? (
                  <div
                    className="upload-zone"
                    onDragEnter={handleDragEnter}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    {isImporting ? (
                      <div className="preview-empty">
                        <span className="status-badge running">{labels.decoding} {importProgress}%</span>
                        <div className="progress-track centered" role="progressbar" aria-valuenow={importProgress} aria-valuemin={0} aria-valuemax={100} aria-label="Import progress">
                          <div className="progress-fill" style={{ width: `${importProgress}%` }} />
                        </div>
                      </div>
                    ) : (
                      <>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="audio/*,.mp3,.wav,.ogg,.flac,.m4a,.aac,.webm"
                          id="audio-import"
                          hidden
                          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImport(f); e.target.value = ''; }}
                        />
                        <label
                          htmlFor="audio-import"
                          className="upload-dropzone"
                          data-sfx-handled
                          onClick={() => playSound('buttonClick')}
                          onKeyDown={(e) => { if (e.repeat) return; if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); playSound('buttonClick'); fileInputRef.current?.click(); } }}
                          tabIndex={0}
                          role="button"
                          aria-label="Import audio file"
                          style={{
                            border: isDragOver ? '2px dashed var(--accent)' : undefined,
                            background: isDragOver ? 'rgba(var(--accent-rgb), 0.08)' : undefined,
                            boxShadow: isDragOver ? '0 0 0 4px rgba(var(--accent-rgb), 0.10)' : undefined,
                          }}
                        >
                          <h3>{labels.importAudio}</h3>
                          <p>{labels.dropHint}</p>
                        </label>
                      </>
                    )}
                  </div>
                ) : (
                  <p className="tiny-copy">
                    {formatTime(duration)} · {editBuffer.numberOfChannels}ch, {editBuffer.sampleRate}Hz
                  </p>
                )}
              </div>
            </section>

            {editBuffer && (
              <>
                {/* Waveform */}
                <section className="tool-card">
                  <div className="tool-card-header">
                    <div>
                      <span className="card-caption">{labels.waveform}</span>
                      <h3>{labels.editor}</h3>
                    </div>
                  </div>
                  <div className="preview-surface compact">
                    <canvas
                      ref={canvasRef}
                      role="img"
                      aria-label="Audio waveform editor. Click to set playhead, drag to select a region, shift-drag to pan, scroll or ctrl-scroll to zoom."
                      tabIndex={0}
                      style={{ cursor: isDragging ? 'grabbing' : 'crosshair' }}
                      onMouseDown={handleMouseDown}
                      onMouseMove={handleMouseMove}
                      onMouseUp={handleMouseUp}
                      onMouseLeave={handleMouseUp}
                      onClick={handleCanvasClick}
                      onWheel={handleWheel}
                      onKeyDown={(e) => { if (e.key === ' ') e.preventDefault(); }}
                    />
                  </div>
                  <div className="progress-meta">
                    <span>{formatTime(currentTime)}</span>
                    <strong>{labels.zoom}: {zoom.toFixed(1)}x</strong>
                    <span>{formatTime(duration)}</span>
                  </div>
                  {selection && (
                    <p className="tiny-copy">
                      {labels.selection}: {formatTime(selection.start)} - {formatTime(selection.end)} ({formatTime(selection.end - selection.start)})
                    </p>
                  )}
                </section>

                {/* Edit Operations */}
                <section className="tool-card">
                  <div className="tool-card-header">
                    <div>
                      <span className="card-caption">{labels.edit}</span>
                      <h3>{labels.operations}</h3>
                    </div>
                  </div>
                  <div className="tool-card-section">
                    <div className="tool-actions-row">
                      <button className="secondary-button small-button" type="button" data-sfx-handled onClick={() => { playSound('buttonClick'); togglePlay(); }}>
                        {isPlaying ? labels.pause : labels.play}
                      </button>
                      <button className="secondary-button small-button" type="button" data-sfx-handled onClick={() => { playSound('buttonClick'); stopPlayback(); setCurrentTime(0); }}>
                        {labels.stop}
                      </button>
                    </div>
                    <div className="tool-card-divider" />
                    <div className="tool-actions-row">
                      <button className="secondary-button small-button" type="button" data-sfx-handled onClick={() => { undo(); }} disabled={historyIdx <= 0}>{labels.undo}</button>
                      <button className="secondary-button small-button" type="button" data-sfx-handled onClick={() => { redo(); }} disabled={historyIdx >= history.length - 1}>{labels.redo}</button>
                    </div>
                    <div className="tool-card-divider" />
                    <div className="tool-actions-row">
                      <button className="secondary-button small-button" type="button" data-sfx-handled onClick={() => { applyEdit('trim'); }} disabled={!selection}>{labels.trim}</button>
                      <button className="secondary-button small-button" type="button" data-sfx-handled onClick={() => { applyEdit('split'); }} disabled={!selection}>{labels.split}</button>
                      <button className="secondary-button small-button" type="button" data-sfx-handled onClick={() => { applyEdit('delete'); }} disabled={!selection}>{labels.delete}</button>
                      <button className="secondary-button small-button" type="button" data-sfx-handled onClick={() => { applyEdit('duplicate'); }} disabled={!selection}>{labels.duplicate}</button>
                    </div>
                    <div className="tool-card-divider" />
                    <div className="tool-actions-row">
                      <button className="secondary-button small-button" type="button" data-sfx-handled onClick={() => { applyEdit('reverse'); }}>{labels.reverse}</button>
                      <button className="secondary-button small-button" type="button" data-sfx-handled onClick={() => { applyEdit('fade'); }}>{labels.fade}</button>
                      <button className="secondary-button small-button" type="button" data-sfx-handled onClick={() => { applyEdit('normalize'); }}>{labels.normalize}</button>
                      <button className="secondary-button small-button" type="button" data-sfx-handled onClick={() => { applyEdit('mono'); }}>{labels.mono}</button>
                    </div>
                    <div className="tool-card-divider" />
                    <div className="tool-actions-row">
                      <button className="secondary-button small-button" type="button" data-sfx-handled onClick={() => { resetEffects(); }}>{labels.resetFx}</button>
                      <input type="file" accept="audio/*" hidden id="audio-reimport" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImport(f); e.target.value = ''; }} />
                      <label htmlFor="audio-reimport" className="secondary-button small-button" data-sfx-handled onClick={() => playSound('buttonClick')}>{labels.newFile}</label>
                    </div>
                  </div>
                </section>

                {/* Effects */}
                <section className="tool-card">
                  <div className="tool-card-header">
                    <div>
                      <span className="card-caption">{labels.effects}</span>
                      <h3>{labels.parameters}</h3>
                    </div>
                  </div>
                  <div className="form-grid two-column">
                    <ParamRow label={labels.volume} value={`${volume}%`}>
                      <input className="tool-range" type="range" min={0} max={200} data-sfx-handled value={volume} onChange={(e) => { playSliderSound(); setVolume(Number(e.target.value)); }} />
                    </ParamRow>
                    <ParamRow label={labels.panLR} value={`${pan > 0 ? '+' : ''}${pan}`}>
                      <input className="tool-range" type="range" min={-100} max={100} data-sfx-handled value={pan} onChange={(e) => { playSliderSound(); setPan(Number(e.target.value)); }} />
                    </ParamRow>
                    <ParamRow label={labels.speed} value={`${speed}%`}>
                      <input className="tool-range" type="range" min={25} max={400} data-sfx-handled value={speed} onChange={(e) => { playSliderSound(); setSpeed(Number(e.target.value)); }} />
                    </ParamRow>
                    <ParamRow label={labels.pitchCents} value={`${pitch > 0 ? '+' : ''}${pitch}`}>
                      <input className="tool-range" type="range" min={-1200} max={1200} step={10} data-sfx-handled value={pitch} onChange={(e) => { playSliderSound(); setPitch(Number(e.target.value)); }} />
                    </ParamRow>
                    <ParamRow label={labels.fadeIn} value={`${fadeIn}s`}>
                      <input className="tool-range" type="range" min={0} max={10} step={0.1} data-sfx-handled value={fadeIn} onChange={(e) => { playSliderSound(); setFadeIn(Number(e.target.value)); }} />
                    </ParamRow>
                    <ParamRow label={labels.fadeOut} value={`${fadeOut}s`}>
                      <input className="tool-range" type="range" min={0} max={10} step={0.1} data-sfx-handled value={fadeOut} onChange={(e) => { playSliderSound(); setFadeOut(Number(e.target.value)); }} />
                    </ParamRow>
                    <ParamRow label={labels.lowGain} value={`${eqLow > 0 ? '+' : ''}${eqLow}dB`}>
                      <input className="tool-range" type="range" min={-12} max={12} data-sfx-handled value={eqLow} onChange={(e) => { playSliderSound(); setEqLow(Number(e.target.value)); }} />
                    </ParamRow>
                    <ParamRow label={labels.midGain} value={`${eqMid > 0 ? '+' : ''}${eqMid}dB`}>
                      <input className="tool-range" type="range" min={-12} max={12} data-sfx-handled value={eqMid} onChange={(e) => { playSliderSound(); setEqMid(Number(e.target.value)); }} />
                    </ParamRow>
                    <ParamRow label={labels.highGain} value={`${eqHigh > 0 ? '+' : ''}${eqHigh}dB`}>
                      <input className="tool-range" type="range" min={-12} max={12} data-sfx-handled value={eqHigh} onChange={(e) => { playSliderSound(); setEqHigh(Number(e.target.value)); }} />
                    </ParamRow>
                    <ParamRow label={labels.threshold} value={`${compThreshold}dB`}>
                      <input className="tool-range" type="range" min={-60} max={0} data-sfx-handled value={compThreshold} onChange={(e) => { playSliderSound(); setCompThreshold(Number(e.target.value)); }} />
                    </ParamRow>
                    <ParamRow label={labels.ratio} value={`${compRatio}:1`}>
                      <input className="tool-range" type="range" min={1} max={20} data-sfx-handled value={compRatio} onChange={(e) => { playSliderSound(); setCompRatio(Number(e.target.value)); }} />
                    </ParamRow>
                    <ParamRow label={labels.attack} value={`${compAttack}ms`}>
                      <input className="tool-range" type="range" min={0} max={100} data-sfx-handled value={compAttack} onChange={(e) => { playSliderSound(); setCompAttack(Number(e.target.value)); }} />
                    </ParamRow>
                    <ParamRow label={labels.release} value={`${compRelease}ms`}>
                      <input className="tool-range" type="range" min={0} max={500} data-sfx-handled value={compRelease} onChange={(e) => { playSliderSound(); setCompRelease(Number(e.target.value)); }} />
                    </ParamRow>
                    <ParamRow label={labels.roomSize} value={`${reverbSize}%`}>
                      <input className="tool-range" type="range" min={0} max={100} data-sfx-handled value={reverbSize} onChange={(e) => { playSliderSound(); setReverbSize(Number(e.target.value)); }} />
                    </ParamRow>
                    <ParamRow label={labels.damping} value={`${reverbDamp}%`}>
                      <input className="tool-range" type="range" min={0} max={100} data-sfx-handled value={reverbDamp} onChange={(e) => { playSliderSound(); setReverbDamp(Number(e.target.value)); }} />
                    </ParamRow>
                    <ParamRow label={labels.wetDry} value={`${reverbMix}%`}>
                      <input className="tool-range" type="range" min={0} max={100} data-sfx-handled value={reverbMix} onChange={(e) => { playSliderSound(); setReverbMix(Number(e.target.value)); }} />
                    </ParamRow>
                    <ParamRow label={labels.noiseReduction} value={`${noiseReduction}%`}>
                      <input className="tool-range" type="range" min={0} max={100} data-sfx-handled value={noiseReduction} onChange={(e) => { playSliderSound(); setNoiseReduction(Number(e.target.value)); }} />
                    </ParamRow>
                  </div>
                  <div className="toggle-grid">
                    <button className={`toggle-chip ${isMuted ? 'active' : ''}`} type="button" aria-pressed={isMuted} data-sfx-handled onClick={() => { playSound(isMuted ? 'toggleOff' : 'toggleOn'); setIsMuted((v) => !v); }}>
                      <span className="toggle-chip-dot" /> {labels.mute}
                    </button>
                    <button className={`toggle-chip ${isReversed ? 'active' : ''}`} type="button" aria-pressed={isReversed} data-sfx-handled onClick={() => { playSound(isReversed ? 'toggleOff' : 'toggleOn'); setIsReversed((v) => !v); }}>
                      <span className="toggle-chip-dot" /> {labels.reverse}
                    </button>
                    <button className={`toggle-chip ${isLoop ? 'active' : ''}`} type="button" aria-pressed={isLoop} data-sfx-handled onClick={() => { playSound(isLoop ? 'toggleOff' : 'toggleOn'); setIsLoop((v) => !v); }}>
                      <span className="toggle-chip-dot" /> {labels.loop}
                    </button>
                    <button className={`toggle-chip ${doNormalize ? 'active' : ''}`} type="button" aria-pressed={doNormalize} data-sfx-handled onClick={() => { playSound(doNormalize ? 'toggleOff' : 'toggleOn'); setDoNormalize((v) => !v); }}>
                      <span className="toggle-chip-dot" /> {labels.normalize}
                    </button>
                  </div>
                </section>
              </>
            )}
          </div>

          <div className="tool-column side">
            {/* Export Settings & Records */}
            <section className="tool-card">
              <div className="tool-card-header">
                <div>
                  <span className="card-caption">{labels.export}</span>
                  <h3>{labels.exportSettings}</h3>
                </div>
              </div>
              <div className="tool-actions-row">
                <select
                  className="settings-input tool-select"
                  aria-label={labels.exportFormat}
                  data-sfx-handled
                  value={exportFormat}
                  onChange={(e) => { playSound('buttonClick'); setExportFormat(e.target.value as typeof exportFormat); }}
                >
                  {supportedFormats.map((f: { key: string; label: string }) => (
                    <option key={f.key} value={f.key}>{f.label}</option>
                  ))}
                </select>
                <button className="primary-button small-button" type="button" data-sfx-handled onClick={() => { handleExport(); }} disabled={isExporting}>
                  {isExporting ? `${labels.exporting.replace('…', '')} ${exportProgress}%…` : labels.export}
                </button>
                <span className={`status-badge ${isExporting ? 'running' : exportProgress >= 100 ? 'success' : 'idle'}`}>
                  {isExporting ? labels.exporting : exportProgress >= 100 ? labels.exportComplete : labels.ready}
                </span>
              </div>
              {(isExporting || exportProgress > 0) && (
                <div className="progress-track" role="progressbar" aria-valuenow={exportProgress} aria-valuemin={0} aria-valuemax={100} aria-label="Export progress">
                  <div className="progress-fill" style={{ width: `${exportProgress}%` }} />
                </div>
              )}
              <div className="tool-card-divider" />
              {exports.length === 0 ? (
                <p className="tiny-copy empty-state">{labels.noExportsYet}</p>
              ) : (
                <div className="result-grid">
                  {exports.map((rec) => (
                    <div key={rec.id} className="log-entry">
                      <div className="result-meta">
                        <strong>{rec.fileName}</strong>
                        <span className="tiny-copy mono">{rec.format} · {formatBytes(rec.size)}</span>
                      </div>
                      <audio key={rec.id} controls src={rec.url} className="tool-audio" aria-label={`Exported audio: ${rec.fileName}`} />
                      <div className="mini-action-row">
                        <button className="secondary-button small-button" type="button" data-sfx-handled onClick={() => { playSound('downloadSound'); const a = document.createElement('a'); a.href = rec.url; a.download = rec.fileName; document.body.appendChild(a); a.click(); document.body.removeChild(a); }}>{labels.download}</button>
                        <button className="secondary-button small-button" type="button" data-sfx-handled onClick={() => removeExport(rec.id)}>{labels.remove}</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Logs */}
            <section className="tool-card">
              <div
                className="tool-card-header collapsible"
                onClick={() => { playSound(isLogsOpen ? 'collapse' : 'expand'); setIsLogsOpen((v) => !v); }}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); playSound(isLogsOpen ? 'collapse' : 'expand'); setIsLogsOpen((v) => !v); } }}
                role="button"
                tabIndex={0}
                aria-expanded={isLogsOpen}
              >
                <div>
                  <span className="card-caption">{labels.debug}</span>
                  <h3>{labels.workflowLogs} ({logs.length})</h3>
                </div>
                <span className="collapsible-state">{isLogsOpen ? labels.hide : labels.show}</span>
              </div>
              {isLogsOpen && (
                <>
                  <div className="tool-header-actions">
                    <button className="secondary-button small-button" type="button" data-sfx-handled onClick={() => { playSound('copySound'); navigator.clipboard.writeText(logsText).catch(() => {}); }}>{labels.copy}</button>
                    <button className="secondary-button small-button" type="button" data-sfx-handled onClick={() => { playSound('downloadSound'); const blob = new Blob([logsText], { type: 'text/plain' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'audio-editor-logs.txt'; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url); }}>{labels.download}</button>
                    <button className="secondary-button small-button" type="button" data-sfx-handled onClick={() => { playSound('deleteSound'); clearLogs(); }}>{labels.clear}</button>
                  </div>
                  <div className="log-scroll">
                    {logs.length === 0 ? (
                      <p className="tiny-copy empty-state">{labels.noLogsYet}</p>
                    ) : (
                      logs.map((log, i) => (
                        <div key={i} className={`log-line log-${log.level}`}>
                          <span className="log-time">{log.time}</span>
                          <span className={`log-badge ${log.level}`}>{log.level}</span>
                          <span className="log-text">{log.text}</span>
                        </div>
                      ))
                    )}
                  </div>
                </>
              )}
            </section>
          </div>
        </div>
      </section>

      {_settings.others?.showErrorPanel && errors.length > 0 && (
        <DraggableErrorPanel
          error={errors[0] ? { code: errors[0].code, stage: 'audio-editor', message: errors[0].message, hint: errors[0].hint, details: {} } : null}
          labels={{ title: labels.error, stage: labels.stage, message: labels.message, hint: labels.hint, details: labels.details, copyText: labels.copyText, downloadJson: labels.downloadJson, openDocs: labels.openDocs, retry: labels.retry }}
          onClose={() => { playSound('back'); setErrors([]); }}
          onCopy={() => { playSound('copySound'); if (errors[0]) navigator.clipboard.writeText(`${errors[0].code}: ${errors[0].message}`).catch(() => {}); }}
          onDownload={() => {
            playSound('downloadSound');
            const blob = new Blob([JSON.stringify(errors, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a'); a.href = url; a.download = 'audio-editor-errors.json'; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
          }}
          onRetry={() => { playSound('confirm'); setErrors([]); }}
          onOpenDocs={(code) => { playSound('buttonClick'); onOpenDocs?.('audio-editor', undefined, code); }}
          docAnchor={errors[0]?.code}
        />
      )}
    </main>
  );
}

/* ------------------------------------------------------------------ */
/*  Sub-component: ParamRow                                            */
/* ------------------------------------------------------------------ */

function ParamRow({ label, value, children }: { label: string; value: string; children: React.ReactNode }) {
  return (
    <label className="field range-field">
      <div className="range-field-top">
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
      {children}
    </label>
  );
}
