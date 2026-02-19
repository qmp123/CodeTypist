import { useState, useEffect, useRef } from 'react';
import AiResultModal from '../components/AiResultModal'; 
import '../styles/ai-mini-game.css';

function AiMiniGame({ onBack }) {
  const [language, setLanguage] = useState("C");
  const [difficulty, setDifficulty] = useState("NM");
  const [lineLimit, setLineLimit] = useState("under10");

  const [loading, setLoading] = useState(false);
  const [targetText, setTargetText] = useState("");
  const [userInput, setUserInput] = useState("");
  const [gameState, setGameState] = useState("idle"); 
  const [resultData, setResultData] = useState(null);

  const [timer, setTimer] = useState(0);
  const [speed, setSpeed] = useState(0); 
  const [accuracy, setAccuracy] = useState(100);
  
  const startTimeRef = useRef(null); 
  const intervalRef = useRef(null);

  useEffect(() => {
    if (gameState === "playing") {
      intervalRef.current = setInterval(() => {
        setTimer((prev) => prev + 1);
        if (startTimeRef.current) {
          const elapsedMinutes = (Date.now() - startTimeRef.current) / 60000;
          if (elapsedMinutes > 0) {
            setSpeed(Math.round(userInput.length / elapsedMinutes));
          }
        }
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [gameState, userInput.length]);

  const handleFinishGame = (finalAccuracy) => {
    if (gameState !== 'playing') return;
    clearInterval(intervalRef.current);
    setGameState("result");
    setResultData({
      accuracy: finalAccuracy, speed: speed, difficulty: difficulty, time: timer
    });
  };

  const generateCode = async () => {
    if (loading) return; 
    setLoading(true); setGameState("idle"); setTargetText(""); setUserInput("");
    setTimer(0); setSpeed(0); setAccuracy(100); startTimeRef.current = null; 

    try {
      await new Promise(resolve => setTimeout(resolve, 1500)); 
      const dummyCode = language === "Python" 
        ? "def hello_world():\n    for i in range(5):\n        print(f'Hello {i}')" 
        : "for (int i=0; i<5; i++) {\n    printf(\"%d\\n\", i);\n}";
      setTargetText(dummyCode); setGameState("playing");
    } catch (error) { console.error("코드 생성 실패:", error); } 
    finally { setLoading(false); }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setUserInput(value);
    if (!startTimeRef.current && value.length > 0) startTimeRef.current = Date.now();

    if (value.length > 0) {
      let correctCount = 0;
      for (let i = 0; i < value.length; i++) {
        if (value[i] === targetText[i]) correctCount++;
      }
      const currentAccuracy = Math.round((correctCount / value.length) * 100);
      setAccuracy(currentAccuracy);

      if (value.length >= targetText.length && value === targetText) {
        handleFinishGame(currentAccuracy);
      }
    }
  };

  return (
    <div className="ai-mini-game-container">
      {/* 🚀 헤더: 버튼(왼쪽), 제목(오른쪽) */}
      <header className="game-header-wide">
        <button className="back-btn-ai-left" onClick={onBack}>← Back</button>
        <h1 className="game-title-right">AI 미니 게임</h1>
      </header>

      <section className="option-bar-container">
        <div className="option-controls">
          <select value={language} onChange={(e) => setLanguage(e.target.value)} className="game-select">
            <option value="C">C</option><option value="Java">Java</option><option value="Python">Python</option>
          </select>
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="game-select">
            <option value="NM">NM</option><option value="HD">HD</option>
          </select>
          <select value={lineLimit} onChange={(e) => setLineLimit(e.target.value)} className="game-select">
            <option value="under10">10줄 이하</option><option value="20줄 이상">20줄 이상</option>
          </select>
          <button onClick={generateCode} disabled={loading} className="code-gen-btn">
            {loading ? "⌛ 생성 중..." : "🚀 코드 생성하기"}
          </button>
        </div>
      </section>

      <div className="game-main-content">
        <section className="code-display-area">
          <div className="area-label">Target Code</div>
          <pre className="code-text-box">{targetText || "코드를 생성해 주세요."}</pre>
        </section>
        <section className="typing-input-area">
          <div className="area-label">Your Typing</div>
          <textarea
            className="user-input-field"
            value={userInput}
            onChange={handleInputChange}
            placeholder="제시된 코드를 정확히 입력하세요..."
            disabled={gameState !== "playing"}
            spellCheck="false"
          />
        </section>
      </div>

      <footer className="status-bar">
        <div className="status-item">정확도: <span className={accuracy < 80 ? "warning-text" : "mint-text"}>{accuracy}%</span></div>
        <div className="status-item">속도: <span className="mint-text">{speed} 타/분</span></div>
        <div className="status-item">시간: <span className="mint-text">{timer}s</span></div>
        <div className="status-item">난이도: <span className="mint-text">{difficulty}</span></div>
      </footer>

      {gameState === "result" && (
        <AiResultModal data={resultData} onRetry={generateCode} onExit={onBack} />
      )}
    </div>
  );
}

export default AiMiniGame;