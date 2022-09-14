// initialize time counters
let [minutes, seconds, milliseconds] = [0, 0, 0];
let timer = document.getElementById('timer');
let stopButton = document.getElementById('start-stop');
let lapButton = document.getElementById('lap-reset');
let isRunning = false;
let interval;

stopButton.innerHTML = 'Start';
lapButton.innerHTML = 'Reset';

// click event on the start / stop button
// TODO: figure out how to make it stop with the same button

stopButton.addEventListener('click', () => {
    isRunning ? (pauseButton()) : (interval = setInterval(timerDisplay, 10));
});

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
    let ms = milliseconds < 100 ? '0' + milliseconds : milliseconds;
    let s = seconds < 10 ? '0' + seconds : seconds;
    let min = minutes < 10 ? '0' + minutes : minutes;

    // add these to html
    timer.innerHTML = `${min}:${s}.${ms}`
}

pauseButton = () => {
    clearInterval(interval);
    isRunning = false;
    stopButton.innerHTML = 'Start';
    stopButton.classList.replace('stop', 'start');
    lapButton.innerHTML = 'Reset';
}