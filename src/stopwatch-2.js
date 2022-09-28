import { getFormattedTime, idCounter, updateNewRunningLap, createLapHTML, paintHighestLowest } from './utils.js';

createLapHTML(6);
let generateLapId = idCounter();

const $timer = document.getElementById('timer');
const $startStopButton = document.getElementById('start-stop');
const $lapResetButton = document.getElementById('lap-reset');
const $lapList = document.getElementById('lap-list');

let $runningLap = $lapList.firstElementChild;

let [startTime, elapsedTime, lapTotalTime] = [null, null, null];
let [highestLap, lowestLap] = [null, null];
let isRunning = false;
let laps = [];
let myTimer;
let lapId;

$startStopButton.innerText = 'Start';
$lapResetButton.innerText = 'Reset';

$startStopButton.onclick = () => {
    isRunning ? pauseTimer() : startTimer();
};

$lapResetButton.onclick = () => {
    isRunning ? recordLap() : resetTimer();
};

const startTimer = () => {
    isRunning = true;
    lapId = lapId ? lapId : generateLapId(false);

    $startStopButton.innerText = 'Stop';
    $startStopButton.classList.replace('active-start', 'active-stop');
    $lapResetButton.innerText = 'Lap';

    updateNewRunningLap($runningLap, lapId);

    window.requestAnimationFrame(renderTime);
}

const renderTime = (currentTimestamp) => {

    startTime = startTime ? startTime : (currentTimestamp - elapsedTime);
    elapsedTime = (currentTimestamp - startTime);
    
    elapsedTime > 3600000 ? $timer.firstElementChild.classList.add('hourly') : null;

    $timer.firstElementChild.innerText = getFormattedTime(elapsedTime);
    $runningLap.lastElementChild.innerText = getFormattedTime(elapsedTime - lapTotalTime);
    
    myTimer = window.requestAnimationFrame(renderTime);
};

const pauseTimer = () => {
    window.cancelAnimationFrame(myTimer);
    isRunning = false;
    startTime = null;

    $startStopButton.innerText = 'Start';
    $startStopButton.classList.replace('active-stop', 'active-start');
    $lapResetButton.innerText = 'Reset';
};

const recordLap = () => {
    let newLap = { id: lapId, interval: elapsedTime - lapTotalTime };
    laps = [...laps, newLap];
    lapTotalTime = elapsedTime;

    calculateHighestLowest(newLap);

    createLapHTML(1);
    $runningLap = $lapList.firstElementChild;
    lapId = generateLapId(false);
    updateNewRunningLap($runningLap, lapId);
    $lapList.lastElementChild.hasAttribute('id') ? null : $lapList.removeChild($lapList.lastElementChild);  
};

const calculateHighestLowest = (newLap) => {
    laps.length >= 2 ? paintHighestLowest(lowestLap, highestLap, 'remove') : null;
    
    if (laps.length === 1) lowestLap = newLap, highestLap = newLap;
    
    if (newLap.interval < lowestLap.interval) lowestLap = newLap;
    if (newLap.interval > highestLap.interval) highestLap = newLap;

    laps.length >= 2 ? paintHighestLowest(lowestLap, highestLap, 'add') : null;
};

const resetTimer = () => {
    [startTime, elapsedTime, lapTotalTime] = [null, null, null];
    laps = [];
    lapId = generateLapId(true);    
    $lapList.replaceChildren();
    $timer.firstElementChild.innerText = '00:00.00';

    createLapHTML(6);
    $runningLap = $lapList.firstElementChild;
};

$lapList.addEventListener('wheel', () => {
    const $lapContainer = document.querySelector('.lap-container');
    $lapContainer.classList.add('scrollbar-fade');

    setTimeout(() => {
        $lapContainer.classList.remove('scrollbar-fade');
    }, 1500);
});