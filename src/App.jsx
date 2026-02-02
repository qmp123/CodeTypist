import { useState } from 'react';
import LoginPage from './pages/LoginPage';
import MainPage from './pages/MainPage';
import TypingPage from './pages/TypingPage';
import LongTextPage from './pages/LongTextPage';
// 🚀 미니게임 페이지 임포트
import MiniGamePage from './pages/MiniGamePage'; 
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState('Guest');
  const [view, setView] = useState('MAIN');
  const [gameConfig, setGameConfig] = useState({ lang: 'Python', mode: '', textId: null });

  const handleLogin = (id) => {
    setUserId(id);
    setIsLoggedIn(true);
  };

  const handleGameStart = (lang, mode, textId = null) => {
    setGameConfig({ lang, mode, textId });
    
    if (mode === '긴 글 연습') {
      setView('LONG');
    } else if (mode === '미니 게임') { 
      setView('MINI'); // 미니 게임 전용 뷰로 이동
    } else {
      setView('TYPING');
    }
  };

  if (!isLoggedIn) return <LoginPage onLogin={handleLogin} />;

  return (
    <div className="app-wrapper">
      {view === 'MAIN' && (
        <MainPage 
          userId={userId} 
          onGameStart={handleGameStart} 
          onLogout={() => setIsLoggedIn(false)} 
        />
      )}
      
      {view === 'TYPING' && (
        <TypingPage 
          lang={gameConfig.lang} 
          mode={gameConfig.mode} 
          onBack={() => setView('MAIN')} 
        />
      )}
      
      {view === 'LONG' && (
        <LongTextPage 
          lang={gameConfig.lang} 
          textId={gameConfig.textId} 
          onBack={() => setView('MAIN')} 
        />
      )}

      {/* 🎮 미니 게임 페이지 연결 */}
      {view === 'MINI' && (
        <MiniGamePage 
          lang={gameConfig.lang} 
          onBack={() => setView('MAIN')} 
        />
      )}
    </div>
  );
}

export default App;