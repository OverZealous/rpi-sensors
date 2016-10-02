var wpi = require('wiring-pi');
var cm = require('color-model');

wpi.setup('phys');

// var value = new cm.Hsl(0, 0, 0);
var h = 0;
var s = 100;
var l = 10;

const PINS = [11, 12, 13];

wpi.softPwmCreate(PINS[0], 100, 100);
wpi.pinMode(PINS[0], wpi.SOFT_PWM_OUTPUT);
wpi.softPwmWrite(PINS[0], 100);
wpi.softPwmCreate(PINS[1], 100, 100);
wpi.pinMode(PINS[1], wpi.SOFT_PWM_OUTPUT);
wpi.softPwmWrite(PINS[1], 100);
wpi.softPwmCreate(PINS[2], 100, 100);
wpi.pinMode(PINS[2], wpi.SOFT_PWM_OUTPUT);
wpi.softPwmWrite(PINS[2], 100);

var timer = setInterval(function() {
  var color = new cm.Hsl(h, s / 100, l / 100).toRgb();
  // console.log(`(${h}, ${s}, ${l})`, color.toHex().toString());

  wpi.softPwmWrite(PINS[0], 100 - Math.floor(90 * color.red() / 255));
  wpi.softPwmWrite(PINS[1], 100 - Math.floor(90 * color.green() / 255));
  wpi.softPwmWrite(PINS[2], 100 - Math.floor(90 * color.blue() / 255));

  h += 1;
  if(h > 360) {
    // console.log(color.toHex().toString());
    h = 0;
    // l += 10;
    // if(l > 100) {
    //   l = 0;
    //   // s -= 10;
    //   // if(s < 0) {
    //   //   s = 100;
    //   // }
    // }
  }

}, 20);

process.on('SIGINT', function() {
  console.log('\rExiting');
  clearInterval(timer);
  wpi.softPwmStop(PINS[0]);
  wpi.digitalWrite(PINS[0], 1);
  wpi.softPwmStop(PINS[1]);
  wpi.digitalWrite(PINS[1], 1);
  wpi.softPwmStop(PINS[2]);
  wpi.digitalWrite(PINS[2], 1);

  wpi.pinMode(PINS[0], wpi.INPUT);
  wpi.pinMode(PINS[1], wpi.INPUT);
  wpi.pinMode(PINS[2], wpi.INPUT);
  process.exit(0);
});