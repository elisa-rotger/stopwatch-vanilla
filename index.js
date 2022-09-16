let interval = null;
let isRunning = false;
let laps = new Array();

let [previousTimeTimer, passedTimeTimer] = [null, null];
let [previousTimeLap, passedTimeLap] = [null, null];

const $timer = document.getElementById('timer');
const $startStopButton = document.getElementById('start-stop');
const $lapResetButton = document.getElementById('lap-reset');
const $lapList = document.getElementById('lap-list');

$startStopButton.innerText = 'Start';
$lapResetButton.innerText = 'Reset';

$startStopButton.onclick = () => {
    isRunning ? (pauseTimer()) : (interval = setInterval(startTimer, 10));
};

$lapResetButton.onclick = () => {
    isRunning ? (recordLap()) : (clearInterval(interval), resetTimer());
};

startTimer = () => {
    isRunning = true;
    $startStopButton.innerText = 'Stop';
    $startStopButton.classList.replace('start', 'stop');
    $lapResetButton.innerText = 'Lap';

    const runningLap = $lapList.firstElementChild;

    // TODO: Refactor into helper function
    // Time calc for clock
    previousTimeTimer = previousTimeTimer ? previousTimeTimer : Date.now();

    passedTimeTimer += Date.now() - previousTimeTimer;
    previousTimeTimer = Date.now();

    // Time calc for lap
    previousTimeLap = previousTimeLap ? previousTimeLap : Date.now();

    passedTimeLap += Date.now() - previousTimeLap;
    previousTimeLap = Date.now();

    let clock = convertToValue(passedTimeTimer);
    let lapClock = convertToValue(passedTimeLap);

    runningLap.lastElementChild.innerText = lapClock;
    runningLap.lastElementChild.classList.remove('empty');
    runningLap.firstElementChild.innerText = `Lap ${laps.length+1}`;
    runningLap.firstElementChild.classList.remove('empty');

    $timer.innerText = clock;
}

pauseTimer = () => {
    clearInterval(interval);
    isRunning = false;

    $startStopButton.innerText = 'Start';
    $startStopButton.classList.replace('stop', 'start');
    $lapResetButton.innerText = 'Reset';
}

recordLap = () => {

    if (laps.length === 0) { 
        laps.push({ 
            value: convertToValue(passedTimeTimer), 
            total: passedTimeTimer, 
            interval: passedTimeTimer 
        });
    } else {
        laps.push({ 
            value: convertToValue(passedTimeLap), 
            total: passedTimeTimer, 
            interval: passedTimeLap 
        });
    };

    createLap();

    let lastLapClasses = $lapList.lastElementChild.firstElementChild.classList;
    lastLapClasses.contains('empty') ? $lapList.removeChild($lapList.lastElementChild) : null;

    if (laps.length >= 3) {
        let edgeLaps = findHighestLowest();
        paintHighestLowest(edgeLaps[0], edgeLaps[1]);
    };

    [previousTimeLap, passedTimeLap] = [null, null];
}

createLap = () => {
    const $lap = document.createElement('tr');
    const $lapNumber = document.createElement('td');
    const $lapTimer = document.createElement('td');

    $lapTimer.innerText = `00:00.0`;
    $lapNumber.innerText = `Lap ${laps.length+1}`;
    $lapTimer.id = `${laps.length+1}`;
    $lapNumber.id = `${laps.length+1}`;
    $lapTimer.className = 'lap';
    $lapNumber.className = 'lap';

    $lap.appendChild($lapNumber);
    $lap.appendChild($lapTimer);
    $lapList.insertBefore($lap, $lapList.firstChild);
}

convertToValue = (totalMs) => {
    let totalMinutes = Math.floor(totalMs / 60000);
    let totalSeconds = Math.floor((totalMs % 60000) / 1000);
    let totalMilliseconds = totalMs - (totalMinutes * 60000) - (totalSeconds * 1000);

    // TODO: Look for built in JS to do this
    totalMilliseconds = totalMilliseconds === 0 ? '000' : totalMilliseconds < 100 ? '0' + totalMilliseconds : totalMilliseconds;
    totalSeconds = totalSeconds < 10 ? '0' + totalSeconds : totalSeconds;
    totalMinutes = totalMinutes < 10 ? '0' + totalMinutes : totalMinutes;

    return `${totalMinutes}:${totalSeconds}.${totalMilliseconds.toString().slice(0, -1)}`;
}

resetTimer = () => {
    [previousTimeTimer, passedTimeTimer] = [null, null];
    [previousTimeLap, passedTimeLap] = [null, null];
    laps = [];

    $lapList.replaceChildren();

    for (let i = 1; i <= 6; i++) {
        const classes = ['lap', 'empty'];

        const $defaultLap = document.createElement('tr');
        const $defaultLapVal = document.createElement('td');
        const $defaultLapNum = document.createElement('td');

        $defaultLapVal.classList.add(...classes);
        $defaultLapNum.classList.add(...classes);

        $defaultLap.appendChild($defaultLapVal);
        $defaultLap.appendChild($defaultLapNum);

        $lapList.appendChild($defaultLap);
    }

    $timer.innerText = '00:00.00';
}

findHighestLowest = () => {
    let maxValue = Math.max(...laps.map(lap => lap.interval));
    let maxLap = laps.find(lap => lap.interval === maxValue);
    let minValue = Math.min(...laps.map(lap => lap.interval));
    let minLap = laps.find(lap => lap.interval === minValue);

    return [maxLap, minLap];
}

paintHighestLowest = (highest, lowest) => {
    const $valueLaps = document.querySelectorAll('#lap-list tr td');

    $valueLaps.forEach(lap => {
        lap.classList.remove('highest', 'lowest');
        if (lap.innerText === highest.value) {
            lap.classList.add('highest');
        } else if (lap.innerText === lowest.value) {
            lap.classList.add('lowest');
        }
    });
}

// TODO: Style better the scrollbar -> it sould have some separation to the edge
// of the page, and disappear when not being used for a couple of seconds

// TODO: Review styling

// Testing
$lapList.addEventListener('wheel', () => {
    console.log('hi!')
})