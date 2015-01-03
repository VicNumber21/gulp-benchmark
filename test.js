'use strict';

var bench = require('./index');

var expect = require('chai').expect;
var File = require('gulp-util').File;
var Benchmark = require('benchmark');

var globalTestSuite;

it('from_benchmark', function (cb) {
  this.timeout(20000);

  var stream = bench.from_benchmark();

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

it('run', function (cb) {
  this.timeout(20000);

  var stream = bench.run()

  stream.on('data', function (output) {
    try {
      expect(output).to.be.instanceof(Benchmark.Suite);
      expect(output).to.not.have.property('error');
      expect(output).to.have.length(3);
      globalTestSuite = output; //TODO this is ugly; how to rework
      cb();
    }
    catch (err) {
      cb(err);
    }
  });

  stream.write(require('./test-data/benchmark.js'));
  stream.end();
});

it('total', function (cb) {
  this.timeout(20000);

  var stream = bench.total('RegExp#test');

  stream.on('data', function (output) {
    try {
      expect(output).to.be.instanceof(Benchmark.Suite);
      expect(output).to.not.have.property('error');
      expect(output).to.have.length(3);
      cb();
    }
    catch (err) {
      cb(err);
    }
  });

  stream.write(globalTestSuite);
  stream.end();
});
