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

export function paintHighestLowest(lowest, highest) {
    console.log(highest, lowest);
    const $valueLapsTr = document.querySelectorAll('#lap-list tr');
    $valueLapsTr.forEach(lap => {
        lap.classList.remove('highest', 'lowest');
        lap.id === `lap-${highest.id}` ? lap.classList.add('highest') : null;
        lap.id === `lap-${lowest.id}` ? lap.classList.add('lowest') : null;
    });
};


// TESTING
// Pass just the id and paint that one -> maybe arg 'action' to add or remove the class?
// Doable, but has to be called too many times -> figure out a 'swap' function?

export function paintHighestLowestTest(lapId, action, lapStatus) {
    let lap = document.getElementById(`lap-${lapId}`);
    
    action === 'add' ? lap.classList.add(lapStatus) : null;
    action === 'remove' ? lap.classList.remove(lapStatus) : null;

    // lap.classList.action(lapStatus)
};


/* Lap ID counter */

export function idCounter() {
    let count = 0;
    return function generateId(reset) {
        if (reset) count = 0;
        return ++count;
    };
};
