import type { SettingsState } from './types';

export type WorkflowApiBaseIssue = 'direct-model-endpoint' | '';

const PROBE_PORTS = [3000, 3001, 5173, 4173, 8080, 8000, 5000, 5001, 9000, 9001];
const PROBE_TIMEOUT_MS = 2500;
let _probedBase = '';
let _probeDone = false;
let _sameOriginAvailable = false;
let _probePromise: Promise<string> | null = null;

export function resetApiProbe(): void {
  _probedBase = '';
  _probeDone = false;
  _sameOriginAvailable = false;
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

async function probeSameOrigin(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), PROBE_TIMEOUT_MS);
    const response = await fetch('/api/health', {
      method: 'GET',
      signal: controller.signal,
    });
    clearTimeout(timer);
    // Vite dev server 会对未知路由做 SPA fallback，返回 200 + text/html。
    // 真正的后端 /api/health 返回的是 application/json。
    const contentType = response.headers.get('content-type') || '';
    return response.ok && contentType.includes('application/json');
  } catch {
    // ignore
  }
  return false;
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
    // 过滤掉 Vite SPA fallback 返回的 HTML（200 OK 但不是 JSON）
    const contentType = response.headers.get('content-type') || '';
    if (response.ok && contentType.includes('application/json')) {
      return `http://localhost:${port}`;
    }
  } catch {
    // ignore
  }
  return null;
}

async function doProbe(): Promise<string> {
  if (_probeDone) {
    return _probedBase;
  }

  // 1. 同域探测优先（适用于 Zeabur / Render / Railway / Vite proxy 等同域部署）
  const sameOriginOk = await probeSameOrigin();
  if (sameOriginOk) {
    _probedBase = '';
    _sameOriginAvailable = true;
    _probeDone = true;
    return _probedBase;
  }

  const location = getLocation();
  const hostname = location?.hostname || '';

  // 2. URL query param 优先
  const queryPort = readQueryApiBase('apiPort');
  if (queryPort && /^\d+$/.test(queryPort)) {
    _probedBase = `http://localhost:${queryPort}`;
    _probeDone = true;
    return _probedBase;
  }
  const queryBase = readQueryApiBase('apiBase');
  if (queryBase) {
    _probedBase = queryBase.replace(/\/+$/, '');
    _probeDone = true;
    return _probedBase;
  }

  if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
    // 非 localhost 且同域探测失败：没有可用的内置 API
    _probeDone = true;
    return '';
  }

  // 3. 并发探测常用端口（包括当前端口）
  // 注意：不再直接假设前端端口 = 后端端口，而是实际探测每个端口
  const probes = PROBE_PORTS.map(async (port) => {
    const base = await probePort(port);
    return base ? { port, base } : null;
  });
  const results = await Promise.all(probes);
  const hit = results.find((r): r is { port: number; base: string } => r !== null);

  if (hit) {
    _probedBase = hit.base;
    _probeDone = true;
    return _probedBase;
  }

  // 5. fallback 3001
  _probedBase = 'http://localhost:3001';
  _probeDone = true;
  return _probedBase;
}

export async function ensureLocalApiProbed(): Promise<string> {
  if (_probeDone) {
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

  // 同域探测已完成且成功（Zeabur / Render / Railway 等同域部署）
  if (_probeDone && _sameOriginAvailable) {
    return origin;
  }

  // 非 localhost 环境：始终使用当前 origin
  if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
    return origin;
  }

  // 探测已完成：使用实际探测到的后端地址（无论后端跑在哪个端口）
  if (_probeDone) {
    return _probedBase;
  }

  // 尚未探测过：Vite dev 端口直接假设后端在 3001（避免同步调用时返回错误的前端地址）
  if (port === '5173' || port === '4173') {
    return 'http://localhost:3001';
  }

  // 其他已知端口，假设同端口可能有后端
  if (PROBE_PORTS.includes(Number(port))) {
    return origin;
  }

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
  const location = getLocation();

  // 同域部署优先：如果已经探测到同域可用，使用当前 origin
  // 但本地开发时前端在 Vite 端口（5173/4173），绝不把前端 dev server 当后端用
  if (_probeDone && _sameOriginAvailable) {
    const origin = location?.origin || '';
    if (origin.includes('://localhost:5173') || origin.includes('://localhost:4173') ||
        origin.includes('://127.0.0.1:5173') || origin.includes('://127.0.0.1:4173')) {
      return 'http://localhost:3001';
    }
    return origin;
  }

  if (settings.interfaceMode === 'custom') {
    const url = channel === 1 ? settings.apiBaseUrl : channel === 2 ? settings.apiBaseUrl2 : settings.apiBaseUrl3;
    const trimmed = (url || '').trim().replace(/\/+$/, '');

    // 如果在非 localhost 环境下配置了 localhost URL，忽略它（避免连接失败）
    if (trimmed && typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
        try {
          const parsed = new URL(trimmed);
          if (parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1') {
            return getLocation()?.origin || '';
          }
        } catch {
          // invalid URL, ignore
        }
      }
    }

    return trimmed;
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
  if (typeof pathname !== 'string' || !pathname) {
    return '';
  }

  if (/^https?:\/\//.test(pathname)) {
    return pathname;
  }

  // 同域部署：使用完整 origin + pathname（避免某些部署环境下相对路径失效）
  // 本地开发时前端在 Vite 端口（5173/4173），绝不把请求发给前端 dev server
  if (_probeDone && _sameOriginAvailable) {
    const origin = getLocation()?.origin || '';
    const safePath = pathname.startsWith('/') ? pathname : `/${pathname}`;
    if (origin.includes('://localhost:5173') || origin.includes('://localhost:4173') ||
        origin.includes('://127.0.0.1:5173') || origin.includes('://127.0.0.1:4173')) {
      return `http://localhost:3001${safePath}`;
    }
    return origin ? `${origin}${safePath}` : safePath;
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
  feature: 'style-transfer' | 'paper2gal' | 'llm',
  settings: Pick<SettingsState, 'interfaceMode' | 'apiPreset' | 'apiBaseUrl' | 'apiBaseUrl2' | 'apiBaseUrl3' | 'apiKey' | 'apiKey2' | 'apiKey3' | 'apiCustom1ForStyleTransfer' | 'apiCustom1ForPaper2Gal' | 'apiCustom2ForStyleTransfer' | 'apiCustom2ForPaper2Gal' | 'apiCustom3ForStyleTransfer' | 'apiCustom3ForPaper2Gal'>,
): { baseUrl: string; apiKey: string; channel: 1 | 2 | 3 } | null {
  if (settings.interfaceMode === 'builtin') {
    const presetBase = getPresetApiBase(settings);
    return presetBase ? { baseUrl: presetBase, apiKey: '', channel: 1 } : null;
  }

  const featureKey = feature === 'style-transfer' ? 'ForStyleTransfer' : feature === 'paper2gal' ? 'ForPaper2Gal' : 'ForStyleTransfer';
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
