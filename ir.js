var wpi = require('wiring-pi');

wpi.setup('phys');
const irPin = 11;

wpi.pinMode(irPin, wpi.INPUT);
wpi.pullUpDnControl(irPin, wpi.PUD_UP);

function register() {
	wpi.wiringPiISR(irPin, wpi.INT_EDGE_FALLING, function(delta) {
		console.log('IR Detected', delta);
		register();
	});
}
register();


var exited = false;
function exit() {
	if(exited) return;
	exited = true;
	console.log('\rExiting');
	wpi.wiringPiISRCancel(irPin);
	wpi.pinMode(irPin, wpi.INPUT);
	process.exit(0);
}

process.on('SIGINT', exit);
process.on('exit', exit);