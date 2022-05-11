import Interval from "./Interval.js";

export default class Timer {
  constructor() {
    this.intervals = new Array();
    this.remainingSecondsTotal = 0;
    this.interval = null;
  }

  addInterval(hours, minutes, seconds) {
    const interval = new Interval(hours, minutes, seconds);

    const MAXSECONDS = 359999;
    if (this.remainingSecondsTotal + interval.remainingSeconds > MAXSECONDS) {
      const truncatedIntervalSeconds = MAXSECONDS - this.remainingSecondsTotal;
      if (truncatedIntervalSeconds > 0) {
        interval.remainingSeconds = truncatedIntervalSeconds;
        this.intervals.push(interval);
      }

      this.remainingSecondsTotal = MAXSECONDS;
    } else {
      this.remainingSecondsTotal += interval.remainingSeconds;
      this.intervals.push(interval);
    }
  }

  syncInterface(hoursElement, minutesElement, secondsElement) {
  const hours = Math.floor(this.remainingSecondsTotal / 3600);
  const minutes = Math.floor(this.remainingSecondsTotal / 60) - 60 * hours;
  const seconds = this.remainingSecondsTotal % 60;

  hoursElement.textContent = hours.toString().padStart(2, "0");
  minutesElement.textContent = minutes.toString().padStart(2, "0");
  secondsElement.textContent = seconds.toString().padStart(2, "0");
}

  pop() {
    this.intervals.shift();
    return this.intervals[0];
  }
}