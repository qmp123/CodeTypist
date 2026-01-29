const fs = require("fs");
const path = require("path");

const miniDataCache = new Map(); // miniDataCache: 언어별 미니게임 데이터 캐시

// getMiniDataFilePath: 언어에 맞는 mini-*.json 경로 생성
function getMiniDataFilePath(language) {
  const safeLanguage = String(language || "").toLowerCase(); // safeLanguage: 소문자 언어 키
  return path.join(__dirname, "..", "data", `mini-${safeLanguage}.json`);
}

// loadMiniGameData: 언어별 미니게임 데이터 로드(캐시 포함)
function loadMiniGameData(language) {
  const cacheKey = String(language || "").toLowerCase(); // cacheKey: 캐시 키(언어)
  if (miniDataCache.has(cacheKey)) return miniDataCache.get(cacheKey);

  const filePath = getMiniDataFilePath(cacheKey); // filePath: 데이터 파일 경로
  if (!fs.existsSync(filePath)) return null;

  const fileText = fs.readFileSync(filePath, "utf-8"); // fileText: 파일 원문
  const parsed = JSON.parse(fileText); // parsed: JSON 파싱 결과

  miniDataCache.set(cacheKey, parsed);
  return parsed;
}

// normalizeTimeLimitSec: time_limit_sec / timeLimitSec 둘 다 지원
function normalizeTimeLimitSec(rawData) {
  const timeLimitSec = Number(rawData.time_limit_sec ?? rawData.timeLimitSec ?? 60); // timeLimitSec: 제한 시간(초)
  if (!Number.isFinite(timeLimitSec) || timeLimitSec <= 0) return 60;
  return Math.floor(timeLimitSec);
}

// normalizeBlanks: blanks의 index/blank_no 둘 다 지원 + 값 정리
function normalizeBlanks(rawBlanks) {
  const blanks = Array.isArray(rawBlanks) ? rawBlanks : []; // blanks: 빈칸 배열
  return blanks
    .map((blank) => {
      const blankNo = Number(blank.blank_no ?? blank.blankNo ?? blank.index); // blankNo: __1__ 번호
      const answer = String(blank.answer ?? ""); // answer: 정답 문자열
      if (!Number.isInteger(blankNo) || blankNo < 1) return null;
      return { blank_no: blankNo, answer };
    })
    .filter(Boolean);
}

// normalizeQuestion: 문제 객체를 통일된 내부 구조로 변환
function normalizeQuestion(rawQuestion) {
  const questionId = String(rawQuestion.question_id ?? rawQuestion.id ?? ""); // questionId: 문제 id
  const title = String(rawQuestion.title ?? ""); // title: 문제 제목
  const lines = Array.isArray(rawQuestion.lines) ? rawQuestion.lines : []; // lines: 출력할 문장 배열
  const blanks = normalizeBlanks(rawQuestion.blanks); // blanks: 빈칸/정답 배열(정규화)

  return { question_id: questionId, title, lines, blanks };
}

// getLevelQuestions: 특정 레벨의 문제 목록 가져오기(정규화)
function getLevelQuestions(miniData, levelNumber) {
  const levels = miniData.levels ?? {}; // levels: 레벨 데이터
  const rawList = levels[String(levelNumber)] ?? levels[levelNumber] ?? []; // rawList: 레벨 문제 배열
  if (!Array.isArray(rawList)) return [];

  const normalized = rawList.map(normalizeQuestion); // normalized: 정규화된 문제 배열
  return normalized.filter((question) => question.question_id && question.lines.length > 0 && question.blanks.length > 0);
}

module.exports = { loadMiniGameData, normalizeTimeLimitSec, getLevelQuestions };
