const express = require("express");
const cors = require("cors");
const app = express();

const { sendSuccessResponse, sendErrorResponse } = require("./utils/response-utils");

const practiceRouter = require("./routes/practice-route");
const miniRouter = require("./routes/mini-route");

const defaultPort = 5000;

const serverPort =
  Number.isFinite(Number(process.env.PORT))
    ? Number(process.env.PORT)
    : defaultPort;

// CORS 설정
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "256kb" }));

// 서버 상태 확인 API
app.get("/api/health", (req, res) => {
  return sendSuccessResponse(res, {
    status: "ok",
    service: "codetypist",
  });
});

// 연습 API
app.use("/api/practice", practiceRouter);

// 미니게임 API
app.use("/api/mini", miniRouter);

// 404 처리
app.use((req, res) => {
  return sendErrorResponse(res, 404, "api not found");
});

// 서버 에러 처리
app.use((err, req, res, next) => {
  console.error(err);

  if (res.headersSent) {
    return next(err);
  }

  return sendErrorResponse(res, 500, "internal server error");
});

// 서버 실행
app.listen(serverPort, "0.0.0.0", () => {
  console.log(`✅ Server running`);
});
