import { nodecg } from './util/nodecg.js';
import { countdown } from './util/replicants.js';
let countdownTimeout;
function updateCountdownTimer() {
    const cdTimer = countdown.value;
    const remaining = cdTimer.originalDuration - (Date.now() - cdTimer.timestamp);
    if (remaining > 0) {
        countdown.value.remaining = remaining;
        countdownTimeout = setTimeout(() => updateCountdownTimer(), 1000);
    }
    else {
        countdown.value.remaining = 0;
    }
}
nodecg.listenFor('countdownStart', (time) => {
    if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time))
        return;
    const now = new Date();
    const then = new Date(now.getFullYear(), now.getMonth(), now.getDate(), Number(time.split(':')[0]), Number(time.split(':')[1]));
    const diff = then.getTime() - now.getTime();
    // Times that have already passed are ignored, and any running countdown carries on.
    if (diff <= 0)
        return;
    if (countdownTimeout)
        clearTimeout(countdownTimeout);
    countdown.value = {
        originalDuration: diff,
        remaining: diff,
        timestamp: Date.now(),
    };
    updateCountdownTimer();
});
updateCountdownTimer();
