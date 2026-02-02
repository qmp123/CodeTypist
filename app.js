import express from "express";
import cors from "cors";

import quizRouter from "./routes/quiz.js";
import typingRouter from "./routes/typing.js";

const app = express();

// =====================
// 공통 미들웨어
// =====================

// CORS 설정 (프론트엔드 연동 허용)
app.use(cors());

// JSON 요청 파싱
app.use(express.json());

// =====================
// API 라우터 연결
// =====================

// 퀴즈 미니게임 API
app.use("/api/quiz", quizRouter);

// 타자 미니게임 API
// (내부에서 apiAuth로 접근 제어함)
app.use("/api/typing", typingRouter);

// =====================
// 잘못된 API 요청 처리
// =====================
app.use((req, res) => {
  res.status(404).json({
    message: "존재하지 않는 API입니다."
  });
});

// =====================
// 서버 예외 상황 처리
// =====================
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "서버 오류 발생"
  });
});

// =====================
// 서버 실행
// =====================
app.listen(3000, () => {
  console.log("서버 실행 중");
});
