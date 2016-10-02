let wpi = require('wiring-pi');

function handleExit(pins) {
	function exit() {
		console.log('\rExiting');
		clearInterval(timer);
		wpi.digitalWrite(PIN, 0);
		wpi.pinMode(PIN, wpi.INPUT);
		process.exit(0);
	}

	process.on('SIGINT', exit);
	process.on('exit', exit);
}

function initDigitalOutput(value, ...pins) {
	pins.forEach(pin => {
		wpi.digitalWrite(pin, value);
		wpi.pinMode(pin, wpi.OUTPUT);
		wpi.digitalWrite(pin, value);
	});
}

function initPwmOutput(value, ...pins) {
	pins.forEach(pin => {
		wpi.digitalWrite(pin, value);
		wpi.pinMode(pin, wpi.OUTPUT);
		wpi.digitalWrite(pin, value);
	});
}

module.exports = {
	initDigitalOutput,
	initPwmOutput,
};