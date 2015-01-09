'use strict';

var bench = require('./index');

var expect = require('chai').expect;
var File = require('gulp-util').File;
var Benchmark = require('benchmark');

var globalTestSuite;

it('load - single benchmark', function (cb) {
  this.timeout(20000);

  var stream = bench.load();

  stream.on('data', function (output) {
    try {
      expect(output).to.be.instanceof(Benchmark.Suite);
      cb();
    }
    catch (err) {
      cb(err);
    }
  });

  stream.write(new File({path: './test-data/benchmark-single.js'}));
  stream.end();
});

it('load - benchmark suite', function (cb) {
  this.timeout(20000);

  var stream = bench.load();

  stream.on('data', function (output) {
    try {
      expect(output).to.be.instanceof(Benchmark.Suite);
      cb();
    }
    catch (err) {
      cb(err);
    }
  });

  stream.write(new File({path: './test-data/benchmark-suite.js'}));
  stream.end();
});

it('load - grunt-benchmark - single function', function (cb) {
  this.timeout(20000);

  var stream = bench.load();

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

it('load - grunt-benchmark - single test with options', function (cb) {
  this.timeout(20000);

  var stream = bench.load();

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

it('load - grunt-benchmark - test suite with array of functions', function (cb) {
  this.timeout(20000);

  var stream = bench.load();

  stream.on('data', function (output) {
    try {
      expect(output).to.be.instanceof(Benchmark.Suite);
      cb();
    }
    catch (err) {
      cb(err);
    }
  });

  stream.write(new File({path: './test-data/grunt-benchmark-test-suite-with-array-of-functions.js'}));
  stream.end();
});

it('load - grunt-benchmark - test suite with array of objects', function (cb) {
  this.timeout(20000);

  var stream = bench.load();

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

it('load - grunt-benchmark - test suite with object', function (cb) {
  this.timeout(20000);

  var stream = bench.load();

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

  var runStream = bench.run()

  runStream.on('data', function (output) {
    try {
      expect(output).to.be.instanceof(Benchmark.Suite);
      expect(output).to.not.have.property('error');
      globalTestSuite = output; //TODO this is ugly; how to rework
      cb();
    }
    catch (err) {
      cb(err);
    }
  });

  var loadStream = bench.load();

  loadStream.on('data', function(output) {
    runStream.write(output);
    runStream.end();
  });

  loadStream.write(new File({path: './test-data/grunt-benchmark-single-test-with-options.js'}));
  loadStream.end();
});

it('report', function (cb) {
  this.timeout(20000);

  var stream = bench.report(bench.consoleReporter());

  stream.on('data', function (output) {
    try {
      expect(output).to.be.instanceof(Benchmark.Suite);
      expect(output).to.not.have.property('error');
      cb();
    }
    catch (err) {
      cb(err);
    }
  });

  stream.write(globalTestSuite);
  stream.end();
});
