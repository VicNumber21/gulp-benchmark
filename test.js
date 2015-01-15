/*global it */

'use strict';

var bench = require('./index');

var expect = require('chai').expect;
var File = require('gulp-util').File;
var Benchmark = require('benchmark');


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

  var runStream = bench.run();

  runStream.on('data', function (output) {
    try {
      expect(output).to.be.instanceof(Benchmark.Suite);
      expect(output).to.not.have.property('error');
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

it('report - etalon', function () {
  var stream = bench.report(bench.reporters.etalon('RegExp#test'));
  stream.write(require('./test-data/run-statistic'));
  stream.end();
});

it('report - fastest', function () {
  var stream = bench.report(bench.reporters.fastest());
  stream.write(require('./test-data/run-statistic'));
  stream.end();
});

it('report - etalon and fastest', function () {
  var stream = bench.report([bench.reporters.etalon('RegExp#test'), bench.reporters.fastest()]);
  stream.write(require('./test-data/run-statistic'));
  stream.end();
});

it('report - json', function (cb) {
  this.timeout(20000);

  var stream = bench.report(bench.reporters.json());

  stream.on('data', function (output) {
    try {
      expect(output).to.be.instanceof(File);
      expect(output.path).to.be.equal('./benchmark-results.json');
      cb();
    }
    catch (err) {
      cb(err);
    }
  });

  stream.write(require('./test-data/run-statistic'));
  stream.end();
});

it('report - csv', function (cb) {
  this.timeout(20000);

  var stream = bench.report(bench.reporters.csv());

  stream.on('data', function (output) {
    try {
      expect(output).to.be.instanceof(File);
      expect(output.path).to.be.equal('./benchmark-results.csv');
      cb();
    }
    catch (err) {
      cb(err);
    }
  });

  stream.write(require('./test-data/run-statistic'));
  stream.end();
});
