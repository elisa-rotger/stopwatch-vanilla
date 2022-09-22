import { paintHighestLowest, getFormattedTime } from './utils.js';

let [startTime, elapsedTime, elapsedTimeLap, lapTotal] = [null, null, null, null];
let isRunning = false;
let myTimer;
let laps = new Array();

let [ highestLap, lowestLap ] = [{ interval: 0 }, { interval: 0 }];

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
    $startStopButton.classList.replace('start', 'stop');
    $lapResetButton.innerText = 'Lap';

    const $runningLap = $lapList.firstElementChild;

    startTime = startTime ? startTime : (currentTimestamp - elapsedTime);
    elapsedTime = (currentTimestamp - startTime);
    elapsedTimeLap = (elapsedTime - lapTotal);

    $runningLap.classList.remove('empty');
    $runningLap.firstElementChild.innerText = `Lap ${laps.length+1}`;
    $runningLap.id = $runningLap.hasAttribute('id') ? $runningLap.id : `lap-1`;
    
    $timer.firstElementChild.innerText = getFormattedTime(elapsedTime);
    $runningLap.lastElementChild.innerText = getFormattedTime(elapsedTimeLap);

    isRunning = true;
    
    myTimer = window.requestAnimationFrame(startTimer);
};

const pauseTimer = () => {
    isRunning = false;

    $startStopButton.innerText = 'Start';
    $startStopButton.classList.replace('stop', 'start');
    $lapResetButton.innerText = 'Reset';

    window.cancelAnimationFrame(myTimer);

    elapsedTime = performance.now() - startTime;
    startTime = null;
};

const recordLap = () => {

    lapTotal = elapsedTime;
    let lapInterval = laps[laps.length-1] ? (lapTotal - laps[laps.length-1].total) : lapTotal;

    laps.push({ 
        id: laps.length,
        interval: lapInterval,
        total: elapsedTime
    });

    createLapHTML();

    if (lowestLap.interval === 0) lowestLap = { id: laps.length, interval: lapInterval, total: elapsedTime };
    if (lapInterval > highestLap.interval) highestLap = { id: laps.length, interval: lapInterval, total: elapsedTime };
    if (lapInterval < lowestLap.interval) lowestLap = { id: laps.length, interval: lapInterval, total: elapsedTime };

    let lastLapClasses = $lapList.lastElementChild.classList;
    lastLapClasses.contains('empty') ? $lapList.removeChild($lapList.lastElementChild) : null;

    if (laps.length >= 3) paintHighestLowest(lowestLap, highestLap);

};

const createLapHTML = () => {
    const $lap = document.createElement('tr');
    const $lapNumber = document.createElement('td');
    const $lapTimer = document.createElement('td');

    $lapNumber.innerText = `Lap ${laps.length+1}`;
    $lap.id = `lap-${laps.length+1}`;
    $lap.className = 'lap';

    $lap.appendChild($lapNumber);
    $lap.appendChild($lapTimer);
    $lapList.insertBefore($lap, $lapList.firstChild);
};

const resetTimer = () => {
    [startTime, elapsedTime, elapsedTimeLap, lapTotal] = [null, null, null, null];
    laps = new Array();
    
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

$lapList.addEventListener('wheel', () => {
    const $lapContainer = document.querySelector('.lap-container');
    $lapContainer.classList.add('scrollbar-fade');

    setTimeout(() => {
        $lapContainer.classList.remove('scrollbar-fade');
    }, 1000);
});
