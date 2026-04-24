import type { SettingsState } from './types';

export type WorkflowApiBaseIssue = 'direct-model-endpoint' | '';

const PROBE_PORTS = [3000, 3001, 8080, 8000, 5000, 5001, 9000, 9001];
const PROBE_TIMEOUT_MS = 2500;
let _probedBase = '';
let _probePromise: Promise<string> | null = null;

export function resetApiProbe(): void {
  _probedBase = '';
  _probePromise = null;
}

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

async function probePort(port: number): Promise<string | null> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), PROBE_TIMEOUT_MS);
    const response = await fetch(`http://localhost:${port}/api/health`, {
      method: 'GET',
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (response.ok) {
      return `http://localhost:${port}`;
    }
  } catch {
    // ignore
  }
  return null;
}

async function doProbe(): Promise<string> {
  if (_probedBase) {
    return _probedBase;
  }

  const location = getLocation();
  const hostname = location?.hostname || '';
  if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
    return '';
  }

  // 1. URL query param 优先
  const queryPort = readQueryApiBase('apiPort');
  if (queryPort && /^\d+$/.test(queryPort)) {
    _probedBase = `http://localhost:${queryPort}`;
    return _probedBase;
  }
  const queryBase = readQueryApiBase('apiBase');
  if (queryBase) {
    _probedBase = queryBase.replace(/\/+$/, '');
    return _probedBase;
  }

  // 2. 如果前端本身就跑在常用后端端口上
  const currentPort = location?.port || '';
  if (PROBE_PORTS.includes(Number(currentPort))) {
    _probedBase = location!.origin;
    return _probedBase;
  }

  // 3. 并发探测常用端口
  const probes = PROBE_PORTS.map(async (port) => {
    const base = await probePort(port);
    return base ? { port, base } : null;
  });
  const results = await Promise.all(probes);
  const hit = results.find((r): r is { port: number; base: string } => r !== null);

  if (hit) {
    _probedBase = hit.base;
    return _probedBase;
  }

  // 4. fallback 3001
  _probedBase = 'http://localhost:3001';
  return _probedBase;
}

export async function ensureLocalApiProbed(): Promise<string> {
  if (_probedBase) {
    return _probedBase;
  }
  if (!_probePromise) {
    _probePromise = doProbe();
  }
  return _probePromise;
}

export function defaultLocalApiBase(): string {
  const location = getLocation();
  if (!location) {
    return '';
  }

  const { hostname, origin, port, protocol } = location;
  if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
    return '';
  }

  // 如果已经探测过，直接返回
  if (_probedBase) {
    return _probedBase;
  }

  // 如果前端本身就跑在常用后端端口上
  if (PROBE_PORTS.includes(Number(port))) {
    return origin;
  }

  // Prefer the workflow backend dev port.
  return `${protocol}//${hostname}:3001`;
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

export function getEffectiveApiBase(
  settings: Pick<SettingsState, 'interfaceMode' | 'apiBaseUrl' | 'apiPreset' | 'apiBaseUrl2' | 'apiBaseUrl3'>,
  channel: 1 | 2 | 3 = 1,
): string {
  if (settings.interfaceMode === 'custom') {
    const url = channel === 1 ? settings.apiBaseUrl : channel === 2 ? settings.apiBaseUrl2 : settings.apiBaseUrl3;
    return (url || '').trim().replace(/\/+$/, '');
  }

  return getPresetApiBase(settings);
}

export function detectWorkflowApiBaseIssue(apiBase: string): WorkflowApiBaseIssue {
  const trimmed = (apiBase || '').trim();
  if (!trimmed) {
    return '';
  }

  const lower = trimmed.toLowerCase();

  const directEndpointPatterns = [
    /\/v\d+\/chat\/completions(?:[\/?#]|$)/,
    /\/chat\/completions(?:[\/?#]|$)/,
    /\/v\d+\/responses(?:[\/?#]|$)/,
    /\/responses(?:[\/?#]|$)/,
    /\/v\d+\/audio\/speech(?:[\/?#]|$)/,
    /\/audio\/speech(?:[\/?#]|$)/,
    /\/v\d+\/embeddings(?:[\/?#]|$)/,
    /\/embeddings(?:[\/?#]|$)/,
    /\/v\d+\/images(?:[\/?#]|$)/,
    /\/images(?:[\/?#]|$)/,
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

  const hostname = location.hostname;
  const isGithubPages = location.protocol === 'https:' && hostname.endsWith('github.io');
  const isAliyunOSS = hostname.includes('aliyuncs.com') || hostname.includes('oss-');
  const isAliyunCDN = hostname.includes('alicdn.com');

  return isGithubPages || isAliyunOSS || isAliyunCDN;
}

export function requiresHostedApiBase(settings: Pick<SettingsState, 'interfaceMode' | 'apiBaseUrl' | 'apiPreset' | 'apiBaseUrl2' | 'apiBaseUrl3'>): boolean {
  return isHostedStaticEnvironment() && !getEffectiveApiBase(settings);
}

export function buildApiUrl(
  settings: Pick<SettingsState, 'interfaceMode' | 'apiBaseUrl' | 'apiPreset' | 'apiBaseUrl2' | 'apiBaseUrl3'>,
  pathname: string,
  channel: 1 | 2 | 3 = 1,
): string {
  if (!pathname) {
    return '';
  }

  if (/^https?:\/\//.test(pathname)) {
    return pathname;
  }

  const base = getEffectiveApiBase(settings, channel);
  if (!base) {
    return pathname;
  }

  const safePath = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return `${base}${safePath}`;
}

export function buildApiHeaders(
  settings: Pick<SettingsState, 'interfaceMode' | 'apiKey' | 'apiKey2' | 'apiKey3'>,
  headers: HeadersInit = {},
  channel: 1 | 2 | 3 = 1,
): HeadersInit {
  if (settings.interfaceMode !== 'custom') {
    return headers;
  }

  const key = channel === 1 ? settings.apiKey : channel === 2 ? settings.apiKey2 : settings.apiKey3;
  if (!key || !key.trim()) {
    return headers;
  }

  return {
    ...headers,
    Authorization: `Bearer ${key.trim()}`,
    'X-API-Key': key.trim(),
  };
}

export function getApiForFeature(
  feature: 'style-transfer' | 'paper2gal',
  settings: Pick<SettingsState, 'interfaceMode' | 'apiPreset' | 'apiBaseUrl' | 'apiBaseUrl2' | 'apiBaseUrl3' | 'apiKey' | 'apiKey2' | 'apiKey3' | 'apiCustom1ForStyleTransfer' | 'apiCustom1ForPaper2Gal' | 'apiCustom2ForStyleTransfer' | 'apiCustom2ForPaper2Gal' | 'apiCustom3ForStyleTransfer' | 'apiCustom3ForPaper2Gal'>,
): { baseUrl: string; apiKey: string; channel: 1 | 2 | 3 } | null {
  if (settings.interfaceMode === 'builtin') {
    const presetBase = getPresetApiBase(settings);
    return presetBase ? { baseUrl: presetBase, apiKey: '', channel: 1 } : null;
  }

  const featureKey = feature === 'style-transfer' ? 'ForStyleTransfer' : 'ForPaper2Gal';
  const matches: { channel: 1 | 2 | 3; baseUrl: string; apiKey: string; condition: boolean }[] = [
    {
      channel: 1,
      baseUrl: settings.apiBaseUrl,
      apiKey: settings.apiKey,
      condition: settings[`apiCustom1${featureKey}` as keyof typeof settings] as boolean,
    },
    {
      channel: 2,
      baseUrl: settings.apiBaseUrl2,
      apiKey: settings.apiKey2,
      condition: settings[`apiCustom2${featureKey}` as keyof typeof settings] as boolean,
    },
    {
      channel: 3,
      baseUrl: settings.apiBaseUrl3,
      apiKey: settings.apiKey3,
      condition: settings[`apiCustom3${featureKey}` as keyof typeof settings] as boolean,
    },
  ];

  const hit = matches.find((m) => m.condition && m.baseUrl.trim());
  if (hit) {
    return { baseUrl: hit.baseUrl.trim().replace(/\/+$/, ''), apiKey: hit.apiKey, channel: hit.channel };
  }

  // Fallback: use first configured custom API
  const fallback = matches.find((m) => m.baseUrl.trim());
  if (fallback) {
    return { baseUrl: fallback.baseUrl.trim().replace(/\/+$/, ''), apiKey: fallback.apiKey, channel: fallback.channel };
  }

  return null;
}
