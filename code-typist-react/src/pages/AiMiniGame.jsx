import { useState, useEffect, useRef } from 'react';
import AiResultModal from '../components/AiResultModal'; 
import '../styles/ai-mini-game.css';

function AiMiniGame({ onBack }) {
  const [language, setLanguage] = useState("C");
  // 🚀 난이도 상태 변경 (기본값 NM)
  const [difficulty, setDifficulty] = useState("NM");
  // 🚀 줄 수 제한 상태 변경 (기본값 10줄 이하)
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
  const textareaRef = useRef(null);

  // 모든 공백, 탭, 줄바꿈을 완전히 제거하는 함수 (정답 판정용)
  const normalize = (str) => str.replace(/\s+/g, '');

  useEffect(() => {
    if (gameState === "playing" && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [gameState]);

  useEffect(() => {
    if (gameState === "playing") {
      intervalRef.current = setInterval(() => {
        if (startTimeRef.current) {
          setTimer((prev) => prev + 1);
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
      accuracy: finalAccuracy, 
      speed: speed, 
      difficulty: difficulty, 
      time: timer
    });
  };

  const generateCode = async () => {
    if (loading) return; 
    setLoading(true); 
    setGameState("idle"); 
    setTargetText(""); 
    setUserInput("");
    setTimer(0); 
    setSpeed(0); 
    setAccuracy(100); 
    startTimeRef.current = null; 

    try {
      await new Promise(resolve => setTimeout(resolve, 1500)); 
      
      // 설정된 옵션에 따른 더미 코드 분기 (예시)
      let dummyCode = "";
      if (language === "Python") {
        dummyCode = "def hello_world():\n    for i in range(5):\n        print(f'Hello {i}')";
      } else if (language === "Java") {
        dummyCode = "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Hello\");\n    }\n}";
      } else {
        dummyCode = "for (int i=0; i<5; i++) {\n    printf(\"%d\\n\", i);\n}";
      }
      
      setTargetText(dummyCode); 
      setGameState("playing");
    } catch (error) { 
      console.error("코드 생성 실패:", error); 
    } finally { 
      setLoading(false); 
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setUserInput(value);

    if (!startTimeRef.current && value.length > 0) {
      startTimeRef.current = Date.now();
    }

    if (value.length > 0) {
      const normInput = normalize(value);
      const normTarget = normalize(targetText);
      
      let correctCount = 0;
      const compareLen = Math.min(normInput.length, normTarget.length);
      
      for (let i = 0; i < compareLen; i++) {
        if (normInput[i] === normTarget[i]) {
          correctCount++;
        }
      }
      
      const currentAccuracy = normInput.length > 0 
        ? Math.round((correctCount / normInput.length) * 100) 
        : 100;
      
      setAccuracy(currentAccuracy > 100 ? 100 : currentAccuracy);

      // 오타 여부와 상관없이, 정제된 텍스트의 길이가 타겟 길이에 도달하면 종료
      if (normInput.length >= normTarget.length) {
        handleFinishGame(currentAccuracy);
      }
    } else {
      setAccuracy(100);
    }
  };

  return (
    <div className="ai-mini-game-container">
      <header className="game-header-wide">
        <button className="back-btn-ai-left" onClick={onBack}>← Back</button>
        <h1 className="game-title-right">AI 미니 게임</h1>
      </header>

      <section className="option-bar-container">
        <div className="option-controls">
          <select value={language} onChange={(e) => setLanguage(e.target.value)} className="game-select">
            <option value="C">C</option>
            <option value="Java">Java</option>
            <option value="Python">Python</option>
          </select>
          
          {/* 🚀 난이도 선택: EASY, NM, HD */}
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="game-select">
            <option value="EASY">EASY</option>
            <option value="NM">NM</option>
            <option value="HD">HD</option>
          </select>
          
          {/* 🚀 줄 수 제한 선택: 10줄 이하, 10~20줄, 20줄 이상 */}
          <select value={lineLimit} onChange={(e) => setLineLimit(e.target.value)} className="game-select">
            <option value="under10">10줄 이하</option>
            <option value="10-20">10~20줄</option>
            <option value="over20">20줄 이상</option>
          </select>
          
          <button onClick={generateCode} disabled={loading} className="code-gen-btn">
            {loading ? "⌛ 생성 중..." : "🚀 코드 생성하기"}
          </button>
        </div>
      </section>

      <div className="game-main-content">
        <section className="code-display-area">
          <div className="area-label">Target Code</div>
          <div className="code-text-box">
            <pre className="pre-render">{targetText || "코드를 생성해 주세요."}</pre>
          </div>
        </section>
        <section className="typing-input-area">
          <div className="area-label">Your Typing</div>
          <textarea
            ref={textareaRef}
            className={`user-input-field ${userInput.length > 0 && accuracy < 100 ? 'error-input' : ''}`}
            value={userInput}
            onChange={handleInputChange}
            placeholder="제시된 코드를 입력하세요."
            disabled={gameState !== "playing"}
            spellCheck="false"
          />
        </section>
      </div>

      <footer className="status-bar">
        <div className="status-item">
          정확도: <span className={accuracy < 80 ? "warning-text" : "mint-text"}>{accuracy}%</span>
        </div>
        <div className="status-item">
          속도: <span className="mint-text">{speed} 타/분</span>
        </div>
        <div className="status-item">
          시간: <span className="mint-text">{timer}s</span>
        </div>
        <div className="status-item">
          난이도: <span className="mint-text">{difficulty}</span>
        </div>
      </footer>

      {gameState === "result" && (
        <AiResultModal data={resultData} onRetry={generateCode} onExit={onBack} />
      )}
    </div>
  );
}

export default AiMiniGame;