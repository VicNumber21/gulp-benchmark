'use strict';

var through = require('through2');
var path = require('path');


var Bench = {
  load: {}
};

Bench.load.benchmark = function () {
  return through.obj(function (file, enc, cb) {
    try {
      this.push(require(path.resolve(process.cwd(), file.path)));
      cb();
    }
    catch (err) {
      cb(err);
    }
  });
};


module.exports = Bench;
