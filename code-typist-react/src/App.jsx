import { useState, useEffect, useCallback } from 'react';
import LoginPage from './pages/LoginPage';
import MainPage from './pages/MainPage';
import TypingPage from './pages/TypingPage';
import LongTextPage from './pages/LongTextPage';
import MiniGamePage from './pages/MiniGamePage';
import AiMiniGame from './pages/AiMiniGame';
import MiniGameSelectPage from './pages/MiniGameSelectPage';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('Guest');
  const [view, setView] = useState('MAIN');
  const [gameConfig, setGameConfig] = useState({ lang: 'Python', mode: '', textId: null });

  const [autoOpenModal, setAutoOpenModal] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('app-theme') || 'dark');

  // 백엔드 연결 테스트
  useEffect(() => {
  console.log("프론트 테스트 시작");

  fetch("http://192.168.55.32:5000/api/health")
    .then((res) => {
      console.log("응답 상태:", res.status);
      console.log("응답 OK:", res.ok);
      return res.json();
    })
    .then((data) => {
      console.log("백엔드 연결 성공:", data);
    })
    .catch((err) => {
      console.error("백엔드 연결 실패 전체 오류:", err);
      console.error("오류 이름:", err.name);
      console.error("오류 메시지:", err.message);
    });
}, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('app-theme', theme);

    const savedFont = localStorage.getItem('app-font-family');
    const savedSize = localStorage.getItem('app-font-size');

    if (savedFont) document.documentElement.style.setProperty('--global-font', savedFont);
    if (savedSize) document.documentElement.style.setProperty('--global-font-size', savedSize);
  }, [theme]);

  const handleLogin = (userData) => {
    setUsername(userData.username);
    setIsLoggedIn(true);
  };

  const handleGameStart = (lang, mode, textId = null) => {
    setGameConfig({ lang, mode, textId });

    if (mode === '긴 글 연습') setView('LONG');
    else if (mode === '미니 게임' || mode === 'AI 코드 생성기') setView('MINI_SELECT');
    else setView('TYPING');
  };

  const handleTryAgain = () => {
    setAutoOpenModal(true);
    setView('MAIN');
  };

  const handleModalOpened = useCallback(() => {
    setAutoOpenModal(false);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} theme={theme} onThemeToggle={toggleTheme} />;
  }

  return (
    <div className="app-wrapper">
      {view === 'MAIN' && (
        <MainPage
          userId={username}
          onGameStart={handleGameStart}
          onLogout={() => {
            setIsLoggedIn(false);
            setUsername('Guest');
          }}
          autoOpenModal={autoOpenModal}
          onModalOpened={handleModalOpened}
          theme={theme}
          onThemeToggle={toggleTheme}
          initialLang={gameConfig.lang}
        />
      )}

      {view === 'MINI_SELECT' && (
        <MiniGameSelectPage
          onSelect={(selectedView) => setView(selectedView)}
          onBack={() => setView('MAIN')}
          theme={theme}
        />
      )}

      {view === 'LONG' && (
        <LongTextPage
          lang={gameConfig.lang}
          textId={gameConfig.textId}
          onBack={() => setView('MAIN')}
          onTryAgain={handleTryAgain}
          theme={theme}
        />
      )}

      {view === 'TYPING' && (
        <TypingPage
          lang={gameConfig.lang}
          mode={gameConfig.mode}
          onBack={() => setView('MAIN')}
          theme={theme}
        />
      )}

      {view === 'MINI' && (
        <MiniGamePage
          lang={gameConfig.lang}
          onBack={() => setView('MINI_SELECT')}
          theme={theme}
        />
      )}

      {view === 'AI_MINI' && (
        <AiMiniGame
          onBack={() => setView('MINI_SELECT')}
          theme={theme}
        />
      )}
    </div>
  );
}

export default App;