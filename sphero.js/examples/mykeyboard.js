"use strict";

/* eslint no-use-before-define: 0 */
/* eslint no-process-exit: 0 */

var sphero   = require("../");
var keypress = require("keypress");
var bb8      = sphero(process.env.PORT);

bb8.connect(listen);

function handle(ch, key) {
  var stop = bb8.roll.bind(bb8, 0, 0);

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

  if (input === 's') {
    bb8.sleep(10, 0, 0, function(err, data) {
      console.log(err || "data: " + data);
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

  // max speed is 255 !!!
  if (input === "up") {
    bb8.roll(155, 0);
  }

  if (input === "down") {
    bb8.roll(155, 180);
  }

  if (input === "left") {
    bb8.roll(155, 270);
  }

  if (input === "right") {
    bb8.roll(155, 90);
  }

  if (input === "space") {
    stop();
  }
  if (input === "enter") {
    bb8.boost(1);
  }

  if (input === 'c' && key.ctrl) {
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

function disconnected() {
  console.log('BBonne nuit.');
}
