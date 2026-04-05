import { useState } from 'react';
import '../styles/login-page.css';
// 🚀 [수정] PNG 이미지 임포트 추가 (경로 확인 필수)
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

    const usernameRegex = /^[a-zA-Z0-9가-힣]+$/;
    if (!usernameRegex.test(username)) {
      alert('사용자 이름(Username)은 한글, 영문, 숫자만 사용 가능합니다.');
      return;
    }

    const idRegex = /^[a-zA-Z0-9]+$/;
    if (!idRegex.test(userId)) {
      alert('아이디는 영문과 숫자만 사용 가능합니다.');
      return;
    }

    const passwordRegex = /^[a-zA-Z0-9!@#$%^&*()_+=-]+$/;
    if (!passwordRegex.test(userPassword)) {
      alert('비밀번호는 영문, 숫자, 특수문자만 사용 가능하며 공백은 허용되지 않습니다.');
      return;
    }

    onLogin({ userId, username, userPassword });
  };

  return (
    <div className="login-container" style={{ display: 'flex', width: '1000px', height: '600px', padding: '0', overflow: 'hidden' }}>
      
      <div className="intro-panel" style={{ flex: 1, background: '#4c00e6', color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '40px' }}>
        <div style={{ fontSize: '3rem', marginBottom: '20px' }}>⌨️</div>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '15px' }}>Code Typist</h1>
        <p style={{ textAlign: 'center', lineHeight: '1.6', opacity: 0.9 }}>
          개발자를 위한 최고의 타자 연습.<br />
          필수 문법부터 실전 코드까지,<br />
          지금 바로 시작하세요.
        </p>
      </div>

      <div className="form-panel" style={{ flex: 1, backgroundColor: 'var(--bg-card)', padding: '60px', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative' }}>
        
        {/* 🌞 로그인 페이지 테마 토글 (설정창과 완벽하게 80px로 통일) */}
        <div style={{ position: 'absolute', top: '25px', right: '25px' }}>
          <div className={`theme-toggle-switch ${theme}`} onClick={onThemeToggle}>
            <div className="toggle-icons" style={{ width: '100%', display: 'flex', justifyContent: 'space-between', padding: '0 8px', boxSizing: 'border-box', alignItems: 'center' }}>
              {/* 🚀 배경 해: 이제 정상적으로 PNG 이미지를 불러옵니다. */}
              <img src={VividSunImage} alt="sun" style={{ width: '20px', height: '20px', opacity: 0.4, background: 'transparent', display: 'block' }} />
              <span style={{ fontSize: '16px', opacity: 0.4 }}>🌙</span>
            </div>
            
            <div className="toggle-thumb">
              {/* 🚀 썸 내부: 설정창과 동일하게 24px 크기의 PNG 해 이미지 적용 */}
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
            <label className="input-label" style={{ color: 'var(--text-sub)', fontSize: '0.9rem', marginBottom: '8px', display: 'block' }}>Username (한글/영문/숫자)</label>
            <input
              type="text"
              className="login-input"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ width: '100%', padding: '15px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-sub)', color: 'var(--text-main)' }}
            />
          </div>

          <div className="input-group">
            <label className="input-label" style={{ color: 'var(--text-sub)', fontSize: '0.9rem', marginBottom: '8px', display: 'block' }}>ID (영문/숫자)</label>
            <input
              type="text"
              className="login-input"
              placeholder="Enter ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              style={{ width: '100%', padding: '15px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-sub)', color: 'var(--text-main)' }}
            />
          </div>

          <div className="input-group">
            <label className="input-label" style={{ color: 'var(--text-sub)', fontSize: '0.9rem', marginBottom: '8px', display: 'block' }}>Password (영문/숫자/특수문자)</label>
            <input
              type="password"
              className="login-input"
              placeholder="Enter password"
              value={userPassword}
              onChange={(e) => setUserPassword(e.target.value)}
              style={{ width: '100%', padding: '15px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-sub)', color: 'var(--text-main)' }}
            />
          </div>

          <button type="submit" className="login-btn" style={{ background: '#7c4dff', color: '#fff', padding: '18px', borderRadius: '10px', border: 'none', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px', fontSize: '1.1rem' }}>
            시작하기
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;