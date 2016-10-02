var wpi = require('wiring-pi');

wpi.setup('phys');
const tiltPin = 11;
const greenPin = 13;
const redPin = 12;

wpi.pinMode(tiltPin, wpi.INPUT);
wpi.pullUpDnControl(tiltPin, wpi.PUD_UP)
wpi.pinMode(greenPin, wpi.OUTPUT);
wpi.pinMode(redPin, wpi.OUTPUT);

function updateLed() {
	var pressed = wpi.digitalRead(tiltPin);
	wpi.digitalWrite(greenPin, +!pressed);
	wpi.digitalWrite(redPin, +!!pressed);
}

updateLed();

function register() {
	wpi.wiringPiISR(tiltPin, wpi.INT_EDGE_BOTH, function() {
		updateLed();
		register();
	});
}
register();


var exited = false;
function exit() {
	if(exited) return;
	exited = true;
	console.log('\rExiting');
	wpi.wiringPiISRCancel(tiltPin);
	wpi.pinMode(greenPin, wpi.INPUT);
	wpi.pinMode(redPin, wpi.INPUT);
	process.exit(0);
}

process.on('SIGINT', exit);
process.on('exit', exit);