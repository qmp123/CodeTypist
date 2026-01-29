const express = require("express");
const app = express(); // app: express 애플리케이션 인스턴스

const { sendSuccessResponse, sendErrorResponse } = require("./utils/response-utils"); // responseUtils: 응답 유틸
const practiceRouter = require("./routes/practice-route"); // practiceRouter: 연습 API 라우터
const miniRouter = require("./routes/mini-route"); // miniRouter: 미니게임 API 라우터

const defaultPort = 3000; // defaultPort: 기본 포트
const serverPort = Number.isFinite(Number(process.env.PORT)) ? Number(process.env.PORT) : defaultPort; // serverPort: 서버 포트

app.use(express.json({ limit: "256kb" })); // jsonBodyParser: JSON 요청 바디 파서(용량 제한)

// getHealth: 서버 상태 체크 엔드포인트
app.get("/api/health", (req, res) => {
  return sendSuccessResponse(res, { status: "ok", service: "codetypist" });
});

// usePracticeRoutes: 연습 API 라우팅 연결
app.use("/api/practice", practiceRouter);

// useMiniRoutes: 미니게임 API 라우팅 연결
app.use("/api/mini", miniRouter);

// handleNotFound: 404 처리(잘못된 API 주소 접근 시)
app.use((req, res) => {
  return sendErrorResponse(res, 404, "api not found");
});

// handleGlobalError: 전역 에러 처리(서버 내부 에러)
app.use((err, req, res, next) => {
  console.error(err); // serverErrorLog: 서버 에러 로그
  if (res.headersSent) return next(err);
  return sendErrorResponse(res, 500, "internal server error");
});

// startServer: 서버 실행
app.listen(serverPort, () => {
  console.log(`✅ Server running: http://localhost:${serverPort}`); // serverStartLog: 서버 시작 로그
});
