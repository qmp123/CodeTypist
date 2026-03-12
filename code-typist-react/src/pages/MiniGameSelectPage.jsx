import React from 'react';
import '../styles/mini-game-select.css';

function MiniGameSelectPage({ onSelect, onBack }) {
  return (
    <div className="mini-game-select-container">
      {/* 🚀 헤더 구조 유지 */}
      <header className="select-header">
        {/* 🚀 클래스명을 'select-back-btn'으로 변경하여 독립시킴 */}
        <button className="mini-back-btn" onClick={onBack}>← Back</button>
        <h1 className="select-title">미니게임 선택</h1>
      </header>

      <div className="select-menu">
        <div className="select-card" onClick={() => onSelect('MINI')}>
          <div className="card-icon">⌨</div>
          <h2 className="card-name">빈칸채우기</h2>
          <p className="card-desc">코드 속 빈칸을 채워보세요.</p>
        </div>

        <div className="select-card ai-card" onClick={() => onSelect('AI_MINI')}>
          <div className="card-icon">🚀</div>
          <h2 className="card-name">AI 코드 생성기</h2>
          <p className="card-desc">AI가 실시간으로 생성한 코드로 타이핑을 연습하세요.</p>
        </div>
      </div>
    </div>
  );
}

export default MiniGameSelectPage;