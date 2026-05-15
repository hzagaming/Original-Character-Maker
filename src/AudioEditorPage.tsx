import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { AppLanguage, SettingsState } from './types';
import { DraggableErrorPanel } from './components/DraggableErrorPanel';

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
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

function generateWaveformData(buffer: AudioBuffer, width: number): number[] {
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
  const startSample = Math.floor(start * sampleRate);
  const endSample = Math.floor(end * sampleRate);
  const len = Math.max(0, endSample - startSample);
  const trimmed = new AudioBuffer({ numberOfChannels: buffer.numberOfChannels, length: len, sampleRate });
  for (let ch = 0; ch < buffer.numberOfChannels; ch++) {
    trimmed.copyToChannel(buffer.getChannelData(ch).subarray(startSample, endSample), ch);
  }
  return trimmed;
}

function splitAt(buffer: AudioBuffer, time: number): [AudioBuffer, AudioBuffer] {
  const sampleRate = buffer.sampleRate;
  const splitSample = Math.floor(time * sampleRate);
  const len1 = splitSample;
  const len2 = buffer.length - splitSample;
  const left = new AudioBuffer({ numberOfChannels: buffer.numberOfChannels, length: Math.max(0, len1), sampleRate });
  const right = new AudioBuffer({ numberOfChannels: buffer.numberOfChannels, length: Math.max(0, len2), sampleRate });
  for (let ch = 0; ch < buffer.numberOfChannels; ch++) {
    const src = buffer.getChannelData(ch);
    if (len1 > 0) left.copyToChannel(src.subarray(0, splitSample), ch);
    if (len2 > 0) right.copyToChannel(src.subarray(splitSample), ch);
  }
  return [left, right];
}

function applyFade(buffer: AudioBuffer, fadeIn: number, fadeOut: number): AudioBuffer {
  const sr = buffer.sampleRate;
  const inSamples = Math.floor(fadeIn * sr);
  const outSamples = Math.floor(fadeOut * sr);
  const result = new AudioBuffer({ numberOfChannels: buffer.numberOfChannels, length: buffer.length, sampleRate: sr });
  for (let ch = 0; ch < buffer.numberOfChannels; ch++) {
    const src = buffer.getChannelData(ch);
    const dst = result.getChannelData(ch);
    for (let i = 0; i < src.length; i++) {
      let gain = 1;
      if (inSamples > 0 && i < inSamples) gain = i / inSamples;
      if (outSamples > 0 && i > src.length - outSamples) gain = (src.length - i) / outSamples;
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
  const threshold = (intensity / 100) * 0.02; // Gate threshold
  const result = new AudioBuffer({ numberOfChannels: buffer.numberOfChannels, length: buffer.length, sampleRate: buffer.sampleRate });
  for (let ch = 0; ch < buffer.numberOfChannels; ch++) {
    const src = buffer.getChannelData(ch);
    const dst = result.getChannelData(ch);
    for (let i = 0; i < src.length; i++) {
      const v = Math.abs(src[i]);
      if (v < threshold) {
        dst[i] = src[i] * (v / threshold); // Soft gate
      } else {
        dst[i] = src[i];
      }
    }
  }
  return result;
}

/* ---- WAV Exporters (multiple bit depths) ---- */

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
  writeUint16(bitDepth === 32 ? 3 : 1); // 3 = IEEE float, 1 = PCM
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

/* ---- MediaRecorder-based export for compressed formats ---- */

function getSupportedMimeTypes(): string[] {
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

async function exportViaMediaRecorder(
  buffer: AudioBuffer,
  mimeType: string
): Promise<Blob> {
  const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
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
      ctx.close();
      resolve(blob);
    };
    recorder.onerror = () => {
      ctx.close();
      reject(new Error('MediaRecorder error'));
    };

    recorder.start();
    source.start(0);
    source.onended = () => {
      recorder.stop();
    };
  });
}

/* ------------------------------------------------------------------ */
/*  Audio Editor Page                                                  */
/* ------------------------------------------------------------------ */

export function AudioEditorPage({
  pageTitle,
  pageDescription,
  backHome,
  openSettings,
  onBack,
  onOpenSettings,
  onOpenDocs,
}: SharedPageProps) {
  /* ---- Audio state ---- */
  const [audioCtx, setAudioCtx] = useState<AudioContext | null>(null);
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
  const dragModeRef = useRef<'select' | 'pan' | 'seek'>('select');
  const dragStartXRef = useRef(0);
  const dragStartOffsetRef = useRef(0);
  const dragStartSelectionRef = useRef<{ start: number; end: number } | null>(null);

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

  /* ---- Export / Results ---- */
  const [exports, setExports] = useState<ExportRecord[]>([]);
  const [isResultOpen, setIsResultOpen] = useState(true);
  const [exportFormat, setExportFormat] = useState<'wav-16' | 'wav-8' | 'wav-32' | 'webm' | 'ogg' | 'mp3'>('wav-16');
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  /* ---- Error panel ---- */
  const [errors, setErrors] = useState<{ code: string; message: string; hint: string }[]>([]);

  /* ---- Refs for audio processing ---- */
  const gainNodeRef = useRef<GainNode | null>(null);
  const panNodeRef = useRef<StereoPannerNode | null>(null);

  /* ================================================================== */
  /*  Logging                                                            */
  /* ================================================================== */
  const addLog = useCallback((level: LogLevel, text: string) => {
    setLogs((current) => [...current, { time: timestamp(), level, text }]);
  }, []);

  const clearLogs = useCallback(() => setLogs([]), []);

  const logsText = logs.map((l) => `[${l.time}] ${l.level.toUpperCase()}: ${l.text}`).join('\n');

  /* ================================================================== */
  /*  Audio import                                                       */
  /* ================================================================== */
  const handleImport = useCallback(
    async (file: File) => {
      try {
        addLog('info', `Importing: ${file.name} (${formatBytes(file.size)})`);
        const ctx = new AudioContext();
        const arrayBuffer = await file.arrayBuffer();
        const decoded = await ctx.decodeAudioData(arrayBuffer);
        setAudioCtx(ctx);
        setSourceBuffer(decoded);
        setEditBuffer(decoded);
        setFileName(file.name);
        setDuration(decoded.duration);
        setHistory([decoded]);
        setHistoryIdx(0);
        setSelection(null);
        setCurrentTime(0);
        setErrors([]);
        addLog('success', `Import complete: ${decoded.numberOfChannels}ch, ${decoded.sampleRate}Hz, ${formatTime(decoded.duration)}`);

        const canvas = canvasRef.current;
        if (canvas) {
          const w = canvas.width || canvas.clientWidth || 800;
          const newPeaks = generateWaveformData(decoded, w);
          setPeaks(newPeaks);
        }
      } catch (err) {
        const msg = String(err);
        setErrors([{ code: 'IMPORT_FAILED', message: 'Failed to decode audio file', hint: msg }]);
        addLog('error', `Import failed: ${msg}`);
      }
    },
    [addLog]
  );

  /* ================================================================== */
  /*  Playback                                                           */
  /* ================================================================== */
  const stopPlayback = useCallback(() => {
    if (sourceRef.current) {
      try { sourceRef.current.stop(); } catch { /* already stopped */ }
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setIsPlaying(false);
  }, []);

  const startPlayback = useCallback(
    (offset: number) => {
      if (!audioCtx || !editBuffer) return;
      stopPlayback();

      const source = audioCtx.createBufferSource();
      source.buffer = isReversed ? applyReverse(editBuffer) : editBuffer;
      source.playbackRate.value = speed / 100;
      source.detune.value = pitch;
      source.loop = isLoop;
      if (isLoop && selection) {
        source.loopStart = selection.start;
        source.loopEnd = selection.end;
      }

      // EQ chain
      const eqLowNode = audioCtx.createBiquadFilter();
      eqLowNode.type = 'lowshelf';
      eqLowNode.frequency.value = 200;
      eqLowNode.gain.value = eqLow;

      const eqMidNode = audioCtx.createBiquadFilter();
      eqMidNode.type = 'peaking';
      eqMidNode.frequency.value = 1000;
      eqMidNode.gain.value = eqMid;

      const eqHighNode = audioCtx.createBiquadFilter();
      eqHighNode.type = 'highshelf';
      eqHighNode.frequency.value = 5000;
      eqHighNode.gain.value = eqHigh;

      // Compressor
      const compNode = audioCtx.createDynamicsCompressor();
      compNode.threshold.value = compThreshold;
      compNode.ratio.value = compRatio;
      compNode.attack.value = compAttack / 1000;
      compNode.release.value = compRelease / 1000;

      // Reverb (ConvolverNode with generated impulse)
      const convolver = audioCtx.createConvolver();
      if (reverbSize > 0) {
        const sr = audioCtx.sampleRate;
        const dur = 0.5 + (reverbSize / 100) * 3.5;
        const len = Math.floor(sr * dur);
        const impulse = audioCtx.createBuffer(2, len, sr);
        for (let ch = 0; ch < 2; ch++) {
          const data = impulse.getChannelData(ch);
          for (let i = 0; i < len; i++) {
            const decay = Math.pow(1 - i / len, 1 + (reverbDamp / 100) * 3);
            data[i] = (Math.random() * 2 - 1) * decay;
          }
        }
        convolver.buffer = impulse;
      }

      const dryGain = audioCtx.createGain();
      dryGain.gain.value = 1 - (reverbMix / 100);

      const wetGain = audioCtx.createGain();
      wetGain.gain.value = reverbMix / 100;

      // Master gain & pan
      const gain = audioCtx.createGain();
      gain.gain.value = isMuted ? 0 : volume / 100;
      gainNodeRef.current = gain;

      const panner = audioCtx.createStereoPanner();
      panner.pan.value = pan;
      panNodeRef.current = panner;

      // Connect chain
      source.connect(eqLowNode).connect(eqMidNode).connect(eqHighNode).connect(compNode);
      compNode.connect(dryGain).connect(gain);
      compNode.connect(convolver).connect(wetGain).connect(gain);
      gain.connect(panner).connect(audioCtx.destination);

      source.start(0, offset);
      sourceRef.current = source;
      playStartTimeRef.current = audioCtx.currentTime;
      playOffsetRef.current = offset;
      setIsPlaying(true);
      addLog('debug', `Playback started at ${formatTime(offset)} (speed=${speed}%, pitch=${pitch}c)`);

      const tick = () => {
        if (!audioCtx || !sourceRef.current) return;
        const elapsed = audioCtx.currentTime - playStartTimeRef.current;
        const t = playOffsetRef.current + elapsed * (speed / 100);
        if (t >= editBuffer.duration && !isLoop) {
          stopPlayback();
          setCurrentTime(editBuffer.duration);
          return;
        }
        setCurrentTime(Math.min(t, editBuffer.duration));
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);

      source.onended = () => {
        if (!isLoop) {
          stopPlayback();
          addLog('debug', 'Playback finished');
        }
      };
    },
    [audioCtx, editBuffer, speed, pitch, isLoop, selection, volume, isMuted, pan, stopPlayback, addLog, eqLow, eqMid, eqHigh, compThreshold, compRatio, compAttack, compRelease, reverbSize, reverbDamp, reverbMix, isReversed]
  );

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      stopPlayback();
      if (audioCtx) playOffsetRef.current = currentTime;
    } else {
      startPlayback(currentTime);
    }
  }, [isPlaying, currentTime, audioCtx, startPlayback, stopPlayback]);

  /* ---- Real-time parameter updates ---- */
  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (panNodeRef.current) {
      panNodeRef.current.pan.value = pan;
    }
  }, [pan]);

  /* ================================================================== */
  /*  Effects processing                                                 */
  /* ================================================================== */
  const pushHistory = useCallback(
    (buffer: AudioBuffer) => {
      const newHistory = history.slice(0, historyIdx + 1);
      newHistory.push(buffer);
      setHistory(newHistory);
      setHistoryIdx(newHistory.length - 1);
      setEditBuffer(buffer);
      setDuration(buffer.duration);
      const canvas = canvasRef.current;
      if (canvas) {
        const w = canvas.width || canvas.clientWidth || 800;
        setPeaks(generateWaveformData(buffer, w));
      }
    },
    [history, historyIdx]
  );

  const applyEdit = useCallback(
    (name: string) => {
      if (!editBuffer) return;
      let result = editBuffer;

      switch (name) {
        case 'trim': {
          if (!selection) return;
          result = trimAudioBuffer(editBuffer, selection.start, selection.end);
          setSelection(null);
          setCurrentTime(0);
          addLog('success', `Trimmed to ${formatTime(result.duration)} (${formatTime(selection.start)}–${formatTime(selection.end)})`);
          break;
        }
        case 'split': {
          if (!selection) return;
          const [left] = splitAt(editBuffer, selection.start);
          result = left;
          setSelection(null);
          setCurrentTime(0);
          addLog('success', `Split at ${formatTime(selection.start)}`);
          break;
        }
        case 'delete': {
          if (!selection) return;
          const [left, right] = splitAt(editBuffer, selection.start);
          const [, right2] = splitAt(editBuffer, selection.end);
          void right2;
          const len = left.length + right.length;
          const merged = new AudioBuffer({ numberOfChannels: editBuffer.numberOfChannels, length: len, sampleRate: editBuffer.sampleRate });
          for (let ch = 0; ch < editBuffer.numberOfChannels; ch++) {
            merged.getChannelData(ch).set(left.getChannelData(ch), 0);
            merged.getChannelData(ch).set(right.getChannelData(ch), left.length);
          }
          result = merged;
          setSelection(null);
          setCurrentTime(0);
          addLog('success', `Deleted region ${formatTime(selection.start)}–${formatTime(selection.end)}`);
          break;
        }
        case 'duplicate': {
          if (!selection) return;
          const selected = trimAudioBuffer(editBuffer, selection.start, selection.end);
          const len = editBuffer.length + selected.length;
          const merged = new AudioBuffer({ numberOfChannels: editBuffer.numberOfChannels, length: len, sampleRate: editBuffer.sampleRate });
          for (let ch = 0; ch < editBuffer.numberOfChannels; ch++) {
            merged.getChannelData(ch).set(editBuffer.getChannelData(ch), 0);
            merged.getChannelData(ch).set(selected.getChannelData(ch), editBuffer.length);
          }
          result = merged;
          setSelection(null);
          addLog('success', `Duplicated region ${formatTime(selection.start)}–${formatTime(selection.end)}`);
          break;
        }
        case 'reverse': {
          result = applyReverse(editBuffer);
          addLog('success', 'Reversed audio');
          break;
        }
        case 'fade': {
          result = applyFade(editBuffer, fadeIn, fadeOut);
          addLog('success', `Applied fade: in=${fadeIn}s, out=${fadeOut}s`);
          break;
        }
        case 'normalize': {
          result = normalizeBuffer(editBuffer);
          addLog('success', 'Normalized peak levels');
          break;
        }
        case 'mono': {
          result = mixToMono(editBuffer);
          addLog('success', `Mixed to mono (${result.numberOfChannels}ch)`);
          break;
        }
        default:
          return;
      }

      pushHistory(result);
    },
    [editBuffer, selection, fadeIn, fadeOut, pushHistory, addLog]
  );

  const undo = useCallback(() => {
    if (historyIdx > 0) {
      const idx = historyIdx - 1;
      setHistoryIdx(idx);
      setEditBuffer(history[idx]);
      setDuration(history[idx].duration);
      addLog('info', `Undo: restored step ${idx}`);
    }
  }, [history, historyIdx, addLog]);

  const redo = useCallback(() => {
    if (historyIdx < history.length - 1) {
      const idx = historyIdx + 1;
      setHistoryIdx(idx);
      setEditBuffer(history[idx]);
      setDuration(history[idx].duration);
      addLog('info', `Redo: restored step ${idx}`);
    }
  }, [history, historyIdx, addLog]);

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
    // deduplicate by key
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
      if (!editBuffer) return;
      setIsExporting(true);
      setExportProgress(10);
      addLog('info', `Starting export: ${exportFormat.toUpperCase()}`);

      try {
        // Build processed buffer
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
        setExports((prev) => [record, ...prev]);
        addLog('success', `Export complete: ${record.fileName} (${formatBytes(record.size)})`);

        // Auto-download
        const a = document.createElement('a');
        a.href = url;
        a.download = record.fileName;
        a.click();
      } catch (err) {
        const msg = String(err);
        setErrors([{ code: 'EXPORT_FAILED', message: 'Export failed', hint: msg }]);
        addLog('error', `Export failed: ${msg}`);
      } finally {
        setIsExporting(false);
        setExportProgress(0);
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
  }, []);

  /* ================================================================== */
  /*  Waveform canvas drawing                                            */
  /* ================================================================== */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || peaks.length === 0) return;
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
    const startIdx = Math.floor((panOffset / duration) * peaks.length);
    const endIdx = Math.min(startIdx + totalVisible, peaks.length);
    const samplesPerPixel = Math.max(1, (endIdx - startIdx) / w);

    ctx.strokeStyle = 'var(--accent)';
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
        ctx.fillRect(Math.max(0, selStartX), 0, Math.min(w, selEndX) - Math.max(0, selStartX), h);
        ctx.strokeStyle = 'var(--accent)';
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
      const startIdx = Math.floor((panOffset / duration) * peaks.length);
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
        const t = getTimeFromX(e.clientX);
        const start = dragStartSelectionRef.current?.start ?? t;
        setSelection({ start: Math.min(start, t), end: Math.max(start, t) });
      }
    },
    [isDragging, getTimeFromX, duration, zoom]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    dragModeRef.current = 'select';
  }, []);

  const handleCanvasClick = useCallback(
    (e: React.MouseEvent) => {
      if (isDragging) return;
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
        const ratio = e.deltaX / canvas.getBoundingClientRect().width;
        const newOffset = panOffset + ratio * duration;
        setPanOffset(Math.max(0, Math.min(duration - duration / zoom, newOffset)));
      }
    },
    [zoom, panOffset, duration]
  );

  /* ================================================================== */
  /*  Keyboard shortcuts                                                 */
  /* ================================================================== */
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === ' ') {
        e.preventDefault();
        togglePlay();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) redo(); else undo();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [togglePlay, undo, redo]);

  /* ================================================================== */
  /*  Render                                                             */
  /* ================================================================== */
  return (
    <div className="page-root">
      <header className="page-header">
        <div className="header-left">
          <button className="back-button" type="button" onClick={onBack} aria-label={backHome}>←</button>
          <div>
            <h1 className="page-title">{pageTitle}</h1>
            <p className="page-subtitle">{pageDescription}</p>
          </div>
        </div>
        <button className="settings-trigger" type="button" onClick={onOpenSettings} aria-label={openSettings}>⚙</button>
      </header>

      <main className="page-body" style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20 }}>
        <div className="main-column">
          {/* ---- Import area ---- */}
          {!editBuffer && (
            <div className="upload-zone" style={{ margin: '40px auto', maxWidth: 560, textAlign: 'center' }}>
              <input
                type="file"
                accept="audio/*,.mp3,.wav,.ogg,.flac,.m4a,.aac,.webm"
                id="audio-import"
                hidden
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImport(f); }}
              />
              <label htmlFor="audio-import" className="upload-dropzone" style={{ cursor: 'pointer', display: 'block', padding: '48px 32px', border: '2px dashed var(--border)', borderRadius: 16, background: 'rgba(255,255,255,0.03)' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🎵</div>
                <h3 style={{ margin: '0 0 8px', color: 'var(--text-primary)' }}>Import Audio</h3>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 14 }}>Click or drag MP3, WAV, OGG, FLAC, M4A here</p>
              </label>
            </div>
          )}

          {editBuffer && (
            <>
              {/* ---- Toolbar ---- */}
              <div className="toolbar" style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', marginBottom: 12 }}>
                <span className="file-label" style={{ fontSize: 13, color: 'var(--text-secondary)', marginRight: 8 }}>
                  {fileName} · {formatTime(duration)}
                </span>
                <button className="secondary-button small-button" type="button" onClick={togglePlay}>
                  {isPlaying ? '⏸ Pause' : '▶ Play'}
                </button>
                <button className="secondary-button small-button" type="button" onClick={() => { stopPlayback(); setCurrentTime(0); }}>
                  ⏹ Stop
                </button>
                <button className="secondary-button small-button" type="button" onClick={undo} disabled={historyIdx <= 0}>
                  ↩ Undo
                </button>
                <button className="secondary-button small-button" type="button" onClick={redo} disabled={historyIdx >= history.length - 1}>
                  ↪ Redo
                </button>
                <button className="secondary-button small-button" type="button" onClick={() => applyEdit('trim')} disabled={!selection}>✂ Trim</button>
                <button className="secondary-button small-button" type="button" onClick={() => applyEdit('split')} disabled={!selection}>✂ Split</button>
                <button className="secondary-button small-button" type="button" onClick={() => applyEdit('delete')} disabled={!selection}>🗑 Delete</button>
                <button className="secondary-button small-button" type="button" onClick={() => applyEdit('duplicate')} disabled={!selection}>📋 Duplicate</button>
                <button className="secondary-button small-button" type="button" onClick={() => applyEdit('reverse')}>🔀 Reverse</button>
                <button className="secondary-button small-button" type="button" onClick={() => applyEdit('fade')}>📉 Fade</button>
                <button className="secondary-button small-button" type="button" onClick={() => applyEdit('normalize')}>📈 Normalize</button>
                <button className="secondary-button small-button" type="button" onClick={() => applyEdit('mono')}>🔊 Mono</button>
                <input type="file" accept="audio/*" hidden id="audio-reimport" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImport(f); }} />
                <label htmlFor="audio-reimport" className="secondary-button small-button" style={{ cursor: 'pointer' }}>📁 New File</label>
              </div>

              {/* ---- Time display ---- */}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>
                <span>{formatTime(currentTime)}</span>
                <span>Zoom: {zoom.toFixed(1)}x</span>
                <span>{formatTime(duration)}</span>
              </div>

              {/* ---- Waveform canvas ---- */}
              <div className="waveform-container" style={{ position: 'relative', height: 220, borderRadius: 12, overflow: 'hidden', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', marginBottom: 16 }}>
                <canvas
                  ref={canvasRef}
                  style={{ width: '100%', height: '100%', cursor: isDragging ? 'grabbing' : 'crosshair' }}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  onClick={handleCanvasClick}
                  onWheel={handleWheel}
                />
              </div>

              {/* ---- Selection info ---- */}
              {selection && (
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 12 }}>
                  Selection: {formatTime(selection.start)} – {formatTime(selection.end)} ({formatTime(selection.end - selection.start)})
                </div>
              )}

              {/* ---- Export section ---- */}
              <div className="export-section" style={{ padding: 16, borderRadius: 12, border: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)', marginBottom: 16 }}>
                <h4 style={{ margin: '0 0 12px', fontSize: 14, color: 'var(--accent)' }}>💾 Export</h4>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', marginBottom: 12 }}>
                  <label style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Format:</label>
                  <select
                    className="settings-select"
                    value={exportFormat}
                    onChange={(e) => setExportFormat(e.target.value as typeof exportFormat)}
                    style={{ minWidth: 160 }}
                  >
                    {supportedFormats.map((f: { key: string; label: string }) => (
                      <option key={f.key} value={f.key}>{f.label}</option>
                    ))}
                  </select>
                  <button className="primary-button small-button" type="button" onClick={handleExport} disabled={isExporting}>
                    {isExporting ? `Exporting ${exportProgress}%…` : 'Export'}
                  </button>
                </div>
                {isExporting && (
                  <div style={{ height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ width: `${exportProgress}%`, height: '100%', background: 'var(--accent)', transition: 'width 0.3s' }} />
                  </div>
                )}
              </div>

              {/* ---- Effects Panel ---- */}
              <div className="effects-panel" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
                {/* Volume & Pan */}
                <div className="param-card" style={{ padding: 16, borderRadius: 12, border: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)' }}>
                  <h4 style={{ margin: '0 0 12px', fontSize: 14, color: 'var(--accent)' }}>🔊 Volume & Pan</h4>
                  <ParamRow label="Volume" value={`${volume}%`}>
                    <input type="range" min={0} max={200} value={volume} onChange={(e) => setVolume(Number(e.target.value))} />
                  </ParamRow>
                  <ParamRow label="Mute" value={isMuted ? 'On' : 'Off'}>
                    <button className={`toggle-button ${isMuted ? 'active' : ''}`} type="button" onClick={() => setIsMuted((v) => !v)}>{isMuted ? 'On' : 'Off'}</button>
                  </ParamRow>
                  <ParamRow label="Pan (L/R)" value={`${pan > 0 ? '+' : ''}${pan}`}>
                    <input type="range" min={-100} max={100} value={pan} onChange={(e) => setPan(Number(e.target.value))} />
                  </ParamRow>
                </div>

                {/* Speed & Pitch */}
                <div className="param-card" style={{ padding: 16, borderRadius: 12, border: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)' }}>
                  <h4 style={{ margin: '0 0 12px', fontSize: 14, color: 'var(--accent)' }}>⚡ Speed & Pitch</h4>
                  <ParamRow label="Speed" value={`${speed}%`}>
                    <input type="range" min={25} max={400} value={speed} onChange={(e) => setSpeed(Number(e.target.value))} />
                  </ParamRow>
                  <ParamRow label="Pitch (cents)" value={`${pitch > 0 ? '+' : ''}${pitch}`}>
                    <input type="range" min={-1200} max={1200} step={10} value={pitch} onChange={(e) => setPitch(Number(e.target.value))} />
                  </ParamRow>
                  <ParamRow label="Reverse" value={isReversed ? 'On' : 'Off'}>
                    <button className={`toggle-button ${isReversed ? 'active' : ''}`} type="button" onClick={() => setIsReversed((v) => !v)}>{isReversed ? 'On' : 'Off'}</button>
                  </ParamRow>
                  <ParamRow label="Loop" value={isLoop ? 'On' : 'Off'}>
                    <button className={`toggle-button ${isLoop ? 'active' : ''}`} type="button" onClick={() => setIsLoop((v) => !v)}>{isLoop ? 'On' : 'Off'}</button>
                  </ParamRow>
                </div>

                {/* Fade */}
                <div className="param-card" style={{ padding: 16, borderRadius: 12, border: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)' }}>
                  <h4 style={{ margin: '0 0 12px', fontSize: 14, color: 'var(--accent)' }}>📉 Fade</h4>
                  <ParamRow label="Fade In" value={`${fadeIn}s`}>
                    <input type="range" min={0} max={10} step={0.1} value={fadeIn} onChange={(e) => setFadeIn(Number(e.target.value))} />
                  </ParamRow>
                  <ParamRow label="Fade Out" value={`${fadeOut}s`}>
                    <input type="range" min={0} max={10} step={0.1} value={fadeOut} onChange={(e) => setFadeOut(Number(e.target.value))} />
                  </ParamRow>
                </div>

                {/* EQ */}
                <div className="param-card" style={{ padding: 16, borderRadius: 12, border: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)' }}>
                  <h4 style={{ margin: '0 0 12px', fontSize: 14, color: 'var(--accent)' }}>🎚 EQ</h4>
                  <ParamRow label="Low Gain" value={`${eqLow > 0 ? '+' : ''}${eqLow}dB`}>
                    <input type="range" min={-12} max={12} value={eqLow} onChange={(e) => setEqLow(Number(e.target.value))} />
                  </ParamRow>
                  <ParamRow label="Mid Gain" value={`${eqMid > 0 ? '+' : ''}${eqMid}dB`}>
                    <input type="range" min={-12} max={12} value={eqMid} onChange={(e) => setEqMid(Number(e.target.value))} />
                  </ParamRow>
                  <ParamRow label="High Gain" value={`${eqHigh > 0 ? '+' : ''}${eqHigh}dB`}>
                    <input type="range" min={-12} max={12} value={eqHigh} onChange={(e) => setEqHigh(Number(e.target.value))} />
                  </ParamRow>
                </div>

                {/* Compressor */}
                <div className="param-card" style={{ padding: 16, borderRadius: 12, border: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)' }}>
                  <h4 style={{ margin: '0 0 12px', fontSize: 14, color: 'var(--accent)' }}>🔧 Compressor</h4>
                  <ParamRow label="Threshold" value={`${compThreshold}dB`}>
                    <input type="range" min={-60} max={0} value={compThreshold} onChange={(e) => setCompThreshold(Number(e.target.value))} />
                  </ParamRow>
                  <ParamRow label="Ratio" value={`${compRatio}:1`}>
                    <input type="range" min={1} max={20} value={compRatio} onChange={(e) => setCompRatio(Number(e.target.value))} />
                  </ParamRow>
                  <ParamRow label="Attack" value={`${compAttack}ms`}>
                    <input type="range" min={0} max={100} value={compAttack} onChange={(e) => setCompAttack(Number(e.target.value))} />
                  </ParamRow>
                  <ParamRow label="Release" value={`${compRelease}ms`}>
                    <input type="range" min={0} max={500} value={compRelease} onChange={(e) => setCompRelease(Number(e.target.value))} />
                  </ParamRow>
                </div>

                {/* Reverb */}
                <div className="param-card" style={{ padding: 16, borderRadius: 12, border: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)' }}>
                  <h4 style={{ margin: '0 0 12px', fontSize: 14, color: 'var(--accent)' }}>🌊 Reverb</h4>
                  <ParamRow label="Room Size" value={`${reverbSize}%`}>
                    <input type="range" min={0} max={100} value={reverbSize} onChange={(e) => setReverbSize(Number(e.target.value))} />
                  </ParamRow>
                  <ParamRow label="Damping" value={`${reverbDamp}%`}>
                    <input type="range" min={0} max={100} value={reverbDamp} onChange={(e) => setReverbDamp(Number(e.target.value))} />
                  </ParamRow>
                  <ParamRow label="Wet/Dry" value={`${reverbMix}%`}>
                    <input type="range" min={0} max={100} value={reverbMix} onChange={(e) => setReverbMix(Number(e.target.value))} />
                  </ParamRow>
                </div>

                {/* Noise & Normalize */}
                <div className="param-card" style={{ padding: 16, borderRadius: 12, border: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)' }}>
                  <h4 style={{ margin: '0 0 12px', fontSize: 14, color: 'var(--accent)' }}>🔇 Noise & Normalize</h4>
                  <ParamRow label="Noise Reduction" value={`${noiseReduction}%`}>
                    <input type="range" min={0} max={100} value={noiseReduction} onChange={(e) => setNoiseReduction(Number(e.target.value))} />
                  </ParamRow>
                  <ParamRow label="Normalize" value={doNormalize ? 'On' : 'Off'}>
                    <button className={`toggle-button ${doNormalize ? 'active' : ''}`} type="button" onClick={() => setDoNormalize((v) => !v)}>{doNormalize ? 'On' : 'Off'}</button>
                  </ParamRow>
                </div>
              </div>
            </>
          )}
        </div>

        {/* ---- Side panel: Logs & Results ---- */}
        <div className="side-column" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Results */}
          <section className="tool-card" style={{ border: '1px solid var(--border)', borderRadius: 12, background: 'rgba(255,255,255,0.02)', overflow: 'hidden' }}>
            <div className="tool-card-header" style={{ cursor: 'pointer', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} onClick={() => setIsResultOpen((v) => !v)} role="button" tabIndex={0}>
              <div>
                <span style={{ fontSize: 11, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Results</span>
                <h3 style={{ margin: 0, fontSize: 15 }}>Exported Files</h3>
              </div>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{isResultOpen ? '▲' : '▼'}</span>
            </div>
            {isResultOpen && (
              <div style={{ padding: '0 16px 16px' }}>
                {exports.length === 0 ? (
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '12px 0' }}>No exports yet. Select a format and click Export.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {exports.map((rec) => (
                      <div key={rec.id} style={{ padding: 10, borderRadius: 8, border: '1px solid var(--border)', background: 'rgba(255,255,255,0.03)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                          <strong style={{ fontSize: 12, color: 'var(--text-primary)' }}>{rec.fileName}</strong>
                          <span style={{ fontSize: 11, color: 'var(--text-secondary)', fontFamily: 'monospace' }}>{rec.format} · {formatBytes(rec.size)}</span>
                        </div>
                        <audio controls src={rec.url} style={{ width: '100%', height: 28, marginBottom: 6 }} />
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button className="secondary-button small-button" type="button" onClick={() => { const a = document.createElement('a'); a.href = rec.url; a.download = rec.fileName; a.click(); }}>Download</button>
                          <button className="secondary-button small-button" type="button" onClick={() => removeExport(rec.id)}>Remove</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </section>

          {/* Logs */}
          <section className="tool-card" style={{ border: '1px solid var(--border)', borderRadius: 12, background: 'rgba(255,255,255,0.02)', overflow: 'hidden', flex: 1, minHeight: 200 }}>
            <div className="tool-card-header" style={{ cursor: 'pointer', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} onClick={() => setIsLogsOpen((v) => !v)} role="button" tabIndex={0}>
              <div>
                <span style={{ fontSize: 11, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Debug</span>
                <h3 style={{ margin: 0, fontSize: 15 }}>Workflow Logs</h3>
              </div>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{isLogsOpen ? '▲' : '▼'}</span>
            </div>
            {isLogsOpen && (
              <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', gap: 6, marginBottom: 4 }}>
                  <button className="secondary-button small-button" type="button" onClick={() => navigator.clipboard.writeText(logsText)}>Copy</button>
                  <button className="secondary-button small-button" type="button" onClick={() => {
                    const blob = new Blob([logsText], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a'); a.href = url; a.download = 'audio-editor-logs.txt'; a.click(); URL.revokeObjectURL(url);
                  }}>Download</button>
                  <button className="secondary-button small-button" type="button" onClick={clearLogs}>Clear</button>
                </div>
                <div style={{ maxHeight: 320, overflowY: 'auto', fontSize: 11, fontFamily: 'monospace', lineHeight: 1.5 }}>
                  {logs.length === 0 ? (
                    <span style={{ color: 'var(--text-secondary)' }}>No logs yet.</span>
                  ) : (
                    logs.map((log, i) => (
                      <div key={i} style={{ color: log.level === 'error' ? '#f45a5a' : log.level === 'success' ? '#4ade80' : log.level === 'debug' ? '#94a3b8' : 'var(--text-primary)' }}>
                        [{log.time}] <strong>{log.level.toUpperCase()}</strong>: {log.text}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* ---- Error panel ---- */}
      <DraggableErrorPanel
        error={errors[0] ? { code: errors[0].code, stage: 'audio-editor', message: errors[0].message, hint: errors[0].hint, details: {} } : null}
        labels={{ title: 'Error', stage: 'Stage', message: 'Message', hint: 'Hint', details: 'Details', copyText: 'Copy', downloadJson: 'Download JSON', openDocs: 'Open Docs', retry: 'Retry' }}
        onClose={() => setErrors([])}
        onCopy={() => { if (errors[0]) navigator.clipboard.writeText(`${errors[0].code}: ${errors[0].message}`); }}
        onDownload={() => {
          const blob = new Blob([JSON.stringify(errors, null, 2)], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a'); a.href = url; a.download = 'audio-editor-errors.json'; a.click(); URL.revokeObjectURL(url);
        }}
        onRetry={() => setErrors([])}
        onOpenDocs={(code) => onOpenDocs?.('audio-editor', undefined, code)}
        docAnchor={errors[0]?.code}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Sub-component: ParamRow                                            */
/* ------------------------------------------------------------------ */

function ParamRow({ label, value, children }: { label: string; value: string; children: React.ReactNode }) {
  return (
    <div className="param-row" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
      <label style={{ fontSize: 12, color: 'var(--text-secondary)', minWidth: 90, flexShrink: 0 }}>{label}</label>
      <div style={{ flex: 1 }}>{children}</div>
      <span style={{ fontSize: 12, color: 'var(--text-primary)', minWidth: 60, textAlign: 'right', fontFamily: 'monospace' }}>{value}</span>
    </div>
  );
}
