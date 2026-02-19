import { useState } from 'react';
import '../styles/login-page.css';

/* 로그인 페이지 컴포넌트 (LoginPage)
  - 다크 모드 디자인 적용
  - 비회원(Guest) 로그인 시 랭킹 기능 제한 안내 문구 추가
*/
function LoginPage({ onLogin }) {
  const [userId, setUserId] = useState(''); 
  const [userPassword, setUserPassword] = useState(''); 

  /* 일반 로그인 핸들러 */
  const handleLogin = (e) => {
    e.preventDefault(); 
    if (!userId.trim()) {
      alert('아이디를 입력해주세요.'); 
      return;
    }
    onLogin(userId); 
  };

  /* 비회원 로그인 핸들러 */
  const handleGuestLogin = () => {
    onLogin('Guest'); 
  };

  return (
    <div className="login-container">
      {/* 1. 왼쪽: 소개 패널 */}
      <div className="intro-panel">
        <h1>⌨️ Code Typist</h1>
        <p>
          개발자를 위한 최고의 타자 연습.<br />
          필수 문법부터 실전 코드까지,<br />
          지금 바로 시작하세요.
        </p>
      </div>

      {/* 2. 오른쪽: 로그인 폼 패널 */}
      <div className="form-panel">
        <h2 className="form-title">Login</h2>
        
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label className="input-label">ID</label>
            <input
              type="text"
              className="login-input"
              placeholder="Enter your ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label className="input-label">Password</label>
            <input
              type="password"
              className="login-input"
              placeholder="Enter your Password"
              value={userPassword}
              onChange={(e) => setUserPassword(e.target.value)}
            />
          </div>

          <div className="button-group">
            <button type="submit" className="login-btn">
              로그인
            </button>

            <div className="sub-actions">
              <button type="button" className="sub-btn">회원가입</button>
              
              {/* [수정] 버튼 이름 변경: 비회원 */}
              <button 
                type="button" 
                className="sub-btn"
                onClick={handleGuestLogin}
              >
                비회원
              </button>
            </div>
            
            {/* [추가] 비회원 제한사항 안내 문구 */}
            <p className="guest-notice">
              * 비회원은 <strong>랭크 시스템</strong>을 사용할 수 없습니다.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;