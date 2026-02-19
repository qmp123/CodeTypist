import '../styles/modal.css';

/* 랭킹 팝업 컴포넌트 */
export function RankingModal({ onClose }) {
  // 가짜 랭킹 데이터 (나중에 백엔드 생기면 교체)
  const rankings = [
    { rank: 1, name: 'Faker', score: 2500 },
    { rank: 2, name: 'Oner', score: 2350 },
    { rank: 3, name: 'Keria', score: 2100 },
    { rank: 4, name: 'Doran', score: 1950 },
    { rank: 5, name: 'Guest', score: 1200 }, // 내 점수 예시
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>&times;</button>
        <h2 className="modal-title">🏆 Top Ranking</h2>
        
        <ul className="ranking-list">
          {rankings.map((user) => (
            <li key={user.rank} className="ranking-item">
              <span className="rank-badge">{user.rank}위</span>
              <span>{user.name}</span>
              <span style={{ color: '#bb86fc' }}>{user.score}점</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* 설정 팝업 컴포넌트 */
export function SettingsModal({ onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>&times;</button>
        <h2 className="modal-title">⚙️ Settings</h2>

        <div className="setting-box">
          {/* 폰트 크기 설정 */}
          <div className="setting-item">
            <span>Font Size</span>
            <select className="setting-select">
              <option>Small (16px)</option>
              <option>Medium (20px)</option>
              <option>Large (24px)</option>
            </select>
          </div>

          {/* 언어 설정 */}
          <div className="setting-item">
            <span>System Language</span>
            <select className="setting-select">
              <option>Korean</option>
              <option>English</option>
            </select>
          </div>

          {/* 소리 설정 */}
          <div className="setting-item">
            <span>Sound Effect</span>
            <select className="setting-select">
              <option>ON</option>
              <option>OFF</option>
            </select>
          </div>
        </div>
        
        <p style={{ color: '#666', marginTop: '20px', fontSize: '14px' }}>
          * 설정은 자동으로 저장됩니다.
        </p>
      </div>
    </div>
  );
}