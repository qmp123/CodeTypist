import { useState } from 'react';
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
  const [userId, setUserId] = useState('Guest');
  const [view, setView] = useState('MAIN');
  const [gameConfig, setGameConfig] = useState({ lang: 'Python', mode: '', textId: null });

  const handleLogin = (id) => {
    setUserId(id);
    setIsLoggedIn(true);
  };

  const handleGameStart = (lang, mode, textId = null) => {
    setGameConfig({ lang, mode, textId });
    
    // 🚀 '미니 게임' 버튼 클릭 시 선택 메뉴창으로 이동
    if (mode === '긴 글 연습') {
      setView('LONG');
    } else if (mode === '미니 게임' || mode === 'AI 코드 생성기') { 
      setView('MINI_SELECT');
    } else {
      setView('TYPING');
    }
  };

  if (!isLoggedIn) return <LoginPage onLogin={handleLogin} />;

  return (
    <div className="app-wrapper">
      {/* 1. 메인 화면 */}
      {view === 'MAIN' && (
        <MainPage 
          userId={userId} 
          onGameStart={handleGameStart} 
          onLogout={() => setIsLoggedIn(false)} 
        />
      )}

      {/* 2. 미니게임 선택 메뉴창 (오류찾기 vs AI 코드 생성기) */}
      {view === 'MINI_SELECT' && (
        <MiniGameSelectPage 
          onSelect={(selectedView) => setView(selectedView)} 
          onBack={() => setView('MAIN')} 
        />
      )}
      
      {/* 3. 긴 글 연습 모드 */}
      {view === 'LONG' && (
        <LongTextPage 
          lang={gameConfig.lang} 
          textId={gameConfig.textId} 
          onBack={() => setView('MAIN')} 
        />
      )}

      {/* 4. 낱말/짧은 글 연습 모드 */}
      {view === 'TYPING' && (
        <TypingPage 
          lang={gameConfig.lang} 
          mode={gameConfig.mode} 
          onBack={() => setView('MAIN')} 
        />
      )}
      
      {/* 5. 🚀 오류찾기 (내부에 Level 1~4 선택 화면 포함) */}
      {view === 'MINI' && (
        <MiniGamePage 
          lang={gameConfig.lang} 
          onBack={() => setView('MINI_SELECT')} 
        />
      )}

      {/* 6. AI 코드 타자 미니 게임 */}
      {view === 'AI_MINI' && (
        <AiMiniGame 
          onBack={() => setView('MINI_SELECT')} 
        />
      )}
    </div>
  );
}

export default App;