import React, { useState, useEffect, useRef, useCallback } from 'react';
import ResultModal from '../components/ResultModal';
import practiceData from '../data/long-practice.json';
import '../styles/long-text-page.css';

const API_BASE_URL = "http://localhost:5000";

function LongTextPage({ lang, textId, onBack, onTryAgain }) {
  const [sentences, setSentences] = useState([]);
  const [title, setTitle] = useState('');
  const [userInput, setUserInput] = useState([]);
  const [stats, setStats] = useState({ speed: 0, accuracy: 100, time: 0 });
  const [showResult, setShowResult] = useState(false);

  const startTimeRef = useRef(null);
  const isStartedRef = useRef(false);
  const inputRefs = useRef([]);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const selectedLang = (lang || 'python').toLowerCase();
    const selectedTextId = textId || 1;

    const loadLongTextData = async () => {
      try {
        const url = `${API_BASE_URL}/api/practice/long?language=${selectedLang}&set_id=${selectedTextId}&page=1`;

        const res = await fetch(url);
        const result = await res.json();

        console.log("긴글 백엔드 데이터:", result);

        if (result.success && result.data && Array.isArray(result.data.lines)) {
          const lines = result.data.lines;

          setSentences(lines);
          setTitle(result.data.title || `긴글 연습 (${lang})`);
          setUserInput(new Array(lines.length).fill(""));
          return;
        }

        throw new Error("백엔드 데이터 형식이 맞지 않습니다.");
      } catch (err) {
        console.error("긴글 API 오류, 기존 JSON 사용:", err);

        const data = practiceData[selectedLang]?.long?.[selectedTextId];

        if (data && data.pages) {
          const allSentences = data.pages.flat();
          setSentences(allSentences);
          setTitle(data.title || `긴글 연습 (${lang})`);
          setUserInput(new Array(allSentences.length).fill(""));
        }
      }
    };

    loadLongTextData();
  }, [lang, textId]);

  useEffect(() => {
    if (inputRefs.current[0]) inputRefs.current[0].focus();
  }, [sentences]);

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

    if (value.length === targetLine.length) {
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
              <div className="colored-display">
                {RenderColoredText(userInput[idx], line)}
              </div>

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