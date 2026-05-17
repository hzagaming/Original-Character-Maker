import { useEffect, useRef, useState } from 'react';
import type { TransferError } from '../types';

const ERR_PANEL_STORAGE_KEY = 'oc-maker.error-panel';
const ERR_MIN_W = 320;
const ERR_MIN_H = 180;

function loadErrorPanelState() {
  try {
    const raw = localStorage.getItem(ERR_PANEL_STORAGE_KEY);
    if (raw) return JSON.parse(raw) as { x: number; y: number; w: number; h: number; collapsed?: boolean };
  } catch { /* ignore */ }
  return null;
}

function saveErrorPanelState(x: number, y: number, w: number, h: number, collapsed: boolean) {
  try {
    localStorage.setItem(ERR_PANEL_STORAGE_KEY, JSON.stringify({ x, y, w, h, collapsed }));
  } catch { /* ignore */ }
}

function safeJsonStringify(value: unknown, space?: number): string {
  try {
    return JSON.stringify(value, null, space);
  } catch {
    return '{"error":"JSON serialization failed"}';
  }
}

export type ErrorPanelLabels = {
  title: string;
  stage: string;
  message: string;
  hint: string;
  details: string;
  copyText: string;
  downloadJson: string;
  openDocs?: string;
  retry: string;
};

export function DraggableErrorPanel({
  error,
  labels,
  onClose,
  onCopy,
  onDownload,
  onRetry,
  onOpenDocs,
  docAnchor,
}: {
  error: TransferError | null;
  labels: ErrorPanelLabels;
  onClose: () => void;
  onCopy: () => void;
  onDownload: () => void;
  onRetry: () => void;
  onOpenDocs?: (docAnchor?: string) => void;
  docAnchor?: string;
}) {
  const saved = loadErrorPanelState();
  const [pos, setPos] = useState({ x: saved?.x ?? 120, y: saved?.y ?? 120 });
  const [size, setSize] = useState({ w: saved?.w ?? 460, h: saved?.h ?? 360 });
  const [collapsed, setCollapsed] = useState(saved?.collapsed ?? false);
  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, px: 0, py: 0 });
  const resizeStart = useRef({ x: 0, y: 0, w: ERR_MIN_W, h: ERR_MIN_H });

  useEffect(() => {
    saveErrorPanelState(pos.x, pos.y, size.w, size.h, collapsed);
  }, [pos, size, collapsed]);

  useEffect(() => {
    if (!dragging && !resizing) return;
    const handleMove = (e: MouseEvent) => {
      if (dragging) {
        const dx = e.clientX - dragStart.current.x;
        const dy = e.clientY - dragStart.current.y;
        setPos({
          x: Math.max(0, Math.min(window.innerWidth - 60, dragStart.current.px + dx)),
          y: Math.max(0, Math.min(window.innerHeight - 40, dragStart.current.py + dy)),
        });
      }
      if (resizing) {
        const dx = e.clientX - resizeStart.current.x;
        const dy = e.clientY - resizeStart.current.y;
        setSize({
          w: Math.max(ERR_MIN_W, resizeStart.current.w + dx),
          h: Math.max(ERR_MIN_H, resizeStart.current.h + dy),
        });
      }
    };
    const handleUp = () => {
      setDragging(false);
      setResizing(false);
    };
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };
  }, [dragging, resizing]);

  if (!error) return null;

  if (collapsed) {
    return (
      <button
        type="button"
        data-sfx-handled
        onClick={() => setCollapsed(false)}
        style={{
          position: 'fixed',
          right: 16,
          bottom: 16,
          zIndex: 9998,
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
        ERR
      </button>
    );
  }

  return (
    <div
      className="tool-card"
      style={{
        position: 'fixed',
        left: pos.x,
        top: pos.y,
        width: size.w,
        height: size.h,
        zIndex: 200,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
        border: '1px solid rgba(244,90,90,0.4)',
        overflow: 'hidden',
      }}
    >
      <div
        className="tool-card-header"
        onMouseDown={(e) => {
          if ((e.target as HTMLElement).closest('.error-panel-resize')) return;
          setDragging(true);
          dragStart.current = { x: e.clientX, y: e.clientY, px: pos.x, py: pos.y };
          e.preventDefault();
        }}
        style={{ cursor: dragging ? 'grabbing' : 'grab', userSelect: 'none', flexShrink: 0 }}
      >
        <div>
          <span className="card-caption" style={{ color: '#f45a5a' }}>{labels.title}</span>
          <h3 style={{ color: '#f45a5a' }}>{error.code}</h3>
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <button
            className="secondary-button small-button"
            type="button"
            data-sfx-handled
            aria-label="Collapse error panel"
            onClick={() => setCollapsed(true)}
            title="Collapse"
          >
            −
          </button>
          <button className="secondary-button small-button" type="button" data-sfx-handled aria-label="Close error panel" onClick={onClose}>
            ✕
          </button>
        </div>
      </div>
      <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 10, flex: 1, overflow: 'auto' }}>
        <div>
          <strong style={{ color: '#8aa4c0', fontSize: 12 }}>{labels.stage}</strong>
          <p style={{ margin: '4px 0 0' }}>{error.stage}</p>
        </div>
        <div>
          <strong style={{ color: '#8aa4c0', fontSize: 12 }}>{labels.message}</strong>
          <p style={{ margin: '4px 0 0' }}>{error.message}</p>
        </div>
        <div>
          <strong style={{ color: '#8aa4c0', fontSize: 12 }}>{labels.hint}</strong>
          <p style={{ margin: '4px 0 0', color: '#f59e0b' }}>{error.hint}</p>
        </div>
        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
          <strong style={{ color: '#8aa4c0', fontSize: 12 }}>{labels.details}</strong>
          <pre className="code-block" style={{ flex: 1, overflow: 'auto', marginTop: 4, fontSize: 12 }}>
            {safeJsonStringify(error.details, 2)}
          </pre>
        </div>
        <div className="mini-action-row" style={{ marginTop: 4, flexShrink: 0 }}>
          <button className="secondary-button small-button" type="button" data-sfx-handled onClick={onCopy}>{labels.copyText}</button>
          <button className="secondary-button small-button" type="button" data-sfx-handled onClick={onDownload}>{labels.downloadJson}</button>
          {onOpenDocs && labels.openDocs && (
            <button
              className="secondary-button small-button"
              type="button"
              data-sfx-handled
              onClick={() => onOpenDocs(docAnchor)}
              style={{ color: 'var(--accent-solid)' }}
            >
              {labels.openDocs}
            </button>
          )}
          <button className="primary-button small-button" type="button" data-sfx-handled onClick={onRetry}>{labels.retry}</button>
        </div>
      </div>
      {/* Resize handle */}
      <div
        className="error-panel-resize"
        onMouseDown={(e) => {
          setResizing(true);
          resizeStart.current = { x: e.clientX, y: e.clientY, w: size.w, h: size.h };
          e.preventDefault();
          e.stopPropagation();
        }}
        style={{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: 18,
          height: 18,
          cursor: 'nwse-resize',
          background: 'linear-gradient(135deg, transparent 55%, #f45a5a 55%)',
          borderBottomRightRadius: 7,
          opacity: 0.7,
        }}
      />
    </div>
  );
}
