import React from 'react';
import '../styles/ai-mini-game.css';

function AiResultModal({ data, onRetry, onExit }) {
  if (!data) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container-result">
        <div className="modal-divider-line" />
        <h2 className="modal-title-completed">MISSION COMPLETED</h2>

        <div className="ai-score-glow-box">
          <span className="ai-score-label">TOTAL SCORE</span>
          <h1 className="ai-score-number">{data.score || 0}</h1>
        </div>
        
        <div className="ai-score-glow-box">
          <span className="ai-score-label">TOTAL SCORE</span>
          <h1 className="ai-score-number">{data.score}</h1>
        </div>

        {/* 🚀 상세 정보 그리드: 요청하신 대로 마지막 칸에 속도 배치 */}
        <div className="ai-result-grid">
          <div className="ai-grid-item">
            <span className="grid-label">정확도</span>
            <span className="grid-value mint-text">{data.accuracy}%</span>
          </div>
          <div className="ai-grid-item">
            <span className="grid-label">난이도</span>
            <span className="grid-value">{data.difficulty}</span>
          </div>
          <div className="ai-grid-item">
            <span className="grid-label">소요 시간</span>
            <span className="grid-value">{data.time}초</span>
          </div>
          <div className="ai-grid-item">
            <span className="grid-label">속도</span>
            <span className="grid-value mint-text">{data.speed} 타/분</span>
          </div>
        </div>

        <div className="modal-action-buttons">
          <button className="modal-btn-result retry-pill" onClick={onRetry}>다시 생성하기</button>
          <button className="modal-btn-result exit-pill" onClick={onExit}>나가기</button>
        </div>
      </div>
    </div>
  );
}

export default AiResultModal;