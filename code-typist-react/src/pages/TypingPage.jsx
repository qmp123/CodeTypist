import { useState, useEffect, useRef, useCallback } from 'react';
import ResultModal from '../components/ResultModal';
import '../styles/typing-page.css';

const pythonExamples = [
  'numbers = [1, 2, 3] numbers.append(4)', 'import sys print(sys.argv)', 'import pandas as pd df = pd.read_csv("data.csv")',
  'for i in range(5): print(i)', 'def hello(): return "Hi"', 'x = [i for i in range(10)] print(x)',
  'if x > 10: print("Large")', 'with open("test.txt", "r") as f: lines = f.readlines()',
  'import matplotlib.pyplot as plt plt.show()', 'try: val = 10 / 0 except ZeroDivisionError: pass',
  'a, b = 5, 10 a, b = b, a', 'import random num = random.randint(1, 100)',
  'text = " Python " print(text.strip())', 'import datetime print(datetime.datetime.now())',
  'df = pd.DataFrame({"A": [1, 2, 3]})', 'def add(a, b): return a + b',
  'import json data = json.loads("{}")', 'while True: break', 'print(f"Total: {10 + 20}")',
  's = "apple,banana" list = s.split(",")', 'arr = np.zeros((3, 3))', 'print(len([1, 2, 3]))',
  'items = ["a", "b"] for item in items: print(item)'
];

function TypingPage({ lang, mode, onBack, theme }) {
  const [score, setScore] = useState(0);
  const [inputText, setInputText] = useState('');
  const [timer, setTimer] = useState(mode === '코드 게임' ? 60 : 0);
  const [wpm, setWpm] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [totalTyped, setTotalTyped] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [sessionQuestions, setSessionQuestions] = useState([]);

  // 🚀 타이머 독립을 위한 Ref 군단 (State 변화에 타이머가 리셋되지 않게 함)
  const inputTextRef = useRef('');
  const totalTypedRef = useRef(0); 
  const startTimeRef = useRef(null);
  const isStartedRef = useRef(false);
  
  const [charList, setCharList] = useState([]);
  const codingChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+[]{};:'\",.<>/?\\|`~ ";

  const accuracy = totalTyped > 0 ? Math.round(((totalTyped - mistakes) / totalTyped) * 100) : 100;

  const initWordBelt = useCallback(() => {
    const chars = codingChars;
    const newList = Array.from({ length: 20 }, () => chars[Math.floor(Math.random() * chars.length)]);
    setCharList(newList);
  }, [codingChars]);

  const resetGame = useCallback(() => {
    let selected = mode === '짧은 글 연습' ? [...pythonExamples].sort(() => Math.random() - 0.5).slice(0, 5) : [];
    setSessionQuestions(selected);
    if (mode === '낱말 연습') initWordBelt();
    else if (selected.length > 0) setCurrentQuestion(selected[0]);
    
    setCurrentIndex(0); setInputText(''); setScore(0); setWpm(0); setTotalTyped(0); setMistakes(0);
    setTimer(mode === '코드 게임' ? 60 : 0); setShowResult(false);
    
    startTimeRef.current = null; 
    isStartedRef.current = false;
    inputTextRef.current = '';
    totalTypedRef.current = 0;
  }, [mode, initWordBelt]);

  useEffect(() => { resetGame(); }, [resetGame]);

  // 🚀 WPM 계산 로직 (Ref를 사용하여 리렌더링 없이 정확한 값 참조)
  const calculateWpmNow = useCallback((currentLen) => {
    if (!startTimeRef.current) return 0;
    const elapsed = Math.max((Date.now() - startTimeRef.current) / 60000, 0.00001);
    return Math.round(((totalTypedRef.current + currentLen) / 5) / elapsed);
  }, []);

  // 🚀 [수정 완료] 실시간 타이머: 의존성 배열에서 inputText.length를 제거하여 타자 입력 중에도 멈추지 않음
  useEffect(() => {
    if (showResult) return;
    
    const interval = setInterval(() => {
      if (isStartedRef.current && startTimeRef.current) {
        // 1. 시간 업데이트 (Date.now 기반으로 렌더링 지연 없이 정확히 계산)
        if (mode === '코드 게임') {
          setTimer((prev) => (prev <= 0 ? 0 : prev - 1));
        } else {
          const elapsedSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000);
          setTimer(elapsedSeconds);
        }

        // 2. WPM 업데이트 (Ref를 통해 글자 수를 확인하므로 타이머 방해 없음)
        setWpm(calculateWpmNow(inputTextRef.current.length)); 
      }
    }, 1000);

    return () => clearInterval(interval);
    // 💡 inputText.length가 의존성에 없으므로 타자를 쳐도 타이머가 리셋되지 않습니다.
  }, [mode, showResult, calculateWpmNow]); 

  const moveToNextQuestion = (scoreChange) => {
    const nextIndex = currentIndex + 1;
    const addedTyped = (mode === '낱말 연습' ? 1 : currentQuestion.length);
    
    totalTypedRef.current += addedTyped; // Ref 업데이트
    setTotalTyped(totalTypedRef.current); // State 업데이트
    setScore(prev => prev + scoreChange);
    
    if (mode === '낱말 연습') {
      if (nextIndex < 100) {
        setCharList(prev => [...prev.slice(1), codingChars[Math.floor(Math.random() * codingChars.length)]]);
        setCurrentIndex(nextIndex);
        setInputText('');
        inputTextRef.current = ''; // Ref 초기화
      } else setShowResult(true);
    } else {
      if (nextIndex < sessionQuestions.length) {
        setCurrentQuestion(sessionQuestions[nextIndex]);
        setCurrentIndex(nextIndex);
        setInputText('');
        inputTextRef.current = ''; // Ref 초기화
      } else setShowResult(true);
    }
  };

  const handleInput = (e) => {
    if (showResult) return;
    const val = e.target.value;

    // 첫 입력 시 타이머 시작 시점 고정
    if (!isStartedRef.current && val.length > 0) { 
      isStartedRef.current = true; 
      startTimeRef.current = Date.now(); 
    }

    inputTextRef.current = val; // 타이머가 볼 수 있게 Ref에 값 저장
    setWpm(calculateWpmNow(val.length)); // 타건 즉시 속도 반영

    if (mode === '낱말 연습') {
      if (val.length === 0) return;
      const char = val.slice(-1);
      if (char !== charList[0]) setMistakes(prev => prev + 1);
      
      inputTextRef.current = ''; // 낱말은 즉시 넘어가므로 Ref 비움
      moveToNextQuestion(1);
      return;
    }

    if (val.length === 0 && inputText.length === 0) return;
    setInputText(val);

    if (val.length === currentQuestion.length) {
      let errs = 0;
      for (let i = 0; i < val.length; i++) { if (val[i] !== currentQuestion[i]) errs++; }
      setMistakes(prev => prev + errs);
      moveToNextQuestion(10 - errs);
    }
  };

  return (
    <div className="typing-container" style={{ minHeight: '600px', height: 'auto', backgroundColor: 'var(--bg-card)', color: 'var(--text-main)', borderRadius: '20px', padding: '20px 40px', boxShadow: 'var(--shadow)' }}>
      <header className="game-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0 10px 0', borderBottom: '1px solid var(--border-color)', marginBottom: '20px' }}>
        <button className="back-btn" onClick={onBack} style={{ backgroundColor: 'var(--bg-sub)', color: 'var(--text-main)', border: '1px solid var(--border-color)' }}>← Back</button>
        <div className="game-info" style={{ textAlign: 'right' }}>
          <h2 style={{ margin: 0, fontSize: '1.6rem', color: 'var(--point-color)' }}>{mode}</h2>
          {mode !== '낱말 연습' && (
            <p style={{ margin: '5px 0 0 0', color: 'var(--text-sub)' }}>Language: <strong>{lang}</strong></p>
          )}
        </div>
      </header>

      <main className="typing-area" style={{ marginTop: '0' }}>
        <div className="status-bar" style={{ marginBottom: '15px', padding: '15px', backgroundColor: 'var(--bg-sub)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <div className="status-item" style={{ color: 'var(--text-sub)' }}>
            {mode === '낱말 연습' ? '정확도' : (mode === '짧은 글 연습' ? '정확도' : 'SCORE')}
            <span className="status-value" style={{ color: 'var(--text-main)' }}>
              {mode === '낱말 연습' ? `${currentIndex}/100` : (mode === '짧은 글 연습' ? `${accuracy}%` : score)}
            </span>
          </div>
          <div className="status-item" style={{ color: 'var(--text-sub)' }}>소요 시간 <span className="status-value" style={{ color: 'var(--text-main)' }}>{timer}s</span></div>
          <div className="status-item" style={{ color: 'var(--text-sub)' }}>속도 <span className="status-value" style={{ color: 'var(--point-color)' }}>{wpm}</span></div>
        </div>

        {mode === '낱말 연습' ? (
          <div className="word-practice-wrapper" style={{ minHeight: '320px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <div className="accuracy-gauge-container" style={{ marginBottom: '50px', width: '80%' }}>
              <span className="gauge-label" style={{ color: 'var(--text-main)' }}>정확도 {accuracy}%</span>
              <div className="gauge-track" style={{ backgroundColor: 'var(--border-color)' }}>
                <div className="gauge-fill" style={{ width: `${accuracy}%`, backgroundColor: 'var(--point-color)' }}></div>
              </div>
            </div>
          
            <div className="char-belt-container" style={{
              height: '140px', width: '100%', position: 'relative', display: 'flex', alignItems: 'center', overflow: 'hidden',
              backgroundColor: 'var(--bg-sub)', borderRadius: '15px', border: '1px solid var(--border-color)'
            }}>
              <div className="char-belt" style={{ display: 'flex', paddingLeft: 'calc(50% - 45px)', transition: 'transform 0.2s ease-out' }}>
                {charList.map((c, i) => (
                  <div key={i} className={`belt-item ${i === 0 ? 'active' : ''}`}
                    style={{
                      width: '90px', minWidth: '90px', height: '110px', display: 'flex', justifyContent: 'center', alignItems: 'center',
                      fontSize: '3.2rem', fontWeight: 'bold',
                      color: i === 0 ? 'var(--text-main)' : 'var(--text-sub)', 
                      textShadow: i === 0 ? (theme === 'dark' ? '0 0 25px rgba(255, 255, 255, 0.7)' : 'none') : 'none',
                      transition: 'all 0.2s'
                    }}>
                    {c === " " ? "␣" : c}
                  </div>
                ))}
              </div>
              <div className="active-frame" style={{
                position: 'absolute', left: '50%', transform: 'translateX(-50%)', height: '110px', width: '90px',
                border: '3px solid var(--point-color)', borderRadius: '15px', pointerEvents: 'none',
                boxShadow: '0 0 25px rgba(124, 77, 255, 0.2)', backgroundColor: 'transparent'
              }}></div>
            </div>
          </div>
        ) : (
          <div className="code-display-box" style={{ 
            minHeight: '350px', padding: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap',
            backgroundColor: 'var(--bg-sub)', borderRadius: '15px', border: '1px solid var(--border-color)', color: 'var(--text-main)' 
          }}>
            {currentQuestion.split('').map((char, index) => {
              let colorClass = inputText[index] == null ? '' : (inputText[index] === char ? 'correct' : 'wrong');
              return <span key={index} className={`char ${colorClass}`}>{char}</span>;
            })}
          </div>
        )}

        <div className="input-centering-wrapper" style={{ marginTop: '40px' }}>
          <input type="text" className={mode === '낱말 연습' ? "belt-input-field" : "input-field"}
            value={inputText} onChange={handleInput} autoFocus spellCheck="false"
            placeholder="코드를 입력하세요."
            style={{
              padding: '18px', fontSize: '1.3rem', textAlign: 'center',            
              backgroundColor: 'var(--bg-sub)', border: '2px solid var(--border-color)', 
              borderRadius: '10px', color: 'var(--text-main)', width: '100%'
            }}
          />
        </div>
      </main>
      {showResult && <ResultModal mode={mode} score={score} wpm={wpm} accuracy={accuracy} time={timer} onRestart={resetGame} onHome={onBack} theme={theme} />}
    </div>
  );
}

export default TypingPage;