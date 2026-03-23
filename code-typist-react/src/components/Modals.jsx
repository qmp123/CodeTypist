import React, { useState, useEffect } from 'react';
import '../styles/modal.css';

/* 랭킹 팝업 컴포넌트 (생략 없이 유지) */
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
  const [font, setFont] = useState(() => {
    return localStorage.getItem('app-font-family') || "'Segoe UI', sans-serif";
  });

  const [fontSize, setFontSize] = useState(() => {
    return localStorage.getItem('app-font-size') || "20px";
  });

  useEffect(() => {
    localStorage.setItem('app-font-family', font);
    document.documentElement.style.setProperty('--global-font', font);
  }, [font]);

  useEffect(() => {
    localStorage.setItem('app-font-size', fontSize);
    document.documentElement.style.setProperty('--global-font-size', fontSize);
  }, [fontSize]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>&times;</button>
        <h2 className="modal-title">⚙️ 설정</h2>

        <div className="setting-box">
          {/* 1. 글꼴 설정 (한글 명칭 적용) */}
          <div className="setting-item">
            <span>기본 글꼴</span>
            <select 
              className="setting-select" 
              value={font} 
              onChange={(e) => setFont(e.target.value)}
            >
              <option value="'Segoe UI', sans-serif">기본체 (Segoe UI)</option>
              <option value="'Noto Sans KR', sans-serif">본고딕 (Noto Sans)</option>
              <option value="'D2Coding', monospace">코딩체 (D2Coding)</option>
            </select>
          </div>

          {/* 2. 글자 크기 설정 */}
          <div className="setting-item">
            <span>글자 크기</span>
            <select 
              className="setting-select"
              value={fontSize}
              onChange={(e) => setFontSize(e.target.value)}
            >
              <option value="16px">작게 (16px)</option>
              <option value="20px">보통 (20px)</option>
              <option value="24px">크게 (24px)</option>
            </select>
          </div>
        </div>
        
        <p style={{ color: '#666', marginTop: '20px', fontSize: '14px' }}>
          * 설정은 자동으로 저장됩니다. 연습 문구 크기는 고정입니다.
        </p>
      </div>
    </div>
  );
}