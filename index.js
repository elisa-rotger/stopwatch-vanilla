// initialize time counters
let [minutes, seconds, milliseconds] = [0, 0, 0];
let timer = document.getElementById('timer');
let stopButton = document.getElementById('start-stop');
let lapButton = document.getElementById('lap-reset');
let isRunning = false;
let [interval, ms, s, min] = [null, 0, 0, 0];
let laps = new Array();

stopButton.innerHTML = 'Start';
lapButton.innerHTML = 'Reset';

stopButton.addEventListener('click', () => {
    isRunning ? (pauseButton()) : (interval = setInterval(timerDisplay, 10));
});

lapButton.addEventListener('click', () => {
    if (isRunning) {
        recordLap();
    } else {
        // RESET: clear interval, set everything to 0, keep clock turned off
        clearInterval(interval);
        [minutes, seconds, milliseconds] = [0, 0, 0];
        [ms, s, min] = [0, 0, 0];
        laps = [];
        let lapsList = document.getElementById('laps-list');
        lapsList.replaceChildren();
        let lapNum = document.getElementById('laps-number');
        lapNum.replaceChildren();
        timer.innerHTML = '00:00.00';
    }
})

// TODO: Helper function empty() that empties an element. Should treat the lap list differently

timerDisplay = () => {
    isRunning = true;
    stopButton.innerHTML = 'Stop';
    stopButton.classList.replace('start', 'stop');
    lapButton.innerHTML = 'Lap';

    milliseconds += 10;
    if (milliseconds === 1000) {
        milliseconds = 0;
        seconds += 1;
        if (seconds === 60) {
            seconds = 0;
            minutes += 1;
        }
    }

    // TODO: figure out how to remove the last 0 in the milliseconds
    ms = milliseconds < 100 ? '0' + milliseconds : milliseconds;
    s = seconds < 10 ? '0' + seconds : seconds;
    min = minutes < 10 ? '0' + minutes : minutes;

    timer.innerHTML = `${min}:${s}.${ms}`;
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
    let value = `${min}:${s}.${ms}`;

    if (laps.length === 0) {
        laps.push({ id: laps.length, value: value, total: totalTime });
    } else {
        let intervalLap = totalTime - laps[laps.length-1].total;
        console.log(laps, intervalLap)
        console.log(totalTime, typeof totalTime)
        console.log(laps[laps.length-1].total, typeof laps[laps.length-1].total)
        value = convertToValue(intervalLap);
        laps.push({ id: laps.length, value: value, total: totalTime });
    }


    let lap = document.createElement('li');
    lap.innerHTML = value;
    lap.className = 'lap';
    let lapsList = document.getElementById('laps-list');
    lapsList.insertBefore(lap, lapsList.firstChild);

    let num = document.createElement('li');
    num.innerHTML = `Lap ${laps.length}`;
    num.className = 'lap-num';
    let lapNum = document.getElementById('laps-number');
    lapNum.insertBefore(num, lapNum.firstChild);

    //TODO: Improve styling -> the border boxes for the list elements are already there BEFORE adding the laps, not added with them

    //TODO: Find the lap with highest / lowest value and change their color accordingly
}

convertToValue = (totalMs) => {
    let minLap = Math.floor(totalMs / 60000);
    let sLap = Math.floor((totalMs % 60000) / 1000);
    let msLap = totalMs - (minLap * 60000) - (sLap * 1000);

    console.log(minLap, sLap, msLap, totalMs)
    msLap = msLap < 100 ? '0' + msLap : msLap;
    sLap = sLap < 10 ? '0' + sLap : sLap;
    minLap = minLap < 10 ? '0' + minLap : minLap;

    return `${minLap}:${sLap}.${msLap}`;
}