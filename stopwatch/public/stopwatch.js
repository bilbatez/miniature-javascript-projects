"use strict";
let state;
let millisecond = 0,
  hour = 0,
  minute = 0,
  second = 0;

function start() {
  reset();
  state = setInterval(() => {
    second++;
    if (second >= 60) {
      second = 0;
      minute++;
      if (minute >= 60) {
        minute = 0;
        hour++;
      }
    }
    render();
  }, 1000);
}

function render() {
  document.getElementById("second").innerHTML = constructMessage(second);
  document.getElementById("minute").innerHTML = constructMessage(minute);
  document.getElementById("hour").innerHTML = constructMessage(hour);
}

function constructMessage(time) {
  return ("0" + time).slice(-2);
}

function stop() {
  clearInterval(state);
}

function reset() {
  stop();
  second = minute = hour = 0;
  render();
}
