var wpi = require('wiring-pi');

wpi.setup('phys');
const buttonPin = 11;
const greenPin = 13;
const redPin = 12;

wpi.pinMode(buttonPin, wpi.INPUT);
wpi.pullUpDnControl(buttonPin, wpi.PUD_UP)
wpi.pinMode(greenPin, wpi.OUTPUT);
wpi.pinMode(redPin, wpi.OUTPUT);

var clearingTimeout = null;

function updateLed() {
	var pressed = wpi.digitalRead(buttonPin);
	wpi.digitalWrite(greenPin, +!pressed);
	wpi.digitalWrite(redPin, +!!pressed);
	if(clearingTimeout) clearTimeout(clearingTimeout);
	clearingTimeout = setTimeout(function() {
		wpi.digitalWrite(greenPin, 0);
		wpi.digitalWrite(redPin, 0);
	}, 100);
}

updateLed();

function register() {
	wpi.wiringPiISR(buttonPin, wpi.INT_EDGE_BOTH, function() {
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
	wpi.wiringPiISRCancel(buttonPin);
	wpi.pinMode(greenPin, wpi.INPUT);
	wpi.pinMode(redPin, wpi.INPUT);
	process.exit(0);
}

process.on('SIGINT', exit);
process.on('exit', exit);