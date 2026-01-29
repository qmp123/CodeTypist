import { useState, useEffect, useRef } from 'react';
import MiniGameResultModal from '../components/MiniGameResultModal';
import '../styles/mini-game.css'; 

const miniGameData = {
  1: [
    { id: 1, text: "#include <stdio.h>\n\nint main() {\n  int n;\n  __(\"%d\", &n);\n  printf(\"%d\", n);\n  return 0;\n}", answers: ["scanf"] },
    { id: 2, text: "int main() {\n  for (int i = __; i < __; i++) {\n    printf(\"%d\", i);\n  }\n  return 0;\n}", answers: ["0", "5"] },
  ]
};

function MiniGamePage({ lang, onBack }) {
  const [difficulty, setDifficulty] = useState(null);
  const [gameState, setGameState] = useState('READY');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60); 
  const [userInputs, setUserInputs] = useState([]);
  const [stats, setStats] = useState({ correct: 0, wrong: 0, missing: 0 });
  const timerRef = useRef(null);

  const startGame = (level) => {
    setDifficulty(level);
    setCurrentIdx(0);
    setUserInputs(new Array(miniGameData[level][0].answers.length).fill(''));
    setGameState('PLAYING');
    setTimeLeft(60);
  };

  useEffect(() => {
    if (gameState === 'PLAYING' && timeLeft > 0) {
      timerRef.current = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0) endGame();
    return () => clearInterval(timerRef.current);
  }, [gameState, timeLeft]);

  const checkAnswers = () => {
    const currentProblem = miniGameData[difficulty][currentIdx];
    let localCorrect = 0, localWrong = 0, localMissing = 0;

    userInputs.forEach((input, i) => {
      const trimmed = input.trim();
      if (!trimmed) localMissing++;
      else if (trimmed === currentProblem.answers[i]) localCorrect++;
      else localWrong++;
    });

    setStats(prev => ({
      correct: prev.correct + localCorrect,
      wrong: prev.wrong + localWrong,
      missing: prev.missing + localMissing
    }));

    if (currentIdx < 9) {
      const nextIdx = currentIdx + 1;
      setCurrentIdx(nextIdx);
      const nextProblem = miniGameData[difficulty][nextIdx];
      if (nextProblem) {
        setUserInputs(new Array(nextProblem.answers.length).fill(''));
      }
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
      <div className="mini-game-ready" style={{ minHeight: '600px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <h2 style={{ color: '#fff', marginBottom: '30px', fontSize: '2rem' }}>난이도 선택</h2>
        <div className="difficulty-grid">
          {[1, 2, 3, 4].map(l => (
            <button key={l} className="level-btn" onClick={() => startGame(l)}>Level {l}</button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="typing-container" style={{ minHeight: '750px', height: 'auto', paddingBottom: '40px' }}>
      {/* 🚀 [변경] 상단 여백 증대: 타이틀 영역의 위아래 공간 확보 */}
      <header className="game-header" style={{ display: 'flex', justifyContent: 'space-between', padding: '50px 0 40px 0' }}>
        <button className="back-btn" onClick={onBack} style={{ background: '#333', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', alignSelf: 'flex-start' }}>
          ← Back to Menu
        </button>
        <div style={{ textAlign: 'right' }}>
          <h2 style={{ margin: 0, color: '#fff', fontSize: '1.8rem', marginBottom: '10px' }}>미니 게임</h2>
          <span className="language-tag-white">Language: {lang}</span>
        </div>
      </header>

      <main className="typing-area">
        {/* 📊 [변경] SCORE 항목 삭제 및 여백 조정 */}
        <div className="status-bar" style={{ display: 'flex', justifyContent: 'space-around', background: '#222', padding: '20px', borderRadius: '12px', marginBottom: '30px' }}>
          <div className="status-item">
            <span style={{ color: '#888', display: 'block', fontSize: '0.8rem', marginBottom: '5px' }}>TIME</span>
            <span className="status-value-mint" style={{ fontSize: '1.4rem' }}>{timeLeft}s</span>
          </div>
          <div className="status-item">
            <span style={{ color: '#888', display: 'block', fontSize: '0.8rem', marginBottom: '5px' }}>PROGRESS</span>
            <span className="status-value-mint" style={{ fontSize: '1.4rem' }}>{currentIdx + 1} / 10</span>
          </div>
        </div>

        {/* 💻 [변경] 메인 박스 크기 확대: minHeight 및 패딩 증가 */}
        <div className="code-display-box" style={{ background: '#111', padding: '50px', borderRadius: '20px', minHeight: '450px', maxHeight: '600px', overflowY: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #333' }}>
          <pre style={{ color: '#fff', fontSize: '1.3rem', lineHeight: '2.0', fontFamily: 'Consolas, monospace', width: '100%' }}>
            {miniGameData[difficulty][currentIdx]?.text.split('__').map((part, i, arr) => (
              <span key={i}>
                {part}
                {i < arr.length - 1 && (
                  <input 
                    className="blank-input"
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