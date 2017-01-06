/**
 * Reads input from the joystick module via the pcf8591 module
 */
const wpi = require('wiring-pi');
const pcf8591 = require('./lib/pcf8591');

const digitalPin = 0;
const analogPin = 1;

wpi.setup('wpi');
const pcf = pcf8591.init();

function read() {
	let dIn = wpi.digitalRead(digitalPin);
	let aIn = pcf.read(analogPin);
	process.stdout.write(`\r${ dIn ? 'Dry' : 'Raining' } (${ aIn })                `);
	setTimeout(read, 10);
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
