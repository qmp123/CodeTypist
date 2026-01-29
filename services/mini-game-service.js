const crypto = require("crypto");

const miniSessionStore = new Map(); // miniSessionStore: 세션 저장소(메모리)

// validateLevelNumber: 난이도(1~4) 검증
function validateLevelNumber(levelValue) {
  const levelNumber = Number(levelValue); // levelNumber: 난이도 숫자
  if (!Number.isInteger(levelNumber) || levelNumber < 1 || levelNumber > 4) return null;
  return levelNumber;
}

// shuffleArray: 배열을 랜덤 셔플(Fisher-Yates)
function shuffleArray(items) {
  const array = items.slice(); // array: 복사본
  for (let i = array.length - 1; i > 0; i -= 1) {
    const randomIndex = Math.floor(Math.random() * (i + 1)); // randomIndex: 스왑 인덱스
    const temp = array[i]; // temp: 임시 저장
    array[i] = array[randomIndex];
    array[randomIndex] = temp;
  }
  return array;
}

// createSessionId: 세션 id 생성
function createSessionId() {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
  return crypto.randomBytes(16).toString("hex");
}

// omitAnswersFromQuestion: 프론트로 보낼 때 정답 제거
function omitAnswersFromQuestion(question) {
  return {
    question_id: question.question_id,
    title: question.title,
    lines: question.lines,
    blank_count: question.blanks.length,
  };
}

// computeElapsedMs: 서버 기준 경과 시간(ms) 계산
function computeElapsedMs(startedAtMs) {
  const nowMs = Date.now(); // nowMs: 현재 시각(ms)
  return Math.max(0, nowMs - startedAtMs);
}

// computeRemainTimeMs: 남은 시간(ms) 계산
function computeRemainTimeMs(timeLimitSec, elapsedMs) {
  const totalMs = timeLimitSec * 1000; // totalMs: 총 제한 시간(ms)
  return Math.max(0, totalMs - elapsedMs);
}

// evaluateInputs: 제출 입력값을 정답과 비교하여 채점
function evaluateInputs(question, inputs) {
  const inputMap = new Map(); // inputMap: blank_no -> value

  (Array.isArray(inputs) ? inputs : []).forEach((item) => {
    const blankNo = Number(item.blank_no ?? item.blankNo ?? item.index); // blankNo: 제출 빈칸 번호
    const value = String(item.value ?? ""); // value: 제출 값
    if (Number.isInteger(blankNo) && blankNo >= 1) inputMap.set(blankNo, value);
  });

  let correctCount = 0; // correctCount: 정답 개수
  let wrongCount = 0; // wrongCount: 오답 개수
  let unfilledCount = 0; // unfilledCount: 미작성 개수

  question.blanks.forEach((blank) => {
    const submittedValue = inputMap.has(blank.blank_no) ? String(inputMap.get(blank.blank_no)) : ""; // submittedValue: 제출 문자열
    const trimmed = submittedValue.trim(); // trimmed: 공백 제거 값

    if (!trimmed) {
      unfilledCount += 1;
      return;
    }

    const isCorrect = trimmed === String(blank.answer).trim(); // isCorrect: 정답 여부
    if (isCorrect) correctCount += 1;
    else wrongCount += 1;
  });

  return { correct_count: correctCount, wrong_count: wrongCount, unfilled_count: unfilledCount };
}

// validateQuestionSet: 문제셋이 스펙을 충족하는지 최소 검증
function validateQuestionSet(levelNumber, questions) {
  const expectedBlankCountByLevel = { 1: 1, 2: 2, 3: 3, 4: 3 }; // expectedBlankCountByLevel: 난이도별 빈칸 수
  const expectedBlankCount = expectedBlankCountByLevel[levelNumber]; // expectedBlankCount: 기대 빈칸 수

  const hasTenQuestions = questions.length >= 10; // hasTenQuestions: 문제 10개 이상 여부
  if (!hasTenQuestions) return "not enough questions for this level (need at least 10)";

  const firstTen = questions.slice(0, 10); // firstTen: 사용할 10문제
  const invalidBlank = firstTen.some((question) => question.blanks.length !== expectedBlankCount); // invalidBlank: 빈칸 수 불일치
  if (invalidBlank) return `blank count mismatch for level ${levelNumber}`;

  const invalidLines = firstTen.some((question) => question.lines.length < 9 || question.lines.length > 10); // invalidLines: 줄 수 불일치
  if (invalidLines) return "each question must have 9~10 lines";

  return null;
}

// cleanupExpiredSessions: 오래된 세션 정리(간단 버전)
function cleanupExpiredSessions() {
  const nowMs = Date.now(); // nowMs: 현재 시간(ms)
  const expireMs = 10 * 60 * 1000; // expireMs: 세션 만료 기준(10분)

  for (const [sessionId, session] of miniSessionStore.entries()) {
    const ageMs = nowMs - session.created_at_ms; // ageMs: 세션 생성 후 경과
    if (ageMs > expireMs) miniSessionStore.delete(sessionId);
  }
}

// startMiniGameSession: 세션 시작(10문제 랜덤 고정)
function startMiniGameSession(language, levelNumber, timeLimitSec, questions) {
  const shuffled = shuffleArray(questions).slice(0, 10); // shuffled: 사용할 10문제(랜덤)
  const sessionId = createSessionId(); // sessionId: 세션 id
  const startedAtMs = Date.now(); // startedAtMs: 시작 시각(ms)

  const session = {
    session_id: sessionId,
    language,
    level: levelNumber,
    time_limit_sec: timeLimitSec,
    started_at_ms: startedAtMs,
    created_at_ms: startedAtMs,
    questions: shuffled,
    current_index: 0,
    total_questions: 10,
    correct_total: 0,
    wrong_total: 0,
    unfilled_total: 0,
    finished: false,
  }; // session: 세션 상태

  miniSessionStore.set(sessionId, session);
  return session;
}

// createFinishedPayload: 종료 응답 payload 생성
function createFinishedPayload(session, reason, lastResult, elapsedMsOverride) {
  const elapsedMs = Number.isFinite(elapsedMsOverride) ? elapsedMsOverride : computeElapsedMs(session.started_at_ms); // elapsedMs: 걸린 시간(ms)
  const payload = {
    finished: true,
    reason,
    summary: {
      correct_total: session.correct_total,
      wrong_total: session.wrong_total,
      unfilled_total: session.unfilled_total,
      elapsed_ms: elapsedMs,
    },
  }; // payload: 종료 응답

  if (lastResult) payload.last_result = lastResult;
  return payload;
}

// submitMiniGameAnswer: 제출 처리(다음 문제 또는 종료)
function submitMiniGameAnswer(session, pageNumber, inputs) {
  const expectedPage = session.current_index + 1; // expectedPage: 서버가 기대하는 페이지
  if (pageNumber !== expectedPage) return { error: "page mismatch" };

  const elapsedMs = computeElapsedMs(session.started_at_ms); // elapsedMs: 경과 시간(ms)
  const remainTimeMs = computeRemainTimeMs(session.time_limit_sec, elapsedMs); // remainTimeMs: 남은 시간(ms)
  if (remainTimeMs <= 0) {
    session.finished = true;
    return createFinishedPayload(session, "time_over", null, session.time_limit_sec * 1000);
  }

  const currentQuestion = session.questions[session.current_index]; // currentQuestion: 현재 문제
  const lastResult = evaluateInputs(currentQuestion, inputs); // lastResult: 채점 결과

  session.correct_total += lastResult.correct_count;
  session.wrong_total += lastResult.wrong_count;
  session.unfilled_total += lastResult.unfilled_count;
  session.current_index += 1;

  const nextIndex = session.current_index; // nextIndex: 다음 문제 인덱스
  const isCompleted = nextIndex >= session.total_questions; // isCompleted: 완료 여부

  const newElapsedMs = computeElapsedMs(session.started_at_ms); // newElapsedMs: 갱신 경과(ms)
  const newRemainTimeMs = computeRemainTimeMs(session.time_limit_sec, newElapsedMs); // newRemainTimeMs: 갱신 남은(ms)

  if (newRemainTimeMs <= 0) {
    session.finished = true;
    return createFinishedPayload(session, "time_over", lastResult, session.time_limit_sec * 1000);
  }

  if (isCompleted) {
    session.finished = true;
    return createFinishedPayload(session, "completed", lastResult, newElapsedMs);
  }

  const nextQuestion = session.questions[nextIndex]; // nextQuestion: 다음 문제
  return {
    finished: false,
    page: nextIndex + 1,
    total_questions: session.total_questions,
    remain_time_ms: newRemainTimeMs,
    last_result: lastResult,
    question: omitAnswersFromQuestion(nextQuestion),
  };
}

module.exports = {
  miniSessionStore,
  cleanupExpiredSessions,
  validateLevelNumber,
  validateQuestionSet,
  omitAnswersFromQuestion,
  startMiniGameSession,
  submitMiniGameAnswer,
};
