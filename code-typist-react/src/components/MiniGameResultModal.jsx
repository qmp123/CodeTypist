import React from 'react';
import '../styles/mini-game.css';

function MiniGameResultModal({ stats, time, onHome }) {
  const score = stats.correct * 10;

  return (
    <div className="modal-overlay">
      <div className="modal-container-result wide-result">
        <h2 className="modal-title-completed" style={{color: '#fff', fontSize: '2.5rem', fontWeight: '800'}}>MISSION COMPLETED</h2>
        <hr className="modal-divider" style={{border: 'none', borderTop: '1px solid #333', margin: '20px 0'}} />
        
        <div className="big-score-section">
          <div className="score-label" style={{color: '#888', letterSpacing: '2px'}}>TOTAL SCORE</div>
          <div className="score-value-glow">{score}</div>
        </div>

        <div className="result-grid-details">
          <div className="detail-item">
            <span className="detail-label">정답</span>
            <span className="detail-value mint-text" style={{color: '#03dac6'}}>{stats.correct}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">오답</span>
            <span className="detail-value" style={{color: '#ff5252'}}>{stats.wrong}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">진행률</span>
            <span className="detail-value">{stats.correct + stats.wrong} / 10</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">소요 시간</span>
            <span className="detail-value">{time}초</span>
          </div>
        </div>

        <div className="modal-action-buttons" style={{display: 'flex', gap: '20px', marginTop: '30px'}}>
          <button className="modal-btn-result" onClick={() => window.location.reload()}>다시 도전하기</button>
          <button className="modal-btn-result" onClick={onHome}>나가기</button>
        </div>
      </div>
    </div>
  );
}

export default MiniGameResultModal;