import { useState, useEffect, useCallback } from 'react';
import { playFeedback } from '../audioEngine';

export function usePageToast() {
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(null), 2800);
    return () => window.clearTimeout(id);
  }, [toast]);
  const showToast = useCallback((message: string, type: 'success' | 'error' = 'error', silent = false) => {
    setToast({ message, type });
    if (!silent) playFeedback(type);
  }, []);
  return { toast, showToast };
}

export function PageToast({ toast }: { toast: { message: string; type: 'success' | 'error' } | null }) {
  if (!toast) return null;
  return (
    <div className={`editor-toast ${toast.type}`} role="alert" aria-live="polite">
      {toast.message}
    </div>
  );
}
