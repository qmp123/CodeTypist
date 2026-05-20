import React from 'react';
import '../styles/mini-game.css';

// 🚀 progress 프롭스를 새로 받습니다.
function MiniGameResultModal({ stats, time, progress, onRetry, onHome }) {
  const score = stats.correct * 10;

  return (
    <div className="modal-overlay">
      <div className="modal-container-result wide-result">
        {/* 🚀 색상 강제(color: '#fff') 제거 -> 테마 글씨색(var(--text-main)) 자동 적용 */}
        <h2 className="modal-title-completed" style={{ fontSize: '2.5rem', fontWeight: '800' }}>
          MISSION COMPLETED
        </h2>
        
        {/* 🚀 테두리 색상도 테마 변수로 교체 */}
        <hr className="modal-divider" style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '20px 0' }} />
        
        <div className="big-score-section">
          <div className="score-label" style={{ color: 'var(--text-sub)', letterSpacing: '2px' }}>TOTAL SCORE</div>
          <div className="score-value-glow">{score}</div>
        </div>

        <div className="result-grid-details">
          <div className="detail-item">
            <span className="detail-label">정답</span>
            {/* 🚀 여기서 color: '#03dac6'를 지워버려야 CSS의 .mint-text가 작동합니다! */}
            <span className="detail-value mint-text">{stats.correct}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">오답</span>
            <span className="detail-value" style={{ color: '#ff5252' }}>{stats.wrong}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">진행률</span>
            <span className="detail-value">{progress} / 10</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">소요 시간</span>
            <span className="detail-value">{time}초</span>
          </div>
        </div>

        <div className="modal-action-buttons" style={{ display: 'flex', gap: '20px', marginTop: '30px' }}>
          <button className="modal-btn-result" onClick={onRetry}>다시 도전하기</button>
          <button className="modal-btn-result" onClick={onHome}>나가기</button>
        </div>
      </div>
    </div>
  );
}

export default MiniGameResultModal;