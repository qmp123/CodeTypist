import React from 'react';
import "../styles/result-modal.css";

export default function ResultModal({ mode, score, wpm, correct, accuracy, time, onRestart, onHome }) {
  // 🚀 각 모드별 표시 여부를 결정하는 변수들
  const isWordPractice = mode === '문자 연습'; // 낱말 연습 여부
  const isBasicPractice = mode === '문자 연습' || mode === '짧은 글 연습';

  return (
    <div className="result-overlay">
      <div className="result-content">
        <div className="modal-divider" />
        <h2 className="result-title">Mission Complete</h2>
        
        {/* 점수 상자는 낱말/짧은 글이 아닐 때(긴 글 연습 등)만 표시 */}
        {!isBasicPractice && (
          <div className="score-box">
            <span className="score-label">TOTAL SCORE</span>
            <span className="score-number">{score || 0}</span>
          </div>
        )}

        <div className="stat-grid">
          {/* 🚀 '정답' 갯수는 오직 '문자 연습'에서만 표시 */}
          {isWordPractice && (
            <div className="stat-item">
              <h4>정답</h4>
              <p>{correct || 0}</p>
            </div>
          )}

          {/* 🚀 '문자 연습'이 아닐 때만 정확도 표시 */}
          {!isWordPractice && (
            <div className="stat-item">
              <h4>정확도</h4>
              <p>{accuracy || 0}%</p>
            </div>
          )}
          
          <div className="stat-item">
            <h4>소요 시간</h4>
            <p>{time || 0}s</p>
          </div>

          {/* 🚀 [교정] 남는 빈칸이 없도록, 속도 박스는 무조건 가로 100%를 꽉 채우게 수정 */}
          <div className="stat-item full-width">
            <h4>속도</h4>
            <p style={{ color: 'var(--text-main)', fontWeight: '900' }}>
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