import React, { useState, useEffect, useRef, useCallback } from 'react';
import ResultModal from '../components/ResultModal';
import practiceData from '../data/long-practice.json';
import '../styles/long-text-page.css';

function LongTextPage({ lang, textId, onBack, onTryAgain }) {
  // 🚀 상태 관리 (원본 보존)
  const [sentences, setSentences] = useState([]);
  const [title, setTitle] = useState('');
  const [userInput, setUserInput] = useState([]); 
  const [stats, setStats] = useState({ speed: 0, accuracy: 100, time: 0 });
  const [showResult, setShowResult] = useState(false);
  
  // 🚀 Ref 로직 (원본 보존)
  const startTimeRef = useRef(null); 
  const isStartedRef = useRef(false); 
  const inputRefs = useRef([]);
  const scrollContainerRef = useRef(null);

  // 데이터 로드 및 초기화
  useEffect(() => {
    // 🚀 수정: 무조건 python으로 고정하는 기본값 제거 (|| 'python' 대신 '')
    // lang 프롭스가 제대로 넘어오지 않았을 때 강제로 파이썬으로 세팅되는 현상 방지
    const selectedLang = (lang || '').toLowerCase();
    
    // 선택된 언어 데이터가 없으면 빈 객체를 반환하여 에러를 막습니다.
    const data = practiceData[selectedLang]?.long?.[textId];
    
    if (data && data.pages) {
      const allSentences = data.pages.flat();
      setSentences(allSentences);
      setTitle(data.title || `긴글 연습 (${lang})`);
      setUserInput(new Array(allSentences.length).fill(""));
    }
  }, [lang, textId]);

  // 첫 번째 라인 자동 포커스
  useEffect(() => {
    if (inputRefs.current[0]) inputRefs.current[0].focus();
  }, [sentences]);

  // 실시간 통계 계산 (원본 로직 완벽 유지)
  const updateRealTimeStats = useCallback(() => {
    if (sentences.length === 0 || !startTimeRef.current) return;

    const elapsedMinutes = (Date.now() - startTimeRef.current) / 60000;
    let totalCorrect = 0;
    let totalTyped = 0;

    userInput.forEach((input, idx) => {
      const target = sentences[idx] || "";
      totalTyped += input.length;
      const minLen = Math.min(input.length, target.length);
      for (let i = 0; i < minLen; i++) {
        if (input[i] === target[i]) totalCorrect++;
      }
    });

    setStats({
      speed: Math.round(totalCorrect / elapsedMinutes) || 0,
      accuracy: totalTyped > 0 ? Math.round((totalCorrect / totalTyped) * 100) : 100,
      time: Math.floor(elapsedMinutes * 60)
    });
  }, [userInput, sentences]);

  useEffect(() => {
    if (showResult) return;

    const timerInterval = setInterval(() => {
      if (isStartedRef.current) {
        updateRealTimeStats();
      }
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [showResult, updateRealTimeStats]);

  // 입력 핸들러 및 자동 스크롤 로직
  const handleInputChange = (index, value) => {
    const targetLine = sentences[index] || "";
    if (value.length > targetLine.length) return;

    if (!isStartedRef.current) {
      isStartedRef.current = true;
      startTimeRef.current = Date.now();
    }

    const newInputs = [...userInput];
    newInputs[index] = value;
    setUserInput(newInputs);
    
    // 다음 줄 이동 및 스크롤 제어
    if (value.length === targetLine.length && value.length > 0) {
      if (index < sentences.length - 1) {
        const nextInput = inputRefs.current[index + 1];
        nextInput?.focus();
        nextInput?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        setShowResult(true);
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (index < sentences.length - 1) {
        const nextInput = inputRefs.current[index + 1];
        nextInput?.focus();
        nextInput?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        setShowResult(true);
      }
    }
    
    // 🚀 [추가] 백스페이스 입력 시 이전 줄로 포커스 및 스크롤 이동
    if (e.key === 'Backspace') {
      if ((userInput[index] === "" || !userInput[index]) && index > 0) {
        e.preventDefault();
        const prevInput = inputRefs.current[index - 1];
        prevInput?.focus();
        prevInput?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  const RenderColoredText = (input, target) => {
    if (!input) return null;
    return input.split("").map((char, i) => {
      const isCorrect = char === target[i];
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
        </div>
      </header>

      <section className="dashboard-stats">      
        <div className="stat-box">정확도 <span className="stat-val unified-stat">{stats.accuracy}%</span></div>
        <div className="stat-box">소요 시간 <span className="stat-val unified-stat">{stats.time}s</span></div>
        <div className="stat-box">속도 <span className="stat-val unified-stat">{stats.speed}</span></div>
      </section>

      <main className="code-practice-area" ref={scrollContainerRef}>
        {sentences.map((line, idx) => (
          <div key={idx} className="code-line-block">
            <p className="example-text">{line}</p>
            <div className="input-container">
              <div className="colored-display">{RenderColoredText(userInput[idx], line)}</div>
              <input 
                ref={(el) => (inputRefs.current[idx] = el)}
                className="typing-input-field"
                value={userInput[idx] || ""}
                onChange={(e) => handleInputChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                spellCheck="false"
                autoComplete="off"
              />
            </div>
          </div>
        ))}
      </main>

      <footer className="practice-footer" style={{ display: 'none' }}></footer>

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