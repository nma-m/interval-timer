import Timer from './Timer.js';

/////////////////////////////
//          TIMER          //
//////////////// ////////////

var timer = new Timer()

// Add an Interval to Timer.intervals and update the interface
document.querySelector('.timer__btn--add').addEventListener('click', addInterval);

// Start and pause the timer
document.querySelector('.timer__btn--control').addEventListener('click', () => {
  if (timer.remainingSecondsTotal === 0) {
    // do nothing until they add time
  } else if (timer.interval === null) {
    start();
  } else {
    stop();
  }
});

// Reset the timer
document.querySelector('.timer__btn--cancel').addEventListener('click', () => {
  if (timer.intervals.length > 0) {
    clear();
  }
});

function addInterval() {
  if (timer.interval == null) { // only allow edits to timer when paused

    const hours = document.querySelectorAll('.interval__digit').item(0).innerText +
      document.querySelectorAll('.interval__digit').item(1).innerText;

    const minutes = document.querySelectorAll('.interval__digit').item(2).innerText +
      document.querySelectorAll('.interval__digit').item(3).innerText;

    const seconds = document.querySelectorAll('.interval__digit').item(4).innerText +
      document.querySelectorAll('.interval__digit').item(5).innerText;

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
  // TODO: if completely unstarted, display Start
  // TODO: change display to text, start btn -> Resume and pause btn -> Pause
  if (timer.interval === null) { // if paused
    control.innerText = 'Start';
    control.classList.add('timer__btn--start');
    control.classList.remove('timer__btn--stop');
  } else { // if running
    control.innerText = 'Pause';
    control.classList.add('timer__btn--stop');
    control.classList.remove('timer__btn--start');
  }
}

function start() {
  var currentInterval = timer.intervals[0];

  timer.interval = setInterval(() => {
    currentInterval.remainingSeconds -= 1;
    timer.remainingSecondsTotal -= 1;
    updateInterfaceTime();

    if (currentInterval.remainingSeconds === 0) {
      if (timer.intervals.length > 1) { // if there's another interval 
        currentInterval = timer.pop();
        updateInterfaceTime();
      } else {  // if it's the last interval
        timer.intervals.shift();
        stop();
      }
    }
  }, 1000);

  updateInterfaceContols();
}

function stop() {
  clearInterval(timer.interval);
  timer.interval = null;
  updateInterfaceContols();
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
}


///////////////////////////////////
//          TYPER INPUT          //
///////////////////////////////////

// Type in the desired input length
document.querySelector('.input').addEventListener('focus', () => {
  document.querySelector('.input').addEventListener('keydown', type);
  document.querySelector('.input').addEventListener('keydown', addWithEnter);
});

// Remove event listeners on the input div
document.querySelector('.input').addEventListener('blur', () => {
  document.querySelector('.input').removeEventListener('keydown', type);
  document.querySelector('.input').removeEventListener('keydown', addWithEnter);
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
            document.querySelectorAll('.interval__digit--set')[i].innerText
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
          document.querySelectorAll('.interval__digit--set')[i-1].innerText
        );
        // mark set value's old place unset
        unset(document.querySelectorAll('.interval__digit--set')[i-1]);
      }
    }
  }
}

function addWithEnter(e) {
  if (e.key === 'Enter') {
    addInterval();
  }
}

function set(element, text) {
  element.innerText = text;
  element.classList.add('interval__digit--set');
  element.classList.remove('interval__digit--unset');
}

function unset(element) {
  element.innerText = 0;
  element.classList.add('interval__digit--unset');
  element.classList.remove('interval__digit--set');
}