import { useCallback, useEffect, useRef, useState } from 'react';
import { playSound } from './audioEngine';
import { docsContentZh } from './docsContent';
import type { AppLanguage, SettingsState } from './types';

type DocsPageProps = {
  appSubtitle: string;
  backHome: string;
  openSettings: string;
  pageTitle: string;
  pageDescription: string;
  settings: SettingsState;
  language: AppLanguage;
  onBack: () => void;
  onOpenSettings: () => void;
};

const SECTION_IDS = ['overview', 'buttons', 'parameters', 'errors'] as const;
type SectionId = (typeof SECTION_IDS)[number];

const sectionLabels: Record<SectionId, string> = {
  overview: '功能概述',
  buttons: '按钮讲解',
  parameters: '参数说明',
  errors: '报错与解决',
};

export default function DocsPage({
  appSubtitle,
  backHome,
  openSettings,
  pageTitle,
  pageDescription,
  language,
  onBack,
  onOpenSettings,
}: DocsPageProps) {
  // Use Chinese content for now; can extend to multi-language later
  const content = docsContentZh;
  const [activeToolId, setActiveToolId] = useState(content.tools[0].id);
  const [activeSection, setActiveSection] = useState<SectionId>('overview');
  const contentRef = useRef<HTMLDivElement>(null);

  const activeTool = content.tools.find((t) => t.id === activeToolId) ?? content.tools[0];

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
              <p className="card-caption" style={{ marginBottom: 12 }}>目录</p>

              <div className="docs-nav-group">
                <button
                  className={`docs-nav-item ${activeToolId === 'intro' ? 'active' : ''}`}
                  type="button"
                  onClick={() => { setActiveToolId('intro'); scrollToSection('overview'); }}
                >
                  欢迎使用
                </button>
              </div>

              <div className="docs-nav-group">
                <p className="docs-nav-group-title">工具手册</p>
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

              {activeToolId !== 'intro' && (
                <div className="docs-nav-group">
                  <p className="docs-nav-group-title">当前章节</p>
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
            {activeToolId === 'intro' ? (
              <article className="docs-article">
                <h1>欢迎使用用户手册</h1>
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
                          <th>按钮名称</th>
                          <th>作用说明</th>
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
                          {param.tips ? <span className="docs-param-tip-badge">提示</span> : null}
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
                      <div key={i} className="docs-error-card">
                        <div className="docs-error-header">
                          <span className="docs-error-code">{err.code}</span>
                          <span className="docs-error-message">{err.message}</span>
                        </div>
                        <div className="docs-error-body">
                          <div className="docs-error-row">
                            <span className="docs-error-label">原因</span>
                            <span>{err.cause}</span>
                          </div>
                          <div className="docs-error-row">
                            <span className="docs-error-label">解决方法</span>
                            <span>{err.solution}</span>
                          </div>
                        </div>
                      </div>
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
