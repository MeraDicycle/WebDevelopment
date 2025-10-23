const startScreen = document.getElementById("screen_start");
const quizScreen = document.getElementById("screen_quiz");
const resultScreen = document.getElementById("screen_result");
const startButton = document.getElementById("startButton");


const questionText = document.getElementById("question-text");
const answersContainer = document.getElementById("answers-container");
const currentQuestionSpan = document.getElementById("current-question");
// const totalQuestionsSpan = document.getElementById("total-questions");
const scoreSpan = document.getElementById("score");
const finalScoreSpan = document.getElementById("final-score");
// const maxScoreSpan = document.getElementById("max-score");
const resultMessage = document.getElementById("result-message");
const restartButton = document.getElementById("restart-btn");
const progressBar = document.getElementById("progress");

startButton.addEventListener("click", startQuiz);

//ti mu
const quizQuestions = [
  {
    question: "What is the capital of France?",
    answers: [
      { text: "London", correct: false },
      { text: "Berlin", correct: false },
      { text: "Paris", correct: true },
      { text: "Madrid", correct: false },
    ],
  },
  {
    question: "Which planet is known as the Red Planet?",
    answers: [
      { text: "Venus", correct: false },
      { text: "Mars", correct: true },
      { text: "Jupiter", correct: false },
      { text: "Saturn", correct: false },
    ],
  },
  {
    question: "What is the largest ocean on Earth?",
    answers: [
      { text: "Atlantic Ocean", correct: false },
      { text: "Indian Ocean", correct: false },
      { text: "Arctic Ocean", correct: false },
      { text: "Pacific Ocean", correct: true },
    ],
  },
  {
    question: "Which of these is NOT a programming language?",
    answers: [
      { text: "Java", correct: false },
      { text: "Python", correct: false },
      { text: "Banana", correct: true },
      { text: "JavaScript", correct: false },
    ],
  },
  {
    question: "What is the chemical symbol for gold?",
    answers: [
      { text: "Go", correct: false },
      { text: "Gd", correct: false },
      { text: "Au", correct: true },
      { text: "Ag", correct: false },
    ],
  },
];


// QUIZ STATE VARS
let currentQuestionIndex = 0;
let score = 0;
let answersDisabled = false;

let totalQuestions = quizQuestions.length;
// totalQuestionsSpan.textContent = quizQuestions.length;
// maxScoreSpan.textContent = quizQuestions.length;




//开始页->题目页；
function startQuiz() {

  // 重置变量
  currentQuestionIndex = 0;
  score = 0;
  // 切换屏幕
  resultScreen.classList.remove("active"); // 确保结果页隐藏
  startScreen.classList.remove("active");
  quizScreen.classList.add("active");

  if (scoreSpan) {
    scoreSpan.textContent = `Score: ${score} `;
  }

  // 显示第一个问题
  showQuestion();
}
//题目页->结果页；
function showResults() {
  // 切换屏幕
  quizScreen.classList.remove("active");
  resultScreen.classList.add("active");
  // 显示分数
  finalScoreSpan.textContent = `You scored ${score} out of ${quizQuestions.length}`;
}

// //结果页->开始页;
// function restartQuiz() {
//   // 返回开始页
//   resultScreen.classList.remove("active");
//   startScreen.classList.add("active"); // 实际代码中是通过startQuiz()间接实现
// }


function showQuestion() {
  answersDisabled = false;
  const currentQuestion = quizQuestions[currentQuestionIndex];
  const temp = currentQuestionIndex + 1;
  currentQuestionSpan.textContent = `Question ${temp} of ${totalQuestions}`;

  // 进度（建议改进见下方）
  const progressPercent = (currentQuestionIndex / quizQuestions.length) * 100;
  // 如果 progress 是一个 div -> style.width 有效；如果是 <progress>，请设置 .value/.max
  if (progressBar) {
    progressBar.style.width = progressPercent + "%";
  }

  questionText.textContent = currentQuestion.question;

  // **只清空 ul 的内容**，保留 answersContainer 本身
  const ul = answersContainer.querySelector(".abcd");
  if (!ul) {
    console.error("找不到 .abcd 元素 — 请检查 HTML 里是否存在 <ul class='abcd'>");
    return;
  }
  ul.innerHTML = "";

  currentQuestion.answers.forEach((answer) => {
    const li = document.createElement("li");
    li.textContent = answer.text;
    li.dataset.correct = answer.correct;
    li.addEventListener("click", selectAnswer);
    ul.appendChild(li);
  });
}

function selectAnswer(event) {
  // optimization check
  if (answersDisabled) return;
  answersDisabled = true;

  const selectedButton = event.target;
  const isCorrect = selectedButton.dataset.correct === "true";
  // Here Array.from() is used to convert the NodeList returned by answersContainer.children into an array, this is because the NodeList is not an array and we need to use the forEach method
  Array.from(answersContainer.children).forEach((button) => {
    if (button.dataset.correct === "true") {
      button.classList.add("correct");
    } else if (button === selectedButton) {
      button.classList.add("incorrect");
    }
  });

  if (isCorrect) {
    score++;
    scoreSpan.textContent = `Score: ${score}`;
  }

  setTimeout(() => {
    currentQuestionIndex++;
    // check if there are more questions or if the quiz is over
    if (currentQuestionIndex < quizQuestions.length) {
      showQuestion();
    } else {
      showResults();
    }
  }, 300);
}

function showResults() {
  quizScreen.classList.remove("active");
  resultScreen.classList.add("active");

  finalScoreSpan.textContent = `You scored ${score} out of ${quizQuestions.length}`;;

  const percentage = (score / quizQuestions.length) * 100;

  if (percentage === 100) {
    resultMessage.textContent = "Perfect! You're a genius!";
  } else if (percentage >= 80) {
    resultMessage.textContent = "Great job! You know your stuff!";
  } else if (percentage >= 60) {
    resultMessage.textContent = "Good effort! Keep learning!";
  } else if (percentage >= 40) {
    resultMessage.textContent = "Not bad! Try again to improve!";
  } else {
    resultMessage.textContent = "Keep studying! You'll get better!";
  }
}

restartButton.addEventListener("click", restartQuiz);

function restartQuiz() {
  resultScreen.classList.remove("active");
  // startQuiz();
  startScreen.classList.add("active"); 
}