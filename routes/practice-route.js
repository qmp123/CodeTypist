const express = require("express");
const router = express.Router(); // router: 연습 API 라우터

const longPracticeData = require("../data/long-practice.json"); // longPracticeData: 긴글 연습 데이터

// sendSuccessResponse: 성공 응답을 통일된 구조로 반환
function sendSuccessResponse(res, data) {
  return res.json({ success: true, data }); // successPayload: 통일 응답
}

// sendErrorResponse: 실패 응답을 통일된 구조로 반환
function sendErrorResponse(res, statusCode, errorMessage) {
  return res.status(statusCode).json({ success: false, error: errorMessage }); // errorPayload: 통일 응답
}

// parsePageNumber: page 쿼리 파라미터를 정수로 파싱
function parsePageNumber(pageValue) {
  const pageNumber = Number(pageValue); // pageNumber: 페이지 번호(숫자)
  if (!Number.isInteger(pageNumber) || pageNumber < 1) return null;
  return pageNumber;
}

// getLongPracticePage: 긴글 연습 페이지(5줄) 조회
// GET /api/practice/long?language=c&set_id=1&page=1
router.get("/long", (req, res) => {
  const language = String(req.query.language || ""); // language: 언어(c/java/python)
  const setId = String(req.query.set_id || ""); // setId: 세트 id(문자열)
  const page = parsePageNumber(req.query.page || 1); // page: 페이지 번호(1부터)

  if (!language) return sendErrorResponse(res, 400, "language is required");
  if (!setId) return sendErrorResponse(res, 400, "set_id is required");
  if (!page) return sendErrorResponse(res, 400, "page must be an integer >= 1");

  const languageData = longPracticeData[language]; // languageData: 언어별 데이터
  if (!languageData || !languageData.long) return sendErrorResponse(res, 404, "long practice data not found");

  const practiceSet = languageData.long[setId]; // practiceSet: 선택한 세트
  if (!practiceSet) return sendErrorResponse(res, 404, "practice set not found");

  const pages = practiceSet.pages; // pages: 페이지 배열
  if (!Array.isArray(pages) || pages.length === 0) return sendErrorResponse(res, 500, "invalid pages data");

  const totalPages = pages.length; // totalPages: 전체 페이지 수
  if (page > totalPages) return sendErrorResponse(res, 404, "page not found");

  const lines = pages[page - 1]; // lines: 현재 페이지 라인 배열
  if (!Array.isArray(lines)) return sendErrorResponse(res, 500, "invalid lines data");

  return sendSuccessResponse(res, {
    language, // language: 언어
    set_id: setId, // set_id: 세트 id (API 출력 snake_case)
    title: practiceSet.title, // title: 세트 제목
    page, // page: 현재 페이지
    total_pages: totalPages, // total_pages: 전체 페이지 수
    lines, // lines: 5줄 배열
  });
});

module.exports = router;
