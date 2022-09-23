export function getFormattedTime(totalMilliseconds) {
    let totalCentiseconds = Math.floor((totalMilliseconds % 1000) / 10);
    let totalSeconds = Math.floor(totalMilliseconds / 1000) % 60;
    let totalMinutes = Math.floor((totalMilliseconds / 1000) / 60) % 60;
    let totalHours = Math.floor(((totalMilliseconds / 1000) / 60) / 60);
    
    // TODO: Refactor formatNumber so it takes all of them at once
    totalSeconds = formatNumber(totalSeconds, 2, '0');
    totalMinutes = formatNumber(totalMinutes, 2, '0');
    totalHours = totalHours ? formatNumber(totalHours, 3, '0') : null;
    totalCentiseconds = formatNumber(totalCentiseconds, 2, '0');
    
    return totalHours ? `${totalHours}:${totalMinutes}:${totalSeconds}.${totalCentiseconds}` : `${totalMinutes}:${totalSeconds}.${totalCentiseconds}`;
};

export function formatNumber(num, length, character) {
    return num.toString().padStart(length, character);
};

export function idCounter() {
    let count = 0;
    return function generateId(reset) {
        if (reset) count = 0;
        return ++count;
    };
};

export function updateNewRunningLap(lapId) {
    const $runningLap = document.getElementById('lap-list').firstElementChild;
    $runningLap.firstElementChild.innerText = `Lap ${lapId}`;
    $runningLap.id = `lap-${lapId}`;
};

export function paintHighestLowest(lowestLap, highestLap, action) {
    // console.log(highestLap, lowestLap)
    const lowest = document.getElementById(`lap-${lowestLap.id}`);
    const highest = document.getElementById(`lap-${highestLap.id}`);
    if (lowest) {
        action === 'remove' 
            ? lowest.classList.remove('highest', 'lowest') 
            : lowest.classList.add('lowest');
    }
    if (highest) {
        action === 'remove' 
            ? highest.classList.remove('highest', 'lowest')
            : highest.classList.add('highest');
    }
};

export function createLapHTML(numberOfLaps) {
    const $lapList = document.getElementById('lap-list');
    for (let i=0; i<numberOfLaps; i++) {
        const $lap = document.createElement('tr');
        $lap.classList.add('lap');
        $lap.appendChild(document.createElement('td'));
        $lap.appendChild(document.createElement('td'));
        $lapList.insertBefore($lap, $lapList.firstChild);
    };
};