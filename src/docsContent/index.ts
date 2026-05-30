import type { DocsContent } from './types';
import { enhanceDocsContent } from './richErrorManual';
import { getExtraTools } from './extraTools';

type DocsContentModule = { docsContent: DocsContent };
type DocsContentLoader = () => Promise<DocsContentModule>;

const contentLoaders: Record<string, DocsContentLoader> = {
  zh: () => import('./zh'),
  en: () => import('./en'),
  ja: () => import('./ja'),
  ru: () => import('./ru'),
  ko: () => import('./ko'),
  fr: () => import('./fr'),
  de: () => import('./de'),
  es: () => import('./es'),
  it: () => import('./it'),
  pt: () => import('./pt'),
  cs: () => import('./cs'),
  da: () => import('./da'),
  nl: () => import('./nl'),
  el: () => import('./el'),
  hi: () => import('./hi'),
  hu: () => import('./hu'),
  id: () => import('./id'),
  no: () => import('./no'),
  pl: () => import('./pl'),
  ro: () => import('./ro'),
  sk: () => import('./sk'),
  sv: () => import('./sv'),
  th: () => import('./th'),
  tr: () => import('./tr'),
  uk: () => import('./uk'),
  vi: () => import('./vi'),
  ms: () => import('./ms'),
  fi: () => import('./fi'),
  bg: () => import('./bg'),
  lt: () => import('./lt'),
  'zh-CN': () => import('./zh'),
  'zh-TW': () => import('./zh'),
  'ja-JP': () => import('./ja'),
  'ko-KR': () => import('./ko'),
  'en-US': () => import('./en'),
  'en-GB': () => import('./en'),
  'fr-FR': () => import('./fr'),
  'de-DE': () => import('./de'),
  'es-ES': () => import('./es'),
  'it-IT': () => import('./it'),
  'pt-PT': () => import('./pt'),
  'pt-BR': () => import('./pt'),
  'ru-RU': () => import('./ru'),
};

export type { DocsContent, DocsErrorSeverity, DocsErrorItem, DocsErrorCategory, DocsErrorDetailBlock, DocsButtonItem, DocsParamItem, DocsToolSection } from './types';

export async function loadDocsContent(language: string): Promise<DocsContent> {
  const loader = contentLoaders[language] ?? contentLoaders.zh;
  const { docsContent } = await loader();
  const base = enhanceDocsContent(docsContent, language);
  const extra = getExtraTools(language);
  return {
    ...base,
    tools: [...base.tools, ...extra],
  };
}
