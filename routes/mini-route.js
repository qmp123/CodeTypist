const express = require("express");

const { sendSuccessResponse, sendErrorResponse } = require("../utils/response-utils");
const { loadMiniGameData, normalizeTimeLimitSec, getLevelQuestions } = require("../services/mini-data-service");
const {
  miniSessionStore,
  cleanupExpiredSessions,
  validateLevelNumber,
  validateQuestionSet,
  omitAnswersFromQuestion,
  startMiniGameSession,
  submitMiniGameAnswer,
} = require("../services/mini-game-service");

const router = express.Router(); // router: 미니게임 API 라우터

// startMiniGame: 미니게임 시작(난이도 선택 후 10문제 랜덤 순서 고정)
router.post("/start", (req, res) => {
  cleanupExpiredSessions();

  const language = String(req.body.language || "").toLowerCase(); // language: 언어(c/java/python)
  const levelNumber = validateLevelNumber(req.body.level); // levelNumber: 난이도(1~4)

  if (!language) return sendErrorResponse(res, 400, "language is required");
  if (!levelNumber) return sendErrorResponse(res, 400, "level must be an integer between 1 and 4");

  const miniData = loadMiniGameData(language); // miniData: 언어별 미니 데이터
  if (!miniData) return sendErrorResponse(res, 404, "mini data file not found for this language");

  const timeLimitSec = normalizeTimeLimitSec(miniData); // timeLimitSec: 제한 시간(초)
  const levelQuestions = getLevelQuestions(miniData, levelNumber); // levelQuestions: 레벨 문제 목록

  const validationError = validateQuestionSet(levelNumber, levelQuestions); // validationError: 문제셋 검증 결과
  if (validationError) return sendErrorResponse(res, 500, validationError);

  const session = startMiniGameSession(language, levelNumber, timeLimitSec, levelQuestions); // session: 세션 상태
  const firstQuestion = session.questions[0]; // firstQuestion: 첫 문제

  return sendSuccessResponse(res, {
    session_id: session.session_id,
    time_limit_sec: timeLimitSec,
    total_questions: session.total_questions,
    page: 1,
    question: omitAnswersFromQuestion(firstQuestion),
  });
});

// submitMiniAnswer: 미니게임 한 문제 제출(엔터) -> 다음 문제 or 종료 결과 반환
router.post("/submit", (req, res) => {
  cleanupExpiredSessions();

  const sessionId = String(req.body.session_id || ""); // sessionId: 세션 id
  const pageNumber = Number(req.body.page); // pageNumber: 제출 페이지(1~10)
  const inputs = req.body.inputs; // inputs: 제출 입력 배열

  if (!sessionId) return sendErrorResponse(res, 400, "session_id is required");
  if (!Number.isInteger(pageNumber) || pageNumber < 1) return sendErrorResponse(res, 400, "page must be an integer >= 1");

  const session = miniSessionStore.get(sessionId); // session: 세션 상태
  if (!session) return sendErrorResponse(res, 404, "session not found");

  if (session.finished) {
    return sendSuccessResponse(res, {
      finished: true,
      reason: "already_finished",
      summary: {
        correct_total: session.correct_total,
        wrong_total: session.wrong_total,
        unfilled_total: session.unfilled_total,
        elapsed_ms: Date.now() - session.started_at_ms,
      },
    });
  }

  const result = submitMiniGameAnswer(session, pageNumber, inputs); // result: 제출 처리 결과
  if (result && result.error) return sendErrorResponse(res, 400, result.error);

  return sendSuccessResponse(res, result);
});

module.exports = router;
