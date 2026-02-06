'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { sections, getNextUnlock } from '../lib/sections';

function formatTimeRemaining(ms) {
  if (ms <= 0) return 'Now';
  
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) {
    return `${days}d ${hours % 24}h ${minutes % 60}m ${seconds % 60}s`;
  }
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  }
  return `${seconds}s`;
}

function SectionCard({ section, isUnlocked, index }) {
  return (
    <div 
      className={`section-card ${isUnlocked ? 'unlocked' : 'locked'}`}
      style={{
        animationDelay: `${index * 0.1}s`
      }}
    >
      {isUnlocked ? (
        <Link href={`/section/${section.id}`} className="section-link">
          <div className="section-number">1-{section.id}</div>
          <div className="section-info">
            <h3>{section.title}</h3>
            <p>{section.subtitle}</p>
          </div>
          <div className="section-arrow">→</div>
        </Link>
      ) : (
        <div className="section-link disabled">
          <div className="section-number locked">1-{section.id}</div>
          <div className="section-info">
            <h3>{section.title}</h3>
            <p className="locked-text">🔒 Locked</p>
          </div>
        </div>
      )}
      
      <style jsx>{`
        .section-card {
          background: var(--color-bg-card);
          border: 1px solid var(--color-border);
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.3s ease;
          animation: fadeInUp 0.6s ease forwards;
          opacity: 0;
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .section-card.unlocked:hover {
          border-color: var(--color-accent);
          background: var(--color-bg-hover);
          transform: translateX(4px);
        }
        
        .section-card.locked {
          opacity: 0.5;
        }
        
        .section-link {
          display: flex;
          align-items: center;
          padding: 1.25rem 1.5rem;
          gap: 1.25rem;
        }
        
        .section-link.disabled {
          cursor: not-allowed;
        }
        
        .section-number {
          font-family: var(--font-serif);
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--color-accent);
          min-width: 3rem;
        }
        
        .section-number.locked {
          color: var(--color-locked);
        }
        
        .section-info {
          flex: 1;
        }
        
        .section-info h3 {
          font-family: var(--font-serif);
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 0.25rem;
        }
        
        .section-info p {
          font-size: 0.875rem;
          color: var(--color-text-muted);
        }
        
        .locked-text {
          color: var(--color-locked) !important;
        }
        
        .section-arrow {
          font-size: 1.25rem;
          color: var(--color-accent);
          opacity: 0;
          transform: translateX(-10px);
          transition: all 0.3s ease;
        }
        
        .section-card.unlocked:hover .section-arrow {
          opacity: 1;
          transform: translateX(0);
        }
      `}</style>
    </div>
  );
}

export default function Home() {
  const [now, setNow] = useState(Date.now());
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  
  const nextUnlock = getNextUnlock();
  const timeUntilNext = nextUnlock ? nextUnlock.unlockTime - now : 0;
  
  if (!mounted) {
    return null;
  }
  
  return (
    <main className="container">
      <header className="header">
        <div className="header-decoration">✦</div>
        <h1>Murder at Enchancia Manor</h1>
        <p className="subtitle">Chapter One: Arrivals</p>
      </header>
      
      {nextUnlock && timeUntilNext > 0 && (
        <div className="countdown-container">
          <p className="countdown-label">Next section unlocks in</p>
          <div className="countdown-timer">
            {formatTimeRemaining(timeUntilNext)}
          </div>
          <p className="countdown-section">Section 1-{nextUnlock.id}</p>
        </div>
      )}
      
      <div className="sections-list">
        {sections.map((section, index) => (
          <SectionCard 
            key={section.id}
            section={section}
            isUnlocked={now >= section.unlockTime}
            index={index}
          />
        ))}
      </div>
      
      <footer className="footer">
        <p>A new section unlocks every 24 hours</p>
      </footer>
      
      <style jsx>{`
        .container {
          max-width: 640px;
          margin: 0 auto;
          padding: 3rem 1.5rem;
          min-height: 100vh;
        }
        
        .header {
          text-align: center;
          margin-bottom: 3rem;
        }
        
        .header-decoration {
          font-size: 1.5rem;
          color: var(--color-accent);
          margin-bottom: 1rem;
        }
        
        .header h1 {
          font-family: var(--font-serif);
          font-size: 2.5rem;
          font-weight: 600;
          letter-spacing: -0.02em;
          margin-bottom: 0.5rem;
          background: linear-gradient(135deg, var(--color-text) 0%, var(--color-accent) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .subtitle {
          font-family: var(--font-serif);
          font-size: 1.25rem;
          color: var(--color-text-muted);
          font-style: italic;
        }
        
        .countdown-container {
          background: linear-gradient(135deg, var(--color-bg-card) 0%, #1a1a1d 100%);
          border: 1px solid var(--color-accent-dim);
          border-radius: 16px;
          padding: 2rem;
          text-align: center;
          margin-bottom: 2.5rem;
        }
        
        .countdown-label {
          font-size: 0.875rem;
          color: var(--color-text-muted);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 0.75rem;
        }
        
        .countdown-timer {
          font-family: var(--font-serif);
          font-size: 2.5rem;
          font-weight: 600;
          color: var(--color-accent);
          margin-bottom: 0.5rem;
        }
        
        .countdown-section {
          font-size: 0.875rem;
          color: var(--color-text-muted);
        }
        
        .sections-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        
        .footer {
          text-align: center;
          margin-top: 3rem;
          padding-top: 2rem;
          border-top: 1px solid var(--color-border);
        }
        
        .footer p {
          font-size: 0.875rem;
          color: var(--color-text-muted);
        }
        
        @media (max-width: 640px) {
          .container {
            padding: 2rem 1rem;
          }
          
          .header h1 {
            font-size: 2rem;
          }
          
          .countdown-timer {
            font-size: 2rem;
          }
        }
      `}</style>
    </main>
  );
}
