import { useEffect, useRef, useState, useCallback } from 'react';
import type { SettingsState } from './types';
import { ensureLocalApiProbed } from './apiConfig';
import { getAudioSettings } from './audioEngine';

interface DevModePanelProps {
  version: string;
  settings: SettingsState;
  effectiveApiEndpoint: string;
  screen?: string;
}

const PANEL_STORAGE_KEY = 'oc-maker.devmode-panel';
const MIN_W = 280;
const MIN_H = 200;

function loadPanelState() {
  try {
    const raw = localStorage.getItem(PANEL_STORAGE_KEY);
    if (raw) return JSON.parse(raw) as { x: number; y: number; w: number; h: number };
  } catch { /* ignore */ }
  return null;
}

function savePanelState(x: number, y: number, w: number, h: number) {
  try {
    localStorage.setItem(PANEL_STORAGE_KEY, JSON.stringify({ x, y, w, h }));
  } catch { /* ignore */ }
}

export default function DevModePanel({ version, settings, effectiveApiEndpoint, screen }: DevModePanelProps) {
  const saved = loadPanelState();
  const [pos, setPos] = useState({ x: saved?.x ?? 16, y: saved?.y ?? 16 });
  const [size, setSize] = useState({ w: saved?.w ?? 460, h: saved?.h ?? 380 });
  const [collapsed, setCollapsed] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState(false);
  const [copied, setCopied] = useState(false);
  const copiedTimerRef = useRef<number>(0);
  const dragStart = useRef({ x: 0, y: 0, px: 0, py: 0 });
  const resizeStart = useRef({ x: 0, y: 0, w: MIN_W, h: MIN_H });
  const contentRef = useRef<HTMLDivElement>(null);

  // Real-time stats
  const [fps, setFps] = useState(0);
  const [apiHealthy, setApiHealthy] = useState<boolean | null>(null);
  const [lsUsage, setLsUsage] = useState(0);
  const [lsKeys, setLsKeys] = useState(0);
  const [memInfo, setMemInfo] = useState<string>('—');
  const [audioCtxState, setAudioCtxState] = useState<string>('—');
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [online, setOnline] = useState(navigator.onLine);
  const [domNodes, setDomNodes] = useState(0);
  const [sessionStart] = useState(() => performance.now());
  const [uptime, setUptime] = useState('0s');

  // Persist pos/size
  useEffect(() => {
    savePanelState(pos.x, pos.y, size.w, size.h);
  }, [pos, size]);

  useEffect(() => {
    return () => {
      if (copiedTimerRef.current) {
        window.clearTimeout(copiedTimerRef.current);
      }
    };
  }, []);

  // FPS counter
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let raf = 0;
    const tick = () => {
      frameCount++;
      const now = performance.now();
      if (now - lastTime >= 1000) {
        setFps(Math.round((frameCount * 1000) / (now - lastTime)));
        frameCount = 0;
        lastTime = now;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // API health probe
  useEffect(() => {
    const check = async () => {
      try {
        await ensureLocalApiProbed();
        const base = effectiveApiEndpoint || 'http://localhost:3001';
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 2000);
        const res = await fetch(`${base}/api/health`, { signal: controller.signal });
        clearTimeout(timer);
        setApiHealthy(res.ok);
      } catch {
        setApiHealthy(false);
      }
    };
    check();
    const id = setInterval(check, 10000);
    return () => clearInterval(id);
  }, [effectiveApiEndpoint]);

  // LocalStorage usage
  useEffect(() => {
    const calc = () => {
      try {
        let total = 0;
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i) || '';
          total += key.length + (localStorage.getItem(key)?.length || 0);
        }
        setLsUsage(total);
        setLsKeys(localStorage.length);
      } catch {
        setLsUsage(-1);
        setLsKeys(-1);
      }
    };
    calc();
    const id = setInterval(calc, 5000);
    return () => clearInterval(id);
  }, []);

  // Memory + DOM + uptime
  useEffect(() => {
    const calc = () => {
      const mem = (performance as unknown as { memory?: { usedJSHeapSize: number; totalJSHeapSize: number; jsHeapSizeLimit: number } }).memory;
      if (mem) {
        const used = (mem.usedJSHeapSize / 1048576).toFixed(1);
        const total = (mem.totalJSHeapSize / 1048576).toFixed(1);
        const limit = (mem.jsHeapSizeLimit / 1048576).toFixed(0);
        setMemInfo(`${used}/${total}MB (lim ${limit}MB)`);
      } else {
        setMemInfo('unavailable');
      }
      try { setDomNodes(document.querySelectorAll('*').length); } catch { setDomNodes(0); }
      const secs = Math.floor((performance.now() - sessionStart) / 1000);
      const m = Math.floor(secs / 60);
      const s = secs % 60;
      setUptime(m > 0 ? `${m}m ${s}s` : `${s}s`);
    };
    calc();
    const id = setInterval(calc, 5000);
    return () => clearInterval(id);
  }, [sessionStart]);

  // Clock
  useEffect(() => {
    const id = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(id);
  }, []);

  // Audio context state
  useEffect(() => {
    const check = () => {
      try {
        const ctx = (window as unknown as { __audioCtx?: AudioContext }).__audioCtx;
        setAudioCtxState(ctx?.state || 'closed');
      } catch {
        setAudioCtxState('error');
      }
    };
    check();
    const id = setInterval(check, 2000);
    return () => clearInterval(id);
  }, []);

  // Network state
  useEffect(() => {
    const onOnline = () => setOnline(true);
    const onOffline = () => setOnline(false);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, []);

  const onDragStart = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.devmode-resize')) return;
    setDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY, px: pos.x, py: pos.y };
    e.preventDefault();
  }, [pos]);

  const onResizeStart = useCallback((e: React.MouseEvent) => {
    setResizing(true);
    resizeStart.current = { x: e.clientX, y: e.clientY, w: size.w, h: size.h };
    e.preventDefault();
    e.stopPropagation();
  }, [size]);

  useEffect(() => {
    if (!dragging && !resizing) return;
    const onMove = (e: MouseEvent) => {
      if (dragging) {
        const dx = e.clientX - dragStart.current.x;
        const dy = e.clientY - dragStart.current.y;
        const nx = Math.max(0, Math.min(window.innerWidth - 60, dragStart.current.px + dx));
        const ny = Math.max(0, Math.min(window.innerHeight - 40, dragStart.current.py + dy));
        setPos({ x: nx, y: ny });
      }
      if (resizing) {
        const dx = e.clientX - resizeStart.current.x;
        const dy = e.clientY - resizeStart.current.y;
        setSize({
          w: Math.max(MIN_W, resizeStart.current.w + dx),
          h: Math.max(MIN_H, resizeStart.current.h + dy),
        });
      }
    };
    const onUp = () => {
      setDragging(false);
      setResizing(false);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [dragging, resizing]);

  const buildReport = useCallback(() => {
    const audio = getAudioSettings();
    const perfFlags = [
      settings.performance.reduceAnimations && 'noAnim',
      settings.performance.disableGlassmorphism && 'noGlass',
      settings.performance.lowResolutionPreviews && 'lowRes',
      settings.performance.lazyLoadModules && 'lazyLoad',
      settings.performance.disableParticles && 'noPart',
      settings.performance.aggressiveCaching && 'aggrCache',
      settings.performance.devMode && 'dev',
    ].filter(Boolean);
    const lines: string[] = [];
    lines.push(`=== OC Maker Debug Report ===`);
    lines.push(`Version: ${version}`);
    lines.push(`Time: ${new Date().toISOString()}`);
    lines.push(`Screen: ${screen || 'home'} | ${window.innerWidth}x${window.innerHeight} @${window.devicePixelRatio}x`);
    lines.push(`Viewport: ${window.innerWidth}x${window.innerHeight}`);
    lines.push(`Browser: ${navigator.userAgent}`);
    lines.push(`Platform: ${navigator.platform}`);
    lines.push(`Online: ${online ? 'Y' : 'N'}`);
    lines.push(`Lang: ${settings.language} | Preset: ${settings.stylePreset} | Depth: ${settings.depth}`);
    lines.push(`Accent: ${settings.accent} | Font: ${settings.fontPreset}`);
    lines.push(`Contrast: ${settings.contrast}% | Border: ${settings.borderWidth}px`);
    lines.push(`Animation: ${settings.animation.enabled ? 'ON' : 'OFF'} @ ${settings.animation.speed}%`);
    lines.push(`Performance: ${perfFlags.join(', ') || 'none'}`);
    lines.push(`Image Quality: ${settings.performance.imagePreviewQuality} | Max Req: ${settings.performance.maxConcurrentRequests}`);
    lines.push(`Audio: SFX=${audio.sfxEnabled ? 'ON' : 'OFF'}(${audio.sfxPreset}) Music=${audio.musicEnabled ? 'ON' : 'OFF'}(${audio.musicPreset})`);
    lines.push(`Audio Vol: Master=${audio.masterVolume}% SFX=${audio.sfxVolume}% Music=${audio.musicVolume}%`);
    lines.push(`Audio Params: Pitch=${audio.musicPitch} Tempo=${audio.musicTempo} Reverb=${audio.musicReverb} Filter=${audio.musicFilter}`);
    lines.push(`Custom Audio: SFX=${audio.useCustomSfx ? 'Y' : 'N'} Music=${audio.useCustomMusic ? 'Y' : 'N'}`);
    lines.push(`AudioCtx: ${audioCtxState}`);
    lines.push(`API: ${settings.interfaceMode} | ${settings.apiPreset} | ${effectiveApiEndpoint || 'none'}`);
    lines.push(`API Health: ${apiHealthy === null ? 'checking' : apiHealthy ? 'OK' : 'FAIL'}`);
    lines.push(`Memory: ${memInfo}`);
    lines.push(`DOM Nodes: ${domNodes}`);
    lines.push(`LocalStorage: ${lsUsage >= 0 ? (lsUsage / 1024).toFixed(1) + ' KB' : 'denied'} (${lsKeys} keys)`);
    lines.push(`Uptime: ${uptime}`);
    lines.push(`FPS: ${fps}`);
    lines.push(`Saved Presets: [${settings.savedPresets[0]?.name ?? 'empty'}, ${settings.savedPresets[1]?.name ?? 'empty'}]`);
    lines.push(`=== Shortcuts ===`);
    Object.entries(settings.shortcutMap).forEach(([action, key]) => {
      lines.push(`  ${action}: ${key}`);
    });
    return lines.join('\n');
  }, [version, settings, screen, effectiveApiEndpoint, apiHealthy, memInfo, domNodes, lsUsage, lsKeys, uptime, fps, audioCtxState, online]);

  const handleCopyAll = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(buildReport());
      setCopied(true);
      copiedTimerRef.current = window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }, [buildReport]);

  if (collapsed) {
    return (
      <button
        type="button"
        onClick={() => setCollapsed(false)}
        style={{
          position: 'fixed',
          right: 16,
          bottom: 16,
          zIndex: 9999,
          background: '#e74c3c',
          color: '#fff',
          border: 'none',
          borderRadius: 4,
          padding: '4px 10px',
          fontSize: 11,
          fontWeight: 700,
          fontFamily: 'monospace',
          cursor: 'pointer',
          letterSpacing: 0.5,
        }}
      >
        DEV
      </button>
    );
  }

  const audio = getAudioSettings();
  const perfFlags = [
    settings.performance.reduceAnimations && 'noAnim',
    settings.performance.disableGlassmorphism && 'noGlass',
    settings.performance.lowResolutionPreviews && 'lowRes',
    settings.performance.lazyLoadModules && 'lazyLoad',
    settings.performance.disableParticles && 'noPart',
    settings.performance.aggressiveCaching && 'aggrCache',
    settings.performance.devMode && 'dev',
  ].filter(Boolean);

  return (
    <div
      style={{
        position: 'fixed',
        left: pos.x,
        top: pos.y,
        width: size.w,
        height: size.h,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        background: 'rgba(10,14,20,0.96)',
        color: '#0f0',
        fontFamily: "'JetBrains Mono', 'SFMono-Regular', Consolas, monospace",
        fontSize: 11,
        borderRadius: 8,
        border: '1px solid #0f0',
        boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
        overflow: 'hidden',
        lineHeight: 1.5,
        userSelect: 'none',
        cursor: dragging ? 'grabbing' : 'default',
      }}
    >
      {/* Header / drag handle */}
      <div
        onMouseDown={onDragStart}
        style={{
          padding: '6px 10px',
          background: 'rgba(0,255,0,0.08)',
          borderBottom: '1px solid #0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: dragging ? 'grabbing' : 'grab',
          flexShrink: 0,
        }}
      >
        <strong style={{ color: '#ff0', fontSize: 12 }}>🐛 DEV MODE</strong>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <span style={{ color: '#888', fontSize: 10 }}>{time}</span>
          <span style={{ color: '#0f0', fontSize: 10 }}>{fps} FPS</span>
          <button
            type="button"
            onClick={handleCopyAll}
            title="Copy full debug report"
            style={{
              background: copied ? 'rgba(0,255,0,0.2)' : 'transparent',
              border: '1px solid #0f0',
              color: '#0f0',
              borderRadius: 3,
              fontSize: 10,
              padding: '1px 6px',
              cursor: 'pointer',
            }}
          >
            {copied ? '✓ Copied' : 'Copy'}
          </button>
          <button
            type="button"
            onClick={() => setCollapsed(true)}
            style={{
              background: 'transparent',
              border: '1px solid #0f0',
              color: '#0f0',
              borderRadius: 3,
              fontSize: 10,
              padding: '1px 6px',
              cursor: 'pointer',
            }}
          >
            −
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div
        ref={contentRef}
        style={{
          flex: 1,
          overflow: 'auto',
          padding: '8px 10px',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}
      >
        {/* System */}
        <Section title="System">
          <Row label="Version" value={version} />
          <Row label="Screen" value={`${window.innerWidth}x${window.innerHeight} @${window.devicePixelRatio}x`} />
          <Row label="Viewport" value={`${window.innerWidth}x${window.innerHeight}`} />
          <Row label="Platform" value={navigator.platform} />
          <Row label="Online" value={online ? '✅' : '❌'} />
          <Row label="Color Scheme" value={window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'} />
          <Row label="Memory" value={memInfo} />
          <Row label="DOM Nodes" value={String(domNodes)} />
          <Row label="LocalStorage" value={lsUsage >= 0 ? `${(lsUsage / 1024).toFixed(1)} KB (${lsKeys} keys)` : 'denied'} />
          <Row label="Uptime" value={uptime} />
        </Section>

        {/* App State */}
        <Section title="App State">
          <Row label="Screen" value={screen || 'home'} />
          <Row label="Lang" value={settings.language} />
          <Row label="Preset" value={settings.stylePreset} />
          <Row label="Depth" value={settings.depth} />
          <Row label="Accent" value={settings.accent} />
          <Row label="Font" value={settings.fontPreset} />
          <Row label="Contrast" value={`${settings.contrast}%`} />
          <Row label="Border" value={`${settings.borderWidth}px`} />
          <Row label="Anim Speed" value={`${settings.animation.speed}%`} />
          <Row label="Anim On" value={settings.animation.enabled ? 'Y' : 'N'} />
          <Row label="Interface" value={settings.interfaceMode} />
        </Section>

        {/* Audio */}
        <Section title="Audio Engine">
          <Row label="SFX Preset" value={audio.sfxPreset} />
          <Row label="Music Preset" value={audio.musicPreset} />
          <Row label="Master Vol" value={`${audio.masterVolume}%`} />
          <Row label="SFX Vol" value={`${audio.sfxVolume}%`} />
          <Row label="Music Vol" value={`${audio.musicVolume}%`} />
          <Row label="SFX" value={audio.sfxEnabled ? 'ON' : 'OFF'} />
          <Row label="Music" value={audio.musicEnabled ? 'ON' : 'OFF'} />
          <Row label="Interact" value={audio.soundOnInteract ? 'ON' : 'OFF'} />
          <Row label="Music Tempo" value={`${audio.musicTempo}%`} />
          <Row label="Music Pitch" value={`${audio.musicPitch}`} />
          <Row label="Music Reverb" value={`${audio.musicReverb}%`} />
          <Row label="Music Filter" value={`${audio.musicFilter}Hz`} />
          <Row label="Stereo Width" value={`${audio.musicStereoWidth}%`} />
          <Row label="Custom SFX" value={audio.useCustomSfx ? audio.customSfxName || 'Y' : 'N'} />
          <Row label="Custom Music" value={audio.useCustomMusic ? audio.customMusicName || 'Y' : 'N'} />
          <Row label="AudioCtx" value={audioCtxState} />
        </Section>

        {/* Performance */}
        <Section title="Performance">
          <Row label="Flags" value={perfFlags.join(', ') || 'none'} />
          <Row label="Img Quality" value={settings.performance.imagePreviewQuality} />
          <Row label="Max Requests" value={String(settings.performance.maxConcurrentRequests)} />
          <Row label="Reduce Anim" value={settings.performance.reduceAnimations ? 'Y' : 'N'} />
          <Row label="No Glass" value={settings.performance.disableGlassmorphism ? 'Y' : 'N'} />
          <Row label="Low Res" value={settings.performance.lowResolutionPreviews ? 'Y' : 'N'} />
          <Row label="Lazy Load" value={settings.performance.lazyLoadModules ? 'Y' : 'N'} />
          <Row label="No Particles" value={settings.performance.disableParticles ? 'Y' : 'N'} />
          <Row label="Aggressive Cache" value={settings.performance.aggressiveCaching ? 'Y' : 'N'} />
        </Section>

        {/* API */}
        <Section title="API">
          <Row
            label="Health"
            value={apiHealthy === null ? 'checking…' : apiHealthy ? '✅ OK' : '❌ FAIL'}
          />
          <Row label="Mode" value={settings.interfaceMode} />
          <Row label="Endpoint" value={effectiveApiEndpoint || 'none'} />
          <Row label="Preset" value={settings.apiPreset} />
          <Row label="Ch1 URL" value={settings.apiBaseUrl || '—'} />
          <Row label="Ch1 Key" value={settings.apiKey ? '••••' + settings.apiKey.slice(-4) : '—'} />
          <Row label="Ch2 URL" value={settings.apiBaseUrl2 || '—'} />
          <Row label="Ch3 URL" value={settings.apiBaseUrl3 || '—'} />
        </Section>

        {/* Presets */}
        <Section title="Saved Presets">
          <Row label="Slot 1" value={settings.savedPresets[0]?.name ?? '(empty)'} />
          <Row label="Slot 2" value={settings.savedPresets[1]?.name ?? '(empty)'} />
        </Section>

        {/* All Shortcuts */}
        <Section title={`Shortcuts (${Object.keys(settings.shortcutMap).length})`}>
          {Object.entries(settings.shortcutMap).map(([action, key]) => (
            <Row key={action} label={action} value={key || '—'} />
          ))}
        </Section>
      </div>

      {/* Resize handle */}
      <div
        className="devmode-resize"
        onMouseDown={onResizeStart}
        style={{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: 18,
          height: 18,
          cursor: 'nwse-resize',
          background: 'linear-gradient(135deg, transparent 55%, #0f0 55%)',
          borderBottomRightRadius: 7,
          opacity: 0.7,
        }}
      />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 2 }}>
      <div style={{ color: '#ff0', fontWeight: 700, marginBottom: 3, fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.6, borderBottom: '1px solid rgba(255,255,0,0.2)', paddingBottom: 2 }}>
        {title}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>{children}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
      <span style={{ color: '#8a9', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flexShrink: 0 }}>{label}</span>
      <span style={{ color: '#0f0', textAlign: 'right', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</span>
    </div>
  );
}
