import React from 'react';
import '../styles/mini-game-select.css';

function MiniGameSelectPage({ onSelect, onBack }) {
  return (
    <div className="mini-game-select-container">
      <header className="select-header">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <h1 className="select-title">미니게임 선택</h1>
      </header>

      <div className="select-menu">
        {/* 🚀 [수정] 바로 'MINI'를 호출하여 MiniGamePage 내부의 난이도 창을 띄움 */}
        <div className="select-card" onClick={() => onSelect('MINI')}>
          <div className="card-icon">⌨</div>
          <h2 className="card-name">오류찾기</h2>
          <p className="card-desc">코드 속 숨겨진 오류를 찾아 빠르게 수정하세요.</p>
        </div>

        {/* AI 코드 생성기 선택 */}
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