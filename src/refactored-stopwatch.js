import {
  getFormattedTime,
  createIdCounter,
  updateFirstLapRow,
  indicateHighestLowestLap,
  generateLapRows,
} from "./utils.js"

generateLapRows(6)

const HOURLY_INDICATOR = 3600000
const generateLapId = createIdCounter()

const $timer = document.getElementById("timer")
const $startStopButton = document.getElementById("start-stop")
const $lapResetButton = document.getElementById("lap-reset")
const $lapList = document.getElementById("lap-list")

const initialState = {
  startTime: 0,
  elapsedTime: 0,
  lapTotalTime: 0,
  highestLap: { id: undefined, interval: 0 },
  lowestLap: { id: undefined, interval: Infinity },
  laps: [],
  isRunning: false,
}

let stopwatchState = {
  ...initialState,
}

let timerAnimationId
let lapId

/* Timer functions */
function startTimer() {
  stopwatchState = {
    ...stopwatchState,
    isRunning: true,
  }

  lapId = lapId ?? generateLapId(false)

  if (lapId === 1) updateFirstLapRow($lapList.firstElementChild, lapId)

  window.requestAnimationFrame(renderTime)
}

function renderTime(currentTimestamp) {
  const passedTime = calculateTime(currentTimestamp)

  stopwatchState = {
    ...stopwatchState,
    startTime: passedTime.startTime,
    elapsedTime: passedTime.elapsedTime,
  }

  if (stopwatchState.elapsedTime > HOURLY_INDICATOR) {
    $timer.firstElementChild.classList.add("hourly")
  }

  updateTimers()

  timerAnimationId = window.requestAnimationFrame(renderTime)
}

function updateTimers() {
  $timer.firstElementChild.innerText = getFormattedTime(
    stopwatchState.elapsedTime
  )
  $lapList.firstElementChild.lastElementChild.innerText = getFormattedTime(
    stopwatchState.elapsedTime - stopwatchState.lapTotalTime
  )
}

function calculateTime(currentTimestamp) {
  const startTime =
    stopwatchState.startTime || currentTimestamp - stopwatchState.elapsedTime
  const elapsedTime = currentTimestamp - startTime
  return { startTime, elapsedTime }
}

function pauseTimer() {
  window.cancelAnimationFrame(timerAnimationId)

  stopwatchState = {
    ...stopwatchState,
    isRunning: false,
    startTime: 0,
  }
}

function resetTimer() {
  stopwatchState = {
    ...initialState,
  }

  lapId = generateLapId(true)

  emptyLapTable()

  $timer.firstElementChild.innerText = "00:00.00"
}

function emptyLapTable() {
  $lapList.replaceChildren()
  generateLapRows(6)
}

/* Lap functions */
function recordLap() {
  const newLap = {
    id: lapId,
    interval: stopwatchState.elapsedTime - stopwatchState.lapTotalTime,
  }

  stopwatchState = {
    ...stopwatchState,
    laps: [...stopwatchState.laps, newLap],
    lapTotalTime: stopwatchState.elapsedTime,
  }

  lapId = generateLapId(false)
  calculateHighestLowestLap(newLap)
  updateLapTable()
}

function updateLapTable() {
  generateLapRows(1)
  updateFirstLapRow($lapList.firstElementChild, lapId)
  removeEmptyRow($lapList.lastElementChild)
}

function removeEmptyRow(lastRow) {
  lastRow.innerText.trim() !== "" || $lapList.removeChild(lastRow)
}

function calculateHighestLowestLap(newLap) {
  if (newLap.interval < stopwatchState.lowestLap.interval) {
    if (stopwatchState.laps?.length > 2) {
      indicateHighestLowestLap(stopwatchState.lowestLap, null, "remove")
      indicateHighestLowestLap(newLap, null, "add")
    }
    stopwatchState = {
      ...stopwatchState,
      lowestLap: newLap,
    }
  }

  if (newLap.interval > stopwatchState.highestLap.interval) {
    if (stopwatchState.laps?.length > 2) {
      indicateHighestLowestLap(null, stopwatchState.highestLap, "remove")
      indicateHighestLowestLap(null, newLap, "add")
    }
    stopwatchState = {
      ...stopwatchState,
      highestLap: newLap,
    }
  }

  if (stopwatchState.laps?.length === 2) {
    indicateHighestLowestLap(
      stopwatchState.lowestLap,
      stopwatchState.highestLap,
      "add"
    )
  }
}

$startStopButton.onclick = () => {
  if (stopwatchState.isRunning) {
    pauseTimer()
    $startStopButton.innerText = "Start"
    $startStopButton.classList.replace("active-stop", "active-start")
    $lapResetButton.innerText = "Reset"
  } else {
    startTimer()
    $startStopButton.innerText = "Stop"
    $startStopButton.classList.replace("active-start", "active-stop")
    $lapResetButton.innerText = "Lap"
  }
}

$lapResetButton.onclick = () => {
  stopwatchState.isRunning ? recordLap() : resetTimer()
}

$lapList.addEventListener("wheel", () => {
  const $lapContainer = document.querySelector(".lap-container")
  $lapContainer.classList.add("scrollbar-fade")

  setTimeout(() => {
    $lapContainer.classList.remove("scrollbar-fade")
  }, 1500)
})
