import { useState, useEffect } from 'react';
import { RankingModal, SettingsModal } from '../components/Modals'; 
import LongTextSelectModal from '../components/LongTextSelectModal'; 
import '../styles/main-layout.css';

/* MainPage 컴포넌트
  - 민재 님의 원본 레이아웃 및 폰트 스케일링 100% 보존
  - 사용자 정보 표시: '회원/비회원' 상태 메시지 제거, 이름만 표시로 수정
  - theme, onThemeToggle을 받아 설정창과 랭킹창에 전달
*/

function MainPage({ onGameStart, userId, onLogout, autoOpenModal, onModalOpened, theme, onThemeToggle }) {
  const [selectedLang, setSelectedLang] = useState('Python');
  const [selectedMode, setSelectedMode] = useState('낱말 연습');
  
  const [showRanking, setShowRanking] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showTextSelect, setShowTextSelect] = useState(false);

  // 🚀 [원본 유지] 모든 상태 업데이트를 브라우저의 다음 이벤트 루프로 미룹니다
  useEffect(() => {
    if (autoOpenModal) {
      const timer = setTimeout(() => {
        setShowTextSelect(true);
        setSelectedMode('긴 글 연습');
        if (onModalOpened) onModalOpened();
      }, 0);
      
      return () => clearTimeout(timer);
    }
  }, [autoOpenModal, onModalOpened]);

  const descriptions = {
    '낱말 연습': '프로그래밍 필수 용어를 익히는 기본 단계입니다.\n정확한 타자 실력을 길러보세요.',
    '짧은 글 연습': '자주 쓰이는 함수와 구문을 연습합니다.\n코딩 속도를 한 단계 높여보세요.',
    '긴 글 연습': '실제 프로젝트 코드를 따라 치며 흐름을 익힙니다.\n집중력이 필요한 모드입니다.',
    '미니 게임': '제한 시간 내에 미션을 수행하는 서바이벌 모드입니다.\n당신의 한계에 도전하세요!',
  };

  const modeList = ['낱말 연습', '짧은 글 연습', '긴 글 연습', '미니 게임'];

  const handleStartClick = () => {
    if (selectedMode === '긴 글 연습') {
      setShowTextSelect(true);
    } else {
      onGameStart(selectedLang, selectedMode);
    }
  };

  return (
    <div className="main-container">
      <header className="top-header">
        <div className="user-info-box">
          <span className="user-icon">👤</span>
          <div className="user-details">
            {/* 🚀 회원 전용 페이지이므로 상태 메시지는 삭제하고 이름만 깔끔하게 표시 */}
            <span className="user-name">{userId}</span> 님
          </div>
        </div>
        <div className="header-buttons">
          <button className="nav-btn" onClick={() => setShowRanking(true)}>🏆 랭킹</button>
          <button className="nav-btn" onClick={() => setShowSettings(true)}>⚙️ 설정</button>
          <button className="nav-btn logout-highlight" onClick={onLogout}>로그아웃</button>
        </div>
      </header>

      <nav className="lang-tabs">
        {['C', 'Python', 'Java'].map((lang) => (
          <button
            key={lang}
            className={`tab-btn ${selectedLang === lang ? 'active' : ''}`}
            onClick={() => setSelectedLang(lang)}
          >
            {lang}
          </button>
        ))}
      </nav>

      <div className="content-body">
        <aside className="left-sidebar">
          {modeList.map((mode) => (
            <button
              key={mode}
              className={`mode-btn ${selectedMode === mode ? 'active' : ''}`}
              onClick={() => setSelectedMode(mode)}
            >
              {mode}
            </button>
          ))}
        </aside>
        <main className="right-description-panel">
          <h2 className="description-title">{selectedMode}</h2>
          <span className="language-tag">Selected: {selectedLang}</span>
          <p className="description-text">{descriptions[selectedMode]}</p>
          <button className="start-btn" onClick={handleStartClick}>Start</button>
        </main>
      </div>

      {/* 🚀 각 모달에 테마 정보를 전달하여 모달 속까지 세트로 변하게 합니다 */}
      {showRanking && <RankingModal onClose={() => setShowRanking(false)} theme={theme} />}
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} theme={theme} onThemeToggle={onThemeToggle} />}
      {showTextSelect && (
        <LongTextSelectModal 
          lang={selectedLang}
          onClose={() => setShowTextSelect(false)}
          theme={theme}
          onSelect={(textId) => {
            setShowTextSelect(false);
            onGameStart(selectedLang, selectedMode, textId); 
          }}
        />
      )}
    </div>
  );
}

export default MainPage;