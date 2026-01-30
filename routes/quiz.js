import express from "express";
const router = express.Router();

// 정답 (미니게임용)
const ANSWER = "scanf";

/*
 [GET] /api/quiz
 - 미니게임 문제를 클라이언트에 전달
*/
router.get("/", (req, res) => {
  res.json({
    question: "정수 하나를 입력받아 그대로 출력하는 C 프로그램이다."
  });
});

/*
 [POST] /api/quiz/check
 - 사용자가 입력한 정답 검사
*/
router.post("/check", (req, res) => {
  const { userAnswer } = req.body;

  /*
   잘못된 요청 처리
   - 답을 입력하지 않았을 경우
  */
  if (!userAnswer) {
    return res.status(400).json({
      message: "답을 입력하세요."
    });
  }

  /*
   정답 비교
   - 공백 제거 후 정답과 비교
  */
  const isCorrect = userAnswer.trim() === ANSWER;

  res.json({
    correct: isCorrect
  });
});

export default router;
