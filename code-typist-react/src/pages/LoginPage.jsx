import { useState } from 'react';
import '../styles/login-page.css';
// 🚀 [보존] PNG 이미지 임포트 경로 유지
import VividSunImage from './VividSunImage.png';

function LoginPage({ onLogin, theme, onThemeToggle }) {
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState('');
  const [userPassword, setUserPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!username.trim() || !userId.trim() || !userPassword.trim()) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    // 🚀 [보존] 재환님 요청 정규식 반영: 1자 ~ 10자 영문, 숫자, 한글 검사
    const usernameRegex = /^[A-Za-z0-9가-힣]{1,10}$/;
    if (!usernameRegex.test(username)) {
      alert('사용자 이름(Username)은 1자 ~ 10자의 영문, 숫자, 한글만 허용되며 특수문자는 불가능합니다.');
      return;
    }

    // 🚀 [보존] 재환님 요청 정규식 반영: 6자 ~ 18자 영문 대소문자, 숫자 검사
    const idRegex = /^[A-Za-z0-9]{6,18}$/;
    if (!idRegex.test(userId)) {
      alert('아이디(User ID)는 6자 ~ 18자의 영문 대소문자, 숫자만 허용됩니다.');
      return;
    }

    // 🚀 [보존] 비밀번호 정규식 유지
    const passwordRegex = /^[a-zA-Z0-9!@#$%^&*()_+=-]+$/;
    if (!passwordRegex.test(userPassword)) {
      alert('비밀번호는 영문, 숫자, 특수문자만 사용 가능하며 공백은 허용되지 않습니다.');
      return;
    }

    onLogin({ userId, username, userPassword });
  };

  return (
    <div className="login-container" style={{ display: 'flex', width: '1000px', height: '600px', padding: '0', overflow: 'hidden' }}>
      
      <div className="intro-panel" style={{ flex: 1, background: 'var(--bg-sub)', color: 'var(--text-main)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '40px' }}>
        <div style={{ fontSize: '3rem', marginBottom: '20px' }}>⌨️</div>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '15px' }}>Code Typist</h1>
        {/* 🚀 [교정] 소개 글씨를 흐릿한 sub 대신 main 컬러로 변경하고 fontWeight를 600으로 높여 더 진하게 처리 */}
        <p style={{ textAlign: 'center', lineHeight: '1.6', fontWeight: '600', color: 'var(--text-main)' }}>
          개발자를 위한 최고의 타자 연습.<br />
          필수 문법부터 실전 코드까지,<br />
          지금 바로 시작하세요.
        </p>
      </div>

      <div className="form-panel" style={{ flex: 1, backgroundColor: 'var(--bg-card)', padding: '60px', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative' }}>
        
        {/* 🌞 로그인 페이지 테마 토글 스위치 영역 (기존 스타일 보존) */}
        <div style={{ position: 'absolute', top: '25px', right: '25px' }}>
          <div className={`theme-toggle-switch ${theme}`} onClick={onThemeToggle}>
            <div className="toggle-icons" style={{ width: '100%', display: 'flex', justifyContent: 'space-between', padding: '0 8px', boxSizing: 'border-box', alignItems: 'center' }}>
              <img src={VividSunImage} alt="sun" style={{ width: '20px', height: '20px', opacity: 0.4, background: 'transparent', display: 'block' }} />
              <span style={{ fontSize: '16px', opacity: 0.4 }}>🌙</span>
            </div>
            
            <div className="toggle-thumb">
              {theme === 'light' ? (
                <img src={VividSunImage} alt="sun" style={{ width: '24px', height: '24px', background: 'transparent', display: 'block' }} />
              ) : (
                <span style={{ fontSize: '18px' }}>🌙</span>
              )}
            </div>
          </div>
        </div>

        <h2 className="form-title" style={{ textAlign: 'center', marginBottom: '40px', color: 'var(--text-main)', fontSize: '1.8rem' }}>Code Typist</h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="input-group">
            {/* 🚀 [교정] 라벨 글자색을 var(--text-main)으로 변경 및 두께를 600으로 올려 가독성 대폭 향상 */}
            <label className="input-label" style={{ color: 'var(--text-main)', fontSize: '0.9rem', marginBottom: '8px', display: 'block', fontWeight: '600' }}>Username (한글/영문/숫자, 1~10자)</label>
            <input
              type="text"
              className="login-input"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              maxLength={10} 
              style={{ width: '100%', padding: '15px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-sub)', color: 'var(--text-main)' }}
            />
          </div>

          <div className="input-group">
            {/* 🚀 [교정] 라벨 글자색을 var(--text-main)으로 변경 및 두께를 600으로 올려 가독성 대폭 향상 */}
            <label className="input-label" style={{ color: 'var(--text-main)', fontSize: '0.9rem', marginBottom: '8px', display: 'block', fontWeight: '600' }}>ID (영문/숫자, 6~18자)</label>
            <input
              type="text"
              className="login-input"
              placeholder="Enter ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              maxLength={18} 
              style={{ width: '100%', padding: '15px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-sub)', color: 'var(--text-main)' }}
            />
          </div>

          <div className="input-group">
            {/* 🚀 [교정] 라벨 글자색을 var(--text-main)으로 변경 및 두께를 600으로 올려 가독성 대폭 향상 */}
            <label className="input-label" style={{ color: 'var(--text-main)', fontSize: '0.9rem', marginBottom: '8px', display: 'block', fontWeight: '600' }}>Password (영문/숫자/특수문자)</label>
            <input
              type="password"
              className="login-input"
              placeholder="Enter password"
              value={userPassword}
              onChange={(e) => setUserPassword(e.target.value)}
              style={{ width: '100%', padding: '15px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-sub)', color: 'var(--text-main)' }}
            />
          </div>

          <button type="submit" className="login-btn" style={{ background: 'var(--point-color)', color: 'var(--bg-card)', padding: '18px', borderRadius: '10px', border: 'none', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px', fontSize: '1.1rem' }}>
            시작하기
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;