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

const startTimer = () => {
    $startStopButton.innerText = 'Stop';
    $startStopButton.classList.replace('start', 'stop');
    $lapResetButton.innerText = 'Lap';

    const runningLap = $lapList.firstElementChild;

    // Time calc for clock
    previousTimeTimer = isRunning ? previousTimeTimer : Date.now();
    passedTimeTimer += Date.now() - previousTimeTimer;
    previousTimeTimer = Date.now();

    // Time calc for lap
    previousTimeLap = previousTimeLap ? previousTimeLap : Date.now();
    previousTimeLap = isRunning ? previousTimeLap : Date.now();
    passedTimeLap += Date.now() - previousTimeLap;
    previousTimeLap = Date.now();

    let clock = convertToValue(passedTimeTimer);
    let lapClock = convertToValue(passedTimeLap);

    runningLap.lastElementChild.innerText = lapClock;
    runningLap.classList.remove('empty');
    runningLap.firstElementChild.innerText = `Lap ${laps.length+1}`;
    runningLap.id = runningLap.hasAttribute('id') ? runningLap.id : `lap-1`;

    $timer.innerText = clock;
    isRunning = true;
}

const pauseTimer = () => {
    clearInterval(interval);
    isRunning = false;

    $startStopButton.innerText = 'Start';
    $startStopButton.classList.replace('stop', 'start');
    $lapResetButton.innerText = 'Reset';
}

const convertToValue = (totalTime) => {
    // TODO: Add hour calculation + to clock when necessary
    let totalMinutes = Math.floor(totalTime / 60000);
    let totalSeconds = Math.floor((totalTime % 60000) / 1000).toFixed(0);
    let totalMilliseconds = totalTime - (totalMinutes * 60000) - (totalSeconds * 1000);
    
    totalMilliseconds = formatNumber(Math.round(totalMilliseconds), 2, '0');
    totalSeconds = formatNumber(totalSeconds, 2, '0');
    totalMinutes = formatNumber(totalMinutes, 2, '0');
    
    return `${totalMinutes}:${totalSeconds}.${totalMilliseconds}`;
}

const formatNumber = (num, length, character) => {
    let reducedNum = num.toString().length > 2 ? num.toString().slice(0, 2) : num;
    let baseFormat = new Array(1 + length).join(character);
    return (baseFormat + reducedNum).slice(-baseFormat.length);
}

const recordLap = () => {

    laps.push({ 
        id: laps.length+1,
        interval: passedTimeLap 
    });

    createLap();

    let lastLapClasses = $lapList.lastElementChild.classList;
    lastLapClasses.contains('empty') ? $lapList.removeChild($lapList.lastElementChild) : null;

    if (laps.length >= 3) {
        let edgeLaps = findHighestLowest();
        paintHighestLowest(edgeLaps[0], edgeLaps[1]);
    };

    [previousTimeLap, passedTimeLap] = [null, null];
}

const createLap = () => {
    const $lap = document.createElement('tr');
    const $lapNumber = document.createElement('td');
    const $lapTimer = document.createElement('td');

    $lapNumber.innerText = `Lap ${laps.length+1}`;
    $lap.id = `lap-${laps.length+1}`;
    $lap.className = 'lap';

    $lap.appendChild($lapNumber);
    $lap.appendChild($lapTimer);
    $lapList.insertBefore($lap, $lapList.firstChild);
}

const resetTimer = () => {
    [previousTimeTimer, passedTimeTimer] = [null, null];
    [previousTimeLap, passedTimeLap] = [null, null];
    laps = [];
    
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
    
    $timer.innerText = '00:00.00';
}

const findHighestLowest = () => {
    let maxValue = Math.max(...laps.map(lap => lap.interval));
    let maxLap = laps.find(lap => lap.interval === maxValue);
    let minValue = Math.min(...laps.map(lap => lap.interval));
    let minLap = laps.find(lap => lap.interval === minValue);
    
    return [maxLap, minLap];
}

const paintHighestLowest = (highest, lowest) => {
    const $valueLapsTr = document.querySelectorAll('#lap-list tr');
    $valueLapsTr.forEach(lap => {
        lap.classList.remove('highest', 'lowest');
        lap.id === `lap-${highest.id}` ? lap.classList.add('highest') : null;
        lap.id === `lap-${lowest.id}` ? lap.classList.add('lowest') : null;
    });
}

// Testing
$lapList.addEventListener('wheel', () => {
    $lapList.classList.add('xxx')
})