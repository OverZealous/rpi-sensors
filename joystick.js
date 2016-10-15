/**
 * Reads input from the joystick module via the pcf8591 module
 */
const wpi = require('wiring-pi');
const pcf8591 = require('./lib/pcf8591');


const Y_AXIS_PIN = 1;
const X_AXIS_PIN = 2;
const BTN_PIN = 3;

// how much of the center range do we ignore?
const CENTER_BUFFER = 2;
// how much range do we allow before assuming 100% in either direction (center buffer subtracts from available range)?
const AXIS_RADIUS = 124;

wpi.setup('wpi');
const pcf = pcf8591.init();

// calibrate the center on startup, which isn't always exactly 127
const Y_CENTER = pcf.read(Y_AXIS_PIN);
const X_CENTER = pcf.read(X_AXIS_PIN);

const DIRECTIONS = {
	'Top': '↑',
	'Bottom': '↓',
	'Right': '→',
	'Left': '←',
	'Top Right': '︎↗︎',
	'Top Left': '↖',
	'Bottom Right': '↘',
	'Bottom Left': '↙︎',
	'Center': '·',
};

function read() {
	let vertical, horizontal;
	let yPerc = 0;
	let xPerc = 0;

	// read the raw (0-255) value of the pin
	let yVal = pcf.read(Y_AXIS_PIN);
	let xVal = pcf.read(X_AXIS_PIN);

	// technically it just goes from 255 to 0, but no reason to be so explicit
	let btnPressed = pcf.read(BTN_PIN) < 100;

	if(yVal < Y_CENTER - CENTER_BUFFER) {
		vertical = 'Top';
		yPerc = toPercent(yVal, Y_CENTER - CENTER_BUFFER, Y_CENTER - CENTER_BUFFER - AXIS_RADIUS);
	} else if(yVal > Y_CENTER + CENTER_BUFFER) {
		vertical = 'Bottom';
		yPerc = -toPercent(yVal, Y_CENTER + CENTER_BUFFER, Y_CENTER + CENTER_BUFFER + AXIS_RADIUS);
	}

	if(xVal < X_CENTER - CENTER_BUFFER) {
		horizontal = 'Right';
		xPerc = toPercent(xVal, X_CENTER - CENTER_BUFFER, X_CENTER - CENTER_BUFFER - AXIS_RADIUS);
	} else if(xVal > X_CENTER + CENTER_BUFFER) {
		horizontal = 'Left';
		xPerc = -toPercent(xVal, X_CENTER + CENTER_BUFFER, X_CENTER + CENTER_BUFFER + AXIS_RADIUS);
	}

	let state;
	if(vertical) {
		state = vertical + (horizontal ? ' ' + horizontal : '');
	} else if(horizontal) {
		state = horizontal;
	} else {
		state = 'Center';
	}

	state = `[${DIRECTIONS[state]}](${btnPressed ? '•' : ' '}) ${state}, Button ${(btnPressed ? 'Down' : 'Up')}`;
	state = rpad(state, 40);

	process.stdout.write(`\r${state} (${percString(yPerc)}, ${percString(xPerc)}) (${lpad(yVal, 3)}, ${lpad(xVal, 3)})        `);
	setTimeout(read, 10);
}

function toPercent(val, min, max) {
	let rev = false;
	if(min > max) {
		let temp = min;
		min = max;
		max = temp;
		rev = true;
	}
	let valNorm = val - min;
	if(valNorm < 0) valNorm = 0;
	let range = max - min;
	if(valNorm > range) valNorm = range;
	let perc = valNorm / range;
	if(rev) perc = 1 - perc;
	return perc;
}

function percString(perc) {
	let percString = perc.toFixed(4);
	if(perc === 0) percString = ' ' + percString;
	if(perc > 0) percString = '+' + percString;
	return percString;
}

function rpad(s, len) {
	s = '' + s;
	while(unicodeLen(s) < len) s += ' ';
	return s;
}

function lpad(s, len) {
	s = '' + s;
	while(unicodeLen(s) < len) s = ' ' + s;
	return s;
}

function unicodeLen(s) {
	return [...s].length;
}

read();

let exited = false;
function exit() {
	if(exited) return;
	exited = true;
	console.log('\nExiting');
	process.exit(0);
}

process.on('SIGINT', exit);
process.on('exit', exit);
