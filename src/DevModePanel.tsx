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

export default function DevModePanel({ version, settings, effectiveApiEndpoint, screen }: DevModePanelProps) {
  const [pos, setPos] = useState({ x: 16, y: 16 });
  const [size, setSize] = useState({ w: 420, h: 320 });
  const [collapsed, setCollapsed] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, px: 0, py: 0 });
  const resizeStart = useRef({ x: 0, y: 0, w: 420, h: 320 });
  const panelRef = useRef<HTMLDivElement>(null);

  // Real-time stats
  const [fps, setFps] = useState(0);
  const [apiHealthy, setApiHealthy] = useState<boolean | null>(null);
  const [lsUsage, setLsUsage] = useState(0);
  const [memInfo, setMemInfo] = useState<string>('—');
  const [audioCtxState, setAudioCtxState] = useState<string>('—');
  const [time, setTime] = useState(new Date().toLocaleTimeString());

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
      } catch {
        setLsUsage(-1);
      }
    };
    calc();
    const id = setInterval(calc, 5000);
    return () => clearInterval(id);
  }, []);

  // Memory info
  useEffect(() => {
    const calc = () => {
      const mem = (performance as unknown as { memory?: { usedJSHeapSize: number; totalJSHeapSize: number } }).memory;
      if (mem) {
        const used = (mem.usedJSHeapSize / 1048576).toFixed(1);
        const total = (mem.totalJSHeapSize / 1048576).toFixed(1);
        setMemInfo(`${used} / ${total} MB`);
      } else {
        setMemInfo('unavailable');
      }
    };
    calc();
    const id = setInterval(calc, 5000);
    return () => clearInterval(id);
  }, []);

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
        setPos({ x: Math.max(0, dragStart.current.px + dx), y: Math.max(0, dragStart.current.py + dy) });
      }
      if (resizing) {
        const dx = e.clientX - resizeStart.current.x;
        const dy = e.clientY - resizeStart.current.y;
        setSize({
          w: Math.max(240, resizeStart.current.w + dx),
          h: Math.max(160, resizeStart.current.h + dy),
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
      ref={panelRef}
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
        fontFamily: "'JetBrains Mono', 'SFMono-Regular', monospace",
        fontSize: 11,
        borderRadius: 8,
        border: '1px solid #0f0',
        boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
        overflow: 'hidden',
        lineHeight: 1.5,
        userSelect: 'none',
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
          cursor: 'move',
        }}
      >
        <strong style={{ color: '#ff0', fontSize: 12 }}>🐛 DEV MODE</strong>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <span style={{ color: '#888', fontSize: 10 }}>{time}</span>
          <span style={{ color: '#0f0', fontSize: 10 }}>{fps} FPS</span>
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

      {/* Content */}
      <div
        style={{
          flex: 1,
          overflow: 'auto',
          padding: '8px 10px',
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
        }}
      >
        {/* System */}
        <Section title="System">
          <Row label="Version" value={version} />
          <Row label="Screen" value={`${window.innerWidth}x${window.innerHeight} @${window.devicePixelRatio}x`} />
          <Row label="Memory" value={memInfo} />
          <Row label="LocalStorage" value={lsUsage >= 0 ? `${(lsUsage / 1024).toFixed(1)} KB` : 'denied'} />
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
        </Section>

        {/* Audio */}
        <Section title="Audio Engine">
          <Row label="SFX Preset" value={audio.sfxPreset} />
          <Row label="Music Preset" value={audio.musicPreset} />
          <Row label="Master Vol" value={`${audio.masterVolume}%`} />
          <Row label="SFX" value={audio.sfxEnabled ? 'ON' : 'OFF'} />
          <Row label="Music" value={audio.musicEnabled ? 'ON' : 'OFF'} />
          <Row label="Interact" value={audio.soundOnInteract ? 'ON' : 'OFF'} />
          <Row label="Custom SFX" value={audio.useCustomSfx ? audio.customSfxName || 'Y' : 'N'} />
          <Row label="Custom Music" value={audio.useCustomMusic ? audio.customMusicName || 'Y' : 'N'} />
          <Row label="AudioCtx" value={audioCtxState} />
        </Section>

        {/* Performance */}
        <Section title="Performance">
          <Row label="Flags" value={perfFlags.join(', ') || 'none'} />
          <Row label="Img Quality" value={settings.performance.imagePreviewQuality} />
          <Row label="Max Requests" value={String(settings.performance.maxConcurrentRequests)} />
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
          <Row label="Ch2 URL" value={settings.apiBaseUrl2 || '—'} />
          <Row label="Ch3 URL" value={settings.apiBaseUrl3 || '—'} />
        </Section>

        {/* Presets */}
        <Section title="Saved Presets">
          <Row label="Slot 1" value={settings.savedPresets[0]?.name ?? '(empty)'} />
          <Row label="Slot 2" value={settings.savedPresets[1]?.name ?? '(empty)'} />
        </Section>

        {/* Shortcuts sample */}
        <Section title="Shortcuts (first 5)">
          {Object.entries(settings.shortcutMap).slice(0, 5).map(([action, key]) => (
            <Row key={action} label={action} value={key} />
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
          width: 16,
          height: 16,
          cursor: 'nwse-resize',
          background: 'linear-gradient(135deg, transparent 50%, #0f0 50%)',
          borderBottomRightRadius: 7,
        }}
      />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 4 }}>
      <div style={{ color: '#ff0', fontWeight: 700, marginBottom: 2, fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>
        {title}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>{children}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <span style={{ color: '#8a9', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</span>
      <span style={{ color: '#0f0', textAlign: 'right', maxWidth: '60%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</span>
    </div>
  );
}
