var wpi = require('wiring-pi');

wpi.setup('phys');

var value = 1;
var direction = 1;
const PINS = [11, 12];
const STATES = [
  [0,0],
  [0,1],
  [1,1],
  [1,0],
];

wpi.pinMode(PINS[0], wpi.SOFT_PWM_OUTPUT);
wpi.pinMode(PINS[1], wpi.SOFT_PWM_OUTPUT);

var timer = setInterval(function() {
  // wpi.digitalWrite(PINS[0], STATES[value][0]);
  // wpi.digitalWrite(PINS[1], STATES[value][1]);
  wpi.softPwmWrite(PINS[0], getOutput(value));
  wpi.softPwmWrite(PINS[1], getOutput(value - 50));
  
  // value = (value+1) % 4;
  value = (value + direction) % 150;
  
}, 20);

function getOutput(val) {
  if(val < 0) return 0;
  if(val <= 50) return val * 2;
  if(val <= 100) return (val * -2) + 200;
  return 0;
}

process.on('SIGINT', function() {
  console.log('\rExiting');
  clearInterval(timer);
  // wpi.digitalWrite(PINS[0], 0);
  // wpi.digitalWrite(PINS[1], 0);
  wpi.softPwmWrite(PINS[0], 0);
  wpi.softPwmStop(PINS[0]);
  wpi.softPwmWrite(PINS[1], 0);
  wpi.softPwmStop(PINS[1]);
  process.exit(0);
});