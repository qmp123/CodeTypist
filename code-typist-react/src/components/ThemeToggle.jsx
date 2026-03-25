import React from 'react';
import '../styles/theme-toggle.css';

const ThemeToggle = ({ theme, onThemeToggle }) => {
  return (
    <div className={`theme-toggle-switch ${theme}`} onClick={onThemeToggle}>
      <div className="toggle-icons">
        <span className="icon-moon">🌙</span>
        <span className="icon-sun">☀️</span>
      </div>
      {/* 🚀 다크: 하얀 원 + 달 / 라이트: 검은 원 + 해 */}
      <div className="toggle-thumb">
        {theme === 'dark' ? '🌙' : '☀️'}
      </div>
    </div>
  );
};

export default ThemeToggle;