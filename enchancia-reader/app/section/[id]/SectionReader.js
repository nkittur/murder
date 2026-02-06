'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

function formatTimeRemaining(ms) {
  if (ms <= 0) return 'Now';
  
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) {
    return `${days}d ${hours % 24}h ${minutes % 60}m`;
  }
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  }
  return `${seconds}s`;
}

export default function SectionReader({ section, sections, sectionId }) {
  const [now, setNow] = useState(Date.now());
  const [mounted, setMounted] = useState(false);
  
  const nextSection = sections.find(s => s.id === sectionId + 1);
  const prevSection = sections.find(s => s.id === sectionId - 1);
  
  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  
  if (!mounted) {
    return null;
  }
  
  if (!section) {
    return (
      <div className="error-container">
        <p>Section not found</p>
        <Link href="/">← Back to contents</Link>
        <style jsx>{`
          .error-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            gap: 1rem;
            color: var(--color-text-muted);
          }
        `}</style>
      </div>
    );
  }
  
  const unlocked = now >= section.unlockTime;
  
  if (!unlocked) {
    const timeUntil = section.unlockTime - now;
    return (
      <div className="locked-container">
        <div className="locked-content">
          <div className="lock-icon">🔒</div>
          <h1>Section 1-{sectionId}</h1>
          <h2>{section.title}</h2>
          <p className="unlock-label">Unlocks in</p>
          <div className="countdown">{formatTimeRemaining(timeUntil)}</div>
          <Link href="/" className="back-link">← Back to contents</Link>
        </div>
        <style jsx>{`
          .locked-container {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            padding: 2rem;
          }
          
          .locked-content {
            text-align: center;
          }
          
          .lock-icon {
            font-size: 3rem;
            margin-bottom: 1.5rem;
          }
          
          h1 {
            font-family: var(--font-serif);
            font-size: 1.25rem;
            color: var(--color-text-muted);
            margin-bottom: 0.5rem;
          }
          
          h2 {
            font-family: var(--font-serif);
            font-size: 2rem;
            margin-bottom: 2rem;
          }
          
          .unlock-label {
            font-size: 0.875rem;
            color: var(--color-text-muted);
            text-transform: uppercase;
            letter-spacing: 0.1em;
            margin-bottom: 0.5rem;
          }
          
          .countdown {
            font-family: var(--font-serif);
            font-size: 2.5rem;
            color: var(--color-accent);
            margin-bottom: 2rem;
          }
          
          .back-link {
            color: var(--color-text-muted);
            transition: color 0.2s;
          }
          
          .back-link:hover {
            color: var(--color-accent);
          }
        `}</style>
      </div>
    );
  }
  
  const nextUnlocked = nextSection ? now >= nextSection.unlockTime : false;
  const nextTimeUntil = nextSection ? nextSection.unlockTime - now : 0;
  
  // Convert content to paragraphs
  const paragraphs = section.content.split('\n\n').filter(p => p.trim());
  
  return (
    <article className="reader">
      <header className="reader-header">
        <Link href="/" className="back-button">
          <span className="back-arrow">←</span>
          <span className="back-text">Contents</span>
        </Link>
        <div className="section-indicator">1-{sectionId} of {sections.length}</div>
      </header>
      
      <div className="reader-content">
        <div className="section-header">
          <p className="section-number">Section 1-{sectionId}</p>
          <h1>{section.title}</h1>
          <p className="section-subtitle">{section.subtitle}</p>
        </div>
        
        <div className="prose">
          {paragraphs.map((paragraph, index) => {
            if (paragraph.trim() === '---') {
              return <hr key={index} className="section-break" />;
            }
            // Handle italics
            const processed = paragraph
              .replace(/\*([^*]+)\*/g, '<em>$1</em>')
              .replace(/---/g, '—');
            return (
              <p 
                key={index} 
                dangerouslySetInnerHTML={{ __html: processed }}
              />
            );
          })}
        </div>
        
        <div className="end-decoration">✦</div>
      </div>
      
      <footer className="reader-footer">
        <div className="nav-buttons">
          {prevSection && (
            <Link href={`/section/${prevSection.id}`} className="nav-button prev">
              <span className="nav-arrow">←</span>
              <span className="nav-label">Previous</span>
              <span className="nav-title">{prevSection.title}</span>
            </Link>
          )}
          
          {nextSection && (
            nextUnlocked ? (
              <Link href={`/section/${nextSection.id}`} className="nav-button next">
                <span className="nav-label">Next</span>
                <span className="nav-title">{nextSection.title}</span>
                <span className="nav-arrow">→</span>
              </Link>
            ) : (
              <div className="nav-button next locked">
                <span className="nav-label">Next section in</span>
                <span className="nav-countdown">{formatTimeRemaining(nextTimeUntil)}</span>
              </div>
            )
          )}
        </div>
        
        <Link href="/" className="footer-home">
          Back to all sections
        </Link>
      </footer>
      
      <style jsx>{`
        .reader {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }
        
        .reader-header {
          position: sticky;
          top: 0;
          background: linear-gradient(to bottom, var(--color-bg) 0%, var(--color-bg) 80%, transparent 100%);
          padding: 1.5rem 1.5rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          z-index: 10;
        }
        
        .back-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--color-text-muted);
          font-size: 0.875rem;
          transition: color 0.2s;
        }
        
        .back-button:hover {
          color: var(--color-accent);
        }
        
        .back-arrow {
          font-size: 1.25rem;
        }
        
        .section-indicator {
          font-size: 0.875rem;
          color: var(--color-text-muted);
        }
        
        .reader-content {
          flex: 1;
          max-width: 680px;
          margin: 0 auto;
          padding: 0 1.5rem 4rem;
          width: 100%;
        }
        
        .section-header {
          text-align: center;
          margin-bottom: 3rem;
          padding-top: 1rem;
        }
        
        .section-number {
          font-size: 0.875rem;
          color: var(--color-accent);
          text-transform: uppercase;
          letter-spacing: 0.15em;
          margin-bottom: 1rem;
        }
        
        .section-header h1 {
          font-family: var(--font-serif);
          font-size: 2.5rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }
        
        .section-subtitle {
          font-family: var(--font-serif);
          font-size: 1.25rem;
          color: var(--color-text-muted);
          font-style: italic;
        }
        
        .prose {
          font-family: var(--font-serif);
          font-size: 1.25rem;
          line-height: 1.8;
        }
        
        .prose :global(p) {
          margin-bottom: 1.5rem;
          text-indent: 1.5rem;
        }
        
        .prose :global(p:first-child) {
          text-indent: 0;
        }
        
        .prose :global(p:first-child::first-letter) {
          font-size: 3.5rem;
          float: left;
          line-height: 1;
          margin-right: 0.5rem;
          margin-top: 0.1rem;
          color: var(--color-accent);
          font-weight: 600;
        }
        
        .prose :global(em) {
          font-style: italic;
        }
        
        .section-break {
          border: none;
          text-align: center;
          margin: 2.5rem 0;
        }
        
        .section-break::before {
          content: '✦  ✦  ✦';
          color: var(--color-accent-dim);
          letter-spacing: 0.5rem;
          font-size: 0.75rem;
        }
        
        .end-decoration {
          text-align: center;
          color: var(--color-accent);
          font-size: 1.5rem;
          margin-top: 3rem;
        }
        
        .reader-footer {
          border-top: 1px solid var(--color-border);
          padding: 2rem 1.5rem;
          max-width: 680px;
          margin: 0 auto;
          width: 100%;
        }
        
        .nav-buttons {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
        }
        
        .nav-button {
          flex: 1;
          background: var(--color-bg-card);
          border: 1px solid var(--color-border);
          border-radius: 12px;
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          transition: all 0.2s;
        }
        
        .nav-button.prev {
          align-items: flex-start;
        }
        
        .nav-button.next {
          align-items: flex-end;
          text-align: right;
        }
        
        .nav-button:not(.locked):hover {
          border-color: var(--color-accent);
          background: var(--color-bg-hover);
        }
        
        .nav-button.locked {
          opacity: 0.6;
          cursor: default;
        }
        
        .nav-arrow {
          font-size: 1.25rem;
          color: var(--color-accent);
          margin-bottom: 0.5rem;
        }
        
        .nav-label {
          font-size: 0.75rem;
          color: var(--color-text-muted);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 0.25rem;
        }
        
        .nav-title {
          font-family: var(--font-serif);
          font-size: 1.125rem;
        }
        
        .nav-countdown {
          font-family: var(--font-serif);
          font-size: 1.125rem;
          color: var(--color-accent);
        }
        
        .footer-home {
          display: block;
          text-align: center;
          color: var(--color-text-muted);
          font-size: 0.875rem;
          transition: color 0.2s;
        }
        
        .footer-home:hover {
          color: var(--color-accent);
        }
        
        @media (max-width: 640px) {
          .reader-header {
            padding: 1rem 1rem 1.5rem;
          }
          
          .back-text {
            display: none;
          }
          
          .reader-content {
            padding: 0 1rem 3rem;
          }
          
          .section-header h1 {
            font-size: 2rem;
          }
          
          .prose {
            font-size: 1.125rem;
          }
          
          .prose :global(p:first-child::first-letter) {
            font-size: 3rem;
          }
          
          .nav-buttons {
            flex-direction: column;
          }
          
          .nav-button.prev,
          .nav-button.next {
            align-items: center;
            text-align: center;
          }
        }
      `}</style>
    </article>
  );
}
