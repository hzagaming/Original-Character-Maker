export type DocsErrorSeverity = 'critical' | 'error' | 'warning' | 'info';

export type DocsErrorItem = {
  code: string;
  message: string;
  severity: DocsErrorSeverity;
  category: string;
  location: string;
  cause: string;
  solution: string;
  steps?: string[];
  relatedCodes?: string[];
  prevention?: string;
  detailBlocks?: DocsErrorDetailBlock[];
};

export type DocsErrorDetailBlock = {
  title: string;
  items: string[];
};

export type DocsErrorCategory = {
  id: string;
  name: string;
  description: string;
  errors: DocsErrorItem[];
};

export type DocsButtonItem = {
  name: string;
  description: string;
};

export type DocsParamItem = {
  name: string;
  description: string;
  tips?: string | null;
};

export type DocsToolSection = {
  id: string;
  title: string;
  overview: string;
  buttons: DocsButtonItem[];
  parameters: DocsParamItem[];
  errors: DocsErrorItem[];
};

export type DocsContent = {
  intro: string;
  tools: DocsToolSection[];
  errorDictionary: DocsErrorCategory[];
};
