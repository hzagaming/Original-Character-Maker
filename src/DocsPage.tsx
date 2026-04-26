import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { playSound } from './audioEngine';
import { docsContentZh } from './docsContent';
import type { AppLanguage, SettingsState } from './types';

type DocsLabels = {
  docsNavIntro: string;
  docsNavTools: string;
  docsNavSections: string;
  docsNavDictionary: string;
  docsNavIndex: string;
  docsTableOfContents: string;
  docsWelcomeTitle: string;
  docsButtonName: string;
  docsButtonDescription: string;
  docsParamTip: string;
  docsErrorSeverity: string;
  docsErrorCategory: string;
  docsErrorLocation: string;
  docsErrorCause: string;
  docsErrorSolution: string;
  docsErrorSteps: string;
  docsErrorRelated: string;
  docsErrorPrevention: string;
  docsFilterAll: string;
  docsFilterCritical: string;
  docsFilterError: string;
  docsFilterWarning: string;
  docsFilterInfo: string;
  docsErrorCount: string;
  docsSectionOverview: string;
  docsSectionButtons: string;
  docsSectionParameters: string;
  docsSectionErrors: string;
};

type DocsPageProps = {
  appSubtitle: string;
  backHome: string;
  openSettings: string;
  pageTitle: string;
  pageDescription: string;
  settings: SettingsState;
  language: AppLanguage;
  messages: DocsLabels;
  onBack: () => void;
  onOpenSettings: () => void;
  onNavigate?: (screen: 'image-converter' | 'docs') => void;
};

const SECTION_IDS = ['overview', 'buttons', 'parameters', 'errors'] as const;
type SectionId = (typeof SECTION_IDS)[number];

const severityClassMap: Record<string, string> = {
  critical: 'severity-critical',
  error: 'severity-error',
  warning: 'severity-warning',
  info: 'severity-info',
};

const severityLabelMap: Record<string, string> = {
  critical: '严重',
  error: '错误',
  warning: '警告',
  info: '提示',
};

export default function DocsPage({
  appSubtitle,
  backHome,
  openSettings,
  pageTitle,
  pageDescription,
  language,
  messages,
  onBack,
  onOpenSettings,
}: DocsPageProps) {
  const sectionLabels: Record<SectionId, string> = {
    overview: messages.docsSectionOverview,
    buttons: messages.docsSectionButtons,
    parameters: messages.docsSectionParameters,
    errors: messages.docsSectionErrors,
  };

  const content = docsContentZh;
  const [activeToolId, setActiveToolId] = useState<string>(content.tools[0].id);
  const [activeSection, setActiveSection] = useState<SectionId | null>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const contentRef = useRef<HTMLDivElement>(null);

  const allSearchableErrors = useMemo(() => {
    const toolErrors = content.tools.flatMap((tool) =>
      tool.errors.map((err) => ({ ...err, toolTitle: tool.title })),
    );
    const dictErrors = content.errorDictionary.flatMap((cat) =>
      cat.errors.map((err) => ({ ...err, toolTitle: cat.name })),
    );
    return [...toolErrors, ...dictErrors];
  }, [content]);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return allSearchableErrors.filter((err) =>
      err.code.toLowerCase().includes(q) ||
      err.message.toLowerCase().includes(q) ||
      err.cause.toLowerCase().includes(q) ||
      err.solution.toLowerCase().includes(q) ||
      err.location.toLowerCase().includes(q) ||
      err.category.toLowerCase().includes(q) ||
      (err.prevention?.toLowerCase().includes(q) ?? false) ||
      (err.steps?.some((s) => s.toLowerCase().includes(q)) ?? false),
    );
  }, [allSearchableErrors, searchQuery]);

  const activeTool = content.tools.find((t) => t.id === activeToolId) ?? content.tools[0];

  const isDictionaryView = activeToolId === 'dictionary';

  const scrollToSection = useCallback((section: SectionId) => {
    setActiveSection(section);
    const el = document.getElementById(`docs-section-${section}`);
    if (el && contentRef.current) {
      const top = el.offsetTop - contentRef.current.offsetTop - 16;
      contentRef.current.scrollTo({ top, behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    playSound('pageSwitch');
  }, []);

  useEffect(() => {
    const container = contentRef.current;
    if (!container) return;

    const onScroll = () => {
      const offsets = SECTION_IDS.map((id) => {
        const el = document.getElementById(`docs-section-${id}`);
        return { id, top: el ? el.offsetTop - container.offsetTop - container.scrollTop : Infinity };
      });
      const closest = offsets.reduce((a, b) => (Math.abs(a.top) < Math.abs(b.top) ? a : b));
      if (closest.id !== activeSection && closest.top < 200) {
        setActiveSection(closest.id as SectionId);
      }
    };

    container.addEventListener('scroll', onScroll, { passive: true });
    return () => container.removeEventListener('scroll', onScroll);
  }, [activeSection, activeToolId]);

  const allErrors = useMemo(() => {
    return content.errorDictionary.flatMap((cat) => cat.errors);
  }, [content]);

  const isIndexView = activeToolId === 'error-index';

  return (
    <main className="feature-shell tool-page-shell">
      <header className="feature-header fade-up delay-1">
        <button className="secondary-button small-button" type="button" onClick={onBack}>
          {backHome}
        </button>
        <div className="feature-header-meta">
          <button className="secondary-button small-button" type="button" onClick={onOpenSettings}>
            {openSettings}
          </button>
        </div>
      </header>

      <section className="tool-workbench fade-up delay-2">
        <div className="tool-header">
          <div>
            <p className="section-label">{appSubtitle}</p>
            <h2>{pageTitle}</h2>
            <p>{pageDescription}</p>
          </div>
        </div>

        <div className="docs-layout">
          {/* Sidebar */}
          <aside className="docs-sidebar">
            <div className="docs-sidebar-inner">
              <p className="card-caption" style={{ marginBottom: 12 }}>{messages.docsTableOfContents}</p>

              <div className="docs-nav-group">
                <button
                  className={`docs-nav-item ${activeToolId === 'intro' ? 'active' : ''}`}
                  type="button"
                  onClick={() => { setActiveToolId('intro'); setActiveSection(null); if (contentRef.current) contentRef.current.scrollTo({ top: 0, behavior: 'instant' }); }}
                >
                  {messages.docsNavIntro}
                </button>
              </div>

              <div className="docs-nav-group">
                <p className="docs-nav-group-title">{messages.docsNavIndex}</p>
                <button
                  className={`docs-nav-item ${isIndexView ? 'active' : ''}`}
                  type="button"
                  onClick={() => {
                    setActiveToolId('error-index');
                    setActiveSection(null);
                    if (contentRef.current) contentRef.current.scrollTo({ top: 0, behavior: 'instant' });
                  }}
                >
                  {messages.docsFilterAll}
                </button>
              </div>

              <div className="docs-nav-group">
                <p className="docs-nav-group-title">{messages.docsNavDictionary}</p>
                {content.errorDictionary.map((cat) => (
                  <button
                    key={cat.id}
                    className={`docs-nav-item docs-nav-sub ${activeToolId === `dict-${cat.id}` ? 'active' : ''}`}
                    type="button"
                    onClick={() => {
                      setActiveToolId(`dict-${cat.id}`);
                      setActiveSection(null);
                      if (contentRef.current) contentRef.current.scrollTo({ top: 0, behavior: 'instant' });
                    }}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              <div className="docs-nav-group">
                <p className="docs-nav-group-title">{messages.docsNavTools}</p>
                {content.tools.map((tool) => (
                  <button
                    key={tool.id}
                    className={`docs-nav-item ${activeToolId === tool.id ? 'active' : ''}`}
                    type="button"
                    onClick={() => {
                      setActiveToolId(tool.id);
                      setActiveSection('overview');
                      if (contentRef.current) contentRef.current.scrollTo({ top: 0, behavior: 'instant' });
                    }}
                  >
                    {tool.title}
                  </button>
                ))}
              </div>

              {activeToolId !== 'intro' && !activeToolId.startsWith('dict-') && !isIndexView && (
                <div className="docs-nav-group">
                  <p className="docs-nav-group-title">{messages.docsNavSections}</p>
                  {SECTION_IDS.map((id) => (
                    <button
                      key={id}
                      className={`docs-nav-item docs-nav-sub ${activeSection === id ? 'active' : ''}`}
                      type="button"
                      onClick={() => scrollToSection(id)}
                    >
                      {sectionLabels[id]}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </aside>

          {/* Content */}
          <div className="docs-content" ref={contentRef}>
            <div className="docs-search-bar">
              <input
                className="docs-search-input"
                type="text"
                placeholder="搜索错误代码、描述、原因或解决方案..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button className="docs-search-clear" type="button" onClick={() => setSearchQuery('')}>
                  ✕
                </button>
              )}
            </div>
            {searchQuery.trim() && (
              <article className="docs-article">
                <h1>搜索结果</h1>
                <p className="docs-dictionary-desc">
                  找到 {searchResults.length} 条与「{searchQuery}」相关的结果
                </p>
                {searchResults.length === 0 ? (
                  <div className="docs-search-empty">没有找到匹配的结果，请尝试其他关键词。</div>
                ) : (
                  <div className="docs-errors-list">
                    {searchResults.map((err, i) => (
                      <ErrorCard key={i} error={err} messages={messages} />
                    ))}
                  </div>
                )}
              </article>
            )}
            {activeToolId === 'intro' ? (
              <article className="docs-article">
                <h1>{messages.docsWelcomeTitle}</h1>
                <div className="docs-body-text">
                  {content.intro.split('\n\n').map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
                <div className="docs-tool-cards">
                  {content.tools.map((tool) => (
                    <button
                      key={tool.id}
                      className="docs-tool-card"
                      type="button"
                      onClick={() => {
                        setActiveToolId(tool.id);
                        setActiveSection('overview');
                        if (contentRef.current) contentRef.current.scrollTo({ top: 0, behavior: 'instant' });
                      }}
                    >
                      <strong>{tool.title}</strong>
                      <p className="muted-copy">{tool.overview.slice(0, 80)}…</p>
                    </button>
                  ))}
                </div>
              </article>
            ) : activeToolId.startsWith('dict-') ? (
              <DictionaryView
                category={content.errorDictionary.find((c) => `dict-${c.id}` === activeToolId)!}
                messages={messages}
              />
            ) : isIndexView ? (
              <ErrorIndexView errors={allErrors} messages={messages} />
            ) : (
              <article className="docs-article">
                <h1>{activeTool.title}</h1>

                {/* Overview */}
                <section className="docs-section" id="docs-section-overview">
                  <h2 className="docs-section-title">{sectionLabels.overview}</h2>
                  <div className="docs-body-text">
                    {activeTool.overview.split('\n\n').map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>
                </section>

                {/* Buttons */}
                <section className="docs-section" id="docs-section-buttons">
                  <h2 className="docs-section-title">{sectionLabels.buttons}</h2>
                  <div className="docs-table-wrap">
                    <table className="docs-table">
                      <thead>
                        <tr>
                          <th>{messages.docsButtonName}</th>
                          <th>{messages.docsButtonDescription}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activeTool.buttons.map((btn, i) => (
                          <tr key={i}>
                            <td className="docs-table-name">{btn.name}</td>
                            <td>{btn.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>

                {/* Parameters */}
                <section className="docs-section" id="docs-section-parameters">
                  <h2 className="docs-section-title">{sectionLabels.parameters}</h2>
                  <div className="docs-params-list">
                    {activeTool.parameters.map((param, i) => (
                      <div key={i} className="docs-param-card">
                        <div className="docs-param-header">
                          <strong>{param.name}</strong>
                          {param.tips ? <span className="docs-param-tip-badge">{messages.docsParamTip}</span> : null}
                        </div>
                        <p className="docs-param-desc">{param.description}</p>
                        {param.tips ? <p className="docs-param-tip">💡 {param.tips}</p> : null}
                      </div>
                    ))}
                  </div>
                </section>

                {/* Errors */}
                <section className="docs-section" id="docs-section-errors">
                  <h2 className="docs-section-title">{sectionLabels.errors}</h2>
                  <div className="docs-errors-list">
                    {activeTool.errors.map((err, i) => (
                      <ErrorCard key={i} error={err} messages={messages} />
                    ))}
                  </div>
                </section>
              </article>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

function ErrorCard({ error, messages }: { error: import('./docsContent').DocsErrorItem; messages: DocsLabels }) {
  const severityClass = severityClassMap[error.severity] ?? 'severity-info';
  const severityLabel = severityLabelMap[error.severity] ?? error.severity;

  return (
    <div className={`docs-error-card ${severityClass}`}>
      <div className="docs-error-header">
        <span className="docs-error-code">{error.code}</span>
        <span className={`docs-error-severity ${severityClass}`}>{severityLabel}</span>
        <span className="docs-error-message">{error.message}</span>
      </div>
      <div className="docs-error-meta">
        <div className="docs-error-meta-row">
          <span className="docs-error-label">{messages.docsErrorCategory}</span>
          <span className="docs-error-category">{error.category}</span>
        </div>
        <div className="docs-error-meta-row">
          <span className="docs-error-label">{messages.docsErrorLocation}</span>
          <span className="docs-error-location">{error.location}</span>
        </div>
      </div>
      <div className="docs-error-body">
        <div className="docs-error-row">
          <span className="docs-error-label">{messages.docsErrorCause}</span>
          <span>{error.cause}</span>
        </div>
        <div className="docs-error-row">
          <span className="docs-error-label">{messages.docsErrorSolution}</span>
          <span>{error.solution}</span>
        </div>
        {error.steps && error.steps.length > 0 && (
          <div className="docs-error-steps">
            <span className="docs-error-label">{messages.docsErrorSteps}</span>
            <ol>
              {error.steps.map((step, j) => (
                <li key={j}>{step}</li>
              ))}
            </ol>
          </div>
        )}
        {error.prevention && (
          <div className="docs-error-prevention">
            <span className="docs-error-label">{messages.docsErrorPrevention}</span>
            <span>🛡️ {error.prevention}</span>
          </div>
        )}
        {error.relatedCodes && error.relatedCodes.length > 0 && (
          <div className="docs-error-related">
            <span className="docs-error-label">{messages.docsErrorRelated}</span>
            <div className="docs-error-related-list">
              {error.relatedCodes.map((code, j) => (
                <span key={j} className="docs-error-related-code">{code}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function DictionaryView({ category, messages }: { category: import('./docsContent').DocsErrorCategory; messages: DocsLabels }) {
  return (
    <article className="docs-article">
      <h1>{category.name}</h1>
      <p className="docs-dictionary-desc">{category.description}</p>
      <div className="docs-errors-list">
        {category.errors.map((err, i) => (
          <ErrorCard key={i} error={err} messages={messages} />
        ))}
      </div>
    </article>
  );
}

function ErrorIndexView({ errors, messages }: { errors: import('./docsContent').DocsErrorItem[]; messages: DocsLabels }) {
  const [filter, setFilter] = useState<string>('all');

  const filters = [
    { key: 'all', label: messages.docsFilterAll },
    { key: 'critical', label: messages.docsFilterCritical },
    { key: 'error', label: messages.docsFilterError },
    { key: 'warning', label: messages.docsFilterWarning },
    { key: 'info', label: messages.docsFilterInfo },
  ];

  const filtered = useMemo(() => {
    if (filter === 'all') return errors;
    return errors.filter((e) => e.severity === filter);
  }, [errors, filter]);

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: errors.length };
    for (const err of errors) {
      map[err.severity] = (map[err.severity] ?? 0) + 1;
    }
    return map;
  }, [errors]);

  return (
    <article className="docs-article">
      <h1>{messages.docsNavIndex}</h1>
      <p className="docs-dictionary-desc">
        {messages.docsErrorCount.replace('{count}', String(filtered.length))}
      </p>

      <div className="docs-index-filters">
        {filters.map((f) => (
          <button
            key={f.key}
            className={`docs-index-filter ${filter === f.key ? 'active' : ''} ${f.key !== 'all' ? severityClassMap[f.key] : ''}`}
            type="button"
            onClick={() => setFilter(f.key)}
          >
            <span>{f.label}</span>
            <span className="docs-index-filter-count">{counts[f.key] ?? 0}</span>
          </button>
        ))}
      </div>

      <div className="docs-index-list">
        {filtered.map((err, i) => (
          <div key={i} className={`docs-index-row ${severityClassMap[err.severity] ?? ''}`}>
            <span className="docs-index-severity">{severityLabelMap[err.severity] ?? err.severity}</span>
            <span className="docs-index-code">{err.code}</span>
            <span className="docs-index-message">{err.message}</span>
            <span className="docs-index-category">{err.category}</span>
            <span className="docs-index-location">{err.location}</span>
          </div>
        ))}
      </div>
    </article>
  );
}
