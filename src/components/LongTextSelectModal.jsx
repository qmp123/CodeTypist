import React from 'react';
import '../styles/result-modal.css'; 

// [수정] 데이터를 분리하지 않고 내부에 선언 (export 하지 않음으로써 Vite 오류 방지)
const longTextList = [
  { id: 'python_practice', title: '연습용' }, // '연습용' 대신 다른 이름을 쓰셔도 됩니다
  { id: 'python_dsp', title: 'Python 신호 처리 기본 (DSP)' },
  { id: 'python_ml', title: '머신러닝 알고리즘 개요' },
  { id: 'python_web', title: 'Django 백엔드 아키텍처' },
];

export default function LongTextSelectModal({ lang, onClose, onSelect }) {
  return (
    <div className="result-overlay">
      <div className="result-content" style={{ maxWidth: '500px', border: '2px solid #a29bfe' }}>
        <h2 className="result-title">문장 선택 ({lang.toUpperCase()})</h2>
        <div className="text-select-list" style={{ margin: '25px 0' }}>
          {longTextList.map((text) => (
            <div 
              key={text.id} 
              className="text-item"
              onClick={() => onSelect(text.id)}
              style={{
                padding: '18px',
                backgroundColor: '#1a1a1a',
                borderRadius: '10px',
                marginBottom: '12px',
                cursor: 'pointer',
                border: '1px solid #333',
                textAlign: 'left'
              }}
            >
              <span style={{ fontSize: '1.1rem', color: '#a29bfe', fontWeight: 'bold' }}>{text.title}</span>
            </div>
          ))}
        </div>
        <div className="result-buttons">
          <button className="home-btn" onClick={onClose}>취소</button>
        </div>
      </div>
    </div>
  );
}