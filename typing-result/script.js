/* =========================
   요소 가져오기
========================= */
const typingArea = document.getElementById("typingArea");
const finishBtn = document.getElementById("finishBtn");

const speedEl = document.getElementById("speed");
const accuracyEl = document.getElementById("accuracy");
const timeEl = document.getElementById("time");

const modal = document.getElementById("resultModal");
const closeModal = document.getElementById("closeModal");

const originText = document.getElementById("originText").innerText;

/* =========================
   시간 변수
========================= */
let startTime = null;

/* =========================
   타이핑 시작 시 시간 기록
========================= */
typingArea.addEventListener("focus", () => {
  if (!startTime) {
    startTime = new Date();
  }
});

/* =========================
   완료 버튼 클릭 → 결과 계산
========================= */
finishBtn.addEventListener("click", () => {
  if (!startTime) return;

  const endTime = new Date();
  const typedText = typingArea.value;

  // 걸린 시간 (초)
  const timeTaken = Math.floor((endTime - startTime) / 1000);
  timeEl.innerText = timeTaken;

  // 정확도 계산
  let correct = 0;
  for (let i = 0; i < typedText.length; i++) {
    if (typedText[i] === originText[i]) {
      correct++;
    }
  }
  const accuracy = ((correct / originText.length) * 100).toFixed(1);
  accuracyEl.innerText = accuracy;

  // 타자 속도 (WPM)
  const words = typedText.length / 5;
  const wpm = Math.floor((words / timeTaken) * 60);
  speedEl.innerText = wpm;

  // 결과 모달 열기
  modal.style.display = "block";

  // 다음 연습을 위한 초기화
  startTime = null;
  typingArea.value = "";
});

/* =========================
   모달 닫기
========================= */
closeModal.addEventListener("click", () => {
  modal.style.display = "none";
});

/* =========================
   복사 / 붙여넣기 방지
========================= */
typingArea.addEventListener("paste", (e) => {
  e.preventDefault();
  alert("붙여넣기는 사용할 수 없습니다.");
});

typingArea.addEventListener("copy", (e) => e.preventDefault());
typingArea.addEventListener("cut", (e) => e.preventDefault());

/* =========================
   개발자 도구 조작 방지
========================= */
document.addEventListener("keydown", function (e) {
  if (e.key === "F12") e.preventDefault();
  if (e.ctrlKey && e.shiftKey && e.key === "I") e.preventDefault();
});

document.addEventListener("contextmenu", e => e.preventDefault());
