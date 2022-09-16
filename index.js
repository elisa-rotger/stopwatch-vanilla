let [milliseconds, seconds, minutes] = [0, 0, 0];
let [ms, s, min] = [0, 0, 0];
let [lapMilliseconds, lapSeconds, lapMinutes] = [0, 0, 0];
let [lapMs, lapSec, lapMin] = [0, 0, 0];
let interval = null;
let isRunning = false;
let laps = new Array();

const timer = document.getElementById('timer');
const startStopButton = document.getElementById('start-stop');
const lapResetButton = document.getElementById('lap-reset');

const lapList = document.getElementById('lap-list')

startStopButton.innerHTML = 'Start';
lapResetButton.innerHTML = 'Reset';

startStopButton.addEventListener('click', () => {
    isRunning ? (pauseTimer()) : (interval = setInterval(startTimer, 10));
});

lapResetButton.addEventListener('click', () => {
    isRunning ? (recordLap()) : (clearInterval(interval), empty());
});

startTimer = () => {
    isRunning = true;
    startStopButton.innerHTML = 'Stop';
    startStopButton.classList.replace('start', 'stop');
    lapResetButton.innerHTML = 'Lap';

    const runningLap = lapList.firstElementChild;

    // TODO: Refactor this ?
    milliseconds += 10;
    if (milliseconds === 1000) {
        milliseconds = 0;
        seconds += 1;
        if (seconds === 60) {
            seconds = 0;
            minutes += 1;
        };
    };

    lapMilliseconds += 10;
    if (lapMilliseconds === 1000) {
        lapMilliseconds = 0;
        lapSeconds += 1;
        if (lapSeconds === 60) {
            lapSeconds = 0;
            lapMinutes += 1;
        };
    };

    ms = milliseconds === 0 ? '000' 
        : milliseconds < 100 ? '0' + milliseconds
        : milliseconds;
    s = seconds < 10 ? '0' + seconds : seconds;
    min = minutes < 10 ? '0' + minutes : minutes;

    lapMs = lapMilliseconds < 100 ? '0' + lapMilliseconds : lapMilliseconds;
    lapSec = lapSeconds < 10 ? '0' + lapSeconds : lapSeconds;
    lapMin = lapMinutes < 10 ? '0' + lapMinutes : lapMinutes;

    /* */ 

    let clock = `${min}:${s}.${ms.toString().slice(0, -1)}`;
    let lapClock = `${lapMin}:${lapSec}.${lapMs.toString().slice(0, -1)}`;

    runningLap.lastElementChild.innerHTML = lapClock;
    runningLap.lastElementChild.classList.remove('empty');
    runningLap.firstElementChild.innerHTML = `Lap ${laps.length+1}`;
    runningLap.firstElementChild.classList.remove('empty');

    timer.innerHTML = clock;
}

pauseTimer = () => {
    clearInterval(interval);
    isRunning = false;

    startStopButton.innerHTML = 'Start';
    startStopButton.classList.replace('stop', 'start');
    lapResetButton.innerHTML = 'Reset';
}

recordLap = () => {

    [lapMilliseconds, lapSeconds, lapMinutes] = [0, 0, 0];
    [lapMs, lapSec, lapMin] = [0, 0, 0];

    let totalTime = (minutes*60*1000) + (seconds*1000) + milliseconds;
    let value = `${min}:${s}.${ms.toString().slice(0, -1)}`;

    if (laps.length === 0) { 
        laps.push({ value: value, total: totalTime, interval: totalTime });
        createLap();
    } else {
        let intervalLap = totalTime - laps[laps.length-1].total;
        value = convertToValue(intervalLap);
        laps.push({ value: value, total: totalTime, interval: intervalLap });
        createLap();
    }

    let lastLapClasses = lapList.lastElementChild.firstElementChild.classList;
    lastLapClasses.contains('empty') ? lapList.removeChild(lapList.lastElementChild) : null;

    if (laps.length >= 3) {
        let edgeLaps = findHighestLowest();
        paintHighestLowest(edgeLaps[0], edgeLaps[1]);
    };

}

createLap = () => {
    const lap = document.createElement('tr');
    const lapNumber = document.createElement('td');
    const lapTimer = document.createElement('td');

    lapTimer.innerHTML = `00:00.0`;
    lapNumber.innerHTML = `Lap ${laps.length+1}`;
    lapTimer.className = 'lap';
    lapNumber.className = 'lap';

    lap.appendChild(lapNumber);
    lap.appendChild(lapTimer);
    lapList.insertBefore(lap, lapList.firstChild);
}

convertToValue = (totalMs) => {
    let minLap = Math.floor(totalMs / 60000);
    let sLap = Math.floor((totalMs % 60000) / 1000);
    let msLap = totalMs - (minLap * 60000) - (sLap * 1000);

    msLap = msLap < 100 ? '0' + msLap : msLap;
    sLap = sLap < 10 ? '0' + sLap : sLap;
    minLap = minLap < 10 ? '0' + minLap : minLap;

    return `${minLap}:${sLap}.${msLap.toString().slice(0, -1)}`;
}

empty = () => {
    [milliseconds, seconds, minutes] = [0, 0, 0];
    [ms, s, min] = [0, 0, 0];
    [lapMilliseconds, lapSeconds, lapMinutes] = [0, 0, 0];
    [lapMs, lapSec, lapMin] = [0, 0, 0];
    laps = [];

    lapList.replaceChildren();

    for (let i = 1; i <= 5; i++) {
        const classes = ['lap', 'empty'];

        const defaultLap = document.createElement('tr');
        const defaultLapVal = document.createElement('td');
        const defaultLapNum = document.createElement('td');

        defaultLapVal.classList.add(...classes);
        defaultLapNum.classList.add(...classes);

        defaultLap.appendChild(defaultLapVal);
        defaultLap.appendChild(defaultLapNum);

        lapList.appendChild(defaultLap);
    }

    timer.innerHTML = '00:00.00';
}

findHighestLowest = () => {
    let maxValue = Math.max(...laps.map(lap => lap.interval));
    let maxLap = laps.find(lap => lap.interval === maxValue);
    let minValue = Math.min(...laps.map(lap => lap.interval));
    let minLap = laps.find(lap => lap.interval === minValue);

    return [maxLap, minLap];
}

paintHighestLowest = (highest, lowest) => {
    const valueLaps = document.querySelectorAll('#lap-list tr td');
    let [highIdx, lowIdx] = [0, 0];

    valueLaps.forEach((lap, index) => {
        lap.classList.remove('highest', 'lowest');
        if (lap.innerHTML === highest.value) {
            lap.classList.add('highest');
            highIdx = index;
        } else if (lap.innerHTML === lowest.value) {
            lap.classList.add('lowest');
            lowIdx = index;
        }
    });
}

// TODO: Style better the scrollbar -> it sould have some separation to the edge
// of the page, and disappear when not being used for a couple of seconds

// TODO: Review styling

// TODO: Lap table gets slightly smaller when scrollbar appears