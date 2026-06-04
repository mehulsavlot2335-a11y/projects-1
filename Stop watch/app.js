const els = {
  hours: document.getElementById('hours'),
  minutes: document.getElementById('minutes'),
  seconds: document.getElementById('seconds'),
  centiseconds: document.getElementById('centiseconds'),
  startBtn: document.getElementById('start-btn'),
  resumeBtn: document.getElementById('resume-btn'),
  pauseBtn: document.getElementById('pause-btn'),
  resetBtn: document.getElementById('reset-btn'),
  lapBtn: document.getElementById('lap-btn'),
  lapList: document.getElementById('lap-list'),
  emptyLaps: document.getElementById('empty-laps'),
};

let elapsedMs = 0;
let segmentStart = 0;
let timerId = null;
let isRunning = false;
let laps = [];

function pad(num, size = 2) {
  return String(num).padStart(size, '0');
}

function formatTime(ms) {
  const totalMs = Math.max(0, ms);
  const hours = Math.floor(totalMs / 3600000);
  const minutes = Math.floor((totalMs % 3600000) / 60000);
  const seconds = Math.floor((totalMs % 60000) / 1000);
  const centiseconds = Math.floor((totalMs % 1000) / 10);

  const h = pad(hours);
  const m = pad(minutes);
  const s = pad(seconds);
  const cs = pad(centiseconds);

  return {
    hours: h,
    minutes: m,
    seconds: s,
    centiseconds: cs,
    display: `${h}:${m}:${s}:${cs}`,
  };
}

function getElapsedMs() {
  if (isRunning) {
    return elapsedMs + (performance.now() - segmentStart);
  }
  return elapsedMs;
}

function updateDisplay() {
  const time = formatTime(getElapsedMs());

  els.hours.textContent = time.hours;
  els.minutes.textContent = time.minutes;
  els.seconds.textContent = time.seconds;
  els.centiseconds.textContent = time.centiseconds;
}

function setButtonStates() {
  const hasElapsed = elapsedMs > 0;

  if (isRunning) {
    els.startBtn.disabled = true;
    els.resumeBtn.disabled = true;
    els.pauseBtn.disabled = false;
    els.resetBtn.disabled = false;
    els.lapBtn.disabled = false;
  } else if (hasElapsed) {
    els.startBtn.disabled = true;
    els.resumeBtn.disabled = false;
    els.pauseBtn.disabled = true;
    els.resetBtn.disabled = false;
    els.lapBtn.disabled = true;
  } else {
    els.startBtn.disabled = false;
    els.resumeBtn.disabled = true;
    els.pauseBtn.disabled = true;
    els.resetBtn.disabled = true;
    els.lapBtn.disabled = true;
  }
}

function beginTimer() {
  isRunning = true;
  segmentStart = performance.now();
  timerId = setInterval(updateDisplay, 10);
  setButtonStates();
}

function handleStart() {
  if (isRunning || elapsedMs > 0) return;
  beginTimer();
}

function handleResume() {
  if (isRunning || elapsedMs === 0) return;
  beginTimer();
}

function handlePause() {
  if (!isRunning) return;

  elapsedMs = getElapsedMs();
  isRunning = false;
  clearInterval(timerId);
  timerId = null;
  updateDisplay();
  setButtonStates();
}

function reset() {
  isRunning = false;
  clearInterval(timerId);
  timerId = null;
  elapsedMs = 0;
  segmentStart = 0;
  laps = [];

  els.hours.textContent = '00';
  els.minutes.textContent = '00';
  els.seconds.textContent = '00';
  els.centiseconds.textContent = '00';

  renderLaps();
  setButtonStates();
}

function recordLap() {
  if (!isRunning) return;

  const lapTime = getElapsedMs();
  laps.unshift({
    number: laps.length + 1,
    timeMs: lapTime,
    display: formatTime(lapTime).display,
  });

  renderLaps();
}

function renderLaps() {
  els.lapList.innerHTML = '';

  if (laps.length === 0) {
    els.emptyLaps.classList.remove('hidden');
    return;
  }

  els.emptyLaps.classList.add('hidden');

  laps.forEach((lap) => {
    const li = document.createElement('li');
    li.className = 'lap-item';
    li.innerHTML = `
      <span class="lap-number">Lap ${lap.number}</span>
      <span class="lap-time">${lap.display}</span>
    `;
    els.lapList.appendChild(li);
  });
}

els.startBtn.addEventListener('click', handleStart);
els.resumeBtn.addEventListener('click', handleResume);
els.pauseBtn.addEventListener('click', handlePause);
els.resetBtn.addEventListener('click', reset);
els.lapBtn.addEventListener('click', recordLap);

setButtonStates();
renderLaps();
