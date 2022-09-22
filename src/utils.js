export function getFormattedTime(totalMilliseconds) {
    let totalCentiseconds = Math.floor((totalMilliseconds % 1000) / 10);
    let totalSeconds = Math.floor(totalMilliseconds / 1000) % 60;
    let totalMinutes = Math.floor((totalMilliseconds / 1000) / 60) % 60;
    let totalHours = Math.floor(((totalMilliseconds / 1000) / 60) / 60);
    
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

export function createLapHTML(numberOfLaps) {
    const $lapList = document.getElementById('lap-list');
    for (let i=0; i<numberOfLaps; i++) {
        const $lap = document.createElement('tr');
        const $lapNumber = document.createElement('td');
        const $lapTimer = document.createElement('td');
        
        $lap.appendChild($lapNumber);
        $lap.appendChild($lapTimer);
        $lap.classList.add('lap');
        $lapList.insertBefore($lap, $lapList.firstChild);
    }
};

export function paintHighestLowest(lowestLap, highestLap, action) {
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