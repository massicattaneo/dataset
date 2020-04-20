import { ClockFace } from './clock-face';
import { Clock } from './clock-object';

let canvas;
let ctx;

let clockFace;

let boxWidth = 200;
let textRadius = null;
let hourHandRadius = Math.PI / 6.0;
let minuteHandRadius = Math.PI / 30.0;
let secondHandRadius = Math.PI / 30.0;
let centerPos = 300;

function drawCurrent() {
    scale_constants();

    clockFace.setSize(boxWidth);
    clockFace.clearCtx();

    const clock = new Clock();

    clockFace.drawHands(clock);

    clockFace.drawFace();

    window.requestAnimationFrame(drawCurrent);
}

function scale_constants() {
    centerPos = boxWidth / 2.0;
    textRadius = centerPos * 0.75;
    hourHandRadius = centerPos * 0.4;
    minuteHandRadius = centerPos * 0.6;
    secondHandRadius = centerPos * 0.7;
}

function clock_init(canvas) {
    ctx = canvas.getContext('2d');

    clockFace = new ClockFace(ctx);

    window.requestAnimationFrame(drawCurrent);
}

export const initClock = function (canvas) {
    boxWidth = Number(canvas.getAttribute('width'))
    clock_init(canvas);
};
