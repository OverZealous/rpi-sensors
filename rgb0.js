var wpi = require('wiring-pi');
var cm = require('color-model');

wpi.setup('phys');

// var value = new cm.Hsl(0, 0, 0);
var h = 0;
var s = 100;
var l = 10;

const PINS = [11, 12, 13];

wpi.pinMode(PINS[0], wpi.OUTPUT);
wpi.pinMode(PINS[1], wpi.OUTPUT);
wpi.pinMode(PINS[2], wpi.OUTPUT);

wpi.digitalWrite(PINS[0], 1);
wpi.digitalWrite(PINS[1], 1);
wpi.digitalWrite(PINS[2], 1);
  
var timer = setInterval(function() {
  var color = new cm.Hsl(h, s / 100, l / 100).toRgb();
  // console.log(`(${h}, ${s}, ${l})`, color.toHex().toString());
  
  wpi.softPwmWrite(PINS[0], 1 - Math.round(color.red() / 255));
  wpi.softPwmWrite(PINS[1], 1 - Math.round(color.green() / 255));
  wpi.softPwmWrite(PINS[2], 1 - Math.round(color.blue() / 255));
  
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
  wpi.digitalWrite(PINS[0], 1);
  wpi.digitalWrite(PINS[1], 1);
  wpi.digitalWrite(PINS[2], 1);

  wpi.pinMode(PINS[0], wpi.INPUT);
  wpi.pinMode(PINS[1], wpi.INPUT);
  wpi.pinMode(PINS[2], wpi.INPUT);
  process.exit(0);
});