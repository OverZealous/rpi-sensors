/**
 * Reads input from the joystick module via the pcf8591 module
 */
const wpi = require('wiring-pi');
const pcf8591 = require('./lib/pcf8591');

const Y_AXIS = 0;
const X_AXIS = 1;
const HOME = 128;
const CENTER_BUFFER = 20;
const BTN = 2;

wpi.setup('wpi');

const pcf = pcf8591.init();

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
	let yVal = pcf.read(Y_AXIS);
	let xVal = pcf.read(X_AXIS);
	let btnPressed = pcf.read(BTN) < 100;
	if(yVal < HOME - CENTER_BUFFER) vertical = 'Top';
	if(yVal > HOME + CENTER_BUFFER) vertical = 'Bottom';
	if(xVal < HOME - CENTER_BUFFER) horizontal = 'Right';
	if(xVal > HOME + CENTER_BUFFER) horizontal = 'Left';

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

	process.stdout.write("\r" + state);
	setTimeout(read, 10);
}

function rpad(s, len) {
	s = '' + s;
	while(s.length < len) s += ' ';
	return s;
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
