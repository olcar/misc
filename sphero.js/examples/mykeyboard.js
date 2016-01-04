"use strict";

/* eslint no-use-before-define: 0 */
/* eslint no-process-exit: 0 */

var sphero   = require("/Users/ocartier/projects/bb8/sphero.js/");
var keypress = require("keypress");
var bb8      = sphero(process.env.PORT);

var heading  = 0;
bb8.connect(listen);

function listen() {
  bb8.configureCollisions({
    meth: 0x01,
    xt: 0x20,
    yt: 0x20,
    xs: 0x20,
    ys: 0x20,
    dead: 0x50
  });
  bb8.on("collision", function(err, data) {
    if (err) {
      console.log(err);
    } else {
      console.log("collision detected!");
    }
  });

  keypress(process.stdin);
  process.stdin.on("keypress", handle);
  
  console.log("Connected to BB and listening to keyboard...");

  process.stdin.setRawMode(true);
  process.stdin.resume();
}

function handle(ch, key) {
  //var stop = bb8.roll.bind(bb8, 0, 0);

  var input = ch;
  if (key !== undefined) {
    input = key.name;
  }
  //console.log('input -> ' + input);

  var colors = [0x0, 'violet', 'indigo', 'blue', 'green', 'yellow', 'orange', 'red', 'pink', 'white'];
  var dig = parseInt(input);
  if (0 <= dig) {
    var color = colors[dig];
    bb8.color(color);
    console.log("color now set to", color);
  }

  if (input === 'b') {
    bb8.getBluetoothInfo(function(err, data) {
      if (err) {
        console.log(err);
      } else {
        var str = data.name;
        var n = str.indexOf('0');
        var name = str.slice(0,n);
        var mac = data.btAddress;
        mac = mac.match( /.{1,2}/g ).join(':');
        console.log("BB's real name is", name, '['+mac+']');
      }
    });
  }

  if (input === 'v') {
    bb8.getPowerState(function(err, data) {
      if (err) {
        console.log("error: ", err);
      } else {
        console.log("data:");
        console.log("  recVer:", data.recVer);
        console.log("  batteryState:", data.batteryState);
        console.log("  batteryVoltage:", data.batteryVoltage);
        console.log("  chargeCount:", data.chargeCount);
        console.log("  secondsSinceCharge:", data.secondsSinceCharge);
      }
    });
  }

  if (input === 'l') {
    bb8.readLocator(function(err, data) {
      if (err) {
        console.log(err);
      } else {
        console.log("data:");
        console.log("  xpos:", data.xpos);
        console.log("  ypos:", data.ypos);
        console.log("  xvel:", data.xvel);
        console.log("  yvel:", data.yvel);
        console.log("  sog:", data.sog); 
      }
    });
  }

  if (input === 'p') {
    bb8.ping(function(err, data) {
      if (err) {
        console.log(err);
      } else {
        console.log('BB has been pinged');
      }
    });
  }

  if (input === 'm') {
    bb8.getDeviceMode(function(err, data) {
      if (err) {
        console.log(err);
      } else {
        console.log('BB is in', data.mode, 'mode');
      }
    });
  }

  if (input === 'r') {
    bb8.randomColor(function(err, data) {
      if (err) {
        console.log(err);
      } else {
        console.log('setting random color');
      }
    });
  }

  if (input === "g") {
    bb8.runMacro(1);
  }

  if (input === "up") {
    heading = 0;
    bb8.roll(55, heading);
  }

  if (input === "down") {
    heading = 180;
    bb8.roll(55, heading);
  }

  if (input === "left") {
    heading = 270;
    bb8.roll(55, heading);
  }

  if (input === "right") {
    heading = 90;
    bb8.roll(55, heading);
  }

  if (input === "space") {
    bb8.roll(0, heading);
  }

  if (input === 'c' && key.ctrl) {
    bb8.sleep(1, 0, 0);
    bb8.disconnect(disconnected);
    process.stdin.pause();
    process.exit();
  } else if (input === 'c') {
    bb8.startCalibration();
    console.log("starting calibration");
  }

  if (input === 'x') {
    bb8.finishCalibration();
    console.log("calibration finished");
  }
}

function disconnected() {
  console.log('BBonne nuit.');
}
