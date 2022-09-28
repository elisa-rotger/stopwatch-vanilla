import { getFormattedTime, idCounter, updateNewRunningLap, createLapHTML, paintHighestLowest } from './utils.js';

createLapHTML(6);
let generateLapId = idCounter();

let interval = null;
let isRunning = false;
const laps = new Array();
let lapId;

let [previousTimeTimer, passedTimeTimer] = [null, null];
let [previousTimeLap, passedTimeLap] = [null, null];
let [highestLap, lowestLap] = [null, null];

const $timer = document.getElementById('timer');
const $startStopButton = document.getElementById('start-stop');
const $lapResetButton = document.getElementById('lap-reset');
const $lapList = document.getElementById('lap-list');
let $runningLap = $lapList.firstElementChild;

$startStopButton.innerText = 'Start';
$lapResetButton.innerText = 'Reset';

$startStopButton.onclick = () => {
    isRunning ? (pauseTimer()) : (startTimer());
};

$lapResetButton.onclick = () => {
    isRunning ? (recordLap()) : (clearInterval(interval), resetTimer());
};

const startTimer = () => {
    isRunning = true;
    lapId = lapId ? lapId : generateLapId(false);

    $startStopButton.innerText = 'Stop';
    $startStopButton.classList.replace('start', 'stop');
    $lapResetButton.innerText = 'Lap';

    updateNewRunningLap(lapId);

    interval = setInterval(renderTime, 10);
}

const renderTime = () => {
    // Time calc for clock
    previousTimeTimer = previousTimeTimer ? previousTimeTimer : Date.now();
    passedTimeTimer += Date.now() - previousTimeTimer;
    previousTimeTimer = Date.now();

    // Time calc for lap
    previousTimeLap = previousTimeLap ? previousTimeLap : Date.now();
    previousTimeLap = isRunning ? previousTimeLap : Date.now();
    passedTimeLap += Date.now() - previousTimeLap;
    previousTimeLap = Date.now();

    $timer.firstElementChild.innerText = getFormattedTime(passedTimeTimer);
    $runningLap.lastElementChild.innerText = getFormattedTime(passedTimeLap);
}

const pauseTimer = () => {
    clearInterval(interval);
    isRunning = false;

    $startStopButton.innerText = 'Start';
    $startStopButton.classList.replace('stop', 'start');
    $lapResetButton.innerText = 'Reset';
}

const recordLap = () => {

    let newLap = { id: lapId, interval: passedTimeLap };
    laps.push(newLap);
    [previousTimeLap, passedTimeLap] = [null, null];

    calculateHighestLowest(newLap);

    createLapHTML(1);
    $runningLap = $lapList.firstElementChild;
    lapId = generateLapId(false);
    updateNewRunningLap(lapId);
    $lapList.lastElementChild.hasAttribute('id') ? null : $lapList.removeChild($lapList.lastElementChild); 
}

const calculateHighestLowest = (newLap) => {
    laps.length >= 2 ? paintHighestLowest(lowestLap, highestLap, 'remove') : null;
    
    if (laps.length === 1) lowestLap = newLap, highestLap = newLap;
    
    if (newLap.interval < lowestLap.interval) lowestLap = newLap;
    if (newLap.interval > highestLap.interval) highestLap = newLap;

    laps.length >= 2 ? paintHighestLowest(lowestLap, highestLap, 'add') : null;
};

const resetTimer = () => {
    [previousTimeTimer, passedTimeTimer] = [null, null];
    [previousTimeLap, passedTimeLap] = [null, null];
    laps.length = 0;
    lapId = generateLapId(true);    
    $lapList.replaceChildren();
    $timer.firstElementChild.innerText = '00:00.00';
    
    createLapHTML(6);
    $runningLap = $lapList.firstElementChild;
}

$lapList.addEventListener('wheel', () => {
    const $lapContainer = document.querySelector('.lap-container');
    $lapContainer.classList.add('scrollbar-fade');

    setTimeout(() => {
        $lapContainer.classList.remove('scrollbar-fade');
    }, 1000);
});