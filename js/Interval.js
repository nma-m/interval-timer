export default class Interval {
  constructor(hours, minutes, seconds) {
    this.remainingSeconds = 3600 * hours + 60 * minutes + seconds;

    const MAXSECONDS = 359999;
    if (this.remainingSeconds > MAXSECONDS) {
      this.remainingSeconds = MAXSECONDS;
    }
  }

  syncInterface(hoursElement, minutesElement, secondsElement) {
    const hours = Math.floor(this.remainingSeconds / 3600);
    const minutes = Math.floor(this.remainingSeconds / 60) - 60 * hours;
    const seconds = this.remainingSeconds % 60;

    hoursElement.textContent = hours.toString().padStart(2, "0");
    minutesElement.textContent = minutes.toString().padStart(2, "0");
    secondsElement.textContent = seconds.toString().padStart(2, "0");
  }
}