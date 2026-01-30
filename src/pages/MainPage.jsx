import { useState } from 'react';
import { RankingModal, SettingsModal } from '../components/Modals'; 
import LongTextSelectModal from '../components/LongTextSelectModal'; 
import '../styles/main-layout.css';

function MainPage({ onGameStart, userId, onLogout }) {
  const [selectedLang, setSelectedLang] = useState('Python');
  const [selectedMode, setSelectedMode] = useState('낱말 연습');
  
  // 팝업 상태 관리
  const [showRanking, setShowRanking] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  // [추가] 긴 글 선택창 상태 관리
  const [showTextSelect, setShowTextSelect] = useState(false);

  // [박준우] 각 모드별 설명 데이터 (사용자님 원본 문구 보존)
  const descriptions = {
    '낱말 연습': '프로그래밍 필수 용어를 익히는 기본 단계입니다.\n정확한 타자 실력을 길러보세요.',
    '짧은 글 연습': '자주 쓰이는 함수와 구문을 연습합니다.\n코딩 속도를 한 단계 높여보세요.',
    '긴 글 연습': '실제 프로젝트 코드를 따라 치며 흐름을 익힙니다.\n집중력이 필요한 모드입니다.',
    '미니 게임': '제한 시간 내에 미션을 수행하는 서바이벌 모드입니다.\n당신의 한계에 도전하세요!',
  };

  const modeList = ['낱말 연습', '짧은 글 연습', '긴 글 연습', '미니 게임'];

  // [핵심] 시작 버튼 클릭 핸들러
  const handleStartClick = () => {
    if (selectedMode === '긴 글 연습') {
      setShowTextSelect(true); // 선택창 띄우기
    } else {
      onGameStart(selectedLang, selectedMode);
    }
  };

  return (
    <div className="main-container">
      {/* 1. 상단 헤더 (사용자 정보 및 메뉴) */}
      <header className="top-header">
        <div className="user-info-box">
          <span className="user-icon">👤</span>
          <div>
            <span className="user-name">{userId}</span> 님
            <div style={{ fontSize: '12px', color: '#888' }}>
              {userId === 'Guest' ? '비회원 (기록 저장 불가)' : 'Lv.1 Beginner'}
            </div>
          </div>
        </div>

        <div className="header-buttons">
          <button className="nav-btn" onClick={() => setShowRanking(true)}>🏆 랭킹</button>
          <button className="nav-btn" onClick={() => setShowSettings(true)}>⚙️ 설정</button>
          <button className="nav-btn" onClick={onLogout} style={{borderColor: '#ff5252', color: '#ff5252'}}>
            로그아웃
          </button>
        </div>
      </header>

      {/* 2. 언어 선택 탭 (C, Python, Java) */}
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

      {/* 3. 콘텐츠 바디 (사이드바 + 설명 패널) */}
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

        {/* [박호일, 유민재] 오른쪽 패널: 사용자 요청 수치(500px) 및 중앙 정렬 고정 */}
        <main 
          className="right-description-panel" 
          style={{ 
            height: '500px', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center', 
            alignItems: 'center',
            backgroundColor: '#1a1a1a',
            borderRadius: '15px',
            padding: '40px',
            textAlign: 'center'
          }}
        >
          <h2 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>{selectedMode}</h2>
          <span className="language-tag" style={{ color: '#ffffff', fontWeight: 'bold' }}>
            Selected: {selectedLang}
          </span>
          
          <p style={{ whiteSpace: 'pre-line', marginTop: '20px', fontSize: '1.2rem', color: '#ccc', lineHeight: '1.6' }}>
            {descriptions[selectedMode]}
          </p>
          
          <button 
            className="start-btn"
            style={{
              marginTop: '30px',
              padding: '15px 40px',
              fontSize: '1.5rem',
              backgroundColor: '#1a1a1a',
              border: 'none',
              borderRadius: '30px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
            onClick={handleStartClick} // 수정된 핸들러 연결
          >
            Start
          </button>
        </main>
      </div>

      {/* 팝업 렌더링 영역 */}
      {showRanking && <RankingModal onClose={() => setShowRanking(false)} />}
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
      
      {/* 긴 글 선택 모달 */}
      {showTextSelect && (
        <LongTextSelectModal 
          lang={selectedLang}
          onClose={() => setShowTextSelect(false)}
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