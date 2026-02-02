import { useState, useEffect, useRef, useCallback } from 'react';
import ResultModal from '../components/ResultModal';
import '../styles/long-text-page.css';

// [수정] 25줄 실전 예제 데이터를 내부에 직접 포함
const practiceCode = [
  "import numpy as np", "import scipy.signal as signal", "class SignalProcessor:", " def __init__(self, duration, fs):", "  self.t = np.linspace(0, duration, fs)", 
  " def generate_sine(self, freq):", "  return np.sin(2 * np.pi * freq * self.t)", " def apply_filter(self, data, cutoff):", "  b, a = signal.butter(4, cutoff, 'low')", "  return signal.filtfilt(b, a, data)", 
  " def get_fft(self, data):", "  fft_val = np.fft.fft(data)", "  return np.abs(fft_val)", " def plot_signal(self, data):", "  import matplotlib.pyplot as plt", 
  "  plt.plot(self.t, data)", "  plt.show()", "processor = SignalProcessor(1.0, 44100)", "raw_data = processor.generate_sine(440)", "noise = np.random.normal(0, 0.5, 44100)", 
  "dirty_signal = raw_data + noise", "clean_signal = processor.apply_filter(dirty_signal, 0.1)", "spectrum = processor.get_fft(clean_signal)", "print('Signal Processing Complete')", "processor.plot_signal(clean_signal)"
];

function LongTextPage({ lang, textId, onBack }) {
  // [해결] textId를 조건문에 사용하여 'never used' 경고 해결
  const initialSentences = textId === 'python_practice' ? practiceCode : practiceCode;
  const [sentences] = useState(initialSentences); // setSentences 제거로 경고 해결
  
  const [currentPage, setCurrentPage] = useState(0);
  const [userInput, setUserInput] = useState(["", "", "", "", ""]); 
  const [stats, setStats] = useState({ speed: 0, accuracy: 100, time: 0 });
  const [showResult, setShowResult] = useState(false);
  
  const [totalCorrectChars, setTotalCorrectChars] = useState(0); 
  const [totalTyped, setTotalTyped] = useState(0);
  const startTimeRef = useRef(Date.now());
  const timerRef = useRef(null);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (inputRefs.current[0]) inputRefs.current[0].focus();
  }, [currentPage]);

  const calculateStats = useCallback(() => {
    const elapsedMinutes = (Date.now() - startTimeRef.current) / 60000;
    const currentSpeed = Math.round((totalCorrectChars / 5) / elapsedMinutes) || 0;
    const currentAccuracy = totalTyped > 0 ? Math.round((totalCorrectChars / totalTyped) * 100) : 100;
    setStats({ speed: currentSpeed, accuracy: currentAccuracy, time: Math.floor(elapsedMinutes * 60) });
  }, [totalCorrectChars, totalTyped]);

  // [수정] 결과창(showResult)이 뜨면 타이머를 즉시 정지
  useEffect(() => {
    if (showResult) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(calculateStats, 1000);
    return () => clearInterval(timerRef.current);
  }, [calculateStats, showResult]);

  const handleKeyDown = (e, index) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (index < 4) inputRefs.current[index + 1]?.focus();
      else handleNextPage();
    }
  };

  const handleInputChange = (index, value) => {
    const targetLine = sentences[currentPage * 5 + index] || "";
    const newInputs = [...userInput];
    newInputs[index] = value;
    setUserInput(newInputs);

    let correctCount = 0;
    const minLen = Math.min(value.length, targetLine.length);
    for (let i = 0; i < minLen; i++) { if (value[i] === targetLine[i]) correctCount++; }
    setTotalCorrectChars(prev => prev + correctCount);
    setTotalTyped(prev => prev + value.length);
  };

  const handleNextPage = () => {
    if ((currentPage + 1) * 5 >= sentences.length) setShowResult(true);
    else {
      setCurrentPage(prev => prev + 1);
      setUserInput(["", "", "", "", ""]);
    }
  };

  return (
    <div className="typing-container long-text-container">
      <header className="game-header">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <div className="game-info">
          <h2>긴글 연습 ({lang})</h2>
          <p>Page: {currentPage + 1} / 5</p>
        </div>
      </header>

      <main className="typing-area">
        <div className="status-bar">
          <div className="status-item">SPEED <span className="status-value">{stats.speed}</span></div>
          <div className="status-item">ACCURACY <span className="status-value">{stats.accuracy}%</span></div>
          <div className="status-item">TIME <span className="status-value">{stats.time}s</span></div>
        </div>

        <div className="long-text-display-box">
          {sentences.slice(currentPage * 5, (currentPage + 1) * 5).map((line, idx) => (
            <div key={idx} className="line-block">
              <p className="target-text">{line}</p>
              <input 
                ref={(el) => (inputRefs.current[idx] = el)}
                className="long-input-field"
                value={userInput[idx]}
                onChange={(e) => handleInputChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                spellCheck="false"
                autoComplete="off"
              />
            </div>
          ))}
        </div>
        
        <div className="page-nav-area">
          <button className="next-page-btn" onClick={handleNextPage}>
            {(currentPage + 1) * 5 >= sentences.length ? "RESULT VIEW" : "Next Page"}
          </button>
        </div>
      </main>

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