var endtime = null;
var stepper = null;
var defaulttime = (2 * 60 + 30) * 1000;

function displayTime(d, func) {
    var min = 0, sec = 0, ms = 0;

    if (d > 0) {
        var dd = d;

        ms = Math.floor(d % 1000 / 100);
        d = Math.floor(d / 1000);
        sec = d % 60;
        d = Math.floor(d / 60);
        min = d;

        d = dd;
    }
    else {
        stopTimer();
    }

    $('#time #min').text(min);
    $('#time #sec').text((sec < 10 ? '0' : '') + sec);
    $('#time #ms').text(ms);

    (func || function(){})(d);
}

function startTimer(func) {
    $("#timer").text("Stop");
    endtime = Date.now() + defaulttime;

    stepper = setInterval(function() {
        displayTime(endtime - Date.now(), func);
    }, 100);
}

function stopTimer() {
    $("#timer").text("Start");

    endtime = null;
    clearInterval(stepper);
    stepper = null;
}

function resetTimer(func) {
    displayTime(defaulttime, func);
    stopTimer();
}

function isTimer() {
    return endtime !== null;
}
