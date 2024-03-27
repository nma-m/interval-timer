import Timer from './Timer.js';

////////////////////
//    ELEMENTS    //
////////////////////

const inputDiv = document.querySelector('.input');
const inputInstructions = document.querySelector('.instructions--input');
const inputTextBox = document.querySelector('.input__box');
const inputBtn = document.querySelector('.input__btn--add');
const intervalHoursPart = document.querySelector('.interval__part--hours');
const intervalMinutesPart = document.querySelector('.interval__part--minutes');
const intervalSecondsPart = document.querySelector('.interval__part--seconds');
const timerHoursPart = document.querySelector('.timer__part--hours');
const timerMinutesPart = document.querySelector('.timer__part--minutes');
const timerSecondsPart = document.querySelector('.timer__part--seconds');
const startPauseBtn = document.querySelector('.timer__btn--control');
const undoBtn = document.querySelector('.timer__btn--undo');
const clearBtn = document.querySelector('.timer__btn--clear');
const intervalAlarmSound = document.querySelector('.interval_alarm');
const timerAlarmSound = document.querySelector('.timer_alarm');

/////////////////////////////
//          TIMER          //
//////////////// ////////////

var timer = new Timer();

function addInterval() {
  if (timer.interval == null) { // only allow edits to timer when paused

    const hours = inputTextBox.value[HOURS_TENS_DIGIT] +
      inputTextBox.value[HOURS_ONES_DIGIT];

    const minutes = inputTextBox.value[MINUTES_TENS_DIGIT] +
      inputTextBox.value[MINUTES_ONES_DIGIT];

    const seconds = inputTextBox.value[SECONDS_TENS_DIGIT] +
      inputTextBox.value[SECONDS_ONES_DIGIT];

    if (hours === '00' && minutes === '00' && seconds === '00') {
      // can't add interval of length 00:00:00
    } else {
      // add interval to timer
      timer.addInterval(
        parseInt(hours, 10),
        parseInt(minutes, 10),
        parseInt(seconds, 10)
      );

      // first interval in the queue is the one displayed
      if (timer.intervals.length === 1) {
        syncInterface(
          timer.intervals[0],
          intervalHoursPart,
          intervalMinutesPart,
          intervalSecondsPart
        );
      }

      // update the total time display
      syncInterface(
        timer,
        timerHoursPart,
        timerMinutesPart,
        timerSecondsPart
      );

      clearInput();
      colorUndoButton();
    }
  }
}

function syncInterface(time, hoursElement, minutesElement, secondsElement) {
  const hours = Math.floor(time.remainingSeconds / 3600);
  const minutes = Math.floor(time.remainingSeconds / 60) - 60 * hours;
  const seconds = time.remainingSeconds % 60;

  hoursElement.textContent = hours.toString().padStart(2, "0");
  minutesElement.textContent = minutes.toString().padStart(2, "0");
  secondsElement.textContent = seconds.toString().padStart(2, "0");
}

function displayCurrentIntervalInTitle() {
  const hours = Math.floor(timer.intervals[0].remainingSeconds / 3600);
  const minutes = Math.floor(timer.intervals[0].remainingSeconds / 60) - 60 * hours;
  const seconds = timer.intervals[0].remainingSeconds % 60;

  document.title = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

function updateInterfaceTime() {
  // update the current interval display
  syncInterface(
    timer.intervals[0],
    intervalHoursPart,
    intervalMinutesPart,
    intervalSecondsPart
  );

  // update the total time display
  syncInterface(
    timer,
    timerHoursPart,
    timerMinutesPart,
    timerSecondsPart
  );

  displayCurrentIntervalInTitle();
}


///////////////////////////
//    TIMER  CONTROLS    //
///////////////////////////

function start() {
  if (timer.remainingSeconds === 0) {
    // do nothing until they add time
  } else if (timer.interval === null) {
    var currentInterval = timer.intervals[0];

    timer.interval = setInterval(() => {
      currentInterval.remainingSeconds -= 1;
      timer.remainingSeconds -= 1;
      updateInterfaceTime();

      if (currentInterval.remainingSeconds === 0) {
        if (timer.intervals.length > 1) { // if there's another interval 
          currentInterval = timer.pop();
          updateInterfaceTime();
          intervalAlarmSound.play();
        } else {  // if it's the last interval
          timer.intervals.shift();
          stop();
          inputTextBox.focus();
          timerAlarmSound.play();
          document.title = "Interval Timer";
        }
      }
    }, 1000);

    updateTimerControls();
    clearInput();
    toggleInputInstructions();
    inputTextBox.blur();
  } else {
    stop();
  }
}

function stop() {
  clearInterval(timer.interval);
  timer.interval = null;
  updateTimerControls();
  toggleInputInstructions();
}

// Start and pause the timer with button click
startPauseBtn.addEventListener('click', () => {
  intervalAlarmSound.load();
  timerAlarmSound.load();
  start();
});

// Start and pause the timer with Space
document.addEventListener('keydown', (e) => {
  if (e.key === ' ') {
    e.preventDefault();
    start();
  }
});

function undo() {
  timer.undoInterval();

  syncInterface(
    timer,
    timerHoursPart,
    timerMinutesPart,
    timerSecondsPart
  );

  if (timer.intervals.length === 0) {
    clear();
  } else {
    inputTextBox.focus();
  }
}

// Undo the last interval with button click
undoBtn.addEventListener('click', () => {
  if (timer.intervals.length > 0) {
    undo();
  }
});

// Undo the last interval with z key press
document.addEventListener('keydown', (e) => {
  if (e.key === 'z') {
    if (timer.intervals.length > 0) {
      e.preventDefault();
      undo();
    }
  }
});

function colorUndoButton() {
  if (timer.intervals.length > 0) {
    undoBtn.classList.remove('btn--disabled');
  } else {
    undoBtn.classList.add('btn--disabled');
  }
}

function clear() {
  if (timer.interval != null) {
    stop();
  }

  timer.intervals.length = 0;
  timer.remainingSeconds = 0;
  timer.interval = null;
  updateTimerControls();
  document.title = "Interval Timer";

  intervalHoursPart.textContent = '00';
  intervalMinutesPart.textContent = '00';
  intervalSecondsPart.textContent = '00';
  timerHoursPart.textContent = '00';
  timerMinutesPart.textContent = '00';
  timerSecondsPart.textContent = '00';
  
  inputTextBox.focus();
}

// Reset the timer with button click
clearBtn.addEventListener('click', () => {
  if (timer.intervals.length > 0) {
    clear();
  }
});

// Reset the timer with ESC
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (timer.intervals.length > 0) {
      clear();
    }
  }
});

function updateTimerControls() {
  var control = startPauseBtn;
  if (timer.interval === null) { // if paused
    control.innerHTML =
      `Start
      <span class="instructions">(space)</span>
      `;
    control.classList.add('timer__btn--start');
    control.classList.remove('timer__btn--pause');
  } else { // if running
    control.innerHTML = 
      `Pause
      <span class="instructions">(space)</span>
      `;
    control.classList.add('timer__btn--pause');
    control.classList.remove('timer__btn--start');
  }
  colorUndoButton();
}


/////////////////////////////
//          INPUT          //
/////////////////////////////

// Constants for indexing input textbox value
const HOURS_TENS_DIGIT = 0;
const HOURS_ONES_DIGIT = 1;
const MINUTES_TENS_DIGIT = 6;
const MINUTES_ONES_DIGIT = 7;
const SECONDS_TENS_DIGIT = 13;
const SECONDS_ONES_DIGIT = 14;
const CARET_POS = 15;

// Place caret at the right spot on textbox click
inputTextBox.addEventListener('click', (e) => {
  e.target.selectionStart = CARET_POS;
  e.target.selectionEnd = CARET_POS;
});

// Allow user to input interval if timer is stopped
inputTextBox.addEventListener('focus', (e) => {
  if (timer.interval === null) {
    e.target.selectionStart = CARET_POS;
    e.target.selectionEnd = CARET_POS;
    e.target.classList.remove('input__box-disabled');
    e.target.addEventListener('keydown', type);
    e.target.addEventListener('keydown', addWithEnter);
    colorAddButton();
    toggleInputInstructions();
  }
});
inputDiv.addEventListener('focus', () => {
  if (timer.interval === null) {
    inputTextBox.focus();
  }
});

inputTextBox.addEventListener('blur', (e) => {
  e.target.classList.add('input__box-disabled');
  e.target.removeEventListener('keydown', addWithEnter);
  colorAddButton();
  toggleInputInstructions();
});
inputDiv.addEventListener('blur', () => {
  inputTextBox.blur();
});

// Handles typing in input textbox
function type(e) {
  if (e.key === 'Tab') {
    // allow tab navigation
  } else if (timer.interval === null) { // if the timer isn't running
    if (e.key in [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]) {
      e.preventDefault();
      if (e.target.value[0] === '0') { // if not full
        e.target.value = replaceAtIndex(e.target.value, HOURS_TENS_DIGIT, e.target.value[HOURS_ONES_DIGIT]);
        e.target.value = replaceAtIndex(e.target.value, HOURS_ONES_DIGIT, e.target.value[MINUTES_TENS_DIGIT]);
        e.target.value = replaceAtIndex(e.target.value, MINUTES_TENS_DIGIT, e.target.value[MINUTES_ONES_DIGIT]);
        e.target.value = replaceAtIndex(e.target.value, MINUTES_ONES_DIGIT, e.target.value[SECONDS_TENS_DIGIT]);
        e.target.value = replaceAtIndex(e.target.value, SECONDS_TENS_DIGIT, e.target.value[SECONDS_ONES_DIGIT]);
        e.target.value = replaceAtIndex(e.target.value, SECONDS_ONES_DIGIT, e.key);

        e.target.selectionStart = CARET_POS;
        e.target.selectionEnd = CARET_POS;
      }
    } else if (e.key === 'Backspace') {
      e.preventDefault();
      if (e.target.value !== '00 hr 00 min 00 sec ') { // if not empty
        e.target.value = replaceAtIndex(e.target.value, SECONDS_ONES_DIGIT, e.target.value[SECONDS_TENS_DIGIT]);
        e.target.value = replaceAtIndex(e.target.value, SECONDS_TENS_DIGIT, e.target.value[MINUTES_ONES_DIGIT]);
        e.target.value = replaceAtIndex(e.target.value, MINUTES_ONES_DIGIT, e.target.value[MINUTES_TENS_DIGIT]);
        e.target.value = replaceAtIndex(e.target.value, MINUTES_TENS_DIGIT, e.target.value[HOURS_ONES_DIGIT]);
        e.target.value = replaceAtIndex(e.target.value, HOURS_ONES_DIGIT, e.target.value[HOURS_TENS_DIGIT]);
        e.target.value = replaceAtIndex(e.target.value, HOURS_TENS_DIGIT, '0');

        e.target.selectionStart = CARET_POS;
        e.target.selectionEnd = CARET_POS;
      }
    } else {
      e.preventDefault();
    }
  } else {
    e.preventDefault();
  }

  colorAddButton();
}

// Helper for editing the input textbox value
function replaceAtIndex(str, i, chr) {
  return str.substring(0, i) + chr + str.substring(i + 1);
}

// Add an Interval to Timer.intervals and update the interface
inputBtn.addEventListener('click', () => {
  addInterval();
  inputTextBox.focus();
});

// Add Interval by pressing enter
function addWithEnter(e) {
  if (e.key === 'Enter') {
    addInterval();
  }
}

// Add button coloring event listeners
inputBtn.addEventListener('focus', () => {
  colorAddButton();
});
inputBtn.addEventListener('blur', () => {
  inputBtn.classList.add('btn--disabled');
});

function colorAddButton() {
  const digits = [HOURS_TENS_DIGIT, HOURS_ONES_DIGIT, MINUTES_TENS_DIGIT, MINUTES_ONES_DIGIT, SECONDS_TENS_DIGIT, SECONDS_ONES_DIGIT];

  for (var i = 0; i < digits.length; i++) {
    if (inputTextBox.value[digits[i]] !== '0') {
      inputBtn.classList.remove('btn--disabled');
      break;
    } else {
      inputBtn.classList.add('btn--disabled');
    }
  }
}

function toggleInputInstructions() {
  if (timer.interval === null) {
    if (document.activeElement == inputTextBox) {
      inputInstructions.classList.add('instructions--input-disabled');
    } else {
      inputInstructions.classList.remove('instructions--input-disabled');
    }
  } else {
    inputInstructions.classList.add('instructions--input-disabled');
  }
}

function clearInput() {
  inputTextBox.value = replaceAtIndex(inputTextBox.value, SECONDS_ONES_DIGIT, '0');
  inputTextBox.value = replaceAtIndex(inputTextBox.value, SECONDS_TENS_DIGIT, '0');
  inputTextBox.value = replaceAtIndex(inputTextBox.value, MINUTES_ONES_DIGIT, '0');
  inputTextBox.value = replaceAtIndex(inputTextBox.value, MINUTES_TENS_DIGIT, '0');
  inputTextBox.value = replaceAtIndex(inputTextBox.value, HOURS_ONES_DIGIT, '0');
  inputTextBox.value = replaceAtIndex(inputTextBox.value, HOURS_TENS_DIGIT, '0');

  inputTextBox.selectionStart = CARET_POS;
  inputTextBox.selectionEnd = CARET_POS;
  
  colorAddButton();
}


window.addEventListener('DOMContentLoaded', function () {
  inputTextBox.focus();
  colorUndoButton();
});