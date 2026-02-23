import { useState, useEffect, useRef, useCallback } from 'react';
import ResultModal from '../components/ResultModal'; 
import '../styles/typing-page.css';

const pythonExamples = [
  'numbers = [1, 2, 3] numbers.append(4)',
  'import sys print(sys.argv)',
  'import pandas as pd df = pd.read_csv("data.csv")',
  'for i in range(5): print(i)',
  'def hello(): return "Hi"',
  'x = [i for i in range(10)] print(x)',
  'if x > 10: print("Large")',
  'with open("test.txt", "r") as f: lines = f.readlines()',
  'import matplotlib.pyplot as plt plt.show()',
  'try: val = 10 / 0 except ZeroDivisionError: pass',
  'a, b = 5, 10 a, b = b, a',
  'import random num = random.randint(1, 100)',
  'text = " Python " print(text.strip())',
  'import datetime print(datetime.datetime.now())',
  'df = pd.DataFrame({"A": [1, 2, 3]})',
  'def add(a, b): return a + b',
  'import json data = json.loads("{}")',
  'while True: break',
  'print(f"Total: {10 + 20}")',
  's = "apple,banana" list = s.split(",")',
  'arr = np.zeros((3, 3))',
  'print(len([1, 2, 3]))',
  'items = ["a", "b"] for item in items: print(item)'
];

function TypingPage({ lang, mode, onBack, fontSize }) {
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

  const startTimeRef = useRef(null); 
  const isStartedRef = useRef(false);
  const [charList, setCharList] = useState([]);
  const codingChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+[]{};:'\",.<>/?\\|`~ ";

  // 정확도 계산 로직 유지
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
    startTimeRef.current = null; isStartedRef.current = false;
  }, [mode, initWordBelt]);

  useEffect(() => { resetGame(); }, [resetGame]);

  const calculateWpm = useCallback((currentLen) => {
    if (!startTimeRef.current) return 0;
    const elapsed = Math.max((Date.now() - startTimeRef.current) / 60000, 0.00001);
    return Math.round(((totalTyped + currentLen) / 5) / elapsed);
  }, [totalTyped]);

  useEffect(() => {
    if (showResult) return;
    const interval = setInterval(() => {
      if (isStartedRef.current) {
        setTimer((prev) => (mode === '코드 게임' ? (prev <= 0 ? 0 : prev - 1) : prev + 1));
        if (startTimeRef.current) setWpm(calculateWpm(inputText.length));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [mode, inputText.length, showResult, calculateWpm]);

  const moveToNextQuestion = (scoreChange) => {
    const nextIndex = currentIndex + 1;
    setTotalTyped(prev => prev + (mode === '낱말 연습' ? 1 : currentQuestion.length));
    setScore(prev => prev + scoreChange);
    
    if (mode === '낱말 연습') {
      if (nextIndex < 100) {
        setCharList(prev => [...prev.slice(1), codingChars[Math.floor(Math.random() * codingChars.length)]]);
        setCurrentIndex(nextIndex); 
        setInputText('');
      } else setShowResult(true);
    } else {
      if (nextIndex < sessionQuestions.length) {
        setCurrentQuestion(sessionQuestions[nextIndex]); 
        setCurrentIndex(nextIndex); 
        setInputText('');
      } else {
        setShowResult(true);
      }
    }
  };

  const handleInput = (e) => {
    if (showResult) return;
    const val = e.target.value;
    
    if (mode === '낱말 연습') {
      if (val.length === 0) return;
      const char = val.slice(-1); 
      
      if (!isStartedRef.current) { isStartedRef.current = true; startTimeRef.current = Date.now(); }

      if (char !== charList[0]) {
        setMistakes(prev => prev + 1);
      }
      
      moveToNextQuestion(1);
      return; 
    }

    if (val.length === 0 && inputText.length === 0) return;
    if (!isStartedRef.current) { isStartedRef.current = true; startTimeRef.current = Date.now(); }

    setInputText(val);
    if (val.length === currentQuestion.length) {
      let errs = 0;
      for (let i = 0; i < val.length; i++) { if (val[i] !== currentQuestion[i]) errs++; }
      setMistakes(prev => prev + errs);
      moveToNextQuestion(10 - errs);
    }
  };

  return (
    <div className="typing-container" style={{ minHeight: '600px', height: 'auto' }}>
      {/* 🚀 헤더 정렬: display: flex와 justify-content: space-between 추가하여 버튼(좌) / 정보(우) 배치 */}
      <header className="game-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0 10px 0', marginBottom: '10px' }}>
      <button className="back-btn" onClick={onBack}>← Back to Menu</button>
         <div className="game-info" style={{ textAlign: 'right' }}>
         <h2 style={{ margin: 0, fontSize: '1.6rem' }}>{mode}</h2>
          {mode !== '낱말 연습' && (
            <p style={{ margin: '5px 0 0 0' }}>Language: <strong>{lang}</strong></p>
            )}
    </div>
    
    </header>
      <main className="typing-area" style={{ marginTop: '0' }}>
        <div className="status-bar" style={{ marginBottom: '15px', padding: '15px' }}>
          <div className="status-item">
            {mode === '낱말 연습' ? 'PROGRESS' : (mode === '짧은 글 연습' ? 'ACCURACY' : 'SCORE')}
            <span className="status-value">
              {mode === '낱말 연습' ? `${currentIndex}/100` : (mode === '짧은 글 연습' ? `${accuracy}%` : score)}
            </span>
          </div>
          <div className="status-item">TIME <span className="status-value">{timer}s</span></div>
          <div className="status-item">SPEED <span className="status-value">{wpm}</span></div>
        </div>

        {mode === '낱말 연습' ? (
          <div className="word-practice-wrapper" style={{ minHeight: '320px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <div className="accuracy-gauge-container" style={{ marginBottom: '50px', width: '80%' }}>
              <span className="gauge-label">정확도 {accuracy}%</span>
              <div className="gauge-track"><div className="gauge-fill" style={{ width: `${accuracy}%` }}></div></div>
            </div>
            
            <div className="char-belt-container" style={{ 
              height: '140px', 
              width: '100%', 
              position: 'relative', 
              display: 'flex', 
              alignItems: 'center', 
              overflow: 'hidden',
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              borderRadius: '15px'
            }}>
              <div className="char-belt" style={{ 
                display: 'flex', 
                paddingLeft: 'calc(50% - 45px)', 
                transition: 'transform 0.2s ease-out' 
              }}>
                {charList.map((c, i) => (
                  <div key={i} className={`belt-item ${i === 0 ? 'active' : ''}`} 
                    style={{ 
                      width: '90px', 
                      minWidth: '90px',
                      height: '110px', 
                      display: 'flex', 
                      justifyContent: 'center', 
                      alignItems: 'center', 
                      fontSize: '3.2rem',
                      fontWeight: 'bold',
                      color: i === 0 ? '#ffffff' : '#444', 
                      textShadow: i === 0 ? '0 0 25px rgba(255, 255, 255, 0.7), 0 0 10px rgba(255, 255, 255, 0.4)' : 'none',
                      transition: 'all 0.2s'
                    }}>
                    {c === " " ? "␣" : c} 
                  </div>
                ))}
              </div>
              
              <div className="active-frame" style={{ 
                position: 'absolute', 
                left: '50%',
                transform: 'translateX(-50%)',
                height: '110px', 
                width: '90px', 
                border: '3px solid #ffffff', 
                borderRadius: '15px',
                pointerEvents: 'none',
                boxShadow: '0 0 25px rgba(255, 255, 255, 0.25)',
                backgroundColor: 'rgba(255, 255, 255, 0.05)'
              }}></div>
            </div>
          </div>
        ) : (
          <div className="code-display-box" style={{ fontSize: `${fontSize * 0.8}px`, minHeight: '350px', padding: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
            {currentQuestion.split('').map((char, index) => {
              let color = inputText[index] == null ? '' : (inputText[index] === char ? 'correct' : 'wrong');
              return <span key={index} className={`char ${color}`}>{char}</span>;
            })}
          </div>
        )}

        <div className="input-centering-wrapper" style={{ marginTop: '40px' }}>
          <input type="text" className={mode === '낱말 연습' ? "belt-input-field" : "input-field"}
            value={inputText} onChange={handleInput} autoFocus spellCheck="false"
            placeholder="코드를 입력하세요." 
            style={{ 
              padding: '18px', 
              fontSize: '1.3rem', 
              textAlign: 'center',            
              backgroundColor: '#252525',
              border: '1px solid #444',
              borderRadius: '10px',
              color: '#fff'
            }} 
          />
        </div>
      </main>
      {showResult && <ResultModal mode={mode} score={score} wpm={wpm} accuracy={accuracy} time={timer} onRestart={resetGame} onHome={onBack} />}
    </div>
  );
}

export default TypingPage;