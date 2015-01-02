'use strict';

var bench = require('./index');

var expect = require('chai').expect;
var File = require('gulp-util').File;
var Benchmark = require('benchmark');


it('load.benchmark', function (cb) {
  this.timeout(20000);

  var stream = bench.load.benchmark();

  stream.on('data', function (output) {
    try {
      expect(output).to.be.instanceof(Benchmark.Suite);
      cb();
    }
    catch (err) {
      cb(err);
    }
  });

  stream.write(new File({path: './test-data/benchmark.js'}));
  stream.end();
});
