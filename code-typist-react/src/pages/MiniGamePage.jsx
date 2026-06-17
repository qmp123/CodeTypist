import { useState, useEffect, useRef } from 'react';
import MiniGameResultModal from '../components/MiniGameResultModal';
import '../styles/mini-game.css';

const API_BASE_URL = "http://localhost:5000";

function MiniGamePage({ lang, onBack }) {
  const [difficulty, setDifficulty] = useState(null);
  const [gameState, setGameState] = useState('READY');

  const [sessionId, setSessionId] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(10);
  const [currentQuestion, setCurrentQuestion] = useState(null);

  const [timeLeft, setTimeLeft] = useState(60);
  const [userInputs, setUserInputs] = useState([]);
  const [stats, setStats] = useState({ correct: 0, wrong: 0, unfilled: 0 });

  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const timerRef = useRef(null);
  const inputRefs = useRef([]);

  const currentScore = stats.correct * 10;
  const selectedLang = (lang || 'python').toLowerCase();

  const getQuestionText = (question) => {
    if (!question) return "";

    if (Array.isArray(question.lines)) {
      return question.lines.join("\n");
    }

    return (
      question.text ||
      question.code ||
      question.question ||
      question.content ||
      ""
    );
  };

  const countBlanks = (text) => {
    return (text.match(/__\d+__/g) || text.match(/__/g) || []).length;
  };

  const getBlankCount = (question) => {
    const questionText = getQuestionText(question);

    return (
      question?.blank_count ||
      question?.answers_count ||
      question?.blankCount ||
      countBlanks(questionText)
    );
  };

  const startGame = async (level) => {
    try {
      setIsLoading(true);

      const res = await fetch(`${API_BASE_URL}/api/mini/start`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          language: selectedLang,
          level,
        }),
      });

      const result = await res.json();

      console.log("미니게임 시작:", result);
      console.log("미니게임 문제:", result?.data?.question);

      if (!result.success || !result.data) {
        throw new Error(result.error || "미니게임 시작 API 응답 형식이 맞지 않습니다.");
      }

      const data = result.data;
      const question = data.question;
      const blankCount = getBlankCount(question);

      setDifficulty(level);
      setSessionId(data.session_id);
      setCurrentPage(data.page || 1);
      setTotalQuestions(data.total_questions || 10);
      setCurrentQuestion(question);

      setUserInputs(new Array(blankCount).fill(""));
      inputRefs.current = [];

      setTimeLeft(data.time_limit_sec || 60);
      setStats({ correct: 0, wrong: 0, unfilled: 0 });
      setIsTimerRunning(false);
      setGameState("PLAYING");
    } catch (err) {
      console.error("미니게임 시작 오류:", err);
      alert("미니게임 시작에 실패했습니다. 백엔드 서버 또는 문제 데이터를 확인해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (gameState === 'PLAYING' && isTimerRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (gameState === 'PLAYING' && timeLeft === 0) {
      endGame();
    }

    return () => clearInterval(timerRef.current);
  }, [gameState, isTimerRunning, timeLeft]);

  useEffect(() => {
    if (gameState === 'PLAYING' && inputRefs.current[0]) {
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 10);
    }
  }, [currentPage, gameState]);

  const submitAnswer = async () => {
    try {
      if (!sessionId) {
        alert("세션 ID가 없습니다. 게임을 다시 시작해주세요.");
        return;
      }

      const submitInputs = userInputs.map((value, index) => ({
        blank_no: index + 1,
        value,
      }));

      console.log("제출할 입력값:", submitInputs);

      const res = await fetch(`${API_BASE_URL}/api/mini/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          session_id: sessionId,
          page: currentPage,
          inputs: submitInputs,
        }),
      });

      const result = await res.json();

      console.log("미니게임 제출:", result);
      console.log("채점 결과:", result?.data?.last_result);
      console.log("다음 문제:", result?.data?.question);

      if (!result.success || !result.data) {
        throw new Error(result.error || "미니게임 제출 API 응답 형식이 맞지 않습니다.");
      }

      const data = result.data;

      if (data.last_result) {
        setStats(prev => ({
          correct: prev.correct + (data.last_result.correct_count || 0),
          wrong: prev.wrong + (data.last_result.wrong_count || 0),
          unfilled: prev.unfilled + (data.last_result.unfilled_count || 0),
        }));
      }

      if (data.summary) {
        setStats({
          correct: data.summary.correct_total || 0,
          wrong: data.summary.wrong_total || 0,
          unfilled: data.summary.unfilled_total || 0,
        });
      }

      if (data.finished) {
        clearInterval(timerRef.current);
        setIsTimerRunning(false);
        setGameState("RESULT");
        return;
      }

      if (data.question) {
        const nextQuestion = data.question;
        const blankCount = getBlankCount(nextQuestion);

        setCurrentPage(data.page || currentPage + 1);
        setCurrentQuestion(nextQuestion);
        setUserInputs(new Array(blankCount).fill(""));
        inputRefs.current = [];
      }
    } catch (err) {
      console.error("미니게임 제출 오류:", err);
      alert("정답 제출에 실패했습니다.");
    }
  };

  const endGame = () => {
    clearInterval(timerRef.current);
    setIsTimerRunning(false);
    setGameState("RESULT");
  };

  const questionText = getQuestionText(currentQuestion);
  const questionParts = questionText.split(/__\d+__|__/g);

  if (gameState === 'READY') {
    return (
      <div className="mini-game-full-container">
        <header className="game-header-wide ready-header">
          <button className="back-btn-ai-left" onClick={onBack}>← Back</button>
          <h1 className="game-title-right">난이도 선택</h1>
        </header>

        <div className="difficulty-selection-box">
          <div className="difficulty-grid-layout">
            {[1, 2, 3, 4].map(level => (
              <button
                key={level}
                className="level-selection-btn"
                onClick={() => startGame(level)}
                disabled={isLoading}
              >
                {isLoading ? "불러오는 중..." : `Level ${level}`}
              </button>
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
          <span className="info-tag-under-title">{selectedLang} | Level {difficulty}</span>
        </div>
      </header>

      <main className="typing-area-mini">
        <div className="status-bar-mini">
          <div className="status-item-mini">
            점수 <span className="mint-text">{currentScore}</span>
          </div>
          <div className="status-item-mini">
            남은 시간 <span className="mint-text">{timeLeft}s</span>
          </div>
          <div className="status-item-mini">
            진행도 <span className="mint-text">{currentPage} / {totalQuestions}</span>
          </div>
          <div className="status-item-mini">
            정답 <span className="mint-text">{stats.correct}</span>
          </div>
          <div className="status-item-mini">
            오답 <span className="mint-text">{stats.wrong}</span>
          </div>
        </div>

        <div className="code-display-box-mini">
          <pre className="code-text-pre">
            {questionText ? (
              questionParts.map((part, i) => (
                <span key={`${currentQuestion?.question_id || currentQuestion?.id || currentPage}-${i}`}>
                  {part}

                  {i < questionParts.length - 1 && (
                    <input
                      className="blank-input-field"
                      ref={(el) => (inputRefs.current[i] = el)}
                      value={userInputs[i] || ""}
                      onChange={(e) => {
                        if (!isTimerRunning) setIsTimerRunning(true);

                        const nextInputs = [...userInputs];
                        nextInputs[i] = e.target.value;
                        setUserInputs(nextInputs);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();

                          if (i < userInputs.length - 1) {
                            inputRefs.current[i + 1]?.focus();
                          } else {
                            submitAnswer();
                          }
                        }
                      }}
                      spellCheck="false"
                      autoComplete="off"
                    />
                  )}
                </span>
              ))
            ) : (
              <span>문제 데이터를 불러오지 못했습니다.</span>
            )}
          </pre>
        </div>
      </main>

      {gameState === 'RESULT' && (
        <MiniGameResultModal
          stats={stats}
          time={60 - timeLeft}
          progress={currentPage}
          onRetry={() => setGameState('READY')}
          onRestart={() => setGameState('READY')}
          onHome={onBack}
          onClose={onBack}
        />
      )}
    </div>
  );
}

export default MiniGamePage;