import React from 'react';
import practiceData from '../data/long-practice.json';
import '../styles/long-text-select-modal.css';

function LongTextSelectModal({ lang, onClose, onSelect }) {
  // JSON 키와 매칭하기 위해 소문자 변환
  const selectedLang = lang ? lang.toLowerCase() : 'python';
  const longData = practiceData[selectedLang]?.long || {};

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content selection-modal" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">문장 선택 ({lang.toUpperCase()})</h2>
        
        <div className="sentence-list">
          {Object.keys(longData).length > 0 ? (
            Object.keys(longData).map((id) => (
              <button 
                key={id} 
                className="sentence-item-btn"
                onClick={() => onSelect(id)}
              >
                <span className="sentence-title">{longData[id].title}</span>
                <span className="arrow-icon">〉</span>
              </button>
            ))
          ) : (
            <p style={{ color: 'var(--text-sub)', padding: '20px' }}>연습 데이터가 없습니다.</p>
          )}
        </div>

        <button className="modal-close-btn" onClick={onClose}>취소</button>
      </div>
    </div>
  );
}

export default LongTextSelectModal;