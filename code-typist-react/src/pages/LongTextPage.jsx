import { useState, useEffect, useRef, useCallback } from 'react';
import ResultModal from '../components/ResultModal';
import practiceData from '../data/long-practice.json';
import '../styles/long-text-page.css';

function LongTextPage({ lang, textId, onBack }) {
  const [sentences, setSentences] = useState([]);
  const [title, setTitle] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [userInput, setUserInput] = useState(["", "", "", "", ""]); 
  const [completedStats, setCompletedStats] = useState({ correct: 0, typed: 0 });
  const [stats, setStats] = useState({ speed: 0, accuracy: 100, time: 0 });
  const [showResult, setShowResult] = useState(false);
  
  const startTimeRef = useRef(Date.now());
  const timerRef = useRef(null);
  const inputRefs = useRef([]);

  useEffect(() => {
    const selectedLang = lang ? lang.toLowerCase() : 'python';
    const data = practiceData[selectedLang]?.long?.[textId];

    if (data && data.pages) {
      const flatSentences = data.pages.flat();
      setSentences(flatSentences);
      setTitle(data.title || `긴글 연습 (${lang})`);
    }
  }, [lang, textId]);

  useEffect(() => {
    if (inputRefs.current[0]) inputRefs.current[0].focus();
  }, [currentPage, sentences]);

  const calculateStats = useCallback(() => {
    if (sentences.length === 0) return;
    const elapsedMinutes = (Date.now() - startTimeRef.current) / 60000;
    
    let currentCorrect = 0;
    let currentTyped = 0;

    userInput.forEach((input, idx) => {
      const target = sentences[currentPage * 5 + idx] || "";
      currentTyped += input.length;
      const minLen = Math.min(input.length, target.length);
      for (let i = 0; i < minLen; i++) {
        if (input[i] === target[i]) currentCorrect++;
      }
    });

    const totalCorrect = completedStats.correct + currentCorrect;
    const totalTyped = completedStats.typed + currentTyped;
    const currentSpeed = Math.round(totalCorrect / elapsedMinutes) || 0;
    const currentAccuracy = totalTyped > 0 ? Math.round((totalCorrect / totalTyped) * 100) : 100;

    setStats({ speed: currentSpeed, accuracy: currentAccuracy, time: Math.floor(elapsedMinutes * 60) });
  }, [userInput, completedStats, currentPage, sentences]);

  useEffect(() => {
    if (showResult) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(calculateStats, 1000);
    return () => clearInterval(timerRef.current);
  }, [calculateStats, showResult]);

  const handleInputChange = (index, value) => {
    const targetLine = sentences[currentPage * 5 + index] || "";
    if (value.length > targetLine.length) return;

    const newInputs = [...userInput];
    newInputs[index] = value;
    setUserInput(newInputs);

    if (value.length === targetLine.length && value.length > 0) {
      if (index < 4) {
        inputRefs.current[index + 1]?.focus();
      }
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
      for (let i = 0; i < minLen; i++) {
        if (input[i] === target[i]) pageCorrect++;
      }
    });

    setCompletedStats(prev => ({
      correct: prev.correct + pageCorrect,
      typed: prev.typed + pageTyped
    }));

    if ((currentPage + 1) * 5 >= sentences.length) {
      setShowResult(true);
    } else {
      setCurrentPage(prev => prev + 1);
      setUserInput(["", "", "", "", ""]);
    }
  };

  // 실시간 글자 색상 렌더링 함수
  const RenderColoredText = (input, target) => {
    return input.split("").map((char, i) => {
      const color = char === target[i] ? "#00ff00" : "#ff0000"; // 맞으면 초록, 틀리면 빨강
      return <span key={i} style={{ color }}>{char}</span>;
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
        <div className="stat-box">SPEED <span className="stat-val highlight-blue">{stats.speed}</span></div>
        <div className="stat-box">ACCURACY <span className="stat-val highlight-mint">{stats.accuracy}%</span></div>
        <div className="stat-box">TIME <span className="stat-val highlight-blue">{stats.time}s</span></div>
      </section>

      <main className="code-practice-area">
        {sentences.slice(currentPage * 5, (currentPage + 1) * 5).map((line, idx) => (
          <div key={idx} className="code-line-block">
            <p className="example-text">{line}</p>
            <div className="input-container">
              <div className="colored-display">
                {RenderColoredText(userInput[idx], line)}
              </div>
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
          mode="긴 코드 연습"
          score={Math.round((stats.speed * stats.accuracy) / 100)}
          wpm={stats.speed}
          accuracy={stats.accuracy}
          time={stats.time}
          onRestart={() => window.location.reload()}
          onHome={onBack}
        />
      )}
    </div>
  );
}

export default LongTextPage;