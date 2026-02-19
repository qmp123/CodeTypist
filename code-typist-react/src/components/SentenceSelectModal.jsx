import React from 'react';
import practiceData from '../data/long-practice.json';
import '../styles/sentence-select.css'; // 기존 스타일 유지

function SentenceSelectModal({ lang, onSelect, onClose }) {
  // lang이 'Python'으로 들어올 경우를 대비해 소문자로 변환
  const selectedLang = lang.toLowerCase();
  // 해당 언어의 long 연습 데이터 가져오기
  const longData = practiceData[selectedLang]?.long || {};

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>문장 선택 ({lang.toUpperCase()})</h2>
        <div className="sentence-list">
          {Object.keys(longData).map((id) => (
            <button 
              key={id} 
              className="sentence-item-btn"
              onClick={() => onSelect(id)} // 선택된 ID(1, 2, 3...)를 부모에게 전달
            >
              {longData[id].title}
            </button>
          ))}
        </div>
        <button className="cancel-btn" onClick={onClose}>취소</button>
      </div>
    </div>
  );
}

export default SentenceSelectModal;