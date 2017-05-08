'use strict';

var assert = require('assert');
var fs = require('fs');
var rnode = require('../');

function timeRead(cb) {
  var start = new Date();
  fs.readFile(__filename, function (err, res) {
    var end = new Date();
    cb(null, end - start);
  });
}

timeRead(function (err, time) {
  var before = time;
  rnode(500, '1s');
  timeRead(function (err, time) {
    var after = time;
    assert(after > before * 10);
    console.log('before: ' + before);
    console.log('after: ' + after);
  });
});
