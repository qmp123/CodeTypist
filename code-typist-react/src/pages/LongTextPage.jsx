import React, { useState, useEffect, useRef, useCallback } from 'react';
import ResultModal from '../components/ResultModal';
import practiceData from '../data/long-practice.json';
import '../styles/long-text-page.css';

function LongTextPage({ lang, textId, onBack, onTryAgain }) {
  const [sentences, setSentences] = useState([]);
  const [title, setTitle] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [userInput, setUserInput] = useState(["", "", "", "", ""]); 
  const [completedStats, setCompletedStats] = useState({ correct: 0, typed: 0 });
  const [stats, setStats] = useState({ speed: 0, accuracy: 100, time: 0 });
  const [showResult, setShowResult] = useState(false);
  
  // 🚀 타이머 Ref 로직 유지
  const startTimeRef = useRef(null); 
  const isStartedRef = useRef(false); 
  const userInputRef = useRef(["", "", "", "", ""]); 
  const inputRefs = useRef([]);

  useEffect(() => {
    const selectedLang = lang ? lang.toLowerCase() : 'python';
    const data = practiceData[selectedLang]?.long?.[textId];
    if (data && data.pages) {
      setSentences(data.pages.flat());
      setTitle(data.title || `긴글 연습 (${lang})`);
    }
  }, [lang, textId]);

  useEffect(() => {
    if (inputRefs.current[0]) inputRefs.current[0].focus();
  }, [currentPage, sentences]);

  const updateRealTimeStats = useCallback(() => {
    if (sentences.length === 0 || !startTimeRef.current) return;

    const elapsedMinutes = (Date.now() - startTimeRef.current) / 60000;
    let currentCorrect = 0;
    let currentTyped = 0;

    userInputRef.current.forEach((input, idx) => {
      const target = sentences[currentPage * 5 + idx] || "";
      currentTyped += input.length;
      const minLen = Math.min(input.length, target.length);
      for (let i = 0; i < minLen; i++) {
        if (input[i] === target[i]) currentCorrect++;
      }
    });

    const totalCorrect = completedStats.correct + currentCorrect;
    const totalTyped = completedStats.typed + currentTyped;

    setStats({
      speed: Math.round(totalCorrect / elapsedMinutes) || 0,
      accuracy: totalTyped > 0 ? Math.round((totalCorrect / totalTyped) * 100) : 100,
      time: Math.floor(elapsedMinutes * 60)
    });
  }, [completedStats, currentPage, sentences]);

  useEffect(() => {
    if (showResult) return;

    const timerInterval = setInterval(() => {
      if (isStartedRef.current) {
        updateRealTimeStats();
      }
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [showResult, updateRealTimeStats]);

  const handleInputChange = (index, value) => {
    const targetLine = sentences[currentPage * 5 + index] || "";
    if (value.length > targetLine.length) return;

    if (!isStartedRef.current) {
      isStartedRef.current = true;
      startTimeRef.current = Date.now();
    }

    const newInputs = [...userInput];
    newInputs[index] = value;
    setUserInput(newInputs);
    userInputRef.current = newInputs;
    
    if (value.length === targetLine.length && value.length > 0 && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (index < 4) inputRefs.current[index + 1]?.focus();
      else handleNextPage(); 
    }
  };

  const handleNextPage = () => {
    let pageCorrect = 0;
    let pageTyped = 0;
    userInput.forEach((input, idx) => {
      const target = sentences[currentPage * 5 + idx] || "";
      pageTyped += input.length;
      const minLen = Math.min(input.length, target.length);
      for (let i = 0; i < minLen; i++) if (input[i] === target[i]) pageCorrect++;
    });

    setCompletedStats(prev => ({ correct: prev.correct + pageCorrect, typed: prev.typed + pageTyped }));
    
    if ((currentPage + 1) * 5 >= sentences.length) {
      setShowResult(true);
    } else {
      setCurrentPage(prev => prev + 1);
      const resetInputs = ["", "", "", "", ""];
      setUserInput(resetInputs);
      userInputRef.current = resetInputs; 
    }
  };

  // 🚀 핵심 수정: 스페이스바("\u00A0") 변환으로 위치 밀림 방지
  const RenderColoredText = (input, target) => {
    return input.split("").map((char, i) => {
      const isCorrect = char === target[i];
      // 일반 공백을 고정폭 공백으로 변환하여 정렬 유지
      const displayText = char === " " ? "\u00A0" : char;
      return (
        <span key={i} style={{ color: isCorrect ? "#4caf50" : "#f44336" }}>
          {displayText}
        </span>
      );
    });
  };

  return (
    <div className="long-practice-layout">
      <header className="practice-header">
        <button className="back-button" onClick={onBack}>← Back</button>
        <div className="header-text">
          <h1 className="practice-title">{title}</h1>
          <span className="page-indicator">Page: {currentPage + 1} / {Math.ceil(sentences.length / 5)}</span>
        </div>
      </header>

      <section className="dashboard-stats">      
        <div className="stat-box">정확도 <span className="stat-val highlight-mint">{stats.accuracy}%</span></div>
        <div className="stat-box">소요 시간 <span className="stat-val highlight-blue">{stats.time}s</span></div>
        <div className="stat-box">속도 <span className="stat-val highlight-blue">{stats.speed}</span></div>
      </section>

      <main className="code-practice-area">
        {sentences.slice(currentPage * 5, (currentPage + 1) * 5).map((line, idx) => (
          <div key={idx} className="code-line-block">
            <p className="example-text">{line}</p>
            <div className="input-container">
              <div className="colored-display">{RenderColoredText(userInput[idx], line)}</div>
              <input 
                ref={(el) => (inputRefs.current[idx] = el)}
                className="typing-input-field"
                value={userInput[idx]}
                onChange={(e) => handleInputChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                spellCheck="false"
                autoComplete="off"
              />
            </div>
          </div>
        ))}
      </main>

      <footer className="practice-footer">
        <button className="nav-action-btn" onClick={handleNextPage}>
          {(currentPage + 1) * 5 >= sentences.length ? "RESULT VIEW" : "Next Page"}
        </button>
      </footer>

      {showResult && (
        <ResultModal 
          mode="긴 글 연습" 
          score={Math.round((stats.speed * stats.accuracy) / 100)}
          wpm={stats.speed}
          accuracy={stats.accuracy}
          time={stats.time}
          onRestart={onTryAgain}
          onHome={onBack}
        />
      )}
    </div>
  );
}

export default LongTextPage;