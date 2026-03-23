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

  // 🚀 Try Again 클릭 시 모달 자동 오픈 상태

  const [autoOpenModal, setAutoOpenModal] = useState(false);

  useEffect(() => {

    const savedFont = localStorage.getItem('app-font-family');
    const savedSize = localStorage.getItem('app-font-size');

    if (savedFont) document.documentElement.style.setProperty('--global-font', savedFont);

    if (savedSize) document.documentElement.style.setProperty('--global-font-size', savedSize);

  }, []);

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

  // 🚀 결과창에서 트라이 클릭 시 실행되는 함수

  const handleTryAgain = () => {
    setAutoOpenModal(true);
    setView('MAIN');
  };

  // 🚀 무한 렌더링 방지를 위해 useCallback으로 감싸줍니다.

  const handleModalOpened = useCallback(() => {
    setAutoOpenModal(false);
  }, []);

  if (!isLoggedIn) return <LoginPage onLogin={handleLogin} />;

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
        />
      )}

      {view === 'MINI_SELECT' && (
        <MiniGameSelectPage onSelect={(selectedView) => setView(selectedView)} onBack={() => setView('MAIN')} />
      )}

      {view === 'LONG' && (
        <LongTextPage
          lang={gameConfig.lang}
          textId={gameConfig.textId}
          onBack={() => setView('MAIN')}
          onTryAgain={handleTryAgain}
        />
      )}

      {view === 'TYPING' && (
        <TypingPage lang={gameConfig.lang} mode={gameConfig.mode} onBack={() => setView('MAIN')} />
      )}

      {view === 'MINI' && (
        <MiniGamePage lang={gameConfig.lang} onBack={() => setView('MINI_SELECT')} />
      )}

      {view === 'AI_MINI' && (
        <AiMiniGame onBack={() => setView('MINI_SELECT')} />
      )}

    </div>
  );

}

export default App;