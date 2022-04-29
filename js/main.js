import Timer from './Timer.js';

var timer = new Timer()

// Add an Interval to Timer.intervals and update the interface
document.querySelector('.interval__input--add').addEventListener('click', () => {
  if (timer.interval == null) { // only allow edits to timer when paused
    // add interval to timer
    timer.addInterval(
      parseInt(document.querySelector('.interval__input--hours').value, 10),
      parseInt(document.querySelector('.interval__input--minutes').value, 10),
      parseInt(document.querySelector('.interval__input--seconds').value, 10)
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
    document.querySelector('.interval__input--hours').value = 1
    document.querySelector('.interval__input--minutes').value = 1
    document.querySelector('.interval__input--seconds').value = 1
    console.log(timer);
  }
});

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