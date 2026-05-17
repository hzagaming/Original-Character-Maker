import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { AppLanguage, SettingsState } from './types';
import { DraggableErrorPanel } from './components/DraggableErrorPanel';
import { playSound } from './audioEngine';
async function copyText(text: string): Promise<boolean> {
  try { await navigator.clipboard.writeText(text); return true; } catch { return false; }
}
function downloadText(name: string, content: string, type = 'text/plain;charset=utf-8') {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = name;
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 5000);
}

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

type LogLevel = 'info' | 'success' | 'error' | 'debug';
type WorkflowLog = { time: string; level: LogLevel; text: string };
const MAX_LOGS = 500;

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

/* ------------------------------------------------------------------ */
/*  Utilities                                                          */
/* ------------------------------------------------------------------ */

function timestamp(): string {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
}

function formatBytes(bytes: number): string {
  if (bytes <= 0 || !isFinite(bytes)) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(k)), sizes.length - 1);
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return '0:00.000';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 1000);
  return `${m}:${String(s).padStart(2, '0')}.${String(ms).padStart(3, '0')}`;
}

/* ---- Audio processing ---- */

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
      if (inSamples > 0 && i < inSamples) gain *= i / inSamples;
      if (outSamples > 0 && i >= src.length - outSamples) gain *= Math.max(0, (src.length - 1 - i) / (outSamples - 1 || 1));
      dst[i] = src[i] * gain;
    }
  }
  return result;
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

function duplicateToStereo(buffer: AudioBuffer): AudioBuffer {
  if (buffer.numberOfChannels === 2) return buffer;
  const stereo = new AudioBuffer({ numberOfChannels: 2, length: buffer.length, sampleRate: buffer.sampleRate });
  const src = buffer.getChannelData(0);
  stereo.copyToChannel(src, 0);
  stereo.copyToChannel(src, 1);
  return stereo;
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
      if (v < threshold) dst[i] = src[i] * (v / threshold);
      else dst[i] = src[i];
    }
  }
  return result;
}

function applyVolume(buffer: AudioBuffer, volumePercent: number): AudioBuffer {
  if (volumePercent === 100) return buffer;
  const gain = volumePercent / 100;
  const result = new AudioBuffer({ numberOfChannels: buffer.numberOfChannels, length: buffer.length, sampleRate: buffer.sampleRate });
  for (let ch = 0; ch < buffer.numberOfChannels; ch++) {
    const src = buffer.getChannelData(ch);
    const dst = result.getChannelData(ch);
    for (let i = 0; i < src.length; i++) dst[i] = Math.max(-1, Math.min(1, src[i] * gain));
  }
  return result;
}

async function resampleBuffer(buffer: AudioBuffer, targetSampleRate: number, speedPercent: number, pitchCents: number): Promise<AudioBuffer> {
  if (buffer.length === 0) return buffer;
  const speed = speedPercent / 100;
  const duration = buffer.duration / speed;
  const targetLength = Math.max(1, Math.ceil(duration * targetSampleRate));
  const offline = new OfflineAudioContext(buffer.numberOfChannels, targetLength, targetSampleRate);
  const source = offline.createBufferSource();
  source.buffer = buffer;
  source.playbackRate.value = speed;
  source.detune.value = pitchCents;
  source.connect(offline.destination);
  source.start(0);
  return offline.startRendering();
}

/* ---- WAV Exporters ---- */

function audioBufferToWav(buffer: AudioBuffer, bitDepth: 8 | 16 | 24 | 32 = 16): Blob {
  const numOfChan = buffer.numberOfChannels;
  const bytesPerSample = bitDepth === 8 ? 1 : bitDepth === 16 ? 2 : bitDepth === 24 ? 3 : 4;
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
      } else if (bitDepth === 24) {
        sample = Math.max(-1, Math.min(1, sample));
        const intVal = (sample < 0 ? sample * 8388608 : sample * 8388607) | 0;
        view.setUint8(pos, intVal & 0xFF);
        view.setUint8(pos + 1, (intVal >> 8) & 0xFF);
        view.setUint8(pos + 2, (intVal >> 16) & 0xFF);
        pos += 3;
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
    try {
      recorder.start();
      source.start(0);
      source.onended = () => { try { recorder.stop(); } catch {} };
    } catch (err) {
      ctx.close().catch(() => {});
      reject(err);
    }
  });
}

/* ------------------------------------------------------------------ */
/*  Audio Converter Page                                               */
/* ------------------------------------------------------------------ */

export function AudioConverterPage({
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sourceUrlRef = useRef('');
  const resultUrlRef = useRef('');

  /* ---- Source ---- */
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [sourceBuffer, setSourceBuffer] = useState<AudioBuffer | null>(null);
  const [sourceUrl, setSourceUrl] = useState('');

  /* ---- Parameters ---- */
  const [outputFormat, setOutputFormat] = useState<'wav-8' | 'wav-16' | 'wav-24' | 'wav-32' | 'webm' | 'ogg' | 'mp3' | 'mp4' | 'flac'>('wav-16');
  const [sampleRate, setSampleRate] = useState<'original' | '22050' | '44100' | '48000' | '96000' | '192000'>('original');
  const [channels, setChannels] = useState<'original' | 'mono' | 'stereo'>('original');
  const [volume, setVolume] = useState(100);
  const [speed, setSpeed] = useState(100);
  const [pitch, setPitch] = useState(0);
  const [doNormalize, setDoNormalize] = useState(false);
  const [fadeIn, setFadeIn] = useState(0);
  const [fadeOut, setFadeOut] = useState(0);
  const [noiseReduction, setNoiseReduction] = useState(0);

  /* ---- Result ---- */
  const [resultUrl, setResultUrl] = useState('');
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultFormat, setResultFormat] = useState('');
  const [isConverting, setIsConverting] = useState(false);
  const [convertProgress, setConvertProgress] = useState(0);

  /* ---- Logs & errors ---- */
  const [logs, setLogs] = useState<WorkflowLog[]>([]);
  const [error, setError] = useState<{ code: string; message: string; hint: string } | null>(null);
  const [showErrorPanel, setShowErrorPanel] = useState(false);

  /* ---- Import state ---- */
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const importTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ---- Drag & drop ---- */
  const [isDragOver, setIsDragOver] = useState(false);
  const dragCounter = useRef(0);

  /* ---- Mount guard ---- */
  const isMountedRef = useRef(true);
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (importTimeoutRef.current) window.clearTimeout(importTimeoutRef.current);
      if (sourceUrlRef.current) URL.revokeObjectURL(sourceUrlRef.current);
      if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
      if (progressTimeoutRef.current) window.clearTimeout(progressTimeoutRef.current);
      if (sliderThrottleRef.current) window.clearTimeout(sliderThrottleRef.current);
    };
  }, []);

  /* ---- Logging ---- */
  const addLog = useCallback((level: LogLevel, text: string) => {
    setLogs((prev) => {
      const next = [...prev, { time: timestamp(), level, text }];
      return next.length > MAX_LOGS ? next.slice(next.length - MAX_LOGS) : next;
    });
  }, []);

  const logsText = useMemo(() => logs.map((l) => `[${l.time}] ${l.level.toUpperCase()}: ${l.text}`).join('\n'), [logs]);

  /* ---- Supported formats ---- */
  const supportedFormats = useMemo(() => {
    const wav = [
      { key: 'wav-8', label: 'WAV 8-bit PCM' },
      { key: 'wav-16', label: 'WAV 16-bit PCM' },
      { key: 'wav-24', label: 'WAV 24-bit PCM' },
      { key: 'wav-32', label: 'WAV 32-bit Float' },
      { key: 'flac', label: 'FLAC (WAV container)' },
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
      if (!seen.has(c.key)) { seen.add(c.key); all.push(c); }
    }
    return all;
  }, []);

  /* ---- Import ---- */
  const handleImportFile = useCallback(async (file: File) => {
    if (isImporting) return;
    setIsImporting(true);
    setImportProgress(10);
    if (importTimeoutRef.current) window.clearTimeout(importTimeoutRef.current);
    try {
      playSound('uploadStart');
      addLog('info', `Importing: ${file.name} (${formatBytes(file.size)})`);
      // Don't revoke source URL yet — wait until decode succeeds to preserve fallback playback
      if (resultUrlRef.current) { URL.revokeObjectURL(resultUrlRef.current); resultUrlRef.current = ''; }
      setResultUrl('');
      setResultBlob(null);
      setError(null);
      setShowErrorPanel(false);

      const ctx = new AudioContext();
      try {
        setImportProgress(30);
        const arrayBuffer = await file.arrayBuffer();
        setImportProgress(60);
        const decoded = await ctx.decodeAudioData(arrayBuffer);
        setImportProgress(85);
        await ctx.close().catch(() => {});

        if (!isMountedRef.current) return;
        // Successful decode — safe to replace old source
        if (sourceUrlRef.current) { URL.revokeObjectURL(sourceUrlRef.current); }
        setSourceFile(file);
        setSourceBuffer(decoded);
        const url = URL.createObjectURL(file);
        sourceUrlRef.current = url;
        setSourceUrl(url);
        setImportProgress(100);
        addLog('success', `Loaded: ${decoded.numberOfChannels}ch, ${decoded.sampleRate}Hz, ${formatTime(decoded.duration)}`);
        playSound('uploadComplete');
        importTimeoutRef.current = window.setTimeout(() => setIsImporting(false), 400);
      } catch (err) {
        await ctx.close().catch(() => {});
        throw err;
      }
    } catch (err) {
      if (!isMountedRef.current) return;
      setIsImporting(false);
      setImportProgress(0);
      const msg = String(err);
      addLog('error', `Import failed: ${msg}`);
      playSound('error');
      setError({ code: 'IMPORT_FAILED', message: 'Failed to decode audio file', hint: msg });
      setShowErrorPanel(true);
    }
  }, [addLog, isImporting]);

  /* ---- Convert ---- */
  const handleConvert = useCallback(async () => {
    if (!sourceBuffer) {
      addLog('error', 'Cannot convert: no audio file loaded');
      playSound('error');
      setError({ code: 'CONVERT_NO_AUDIO', message: 'Nothing to convert', hint: 'Import an audio file first using the dropzone or Choose File button.' });
      setShowErrorPanel(true);
      return;
    }
    setIsConverting(true);
    setConvertProgress(5);
    setError(null);
    setShowErrorPanel(false);
    addLog('info', `Starting conversion: ${outputFormat.toUpperCase()}`);
    playSound('confirm');

    try {
      let buffer = sourceBuffer;
      const targetRate = sampleRate === 'original' ? buffer.sampleRate : Number(sampleRate);

      /* Step 1: Channel conversion */
      if (channels === 'mono' && buffer.numberOfChannels > 1) {
        buffer = mixToMono(buffer);
        setConvertProgress(12);
        addLog('debug', 'Mixed to mono');
      } else if (channels === 'stereo' && buffer.numberOfChannels === 1) {
        buffer = duplicateToStereo(buffer);
        setConvertProgress(12);
        addLog('debug', 'Duplicated to stereo');
      }

      /* Step 2: Volume */
      if (volume !== 100) {
        buffer = applyVolume(buffer, volume);
        setConvertProgress(20);
        addLog('debug', `Applied volume: ${volume}%`);
      }

      /* Step 3: Speed & Pitch + Resample */
      const needsResample = targetRate !== buffer.sampleRate || speed !== 100 || pitch !== 0;
      if (needsResample) {
        buffer = await resampleBuffer(buffer, targetRate, speed, pitch);
        setConvertProgress(40);
        addLog('debug', `Resampled to ${targetRate}Hz, speed=${speed}%, pitch=${pitch}cents`);
      }

      /* Step 4: Fade */
      if (fadeIn > 0 || fadeOut > 0) {
        buffer = applyFade(buffer, fadeIn, fadeOut);
        setConvertProgress(55);
        addLog('debug', `Applied fade: in=${fadeIn}s, out=${fadeOut}s`);
      }

      /* Step 5: Noise reduction */
      if (noiseReduction > 0) {
        buffer = applyNoiseReduction(buffer, noiseReduction);
        setConvertProgress(65);
        addLog('debug', `Applied noise reduction: ${noiseReduction}%`);
      }

      /* Step 6: Normalize */
      if (doNormalize) {
        buffer = normalizeBuffer(buffer);
        setConvertProgress(75);
        addLog('debug', 'Normalized peak levels');
      }

      /* Step 7: Encode */
      let blob: Blob;
      let ext: string;
      if (outputFormat === 'wav-16') { blob = audioBufferToWav(buffer, 16); ext = 'wav'; }
      else if (outputFormat === 'wav-8') { blob = audioBufferToWav(buffer, 8); ext = 'wav'; }
      else if (outputFormat === 'wav-24') { blob = audioBufferToWav(buffer, 24); ext = 'wav'; }
      else if (outputFormat === 'wav-32') { blob = audioBufferToWav(buffer, 32); ext = 'wav'; }
      else if (outputFormat === 'flac') { blob = audioBufferToWav(buffer, 16); ext = 'wav'; addLog('info', 'FLAC encoder not available in browser; using WAV 16-bit fallback'); }
      else {
        const mimeMap: Record<string, string> = {
          webm: 'audio/webm;codecs=opus',
          ogg: 'audio/ogg;codecs=opus',
          mp3: 'audio/mp3',
          mp4: 'audio/mp4',
        };
        const mime = mimeMap[outputFormat] || 'audio/webm';
        blob = await exportViaMediaRecorder(buffer, mime);
        ext = outputFormat;
      }

      if (!isMountedRef.current) return;
      setConvertProgress(100);
      if (resultUrlRef.current) { URL.revokeObjectURL(resultUrlRef.current); }
      const url = URL.createObjectURL(blob);
      resultUrlRef.current = url;
      setResultUrl(url);
      setResultBlob(blob);
      setResultFormat(outputFormat.toUpperCase());
      addLog('success', `Conversion complete: ${ext.toUpperCase()}, ${formatBytes(blob.size)}`);
      playSound('success');
    } catch (err) {
      const msg = String(err);
      addLog('error', `Conversion failed: ${msg}`);
      playSound('error');
      setError({ code: 'CONVERT_FAILED', message: 'Conversion failed', hint: msg });
      setShowErrorPanel(true);
    } finally {
      if (isMountedRef.current) {
        setIsConverting(false);
        if (progressTimeoutRef.current) window.clearTimeout(progressTimeoutRef.current);
        progressTimeoutRef.current = window.setTimeout(() => {
          if (isMountedRef.current) setConvertProgress(0);
          progressTimeoutRef.current = null;
        }, 800);
      }
    }
  }, [sourceBuffer, outputFormat, sampleRate, channels, volume, speed, pitch, doNormalize, fadeIn, fadeOut, noiseReduction, addLog]);

  /* ---- Download ---- */
  const handleDownload = useCallback(() => {
    if (!resultBlob || !sourceFile) return;
    playSound('downloadSound');
    const extMap: Record<string, string> = {
      'wav-8': 'wav', 'wav-16': 'wav', 'wav-24': 'wav', 'wav-32': 'wav',
      'flac': 'wav', // fallback to WAV
      'webm': 'webm', 'ogg': 'ogg', 'mp3': 'mp3', 'mp4': 'mp4',
    };
    const ext = extMap[outputFormat] || outputFormat;
    const name = sourceFile.name.replace(/\.[^.]+$/, '') + `-converted.${ext}`;
    const a = document.createElement('a');
    a.href = resultUrl;
    a.download = name;
    a.click();
    addLog('info', `Downloaded: ${name}`);
  }, [resultBlob, sourceFile, resultUrl, outputFormat, addLog]);

  /* ---- Reset ---- */
  const handleReset = useCallback(() => {
    playSound('resetSound');
    if (sourceUrlRef.current) { URL.revokeObjectURL(sourceUrlRef.current); sourceUrlRef.current = ''; }
    if (resultUrlRef.current) { URL.revokeObjectURL(resultUrlRef.current); resultUrlRef.current = ''; }
    setSourceFile(null);
    setSourceBuffer(null);
    setSourceUrl('');
    setResultUrl('');
    setResultBlob(null);
    setResultFormat('');
    setError(null);
    setShowErrorPanel(false);
    setLogs([]);
    setOutputFormat('wav-16');
    setSampleRate('original');
    setChannels('original');
    setVolume(100);
    setSpeed(100);
    setPitch(0);
    setDoNormalize(false);
    setFadeIn(0);
    setFadeOut(0);
    setNoiseReduction(0);
    setIsImporting(false);
    setIsConverting(false);
    setConvertProgress(0);
    setIsResultOpen(true);
    setIsLogsOpen(true);
    setIsDragOver(false);
    dragCounter.current = 0;
    if (progressTimeoutRef.current) { window.clearTimeout(progressTimeoutRef.current); progressTimeoutRef.current = null; }
    if (sliderThrottleRef.current) { window.clearTimeout(sliderThrottleRef.current); sliderThrottleRef.current = null; }
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, []);

  /* ---- Drag & drop ---- */
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current += 1;
    const types = Array.from(e.dataTransfer.types);
    if (types.includes('Files')) setIsDragOver(true);
  }, []);
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }, []);
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current -= 1;
    if (dragCounter.current <= 0) {
      dragCounter.current = 0;
      setIsDragOver(false);
    }
  }, []);
  const isAudioFile = (file: File | undefined) => {
    if (!file) return false;
    if (file.type.startsWith('audio/') || file.type === 'application/octet-stream') return true;
    const ext = file.name.split('.').pop()?.toLowerCase();
    return ['mp3', 'wav', 'ogg', 'flac', 'm4a', 'aac', 'webm'].includes(ext || '');
  };
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current = 0;
    setIsDragOver(false);
    if (isConverting) {
      addLog('info', 'Cannot import while converting');
      return;
    }
    const file = e.dataTransfer.files?.[0];
    if (file && isAudioFile(file)) {
      handleImportFile(file);
    } else if (file) {
      addLog('info', 'Dropped file is not an audio file');
      playSound('error');
    }
  }, [handleImportFile, addLog, isConverting]);

  /* ---- Dirty state guard ---- */
  const isDirty = sourceFile !== null || resultUrl !== '' || logs.length > 0;
  useBeforeUnloadGuard(isDirty);

  /* ---- Panel collapse ---- */
  const [isResultOpen, setIsResultOpen] = useState(true);
  const [isLogsOpen, setIsLogsOpen] = useState(true);
  const progressTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ---- Slider throttle ---- */
  const sliderThrottleRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const playSliderThrottled = useCallback(() => {
    if (sliderThrottleRef.current) return;
    playSound('sliderChange');
    sliderThrottleRef.current = window.setTimeout(() => { sliderThrottleRef.current = null; }, 50);
  }, []);

  /* ---- Render ---- */
  return (
    <main className="feature-shell tool-page-shell">
      <header className="feature-header fade-up delay-1">
        <button className="secondary-button small-button" type="button" aria-label={backHome} onClick={() => { playSound('back'); onBack(); }}>{backHome}</button>
        <div className="feature-header-meta">
          <button className="secondary-button small-button" type="button" aria-label="Help" onClick={() => { playSound('buttonClick'); onOpenDocs?.('audio-converter', 'overview'); }}>Help</button>
          <button className="secondary-button small-button" type="button" aria-label="Tutorial" onClick={() => { playSound('buttonClick'); onOpenDocs?.('audio-converter', 'buttons'); }}>Tutorial</button>
          <button className="secondary-button small-button" type="button" aria-label={openSettings} onClick={() => { playSound('settingsOpen'); onOpenSettings(); }}>{openSettings}</button>
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
            <button className="secondary-button small-button" type="button" disabled={isConverting} onClick={() => { playSound('buttonClick'); onSwitchTool?.('audio-editor'); }}>Audio Editor</button>
            <button className="secondary-button small-button" type="button" disabled={isConverting} onClick={() => { playSound('buttonClick'); handleReset(); }}>Reset</button>
          </div>
        </div>

        <div className="tool-grid transfer-grid">
          <div className="tool-column">
            {/* Source / Upload */}
            <section className="tool-card">
              <div className="tool-card-header">
                <div>
                  <span className="card-caption">Source</span>
                  <h3>{sourceFile ? sourceFile.name : 'Import Audio'}</h3>
                </div>
                {sourceFile && (
                  <button className="secondary-button small-button" type="button" disabled={isImporting || isConverting} onClick={() => { playSound('buttonClick'); fileInputRef.current?.click(); }}>
                    {isImporting ? 'Importing…' : 'Replace'}
                  </button>
                )}
              </div>
              <div className="preview-surface" style={{ minHeight: sourceFile ? undefined : 220 }}>
                {!sourceFile ? (
                  <div
                    className="upload-zone"
                    onDragEnter={handleDragEnter}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    {isImporting ? (
                      <div className="preview-empty">
                        <span className="status-badge running">Decoding audio… {importProgress}%</span>
                        <div className="progress-track" style={{ width: 'min(260px, 80%)' }}>
                          <div className="progress-fill" style={{ width: `${importProgress}%` }} />
                        </div>
                      </div>
                    ) : (
                      <label
                        htmlFor="audio-converter-import"
                        className="upload-dropzone"
                        onClick={() => playSound('buttonClick')}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); playSound('buttonClick'); fileInputRef.current?.click(); } }}
                        tabIndex={0}
                        role="button"
                        aria-label="Import audio file"
                        style={{
                          border: isDragOver ? '2px dashed var(--accent)' : undefined,
                          background: isDragOver ? 'rgba(var(--accent-rgb), 0.08)' : undefined,
                          boxShadow: isDragOver ? '0 0 0 4px rgba(var(--accent-rgb), 0.10)' : undefined,
                        }}
                      >
                        <h3>Import Audio</h3>
                        <p>Click or drag MP3, WAV, OGG, FLAC, M4A, AAC, WEBM here</p>
                      </label>
                    )}
                  </div>
                ) : (
                  <>
                    <audio key={sourceUrl} controls src={sourceUrl} className="tool-audio" aria-label="Source audio" />
                    <p className="tiny-copy">
                      {formatBytes(sourceFile.size)} · {sourceBuffer ? `${sourceBuffer.numberOfChannels}ch, ${sourceBuffer.sampleRate}Hz, ${formatTime(sourceBuffer.duration)}` : ''}
                    </p>
                  </>
                )}
              </div>
              <input
                id="audio-converter-import"
                ref={fileInputRef}
                type="file"
                accept="audio/*,.mp3,.wav,.ogg,.flac,.m4a,.aac,.webm"
                hidden
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImportFile(f); e.target.value = ''; }}
              />
            </section>

            {/* Settings */}
            <section className="tool-card">
              <div className="tool-card-header">
                <div>
                  <span className="card-caption">Settings</span>
                  <h3>Conversion Parameters</h3>
                </div>
              </div>
              <div className="form-grid two-column">
                <label className="field">
                  <span>Output Format</span>
                  <select className="settings-input tool-select" value={outputFormat} onChange={(e) => { playSound('buttonClick'); setOutputFormat(e.target.value as typeof outputFormat); }}>
                    {supportedFormats.map((f) => (
                      <option key={f.key} value={f.key}>{f.label}</option>
                    ))}
                  </select>
                </label>
                <label className="field">
                  <span>Sample Rate</span>
                  <select className="settings-input tool-select" value={sampleRate} onChange={(e) => { playSound('buttonClick'); setSampleRate(e.target.value as typeof sampleRate); }}>
                    <option value="original">Original</option>
                    <option value="22050">22050 Hz</option>
                    <option value="44100">44100 Hz</option>
                    <option value="48000">48000 Hz</option>
                    <option value="96000">96000 Hz</option>
                    <option value="192000">192000 Hz</option>
                  </select>
                </label>
                <label className="field">
                  <span>Channels</span>
                  <select className="settings-input tool-select" value={channels} onChange={(e) => { playSound('buttonClick'); setChannels(e.target.value as typeof channels); }}>
                    <option value="original">Original</option>
                    <option value="mono">Mono</option>
                    <option value="stereo">Stereo</option>
                  </select>
                </label>
                <label className="field">
                  <span>Volume ({volume}%)</span>
                  <input className="tool-range" type="range" min="0" max="200" step="1" value={volume} onChange={(e) => { playSliderThrottled(); setVolume(Number(e.target.value)); }} />
                </label>
                <label className="field">
                  <span>Speed ({speed}%)</span>
                  <input className="tool-range" type="range" min="25" max="400" step="1" value={speed} onChange={(e) => { playSliderThrottled(); setSpeed(Number(e.target.value)); }} />
                </label>
                <label className="field">
                  <span>Pitch ({pitch > 0 ? '+' : ''}{pitch} cents)</span>
                  <input className="tool-range" type="range" min="-1200" max="1200" step="10" value={pitch} onChange={(e) => { playSliderThrottled(); setPitch(Number(e.target.value)); }} />
                </label>
                <label className="field">
                  <span>Fade In ({fadeIn}s)</span>
                  <input className="tool-range" type="range" min="0" max="10" step="0.1" value={fadeIn} onChange={(e) => { playSliderThrottled(); setFadeIn(Number(e.target.value)); }} />
                </label>
                <label className="field">
                  <span>Fade Out ({fadeOut}s)</span>
                  <input className="tool-range" type="range" min="0" max="10" step="0.1" value={fadeOut} onChange={(e) => { playSliderThrottled(); setFadeOut(Number(e.target.value)); }} />
                </label>
                <label className="field">
                  <span>Noise Reduction ({noiseReduction}%)</span>
                  <input className="tool-range" type="range" min="0" max="100" step="1" value={noiseReduction} onChange={(e) => { playSliderThrottled(); setNoiseReduction(Number(e.target.value)); }} />
                </label>
              </div>

              <div className="toggle-grid">
                <button className={`toggle-chip ${doNormalize ? 'active' : ''}`} type="button" aria-pressed={doNormalize} onClick={() => { playSound(doNormalize ? 'toggleOff' : 'toggleOn'); setDoNormalize((v) => !v); }}>
                  <span className="toggle-chip-dot" />
                  Normalize Peak
                </button>
              </div>

              <div className="tool-actions-row">
                <button className="primary-button" type="button" onClick={handleConvert} disabled={!sourceBuffer || isConverting || isImporting}>
                  {isConverting ? `Converting ${convertProgress}%…` : 'Convert'}
                </button>
                <button className="secondary-button" type="button" onClick={handleDownload} disabled={!resultUrl}>
                  Download
                </button>
              </div>

              {(isConverting || convertProgress > 0) && (
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${convertProgress}%` }} />
                </div>
              )}
            </section>
          </div>

          <div className="tool-column side">
            {/* Results panel */}
            <section className="tool-card">
              <div
                className="tool-card-header collapsible"
                onClick={() => { playSound(isResultOpen ? 'collapse' : 'expand'); setIsResultOpen((v) => !v); }}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); playSound(isResultOpen ? 'collapse' : 'expand'); setIsResultOpen((v) => !v); } }}
                role="button"
                tabIndex={0}
                aria-expanded={isResultOpen}
              >
                <div>
                  <span className="card-caption">Results</span>
                  <h3>{resultUrl ? 'Converted File' : 'No exports yet'}</h3>
                </div>
                <span className="collapsible-state">{isResultOpen ? 'Hide' : 'Show'}</span>
              </div>
              {isResultOpen && (
                <div>
                  {resultUrl ? (
                    <>
                      <audio key={resultUrl} controls src={resultUrl} className="tool-audio" aria-label="Converted audio" />
                      <div className="progress-meta">
                        <span>Format</span>
                        <strong>{resultFormat}</strong>
                        <span>Size</span>
                        <strong>{formatBytes(resultBlob?.size || 0)}</strong>
                      </div>
                    </>
                  ) : (
                    <p className="tiny-copy empty-state">Select a format and click Convert.</p>
                  )}
                </div>
              )}
            </section>

            {/* Logs panel */}
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
                  <span className="card-caption">Debug</span>
                  <h3>Workflow Logs ({logs.length})</h3>
                </div>
                <span className="collapsible-state">{isLogsOpen ? 'Hide' : 'Show'}</span>
              </div>
              {isLogsOpen && (
                <>
                  <div className="tool-header-actions" style={{ marginBottom: 8 }}>
                    <button className="secondary-button small-button" type="button" disabled={logs.length === 0} onClick={async () => { const ok = await copyText(logsText); playSound(ok ? 'copySound' : 'error'); if (!ok) addLog('error', 'Clipboard access denied'); }}>Copy</button>
                    <button className="secondary-button small-button" type="button" disabled={logs.length === 0} onClick={() => { downloadText('converter-logs.txt', logsText); playSound('downloadSound'); }}>Download</button>
                    <button className="secondary-button small-button" type="button" disabled={logs.length === 0} onClick={() => { playSound('deleteSound'); setLogs([]); }}>Clear</button>
                  </div>
                  <div className="log-scroll" aria-live="polite" aria-atomic="false">
                    {logs.length === 0 ? (
                      <p className="tiny-copy empty-state">No logs yet.</p>
                    ) : (
                      logs.map((l, i) => (
                        <div key={`${l.time}-${i}`} className={`log-line log-${l.level}`}>
                          <span className="log-time">{l.time}</span>
                          <span className={`log-badge ${l.level}`}>{l.level}</span>
                          <span className="log-text">{l.text}</span>
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

      {_settings.others?.showErrorPanel && showErrorPanel && error && (
        <DraggableErrorPanel
          error={{ code: error.code, stage: 'audio-converter', message: error.message, hint: error.hint, details: {} }}
          labels={{ title: 'Error', stage: 'Stage', message: 'Message', hint: 'Hint', details: 'Details', copyText: 'Copy', downloadJson: 'Download JSON', openDocs: 'Open Docs', retry: 'Retry' }}
          onClose={() => { playSound('back'); setShowErrorPanel(false); }}
          onCopy={() => { playSound('copySound'); navigator.clipboard.writeText(`${error.code}: ${error.message}`).catch(() => {}); }}
          onDownload={() => { playSound('downloadSound'); const blob = new Blob([JSON.stringify(error, null, 2)], { type: 'application/json' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'audio-converter-error.json'; a.click(); window.setTimeout(() => URL.revokeObjectURL(url), 100); }}
          onRetry={() => { playSound('confirm'); setShowErrorPanel(false); handleConvert(); }}
          onOpenDocs={(code) => { playSound('buttonClick'); onOpenDocs?.('audio-converter', 'errors', code); }}
          docAnchor={error.code}
        />
      )}
    </main>
  );
}