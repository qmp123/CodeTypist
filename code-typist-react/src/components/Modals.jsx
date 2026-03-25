import React, { useState, useEffect } from 'react';

/* 🏆 랭킹 팝업 (원본 레이아웃 및 인라인 스타일 100% 유지) */
export function RankingModal({ onClose }) {
  const rankings = [
    { rank: 1, name: 'Faker', score: 2500 },
    { rank: 2, name: 'Oner', score: 2350 },
    { rank: 3, name: 'Keria', score: 2100 },
    { rank: 4, name: 'Doran', score: 1950 },
    { rank: 5, name: 'Guest', score: 1200 },
  ];

  return (
    <div className="modal-overlay" onClick={onClose} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} 
           style={{ background: 'var(--bg-card)', color: 'var(--text-main)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow)', padding: '40px', borderRadius: '20px', width: '450px', position: 'relative' }}>
        <button className="close-btn" onClick={onClose} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: 'var(--text-main)', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
        <h2 className="modal-title" style={{ color: 'var(--point-color)', marginBottom: '20px' }}>🏆 Top Ranking</h2>
        <ul className="ranking-list" style={{ listStyle: 'none', padding: 0 }}>
          {rankings.map((user) => (
            <li key={user.rank} className="ranking-item" style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border-color)' }}>
              <span className="rank-badge" style={{ fontWeight: 'bold' }}>{user.rank}위</span>
              <span>{user.name}</span>
              <span style={{ color: 'var(--point-color)', fontWeight: 'bold' }}>{user.score}점</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ⚙️ 설정 팝업 (기존 폰트/사이즈 로직 유지 + 슬라이딩 토글 적용) */
export function SettingsModal({ onClose, theme, onThemeToggle }) {
  const [font, setFont] = useState(() => localStorage.getItem('app-font-family') || "'Segoe UI', sans-serif");
  const [fontSize, setFontSize] = useState(() => localStorage.getItem('app-font-size') || "20px");

  useEffect(() => {
    localStorage.setItem('app-font-family', font);
    document.documentElement.style.setProperty('--global-font', font);
  }, [font]);

  useEffect(() => {
    localStorage.setItem('app-font-size', fontSize);
  });

  return (
    <div className="modal-overlay" onClick={onClose} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} 
           style={{ background: 'var(--bg-card)', color: 'var(--text-main)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow)', padding: '40px', borderRadius: '20px', width: '450px', position: 'relative' }}>
        <button className="close-btn" onClick={onClose} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: 'var(--text-main)', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
        <h2 className="modal-title" style={{ color: 'var(--point-color)', marginBottom: '30px' }}>⚙️ 설정</h2>

        <div className="setting-box" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="setting-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '15px' }}>
            <span>화면 테마</span>
            {/* 🚀 슬라이딩 토글 구조로 변경 */}
            <div className={`theme-toggle-switch ${theme}`} onClick={onThemeToggle} style={{ cursor: 'pointer' }}>
              <div className="toggle-dot">
                {theme === 'dark' ? '🌙' : '☀️'}
              </div>
              <div className="toggle-bg-icons">
                <span>🌙</span>
                <span>☀️</span>
              </div>
            </div>
          </div>

          <div className="setting-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>기본 글꼴</span>
            <select className="setting-select" value={font} onChange={(e) => setFont(e.target.value)}
                    style={{ background: 'var(--bg-sub)', color: 'var(--text-main)', border: '1px solid var(--border-color)', padding: '5px' }}>
              <option value="'Segoe UI', sans-serif">기본체 (Segoe UI)</option>
              <option value="'Noto Sans KR', sans-serif">본고딕 (Noto Sans)</option>
              <option value="'D2Coding', monospace">코딩체 (D2Coding)</option>
            </select>
          </div>

          <div className="setting-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>글자 크기</span>
            <select className="setting-select" value={fontSize} onChange={(e) => setFontSize(e.target.value)}
                    style={{ background: 'var(--bg-sub)', color: 'var(--text-main)', border: '1px solid var(--border-color)', padding: '5px' }}>
              <option value="16px">작게 (16px)</option>
              <option value="20px">보통 (20px)</option>
              <option value="24px">크게 (24px)</option>
            </select>
          </div>
        </div>
        
        <p style={{ color: 'var(--text-sub)', marginTop: '20px', fontSize: '14px' }}>
          * 설정은 자동으로 저장됩니다. 연습 문구 크기는 고정입니다.
        </p>
      </div>
    </div>
  );
}