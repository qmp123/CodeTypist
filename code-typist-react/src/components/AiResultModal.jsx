import React from 'react';
import '../styles/ai-mini-game.css';

function AiResultModal({ data, onRetry, onExit }) {
  if (!data) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container-result">
        <h2 className="modal-title-completed">MISSION COMPLETED</h2>
        <hr className="modal-divider" />
        
        <div className="result-stats-box">
          <div className="result-line">
            <span className="result-label">정확도</span>
            <span className="result-value mint-text">{data.accuracy}%</span>
          </div>
          <div className="result-line">
            <span className="result-label">타이핑 속도</span>
            <span className="result-value mint-text">{data.speed} 타/분</span>
          </div>
          <div className="result-line">
            <span className="result-label">난이도</span>
            <span className="result-value">{data.difficulty}</span>
          </div>
          <div className="result-line">
            <span className="result-label">소요 시간</span>
            <span className="result-value">{data.time}초</span>
          </div>
        </div>

        {/* 🚀 동글동글하고 은은한 불 효과가 들어간 버튼 */}
        <div className="modal-action-buttons">
          <button className="modal-btn-result" onClick={onRetry}>다시 생성하기</button>
          <button className="modal-btn-result" onClick={onExit}>나가기</button>
        </div>
      </div>
    </div>
  );
}

export default AiResultModal;