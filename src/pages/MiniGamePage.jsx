import { useState, useEffect, useRef } from 'react';
import MiniGameResultModal from '../components/MiniGameResultModal';
import '../styles/mini-game.css'; 

// 🚀 데이터는 10개 이상만 있으면 되며, 로직에서 10개로 제한합니다.
const miniGameData = {
  1: [
    { id: 1, text: "#include <stdio.h>\n\nint main() {\n  int n;\n  __(\"%d\", &n);\n  printf(\"%d\", n);\n  return 0;\n}", answers: ["scanf"] },
    { id: 2, text: "int main() {\n  for (int i = __; i < __; i++) {\n    printf(\"%d\", i);\n  }\n  return 0;\n}", answers: ["0", "5"] },
    // ... 최소 10개 이상의 데이터를 넣어주세요.
  ],
  2: [ /* ... */ ], 3: [ /* ... */ ], 4: [ /* ... */ ]
};

function MiniGamePage({ lang, onBack }) {
  const [difficulty, setDifficulty] = useState(null);
  const [gameState, setGameState] = useState('READY');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60); 
  const [userInputs, setUserInputs] = useState([]);
  const [stats, setStats] = useState({ correct: 0, wrong: 0 }); // 빈칸 항목 제거
  const timerRef = useRef(null);

  const currentScore = stats.correct * 10;

  const startGame = (level) => {
    setDifficulty(level);
    setCurrentIdx(0);
    const firstProblem = miniGameData[level][0];
    setUserInputs(new Array(firstProblem.answers.length).fill(''));
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

  const checkAnswers = () => {
    const currentProblem = miniGameData[difficulty][currentIdx];
    let localCorrect = 0, localWrong = 0;

    userInputs.forEach((input, i) => {
      const trimmed = input.trim();
      // 🚀 정답이 아니면 무조건 오답 처리
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

    // 🚀 [고정] 현재 인덱스가 9(10번째 문제) 미만일 때만 다음으로 진행
    if (currentIdx < 9) {
      const nextIdx = currentIdx + 1;
      setCurrentIdx(nextIdx);
      const nextProblem = miniGameData[difficulty][nextIdx];
      setUserInputs(new Array(nextProblem.answers.length).fill(''));
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
        <header className="game-header-wide">
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
        <button className="back-btn-ai-left" onClick={() => setGameState('READY')}>← Back to Levels</button>
        <div className="header-right-column">
          <h1 className="game-title-right">오류찾기</h1>
          <span className="info-tag-under-title">{lang} | Level {difficulty}</span>
        </div>
      </header>

      <main className="typing-area-mini">
        <div className="status-bar-mini">
          {/* 🚀 SCORE(좌), TIME(우) 배치 유지 */}
          <div className="status-item-mini">SCORE <span className="mint-text">{currentScore}</span></div>
          <div className="status-item-mini">TIME <span className="mint-text">{timeLeft}s</span></div>
          <div className="status-item-mini">PROGRESS <span className="mint-text">{currentIdx + 1} / 10</span></div>
        </div>

        <div className="code-display-box-mini">
          <pre className="code-text-pre">
            {miniGameData[difficulty][currentIdx]?.text.split('__').map((part, i, arr) => (
              <span key={i}>
                {part}
                {i < arr.length - 1 && (
                  <input 
                    className="blank-input-field"
                    value={userInputs[i] || ''}
                    onChange={(e) => {
                      const n = [...userInputs];
                      n[i] = e.target.value;
                      setUserInputs(n);
                    }}
                    onKeyDown={(e) => e.key === 'Enter' && checkAnswers()}
                    autoFocus={i === 0}
                  />
                )}
              </span>
            ))}
          </pre>
        </div>
      </main>

      {gameState === 'RESULT' && (
        <MiniGameResultModal stats={stats} time={60 - timeLeft} onHome={onBack} />
      )}
    </div>
  );
}

export default MiniGamePage;