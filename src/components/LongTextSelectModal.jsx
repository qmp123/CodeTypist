import React from 'react';
import practiceData from '../data/long-practice.json'; // 경로 재확인 요망
import '../styles/long-text-select-modal.css';

function LongTextSelectModal({ lang, onClose, onSelect }) {
  // JSON 키와 매칭하기 위해 소문자 변환
  const selectedLang = lang.toLowerCase();
  const longData = practiceData[selectedLang]?.long || {};

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">문장 선택 ({lang.toUpperCase()})</h2>
        <div className="sentence-list">
          {Object.keys(longData).map((id) => (
            <button 
              key={id} 
              className="sentence-item-btn"
              onClick={() => onSelect(id)} // "1", "2" 등의 id 전달
            >
              {longData[id].title}
            </button>
          ))}
        </div>
        <button className="modal-close-btn" onClick={onClose}>취소</button>
      </div>
    </div>
  );
}

export default LongTextSelectModal;