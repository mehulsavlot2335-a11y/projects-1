/* ═══════════════════════════════════════════════════════════════
   BRAINBLITZ — QUIZ APP JAVASCRIPT
   Concepts covered:
   ✔ Arrays & Objects          — storing questions, user answers
   ✔ Functions                 — reusable blocks of logic
   ✔ DOM Manipulation          — getElementById, innerHTML, classList
   ✔ Events                    — addEventListener, onclick
   ✔ Timers                    — setInterval, clearInterval
   ✔ Conditional logic         — if / else if / else
   ✔ Template literals         — `Hello ${name}`
   ✔ Array methods             — forEach, filter
   ✔ Math methods              — Math.round, Math.floor
═══════════════════════════════════════════════════════════════ */


/* ════════════════════════════════════════════════════════════
   1. QUIZ DATA — 10 Programming / Coding Questions
   Each question is an OBJECT with these keys:
     id       — unique number
     category — topic label shown on the card
     question — the question string
     options  — array of 4 answer strings
     answer   — index (0–3) of the correct option
════════════════════════════════════════════════════════════ */
const questions = [
  {
    id: 1,
    category: "JavaScript",
    question: "Which keyword is used to declare a variable that CANNOT be reassigned in JavaScript?",
    options: ["var", "let", "const", "static"],
    answer: 2   // const
  },
  {
    id: 2,
    category: "HTML",
    question: "Which HTML tag is used to link an external CSS stylesheet?",
    options: [
      "<style src=''>",
      "<link rel='stylesheet'>",
      "<css href=''>",
      "<script type='css'>"
    ],
    answer: 1   // <link rel='stylesheet'>
  },
  {
    id: 3,
    category: "CSS",
    question: "Which CSS property controls the space INSIDE an element's border?",
    options: ["margin", "spacing", "padding", "border-space"],
    answer: 2   // padding
  },
  {
    id: 4,
    category: "JavaScript",
    question: "What does the '===' operator check in JavaScript?",
    options: [
      "Value only",
      "Type only",
      "Value and type (strict equality)",
      "Neither value nor type"
    ],
    answer: 2   // Value and type (strict equality)
  },
  {
    id: 5,
    category: "Programming",
    question: "What is the output of: console.log(typeof null) in JavaScript?",
    options: ["'null'", "'undefined'", "'object'", "'boolean'"],
    answer: 2   // 'object' (a known JS quirk)
  },
  {
    id: 6,
    category: "CSS",
    question: "Which CSS display value makes children align in a row by default?",
    options: ["display: block", "display: grid", "display: flex", "display: inline"],
    answer: 2   // display: flex
  },
  {
    id: 7,
    category: "Programming",
    question: "What does 'DOM' stand for in web development?",
    options: [
      "Document Object Model",
      "Data Object Method",
      "Display Output Module",
      "Dynamic Object Mapping"
    ],
    answer: 0   // Document Object Model
  },
  {
    id: 8,
    category: "JavaScript",
    question: "Which array method adds one or more elements to the END of an array?",
    options: ["unshift()", "shift()", "push()", "pop()"],
    answer: 2   // push()
  },
  {
    id: 9,
    category: "HTML",
    question: "Which attribute makes an HTML input field mandatory before form submission?",
    options: ["mandatory", "required", "validate", "notnull"],
    answer: 1   // required
  },
  {
    id: 10,
    category: "Programming",
    question: "What is the correct way to write a single-line comment in JavaScript?",
    options: ["<!-- comment -->", "/* comment */", "# comment", "// comment"],
    answer: 3   // // comment
  }
];


/* ════════════════════════════════════════════════════════════
   2. STATE VARIABLES
   'let' — values that change during the quiz
   'const' — values that stay fixed throughout
════════════════════════════════════════════════════════════ */
let currentIndex   = 0;     // which question we're on (0–9)
let score          = 0;     // correct answers so far
let userAnswers    = [];    // stores result objects for each round
let questionStart  = 0;     // timestamp (ms) when current question loaded
let totalStartTime = 0;     // timestamp (ms) when quiz began
let timerInterval  = null;  // reference to the setInterval, so we can stop it
let timeLeft       = 30;    // seconds left on the current question
let answered       = false; // true once the user picks or time runs out

const TIME_PER_Q = 30;                  // 30 seconds per question
const LABELS     = ['A', 'B', 'C', 'D']; // letter labels for options


/* ════════════════════════════════════════════════════════════
   3. DOM REFERENCES
   document.getElementById('id') finds an HTML element by its id="".
   We grab them once here and reuse them throughout the script.
════════════════════════════════════════════════════════════ */
const startScreen  = document.getElementById('startScreen');
const quizScreen   = document.getElementById('quizScreen');
const resultScreen = document.getElementById('resultScreen');

const startBtn     = document.getElementById('startBtn');
const nextBtn      = document.getElementById('nextBtn');
const reviewBtn    = document.getElementById('reviewBtn');
const retakeBtn    = document.getElementById('retakeBtn');
const closeReview  = document.getElementById('closeReview');

const qCounter     = document.getElementById('qCounter');
const progressBar  = document.getElementById('progressBar');
const timerDisplay = document.getElementById('timerDisplay');
const timerBox     = document.getElementById('timerBox');
const qTag         = document.getElementById('qTag');
const qCategory    = document.getElementById('qCategory');
const questionText = document.getElementById('questionText');
const optionsGrid  = document.getElementById('optionsGrid');
const livScore     = document.getElementById('livScore');

const gradeBadge   = document.getElementById('gradeBadge');
const gradeLetter  = document.getElementById('gradeLetter');
const statCorrect  = document.getElementById('statCorrect');
const statWrong    = document.getElementById('statWrong');
const statPercent  = document.getElementById('statPercent');
const statTime     = document.getElementById('statTime');
const feedbackText = document.getElementById('feedbackText');
const ringFill     = document.getElementById('ringFill');
const ringPct      = document.getElementById('ringPct');
const reviewPanel  = document.getElementById('reviewPanel');
const reviewList   = document.getElementById('reviewList');


/* ════════════════════════════════════════════════════════════
   4. SCREEN NAVIGATION
   Only one screen is visible at a time.
   We add/remove the 'active' class (CSS sets display:flex on .active).
════════════════════════════════════════════════════════════ */

/* FUNCTION: showScreen — hides all screens, shows requested one */
function showScreen(screenEl) {
  [startScreen, quizScreen, resultScreen].forEach(s => s.classList.remove('active'));
  screenEl.classList.add('active');
}


/* ════════════════════════════════════════════════════════════
   5. START QUIZ
════════════════════════════════════════════════════════════ */

/* FUNCTION: startQuiz — resets all state, shows first question */
function startQuiz() {
  currentIndex   = 0;
  score          = 0;
  userAnswers    = [];
  totalStartTime = Date.now();  // Date.now() returns current time in milliseconds

  showScreen(quizScreen);
  loadQuestion();
}

// Listen for a click on the Start button → call startQuiz
startBtn.addEventListener('click', startQuiz);


/* ════════════════════════════════════════════════════════════
   6. LOAD QUESTION
   Reads the current question object from the array and
   renders it into the quiz card HTML elements.
════════════════════════════════════════════════════════════ */

/* FUNCTION: loadQuestion */
function loadQuestion() {
  answered = false;  // allow answering again

  // Pull current question from array using index
  const q = questions[currentIndex];

  // Update top-bar text using template literals (backtick strings)
  qCounter.textContent    = `Question ${currentIndex + 1}/${questions.length}`;
  qTag.textContent        = `Q${currentIndex + 1}`;
  qCategory.textContent   = q.category;
  questionText.textContent = q.question;

  // Progress bar width = how far through the quiz we are (%)
  const pct = ((currentIndex + 1) / questions.length) * 100;
  progressBar.style.width = pct + '%';

  // Disable Next until user answers
  nextBtn.disabled = true;

  // Clear previous options and build fresh ones
  optionsGrid.innerHTML = '';

  // forEach loops through each option string and its position index (i)
  q.options.forEach((optText, i) => {
    const btn = document.createElement('button');  // create a <button>
    btn.className = 'option-btn';

    // Template literal builds the inner HTML with letter + text
    btn.innerHTML = `
      <span class="opt-letter">${LABELS[i]}</span>
      <span class="opt-text">${optText}</span>
    `;

    // Arrow function: when clicked, call selectAnswer with this index
    btn.addEventListener('click', () => selectAnswer(i));

    optionsGrid.appendChild(btn);  // add button to the grid
  });

  startTimer();                     // begin countdown
  questionStart = Date.now();       // record when this question started
}


/* ════════════════════════════════════════════════════════════
   7. TIMER
   setInterval runs a function every X milliseconds.
   clearInterval stops it.
════════════════════════════════════════════════════════════ */

/* FUNCTION: startTimer — countdown from TIME_PER_Q to 0 */
function startTimer() {
  clearInterval(timerInterval);          // clear any running timer first
  timeLeft = TIME_PER_Q;
  timerDisplay.textContent = timeLeft;
  timerBox.classList.remove('urgent');

  timerInterval = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = timeLeft;

    // Add urgent class (amber styling) in last 10 seconds
    if (timeLeft <= 10) timerBox.classList.add('urgent');

    // Time's up — auto-submit
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      handleTimeout();
    }
  }, 1000); // 1000ms = 1 second
}

/* FUNCTION: stopTimer — stops the countdown and removes urgent style */
function stopTimer() {
  clearInterval(timerInterval);
  timerBox.classList.remove('urgent');
}

/* FUNCTION: handleTimeout — runs when 30s expires with no answer */
function handleTimeout() {
  if (answered) return;  // safety check
  answered = true;

  const q = questions[currentIndex];

  // Record a timeout in the answers array
  userAnswers.push({
    questionIndex: currentIndex,
    userChoice:    -1,         // -1 = no choice made
    correct:       false,
    timeout:       true,
    timeSpent:     TIME_PER_Q
  });

  // Show the correct answer in green
  const allBtns = optionsGrid.querySelectorAll('.option-btn');
  allBtns[q.answer].classList.add('correct');
  allBtns.forEach(btn => btn.disabled = true);

  nextBtn.disabled = false;
}


/* ════════════════════════════════════════════════════════════
   8. SELECT AN ANSWER
   Called when the user clicks one of the 4 option buttons.
════════════════════════════════════════════════════════════ */

/* FUNCTION: selectAnswer
   Parameter: chosenIndex — 0, 1, 2, or 3 */
function selectAnswer(chosenIndex) {
  if (answered) return;   // ignore if already answered
  answered = true;

  stopTimer();

  const q         = questions[currentIndex];
  const isCorrect = chosenIndex === q.answer;           // true or false
  const timeSpent = Math.round((Date.now() - questionStart) / 1000);

  // Increment score if correct
  if (isCorrect) {
    score++;
    livScore.textContent = score;  // update live score counter
  }

  // Save result object to userAnswers array
  userAnswers.push({
    questionIndex: currentIndex,
    userChoice:    chosenIndex,
    correct:       isCorrect,
    timeout:       false,
    timeSpent:     timeSpent
  });

  // Visually mark buttons
  const allBtns = optionsGrid.querySelectorAll('.option-btn');
  allBtns[q.answer].classList.add('correct');          // correct → green
  if (!isCorrect) allBtns[chosenIndex].classList.add('wrong'); // wrong → red
  allBtns.forEach(btn => btn.disabled = true);

  nextBtn.disabled = false;  // allow moving to next question
}


/* ════════════════════════════════════════════════════════════
   9. NEXT QUESTION OR SHOW RESULTS
════════════════════════════════════════════════════════════ */
nextBtn.addEventListener('click', () => {
  currentIndex++;  // advance to next question

  if (currentIndex < questions.length) {
    loadQuestion();   // more questions remain
  } else {
    showResults();    // all done → results screen
  }
});


/* ════════════════════════════════════════════════════════════
   10. RESULTS
════════════════════════════════════════════════════════════ */

/* FUNCTION: getGrade — returns grade letter and feedback based on % */
function getGrade(pct) {
  if (pct >= 90) return { letter: 'A+', color: '#4f6ef7', feedback: "🌟 Outstanding! You're a coding pro — flawless knowledge across HTML, CSS & JavaScript!" };
  if (pct >= 75) return { letter: 'A',  color: '#7c5fdd', feedback: "🎯 Excellent! Strong command of programming concepts. A tiny bit more practice and you're at the top!" };
  if (pct >= 60) return { letter: 'B',  color: '#0ea5e9', feedback: "👍 Good work! You understand the core concepts well. Keep building projects to sharpen your skills." };
  if (pct >= 40) return { letter: 'C',  color: '#f59e0b', feedback: "📚 Decent effort! Revisit JavaScript fundamentals and CSS layout — you'll level up quickly with practice." };
  return          { letter: 'F',  color: '#e8445a', feedback: "💪 Don't stop now! Every senior dev was once a beginner. Review the basics and retake the quiz!" };
}

/* FUNCTION: formatTime — converts seconds to "1m 23s" style */
function formatTime(secs) {
  if (secs < 60) return `${secs}s`;
  return `${Math.floor(secs / 60)}m ${secs % 60}s`;
}

/* FUNCTION: showResults — calculates and renders the result screen */
function showResults() {
  stopTimer();

  const total      = questions.length;
  const correct    = score;
  const wrong      = userAnswers.filter(a => !a.correct && !a.timeout).length;
  const percentage = Math.round((correct / total) * 100);
  const totalSecs  = Math.round((Date.now() - totalStartTime) / 1000);
  const grade      = getGrade(percentage);

  // Update DOM with calculated values
  gradeLetter.textContent     = grade.letter;
  gradeBadge.style.background = `linear-gradient(135deg, ${grade.color}, #a855f7)`;

  statCorrect.textContent  = correct;
  statWrong.textContent    = wrong;
  statPercent.textContent  = percentage + '%';
  statTime.textContent     = formatTime(totalSecs);
  feedbackText.textContent = grade.feedback;

  // Animate the SVG score ring
  // Circumference of circle (r=52): 2 × π × 52 ≈ 327
  // dashoffset = 327 × (1 - pct/100) — lower offset = more filled
  const circumference = 327;
  const offset = circumference * (1 - percentage / 100);

  // Inject SVG gradient definition (only once)
  const svgEl = ringFill.closest('svg');
  if (!svgEl.querySelector('#ringGrad')) {
    svgEl.insertAdjacentHTML('afterbegin', `
      <defs>
        <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stop-color="${grade.color}" />
          <stop offset="100%" stop-color="#a855f7" />
        </linearGradient>
      </defs>
    `);
  }

  ringFill.setAttribute('stroke', 'url(#ringGrad)');

  // Small delay so CSS transition fires after screen renders
  setTimeout(() => {
    ringFill.style.strokeDashoffset = offset;
    ringPct.textContent = percentage + '%';
  }, 300);

  showScreen(resultScreen);
}


/* ════════════════════════════════════════════════════════════
   11. REVIEW PANEL
   Shows a detailed card per question: user answer, correct
   answer, status badge, and time spent.
════════════════════════════════════════════════════════════ */

/* FUNCTION: buildReview — generates all review cards */
function buildReview() {
  reviewList.innerHTML = '';   // clear any old content

  userAnswers.forEach((ans, i) => {
    const q         = questions[ans.questionIndex];
    const isCorrect = ans.correct;
    const isTimeout = ans.timeout;

    // Determine status strings and CSS classes
    let statusText, statusClass, cardClass;

    if (isCorrect) {
      statusText  = '✓ Correct';
      statusClass = 'correct';
      cardClass   = 'r-correct';
    } else if (isTimeout) {
      statusText  = '⏱ Timed Out';
      statusClass = 'timeout';
      cardClass   = 'r-timeout';
    } else {
      statusText  = '✗ Wrong';
      statusClass = 'wrong';
      cardClass   = 'r-wrong';
    }

    const userAnswerText   = isTimeout
      ? 'No answer'
      : `${LABELS[ans.userChoice]}. ${q.options[ans.userChoice]}`;

    const correctAnswerText = `${LABELS[q.answer]}. ${q.options[q.answer]}`;

    const userValClass = isCorrect ? 'user-c' : isTimeout ? 'user-t' : 'user-w';

    // Create and inject the review card
    const card = document.createElement('div');
    card.className = `review-card ${cardClass}`;
    card.style.animationDelay = `${i * 0.05}s`;

    card.innerHTML = `
      <div class="rc-top">
        <div style="flex:1">
          <p class="rc-qnum">Question ${i + 1} · ${q.category}</p>
          <p class="rc-qtext">${q.question}</p>
        </div>
        <span class="rc-status ${statusClass}">${statusText}</span>
      </div>

      <div class="rc-answers">
        <div class="rc-ans">
          <span class="rc-ans-label">Your answer:</span>
          <span class="rc-ans-val ${userValClass}">${userAnswerText}</span>
        </div>
        ${!isCorrect ? `
        <div class="rc-ans">
          <span class="rc-ans-label">Correct answer:</span>
          <span class="rc-ans-val corr">${correctAnswerText}</span>
        </div>` : ''}
      </div>

      <p class="rc-time">⏱ Time spent: ${ans.timeSpent}s</p>
    `;

    reviewList.appendChild(card);
  });
}

// Open review panel
reviewBtn.addEventListener('click', () => {
  buildReview();
  reviewPanel.style.display = 'block';
  reviewPanel.scrollTop = 0;
});

// Close review panel
closeReview.addEventListener('click', () => {
  reviewPanel.style.display = 'none';
});


/* ════════════════════════════════════════════════════════════
   12. RETAKE QUIZ
════════════════════════════════════════════════════════════ */
retakeBtn.addEventListener('click', () => {
  reviewPanel.style.display = 'none';
  startQuiz();
});
