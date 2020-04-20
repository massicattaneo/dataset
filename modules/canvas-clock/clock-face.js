import { STYLE } from '../../constants';

const HOUR_HAND_COLOR = STYLE.CONTRAST_COLOR;
const MINUTE_HAND_COLOR = STYLE.MAIN_COLOR;
const SECOND_HAND_COLOR = STYLE.ACCENT_COLOR;
const NUMERAL_ANGLE = Math.PI / 6.0;
let fontSize;

function Face(draw_ctx) {
    this.ctx = draw_ctx;
}

Face.prototype.clearCtx = function () {
    this.ctx.globalCompositeOperation = 'source-over';
    this.ctx.clearRect(0, 0, this.size, this.size); // clear canvas
};

Face.prototype.setSize = function (size) {
    this.size = size;
    this.scaleConsts();
};

Face.prototype.scaleConsts = function () {
    this.centerPos = this.size / 2.0;

    this.faceRadius = this.centerPos * 0.85;
    this.edgeRadius = this.centerPos * 0.90;
    this.faceWidth = this.centerPos * 0.02;

    this.numeralRadius = this.centerPos * 0.75;

    this.hourRadius = this.centerPos * 0.45;
    this.minuteRadius = this.centerPos * 0.6;
    this.secondRadius = this.centerPos * 0.7;

    this.hourWidth = this.centerPos * 0.03;
    this.minuteWidth = this.centerPos * 0.03;
    this.secondWidth = this.centerPos * 0.015;

    this.ctx.shadowColor = '#111';
    this.ctx.shadowBlur = this.centerPos * 0.025;
    this.ctx.shadowOffsetX = this.faceWidth;
    this.ctx.shadowOffsetY = this.faceWidth;
};

Face.prototype.drawFace = function () {
    this.ctx.lineWidth = this.faceWidth;
    this.ctx.strokeStyle = '#000';
    this.ctx.shadowColor = '#111';
    this.ctx.shadowBlur = this.centerPos * 0.025;
    this.ctx.beginPath();
    this.ctx.arc(this.centerPos, this.centerPos, this.faceRadius, 0, 2.0 * Math.PI, false);
    this.ctx.stroke();

    this.ctx.lineWidth = this.faceWidth / 2.0;
    this.ctx.strokeStyle = '#000000';
    this.ctx.beginPath();
    this.ctx.arc(this.centerPos, this.centerPos, this.edgeRadius, 0, 2.0 * Math.PI, false);
    this.ctx.stroke();

    this.ctx.fillStyle = '#333';
    this.ctx.beginPath();
    this.ctx.arc(this.centerPos, this.centerPos, this.faceWidth * 2.0, 0, 2.0 * Math.PI, false);
    this.ctx.fill();

    this.drawNumerals();
};

Face.prototype.drawNumerals = function () {
    fontSize = this.centerPos / 8.0;
    this.ctx.lineWidth = 2.0;
    this.ctx.fillStyle = STYLE.TEXT_COLOR;
    this.ctx.shadowOffsetX = 0;
    this.ctx.shadowOffsetY = 0;
    this.ctx.shadowColor = '';
    this.ctx.shadowBlur = 0;
    this.ctx.font = fontSize + 'px arial';
    this.ctx.textAlign = 'center';

    for (let i = 1; i <= 12; i++) {
        // rotate PI/4 counterclockwise
        const angle = i * NUMERAL_ANGLE - Math.PI / 2.0;
        const x = this.centerPos + this.numeralRadius * Math.cos(angle);
        let y = this.centerPos + this.numeralRadius * Math.sin(angle);
        // baseline fix
        y += fontSize / 4.0;
        this.ctx.fillText(i, x, y);
    }
    this.ctx.shadowOffsetX = this.faceWidth;
    this.ctx.shadowOffsetY = this.faceWidth;
    this.ctx.shadowColor = '#111';
    this.ctx.shadowBlur = this.centerPos * 0.025;
};


Face.prototype.drawHands = function (clock) {
    this.drawHourHand(clock);
    this.drawMinuteHand(clock);
    this.drawSecondHand(clock);
};

Face.prototype.drawHourHand = function (clock) {
    const hourAngle = clock.hourAngle - Math.PI / 2.0;
    this.drawHand(hourAngle, this.hourRadius, this.hourWidth, HOUR_HAND_COLOR);
};

Face.prototype.drawMinuteHand = function (clock) {
    const minuteAngle = clock.minuteAngle - Math.PI / 2.0;
    this.drawHand(minuteAngle, this.minuteRadius, this.minuteWidth, MINUTE_HAND_COLOR);
};

Face.prototype.drawSecondHand = function (clock) {
    const secondAngle = clock.secondAngle - Math.PI / 2.0;
    this.drawHand(secondAngle, this.secondRadius, this.secondWidth, SECOND_HAND_COLOR);
};

Face.prototype.drawHand = function (angle, radius, width, color) {
    const tip_x = this.centerPos + radius * Math.cos(angle);
    const tip_y = this.centerPos + radius * Math.sin(angle);
    const t_x = this.centerPos - radius * 0.25 * Math.cos(angle);
    const t_y = this.centerPos - radius * 0.25 * Math.sin(angle);
    const l_x = t_x + width * Math.cos(angle + Math.PI / 2.0);
    const l_y = t_y + width * Math.sin(angle + Math.PI / 2.0);
    const r_x = t_x - width * Math.cos(angle + Math.PI / 2.0);
    const r_y = t_y - width * Math.sin(angle + Math.PI / 2.0);
    this.ctx.lineWidth = width;
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.moveTo(tip_x, tip_y);
    this.ctx.lineTo(l_x, l_y);
    this.ctx.lineTo(r_x, r_y);
    this.ctx.fill();
};

export const ClockFace = Face;
