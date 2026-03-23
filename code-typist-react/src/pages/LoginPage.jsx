import { useState } from 'react';
import '../styles/login-page.css';

/* LoginPage 컴포넌트

  - Username: 한글, 숫자, 영어
  - ID: 영어, 숫자
  - Password: 영어, 숫자, 특수기호
*/

function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState('');
  const [userPassword, setUserPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // 1. 빈 값 검사

    if (!username.trim() || !userId.trim() || !userPassword.trim()) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    // 2. Username 유효성 검사 (한글, 숫자, 영어만 허용)

    const usernameRegex = /^[a-zA-Z0-9가-힣]+$/;
    if (!usernameRegex.test(username)) {
      alert('사용자 이름(Username)은 한글, 영문, 숫자만 사용 가능합니다.');
      return;
    }

    // 3. 아이디 유효성 검사 (영어, 숫자만 허용)

    const idRegex = /^[a-zA-Z0-9]+$/;
    if (!idRegex.test(userId)) {
      alert('아이디는 영문과 숫자만 사용 가능합니다.');
      return;
    }

    // 4. 비밀번호 유효성 검사 (영어, 숫자, 특수기호 허용)

    const passwordRegex = /^[a-zA-Z0-9!@#$%^&*()_+=-]+$/;
    if (!passwordRegex.test(userPassword)) {
      alert('비밀번호는 영문, 숫자, 특수문자만 사용 가능하며 공백은 허용되지 않습니다.');
      return;
    }

    // 모든 검사 통과 시 로그인 처리

    // 기존 코드 구조에 영향을 주지 않도록 객체 형태로 전달

    onLogin({ userId, username, userPassword });
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
          {/* Username 입력 */}
          <div className="input-group">
            <label className="input-label">Username (한글/영문/숫자)</label>
            <input
              type="text"
              className="login-input"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          {/* 아이디 입력 */}

          <div className="input-group">
            <label className="input-label">ID (영문/숫자)</label>
            <input
              type="text"
              className="login-input"
              placeholder="Enter ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
          </div>

          {/* 비밀번호 입력 */}

          <div className="input-group">
            <label className="input-label">Password (영문/숫자/특수문자)</label>
            <input
              type="password"
              className="login-input"
              placeholder="Enter password"
              value={userPassword}
              onChange={(e) => setUserPassword(e.target.value)}
            />
          </div>

          <div className="button-group">
            <button type="submit" className="login-btn">
              시작하기
            </button>
            <p className="info-text">
              계정이 없다면 입력하신 정보로 자동 가입됩니다.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;