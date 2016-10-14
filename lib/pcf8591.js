const wiringPi = require('wiring-pi');

const DEFAULT_PCF_BASE = 120;

function init(pcfBase = DEFAULT_PCF_BASE, addr = 0x48) {
	const analogPins = [
		pcfBase,
		pcfBase + 1,
		pcfBase + 2,
		pcfBase + 3,
	];

	wiringPi.pcf8591Setup(pcfBase, addr);
	// clear the output pin
	write(0, 0);

	function read(pin) {
		// read twice to deal with pcf8591 read current (not previous) value
		wiringPi.analogRead(getPin(pin));
		return wiringPi.analogRead(getPin(pin));
	}

	function write(pin, value) {
		return wiringPi.analogWrite(getPin(pin), value);
	}

	function getPin(pin) {
		return analogPins[pin];
	}

	return {
		read,
		write,
		getPin
	}
}

module.exports = {
	init,
};