export default class Timer {
  constructor(root) {
    root.innerHTML = Timer.getHTML();
    
    this.el = {
      hours: root.querySelector('.timer__part--hours'),
      minutes: root.querySelector('.timer__part--minutes'),
      seconds: root.querySelector('.timer__part--seconds'),
      control: root.querySelector('.timer__btn--control'),
      reset: root.querySelector('.timer__btn--reset')
    };

    this.interval = null;
    this.remainingSeconds = 0;

    this.el.control.addEventListener('click', () => {
      if (this.interval === null) {
        this.start();
      } else {
        this.stop();
      }
    });

    this.el.reset.addEventListener('click', () => {
      const timeVals = prompt('Enter time (hh:mm:ss):').split(':');
      this.remainingSeconds = parseInt(timeVals[0], 10) * 3600 + parseInt(timeVals[1], 10) * 60 + parseInt(timeVals[2], 10);
      this.updateInterfaceTime();
    });
  }

  updateInterfaceTime() {
    const hours = Math.floor(this.remainingSeconds / 3600);
    const minutes = Math.floor(this.remainingSeconds / 60) - 60*hours;
    const seconds = this.remainingSeconds % 60;

    this.el.hours.textContent = hours.toString().padStart(2, "0");
    this.el.minutes.textContent = minutes.toString().padStart(2, "0");
    this.el.seconds.textContent = seconds.toString().padStart(2, "0");
  }

  updateInterfaceContols() {
    // TODO: if completely unstarted, display Start
    // TODO: change display to text, start btn -> Resume and pause btn -> Pause
    if (this.interval === null) { // if paused
      this.el.control.innerHTML = `<span class="material-icons">play_arrow</span>`;
      this.el.control.classList.add('timer__btn--start');
      this.el.control.classList.remove('timer__btn--stop');
    } else { // if running
      this.el.control.innerHTML = `<span class="material-icons">pause</span>`;
      this.el.control.classList.add('timer__btn--stop');
      this.el.control.classList.remove('timer__btn--start');
    }
  }

  start() {
    if (this.remainingSeconds === 0) return;
    
    this.interval = setInterval(() => {
      this.remainingSeconds -= 1;
      this.updateInterfaceTime();

      if (this.remainingSeconds === 0) {
        this.stop();
      }
    }, 1000);

    this.updateInterfaceContols();
  }

  stop() {
    clearInterval(this.interval);
    this.interval = null;
    this.updateInterfaceContols();
  }

  static getHTML() {
    return `
      <span class="timer__part timer__part--hours">00</span>
      <span class="timer__part">:</span>
      <span class="timer__part timer__part--minutes">00</span>
      <span class="timer__part">:</span>
      <span class="timer__part timer__part--seconds">00</span>
      <button type="button" class="timer__btn timer__btn--control timer__btn--start">
        <span class="material-icons">play_arrow</span>
      </button>
      <button type="button" class="timer__btn timer__btn--reset">
        <span class="material-icons">timer</span>
      </button>
    `;
  }
}