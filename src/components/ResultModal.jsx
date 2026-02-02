import React from 'react';
import "../styles/result-modal.css";

export default function ResultModal({ mode, score, wpm, accuracy, time, onRestart, onHome }) {
  const isBasicPractice = mode === '낱말 연습' || mode === '짧은 코드 연습';

  const getRank = () => {
    if (score >= 100) return 'S';
    if (score >= 80) return 'A';
    if (score >= 50) return 'B';
    return 'C';
  };

  return (
    <div className="result-overlay">
      <div className="result-content">
        <h2 className="result-title">Mission Complete</h2>
        
        {!isBasicPractice && (
          <div className="score-box">
            <span className="score-label">FINAL SCORE</span>
            <span className="score-number">{score}</span>
          </div>
        )}

        <div className="stat-grid">
          <div className="stat-item">
            <h4>SPEED</h4>
            <p>{wpm}</p>
          </div>
          <div className="stat-item">
            <h4>ACCURACY</h4>
            <p>{accuracy}%</p>
          </div>
          <div className="stat-item">
            <h4>TIME</h4>
            <p>{time}s</p>
          </div>
          {!isBasicPractice && (
            <div className="stat-item">
              <h4>RANK</h4>
              <p style={{ color: '#ffeb3b' }}>{getRank()}</p>
            </div>
          )}
        </div>

        <div className="result-buttons">
          <button className="restart-btn" onClick={onRestart}>Try Again ↻</button>
          <button className="home-btn" onClick={onHome}>Home 🏠</button>
        </div>
      </div>
    </div>
  );
}