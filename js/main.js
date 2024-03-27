import Timer from './Timer.js';

/////////////////////////////
//          TIMER          //
//////////////// ////////////

var timer = new Timer();

function addInterval() {
  if (timer.interval == null) { // only allow edits to timer when paused

    const hours = document.querySelector('.input__box').value[HOURS_TENS_DIGIT] +
      document.querySelector('.input__box').value[HOURS_ONES_DIGIT];

    const minutes = document.querySelector('.input__box').value[MINUTES_TENS_DIGIT] +
      document.querySelector('.input__box').value[MINUTES_ONES_DIGIT];

    const seconds = document.querySelector('.input__box').value[SECONDS_TENS_DIGIT] +
      document.querySelector('.input__box').value[SECONDS_ONES_DIGIT];

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
          document.querySelector('.interval__part--hours'),
          document.querySelector('.interval__part--minutes'),
          document.querySelector('.interval__part--seconds')
        );
      }

      // update the total time display
      syncInterface(
        timer,
        document.querySelector('.timer__part--hours'),
        document.querySelector('.timer__part--minutes'),
        document.querySelector('.timer__part--seconds')
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
    document.querySelector('.interval__part--hours'),
    document.querySelector('.interval__part--minutes'),
    document.querySelector('.interval__part--seconds')
  );

  // update the total time display
  syncInterface(
    timer,
    document.querySelector('.timer__part--hours'),
    document.querySelector('.timer__part--minutes'),
    document.querySelector('.timer__part--seconds')
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
          document.querySelector('.interval_alarm').play();
        } else {  // if it's the last interval
          timer.intervals.shift();
          stop();
          document.querySelector('.input__box').focus();
          document.querySelector('.timer_alarm').play();
          document.title = "Interval Timer";
        }
      }
    }, 1000);

    updateTimerControls();
    clearInput();
    toggleInputInstructions();
    document.querySelector('.input__box').blur();
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
document.querySelector('.timer__btn--control').addEventListener('click', () => {
  document.querySelector('.interval_alarm').load();
  document.querySelector('.timer_alarm').load();
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
    document.querySelector('.timer__part--hours'),
    document.querySelector('.timer__part--minutes'),
    document.querySelector('.timer__part--seconds')
  );

  if (timer.intervals.length === 0) {
    clear();
  }
}

// Undo the last interval with button click
document.querySelector('.timer__btn--undo').addEventListener('click', () => {
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
    document.querySelector('.timer__btn--undo').classList.remove('btn--disabled');
  } else {
    document.querySelector('.timer__btn--undo').classList.add('btn--disabled');
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

  document.querySelector('.interval__part--hours').textContent = '00';
  document.querySelector('.interval__part--minutes').textContent = '00';
  document.querySelector('.interval__part--seconds').textContent = '00';
  document.querySelector('.timer__part--hours').textContent = '00';
  document.querySelector('.timer__part--minutes').textContent = '00';
  document.querySelector('.timer__part--seconds').textContent = '00';
  
  document.querySelector('.input__box').focus();
}

// Reset the timer with button click
document.querySelector('.timer__btn--clear').addEventListener('click', () => {
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
  var control = document.querySelector('.timer__btn--control');
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
document.querySelector('.input__box').addEventListener('click', (e) => {
  e.target.selectionStart = CARET_POS;
  e.target.selectionEnd = CARET_POS;
});

// Allow user to input interval if timer is stopped
document.querySelector('.input__box').addEventListener('focus', (e) => {
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
document.querySelector('.input').addEventListener('focus', () => {
  if (timer.interval === null) {
    document.querySelector('.input__box').focus();
  }
});

document.querySelector('.input__box').addEventListener('blur', (e) => {
  e.target.classList.add('input__box-disabled');
  e.target.removeEventListener('keydown', addWithEnter);
  colorAddButton();
  toggleInputInstructions();
});
document.querySelector('.input').addEventListener('blur', () => {
  document.querySelector('.input__box').blur();
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
document.querySelector('.input__btn--add').addEventListener('click', () => {
  addInterval();
  document.querySelector('.input__box').focus();
});

// Add Interval by pressing enter
function addWithEnter(e) {
  if (e.key === 'Enter') {
    addInterval();
  }
}

// Add button coloring event listeners
document.querySelector('.input__btn--add').addEventListener('focus', () => {
  colorAddButton();
});
document.querySelector('.input__btn--add').addEventListener('blur', () => {
  document.querySelector('.input__btn--add').classList.add('btn--disabled');
});

function colorAddButton() {
  const digits = [HOURS_TENS_DIGIT, HOURS_ONES_DIGIT, MINUTES_TENS_DIGIT, MINUTES_ONES_DIGIT, SECONDS_TENS_DIGIT, SECONDS_ONES_DIGIT];

  for (var i = 0; i < digits.length; i++) {
    if (document.querySelector('.input__box').value[digits[i]] !== '0') {
      document.querySelector('.input__btn--add').classList.remove('btn--disabled');
      break;
    } else {
      document.querySelector('.input__btn--add').classList.add('btn--disabled');
    }
  }
}

function toggleInputInstructions() {
  if (timer.interval === null) {
    if (document.activeElement == document.querySelector('.input__box')) {
      document.querySelector('.instructions--input').classList.add('instructions--input-disabled');
    } else {
      document.querySelector('.instructions--input').classList.remove('instructions--input-disabled');
    }
  } else {
    document.querySelector('.instructions--input').classList.add('instructions--input-disabled');
  }
}

function clearInput() {
  document.querySelector('.input__box').value = replaceAtIndex(document.querySelector('.input__box').value, SECONDS_ONES_DIGIT, '0');
  document.querySelector('.input__box').value = replaceAtIndex(document.querySelector('.input__box').value, SECONDS_TENS_DIGIT, '0');
  document.querySelector('.input__box').value = replaceAtIndex(document.querySelector('.input__box').value, MINUTES_ONES_DIGIT, '0');
  document.querySelector('.input__box').value = replaceAtIndex(document.querySelector('.input__box').value, MINUTES_TENS_DIGIT, '0');
  document.querySelector('.input__box').value = replaceAtIndex(document.querySelector('.input__box').value, HOURS_ONES_DIGIT, '0');
  document.querySelector('.input__box').value = replaceAtIndex(document.querySelector('.input__box').value, HOURS_TENS_DIGIT, '0');

  document.querySelector('.input__box').selectionStart = CARET_POS;
  document.querySelector('.input__box').selectionEnd = CARET_POS;
  
  colorAddButton();
}


window.addEventListener('DOMContentLoaded', function () {
  document.querySelector('.input__box').focus();
  colorUndoButton();
});