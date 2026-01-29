// sendSuccessResponse: 성공 응답을 통일된 구조로 반환
function sendSuccessResponse(res, data) {
  return res.json({ success: true, data }); // successPayload: 통일 응답
}

// sendErrorResponse: 실패 응답을 통일된 구조로 반환
function sendErrorResponse(res, statusCode, errorMessage) {
  return res.status(statusCode).json({ success: false, error: errorMessage }); // errorPayload: 통일 응답
}

module.exports = { sendSuccessResponse, sendErrorResponse };
