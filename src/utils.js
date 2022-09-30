function getFormattedTime(totalMilliseconds) {
    let totalCentiseconds = Math.floor((totalMilliseconds % 1000) / 10);
    let totalSeconds = Math.floor(totalMilliseconds / 1000) % 60;
    let totalMinutes = Math.floor((totalMilliseconds / 1000) / 60) % 60;
    let totalHours = Math.floor(((totalMilliseconds / 1000) / 60) / 60);
    
    // TODO: Refactor formatNumber so it takes all of them at once
    totalCentiseconds = formatNumber(totalCentiseconds, 2, '0');
    totalSeconds = formatNumber(totalSeconds, 2, '0');
    totalMinutes = formatNumber(totalMinutes, 2, '0');
    totalHours = totalHours ? formatNumber(totalHours, 3, '0') : null;
    
    return totalHours 
        ? `${totalHours}:${totalMinutes}:${totalSeconds}.${totalCentiseconds}` 
        : `${totalMinutes}:${totalSeconds}.${totalCentiseconds}`;
};

function formatNumber(num, length, character) {
    return num.toString().padStart(length, character);
};

function createIdCounter() {
    let count = 0;
    return function generateId(reset) {
        if (reset) count = 0;
        return ++count;
    };
};

function updateFirstLapRow(firstLap, lapId) {
    firstLap.firstElementChild.innerText = `Lap ${lapId}`;
    firstLap.id = `lap-${lapId}`;
};

function indicateHighestLowestLap(lowestLap, highestLap, action) {
    const lowest = lowestLap ? document.getElementById(`lap-${lowestLap?.id}`) : null;
    const highest = highestLap ? document.getElementById(`lap-${highestLap?.id}`) : null;

    if (action === 'remove') {
        lowest?.classList.remove('highest', 'lowest');
        highest?.classList.remove('highest', 'lowest');
    } else {
        lowest?.classList.add('lowest');
        highest?.classList.add('highest');
    }
};

function generateLapRows(numberOfLaps) {
    const $lapList = document.getElementById('lap-list');
    const $lap = $lapList.insertRow(0);
    $lap.classList.add('lap');
    $lap.insertCell(0);
    $lap.insertCell(1);

    numberOfLaps--;

    if (numberOfLaps > 0) {
        generateLapRows(numberOfLaps);
    };
};

export {
    getFormattedTime,
    createIdCounter,
    updateFirstLapRow,
    indicateHighestLowestLap,
    generateLapRows,
};