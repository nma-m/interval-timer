import Timer from './Timer.js';

/////////////////////////////
//          TIMER          //
//////////////// ////////////

var timer = new Timer();

// Start and pause the timer with button click
document.querySelector('.timer__btn--control').addEventListener('click', () => {
  start();
});

// Start and pause the timer with Space
document.addEventListener('keydown', (e) => {
  if (e.key === ' ') {
    e.preventDefault();
    start();
  }
});

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

function addInterval() {
  if (timer.interval == null) { // only allow edits to timer when paused

    const hours = document.querySelectorAll('.interval__digit')[0].textContent +
      document.querySelectorAll('.interval__digit')[1].textContent;

    const minutes = document.querySelectorAll('.interval__digit')[2].textContent +
      document.querySelectorAll('.interval__digit')[3].textContent;

    const seconds = document.querySelectorAll('.interval__digit')[4].textContent +
      document.querySelectorAll('.interval__digit')[5].textContent;

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
        timer.intervals[0].syncInterface(
          document.querySelector('.interval__part--hours'),
          document.querySelector('.interval__part--minutes'),
          document.querySelector('.interval__part--seconds')
        );
      }

      // update the total time display
      timer.syncInterface(
        document.querySelector('.timer__part--hours'),
        document.querySelector('.timer__part--minutes'),
        document.querySelector('.timer__part--seconds')
      );

      // Reset the input fields
      for (var element of document.querySelectorAll('.interval__digit').values()) {
        unset(element);
      }
      colorDigitUnits();
    }
  }
}

function updateInterfaceTime() {
  // update the current interval display
  timer.intervals[0].syncInterface(
    document.querySelector('.interval__part--hours'),
    document.querySelector('.interval__part--minutes'),
    document.querySelector('.interval__part--seconds')
  );

  // update the total time display
  timer.syncInterface(
    document.querySelector('.timer__part--hours'),
    document.querySelector('.timer__part--minutes'),
    document.querySelector('.timer__part--seconds')
  );
}

function updateInterfaceContols() {
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
}

function start() {
  if (timer.remainingSecondsTotal === 0) {
    // do nothing until they add time
  } else if (timer.interval === null) {
    var currentInterval = timer.intervals[0];

    timer.interval = setInterval(() => {
      currentInterval.remainingSeconds -= 1;
      timer.remainingSecondsTotal -= 1;
      updateInterfaceTime();

      if (currentInterval.remainingSeconds === 0) {
        if (timer.intervals.length > 1) { // if there's another interval 
          currentInterval = timer.pop();
          updateInterfaceTime();
          document.querySelector('.interval_alarm').play();
        } else {  // if it's the last interval
          timer.intervals.shift();
          stop();
          document.querySelector('.input').focus();
          document.querySelector('.timer_alarm').play();
        }
      }
    }, 1000);

    updateInterfaceContols();
    document.querySelector('.input').blur();
  } else {
    stop();
  }
}

function stop() {
  clearInterval(timer.interval);
  timer.interval = null;
  updateInterfaceContols();
  toggleInputInstructions();
}

function clear() {
  if (timer.interval != null) {
    stop();
  }

  timer.intervals.length = 0;
  timer.remainingSecondsTotal = 0;
  timer.interval = null;
  updateInterfaceContols();

  document.querySelector('.interval__part--hours').textContent = '00';
  document.querySelector('.interval__part--minutes').textContent = '00';
  document.querySelector('.interval__part--seconds').textContent = '00';
  document.querySelector('.timer__part--hours').textContent = '00';
  document.querySelector('.timer__part--minutes').textContent = '00';
  document.querySelector('.timer__part--seconds').textContent = '00';
  
  document.querySelector('.input').focus();
}


///////////////////////////////////
//          TYPER INPUT          //
///////////////////////////////////

// Add an Interval to Timer.intervals and update the interface
document.querySelector('.input__btn--add').addEventListener('click', addInterval);

// Allow user to input interval if timer is stopped
document.querySelector('.input').addEventListener('focus', () => {
  if (timer.interval === null) {
    document.querySelector('.input').addEventListener('keydown', type);
    document.querySelector('.input').addEventListener('keydown', addWithEnter);
    toggleCaret();
    toggleInputInstructions();
  }
});

// Disable typing in the input box
document.querySelector('.input').addEventListener('blur', () => {
  document.querySelector('.input').removeEventListener('keydown', type);
  document.querySelector('.input').removeEventListener('keydown', addWithEnter);
  toggleCaret();
  toggleInputInstructions();
});

function type(e) {
  if (e.key in [0,1,2,3,4,5,6,7,8,9]) {
    if (document.querySelectorAll('.interval__digit--set').length === 6) {
      // no more values to enter
    } else {
      if (document.querySelectorAll('.interval__digit--set').length === 0) {
        set(
          document.querySelectorAll('.interval__digit--unset')[document.querySelectorAll('.interval__digit--unset').length - 1],
          e.key
        );
      } else {
        // for each set value
        for (var i = 0; i < document.querySelectorAll('.interval__digit--set').length; i++) {
          // shift set value over
          set(
            document.querySelectorAll('.interval__digit--unset')[document.querySelectorAll('.interval__digit--unset').length - 1],
            document.querySelectorAll('.interval__digit--set')[i].textContent
          );
          // mark set value's old place unset
          unset(document.querySelectorAll('.interval__digit--set')[i+1]);
        }
        // insert new value at the end
        set(
          document.querySelectorAll('.interval__digit--unset')[document.querySelectorAll('.interval__digit--unset').length - 1],
          e.key
        );
      }
    }
  } else if (e.key === 'Backspace') {
    if (document.querySelector('.interval__digit--set') === null) {
      // nothing to backspace
    } else {
      // unset last set value
      unset(document.querySelectorAll('.interval__digit--set')[document.querySelectorAll('.interval__digit--set').length - 1]);
      // for each set value
      for (var i = document.querySelectorAll('.interval__digit--set').length; i > 0; i--) {
        // shift set value over
        set(
          document.querySelectorAll('.interval__digit--unset')[document.querySelectorAll('.interval__digit--unset').length - 1],
          document.querySelectorAll('.interval__digit--set')[i-1].textContent
        );
        // mark set value's old place unset
        unset(document.querySelectorAll('.interval__digit--set')[i-1]);
      }
    }
  }
  // Color the unit labels
  colorDigitUnits();
}

function addWithEnter(e) {
  if (e.key === 'Enter') {
    addInterval();
  }
}

function set(element, text) {
  element.textContent = text;
  element.classList.add('interval__digit--set');
  element.classList.remove('interval__digit--unset');
}

function unset(element) {
  element.textContent = 0;
  element.classList.add('interval__digit--unset');
  element.classList.remove('interval__digit--set');
}

function colorDigitUnits() {
  if (document.querySelectorAll('.interval__digit--set').length === 0) {
    document.querySelectorAll('.digit__unit').forEach(element => element.classList.add('digit__unit--unset'));
    document.querySelector('.input__btn--add').classList.add('input__btn--add-disabled');
  } else if (document.querySelectorAll('.interval__digit--set').length < 3) {
    document.querySelectorAll('.digit__unit')[2].classList.remove('digit__unit--unset');
    document.querySelectorAll('.digit__unit')[1].classList.add('digit__unit--unset');
    document.querySelector('.input__btn--add').classList.remove('input__btn--add-disabled');
  } else if (document.querySelectorAll('.interval__digit--set').length < 5) {
    document.querySelectorAll('.digit__unit')[1].classList.remove('digit__unit--unset');
    document.querySelectorAll('.digit__unit')[0].classList.add('digit__unit--unset');
  } else {
    document.querySelectorAll('.digit__unit')[0].classList.remove('digit__unit--unset');
  }
}

function toggleCaret() {
  if (document.activeElement == document.querySelector('.input')) {
    document.querySelector('.caret').classList.remove('caret-disabled');
    document.querySelector('.digit__unit--sec').classList.add('digit__unit--sec-with-caret');
  } else {
    document.querySelector('.caret').classList.add('caret-disabled');
    document.querySelector('.digit__unit--sec').classList.remove('digit__unit--sec-with-caret');
  }
}

function toggleInputInstructions() {
  if (timer.interval === null) {
    if (document.activeElement == document.querySelector('.input')) {
      document.querySelector('.instructions--input').classList.add('instructions--input-disabled');
    } else {
      document.querySelector('.instructions--input').classList.remove('instructions--input-disabled');
    }
  } else {
    document.querySelector('.instructions--input').classList.add('instructions--input-disabled');
  }
}

window.addEventListener('DOMContentLoaded', function () {
  document.querySelector('.input').focus();
});