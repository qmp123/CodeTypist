import React from 'react';
import "../styles/result-modal.css";

export default function ResultModal({ mode, score, wpm, correct, accuracy, time, onRestart, onHome }) {
  const isBasicPractice = mode === '낱말 연습' || mode === '짧은 글 연습';
  const isShortSentence = mode === '짧은 글 연습';

  return (
    <div className="result-overlay">
      <div className="result-content">
        <div className="modal-divider" />
        <h2 className="result-title">Mission Complete</h2>
        
        {!isBasicPractice && (
          <div className="score-box">
            <span className="score-label">TOTAL SCORE</span>
            <span className="score-number">{score || 0}</span>
          </div>
        )}

        <div className="stat-grid">
          {/* 🚀 정답 갯수 표시 구역 */}
          {!isShortSentence && (
            <div className="stat-item">
              <h4>정답</h4>
              <p>{correct || 0}</p>
            </div>
          )}

          <div className="stat-item">
            <h4>정확도</h4>
            <p>{accuracy || 0}%</p>
          </div>
          
          <div className="stat-item">
            <h4>소요 시간</h4>
            <p>{time || 0}s</p>
          </div>

          <div className={`stat-item ${isShortSentence ? 'full-width' : ''}`}>
            <h4>속도</h4>
            <p style={{ color: '#03dac6', fontWeight: '900' }}>
              {wpm || 0} <span style={{ fontSize: '0.9rem', fontWeight: 'normal' }}>타/분</span>
            </p>
          </div>
        </div>

        <div className="result-buttons">
          <button className="restart-btn" onClick={onRestart}>다시 도전하기</button>
          <button className="home-btn" onClick={onHome}>나가기</button>
        </div>
      </div>
    </div>
  );
}