import React, { useState, useEffect } from 'react';
import '../styles/modal.css';

export function SettingsModal({ onClose, theme, onThemeToggle }) {
  const [font, setFont] = useState(localStorage.getItem('app-font-family') || "'Segoe UI', sans-serif");
  const [fontSize, setFontSize] = useState(localStorage.getItem('app-font-size') || "20px");

  useEffect(() => {
    localStorage.setItem('app-font-family', font);
    document.documentElement.style.setProperty('--global-font', font);
    localStorage.setItem('app-font-size', fontSize);
    document.documentElement.style.setProperty('--global-font-size', fontSize);
  }, [font, fontSize]);

  return (
    <div className="modal-overlay" onClick={onClose} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ background: 'var(--bg-container)', padding: '40px', borderRadius: '20px', width: '450px', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', fontSize: '1.5rem', color: 'var(--text-main)', cursor: 'pointer' }}>&times;</button>
        <h2 style={{ marginBottom: '30px', color: 'var(--point-color)' }}>⚙️ 설정</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>화면 테마</span>
            <div className="theme-toggle-switch" onClick={() => onThemeToggle(theme === 'dark' ? 'light' : 'dark')}>
              <div className="toggle-dot"></div>
              <div className="theme-icon">🌞</div>
              <div className="theme-icon">🌙</div>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>글꼴</span>
            <select value={font} onChange={(e) => setFont(e.target.value)} style={{ padding: '8px', borderRadius: '5px', background: 'var(--bg-sub)', color: 'var(--text-main)' }}>
              <option value="'Segoe UI', sans-serif">기본체</option>
              <option value="'D2Coding', monospace">코딩체</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}