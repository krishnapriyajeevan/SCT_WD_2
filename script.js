"use strict";

class Stopwatch {
    constructor() {
        this.startTime = 0;
        this.elapsedTime = 0;
        this.timerInterval = null;
        this.isRunning = false;
        this.laps = [];
        this.lastLapTime = 0;

        // Select DOM elements
        this.displayEl = document.getElementById('display');
        this.startPauseBtn = document.getElementById('startPauseBtn');
        this.lapBtn = document.getElementById('lapBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.lapsWrapper = document.getElementById('lapsWrapper');
        this.lapsList = document.getElementById('lapsList');

        // Bind event listeners
        this.startPauseBtn.addEventListener('click', () => this.toggleStartPause());
        this.lapBtn.addEventListener('click', () => this.recordLap());
        this.resetBtn.addEventListener('click', () => this.reset());
    }

    toggleStartPause() {
        if (!this.isRunning) {
            this.start();
        } else {
            this.pause();
        }
    }

    start() {
        this.isRunning = true;
        this.startTime = Date.now() - this.elapsedTime;
        this.timerInterval = setInterval(() => this.updateTime(), 10);

        // Update UI states
        this.startPauseBtn.innerHTML = `<i class="fa-solid fa-pause"></i> Pause`;
        this.startPauseBtn.className = "btn btn-pause";
        this.lapBtn.disabled = false;
        this.resetBtn.disabled = false;
    }

    pause() {
        this.isRunning = false;
        clearInterval(this.timerInterval);
        this.elapsedTime = Date.now() - this.startTime;

        // Update UI states
        this.startPauseBtn.innerHTML = `<i class="fa-solid fa-play"></i> Resume`;
        this.startPauseBtn.className = "btn btn-start";
    }

    reset() {
        clearInterval(this.timerInterval);
        this.isRunning = false;
        this.startTime = 0;
        this.elapsedTime = 0;
        this.lastLapTime = 0;
        this.laps = [];

        // Reset UI states
        this.displayEl.innerHTML = `00:00:00<span class="ms">.00</span>`;
        this.startPauseBtn.innerHTML = `<i class="fa-solid fa-play"></i> Start`;
        this.startPauseBtn.className = "btn btn-start";
        this.lapBtn.disabled = true;
        this.resetBtn.disabled = true;
        this.lapsList.innerHTML = "";
        this.lapsWrapper.style.display = "none";
    }

    updateTime() {
        this.elapsedTime = Date.now() - this.startTime;
        this.displayEl.innerHTML = this.formatTime(this.elapsedTime);
    }

    formatTime(timeInMs) {
        let totalMs = timeInMs;
        
        const hrs = Math.floor(totalMs / 3600000);
        totalMs %= 3600000;
        
        const mins = Math.floor(totalMs / 60000);
        totalMs %= 60000;
        
        const secs = Math.floor(totalMs / 1000);
        const ms = Math.floor((totalMs % 1000) / 10);

        const pad = (num) => String(num).padStart(2, '0');

        return `${pad(hrs)}:${pad(mins)}:${pad(secs)}<span class="ms">.${pad(ms)}</span>`;
    }

    recordLap() {
        if (!this.isRunning) return;

        this.lapsWrapper.style.display = "block";
        const currentTotalTime = this.elapsedTime;
        const lapSplitTime = currentTotalTime - this.lastLapTime;
        
        this.laps.push({
            split: lapSplitTime,
            total: currentTotalTime
        });

        this.lastLapTime = currentTotalTime;
        this.renderLaps();
    }

    renderLaps() {
        this.lapsList.innerHTML = "";
        
        // Reverse array to display latest laps on top
        [...this.laps].reverse().forEach((lap, index) => {
            const lapNumber = this.laps.length - index;
            const li = document.createElement('li');
            li.className = "lap-item";
            li.innerHTML = `
                <span class="lap-number">#${String(lapNumber).padStart(2, '0')}</span>
                <span class="lap-split">${this.cleanFormat(lap.split)}</span>
                <span class="lap-total">${this.cleanFormat(lap.total)}</span>
            `;
            this.lapsList.appendChild(li);
        });
    }

    cleanFormat(timeInMs) {
        let totalMs = timeInMs;
        const mins = Math.floor(totalMs / 60000);
        totalMs %= 60000;
        const secs = Math.floor(totalMs / 1000);
        const ms = Math.floor((totalMs % 1000) / 10);
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${String(ms).padStart(2, '0')}`;
    }
}

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    new Stopwatch();
});