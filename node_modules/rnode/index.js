'use strict';

var assert = require('assert');
var ms = require('ms');

var cp = require('child_process');
var dns = require('dns');
var fs = require('fs');

module.exports = rnode;
function rnode(min, max) {
  min = ms((min + '') || '0');
  max = ms((max + '') || '500');

  cp.exec = randomizeAsyncFunction(cp.exec, min, max, 'cp.exec');
  cp.execFile = randomizeAsyncFunction(cp.execFile, min, max, 'cp.execFile');
  for (var key in dns)
    if (!(typeof fs[key] != 'function'))
      dns[key] = randomizeAsyncFunction(dns[key], min, max, 'dns.' + key);
  for (var key in fs)
    if (!(typeof fs[key] != 'function'
        || key.match(/Sync$/)
        || key.match(/^[A-Z]/)
        || key.match(/^create/)
        || key.match(/^(un)?watch/)
        ))
      fs[key] = randomizeAsyncFunction(fs[key], min, max, 'fs.' + key);
}

function randomizeAsyncFunction(fn, min, max, name) {
  return matchLength(fn, function () {
    for (var i = 0; i < arguments.length; i++) {
      if (typeof arguments[i] === 'function') {
        arguments[i] = randomizeCallback(arguments[i], min, max, name);
      }
    }
    return fn.apply(this, arguments);
  });
}

function randomizeCallback(fn, min, max, name) {
  return matchLength(fn, function () {
    var self = this;
    var args = arguments;
    var timeout = (Math.random() * (max - min)) + min;
    // console.dir('setTimeout: ' + name);
    setTimeout(function () {
      fn.apply(self, args);
    }, timeout);
  });
  function delay() {
    return (Math.random() * (max - min)) + min;
  }
  return Function('fn, delay', 'return function (' + args.join(', ') + ') { var args = arguments; setTimeout(function () {fn.apply(this, args);}, delay()); }')(fn, delay);
}

function matchLength(fnIn, fnOut) {
  assert(typeof fnIn === 'function', 'expected fnIn to be a function');
  assert(typeof fnOut === 'function', 'expected fnOut to be a function');
  var args = [];
  for (var i = 0; i < fnIn.length; i++) {
    args.push('a' + i);
  }
  return Function('fn', 'return function (' + args.join(',') + ') { return fn.apply(this, arguments); };')(fnOut);
}
