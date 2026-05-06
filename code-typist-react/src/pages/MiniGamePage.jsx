import { useState, useEffect, useRef } from 'react';
import MiniGameResultModal from '../components/MiniGameResultModal';
import '../styles/mini-game.css'; 

// 🚀 데이터는 10개 이상만 있으면 되며, 로직에서 10개로 제한합니다.
const miniGameData = {
  1: [
    { id: 1, text: "#include <stdio.h>\n\nint main() {\n  int n;\n  __(\"%d\", &n);\n  printf(\"%d\", n);\n  return 0;\n}", answers: ["scanf"] },
    { id: 2, text: "int main() {\n  for (int i = __; i < __; i++) {\n    printf(\"%d\", i);\n  }\n  return 0;\n}", answers: ["0", "5"] },
    { id: 3, text: "int main() {\n  int a = 10;\n  __(\"Value: %d\", a);\n  return 0;\n}", answers: ["printf"] },
    { id: 4, text: "int main() {\n  int n = 5;\n  __(n > 0) {\n    printf(\"Positive\");\n  } __ {\n    printf(\"Negative\");\n  }\n  return 0;\n}", answers: ["if", "else"] },
    { id: 5, text: "int main() {\n  int count = 0;\n  __(count < 3) {\n    printf(\"Hello\\n\");\n    count++;\n  }\n  return 0;\n}", answers: ["while"] },
    { id: 6, text: "int add(int a, int b) {\n  __ a + b;\n}\n\nint main() {\n  int sum = add(3, 4);\n  return 0;\n}", answers: ["return"] },
    { id: 7, text: "__ <stdio.h>\n\nint main() {\n  printf(\"Hello World\");\n  return 0;\n}", answers: ["#include"] },
    { id: 8, text: "int main() {\n  __ a = 10;\n  __ b = 3.14;\n  return 0;\n}", answers: ["int", "double"] },
    { id: 9, text: "int main() {\n  int n = 1;\n  __(n) {\n    __ 1:\n      printf(\"One\");\n      break;\n  }\n  return 0;\n}", answers: ["switch", "case"] },
    { id: 10, text: "int main() {\n  for(int i=0; i<10; i++) {\n    if(i == 5) __;\n    printf(\"%d\", i);\n  }\n  return 0;\n}", answers: ["break"] },
    { id: 11, text: "int main() {\n  int arr[3] = {1, 2, 3};\n  printf(\"%d\", __[0]);\n  return 0;\n}", answers: ["arr"] },
    { id: 12, text: "int main() {\n  int a = 5;\n  int *p = __;\n  printf(\"%d\", *p);\n  return 0;\n}", answers: ["&a"] }
  ],
  2: [
    { id: 1, text: "int main() {\n  int arr[5] = {1, 2, 3, 4, 5};\n  int sum = 0;\n  for(int i=0; i<5; i++) {\n    sum += __[i];\n  }\n  return 0;\n}", answers: ["arr"] }
  ],
  3: [
    { id: 1, text: "void printMessage() {\n  printf(\"Message\");\n}\n\nint main() {\n  __();\n  return 0;\n}", answers: ["printMessage"] }
  ],
  4: [
    { id: 1, text: "struct Point {\n  int x;\n  int y;\n};\n\nint main() {\n  struct Point p1;\n  p1.__ = 10;\n  return 0;\n}", answers: ["x"] }
  ]
};

function MiniGamePage({ lang, onBack }) {
  const [difficulty, setDifficulty] = useState(null);
  const [gameState, setGameState] = useState('READY');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60); 
  const [userInputs, setUserInputs] = useState([]);
  const [stats, setStats] = useState({ correct: 0, wrong: 0 });
  
  const timerRef = useRef(null);
  const inputRefs = useRef([]); 

  const currentScore = stats.correct * 10;

  const startGame = (level) => {
    setDifficulty(level);
    setCurrentIdx(0);
    const firstProblem = miniGameData[level][0];
    setUserInputs(new Array(firstProblem.answers.length).fill(''));
    inputRefs.current = []; 
    setGameState('PLAYING');
    setTimeLeft(60);
    setStats({ correct: 0, wrong: 0 });
  };

  useEffect(() => {
    if (gameState === 'PLAYING' && timeLeft > 0) {
      timerRef.current = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0) endGame();
    return () => clearInterval(timerRef.current);
  }, [gameState, timeLeft]);

  useEffect(() => {
    if (gameState === 'PLAYING' && inputRefs.current[0]) {
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 10);
    }
  }, [currentIdx, gameState]);

  const checkAnswers = () => {
    const currentProblem = miniGameData[difficulty][currentIdx];
    let localCorrect = 0, localWrong = 0;

    userInputs.forEach((input, i) => {
      const trimmed = input.trim();
      if (!trimmed || trimmed !== currentProblem.answers[i]) {
        localWrong++;
      } else {
        localCorrect++;
      }
    });

    setStats(prev => ({
      correct: prev.correct + localCorrect,
      wrong: prev.wrong + localWrong
    }));

    if (currentIdx < 9) {
      const nextIdx = currentIdx + 1;
      setCurrentIdx(nextIdx);
      const nextProblem = miniGameData[difficulty][nextIdx];
      setUserInputs(new Array(nextProblem.answers.length).fill(''));
      inputRefs.current = []; 
    } else {
      endGame();
    }
  };

  const endGame = () => {
    clearInterval(timerRef.current);
    setGameState('RESULT');
  };

  if (gameState === 'READY') {
    return (
      <div className="mini-game-full-container">
        <header className="game-header-wide ready-header">
          <button className="back-btn-ai-left" onClick={onBack}>← Back</button>
          <h1 className="game-title-right">난이도 선택</h1>
        </header>
        <div className="difficulty-selection-box">
          <div className="difficulty-grid-layout">
            {[1, 2, 3, 4].map(l => (
              <button key={l} className="level-selection-btn" onClick={() => startGame(l)}>Level {l}</button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mini-game-full-container">
      <header className="game-header-wide">
        <button className="back-btn-ai-left" onClick={() => setGameState('READY')}>← Back</button>
        <div className="header-right-column">
          <h1 className="game-title-right">빈칸채우기</h1>
          <span className="info-tag-under-title">{lang} | Level {difficulty}</span>
        </div>
      </header>

      <main className="typing-area-mini">
        <div className="status-bar-mini">
          <div className="status-item-mini">점수 <span className="mint-text">{currentScore}</span></div>
          <div className="status-item-mini">소요 시간 <span className="mint-text">{timeLeft}s</span></div>
          <div className="status-item-mini">정확도 <span className="mint-text">{currentIdx + 1} / 10</span></div>
        </div>

        <div className="code-display-box-mini">
          <pre className="code-text-pre">
            {miniGameData[difficulty][currentIdx]?.text.split('__').map((part, i, arr) => (
              <span key={`${miniGameData[difficulty][currentIdx].id}-${i}`}>
                {part}
                {i < arr.length - 1 && (
                  <input 
                    className="blank-input-field"
                    ref={(el) => (inputRefs.current[i] = el)} 
                    value={userInputs[i] || ''}
                    onChange={(e) => {
                      const n = [...userInputs];
                      n[i] = e.target.value;
                      setUserInputs(n);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault(); 
                        const currentProblem = miniGameData[difficulty][currentIdx];
                        
                        if (i < currentProblem.answers.length - 1) {
                          inputRefs.current[i + 1]?.focus();
                        } else {
                          checkAnswers();
                        }
                      }
                    }}
                  />
                )}
              </span>
            ))}
          </pre>
        </div>
      </main>

      {gameState === 'RESULT' && (
        <MiniGameResultModal 
          stats={stats} 
          time={60 - timeLeft} 
          progress={timeLeft > 0 ? 10 : currentIdx} 
          onRetry={() => setGameState('READY')} 
          onRestart={() => setGameState('READY')}
          // 🚀 사진의 "미니게임 선택" 창(부모 컴포넌트)으로 돌아가도록 onBack 연결
          onHome={onBack} 
          onClose={onBack} 
        />
      )}
    </div>
  );
}

export default MiniGamePage;