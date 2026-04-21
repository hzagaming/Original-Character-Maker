// Original Character Maker — Web Audio API Sound Engine v2
// 20 synthesized sound presets, fully parametric, zero external assets.

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

export type MusicPreset =
  | 'orchestral' | 'ambient' | 'electronic' | 'piano' | 'synthwave'
  | 'nature' | 'jazz' | 'meditation' | 'cyber' | 'lofi';

export interface AudioSettings {
  masterVolume: number;
  sfxVolume: number;
  musicVolume: number;
  sfxEnabled: boolean;
  musicEnabled: boolean;
  soundOnInteract: boolean;
  sfxPreset: SoundPreset;
  musicPreset: MusicPreset;
  sfxPitch: number;
  sfxDurationScale: number;
  sfxFilterFreq: number;
  sfxDetune: number;
  sfxReverb: number;
  musicPitch: number;
  musicTempo: number;
  sfxAttack: number;
  sfxDecay: number;
  sfxSustain: number;
  sfxRelease: number;
  sfxPan: number;
  musicReverb: number;
  musicFilter: number;
  musicStereoWidth: number;
}

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
    musicGain.connect(masterGain);
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
  currentSettings = { ...currentSettings, ...next };
  applyVolumes();
  const musicChanged = oldMusicPreset !== currentSettings.musicPreset || oldUseCustomMusic !== currentSettings.useCustomMusic;
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
function createReverbMix(input: AudioNode, dryGain: number, wetGain: number, decay: number): AudioNode {
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
  return mix;
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

  freqs.forEach((f, fi) => {
    const voiceGain = c.createGain();
    voiceGain.gain.value = gain * (1 - fi * 0.08);

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

    oscs.forEach((o) => {
      o.connect(filter);
      o.start(when);
      o.stop(when + actualDuration + preset.release + 0.01);
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

  const output: AudioNode = reverbWet > 0
    ? createReverbMix(rootGain, 1 - reverbWet * 0.5, reverbWet * 0.5, 1.5)
    : rootGain;
  output.connect(sfxGain!);
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
    synthesize({ baseFreq: 150, duration: 0.25, gain: 0.1 });
    synthesize({ baseFreq: 120, duration: 0.25, gain: 0.08 });
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
}

export function setCustomMusic(dataUrl: string | null) {
  if (customMusicAudio) { customMusicAudio.pause(); customMusicAudio = null; }
  if (dataUrl) {
    customMusicAudio = new Audio(dataUrl);
    customMusicAudio.loop = true;
    customMusicAudio.volume = (currentSettings.musicVolume / 100) * (currentSettings.masterVolume / 100);
  }
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
  ambient: makePreset({ rootMidi: 44, scale: MINOR_SEMITONES, progression: [0, 3, 5, 2], bpm: 56, voices: ['sine', 'sine', 'triangle'], voiceMix: [0.45, 0.35, 0.25], pattern: [0, 2, 1, 2], density: 2, filterFreq: 2000, reverbMix: 0.65, bassOctave: 2, hasDrums: false, arpSpeed: 2, chordSpread: [0, 2, 4, 6], chordDensity: 2 }),
  electronic: makePreset({ rootMidi: 50, scale: MINOR_SEMITONES, progression: [0, 5, 3, 4], bpm: 118, voices: ['sawtooth', 'square', 'sawtooth'], voiceMix: [0.5, 0.35, 0.35], pattern: [0, 1, 0, 2, 1, 0, 2, 1], density: 4, filterFreq: 4200, reverbMix: 0.25, bassOctave: 2, hasDrums: true, drumPattern: DRUM_PATTERNS.fourOnFloor, arpSpeed: 1, chordSpread: [0, 2, 4], chordDensity: 1 }),
  piano: makePreset({ rootMidi: 52, scale: SEMITONES, progression: [0, 5, 3, 4], bpm: 76, voices: ['triangle', 'sine', 'triangle'], voiceMix: [0.5, 0.3, 0.3], pattern: [0, 1, 2, 0, 1, 2, 1, 0], density: 4, filterFreq: 3800, reverbMix: 0.35, bassOctave: 2, hasDrums: true, drumPattern: DRUM_PATTERNS.slow, arpSpeed: 2, chordSpread: [0, 2, 4, 7], chordDensity: 2 }),
  synthwave: makePreset({ rootMidi: 49, scale: MINOR_SEMITONES, progression: [0, 3, 5, 4], bpm: 96, voices: ['sawtooth', 'square', 'sawtooth'], voiceMix: [0.5, 0.35, 0.3], pattern: [0, 2, 0, 1, 2, 0, 1, 2], density: 4, filterFreq: 3400, reverbMix: 0.3, bassOctave: 2, hasDrums: true, drumPattern: DRUM_PATTERNS.fourOnFloor, arpSpeed: 1, chordSpread: [0, 2, 4], chordDensity: 1 }),
  nature: makePreset({ rootMidi: 47, scale: PENTATONIC, progression: [0, 2, 4, 1], bpm: 62, voices: ['sine', 'triangle', 'sine'], voiceMix: [0.45, 0.35, 0.25], pattern: [0, 1, 2, 1, 0, 2, 1, 0], density: 2, filterFreq: 2400, reverbMix: 0.55, bassOctave: 1, hasDrums: false, arpSpeed: 2, chordSpread: [0, 2, 4], chordDensity: 2 }),
  jazz: makePreset({ rootMidi: 51, scale: SEMITONES, progression: [0, 3, 4, 1], bpm: 88, voices: ['triangle', 'sine', 'triangle'], voiceMix: [0.5, 0.3, 0.3], pattern: [0, 1, 2, 1, 0, 2, 1, 2], density: 4, filterFreq: 3000, reverbMix: 0.4, bassOctave: 2, hasDrums: true, drumPattern: DRUM_PATTERNS.jazzBrush, arpSpeed: 2, chordSpread: [0, 2, 4, 6], chordDensity: 2 }),
  meditation: makePreset({ rootMidi: 42, scale: PENTATONIC, progression: [0, 2, 4, 2], bpm: 48, voices: ['sine', 'sine', 'sine'], voiceMix: [0.4, 0.3, 0.25], pattern: [0, 1, 2, 1], density: 2, filterFreq: 1600, reverbMix: 0.75, bassOctave: 1, hasDrums: false, arpSpeed: 2, chordSpread: [0, 2, 4], chordDensity: 2 }),
  cyber: makePreset({ rootMidi: 46, scale: MINOR_SEMITONES, progression: [0, 5, 3, 6], bpm: 126, voices: ['square', 'sawtooth', 'square'], voiceMix: [0.5, 0.35, 0.35], pattern: [0, 1, 0, 2, 1, 0, 2, 0], density: 4, filterFreq: 4600, reverbMix: 0.2, bassOctave: 2, hasDrums: true, drumPattern: DRUM_PATTERNS.electronic, arpSpeed: 1, chordSpread: [0, 2, 4], chordDensity: 1 }),
  lofi: makePreset({ rootMidi: 48, scale: DORIAN, progression: [0, 3, 5, 4], bpm: 68, voices: ['sine', 'triangle', 'sine'], voiceMix: [0.45, 0.35, 0.25], pattern: [0, 1, 2, 1, 0, 1, 2, 1], density: 4, filterFreq: 2200, reverbMix: 0.55, bassOctave: 2, hasDrums: true, drumPattern: DRUM_PATTERNS.slow, arpSpeed: 2, chordSpread: [0, 2, 4, 6], chordDensity: 2 }),
  rock: makePreset({ rootMidi: 45, scale: MINOR_SEMITONES, progression: [0, 3, 5, 4, 5, 3, 4, 0], bpm: 112, voices: ['sawtooth', 'square', 'sawtooth'], voiceMix: [0.5, 0.3, 0.3], pattern: [0, 1, 0, 2], density: 4, filterFreq: 4000, reverbMix: 0.3, bassOctave: 2, hasDrums: true, drumPattern: DRUM_PATTERNS.rock, arpSpeed: 1, chordSpread: [0, 2, 4], chordDensity: 1 }),
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
  space: makePreset({ rootMidi: 45, scale: WHOLE_TONE, progression: [0, 2, 4, 1], bpm: 60, voices: ['sine', 'sine', 'sine'], voiceMix: [0.4, 0.3, 0.25], pattern: [0, 2, 1, 2, 0, 1, 2, 1], density: 2, filterFreq: 1800, reverbMix: 0.7, bassOctave: 2, hasDrums: false, arpSpeed: 2, chordSpread: [0, 2, 4, 6], chordDensity: 2 }),
  underwater: makePreset({ rootMidi: 46, scale: DORIAN, progression: [0, 3, 5, 2], bpm: 54, voices: ['sine', 'triangle', 'sine'], voiceMix: [0.4, 0.3, 0.25], pattern: [0, 1, 2, 1], density: 2, filterFreq: 1600, reverbMix: 0.65, bassOctave: 2, hasDrums: false, arpSpeed: 2, chordSpread: [0, 2, 4], chordDensity: 2 }),
  rain: makePreset({ rootMidi: 47, scale: MINOR_SEMITONES, progression: [0, 3, 5, 4, 3, 5, 4, 0], bpm: 50, voices: ['sine', 'sine', 'triangle'], voiceMix: [0.35, 0.3, 0.25], pattern: [0, 2, 1, 2], density: 2, filterFreq: 2000, reverbMix: 0.6, bassOctave: 2, hasDrums: false, arpSpeed: 2, chordSpread: [0, 2, 4, 6], chordDensity: 2 }),
  windchime: makePreset({ rootMidi: 52, scale: PENTATONIC, progression: [0, 2, 4, 1, 0, 4, 2, 1], bpm: 58, voices: ['sine', 'sine', 'sine'], voiceMix: [0.4, 0.3, 0.25], pattern: [0, 1, 2, 0, 1, 2, 1, 0], density: 4, filterFreq: 4000, reverbMix: 0.7, bassOctave: 1, hasDrums: false, arpSpeed: 2, chordSpread: [0, 2, 4], chordDensity: 1 }),
  fireplace: makePreset({ rootMidi: 43, scale: BLUES_SCALE, progression: [0, 3, 4, 3], bpm: 52, voices: ['triangle', 'sine', 'triangle'], voiceMix: [0.4, 0.3, 0.25], pattern: [0, 1, 2, 1], density: 2, filterFreq: 1500, reverbMix: 0.5, bassOctave: 2, hasDrums: false, arpSpeed: 2, chordSpread: [0, 2, 4, 5], chordDensity: 2 }),
  night: makePreset({ rootMidi: 46, scale: MINOR_SEMITONES, progression: [0, 5, 3, 4], bpm: 56, voices: ['sine', 'sine', 'triangle'], voiceMix: [0.4, 0.3, 0.25], pattern: [0, 2, 1, 2], density: 2, filterFreq: 1800, reverbMix: 0.6, bassOctave: 2, hasDrums: false, arpSpeed: 2, chordSpread: [0, 2, 4], chordDensity: 2 }),
  sunrise: makePreset({ rootMidi: 50, scale: LYDIAN, progression: [0, 4, 5, 3, 0, 5, 3, 4], bpm: 72, voices: ['triangle', 'sine', 'triangle'], voiceMix: [0.5, 0.35, 0.3], pattern: [0, 1, 2, 1, 0, 1, 2, 1], density: 4, filterFreq: 3000, reverbMix: 0.45, bassOctave: 2, hasDrums: true, drumPattern: DRUM_PATTERNS.slow, arpSpeed: 2, chordSpread: [0, 2, 4, 7], chordDensity: 1 }),
  dreamy: makePreset({ rootMidi: 48, scale: WHOLE_TONE, progression: [0, 2, 4, 1], bpm: 64, voices: ['sine', 'sine', 'sine'], voiceMix: [0.4, 0.3, 0.25], pattern: [0, 1, 2, 1, 0, 2, 1, 0], density: 2, filterFreq: 2000, reverbMix: 0.65, bassOctave: 2, hasDrums: false, arpSpeed: 2, chordSpread: [0, 2, 4, 6], chordDensity: 2 }),
  energetic: makePreset({ rootMidi: 50, scale: SEMITONES, progression: [0, 4, 5, 3, 4, 0, 5, 3], bpm: 128, voices: ['sawtooth', 'square', 'sawtooth'], voiceMix: [0.5, 0.35, 0.35], pattern: [0, 1, 0, 2, 1, 0, 2, 1], density: 4, filterFreq: 4400, reverbMix: 0.25, bassOctave: 2, hasDrums: true, drumPattern: DRUM_PATTERNS.fourOnFloor, arpSpeed: 1, chordSpread: [0, 2, 4], chordDensity: 1 }),
  battle: makePreset({ rootMidi: 45, scale: PHRYGIAN, progression: [0, 3, 2, 5, 0, 2, 3, 5], bpm: 110, voices: ['sawtooth', 'square', 'sawtooth'], voiceMix: [0.5, 0.35, 0.3], pattern: [0, 1, 2, 0, 1, 2, 1, 0], density: 4, filterFreq: 3600, reverbMix: 0.3, bassOctave: 2, hasDrums: true, drumPattern: DRUM_PATTERNS.rock, arpSpeed: 1, chordSpread: [0, 2, 4], chordDensity: 1 }),
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

function scheduleMusicNote(when: number, freq: number, voice: OscillatorType, duration: number, volume: number, filterFreq: number, stereoPan = 0) {
  try {
    const c = ctx!;
    const osc1 = c.createOscillator();
    osc1.type = voice;
    osc1.frequency.value = freq;
    const osc2 = c.createOscillator();
    osc2.type = voice === 'sine' ? 'triangle' : 'sine';
    osc2.frequency.value = freq * 2;
    osc2.detune.value = 8;

    const gain = c.createGain();
    gain.gain.setValueAtTime(0, when);
    const peakVol = volume * 0.9;
    gain.gain.linearRampToValueAtTime(peakVol, when + 0.03);
    gain.gain.exponentialRampToValueAtTime(peakVol * 0.2, when + duration * 0.7);
    gain.gain.linearRampToValueAtTime(0, when + duration);

    const filter = c.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = filterFreq;
    filter.Q.value = 0.7;

    const panner = c.createStereoPanner ? c.createStereoPanner() : null;
    if (panner) panner.pan.value = stereoPan;

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    const output: AudioNode = panner || gain;
    if (panner) { gain.connect(panner); }
    output.connect(musicGain!);

    osc1.start(when);
    osc2.start(when);
    osc1.stop(when + duration + 0.05);
    osc2.stop(when + duration + 0.05);
  } catch { /* ignore */ }
}

function scheduleMusicChord(when: number, rootFreq: number, scale: number[], voice: OscillatorType, duration: number, volume: number, filterFreq: number, spread: number[]) {
  spread.forEach((deg, i) => {
    const ratio = Math.pow(2, scale[deg % scale.length] / 12) * (1 + Math.floor(deg / scale.length));
    const v = volume * (1 - i * 0.08) * 0.5;
    scheduleMusicNote(when, rootFreq * ratio, voice, duration, v, filterFreq, (i - 1) * 0.2);
  });
}

function scheduleDrum(when: number, type: 'kick' | 'snare' | 'hihat', volume: number) {
  try {
    const c = ctx!;
    if (type === 'kick') {
      const osc = c.createOscillator();
      osc.frequency.setValueAtTime(150, when);
      osc.frequency.exponentialRampToValueAtTime(40, when + 0.12);
      const gain = c.createGain();
      gain.gain.setValueAtTime(volume * 0.7, when);
      gain.gain.exponentialRampToValueAtTime(0.001, when + 0.15);
      osc.connect(gain);
      gain.connect(musicGain!);
      osc.start(when);
      osc.stop(when + 0.16);
    } else if (type === 'snare') {
      const bufferSize = Math.floor(c.sampleRate * 0.1);
      const buffer = c.createBuffer(1, bufferSize, c.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2);
      const noise = c.createBufferSource();
      noise.buffer = buffer;
      const filter = c.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.value = 800;
      const gain = c.createGain();
      gain.gain.setValueAtTime(volume * 0.35, when);
      gain.gain.exponentialRampToValueAtTime(0.001, when + 0.1);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(musicGain!);
      noise.start(when);
      noise.stop(when + 0.12);
    } else if (type === 'hihat') {
      const bufferSize = Math.floor(c.sampleRate * 0.03);
      const buffer = c.createBuffer(1, bufferSize, c.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1);
      const noise = c.createBufferSource();
      noise.buffer = buffer;
      const filter = c.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.value = 6000;
      const gain = c.createGain();
      gain.gain.setValueAtTime(volume * 0.15, when);
      gain.gain.exponentialRampToValueAtTime(0.001, when + 0.03);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(musicGain!);
      noise.start(when);
      noise.stop(when + 0.04);
    }
  } catch { /* ignore */ }
}

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

  // Bass on downbeats
  if (scheduleBeat % preset.density === 0) {
    const bassFreq = scaleFreq(preset.rootMidi - preset.bassOctave * 12, chordDegree, preset.scale) * pitchRatio;
    scheduleMusicNote(when, bassFreq, 'triangle', 0.8, volume * 0.7, preset.filterFreq * 0.5);
  }

  // Chord on bar start
  if (beatInBar === 0) {
    scheduleMusicChord(when, rootFreq, preset.scale, voice, 1.8, volume * voiceVol, preset.filterFreq * 0.7, preset.chordSpread);
  }

  // Arpeggio
  if (scheduleBeat % preset.arpSpeed === 0) {
    const arpDegree = (scheduleBeat % 7);
    const arpOctave = 1 + Math.floor(arpDegree / preset.scale.length);
    const arpFreq = scaleFreq(preset.rootMidi, chordDegree + arpDegree, preset.scale) * pitchRatio * arpOctave;
    scheduleMusicNote(when, arpFreq, voice, 0.5, volume * 0.45, preset.filterFreq, ((arpDegree % 3) - 1) * 0.3);
  }

  // Occasional high sparkle
  if (scheduleBeat % 13 === 5) {
    const sparkleFreq = scaleFreq(preset.rootMidi, chordDegree + 7, preset.scale) * pitchRatio * 2;
    scheduleMusicNote(when, sparkleFreq, 'sine', 1.2, volume * 0.18, preset.filterFreq * 1.6, 0.4);
  }

  // Percussion with pattern
  if (preset.hasDrums && preset.drumPattern) {
    const dp = preset.drumPattern;
    const beatPos = beatInBar / preset.density;
    if (dp.kick.includes(beatPos)) scheduleDrum(when, 'kick', volume);
    if (dp.snare.includes(beatPos)) scheduleDrum(when, 'snare', volume * 0.6);
    if (dp.hihat.includes(beatPos)) scheduleDrum(when, 'hihat', volume * 0.35);
  }

  scheduleBeat++;
}

export function startMusic() {
  try {
    ensureContext();
    if (musicScheduleTimer) return;
    if (currentSettings.useCustomMusic && customMusicAudio) {
      customMusicAudio.currentTime = 0;
      customMusicAudio.volume = (currentSettings.musicVolume / 100) * (currentSettings.masterVolume / 100);
      customMusicAudio.play().catch(() => {});
      return;
    }
    const preset = MUSIC_PRESETS[currentSettings.musicPreset];
    const tempoRatio = currentSettings.musicTempo / 100;
    const pitchRatio = Math.pow(2, currentSettings.musicPitch / 1200);
    const bpm = preset.bpm * tempoRatio;
    const beatDuration = 60 / bpm / preset.density;
    const volume = (currentSettings.musicVolume / 100) * (currentSettings.masterVolume / 100) * 0.1;

    scheduleBeat = 0;
    nextNoteTime = ctx!.currentTime + 0.05;

    musicScheduleTimer = setInterval(() => {
      try {
        while (nextNoteTime < ctx!.currentTime + LOOKAHEAD_S) {
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
