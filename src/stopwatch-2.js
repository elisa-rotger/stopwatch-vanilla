import { getFormattedTime, idCounter, updateNewRunningLap, createLapHTML, paintHighestLowest } from './utils.js';

let [startTime, elapsedTime, elapsedTimeLap, lapTotalTime] = [null, null, null, null];
let [highestLap, lowestLap] = [null, null]
let isRunning = false;
let laps = new Array();
let myTimer;

let generateLapId = idCounter();
let lapId;

const $timer = document.getElementById('timer');
const $startStopButton = document.getElementById('start-stop');
const $lapResetButton = document.getElementById('lap-reset');
const $lapList = document.getElementById('lap-list');
let $runningLap = $lapList.firstElementChild;

$startStopButton.innerText = 'Start';
$lapResetButton.innerText = 'Reset';

$startStopButton.onclick = () => {
    if (isRunning) {
        pauseTimer();
    } else {
        isRunning = true;
        lapId = lapId ? lapId : generateLapId(false);

        $startStopButton.innerText = 'Stop';
        $startStopButton.classList.replace('active-start', 'active-stop');
        $lapResetButton.innerText = 'Lap';

        updateNewRunningLap(lapId);

        window.requestAnimationFrame(startTimer);
    }
};

$lapResetButton.onclick = () => {
    isRunning ? (recordLap()) : (resetTimer());
};

const startTimer = (currentTimestamp) => {

    startTime = startTime ? startTime : (currentTimestamp - elapsedTime);
    elapsedTime = (currentTimestamp - startTime);
    elapsedTimeLap = (elapsedTime - lapTotalTime);
    
    $timer.firstElementChild.innerText = getFormattedTime(elapsedTime);
    $runningLap.lastElementChild.innerText = getFormattedTime(elapsedTimeLap);
    
    myTimer = window.requestAnimationFrame(startTimer);
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
    lapTotalTime = elapsedTime;

    let newLap = { 
        id: lapId,
        interval: elapsedTimeLap,
    };
    laps.push(newLap);
    createLapHTML(1);
    calculateHighestLowest(newLap);
    $lapList.lastElementChild.hasAttribute('id') ? null : $lapList.removeChild($lapList.lastElementChild);  
    $runningLap = $lapList.firstElementChild;
    lapId = generateLapId(false);
    updateNewRunningLap(lapId);
};

const calculateHighestLowest = (newLap) => {
    laps.length >= 2 ? paintHighestLowest(lowestLap, highestLap, 'remove') : null;
    
    if (laps.length === 1) {
        // lowestLap = newLap; 
        // highestLap = newLap;
        lowestLap = {...newLap}; 
        highestLap = {...newLap};
    }
    
    if (newLap.interval < lowestLap.interval) {
        // lowestLap = newLap;
        Object.assign(lowestLap, newLap);
    };

    if (newLap.interval > highestLap.interval) {
        // highestLap = newLap;
        Object.assign(highestLap, newLap);
    };

    laps.length >= 2 ? paintHighestLowest(lowestLap, highestLap, 'add') : null;
};

const resetTimer = () => {
    [startTime, elapsedTime, elapsedTimeLap, lapTotalTime] = [null, null, null, null];
    laps.length = 0;
    lapId = generateLapId(true);    
    $lapList.replaceChildren();
    $timer.firstElementChild.innerText = '00:00.00';

    createLapHTML(6);
    $runningLap = $lapList.firstElementChild;
};

/* Fade scrollbar effect */

$lapList.addEventListener('wheel', () => {
    const $lapContainer = document.querySelector('.lap-container');
    $lapContainer.classList.add('scrollbar-fade');

    setTimeout(() => {
        $lapContainer.classList.remove('scrollbar-fade');
    }, 1500);
});
