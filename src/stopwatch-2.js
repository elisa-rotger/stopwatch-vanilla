import { paintHighestLowest, getFormattedTime, idCounter, paintHighestLowestTest } from './utils.js';

let [startTime, elapsedTime, elapsedTimeLap, lapTotalTime] = [null, null, null, null];
let highestLap, lowestLap;
let isRunning = false;
let myTimer;
let laps = new Array();

let generateLapId = idCounter();
let lapId;

const $timer = document.getElementById('timer');
const $startStopButton = document.getElementById('start-stop');
const $lapResetButton = document.getElementById('lap-reset');
const $lapList = document.getElementById('lap-list');

$startStopButton.innerText = 'Start';
$lapResetButton.innerText = 'Reset';

$startStopButton.onclick = () => {
    isRunning ? (pauseTimer()) : (window.requestAnimationFrame(startTimer));
};

$lapResetButton.onclick = () => {
    isRunning ? (recordLap()) : (resetTimer());
};

const startTimer = (currentTimestamp) => {
    $startStopButton.innerText = 'Stop';
    $startStopButton.classList.replace('active-start', 'active-stop');
    $lapResetButton.innerText = 'Lap';

    const $runningLap = $lapList.firstElementChild;

    startTime = startTime ? startTime : (currentTimestamp - elapsedTime);
    elapsedTime = (currentTimestamp - startTime);
    elapsedTimeLap = (elapsedTime - lapTotalTime);

    lapId = lapId ? lapId : generateLapId(false);

    $runningLap.classList.remove('empty');
    $runningLap.firstElementChild.innerText = `Lap ${lapId}`;
    $runningLap.id = `lap-${lapId}`;
    $runningLap.className = 'lap';
    
    $timer.firstElementChild.innerText = getFormattedTime(elapsedTime);
    $runningLap.lastElementChild.innerText = getFormattedTime(elapsedTimeLap);

    isRunning = true;
    
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
    createLapHTML();
    calculateHighestLowest(newLap);
    
    let lastLapClasses = $lapList.lastElementChild.classList;
    lastLapClasses.contains('empty') ? $lapList.removeChild($lapList.lastElementChild) : null;  

    lapId = generateLapId(false);
};

const createLapHTML = () => {
    const $lap = document.createElement('tr');
    const $lapNumber = document.createElement('td');
    const $lapTimer = document.createElement('td');
    
    $lap.appendChild($lapNumber);
    $lap.appendChild($lapTimer);
    $lapList.insertBefore($lap, $lapList.firstChild);
};

const calculateHighestLowest = (newLap) => {

    if (laps.length === 1) {
        // lowestLap = newLap; 
        // highestLap = newLap;

        lowestLap = {...newLap}; 
        highestLap = {...newLap};
    }
    
    if (newLap.interval < lowestLap.interval) {
        console.log('lowest');

        // lowestLap = newLap;

        lowestLap.id = newLap.id;
        lowestLap.interval = newLap.interval;

        // Object.assign(lowestLap, newLap);
    };

    if (newLap.interval > highestLap.interval) {
        console.log('highest');

        // highestLap = newLap;

        highestLap.id = newLap.id;
        highestLap.interval = newLap.interval;

        // Object.assign(highestLap, newLap);
    };

    laps.length >= 2 ? paintHighestLowest(lowestLap, highestLap) : null;
};

const resetTimer = (event) => {
    [startTime, elapsedTime, elapsedTimeLap, lapTotalTime] = [null, null, null, null];
    // Brand new array -> new reference 
    // laps = new Array();
    // Same reference -> if other variables 'point' to laps, this will also affect them
    laps.length = 0;

    // Is there a way to re-set the counter in the closure without having to instance another one?
    // generateLapId = idCounter();
    // lapId = null;
    // Maybe like this?
    lapId = generateLapId(true);
    
    $lapList.replaceChildren();
    
    for (let i = 1; i <= 6; i++) {
        const classes = ['lap', 'empty'];
        
        const $defaultLap = document.createElement('tr');
        const $defaultLapVal = document.createElement('td');
        const $defaultLapNum = document.createElement('td');
        
        $defaultLap.classList.add(...classes);
        
        $defaultLap.appendChild($defaultLapVal);
        $defaultLap.appendChild($defaultLapNum);
        
        $lapList.appendChild($defaultLap);
    }
    
    $timer.firstElementChild.innerText = '00:00.00';
};

/* Fade scrollbar effect */

$lapList.addEventListener('wheel', () => {
    const $lapContainer = document.querySelector('.lap-container');
    $lapContainer.classList.add('scrollbar-fade');

    setTimeout(() => {
        $lapContainer.classList.remove('scrollbar-fade');
    }, 1500);
});
