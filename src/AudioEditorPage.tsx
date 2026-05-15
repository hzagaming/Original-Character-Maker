import { useCallback, useEffect, useRef, useState } from 'react';
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
/*  Utilities                                                          */
/* ------------------------------------------------------------------ */

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return '0:00.000';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 1000);
  return `${m}:${String(s).padStart(2, '0')}.${String(ms).padStart(3, '0')}`;
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
  const trimmed = new AudioBuffer({
    numberOfChannels: buffer.numberOfChannels,
    length: len,
    sampleRate,
  });
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
  const result = new AudioBuffer({
    numberOfChannels: buffer.numberOfChannels,
    length: buffer.length,
    sampleRate: buffer.sampleRate,
  });
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

function audioBufferToWav(buffer: AudioBuffer): Blob {
  const numOfChan = buffer.numberOfChannels;
  const length = buffer.length * numOfChan * 2 + 44;
  const arr = new ArrayBuffer(length);
  const view = new DataView(arr);
  const channels: Float32Array[] = [];
  let offset = 0;
  let pos = 0;

  function setUint16(data: number) { view.setUint16(pos, data, true); pos += 2; }
  function setUint32(data: number) { view.setUint32(pos, data, true); pos += 4; }

  setUint32(0x46464952); // "RIFF"
  setUint32(length - 8); // file length - 8
  setUint32(0x45564157); // "WAVE"
  setUint32(0x20746d66); // "fmt " chunk
  setUint32(16); // length = 16
  setUint16(1); // PCM (uncompressed)
  setUint16(numOfChan);
  setUint32(buffer.sampleRate);
  setUint32(buffer.sampleRate * 2 * numOfChan); // avg. bytes/sec
  setUint16(numOfChan * 2); // block-align
  setUint16(16); // 16-bit (hardcoded in this demo)
  setUint32(0x61746164); // "data" - chunk
  setUint32(length - pos - 4); // chunk length

  for (let i = 0; i < buffer.numberOfChannels; i++) channels.push(buffer.getChannelData(i));

  while (pos < length) {
    for (let i = 0; i < numOfChan; i++) {
      let sample = Math.max(-1, Math.min(1, channels[i][offset]));
      sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0;
      view.setInt16(pos, sample, true);
      pos += 2;
    }
    offset++;
  }

  return new Blob([arr], { type: 'audio/wav' });
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

  /* ---- Error panel ---- */
  const [errors, setErrors] = useState<{ code: string; message: string; hint: string }[]>([]);

  /* ---- Refs for audio processing ---- */
  const gainNodeRef = useRef<GainNode | null>(null);
  const panNodeRef = useRef<StereoPannerNode | null>(null);

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
  /*  Audio import                                                       */
  /* ================================================================== */
  const handleImport = useCallback(
    async (file: File) => {
      try {
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

        const canvas = canvasRef.current;
        if (canvas) {
          const w = canvas.width || canvas.clientWidth || 800;
          const newPeaks = generateWaveformData(decoded, w);
          setPeaks(newPeaks);
        }
      } catch (err) {
        setErrors([{ code: 'IMPORT_FAILED', message: 'Failed to decode audio file', hint: String(err) }]);
      }
    },
    []
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
        const dur = 0.5 + (reverbSize / 100) * 3.5; // 0.5s to 4s
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

      // Connect chain: source -> EQ -> compressor -> [dry + wet(reverb)] -> gain -> panner -> destination
      source.connect(eqLowNode).connect(eqMidNode).connect(eqHighNode).connect(compNode);
      compNode.connect(dryGain).connect(gain);
      compNode.connect(convolver).connect(wetGain).connect(gain);
      gain.connect(panner).connect(audioCtx.destination);

      source.start(0, offset);
      sourceRef.current = source;
      playStartTimeRef.current = audioCtx.currentTime;
      playOffsetRef.current = offset;
      setIsPlaying(true);

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
        if (!isLoop) stopPlayback();
      };
    },
    [audioCtx, editBuffer, speed, pitch, isLoop, selection, volume, isMuted, pan, stopPlayback, eqLow, eqMid, eqHigh, compThreshold, compRatio, compAttack, compRelease, reverbSize, reverbDamp, reverbMix]
  );

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      stopPlayback();
      if (audioCtx) playOffsetRef.current = currentTime;
    } else {
      startPlayback(currentTime);
    }
  }, [isPlaying, currentTime, audioCtx, startPlayback, stopPlayback]);

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
          break;
        }
        case 'split': {
          if (!selection) return;
          const [left] = splitAt(editBuffer, selection.start);
          result = left;
          setSelection(null);
          setCurrentTime(0);
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
          break;
        }
        case 'reverse': {
          result = applyReverse(editBuffer);
          break;
        }
        case 'fade': {
          result = applyFade(editBuffer, fadeIn, fadeOut);
          break;
        }
        case 'normalize': {
          result = normalizeBuffer(editBuffer);
          break;
        }
        case 'mono': {
          result = mixToMono(editBuffer);
          break;
        }
        default:
          return;
      }

      pushHistory(result);
    },
    [editBuffer, selection, fadeIn, fadeOut, pushHistory]
  );

  const undo = useCallback(() => {
    if (historyIdx > 0) {
      const idx = historyIdx - 1;
      setHistoryIdx(idx);
      setEditBuffer(history[idx]);
      setDuration(history[idx].duration);
    }
  }, [history, historyIdx]);

  const redo = useCallback(() => {
    if (historyIdx < history.length - 1) {
      const idx = historyIdx + 1;
      setHistoryIdx(idx);
      setEditBuffer(history[idx]);
      setDuration(history[idx].duration);
    }
  }, [history, historyIdx]);

  /* ================================================================== */
  /*  Export                                                             */
  /* ================================================================== */
  const handleExport = useCallback(
    async (format: 'wav') => {
      if (!editBuffer) return;
      let output = editBuffer;

      // Apply effects pipeline
      if (fadeIn > 0 || fadeOut > 0) output = applyFade(output, fadeIn, fadeOut);
      if (isReversed) output = applyReverse(output);
      if (doNormalize) output = normalizeBuffer(output);

      const blob = audioBufferToWav(output);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName.replace(/\.[^.]+$/, '') + '_edited.wav';
      a.click();
      URL.revokeObjectURL(url);
    },
    [editBuffer, fadeIn, fadeOut, isReversed, doNormalize, fileName]
  );

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
        // Zoom
        const newZoom = Math.max(1, Math.min(50, zoom + (e.deltaY > 0 ? 1 : -1) * Math.max(1, zoom * 0.1)));
        setZoom(newZoom);
      } else {
        // Pan
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
          <button className="back-button" type="button" onClick={onBack} aria-label={backHome}>
            ←
          </button>
          <div>
            <h1 className="page-title">{pageTitle}</h1>
            <p className="page-subtitle">{pageDescription}</p>
          </div>
        </div>
        <button className="settings-trigger" type="button" onClick={onOpenSettings} aria-label={openSettings}>
          ⚙
        </button>
      </header>

      <main className="page-body">
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
              <button className="secondary-button small-button" type="button" onClick={() => applyEdit('trim')} disabled={!selection}>
                ✂ Trim
              </button>
              <button className="secondary-button small-button" type="button" onClick={() => applyEdit('split')} disabled={!selection}>
                ✂ Split
              </button>
              <button className="secondary-button small-button" type="button" onClick={() => applyEdit('delete')} disabled={!selection}>
                🗑 Delete
              </button>
              <button className="secondary-button small-button" type="button" onClick={() => applyEdit('duplicate')} disabled={!selection}>
                📋 Duplicate
              </button>
              <button className="secondary-button small-button" type="button" onClick={() => applyEdit('reverse')}>
                🔀 Reverse
              </button>
              <button className="secondary-button small-button" type="button" onClick={() => applyEdit('fade')}>
                📉 Fade
              </button>
              <button className="secondary-button small-button" type="button" onClick={() => applyEdit('normalize')}>
                📈 Normalize
              </button>
              <button className="secondary-button small-button" type="button" onClick={() => applyEdit('mono')}>
                🔊 Mono
              </button>
              <button className="primary-button small-button" type="button" onClick={() => handleExport('wav')}>
                💾 Export WAV
              </button>
              <input
                type="file"
                accept="audio/*"
                hidden
                id="audio-reimport"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImport(f); }}
              />
              <label htmlFor="audio-reimport" className="secondary-button small-button" style={{ cursor: 'pointer' }}>
                📁 New File
              </label>
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
