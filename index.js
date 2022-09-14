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
        // TODO: if timer is running, record laps
        recordLap();
    } else {
        // RESET: clear interval, set everything to 0, keep clock turned off
        clearInterval(interval);
        [minutes, seconds, milliseconds] = [0, 0, 0];
        laps = [];
        let lapsList = document.getElementById('laps-list');
        lapsList.replaceChildren();
        let lapNum = document.getElementById('laps-number');
        lapNum.replaceChildren();
        timer.innerHTML = '00:00.00';
    }
})

// set up the display of the timer -> increase ms, s and m accordingly
timerDisplay = () => {
    isRunning = true;
    // change inner html and css class of buttons
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

    // add these to html
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
    // calc the total of time in the lap
    let totalTime = min*60*1000 + s*1000 + ms;
    let value = `${min}:${s}.${ms}`;

    // push obj with: id, value, total to laps array
    laps.push({ id: laps.length, value: value, total: totalTime});

    let lap = document.createElement('li');
    lap.innerHTML = value;
    lap.className = 'lap';
    let lapsList = document.getElementById('laps-list');
    lapsList.insertBefore(lap, lapsList.firstChild);

    let num = document.createElement('li');
    num.innerHTML = `Lap ${laps.length}`;
    num.className = 'lap-num'
    let lapNum = document.getElementById('laps-number');
    lapNum.insertBefore(num, lapNum.firstChild);

    //TODO: Improve styling -> the border boxes for the list elements are already there BEFORE adding the laps, not added with them

    //TODO: Find the lap with highest / lowest value and change their color accordingly
}