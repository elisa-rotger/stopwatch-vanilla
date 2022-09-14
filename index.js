// initialize time counters
let [minutes, seconds, milliseconds] = [0, 0, 0];
let timer = document.getElementById('timer');

// click event on the start / stop button
// TODO: figure out how to make it stop with the same button

document.getElementById('start-stop').addEventListener('click', () => {
    // setinterval will run every 10 milliseconds
    let interval = setInterval(timerDisplay, 10);
});

// set up the display of the timer -> increase ms, s and m accordingly
timerDisplay = () => {
    milliseconds += 10;
    if (milliseconds === 1000) {
        milliseconds = 0;
        seconds += 1;
        if (seconds === 60) {
            seconds = 0;
            minutes += 1;
        }
    }

    // TODO: set up the display of m, s to be 0 + number when they are < 10


    // add these to html
    timer.innerHTML = `${minutes} : ${seconds} : ${milliseconds}`
}