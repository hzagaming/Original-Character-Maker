// Original Character Maker — Web Audio API Sound Engine v2
// 20 synthesized sound presets, fully parametric, zero external assets.

import type { AudioSettings, MusicPreset } from './types';

export type SoundName =
  | 'buttonClick' | 'buttonHover' | 'toggleOn' | 'toggleOff' | 'sliderChange'
  | 'modalOpen' | 'modalClose' | 'success' | 'error' | 'warning' | 'info'
  | 'save' | 'pageSwitch' | 'cardHover' | 'inputFocus' | 'keyPress'
  | 'deleteSound' | 'undo' | 'redo' | 'uploadStart' | 'uploadComplete'
  | 'downloadSound' | 'tick' | 'workflowStart' | 'workflowComplete'
  | 'workflowFail' | 'settingsOpen' | 'settingsClose' | 'copySound'
  | 'pasteSound' | 'drop' | 'scrollEnd' | 'search' | 'refresh' | 'confirm'
  | 'back' | 'expand' | 'collapse' | 'select' | 'deselect' | 'datePick'
  | 'timePick' | 'colorPick' | 'fontSwitch' | 'langSwitch' | 'themeSwitch'
  | 'depthSwitch' | 'accentSwitch' | 'presetSwitch' | 'resetSound'
  | 'shortcutPress' | 'shortcutConflict' | 'shortcutSet' | 'apiConnect'
  | 'apiFail' | 'imagePreview' | 'imageProcess' | 'exportStart' | 'fullscreen';

export type SoundPreset =
  | 'classic' | 'electronic' | 'retro' | 'xylophone' | 'bell'
  | 'space' | 'drum' | 'piano' | 'synthwave' | 'chiptune'
  | 'strings' | 'wind' | 'jazz' | 'percussion' | 'ambient'
  | 'scifi' | 'cartoon' | 'horror' | 'nature' | 'mechanical';

export const defaultAudioSettings: AudioSettings = {
  masterVolume: 80,
  sfxVolume: 70,
  musicVolume: 30,
  sfxEnabled: true,
  musicEnabled: false,
  soundOnInteract: true,
  sfxPreset: 'classic',
  musicPreset: 'orchestral',
  sfxPitch: 0,
  sfxDurationScale: 100,
  sfxFilterFreq: 5000,
  sfxDetune: 0,
  sfxReverb: 20,
  musicPitch: 0,
  musicTempo: 100,
  sfxAttack: 5,
  sfxDecay: 50,
  sfxSustain: 40,
  sfxRelease: 30,
  sfxPan: 0,
  musicReverb: 30,
  musicFilter: 5000,
  musicStereoWidth: 80,
  useCustomSfx: false,
  useCustomMusic: false,
  customSfxDataUrl: null,
  customMusicDataUrl: null,
  customSfxName: '',
  customMusicName: '',
};

// ─── Preset synthesis parameters ───
interface PresetParams {
  waveform: OscillatorType;
  altWaveform?: OscillatorType; // for layered sounds
  attack: number;
  decay: number;
  sustain: number;
  release: number;
  filterType: BiquadFilterType;
  filterFreqBase: number;
  filterQ: number;
  detune: number;
  harmonics: number; // 0~3 extra oscillators
  noiseMix: number;  // 0~1
  noiseFilterFreq: number;
}

const PRESETS: Record<SoundPreset, PresetParams> = {
  classic:      { waveform:'sine',    attack:0.005, decay:0.08, sustain:0.3, release:0.1,  filterType:'lowpass', filterFreqBase:8000,  filterQ:0.5, detune:0,  harmonics:0, noiseMix:0,   noiseFilterFreq:2000 },
  electronic:   { waveform:'square',  attack:0.002, decay:0.12, sustain:0.2, release:0.15, filterType:'lowpass', filterFreqBase:4000,  filterQ:2.0, detune:8,  harmonics:1, noiseMix:0.1, noiseFilterFreq:3000 },
  retro:        { waveform:'square',  attack:0.001, decay:0.06, sustain:0.1, release:0.05, filterType:'lowpass', filterFreqBase:2500,  filterQ:0.3, detune:0,  harmonics:0, noiseMix:0,   noiseFilterFreq:1000 },
  xylophone:    { waveform:'sine',    attack:0.001, decay:0.15, sustain:0.0, release:0.08, filterType:'highpass',filterFreqBase:600,   filterQ:1.0, detune:5,  harmonics:2, noiseMix:0.05,noiseFilterFreq:4000 },
  bell:         { waveform:'sine',    attack:0.002, decay:0.4,  sustain:0.1, release:0.6,  filterType:'bandpass',filterFreqBase:3000,  filterQ:3.0, detune:12, harmonics:2, noiseMix:0.1, noiseFilterFreq:5000 },
  space:        { waveform:'sine',    attack:0.05,  decay:0.3,  sustain:0.4, release:0.8,  filterType:'lowpass', filterFreqBase:2000,  filterQ:1.5, detune:20, harmonics:1, noiseMix:0.2, noiseFilterFreq:800  },
  drum:         { waveform:'sine',    attack:0.001, decay:0.08, sustain:0.0, release:0.05, filterType:'lowpass', filterFreqBase:1200,  filterQ:0.5, detune:0,  harmonics:0, noiseMix:0.6, noiseFilterFreq:4000 },
  piano:        { waveform:'triangle',attack:0.003, decay:0.2,  sustain:0.15,release:0.25, filterType:'lowpass', filterFreqBase:6000,  filterQ:0.8, detune:3,  harmonics:1, noiseMix:0.02,noiseFilterFreq:3000 },
  synthwave:    { waveform:'sawtooth',attack:0.02,  decay:0.15, sustain:0.3, release:0.3,  filterType:'lowpass', filterFreqBase:3500,  filterQ:2.5, detune:15, harmonics:1, noiseMix:0.05,noiseFilterFreq:2000 },
  chiptune:     { waveform:'square',  attack:0.001, decay:0.05, sustain:0.05,release:0.03, filterType:'lowpass', filterFreqBase:4000,  filterQ:0.3, detune:0,  harmonics:0, noiseMix:0,   noiseFilterFreq:1000 },
  strings:      { waveform:'sawtooth',attack:0.08,  decay:0.3,  sustain:0.5, release:0.5,  filterType:'lowpass', filterFreqBase:2500,  filterQ:1.2, detune:25, harmonics:2, noiseMix:0.1, noiseFilterFreq:1500 },
  wind:         { waveform:'sine',    attack:0.1,   decay:0.2,  sustain:0.6, release:0.6,  filterType:'bandpass',filterFreqBase:1500,  filterQ:2.0, detune:30, harmonics:1, noiseMix:0.3, noiseFilterFreq:600  },
  jazz:         { waveform:'sawtooth',attack:0.01,  decay:0.18, sustain:0.3, release:0.2,  filterType:'lowpass', filterFreqBase:3000,  filterQ:1.8, detune:10, harmonics:1, noiseMix:0.08,noiseFilterFreq:2500 },
  percussion:   { waveform:'triangle',attack:0.001, decay:0.06, sustain:0.0, release:0.04, filterType:'highpass',filterFreqBase:800,   filterQ:0.6, detune:0,  harmonics:0, noiseMix:0.4, noiseFilterFreq:5000 },
  ambient:      { waveform:'sine',    attack:0.15,  decay:0.4,  sustain:0.5, release:1.0,  filterType:'lowpass', filterFreqBase:1500,  filterQ:0.8, detune:35, harmonics:2, noiseMix:0.15,noiseFilterFreq:700  },
  scifi:        { waveform:'sawtooth',attack:0.005, decay:0.12, sustain:0.2, release:0.2,  filterType:'bandpass',filterFreqBase:2500,  filterQ:4.0, detune:50, harmonics:1, noiseMix:0.2, noiseFilterFreq:3000 },
  cartoon:      { waveform:'triangle',attack:0.001, decay:0.08, sustain:0.1, release:0.1,  filterType:'lowpass', filterFreqBase:5000,  filterQ:0.5, detune:20, harmonics:0, noiseMix:0,   noiseFilterFreq:2000 },
  horror:       { waveform:'sawtooth',attack:0.05,  decay:0.4,  sustain:0.2, release:0.6,  filterType:'lowpass', filterFreqBase:800,   filterQ:3.0, detune:40, harmonics:2, noiseMix:0.3, noiseFilterFreq:400  },
  nature:       { waveform:'sine',    attack:0.03,  decay:0.25, sustain:0.3, release:0.4,  filterType:'bandpass',filterFreqBase:2000,  filterQ:1.5, detune:18, harmonics:1, noiseMix:0.1, noiseFilterFreq:1200 },
  mechanical:   { waveform:'square',  attack:0.002, decay:0.04, sustain:0.05,release:0.06, filterType:'lowpass', filterFreqBase:2000,  filterQ:0.4, detune:5,  harmonics:1, noiseMix:0.3, noiseFilterFreq:1500 },
};

// ─── Runtime state ───
let ctx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let sfxGain: GainNode | null = null;
let musicGain: GainNode | null = null;
let musicLimiter: DynamicsCompressorNode | null = null;
// music state declared below in music engine section
let currentSettings: AudioSettings = { ...defaultAudioSettings };

function ensureContext(): AudioContext {
  if (!ctx) {
    ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    masterGain = ctx.createGain();
    masterGain.connect(ctx.destination);
    sfxGain = ctx.createGain();
    sfxGain.connect(masterGain);
    musicGain = ctx.createGain();
    // Music limiter: prevents multi-voice clipping
    musicLimiter = ctx.createDynamicsCompressor();
    musicLimiter.threshold.value = -14;
    musicLimiter.knee.value = 8;
    musicLimiter.ratio.value = 8;
    musicLimiter.attack.value = 0.002;
    musicLimiter.release.value = 0.1;
    musicGain.connect(musicLimiter);
    musicLimiter.connect(masterGain);
    applyVolumes();
  }
  if (ctx.state === 'suspended') {
    ctx.resume();
  }
  return ctx;
}

function now() {
  return ensureContext().currentTime;
}

function applyVolumes() {
  if (!masterGain || !sfxGain || !musicGain) return;
  const m = currentSettings.masterVolume / 100;
  masterGain.gain.setValueAtTime(m, ctx!.currentTime);
  sfxGain.gain.setValueAtTime(currentSettings.sfxEnabled ? (currentSettings.sfxVolume / 100) * m : 0, ctx!.currentTime);
  musicGain.gain.setValueAtTime(currentSettings.musicEnabled ? (currentSettings.musicVolume / 100) * m : 0, ctx!.currentTime);
  if (customSfxAudio) customSfxAudio.volume = (currentSettings.sfxVolume / 100) * m;
  if (customMusicAudio) customMusicAudio.volume = (currentSettings.musicVolume / 100) * m;
}

export function updateAudioSettings(next: Partial<AudioSettings>) {
  const wasMusicOn = currentSettings.musicEnabled;
  const oldMusicPreset = currentSettings.musicPreset;
  const oldUseCustomMusic = currentSettings.useCustomMusic;
  const oldMusicTempo = currentSettings.musicTempo;
  const oldMusicPitch = currentSettings.musicPitch;
  currentSettings = { ...currentSettings, ...next };
  applyVolumes();
  const musicChanged =
    oldMusicPreset !== currentSettings.musicPreset ||
    oldUseCustomMusic !== currentSettings.useCustomMusic ||
    oldMusicTempo !== currentSettings.musicTempo ||
    oldMusicPitch !== currentSettings.musicPitch;
  if (currentSettings.musicEnabled && (!wasMusicOn || musicChanged)) {
    stopMusic();
    startMusic();
  } else if (!currentSettings.musicEnabled && wasMusicOn) {
    stopMusic();
  }
}

export function getAudioSettings(): AudioSettings {
  return { ...currentSettings };
}

// ─── Reverb helper ───
function createReverbMix(input: AudioNode, dryGain: number, wetGain: number, decay: number): { mix: AudioNode; nodes: AudioNode[]; convolver: ConvolverNode } {
  const c = ensureContext();
  const convolver = c.createConvolver();
  const rate = c.sampleRate;
  const length = Math.floor(rate * decay);
  const impulse = c.createBuffer(2, length, rate);
  for (let ch = 0; ch < 2; ch++) {
    const data = impulse.getChannelData(ch);
    for (let i = 0; i < length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2);
    }
  }
  convolver.buffer = impulse;

  const dry = c.createGain();
  dry.gain.value = dryGain;
  const wet = c.createGain();
  wet.gain.value = wetGain;

  input.connect(dry);
  input.connect(convolver);
  convolver.connect(wet);

  const mix = c.createGain();
  dry.connect(mix);
  wet.connect(mix);
  return { mix, nodes: [convolver, dry, wet, mix], convolver };
}

// ─── Core synthesis engine ───
function synthesize(params: {
  baseFreq: number;
  duration: number;
  gain: number;
  pitch?: number;
  slideTo?: number;
  chord?: number[];
}) {
  const { baseFreq, duration, gain, pitch = 0, slideTo, chord } = params;
  const preset = PRESETS[currentSettings.sfxPreset];
  const c = ensureContext();
  const when = now();

  const pitchRatio = Math.pow(2, (currentSettings.sfxPitch + pitch) / 1200);
  const durScale = currentSettings.sfxDurationScale / 100;
  const actualDuration = duration * durScale;
  const detuneTotal = preset.detune + currentSettings.sfxDetune;
  const filterFreq = Math.min(currentSettings.sfxFilterFreq * preset.filterFreqBase / 5000, c.sampleRate / 2);
  const reverbWet = currentSettings.sfxReverb / 100;

  const freqs = chord ? chord.map((f) => f * pitchRatio) : [baseFreq * pitchRatio];

  const rootGain = c.createGain();
  rootGain.gain.value = 0;
  const nodesToCleanup: AudioNode[] = [rootGain];

  freqs.forEach((f, fi) => {
    const voiceGain = c.createGain();
    voiceGain.gain.value = gain * (1 - fi * 0.08);
    nodesToCleanup.push(voiceGain);

    const oscs: OscillatorNode[] = [];
    // primary
    const osc = c.createOscillator();
    osc.type = preset.waveform;
    osc.frequency.setValueAtTime(f, when);
    if (slideTo) {
      osc.frequency.exponentialRampToValueAtTime(slideTo * pitchRatio, when + actualDuration);
    }
    osc.detune.value = detuneTotal;
    oscs.push(osc);

    // harmonics
    for (let h = 1; h <= preset.harmonics; h++) {
      const ho = c.createOscillator();
      ho.type = preset.altWaveform || preset.waveform;
      ho.frequency.setValueAtTime(f * (h + 1), when);
      ho.detune.value = detuneTotal * (h + 1);
      oscs.push(ho);
    }

    const filter = c.createBiquadFilter();
    filter.type = preset.filterType;
    filter.frequency.setValueAtTime(filterFreq, when);
    filter.Q.value = preset.filterQ;
    nodesToCleanup.push(filter);

    oscs.forEach((o) => {
      o.connect(filter);
      o.start(when);
      o.stop(when + actualDuration + preset.release + 0.01);
      nodesToCleanup.push(o);
    });
    filter.connect(voiceGain);
    voiceGain.connect(rootGain);
  });

  // noise
  if (preset.noiseMix > 0) {
    const bufferSize = Math.floor(c.sampleRate * actualDuration);
    const buffer = c.createBuffer(1, bufferSize, c.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noiseSrc = c.createBufferSource();
    noiseSrc.buffer = buffer;
    const noiseFilter = c.createBiquadFilter();
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.value = preset.noiseFilterFreq;
    const noiseGain = c.createGain();
    noiseGain.gain.value = gain * preset.noiseMix;
    noiseSrc.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(rootGain);
    noiseSrc.start(when);
    noiseSrc.stop(when + actualDuration + 0.01);
    nodesToCleanup.push(noiseSrc, noiseFilter, noiseGain);
  }

  // ADSR envelope on rootGain
  const atk = preset.attack;
  const dec = preset.decay;
  const sus = preset.sustain;
  const rel = preset.release;

  rootGain.gain.setValueAtTime(0, when);
  rootGain.gain.linearRampToValueAtTime(1, when + Math.min(atk, actualDuration * 0.2));
  rootGain.gain.exponentialRampToValueAtTime(Math.max(sus, 0.001), when + Math.min(atk + dec, actualDuration * 0.6));
  rootGain.gain.setValueAtTime(Math.max(sus, 0.001), when + actualDuration);
  rootGain.gain.exponentialRampToValueAtTime(0.0001, when + actualDuration + rel);

  let output: AudioNode = rootGain;
  let reverbConvolver: ConvolverNode | null = null;
  if (reverbWet > 0) {
    const reverb = createReverbMix(rootGain, 1 - reverbWet * 0.5, reverbWet * 0.5, 1.5);
    output = reverb.mix;
    nodesToCleanup.push(...reverb.nodes);
    reverbConvolver = reverb.convolver;
  }
  output.connect(sfxGain!);

  const cleanupDelay = actualDuration + rel + 0.5;
  setTimeout(() => {
    try {
      nodesToCleanup.forEach((n) => n.disconnect());
      if (output !== rootGain) {
        output.disconnect();
      }
      if (reverbConvolver) {
        reverbConvolver.buffer = null;
      }
    } catch {
      // ignore already-disconnected nodes
    }
  }, cleanupDelay * 1000);
}

// ─── Sound event definitions ───
// Each event maps to base frequencies / patterns. The preset shapes the timbre.
const EVENTS: Record<SoundName, () => void> = {
  buttonClick: () => synthesize({ baseFreq: 880, duration: 0.06, gain: 0.15 }),
  buttonHover: () => synthesize({ baseFreq: 1400, duration: 0.03, gain: 0.04 }),
  toggleOn: () => synthesize({ baseFreq: 400, duration: 0.1, gain: 0.12, slideTo: 800 }),
  toggleOff: () => synthesize({ baseFreq: 800, duration: 0.1, gain: 0.12, slideTo: 400 }),
  sliderChange: () => synthesize({ baseFreq: 1200, duration: 0.02, gain: 0.06 }),
  modalOpen: () => {
    synthesize({ baseFreq: 200, duration: 0.18, gain: 0.12, slideTo: 600 });
    synthesize({ baseFreq: 300, duration: 0.15, gain: 0.06, slideTo: 500 });
  },
  modalClose: () => {
    synthesize({ baseFreq: 600, duration: 0.15, gain: 0.1, slideTo: 200 });
    synthesize({ baseFreq: 500, duration: 0.12, gain: 0.05, slideTo: 300 });
  },
  success: () => synthesize({ baseFreq: 523.25, duration: 0.35, gain: 0.14, chord: [523.25, 659.25, 783.99] }),
  error: () => {
    synthesize({ baseFreq: 150, duration: 0.25, gain: 0.18 });
    synthesize({ baseFreq: 120, duration: 0.25, gain: 0.14 });
  },
  warning: () => {
    synthesize({ baseFreq: 600, duration: 0.12, gain: 0.08 });
    synthesize({ baseFreq: 500, duration: 0.12, gain: 0.08 });
  },
  info: () => synthesize({ baseFreq: 2000, duration: 0.08, gain: 0.07 }),
  save: () => {
    synthesize({ baseFreq: 880, duration: 0.1, gain: 0.1 });
    synthesize({ baseFreq: 1100, duration: 0.1, gain: 0.1 });
  },
  pageSwitch: () => synthesize({ baseFreq: 400, duration: 0.12, gain: 0.08, slideTo: 800 }),
  cardHover: () => synthesize({ baseFreq: 600, duration: 0.04, gain: 0.03 }),
  inputFocus: () => synthesize({ baseFreq: 1600, duration: 0.03, gain: 0.04 }),
  keyPress: () => {
    // noise-like keypress
    synthesize({ baseFreq: 3000, duration: 0.02, gain: 0.06 });
  },
  deleteSound: () => synthesize({ baseFreq: 800, duration: 0.1, gain: 0.08, slideTo: 200 }),
  undo: () => synthesize({ baseFreq: 600, duration: 0.1, gain: 0.07, slideTo: 300 }),
  redo: () => synthesize({ baseFreq: 300, duration: 0.1, gain: 0.07, slideTo: 600 }),
  uploadStart: () => synthesize({ baseFreq: 300, duration: 0.15, gain: 0.08, slideTo: 500 }),
  uploadComplete: () => {
    synthesize({ baseFreq: 660, duration: 0.1, gain: 0.1 });
    synthesize({ baseFreq: 880, duration: 0.1, gain: 0.1 });
  },
  downloadSound: () => {
    synthesize({ baseFreq: 880, duration: 0.08, gain: 0.08 });
    synthesize({ baseFreq: 660, duration: 0.08, gain: 0.08 });
  },
  tick: () => synthesize({ baseFreq: 2000, duration: 0.015, gain: 0.05 }),
  workflowStart: () => {
    synthesize({ baseFreq: 200, duration: 0.2, gain: 0.12, slideTo: 400 });
    synthesize({ baseFreq: 300, duration: 0.18, gain: 0.08, slideTo: 500 });
  },
  workflowComplete: () => synthesize({ baseFreq: 523.25, duration: 0.5, gain: 0.13, chord: [523.25, 659.25, 783.99, 1046.5] }),
  workflowFail: () => synthesize({ baseFreq: 400, duration: 0.3, gain: 0.1, slideTo: 150 }),
  settingsOpen: () => synthesize({ baseFreq: 300, duration: 0.15, gain: 0.08, slideTo: 500 }),
  settingsClose: () => synthesize({ baseFreq: 500, duration: 0.12, gain: 0.07, slideTo: 300 }),
  copySound: () => synthesize({ baseFreq: 1000, duration: 0.04, gain: 0.06 }),
  pasteSound: () => synthesize({ baseFreq: 800, duration: 0.05, gain: 0.06 }),
  drop: () => synthesize({ baseFreq: 300, duration: 0.1, gain: 0.1 }),
  scrollEnd: () => synthesize({ baseFreq: 400, duration: 0.06, gain: 0.05 }),
  search: () => synthesize({ baseFreq: 800, duration: 0.08, gain: 0.06, slideTo: 1200 }),
  refresh: () => synthesize({ baseFreq: 600, duration: 0.1, gain: 0.07, slideTo: 1000 }),
  confirm: () => synthesize({ baseFreq: 600, duration: 0.1, gain: 0.1 }),
  back: () => synthesize({ baseFreq: 500, duration: 0.1, gain: 0.07, slideTo: 300 }),
  expand: () => synthesize({ baseFreq: 300, duration: 0.1, gain: 0.06, slideTo: 500 }),
  collapse: () => synthesize({ baseFreq: 500, duration: 0.1, gain: 0.06, slideTo: 300 }),
  select: () => synthesize({ baseFreq: 1200, duration: 0.03, gain: 0.05 }),
  deselect: () => synthesize({ baseFreq: 800, duration: 0.03, gain: 0.04 }),
  datePick: () => synthesize({ baseFreq: 700, duration: 0.04, gain: 0.05 }),
  timePick: () => synthesize({ baseFreq: 900, duration: 0.04, gain: 0.05 }),
  colorPick: () => synthesize({ baseFreq: 1000, duration: 0.03, gain: 0.04 }),
  fontSwitch: () => synthesize({ baseFreq: 500, duration: 0.06, gain: 0.05 }),
  langSwitch: () => synthesize({ baseFreq: 600, duration: 0.08, gain: 0.05, slideTo: 800 }),
  themeSwitch: () => synthesize({ baseFreq: 400, duration: 0.12, gain: 0.07, slideTo: 600 }),
  depthSwitch: () => synthesize({ baseFreq: 500, duration: 0.1, gain: 0.06, slideTo: 700 }),
  accentSwitch: () => synthesize({ baseFreq: 880, duration: 0.05, gain: 0.06 }),
  presetSwitch: () => synthesize({ baseFreq: 660, duration: 0.06, gain: 0.06 }),
  resetSound: () => synthesize({ baseFreq: 600, duration: 0.2, gain: 0.08, slideTo: 200 }),
  shortcutPress: () => synthesize({ baseFreq: 3000, duration: 0.02, gain: 0.05 }),
  shortcutConflict: () => {
    synthesize({ baseFreq: 200, duration: 0.12, gain: 0.08 });
    synthesize({ baseFreq: 180, duration: 0.12, gain: 0.08 });
  },
  shortcutSet: () => synthesize({ baseFreq: 660, duration: 0.15, gain: 0.1, chord: [660, 880] }),
  apiConnect: () => synthesize({ baseFreq: 523.25, duration: 0.2, gain: 0.1, chord: [523.25, 659.25] }),
  apiFail: () => synthesize({ baseFreq: 300, duration: 0.2, gain: 0.08, slideTo: 150 }),
  imagePreview: () => synthesize({ baseFreq: 400, duration: 0.08, gain: 0.06 }),
  imageProcess: () => synthesize({ baseFreq: 500, duration: 0.15, gain: 0.07, slideTo: 800 }),
  exportStart: () => synthesize({ baseFreq: 400, duration: 0.12, gain: 0.07, slideTo: 600 }),
  fullscreen: () => synthesize({ baseFreq: 500, duration: 0.1, gain: 0.08 }),
};

export function playSound(name: SoundName) {
  try {
    if (!currentSettings.sfxEnabled) return;
    if (currentSettings.useCustomSfx && customSfxAudio) {
      customSfxAudio.currentTime = 0;
      customSfxAudio.play().catch(() => {});
      return;
    }
    EVENTS[name]?.();
  } catch {
    // ignore audio errors
  }
}

export function previewSound(name: SoundName) {
  playSound(name);
}

// ─── Custom audio file support ───
let customSfxAudio: HTMLAudioElement | null = null;
let customMusicAudio: HTMLAudioElement | null = null;

export function setCustomSfx(dataUrl: string | null) {
  if (customSfxAudio) { customSfxAudio.pause(); customSfxAudio = null; }
  if (dataUrl) {
    customSfxAudio = new Audio(dataUrl);
    customSfxAudio.volume = (currentSettings.sfxVolume / 100) * (currentSettings.masterVolume / 100);
  }
  currentSettings = { ...currentSettings, useCustomSfx: !!dataUrl, customSfxDataUrl: dataUrl };
}

export function setCustomMusic(dataUrl: string | null) {
  if (customMusicAudio) { customMusicAudio.pause(); customMusicAudio = null; }
  if (dataUrl) {
    customMusicAudio = new Audio(dataUrl);
    customMusicAudio.loop = true;
    customMusicAudio.volume = (currentSettings.musicVolume / 100) * (currentSettings.masterVolume / 100);
  }
  currentSettings = { ...currentSettings, useCustomMusic: !!dataUrl, customMusicDataUrl: dataUrl };
}

// ─── Background music engine v5 ───
// Lookahead-scheduled generative music with 40 diverse presets.

const SEMITONES = [0, 2, 4, 5, 7, 9, 11];
const MINOR_SEMITONES = [0, 2, 3, 5, 7, 8, 10];
const PENTATONIC = [0, 2, 4, 7, 9];
const DORIAN = [0, 2, 3, 5, 7, 9, 10];
const LYDIAN = [0, 2, 4, 6, 7, 9, 11];
const PHRYGIAN = [0, 1, 3, 5, 7, 8, 10];
const MIXOLYDIAN = [0, 2, 4, 5, 7, 9, 10];
const BLUES_SCALE = [0, 3, 5, 6, 7, 10];
const WHOLE_TONE = [0, 2, 4, 6, 8, 10];
const HARMONIC_MINOR = [0, 2, 3, 5, 7, 8, 11];
const JAPANESE = [0, 1, 5, 7, 8];

function mtof(midi: number) {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

function scaleFreq(rootMidi: number, degree: number, scale: number[]) {
  const octaves = Math.floor(degree / scale.length);
  const idx = degree % scale.length;
  return mtof(rootMidi + octaves * 12 + scale[idx]);
}

interface DrumPattern {
  kick: number[];
  snare: number[];
  hihat: number[];
}

interface MusicPresetData {
  rootMidi: number;
  scale: number[];
  progression: number[];
  bpm: number;
  voices: OscillatorType[];
  voiceMix: number[];
  pattern: number[];
  density: number;
  filterFreq: number;
  reverbMix: number;
  bassOctave: number;
  hasDrums: boolean;
  drumPattern?: DrumPattern;
  arpSpeed: number;
  chordSpread: number[];
  chordDensity: number; // how many bars per chord
}

const DRUM_PATTERNS: Record<string, DrumPattern> = {
  basic: { kick: [0], snare: [2], hihat: [0, 1, 2, 3] },
  rock: { kick: [0, 2], snare: [1, 3], hihat: [0, 1, 2, 3] },
  funk: { kick: [0, 1, 2, 3], snare: [1, 3], hihat: [0, 1, 2, 3] },
  halfTime: { kick: [0], snare: [2], hihat: [0, 2] },
  fourOnFloor: { kick: [0, 1, 2, 3], snare: [1, 3], hihat: [0, 1, 2, 3] },
  jazzBrush: { kick: [0, 2], snare: [1, 3], hihat: [0, 1, 2, 3] },
  slow: { kick: [0], snare: [2], hihat: [0, 2] },
  sparse: { kick: [0], snare: [], hihat: [0, 2] },
  electronic: { kick: [0, 1, 2, 3], snare: [1, 3], hihat: [0, 1, 2, 3] },
  none: { kick: [], snare: [], hihat: [] },
};

function makePreset(p: Partial<MusicPresetData> & Pick<MusicPresetData, 'rootMidi' | 'scale' | 'progression' | 'bpm' | 'voices' | 'voiceMix' | 'pattern' | 'density' | 'filterFreq' | 'reverbMix' | 'bassOctave' | 'hasDrums' | 'arpSpeed' | 'chordSpread' | 'chordDensity'>): MusicPresetData {
  return {
    drumPattern: p.hasDrums ? DRUM_PATTERNS.basic : DRUM_PATTERNS.none,
    ...p,
  };
}

const MUSIC_PRESETS: Record<MusicPreset, MusicPresetData> = {
  orchestral: makePreset({ rootMidi: 48, scale: SEMITONES, progression: [0, 4, 5, 3], bpm: 68, voices: ['triangle', 'sine', 'sine'], voiceMix: [0.5, 0.35, 0.3], pattern: [0, 1, 2, 1, 0, 1, 2, 1], density: 4, filterFreq: 2800, reverbMix: 0.45, bassOctave: 2, hasDrums: true, drumPattern: DRUM_PATTERNS.slow, arpSpeed: 2, chordSpread: [0, 2, 4, 7], chordDensity: 2 }),
  ambient: makePreset({ rootMidi: 44, scale: MINOR_SEMITONES, progression: [0, 3, 5, 2], bpm: 56, voices: ['sine', 'sine', 'triangle'], voiceMix: [0.45, 0.35, 0.25], pattern: [0, 2, 1, 2], density: 2, filterFreq: 1600, reverbMix: 0.75, bassOctave: 2, hasDrums: false, arpSpeed: 2, chordSpread: [0, 2, 4, 6], chordDensity: 2 }),
  electronic: makePreset({ rootMidi: 50, scale: MINOR_SEMITONES, progression: [0, 5, 3, 4], bpm: 118, voices: ['sawtooth', 'square', 'sawtooth'], voiceMix: [0.5, 0.35, 0.35], pattern: [0, 1, 0, 2, 1, 0, 2, 1], density: 4, filterFreq: 5200, reverbMix: 0.2, bassOctave: 2, hasDrums: true, drumPattern: DRUM_PATTERNS.fourOnFloor, arpSpeed: 1, chordSpread: [0, 2, 4], chordDensity: 1 }),
  piano: makePreset({ rootMidi: 52, scale: SEMITONES, progression: [0, 5, 3, 4], bpm: 76, voices: ['triangle', 'sine', 'triangle'], voiceMix: [0.5, 0.3, 0.3], pattern: [0, 1, 2, 0, 1, 2, 1, 0], density: 4, filterFreq: 3800, reverbMix: 0.35, bassOctave: 2, hasDrums: true, drumPattern: DRUM_PATTERNS.slow, arpSpeed: 2, chordSpread: [0, 2, 4, 7], chordDensity: 2 }),
  synthwave: makePreset({ rootMidi: 49, scale: MINOR_SEMITONES, progression: [0, 3, 5, 4], bpm: 96, voices: ['sawtooth', 'square', 'sawtooth'], voiceMix: [0.5, 0.35, 0.3], pattern: [0, 2, 0, 1, 2, 0, 1, 2], density: 4, filterFreq: 4200, reverbMix: 0.25, bassOctave: 2, hasDrums: true, drumPattern: DRUM_PATTERNS.fourOnFloor, arpSpeed: 1, chordSpread: [0, 2, 4], chordDensity: 1 }),
  nature: makePreset({ rootMidi: 47, scale: PENTATONIC, progression: [0, 2, 4, 1], bpm: 62, voices: ['sine', 'triangle', 'sine'], voiceMix: [0.45, 0.35, 0.25], pattern: [0, 1, 2, 1, 0, 2, 1, 0], density: 2, filterFreq: 2400, reverbMix: 0.55, bassOctave: 1, hasDrums: false, arpSpeed: 2, chordSpread: [0, 2, 4], chordDensity: 2 }),
  jazz: makePreset({ rootMidi: 51, scale: SEMITONES, progression: [0, 3, 4, 1], bpm: 88, voices: ['triangle', 'sine', 'triangle'], voiceMix: [0.5, 0.3, 0.3], pattern: [0, 1, 2, 1, 0, 2, 1, 2], density: 4, filterFreq: 3000, reverbMix: 0.4, bassOctave: 2, hasDrums: true, drumPattern: DRUM_PATTERNS.jazzBrush, arpSpeed: 2, chordSpread: [0, 2, 4, 6], chordDensity: 2 }),
  meditation: makePreset({ rootMidi: 42, scale: PENTATONIC, progression: [0, 2, 4, 2], bpm: 48, voices: ['sine', 'sine', 'sine'], voiceMix: [0.4, 0.3, 0.25], pattern: [0, 1, 2, 1], density: 2, filterFreq: 1400, reverbMix: 0.82, bassOctave: 1, hasDrums: false, arpSpeed: 2, chordSpread: [0, 2, 4], chordDensity: 2 }),
  cyber: makePreset({ rootMidi: 46, scale: MINOR_SEMITONES, progression: [0, 5, 3, 6], bpm: 126, voices: ['square', 'sawtooth', 'square'], voiceMix: [0.5, 0.35, 0.35], pattern: [0, 1, 0, 2, 1, 0, 2, 0], density: 4, filterFreq: 5500, reverbMix: 0.15, bassOctave: 2, hasDrums: true, drumPattern: DRUM_PATTERNS.electronic, arpSpeed: 1, chordSpread: [0, 2, 4], chordDensity: 1 }),
  lofi: makePreset({ rootMidi: 48, scale: DORIAN, progression: [0, 3, 5, 4], bpm: 68, voices: ['sine', 'triangle', 'sine'], voiceMix: [0.45, 0.35, 0.25], pattern: [0, 1, 2, 1, 0, 1, 2, 1], density: 4, filterFreq: 2000, reverbMix: 0.62, bassOctave: 2, hasDrums: true, drumPattern: DRUM_PATTERNS.slow, arpSpeed: 2, chordSpread: [0, 2, 4, 6], chordDensity: 2 }),
  rock: makePreset({ rootMidi: 45, scale: MINOR_SEMITONES, progression: [0, 3, 5, 4, 5, 3, 4, 0], bpm: 112, voices: ['sawtooth', 'square', 'sawtooth'], voiceMix: [0.5, 0.3, 0.3], pattern: [0, 1, 0, 2], density: 4, filterFreq: 4800, reverbMix: 0.25, bassOctave: 2, hasDrums: true, drumPattern: DRUM_PATTERNS.rock, arpSpeed: 1, chordSpread: [0, 2, 4], chordDensity: 1 }),
  blues: makePreset({ rootMidi: 47, scale: BLUES_SCALE, progression: [0, 3, 4, 3], bpm: 82, voices: ['triangle', 'sawtooth', 'triangle'], voiceMix: [0.5, 0.3, 0.25], pattern: [0, 1, 2, 1, 0, 1, 2, 0], density: 4, filterFreq: 2800, reverbMix: 0.35, bassOctave: 2, hasDrums: true, drumPattern: DRUM_PATTERNS.slow, arpSpeed: 2, chordSpread: [0, 2, 4, 5], chordDensity: 2 }),
  folk: makePreset({ rootMidi: 50, scale: MIXOLYDIAN, progression: [0, 3, 4, 0], bpm: 90, voices: ['triangle', 'sine', 'triangle'], voiceMix: [0.5, 0.3, 0.3], pattern: [0, 1, 2, 0, 1, 2, 1, 0], density: 4, filterFreq: 3200, reverbMix: 0.4, bassOctave: 2, hasDrums: true, drumPattern: DRUM_PATTERNS.basic, arpSpeed: 2, chordSpread: [0, 2, 4], chordDensity: 2 }),
  reggae: makePreset({ rootMidi: 46, scale: MINOR_SEMITONES, progression: [0, 5, 3, 4], bpm: 78, voices: ['triangle', 'sine', 'triangle'], voiceMix: [0.45, 0.35, 0.25], pattern: [0, 2, 1, 2], density: 4, filterFreq: 2600, reverbMix: 0.45, bassOctave: 2, hasDrums: true, drumPattern: DRUM_PATTERNS.halfTime, arpSpeed: 2, chordSpread: [0, 2, 4], chordDensity: 2 }),
  funk: makePreset({ rootMidi: 48, scale: DORIAN, progression: [0, 3, 4, 3], bpm: 104, voices: ['sawtooth', 'square', 'sawtooth'], voiceMix: [0.5, 0.35, 0.3], pattern: [0, 1, 0, 2, 1, 0, 2, 1], density: 4, filterFreq: 3800, reverbMix: 0.3, bassOctave: 2, hasDrums: true, drumPattern: DRUM_PATTERNS.funk, arpSpeed: 1, chordSpread: [0, 2, 4], chordDensity: 1 }),
  soul: makePreset({ rootMidi: 49, scale: PENTATONIC, progression: [0, 3, 4, 0], bpm: 86, voices: ['sine', 'triangle', 'sine'], voiceMix: [0.5, 0.3, 0.3], pattern: [0, 1, 2, 1, 0, 1, 2, 1], density: 4, filterFreq: 3000, reverbMix: 0.4, bassOctave: 2, hasDrums: true, drumPattern: DRUM_PATTERNS.slow, arpSpeed: 2, chordSpread: [0, 2, 4, 6], chordDensity: 2 }),
  gospel: makePreset({ rootMidi: 47, scale: SEMITONES, progression: [0, 4, 5, 3, 4, 5, 3, 0], bpm: 72, voices: ['triangle', 'sine', 'triangle'], voiceMix: [0.5, 0.35, 0.3], pattern: [0, 1, 2, 0, 1, 2, 1, 0], density: 4, filterFreq: 2800, reverbMix: 0.5, bassOctave: 2, hasDrums: true, drumPattern: DRUM_PATTERNS.slow, arpSpeed: 2, chordSpread: [0, 2, 4, 7], chordDensity: 1 }),
  country: makePreset({ rootMidi: 50, scale: MIXOLYDIAN, progression: [0, 4, 5, 3], bpm: 92, voices: ['triangle', 'sine', 'triangle'], voiceMix: [0.5, 0.3, 0.25], pattern: [0, 1, 2, 0, 1, 2, 1, 0], density: 4, filterFreq: 3200, reverbMix: 0.35, bassOctave: 2, hasDrums: true, drumPattern: DRUM_PATTERNS.basic, arpSpeed: 2, chordSpread: [0, 2, 4], chordDensity: 2 }),
  celtic: makePreset({ rootMidi: 49, scale: DORIAN, progression: [0, 3, 4, 0, 3, 5, 4, 0], bpm: 84, voices: ['triangle', 'sine', 'triangle'], voiceMix: [0.5, 0.3, 0.3], pattern: [0, 1, 2, 1, 0, 2, 1, 0], density: 4, filterFreq: 3000, reverbMix: 0.45, bassOctave: 2, hasDrums: true, drumPattern: DRUM_PATTERNS.basic, arpSpeed: 2, chordSpread: [0, 2, 4, 6], chordDensity: 1 }),
  oriental: makePreset({ rootMidi: 48, scale: JAPANESE, progression: [0, 2, 3, 1], bpm: 70, voices: ['sine', 'triangle', 'sine'], voiceMix: [0.45, 0.35, 0.25], pattern: [0, 1, 2, 1], density: 2, filterFreq: 2400, reverbMix: 0.55, bassOctave: 1, hasDrums: true, drumPattern: DRUM_PATTERNS.sparse, arpSpeed: 2, chordSpread: [0, 2, 4], chordDensity: 2 }),
  tribal: makePreset({ rootMidi: 44, scale: PENTATONIC, progression: [0, 2, 4, 1, 0, 2, 1, 4], bpm: 88, voices: ['triangle', 'sawtooth', 'triangle'], voiceMix: [0.5, 0.35, 0.3], pattern: [0, 1, 2, 1, 0, 2, 1, 2], density: 4, filterFreq: 2200, reverbMix: 0.35, bassOctave: 2, hasDrums: true, drumPattern: DRUM_PATTERNS.rock, arpSpeed: 2, chordSpread: [0, 2, 4], chordDensity: 1 }),
  space: makePreset({ rootMidi: 45, scale: WHOLE_TONE, progression: [0, 2, 4, 1], bpm: 60, voices: ['sine', 'sine', 'sine'], voiceMix: [0.4, 0.3, 0.25], pattern: [0, 2, 1, 2, 0, 1, 2, 1], density: 2, filterFreq: 1600, reverbMix: 0.78, bassOctave: 2, hasDrums: false, arpSpeed: 2, chordSpread: [0, 2, 4, 6], chordDensity: 2 }),
  underwater: makePreset({ rootMidi: 46, scale: DORIAN, progression: [0, 3, 5, 2], bpm: 54, voices: ['sine', 'triangle', 'sine'], voiceMix: [0.4, 0.3, 0.25], pattern: [0, 1, 2, 1], density: 2, filterFreq: 1400, reverbMix: 0.72, bassOctave: 2, hasDrums: false, arpSpeed: 2, chordSpread: [0, 2, 4], chordDensity: 2 }),
  rain: makePreset({ rootMidi: 47, scale: MINOR_SEMITONES, progression: [0, 3, 5, 4, 3, 5, 4, 0], bpm: 50, voices: ['sine', 'sine', 'triangle'], voiceMix: [0.35, 0.3, 0.25], pattern: [0, 2, 1, 2], density: 2, filterFreq: 2000, reverbMix: 0.6, bassOctave: 2, hasDrums: false, arpSpeed: 2, chordSpread: [0, 2, 4, 6], chordDensity: 2 }),
  windchime: makePreset({ rootMidi: 52, scale: PENTATONIC, progression: [0, 2, 4, 1, 0, 4, 2, 1], bpm: 58, voices: ['sine', 'sine', 'sine'], voiceMix: [0.4, 0.3, 0.25], pattern: [0, 1, 2, 0, 1, 2, 1, 0], density: 4, filterFreq: 4000, reverbMix: 0.7, bassOctave: 1, hasDrums: false, arpSpeed: 2, chordSpread: [0, 2, 4], chordDensity: 1 }),
  fireplace: makePreset({ rootMidi: 43, scale: BLUES_SCALE, progression: [0, 3, 4, 3], bpm: 52, voices: ['triangle', 'sine', 'triangle'], voiceMix: [0.4, 0.3, 0.25], pattern: [0, 1, 2, 1], density: 2, filterFreq: 1500, reverbMix: 0.5, bassOctave: 2, hasDrums: false, arpSpeed: 2, chordSpread: [0, 2, 4, 5], chordDensity: 2 }),
  night: makePreset({ rootMidi: 46, scale: MINOR_SEMITONES, progression: [0, 5, 3, 4], bpm: 56, voices: ['sine', 'sine', 'triangle'], voiceMix: [0.4, 0.3, 0.25], pattern: [0, 2, 1, 2], density: 2, filterFreq: 1800, reverbMix: 0.6, bassOctave: 2, hasDrums: false, arpSpeed: 2, chordSpread: [0, 2, 4], chordDensity: 2 }),
  sunrise: makePreset({ rootMidi: 50, scale: LYDIAN, progression: [0, 4, 5, 3, 0, 5, 3, 4], bpm: 72, voices: ['triangle', 'sine', 'triangle'], voiceMix: [0.5, 0.35, 0.3], pattern: [0, 1, 2, 1, 0, 1, 2, 1], density: 4, filterFreq: 3000, reverbMix: 0.45, bassOctave: 2, hasDrums: true, drumPattern: DRUM_PATTERNS.slow, arpSpeed: 2, chordSpread: [0, 2, 4, 7], chordDensity: 1 }),
  dreamy: makePreset({ rootMidi: 48, scale: WHOLE_TONE, progression: [0, 2, 4, 1], bpm: 64, voices: ['sine', 'sine', 'sine'], voiceMix: [0.4, 0.3, 0.25], pattern: [0, 1, 2, 1, 0, 2, 1, 0], density: 2, filterFreq: 2000, reverbMix: 0.65, bassOctave: 2, hasDrums: false, arpSpeed: 2, chordSpread: [0, 2, 4, 6], chordDensity: 2 }),
  energetic: makePreset({ rootMidi: 50, scale: SEMITONES, progression: [0, 4, 5, 3, 4, 0, 5, 3], bpm: 128, voices: ['sawtooth', 'square', 'sawtooth'], voiceMix: [0.5, 0.35, 0.35], pattern: [0, 1, 0, 2, 1, 0, 2, 1], density: 4, filterFreq: 5200, reverbMix: 0.18, bassOctave: 2, hasDrums: true, drumPattern: DRUM_PATTERNS.fourOnFloor, arpSpeed: 1, chordSpread: [0, 2, 4], chordDensity: 1 }),
  battle: makePreset({ rootMidi: 45, scale: PHRYGIAN, progression: [0, 3, 2, 5, 0, 2, 3, 5], bpm: 110, voices: ['sawtooth', 'square', 'sawtooth'], voiceMix: [0.5, 0.35, 0.3], pattern: [0, 1, 2, 0, 1, 2, 1, 0], density: 4, filterFreq: 4400, reverbMix: 0.22, bassOctave: 2, hasDrums: true, drumPattern: DRUM_PATTERNS.rock, arpSpeed: 1, chordSpread: [0, 2, 4], chordDensity: 1 }),
  adventure: makePreset({ rootMidi: 49, scale: MIXOLYDIAN, progression: [0, 4, 3, 5, 0, 3, 4, 5], bpm: 100, voices: ['triangle', 'sine', 'triangle'], voiceMix: [0.5, 0.35, 0.3], pattern: [0, 1, 2, 1, 0, 2, 1, 2], density: 4, filterFreq: 3200, reverbMix: 0.35, bassOctave: 2, hasDrums: true, drumPattern: DRUM_PATTERNS.rock, arpSpeed: 2, chordSpread: [0, 2, 4, 6], chordDensity: 1 }),
  mystery: makePreset({ rootMidi: 46, scale: HARMONIC_MINOR, progression: [0, 3, 4, 2], bpm: 76, voices: ['sine', 'triangle', 'sine'], voiceMix: [0.45, 0.3, 0.25], pattern: [0, 2, 1, 2, 0, 1, 2, 1], density: 4, filterFreq: 2400, reverbMix: 0.5, bassOctave: 2, hasDrums: true, drumPattern: DRUM_PATTERNS.sparse, arpSpeed: 2, chordSpread: [0, 2, 4], chordDensity: 2 }),
  romantic: makePreset({ rootMidi: 50, scale: SEMITONES, progression: [0, 4, 5, 3, 0, 5, 3, 4], bpm: 70, voices: ['sine', 'triangle', 'sine'], voiceMix: [0.5, 0.35, 0.3], pattern: [0, 1, 2, 1, 0, 1, 2, 1], density: 4, filterFreq: 2800, reverbMix: 0.45, bassOctave: 2, hasDrums: true, drumPattern: DRUM_PATTERNS.slow, arpSpeed: 2, chordSpread: [0, 2, 4, 7], chordDensity: 1 }),
  nostalgic: makePreset({ rootMidi: 48, scale: DORIAN, progression: [0, 3, 5, 4, 3, 0, 5, 3], bpm: 66, voices: ['triangle', 'sine', 'triangle'], voiceMix: [0.5, 0.3, 0.3], pattern: [0, 1, 2, 0, 1, 2, 1, 0], density: 4, filterFreq: 2600, reverbMix: 0.5, bassOctave: 2, hasDrums: true, drumPattern: DRUM_PATTERNS.slow, arpSpeed: 2, chordSpread: [0, 2, 4, 6], chordDensity: 2 }),
  hopeful: makePreset({ rootMidi: 52, scale: LYDIAN, progression: [0, 4, 5, 3, 0, 4, 3, 5], bpm: 80, voices: ['triangle', 'sine', 'triangle'], voiceMix: [0.5, 0.35, 0.3], pattern: [0, 1, 2, 1, 0, 1, 2, 1], density: 4, filterFreq: 3000, reverbMix: 0.4, bassOctave: 2, hasDrums: true, drumPattern: DRUM_PATTERNS.basic, arpSpeed: 2, chordSpread: [0, 2, 4, 7], chordDensity: 1 }),
  epic: makePreset({ rootMidi: 44, scale: MINOR_SEMITONES, progression: [0, 3, 4, 5, 0, 4, 3, 5], bpm: 92, voices: ['triangle', 'sawtooth', 'triangle'], voiceMix: [0.5, 0.35, 0.3], pattern: [0, 1, 2, 0, 1, 2, 1, 0], density: 4, filterFreq: 3200, reverbMix: 0.5, bassOctave: 2, hasDrums: true, drumPattern: DRUM_PATTERNS.rock, arpSpeed: 2, chordSpread: [0, 2, 4, 6], chordDensity: 1 }),
  chill: makePreset({ rootMidi: 47, scale: DORIAN, progression: [0, 3, 5, 4], bpm: 74, voices: ['sine', 'triangle', 'sine'], voiceMix: [0.45, 0.35, 0.25], pattern: [0, 1, 2, 1, 0, 2, 1, 0], density: 4, filterFreq: 2200, reverbMix: 0.55, bassOctave: 2, hasDrums: true, drumPattern: DRUM_PATTERNS.slow, arpSpeed: 2, chordSpread: [0, 2, 4, 6], chordDensity: 2 }),
  study: makePreset({ rootMidi: 49, scale: SEMITONES, progression: [0, 5, 3, 4], bpm: 76, voices: ['sine', 'triangle', 'sine'], voiceMix: [0.45, 0.35, 0.25], pattern: [0, 1, 2, 1, 0, 1, 2, 1], density: 4, filterFreq: 2600, reverbMix: 0.5, bassOctave: 2, hasDrums: true, drumPattern: DRUM_PATTERNS.slow, arpSpeed: 2, chordSpread: [0, 2, 4], chordDensity: 2 }),
  focus: makePreset({ rootMidi: 46, scale: PENTATONIC, progression: [0, 2, 4, 1], bpm: 68, voices: ['sine', 'sine', 'triangle'], voiceMix: [0.4, 0.3, 0.25], pattern: [0, 1, 2, 1], density: 2, filterFreq: 2000, reverbMix: 0.6, bassOctave: 2, hasDrums: false, arpSpeed: 2, chordSpread: [0, 2, 4], chordDensity: 2 }),
};

// ─── Lookahead scheduler ───
let musicScheduleTimer: ReturnType<typeof setInterval> | null = null;
let nextNoteTime = 0;
let scheduleBeat = 0;
const LOOKAHEAD_S = 0.15;
const SCHEDULE_INTERVAL_MS = 25;

/** Per-note humanization: tiny random timing offset and velocity variation. */
let humanSeed = 0;
function humanize() {
  // cheap LCG for deterministic-but-random feel
  humanSeed = (humanSeed * 1103515245 + 12345) & 0x7fffffff;
  return (humanSeed / 0x7fffffff) * 2 - 1; // -1 .. 1
}

/** Richer per-note synthesis with sub-osc, filter envelope, better ADSR. */
function scheduleMusicNote(when: number, freq: number, voice: OscillatorType, duration: number, volume: number, filterFreq: number, stereoPan = 0) {
  try {
    const c = ctx;
    const mg = musicGain;
    if (!c || !mg) return;
    const stopTime = when + duration + 0.08;
    if (stopTime <= c.currentTime) return;

    const startTime = Math.max(when, c.currentTime);
    const humanDetune = humanize() * 3; // ±3 cents organic drift
    const velocity = volume * (0.92 + humanize() * 0.08); // ±8% velocity

    // ── Oscillator stack ──
    // 1) Sub oscillator (1 octave below) for warmth
    const subOsc = c.createOscillator();
    subOsc.type = voice === 'sine' ? 'sine' : 'triangle';
    subOsc.frequency.value = freq * 0.5;
    subOsc.detune.value = humanDetune - 5;

    // 2) Primary oscillator
    const osc1 = c.createOscillator();
    osc1.type = voice;
    osc1.frequency.value = freq;
    osc1.detune.value = humanDetune;

    // 3) Bright overtone (2 octaves up, much quieter)
    const osc2 = c.createOscillator();
    osc2.type = voice === 'sine' ? 'triangle' : 'sine';
    osc2.frequency.value = freq * 2;
    osc2.detune.value = humanDetune + 7;

    // ── Gain stages ──
    const subGain = c.createGain();
    subGain.gain.value = 0.25;
    const oscGain = c.createGain();
    oscGain.gain.value = 0.6;
    const brightGain = c.createGain();
    brightGain.gain.value = 0.15;

    const env = c.createGain();
    env.gain.setValueAtTime(0, startTime);

    // Attack: crisp 8ms linear up
    const attack = Math.min(0.008, duration * 0.15);
    env.gain.linearRampToValueAtTime(velocity, startTime + attack);
    // Decay: exponential to sustain
    const decay = Math.min(0.12, duration * 0.35);
    const sustainLevel = velocity * 0.55;
    env.gain.exponentialRampToValueAtTime(Math.max(sustainLevel, 0.0005), startTime + attack + decay);
    // Sustain hold
    env.gain.setValueAtTime(Math.max(sustainLevel, 0.0005), startTime + duration * 0.8);
    // Release
    env.gain.exponentialRampToValueAtTime(0.0001, startTime + duration + 0.06);

    // ── Filter envelope (bright attack, darker sustain) ──
    const filter = c.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(filterFreq * 1.8, startTime);
    filter.frequency.exponentialRampToValueAtTime(filterFreq * 0.6, startTime + attack + decay * 1.5);
    filter.Q.value = 0.6;

    // ── Stereo panner ──
    const panner = c.createStereoPanner ? c.createStereoPanner() : null;
    if (panner) panner.pan.value = stereoPan;

    // ── Routing ──
    subOsc.connect(subGain);
    osc1.connect(oscGain);
    osc2.connect(brightGain);
    subGain.connect(filter);
    oscGain.connect(filter);
    brightGain.connect(filter);
    filter.connect(env);
    const output: AudioNode = panner || env;
    if (panner) { env.connect(panner); }
    output.connect(mg);

    subOsc.start(startTime);
    osc1.start(startTime);
    osc2.start(startTime);
    subOsc.stop(stopTime);
    osc1.stop(stopTime);
    osc2.stop(stopTime);

    // Auto-cleanup
    const cleanupDelay = Math.max(0, (stopTime - c.currentTime) * 1000) + 120;
    setTimeout(() => {
      try { subOsc.disconnect(); } catch {}
      try { osc1.disconnect(); } catch {}
      try { osc2.disconnect(); } catch {}
      try { subGain.disconnect(); } catch {}
      try { oscGain.disconnect(); } catch {}
      try { brightGain.disconnect(); } catch {}
      try { filter.disconnect(); } catch {}
      try { env.disconnect(); } catch {}
      if (panner) try { panner.disconnect(); } catch {}
    }, cleanupDelay);
  } catch { /* ignore */ }
}

/** More musical chord voicing with accurate intervals and voice spread. */
function scheduleMusicChord(when: number, rootFreq: number, scale: number[], voice: OscillatorType, duration: number, volume: number, filterFreq: number, spread: number[]) {
  spread.forEach((deg, i) => {
    const octaves = Math.floor(deg / scale.length);
    const idx = deg % scale.length;
    const semitones = scale[idx] + octaves * 12;
    const ratio = Math.pow(2, semitones / 12);
    const v = volume * (1 - i * 0.06) * 0.45;
    const pan = ((i / Math.max(spread.length - 1, 1)) - 0.5) * 0.6;
    scheduleMusicNote(when + i * 0.012, rootFreq * ratio, voice, duration, v, filterFreq, pan);
  });
}

/** Richer drum synthesis. */
function scheduleDrum(when: number, type: 'kick' | 'snare' | 'hihat', volume: number) {
  try {
    const c = ctx;
    const mg = musicGain;
    if (!c || !mg) return;

    if (type === 'kick') {
      const stopTime = when + 0.2;
      if (stopTime <= c.currentTime) return;
      // Body: deep sine sweep
      const bodyOsc = c.createOscillator();
      bodyOsc.type = 'sine';
      bodyOsc.frequency.setValueAtTime(180, when);
      bodyOsc.frequency.exponentialRampToValueAtTime(45, when + 0.14);
      const bodyGain = c.createGain();
      bodyGain.gain.setValueAtTime(volume * 0.85, when);
      bodyGain.gain.exponentialRampToValueAtTime(0.001, when + 0.18);

      // Click: short high-frequency burst for attack definition
      const clickSize = Math.floor(c.sampleRate * 0.006);
      const clickBuf = c.createBuffer(1, clickSize, c.sampleRate);
      const clickData = clickBuf.getChannelData(0);
      for (let i = 0; i < clickSize; i++) clickData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / clickSize, 1.5);
      const clickSrc = c.createBufferSource();
      clickSrc.buffer = clickBuf;
      const clickFilter = c.createBiquadFilter();
      clickFilter.type = 'bandpass';
      clickFilter.frequency.value = 3500;
      clickFilter.Q.value = 1.2;
      const clickGain = c.createGain();
      clickGain.gain.setValueAtTime(volume * 0.35, when);
      clickGain.gain.exponentialRampToValueAtTime(0.001, when + 0.015);

      bodyOsc.connect(bodyGain);
      bodyGain.connect(mg);
      clickSrc.connect(clickFilter);
      clickFilter.connect(clickGain);
      clickGain.connect(mg);

      const t = Math.max(when, c.currentTime);
      bodyOsc.start(t);
      bodyOsc.stop(stopTime);
      clickSrc.start(t);
      clickSrc.stop(t + 0.02);

      setTimeout(() => {
        try { bodyOsc.disconnect(); bodyGain.disconnect(); } catch {}
        try { clickSrc.disconnect(); clickFilter.disconnect(); clickGain.disconnect(); } catch {}
      }, (stopTime - c.currentTime) * 1000 + 100);

    } else if (type === 'snare') {
      const stopTime = when + 0.18;
      if (stopTime <= c.currentTime) return;
      // Tone: triangle with snap envelope
      const toneOsc = c.createOscillator();
      toneOsc.type = 'triangle';
      toneOsc.frequency.setValueAtTime(220, when);
      toneOsc.frequency.exponentialRampToValueAtTime(160, when + 0.04);
      const toneGain = c.createGain();
      toneGain.gain.setValueAtTime(volume * 0.25, when);
      toneGain.gain.exponentialRampToValueAtTime(0.001, when + 0.08);

      // Noise: filtered with longer decay
      const noiseSize = Math.floor(c.sampleRate * 0.14);
      const noiseBuf = c.createBuffer(1, noiseSize, c.sampleRate);
      const noiseData = noiseBuf.getChannelData(0);
      for (let i = 0; i < noiseSize; i++) noiseData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / noiseSize, 1.2);
      const noise = c.createBufferSource();
      noise.buffer = noiseBuf;
      const noiseFilter = c.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.value = 1400;
      noiseFilter.Q.value = 0.8;
      const noiseGain = c.createGain();
      noiseGain.gain.setValueAtTime(volume * 0.45, when);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, when + 0.14);

      toneOsc.connect(toneGain);
      toneGain.connect(mg);
      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(mg);

      const t = Math.max(when, c.currentTime);
      toneOsc.start(t);
      toneOsc.stop(stopTime);
      noise.start(t);
      noise.stop(stopTime);

      setTimeout(() => {
        try { toneOsc.disconnect(); toneGain.disconnect(); } catch {}
        try { noise.disconnect(); noiseFilter.disconnect(); noiseGain.disconnect(); } catch {}
      }, (stopTime - c.currentTime) * 1000 + 100);

    } else if (type === 'hihat') {
      const stopTime = when + 0.06;
      if (stopTime <= c.currentTime) return;
      // Metallic noise: high bandpass + shorter decay
      const bufferSize = Math.floor(c.sampleRate * 0.04);
      const buffer = c.createBuffer(1, bufferSize, c.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1);
      const noise = c.createBufferSource();
      noise.buffer = buffer;
      const filter = c.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 8000;
      filter.Q.value = 0.5;
      const gain = c.createGain();
      gain.gain.setValueAtTime(volume * 0.18, when);
      gain.gain.exponentialRampToValueAtTime(0.001, when + 0.04);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(mg);
      const t = Math.max(when, c.currentTime);
      noise.start(t);
      noise.stop(stopTime);

      setTimeout(() => {
        try { noise.disconnect(); filter.disconnect(); gain.disconnect(); } catch {}
      }, (stopTime - c.currentTime) * 1000 + 100);
    }
  } catch { /* ignore */ }
}

/** Main scheduling tick with swing, humanization, and richer arrangement. */
function scheduleTick(when: number, preset: MusicPresetData, pitchRatio: number, volume: number) {
  const ticksPerBar = preset.density * 4;
  const chordIdx = Math.floor(scheduleBeat / ticksPerBar / preset.chordDensity) % preset.progression.length;
  const chordDegree = preset.progression[chordIdx];
  const rootFreq = scaleFreq(preset.rootMidi, chordDegree, preset.scale) * pitchRatio;
  const patIdx = scheduleBeat % preset.pattern.length;
  const voiceIdx = preset.pattern[patIdx];
  const voice = preset.voices[voiceIdx % preset.voices.length];
  const voiceVol = preset.voiceMix[voiceIdx % preset.voiceMix.length];
  const beatInBar = scheduleBeat % ticksPerBar;

  // Swing: delay odd subdivision notes slightly
  const swingAmount = 0.018; // 18ms swing
  const isOddSubdivision = (beatInBar % 2) === 1;
  const swingOffset = isOddSubdivision ? swingAmount : 0;

  // Bass on downbeats with occasional slide on bar boundaries
  if (scheduleBeat % preset.density === 0) {
    const bassFreq = scaleFreq(preset.rootMidi - preset.bassOctave * 12, chordDegree, preset.scale) * pitchRatio;
    const bassVol = volume * 0.65;
    const bassDur = 0.9;
    // Slight portamento every 4 bars for interest
    if (scheduleBeat % (ticksPerBar * 4) === 0) {
      const slideFrom = bassFreq * 0.94;
      scheduleMusicNote(when + swingOffset, slideFrom, 'triangle', bassDur, bassVol, preset.filterFreq * 0.45, 0);
    } else {
      scheduleMusicNote(when + swingOffset, bassFreq, 'triangle', bassDur, bassVol, preset.filterFreq * 0.45, 0);
    }
  }

  // Chord pad on bar start with slow attack
  if (beatInBar === 0) {
    scheduleMusicChord(when + swingOffset, rootFreq, preset.scale, voice, 2.4, volume * voiceVol * 0.9, preset.filterFreq * 0.65, preset.chordSpread);
  }

  // Arpeggio / melody line
  if (scheduleBeat % preset.arpSpeed === 0) {
    const arpDegree = (scheduleBeat % 7);
    const arpFreq = scaleFreq(preset.rootMidi, chordDegree + arpDegree, preset.scale) * pitchRatio;
    // Accent downbeats and bar starts
    const isAccent = (beatInBar === 0) || (scheduleBeat % preset.density === 0);
    const arpVol = volume * (isAccent ? 0.5 : 0.35);
    const arpPan = ((arpDegree % 3) - 1) * 0.35;
    scheduleMusicNote(when + swingOffset, arpFreq, voice, 0.55, arpVol, preset.filterFreq, arpPan);
  }

  // High sparkle: less frequent, more musical
  if (scheduleBeat % 17 === 3) {
    const sparkleFreq = scaleFreq(preset.rootMidi, chordDegree + 7, preset.scale) * pitchRatio * 2;
    scheduleMusicNote(when + swingOffset, sparkleFreq, 'sine', 1.5, volume * 0.15, preset.filterFreq * 1.5, 0.35);
  }

  // Percussion with velocity mapping
  if (preset.hasDrums && preset.drumPattern) {
    const dp = preset.drumPattern;
    const beatPos = beatInBar / preset.density;
    const kickVel = volume;
    const snareVel = volume * 0.55;
    const hihatVel = volume * 0.3;
    if (dp.kick.includes(beatPos)) scheduleDrum(when + swingOffset, 'kick', kickVel);
    if (dp.snare.includes(beatPos)) scheduleDrum(when + swingOffset, 'snare', snareVel);
    if (dp.hihat.includes(beatPos)) scheduleDrum(when + swingOffset, 'hihat', hihatVel);
  }

  scheduleBeat++;
}

export function startMusic() {
  try {
    if (!currentSettings.musicEnabled) return;
    ensureContext();
    if (musicScheduleTimer) return;
    if (currentSettings.useCustomMusic && customMusicAudio) {
      if (customMusicAudio.paused) {
        customMusicAudio.currentTime = 0;
        customMusicAudio.volume = (currentSettings.musicVolume / 100) * (currentSettings.masterVolume / 100);
        customMusicAudio.play().catch(() => {});
      }
      return;
    }
    const preset = MUSIC_PRESETS[currentSettings.musicPreset];
    if (!preset) return;
    const tempoRatio = Math.max(0.1, currentSettings.musicTempo / 100);
    const pitchRatio = Math.pow(2, currentSettings.musicPitch / 1200);
    const bpm = preset.bpm * tempoRatio;
    if (bpm <= 0 || !isFinite(bpm)) return;
    const beatDuration = 60 / bpm / preset.density;
    if (beatDuration <= 0 || !isFinite(beatDuration)) return;
    const volume = (currentSettings.musicVolume / 100) * (currentSettings.masterVolume / 100) * 0.1;

    scheduleBeat = 0;
    humanSeed = Math.floor(Math.random() * 0x7fffffff);
    const c = ctx;
    if (c) {
      nextNoteTime = c.currentTime + 0.05;
    } else {
      nextNoteTime = 0.05;
    }

    musicScheduleTimer = setInterval(() => {
      try {
        const nowTime = ctx?.currentTime ?? 0;
        while (nextNoteTime < nowTime + LOOKAHEAD_S) {
          scheduleTick(nextNoteTime, preset, pitchRatio, volume);
          nextNoteTime += beatDuration;
        }
      } catch { /* ignore */ }
    }, SCHEDULE_INTERVAL_MS);
  } catch { /* ignore */ }
}

export function stopMusic() {
  if (customMusicAudio) {
    customMusicAudio.pause();
    customMusicAudio.currentTime = 0;
  }
  if (musicScheduleTimer) {
    clearInterval(musicScheduleTimer);
    musicScheduleTimer = null;
  }
  scheduleBeat = 0;
  nextNoteTime = 0;
}

export function initAudio() {
  ensureContext();
}

export const SOUND_PRESETS: SoundPreset[] = [
  'classic', 'electronic', 'retro', 'xylophone', 'bell',
  'space', 'drum', 'piano', 'synthwave', 'chiptune',
  'strings', 'wind', 'jazz', 'percussion', 'ambient',
  'scifi', 'cartoon', 'horror', 'nature', 'mechanical',
];

export const MUSIC_PRESETS_LIST: MusicPreset[] = [
  'orchestral', 'ambient', 'electronic', 'piano', 'synthwave',
  'nature', 'jazz', 'meditation', 'cyber', 'lofi',
  'rock', 'blues', 'folk', 'reggae', 'funk',
  'soul', 'gospel', 'country', 'celtic', 'oriental',
  'tribal', 'space', 'underwater', 'rain', 'windchime',
  'fireplace', 'night', 'sunrise', 'dreamy', 'energetic',
  'battle', 'adventure', 'mystery', 'romantic', 'nostalgic',
  'hopeful', 'epic', 'chill', 'study', 'focus',
];

export const SOUND_PREVIEW_LIST: { name: SoundName; label: string }[] = [
  { name: 'buttonClick', label: 'Click' },
  { name: 'success', label: 'Success' },
  { name: 'error', label: 'Error' },
  { name: 'modalOpen', label: 'Modal' },
  { name: 'toggleOn', label: 'Toggle' },
  { name: 'save', label: 'Save' },
  { name: 'keyPress', label: 'Type' },
  { name: 'workflowComplete', label: 'Complete' },
];
