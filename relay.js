var wpi = require('wiring-pi');

wpi.setup('phys');

const PIN = 11;
var value = 1;

wpi.pinMode(PIN, wpi.OUTPUT);

var timer = setInterval(function() {
	console.log('Turning relay', value ? 'on' : 'off');
	wpi.digitalWrite(PIN, value);
	value = +!value;
}, 500);

function exit() {
	console.log('\rExiting');
	clearInterval(timer);
	wpi.digitalWrite(PIN, 0);
	wpi.pinMode(PIN, wpi.INPUT);
	process.exit(0);
}

process.on('SIGINT', exit);
process.on('exit', exit);