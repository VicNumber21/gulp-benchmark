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

it('from_grunt_benchmark - single function', function (cb) {
  this.timeout(20000);

  var stream = bench.from_grunt_benchmark();

  stream.on('data', function (output) {
    try {
      expect(output).to.be.instanceof(Benchmark.Suite);
      cb();
    }
    catch (err) {
      cb(err);
    }
  });

  stream.write(new File({path: './test-data/grunt-benchmark-single-function.js'}));
  stream.end();
});

it('from_grunt_benchmark - single test with options', function (cb) {
  this.timeout(20000);

  var stream = bench.from_grunt_benchmark();

  stream.on('data', function (output) {
    try {
      expect(output).to.be.instanceof(Benchmark.Suite);
      cb();
    }
    catch (err) {
      cb(err);
    }
  });

  stream.write(new File({path: './test-data/grunt-benchmark-single-test-with-options.js'}));
  stream.end();
});

it('from_grunt_benchmark - test suite with array of functions', function (cb) {
  this.timeout(20000);

  var stream = bench.from_grunt_benchmark();

  stream.on('data', function (output) {
    try {
      expect(output).to.be.instanceof(Benchmark.Suite);
      globalTestSuite = output;
      cb();
    }
    catch (err) {
      cb(err);
    }
  });

  stream.write(new File({path: './test-data/grunt-benchmark-test-suite-with-array-of-functions.js'}));
  stream.end();
});

it('from_grunt_benchmark - test suite with array of objects', function (cb) {
  this.timeout(20000);

  var stream = bench.from_grunt_benchmark();

  stream.on('data', function (output) {
    try {
      expect(output).to.be.instanceof(Benchmark.Suite);
      cb();
    }
    catch (err) {
      cb(err);
    }
  });

  stream.write(new File({path: './test-data/grunt-benchmark-test-suite-with-array-of-objects.js'}));
  stream.end();
});

it('from_grunt_benchmark - test suite with object', function (cb) {
  this.timeout(20000);

  var stream = bench.from_grunt_benchmark();

  stream.on('data', function (output) {
    try {
      expect(output).to.be.instanceof(Benchmark.Suite);
      cb();
    }
    catch (err) {
      cb(err);
    }
  });

  stream.write(new File({path: './test-data/grunt-benchmark-test-suite-with-object.js'}));
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

  //stream.write(require('./test-data/benchmark.js'));
  stream.write(globalTestSuite);
  stream.end();
});

it('report', function (cb) {
  this.timeout(20000);

  var stream = bench.report(bench.consoleReporter());

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
