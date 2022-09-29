import {
  getFormattedTime,
  createIdCounter,
  updateNewRunningLap,
  generateLapRows,
  indicateHighestLowestLap,
} from './utils.js';

generateLapRows(6);

const HOURLY_INDICATOR = 3600000;
const generateLapId = createIdCounter();

const $timer = document.getElementById('timer');
const $startStopButton = document.getElementById('start-stop');
const $lapResetButton = document.getElementById('lap-reset');
const $lapList = document.getElementById('lap-list');

let $runningLap = $lapList.firstElementChild;

const initialState = {
  startTime: 0,
  elapsedTime: 0,
  lapTotalTime: 0,
  highestLap: 0,
  lowestLap: 0,
  laps: [],
  isRunning: false,
};

let stopwatchState = {
  ...initialState,
};

let timerAnimationId;
let lapId;

$startStopButton.innerText = 'Start';
$lapResetButton.innerText = 'Reset';

$startStopButton.onclick = () =>
  stopwatchState.isRunning ? pauseTimer() : startTimer();

$lapResetButton.onclick = () =>
  stopwatchState.isRunning ? recordLap() : resetTimer();

const startTimer = () => {
  stopwatchState = {
    ...stopwatchState,
    isRunning: true,
  };

  // ?? is called nullish coalescing
  // if the value on the right is null then use the left side value
  lapId = lapId ?? generateLapId(false);

  $startStopButton.innerText = 'Stop';
  $startStopButton.classList.replace('active-start', 'active-stop');
  $lapResetButton.innerText = 'Lap';

  updateNewRunningLap($runningLap, lapId);
  window.requestAnimationFrame(renderTime);
};

const renderTime = (currentTimestamp) => {
  const startTime =
    stopwatchState.startTime ?? currentTimestamp - stopwatchState.elapsedTime;
  const elapsedTime = currentTimestamp - stopwatchState.startTime;

  stopwatchState = {
    ...stopwatchState,
    startTime,
    elapsedTime,
  };

  // random numbers that don't immediately make sense should be
  // set to a const so that it is clear why that number is being used
  if (stopwatchState.elapsedTime > HOURLY_INDICATOR) {
    $timer.firstElementChild.classList.add('hourly');
  }

  $timer.firstElementChild.innerText = getFormattedTime(
    stopwatchState.elapsedTime
  );

  $runningLap.lastElementChild.innerText = getFormattedTime(
    stopwatchState.elapsedTime - stopwatchState.lapTotalTime
  );

  timerAnimationId = window.requestAnimationFrame(renderTime);
};

const pauseTimer = () => {
  window.cancelAnimationFrame(timerAnimationId);

  stopwatchState = {
    ...stopwatchState,
    isRunning: false,
    startTime: 0,
  };

  $startStopButton.innerText = 'Start';
  $startStopButton.classList.replace('active-stop', 'active-start');
  $lapResetButton.innerText = 'Reset';
};

const recordLap = () => {
  const newLap = {
    id: lapId,
    interval: stopwatchState.elapsedTime - stopwatchState.lapTotalTime,
  };

  stopwatchState = {
    ...stopwatchState,
    // don't forget to makes sure the previous values of the laps array are there
    laps: [...stopwatchState.laps, newLap],
    lapTotalTime: stopwatchState.elapsedTime,
  };

  calculateHighestLowestLap(newLap);
  generateLapRows(1);

  $runningLap = $lapList.firstElementChild;
  lapId = generateLapId(false);

  updateNewRunningLap($runningLap, lapId);
  $lapList.lastElementChild.hasAttribute('id') ??
    $lapList.removeChild($lapList.lastElementChild);
};

const calculateHighestLowestLap = (newLap) => {
  if (stopwatchState.laps?.length >= 2) {
    indicateHighestLowestLap(
      stopwatchState.lowestLap,
      stopwatchState.highestLap,
      'remove'
    );
  }

  if (stopwatchState.laps?.length === 1) {
    stopwatchState = {
      ...stopwatchState,
      lowestLap: newLap,
      highestLap: newLap,
    };
  }

  if (newLap.interval < stopwatchState.lowestLap?.interval) {
    stopwatchState = {
      ...stopwatchState,
      lowestLap: newLap,
    };
  }

  if (newLap.interval > stopwatchState.highestLap?.interval) {
    stopwatchState = {
      ...stopwatchState,
      highestLap: newLap,
    };
  }

  if (stopwatchState.laps.length >= 2) {
    indicateHighestLowestLap(
      stopwatchState.lowestLap,
      stopwatchState.highestLap,
      'add'
    );
  }
};

const resetTimer = () => {
  stopwatchState = {
    ...initialState,
  };

  lapId = generateLapId(true);

  $lapList.replaceChildren();
  $timer.firstElementChild.innerText = '00:00.00';

  generateLapRows(6);
  $runningLap = $lapList.firstElementChild;
};

$lapList.addEventListener('wheel', () => {
  const $lapContainer = document.querySelector('.lap-container');
  $lapContainer.classList.add('scrollbar-fade');

  setTimeout(() => {
    $lapContainer.classList.remove('scrollbar-fade');
  }, 1500);
});
