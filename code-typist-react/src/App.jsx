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

  // 🚀 [원본 유지] Try Again 클릭 시 모달 자동 오픈 상태
  const [autoOpenModal, setAutoOpenModal] = useState(false);

  // 🚀 [원본 유지] 테마 상태 관리
  const [theme, setTheme] = useState(localStorage.getItem('app-theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('app-theme', theme);

    // [원본 유지] 폰트 및 사이즈 설정 로직
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

  // 🚀 [원본 유지] 결과창에서 트라이 클릭 시 실행되는 함수
  const handleTryAgain = () => {
    setAutoOpenModal(true);
    setView('MAIN');
  };

  // 🚀 [원본 유지] 무한 렌더링 방지를 위한 useCallback
  const handleModalOpened = useCallback(() => {
    setAutoOpenModal(false);
  }, []);

  // 🚀 [원본 유지] 테마 전환 함수
  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // 로그인하지 않은 경우
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
          theme={theme}             /* 🚀 테마 데이터 전달 */
          onThemeToggle={toggleTheme} /* 🚀 테마 변경 함수 전달 */
          initialLang={gameConfig.lang} /* 🚀 [교정] 이전에 선택해서 플레이하던 언어 데이터를 메인페이지로 그대로 전달 */
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