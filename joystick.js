var wpi = require('wiring-pi');

wpi.setup('phys');
const btnPin = 11;
const yAxisPin = 12;
const xAxisPin = 13;

wpi.pinMode(btnPin, wpi.INPUT);
wpi.pullUpDnControl(btnPin, wpi.PUD_DOWN);
wpi.pinMode(yAxisPin, wpi.INPUT);
wpi.pullUpDnControl(btnPin, wpi.PUD_UP);
wpi.pinMode(xAxisPin, wpi.INPUT);
wpi.pullUpDnControl(btnPin, wpi.PUD_UP);

function register(pin) {
	wpi.wiringPiISR(pin, wpi.INT_EDGE_BOTH, function(delta) {
		console.log(pin, pin === btnPin ? wpi.digitalRead(pin) : wpi.analogRead(pin), delta);
		register(pin);
	});
}
register(btnPin);
register(yAxisPin);
register(xAxisPin);


var exited = false;
function exit() {
	if(exited) return;
	exited = true;
	console.log('\rExiting');
	wpi.wiringPiISRCancel(btnPin);
	wpi.wiringPiISRCancel(yAxisPin);
	wpi.wiringPiISRCancel(xAxisPin);
	process.exit(0);
}

process.on('SIGINT', exit);
process.on('exit', exit);
