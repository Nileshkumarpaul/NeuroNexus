let quiz = JSON.parse(localStorage.getItem('quiz')) || [];
let timerInterval;
let timeLeft = 60;

function saveQuiz() {
  localStorage.setItem('quiz', JSON.stringify(quiz));
}

function renderQuestionList() {
  const list = document.getElementById('list');
  list.innerHTML = '';
  quiz.forEach((q, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      ${q.question}
      <button onclick="deleteQuestion(${index})">Delete</button>
    `;
    list.appendChild(li);
  });
}

function deleteQuestion(index) {
  quiz.splice(index, 1);
  saveQuiz();
  renderQuestionList();
}

document.getElementById('quiz-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const question = document.getElementById('question').value;
  const options = [
    document.getElementById('option1').value,
    document.getElementById('option2').value,
    document.getElementById('option3').value,
    document.getElementById('option4').value
  ];
  const correct = parseInt(document.getElementById('correct').value);

  quiz.push({ question, options, correct });
  saveQuiz();
  renderQuestionList();
  this.reset();
});

document.getElementById('start-quiz').addEventListener('click', function() {
  if (quiz.length === 0) {
    alert('Add at least one question first!');
    return;
  }

  document.getElementById('create-quiz').style.display = 'none';
  document.getElementById('take-quiz').style.display = 'block';

  // Randomize quiz questions
  const shuffledQuiz = [...quiz].sort(() => 0.5 - Math.random());

  const takeQuizForm = document.getElementById('take-quiz-form');
  takeQuizForm.innerHTML = '';

  shuffledQuiz.forEach((q, index) => {
    const div = document.createElement('div');
    div.innerHTML = `
      <p><strong>${q.question}</strong></p>
      ${q.options.map((opt, i) => `
        <label>
          <input type="radio" name="question${index}" value="${i+1}" required> ${opt}
        </label>
      `).join('<br>')}
      <br><br>
    `;
    takeQuizForm.appendChild(div);
  });

  startTimer();
});

function startTimer() {
  timerInterval = setInterval(() => {
    timeLeft--;
    document.getElementById('timer').innerText = `Time Left: ${timeLeft}s`;

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      submitQuiz();
    }
  }, 1000);
}

function submitQuiz() {
  clearInterval(timerInterval);

  const formData = new FormData(document.getElementById('take-quiz-form'));
  let score = 0;

  quiz.forEach((q, index) => {
    const userAnswer = parseInt(formData.get(`question${index}`));
    if (userAnswer === q.correct) {
      score++;
    }
  });

  document.getElementById('take-quiz').style.display = 'none';
  document.getElementById('result').style.display = 'block';
  document.getElementById('score').innerText = `${score} out of ${quiz.length}`;
}

document.getElementById('submit-quiz').addEventListener('click', submitQuiz);

document.getElementById('restart').addEventListener('click', function() {
  localStorage.removeItem('quiz');
  location.reload();
});

// Initial load
renderQuestionList();
