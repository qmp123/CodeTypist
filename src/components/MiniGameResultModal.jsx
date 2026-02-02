import React from 'react';
import '../styles/result-modal.css';

export default function MiniGameResultModal({ stats, time, onHome }) {
  return (
    <div className="result-overlay">
      <div className="result-content" style={{ border: '2px solid #03dac6', width: '400px' }}>
        <h2 className="result-title">연습 종료!</h2>
        <div className="stat-grid" style={{ margin: '30px 0' }}>
          <div style={{ color: '#03dac6' }}>정답: {stats.correct}</div>
          <div style={{ color: '#ff5252' }}>오답: {stats.wrong}</div>
          <div style={{ color: '#888' }}>남은 빈칸: {stats.missing}</div>
          <div>소요 시간: {time}초</div>
        </div>
        <button className="home-btn" onClick={onHome}>메인으로</button>
      </div>
    </div>
  );
}