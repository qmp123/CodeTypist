import { tokens } from "../routes/auth.js";

/*
 로그인 여부 확인 미들웨어
*/
export default function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  // 토큰 없음 → 접근 제어
  if (!authHeader) {
    return res.status(401).json({
      message: "로그인이 필요합니다."
    });
  }

  const token = authHeader.replace("Bearer ", "");

  // 유효하지 않은 토큰
  if (!tokens[token]) {
    return res.status(401).json({
      message: "유효하지 않은 토큰입니다."
    });
  }

  // 통과
  next();
}
