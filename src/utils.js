export function getFormattedTime(totalMilliseconds) {
    let totalSeconds = Math.floor(totalMilliseconds / 1000) % 60;
    let totalMinutes = Math.floor((totalMilliseconds / 1000) / 60) % 60;
    let totalHours = Math.floor(((totalMilliseconds / 1000) / 60) / 60);
    
    let totalCentiseconds = Math.floor((totalMilliseconds % 1000) / 10);
    
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
    const $valueLapsTr = document.querySelectorAll('#lap-list tr');
    $valueLapsTr.forEach(lap => {
        lap.classList.remove('highest', 'lowest');
        lap.id === `lap-${highest.id}` ? lap.classList.add('highest') : null;
        lap.id === `lap-${lowest.id}` ? lap.classList.add('lowest') : null;
    });
};