import { useState } from 'react';
import '../styles/login-page.css';

/* LoginPage 컴포넌트 
  - username, id, password 입력 방식
  - 기존 회원인 경우 로그인, 신규인 경우 자동 회원가입 로직 예정
*/
function LoginPage({ onLogin }) {
  const [username, setUsername] = useState(''); // nickname -> username으로 변경
  const [userId, setUserId] = useState('');
  const [userPassword, setUserPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // 유효성 검사
    if (!username.trim() || !userId.trim() || !userPassword.trim()) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    /* 추후 API 연동 로직 예시:
      const response = await api.post('/auth/login-or-signup', { username, userId, userPassword });
      if (response.success) { onLogin(response.data); }
    */
    
    // 현재는 바로 로그인 처리 (아이디와 유저네임 전달)
    onLogin({ userId, username }); // nickname 키값을 username으로 변경
  };

  return (
    <div className="login-container">
      {/* 왼쪽 소개 패널 */}
      <div className="intro-panel">
        <h1>⌨️ Code Typist</h1>
        <p>
          개발자를 위한 최고의 타자 연습.<br />
          필수 문법부터 실전 코드까지,<br />
          지금 바로 시작하세요.
        </p>
      </div>

      {/* 오른쪽 로그인/회원가입 폼 패널 */}
      <div className="form-panel">
        <h2 className="form-title">Code Typist</h2>
        
        <form onSubmit={handleSubmit}>
          {/* 1. 유저네임 (Username) */}
          <div className="input-group">
            <label className="input-label">UserName</label>
            <input
              type="text"
              className="login-input"
              placeholder="Enter your UserName"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          {/* 2. 아이디 */}
          <div className="input-group">
            <label className="input-label">ID</label>
            <input
              type="text"
              className="login-input"
              placeholder="Enter your ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
            />
          </div>

          {/* 3. 비밀번호 */}
          <div className="input-group">
            <label className="input-label">Password</label>
            <input
              type="password"
              className="login-input"
              placeholder="Enter your password"
              value={userPassword}
              onChange={(e) => setUserPassword(e.target.value)}
              required
            />
          </div>

          <div className="button-group">
            <button type="submit" className="login-btn">
              로그인
            </button>
            <p className="info-text">
              이미 계정이 있다면 로그인되고, 처음이라면 자동으로 가입됩니다.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;