let [minutes, seconds, milliseconds] = [0, 0, 0];
let [ms, s, min] = [0, 0, 0];
let [lapMinutes, lapSeconds, lapMilliseconds] = [0, 0, 0];
let [lapMs, lapSec, lapMin] = [0, 0, 0];
let interval = null;
let isRunning = false;
let laps = new Array();

let timer = document.getElementById('timer');
let stopButton = document.getElementById('start-stop');
let lapButton = document.getElementById('lap-reset');

stopButton.innerHTML = 'Start';
lapButton.innerHTML = 'Reset';

stopButton.addEventListener('click', () => {
    isRunning ? (pauseButton()) : (interval = setInterval(timerDisplay, 10));
});

lapButton.addEventListener('click', () => {
    isRunning ? (recordLap()) : (clearInterval(interval), empty());
});

timerDisplay = () => {
    isRunning = true;
    stopButton.innerHTML = 'Stop';
    stopButton.classList.replace('start', 'stop');
    lapButton.innerHTML = 'Lap';
    let lapClock;

    let runningLap = document.getElementById('laps-list').firstElementChild;
    let runningNumber = document.getElementById('laps-number').firstElementChild;

    milliseconds += 10;
    if (milliseconds === 1000) {
        milliseconds = 0;
        seconds += 1;
        if (seconds === 60) {
            seconds = 0;
            minutes += 1;
        };
    };

    ms = milliseconds < 100 ? '0' + milliseconds : milliseconds;
    s = seconds < 10 ? '0' + seconds : seconds;
    min = minutes < 10 ? '0' + minutes : minutes;

    if (laps.length) {
        [lapMinutes, lapSeconds, lapMilliseconds] = [0, 0, 0];
        [lapMin, lapSec, lapMs] = [0, 0, 0];
    }

    let clock = `${min}:${s}.${ms.toString().slice(0, -1)}`;

    runningLap.innerHTML = lapClock ? lapClock : clock;
    runningLap.classList.remove('empty');

    runningNumber.innerHTML = `Lap ${laps.length+1}`;
    runningNumber.classList.remove('empty');

    timer.innerHTML = clock;
}

pauseButton = () => {
    clearInterval(interval);
    isRunning = false;

    stopButton.innerHTML = 'Start';
    stopButton.classList.replace('stop', 'start');
    lapButton.innerHTML = 'Reset';
}

recordLap = () => {

    let totalTime = (minutes*60*1000) + (seconds*1000) + milliseconds;
    let value = `${min}:${s}.${ms.toString().slice(0, -1)}`;

    if (laps.length === 0) {
        laps.push({ 
            value: value, 
            total: totalTime,
            interval: totalTime 
        });
        createLap();
    } else {
        let intervalLap = totalTime - laps[laps.length-1].total;
        value = convertToValue(intervalLap);
        laps.push({ 
            value: value, 
            total: totalTime,
            interval: intervalLap 
        });
        createLap();
    }

    console.log(laps)

    // let lastLapClasses = lapsList.lastElementChild.classList;
    // if (lastLapClasses.contains('empty')) {
    //     lapsList.removeChild(lapsList.lastElementChild);
    //     lapNum.removeChild(lapNum.lastElementChild);
    // };

    // if (laps.length >= 3) {
    //     let edgeLaps = findHighestLowest();
    //     paintHighestLowest(edgeLaps[0], edgeLaps[1]);
    // };

}

createLap = () => {
    let lap = document.createElement('li');
    lap.innerHTML = `00:00.0`;
    lap.className = 'lap';
    let lapsList = document.getElementById('laps-list');
    lapsList.insertBefore(lap, lapsList.firstChild);

    let num = document.createElement('li');
    num.innerHTML = `Lap ${laps.length+1}`;
    num.className = 'lap';
    let lapNum = document.getElementById('laps-number');
    lapNum.insertBefore(num, lapNum.firstChild);
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
    [minutes, seconds, milliseconds] = [0, 0, 0];
    [ms, s, min] = [0, 0, 0];
    laps = [];

    let lapNum = document.getElementById('laps-number');
    lapNum.replaceChildren();

    let lapsList = document.getElementById('laps-list');
    lapsList.replaceChildren();

    for (let i = 1; i <= 5; i++) {
        const classes = ['lap', 'empty'];

        let defaultLapVal = document.createElement('li');
        defaultLapVal.classList.add(...classes);
        lapsList.appendChild(defaultLapVal);

        let defaultLapNum = document.createElement('li');
        defaultLapNum.classList.add(...classes);
        lapNum.appendChild(defaultLapNum);
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
    let valueLaps = document.querySelectorAll('#laps-list li');
    let numLaps = document.querySelectorAll('#laps-number li');
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

    numLaps.forEach(lap => lap.classList.remove('highest', 'lowest'));
    numLaps[highIdx].classList.add('highest');
    numLaps[lowIdx].classList.add('lowest');
}

// TODO: Find way of current lap being on par with the timer

// TODO: Style better the scrollbar -> it sould have some separation to the edge
// of the page, and disappear when not being used for a couple of seconds

// TODO: Build some defenses for when the highest or lowest lap is duplicated