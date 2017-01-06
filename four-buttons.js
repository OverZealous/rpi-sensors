let wpi = require('wiring-pi');

wpi.setup('phys');
const buttons = [
	{ pin: 7, label: 'Up', },
	{ pin: 11, label: 'Down', },
	{ pin: 12, label: 'Left', },
	{ pin: 16, label: 'Right', },
];
const DEBOUNCE_DELAY_MS = 200;

buttons.forEach(btn => {
	btn.last = null;
	btn.counter = 0;
	btn.debounce = false;
	wpi.pinMode(btn.pin, wpi.INPUT);
	wpi.pullUpDnControl(btn.pin, wpi.PUD_UP);
});

/*
 * Listens to button presses
 * Workflow:
 *
 * - Register on a pin, both rising and falling (press & release)
 * - Upon notification, check to see pin state
 * - If pin state has changed, respond to it.
 * - If the pin state is 0 (pressed), then see if we've responded to a press within a DEBOUNCE_DELAY_MS
 * - If we haven't, then we handle the button press
 *
 */
function register(btn, index) {
	wpi.wiringPiISR(btn.pin, wpi.INT_EDGE_BOTH, function() {
		let state = wpi.digitalRead(btn.pin);
		if(state !== btn.last) {
			btn.last = state;
			if(state === 0) {
				if(!btn.debounce) {
					btn.counter++;
					console.log(`Button ${btn.label} pressed ${btn.counter} time${btn.counter === 1 ? '' : 's'}`);
					btn.debounce = true;
					setTimeout(() => btn.debounce = false, DEBOUNCE_DELAY_MS);
				} // else we just triggered it, so assume it was a bounce
			}
		}
		register(btn, index);
	});
}
buttons.forEach(register);


let exited = false;
function exit() {
	if(exited) return;
	exited = true;
	console.log('\rExiting');
	buttons.forEach(btn => {
		wpi.wiringPiISRCancel(btn.pin);
	});
	process.exit(0);
}

process.on('SIGINT', exit);
process.on('exit', exit);

console.log('Ready!');