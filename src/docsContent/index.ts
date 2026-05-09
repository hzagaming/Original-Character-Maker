import type { DocsContent } from './types';
import { enhanceDocsContent } from './richErrorManual';

// Fully translated languages
import { docsContent as docsContentZh } from './zh';
import { docsContent as docsContentEn } from './en';
import { docsContent as docsContentJa } from './ja';
import { docsContent as docsContentRu } from './ru';
import { docsContent as docsContentKo } from './ko';

// Skeleton translations (intro + titles translated; detailed content in English as placeholder)
import { docsContent as docsContentFr } from './fr';
import { docsContent as docsContentDe } from './de';
import { docsContent as docsContentEs } from './es';
import { docsContent as docsContentIt } from './it';
import { docsContent as docsContentPt } from './pt';
import { docsContent as docsContentCs } from './cs';
import { docsContent as docsContentDa } from './da';
import { docsContent as docsContentNl } from './nl';
import { docsContent as docsContentEl } from './el';
import { docsContent as docsContentHi } from './hi';
import { docsContent as docsContentHu } from './hu';
import { docsContent as docsContentId } from './id';
import { docsContent as docsContentNo } from './no';
import { docsContent as docsContentPl } from './pl';
import { docsContent as docsContentRo } from './ro';
import { docsContent as docsContentSk } from './sk';
import { docsContent as docsContentSv } from './sv';
import { docsContent as docsContentTh } from './th';
import { docsContent as docsContentTr } from './tr';
import { docsContent as docsContentUk } from './uk';
import { docsContent as docsContentVi } from './vi';
import { docsContent as docsContentMs } from './ms';
import { docsContent as docsContentFi } from './fi';
import { docsContent as docsContentBg } from './bg';
import { docsContent as docsContentLt } from './lt';

const contentMap: Record<string, DocsContent> = {
  zh: docsContentZh,
  en: docsContentEn,
  ja: docsContentJa,
  ru: docsContentRu,
  ko: docsContentKo,
  fr: docsContentFr,
  de: docsContentDe,
  es: docsContentEs,
  it: docsContentIt,
  pt: docsContentPt,
  cs: docsContentCs,
  da: docsContentDa,
  nl: docsContentNl,
  el: docsContentEl,
  hi: docsContentHi,
  hu: docsContentHu,
  id: docsContentId,
  no: docsContentNo,
  pl: docsContentPl,
  ro: docsContentRo,
  sk: docsContentSk,
  sv: docsContentSv,
  th: docsContentTh,
  tr: docsContentTr,
  uk: docsContentUk,
  vi: docsContentVi,
  ms: docsContentMs,
  fi: docsContentFi,
  bg: docsContentBg,
  lt: docsContentLt,
  // Additional locale aliases
  'zh-CN': docsContentZh,
  'zh-TW': docsContentZh,
  'ja-JP': docsContentJa,
  'ko-KR': docsContentKo,
  'en-US': docsContentEn,
  'en-GB': docsContentEn,
  'fr-FR': docsContentFr,
  'de-DE': docsContentDe,
  'es-ES': docsContentEs,
  'it-IT': docsContentIt,
  'pt-PT': docsContentPt,
  'pt-BR': docsContentPt,
  'ru-RU': docsContentRu,
};

export type { DocsContent, DocsErrorSeverity, DocsErrorItem, DocsErrorCategory, DocsErrorDetailBlock, DocsButtonItem, DocsParamItem, DocsToolSection } from './types';

export function getDocsContent(language: string): DocsContent {
  return enhanceDocsContent(contentMap[language] ?? contentMap['zh'], language);
}
