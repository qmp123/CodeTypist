import React from 'react';
import '../styles/theme-toggle.css';
import VividSunImage from '../pages/VividSunImage.png';

const ThemeToggle = ({ theme, onThemeToggle }) => {
  return (
    <div className={`theme-toggle-switch ${theme}`} onClick={onThemeToggle}>
      {/* 🚀 패딩을 로그인 페이지와 똑같이 5px로 수정하고 스타일 완전 일치 */}
      <div className="toggle-icons" style={{ width: '100%', display: 'flex', justifyContent: 'space-between', padding: '0 5px', alignItems: 'center' }}>
        <img src={VividSunImage} alt="sun" style={{ width: '14px', height: '14px', opacity: 0.4, background: 'transparent' }} />
        <span style={{ fontSize: '12px', opacity: 0.4 }}>🌙</span>
      </div>
      
      <div className="toggle-thumb">
        {theme === 'light' ? <img src={VividSunImage} alt="sun" style={{ width: '16px', height: '16px', background: 'transparent' }} /> : '🌙'}
      </div>
    </div>
  );
};

export default ThemeToggle;