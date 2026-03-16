import React, { useState, useEffect } from 'react';
import '../styles/modal.css';

/* 랭킹 팝업 컴포넌트 */
export function RankingModal({ onClose }) {
  const rankings = [
    { rank: 1, name: 'Faker', score: 2500 },
    { rank: 2, name: 'Oner', score: 2350 },
    { rank: 3, name: 'Keria', score: 2100 },
    { rank: 4, name: 'Doran', score: 1950 },
    { rank: 5, name: 'Guest', score: 1200 },
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>&times;</button>
        <h2 className="modal-title">🏆 Top Ranking</h2>
        
        <ul className="ranking-list">
          {rankings.map((user) => (
            <li key={user.rank} className="ranking-item">
              <span className="rank-badge">{user.rank}위</span>
              <span>{user.name}</span>
              <span style={{ color: '#bb86fc' }}>{user.score}점</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* 설정 팝업 컴포넌트 */
export function SettingsModal({ onClose }) {
  // 글꼴 상태 관리
  const [font, setFont] = useState(() => {
    return localStorage.getItem('app-font-family') || "'Segoe UI', sans-serif";
  });

  // 글꼴 변경 시 적용 및 저장
  useEffect(() => {
    localStorage.setItem('app-font-family', font);
    document.documentElement.style.setProperty('--global-font', font);
  }, [font]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>&times;</button>
        <h2 className="modal-title">⚙️ Settings</h2>

        <div className="setting-box">
          {/* 1. 글꼴 설정 */}
          <div className="setting-item">
            <span>Global Font</span>
            <select 
              className="setting-select" 
              value={font} 
              onChange={(e) => setFont(e.target.value)}
            >
              <option value="'Segoe UI', sans-serif">Default</option>
              <option value="'Noto Sans KR', sans-serif">Noto Sans KR</option>
              <option value="'D2Coding', monospace">D2Coding</option>
            </select>
          </div>

          {/* 2. 폰트 크기 설정 */}
          <div className="setting-item">
            <span>Font Size</span>
            <select className="setting-select">
              <option>Small (16px)</option>
              <option>Medium (20px)</option>
              <option>Large (24px)</option>
            </select>
          </div>
          
        
        </div>
        
        <p style={{ color: '#666', marginTop: '20px', fontSize: '14px' }}>
          * 설정은 자동으로 저장됩니다.
        </p>
      </div>
    </div>
  );
}