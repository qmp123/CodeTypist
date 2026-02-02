import express from "express";
import { apiAuth } from "../middleware/auth.js"; 
// 👆 기존 auth.js 그대로 사용

const router = express.Router();

/*
 서버 메모리 랭킹 (과제용)
*/
const rankings = [];

/*
 점수 계산 함수
 - 서버에서만 계산 → 점수 조작 방지
*/
function calculateScore(speed, accuracy) {
  return Math.floor(speed * accuracy);
}

/*
 [POST] /api/typing/result
 - apiAuth 미들웨어로 접근 제어
*/
router.post("/result", apiAuth, (req, res) => {
  const { typedLength, elapsedTime, accuracy, nickname } = req.body;

  /*
   잘못된 요청 처리 (400)
  */
  if (!typedLength || !elapsedTime || !accuracy || !nickname) {
    return res.status(400).json({
      message: "잘못된 요청입니다."
    });
  }

  /*
   타자 속도 조작 방지
   - 비정상적으로 빠른 입력 차단
  */
  const speedPerSec = typedLength / elapsedTime;

  if (elapsedTime <= 0 || speedPerSec > 20) {
    return res.status(400).json({
      message: "비정상적인 타자 속도 감지"
    });
  }

  /*
   서버에서 타자 속도 계산
  */
  const speed = Math.floor(speedPerSec * 60);

  /*
   서버에서 점수 계산
  */
  const score = calculateScore(speed, accuracy);

  /*
   랭킹 조작 방지
   - 서버에서만 정렬/관리
  */
  rankings.push({ nickname, score });
  rankings.sort((a, b) => b.score - a.score);
  rankings.splice(10);

  res.json({
    speed,
    score,
    rankings
  });
});

export default router;
