import type { SettingsState } from './types';

export type WorkflowApiBaseIssue = 'direct-model-endpoint' | '';

function getLocation() {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.location;
}

export function readQueryApiBase(key: string): string {
  const location = getLocation();
  if (!location) {
    return '';
  }

  const params = new URLSearchParams(location.search);
  return (params.get(key) || '').trim();
}

export function defaultLocalApiBase(): string {
  const location = getLocation();
  if (!location) {
    return '';
  }

  const { hostname, origin, port } = location;
  if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
    return '';
  }

  if (port === '3002' || port === '3001') {
    return origin;
  }

  // Prefer the workflow backend dev port.
  return 'http://localhost:3002';
}

export function getPresetApiBase(settings: Pick<SettingsState, 'apiPreset'>): string {
  if (settings.apiPreset === 'plato') {
    const queryPresetBase = readQueryApiBase('platoApi') || readQueryApiBase('api');
    if (queryPresetBase) {
      return queryPresetBase.replace(/\/+$/, '');
    }

    return defaultLocalApiBase().replace(/\/+$/, '');
  }

  return '';
}

export function getEffectiveApiBase(settings: Pick<SettingsState, 'interfaceMode' | 'apiBaseUrl' | 'apiPreset'>): string {
  if (settings.interfaceMode === 'builtin') {
    return getPresetApiBase(settings);
  }

  return (settings.apiBaseUrl || '').trim().replace(/\/+$/, '');
}

export function detectWorkflowApiBaseIssue(apiBase: string): WorkflowApiBaseIssue {
  const trimmed = (apiBase || '').trim();
  if (!trimmed) {
    return '';
  }

  const lower = trimmed.toLowerCase();

  const directEndpointPatterns = [
    /\/v\d+\/chat\/completions(?:[/?#]|$)/,
    /\/chat\/completions(?:[/?#]|$)/,
    /\/v\d+\/responses(?:[/?#]|$)/,
    /\/responses(?:[/?#]|$)/,
    /\/v\d+\/audio\/speech(?:[/?#]|$)/,
    /\/audio\/speech(?:[/?#]|$)/,
    /\/v\d+\/embeddings(?:[/?#]|$)/,
    /\/embeddings(?:[/?#]|$)/,
    /\/v\d+\/images(?:[/?#]|$)/,
    /\/images(?:[/?#]|$)/,
  ];

  if (directEndpointPatterns.some((pattern) => pattern.test(lower))) {
    return 'direct-model-endpoint';
  }

  return '';
}

export function isHostedStaticEnvironment(): boolean {
  const location = getLocation();
  if (!location) {
    return false;
  }

  return location.protocol === 'https:' && location.hostname.endsWith('github.io');
}

export function requiresHostedApiBase(settings: Pick<SettingsState, 'interfaceMode' | 'apiBaseUrl' | 'apiPreset'>): boolean {
  return isHostedStaticEnvironment() && !getEffectiveApiBase(settings);
}

export function buildApiUrl(settings: Pick<SettingsState, 'interfaceMode' | 'apiBaseUrl' | 'apiPreset'>, pathname: string): string {
  if (!pathname) {
    return '';
  }

  if (/^https?:\/\//.test(pathname)) {
    return pathname;
  }

  const base = getEffectiveApiBase(settings);
  if (!base) {
    return pathname;
  }

  return `${base}${pathname}`;
}

export function buildApiHeaders(
  settings: Pick<SettingsState, 'interfaceMode' | 'apiKey'>,
  headers: HeadersInit = {},
): HeadersInit {
  if (settings.interfaceMode !== 'custom' || !settings.apiKey.trim()) {
    return headers;
  }

  return {
    ...headers,
    Authorization: `Bearer ${settings.apiKey.trim()}`,
    'X-API-Key': settings.apiKey.trim(),
  };
}
