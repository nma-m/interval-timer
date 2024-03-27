export default class Timer {
  constructor() {
    this.intervals = new Array();
    this.remainingSeconds = 0;
    this.interval = null;
  }

  addInterval(hours, minutes, seconds) {
    const interval = new Timer.Interval(hours, minutes, seconds);

    const MAXSECONDS = 359999;
    if (this.remainingSeconds + interval.remainingSeconds > MAXSECONDS) {
      const truncatedIntervalSeconds = MAXSECONDS - this.remainingSeconds;
      if (truncatedIntervalSeconds > 0) {
        interval.remainingSeconds = truncatedIntervalSeconds;
        this.intervals.push(interval);
    }

      this.remainingSeconds = MAXSECONDS;
    }
    else {
      this.remainingSeconds += interval.remainingSeconds;
      this.intervals.push(interval);
    }
  }

  pop() {
    this.intervals.shift();
    return this.intervals[0];
  }
}

Timer.Interval = class {
  constructor(hours, minutes, seconds) {
    this.remainingSeconds = 3600 * hours + 60 * minutes + seconds;

    const MAXSECONDS = 359999;
    if (this.remainingSeconds > MAXSECONDS) {
      this.remainingSeconds = MAXSECONDS;
    }
  }
}