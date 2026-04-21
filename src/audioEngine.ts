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
}

export function updateAudioSettings(next: Partial<AudioSettings>) {
  const wasMusicOn = currentSettings.musicEnabled;
  const oldMusicPreset = currentSettings.musicPreset;
  currentSettings = { ...currentSettings, ...next };
  applyVolumes();
  if (currentSettings.musicEnabled && (!wasMusicOn || oldMusicPreset !== currentSettings.musicPreset)) {
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
    EVENTS[name]?.();
  } catch {
    // ignore audio errors
  }
}

export function previewSound(name: SoundName) {
  playSound(name);
}

// ─── Background music engine v3 ───
// Sequenced generative music with chord progressions, arpeggios and rhythm.

const SEMITONES = [0, 2, 4, 5, 7, 9, 11]; // major scale
const MINOR_SEMITONES = [0, 2, 3, 5, 7, 8, 10];
const PENTATONIC = [0, 2, 4, 7, 9];

function mtof(midi: number) {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

function scaleFreq(rootMidi: number, degree: number, scale: number[]) {
  const octaves = Math.floor(degree / scale.length);
  const idx = degree % scale.length;
  return mtof(rootMidi + octaves * 12 + scale[idx]);
}

interface MusicPresetData {
  rootMidi: number;
  scale: number[];
  progression: number[]; // scale degrees for chords
  bpm: number;
  voices: OscillatorType[];
  pattern: number[]; // arpeggio pattern (voice indices)
  density: number; // notes per beat
  filterFreq: number;
  reverbMix: number;
}

const MUSIC_PRESETS: Record<MusicPreset, MusicPresetData> = {
  orchestral: { rootMidi: 48, scale: SEMITONES, progression: [0, 4, 5, 3], bpm: 72, voices: ['sine', 'triangle', 'sine'], pattern: [0, 1, 2, 1, 0, 1, 2, 1], density: 2, filterFreq: 2500, reverbMix: 0.4 },
  ambient:    { rootMidi: 45, scale: MINOR_SEMITONES, progression: [0, 3, 5, 4], bpm: 60, voices: ['sine', 'sine', 'triangle'], pattern: [0, 2, 1, 2], density: 1, filterFreq: 1800, reverbMix: 0.6 },
  electronic: { rootMidi: 50, scale: MINOR_SEMITONES, progression: [0, 5, 3, 4], bpm: 120, voices: ['sawtooth', 'square', 'sawtooth'], pattern: [0, 1, 0, 2, 1, 0, 2, 1], density: 4, filterFreq: 4000, reverbMix: 0.25 },
  piano:      { rootMidi: 52, scale: SEMITONES, progression: [0, 5, 3, 4], bpm: 80, voices: ['triangle', 'sine', 'triangle'], pattern: [0, 1, 2, 0, 1, 2, 1, 0], density: 2, filterFreq: 3500, reverbMix: 0.35 },
  synthwave:  { rootMidi: 49, scale: MINOR_SEMITONES, progression: [0, 3, 5, 4], bpm: 100, voices: ['sawtooth', 'square', 'sawtooth'], pattern: [0, 2, 0, 1, 2, 0, 1, 2], density: 3, filterFreq: 3200, reverbMix: 0.3 },
  nature:     { rootMidi: 47, scale: PENTATONIC, progression: [0, 2, 4, 1], bpm: 65, voices: ['sine', 'triangle', 'sine'], pattern: [0, 1, 2, 1, 0, 2, 1, 0], density: 2, filterFreq: 2200, reverbMix: 0.5 },
  jazz:       { rootMidi: 51, scale: SEMITONES, progression: [0, 3, 4, 1], bpm: 90, voices: ['triangle', 'sine', 'triangle'], pattern: [0, 1, 2, 1, 0, 2, 1, 2], density: 2, filterFreq: 2800, reverbMix: 0.4 },
  meditation: { rootMidi: 43, scale: PENTATONIC, progression: [0, 2, 4, 2], bpm: 50, voices: ['sine', 'sine', 'sine'], pattern: [0, 1, 2, 1], density: 1, filterFreq: 1500, reverbMix: 0.7 },
  cyber:      { rootMidi: 46, scale: MINOR_SEMITONES, progression: [0, 5, 3, 6], bpm: 128, voices: ['square', 'sawtooth', 'square'], pattern: [0, 1, 0, 2, 1, 0, 2, 0], density: 4, filterFreq: 4500, reverbMix: 0.2 },
  lofi:       { rootMidi: 48, scale: MINOR_SEMITONES, progression: [0, 3, 5, 4], bpm: 70, voices: ['sine', 'triangle', 'sine'], pattern: [0, 1, 2, 1, 0, 1, 2, 1], density: 2, filterFreq: 2000, reverbMix: 0.55 },
};

let musicInterval: ReturnType<typeof setInterval> | null = null;
let musicBeat = 0;

function playMusicNote(freq: number, voice: OscillatorType, duration: number, volume: number, filterFreq: number) {
  try {
    const c = ensureContext();
    const t = c.currentTime;
    const osc = c.createOscillator();
    osc.type = voice;
    osc.frequency.value = freq;

    const gain = c.createGain();
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(volume, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(volume * 0.3, t + duration * 0.7);
    gain.gain.linearRampToValueAtTime(0, t + duration);

    const filter = c.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = filterFreq;
    filter.Q.value = 0.8;

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(musicGain!);

    osc.start(t);
    osc.stop(t + duration + 0.05);

    setTimeout(() => {
      try { osc.disconnect(); gain.disconnect(); filter.disconnect(); } catch { /* ignore */ }
    }, (duration + 0.1) * 1000);
  } catch { /* ignore */ }
}

function playMusicChord(rootFreq: number, scale: number[], voice: OscillatorType, duration: number, volume: number, filterFreq: number) {
  // Play triad: root, third, fifth
  const thirdIdx = 2;
  const fifthIdx = 4;
  const thirdRatio = Math.pow(2, scale[thirdIdx % scale.length] / 12);
  const fifthRatio = Math.pow(2, scale[fifthIdx % scale.length] / 12);
  playMusicNote(rootFreq, voice, duration, volume * 0.5, filterFreq);
  playMusicNote(rootFreq * thirdRatio, voice, duration, volume * 0.35, filterFreq);
  playMusicNote(rootFreq * fifthRatio, voice, duration, volume * 0.35, filterFreq);
}

export function startMusic() {
  try {
    if (musicInterval) return;
    const preset = MUSIC_PRESETS[currentSettings.musicPreset];
    const tempoRatio = currentSettings.musicTempo / 100;
    const pitchRatio = Math.pow(2, currentSettings.musicPitch / 1200);
    const bpm = preset.bpm * tempoRatio;
    const beatMs = 60000 / bpm / preset.density;
    const volume = (currentSettings.musicVolume / 100) * (currentSettings.masterVolume / 100) * 0.12;

    musicBeat = 0;
    musicInterval = setInterval(() => {
      try {
        const chordIdx = Math.floor(musicBeat / 8) % preset.progression.length;
        const chordDegree = preset.progression[chordIdx];
        const rootFreq = scaleFreq(preset.rootMidi, chordDegree, preset.scale) * pitchRatio;
        const patIdx = musicBeat % preset.pattern.length;
        const voiceIdx = preset.pattern[patIdx];
        const voice = preset.voices[voiceIdx % preset.voices.length];

        if (musicBeat % 8 === 0) {
          // Bass / chord on downbeat
          playMusicChord(rootFreq / 2, preset.scale, voice, 1.2, volume, preset.filterFreq * 0.6);
        }
        if (musicBeat % 2 === 0) {
          // Arpeggio note
          const arpDegree = (musicBeat % 5);
          const arpFreq = scaleFreq(preset.rootMidi, chordDegree + arpDegree, preset.scale) * pitchRatio * (1 + Math.floor(arpDegree / preset.scale.length));
          playMusicNote(arpFreq, voice, 0.6, volume * 0.7, preset.filterFreq);
        }
        // Occasional high sparkle
        if (musicBeat % 7 === 3) {
          const sparkleFreq = scaleFreq(preset.rootMidi, chordDegree + 7, preset.scale) * pitchRatio * 2;
          playMusicNote(sparkleFreq, 'sine', 0.8, volume * 0.25, preset.filterFreq * 1.5);
        }

        musicBeat++;
      } catch { /* ignore */ }
    }, beatMs);
  } catch { /* ignore */ }
}

export function stopMusic() {
  if (musicInterval) {
    clearInterval(musicInterval);
    musicInterval = null;
  }
  musicBeat = 0;
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
