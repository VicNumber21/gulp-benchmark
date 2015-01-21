'use strict';

var bench = require('./index');

var expect = require('chai').expect;
var File = require('gulp-util').File;
var Benchmark = require('benchmark');
var path = require('path');

it('single benchmark', function (cb) {
  this.timeout(20000);

  var stream = bench({reporters: bench.reporters.json()});

  stream.on('data', function (output) {
    try {
      expect(path.basename(output.path)).be.eql('benchmark-results.json');
      //TODO add more tests here
      cb();
    }
    catch (err) {
      cb(err);
    }
  });

  stream.write(new File({path: './test-data/benchmark-single.js'}));
  stream.end();
});

it('benchmark suite', function (cb) {
  this.timeout(20000);

  var stream = bench({reporters: bench.reporters.json()});

  stream.on('data', function (output) {
    try {
      expect(path.basename(output.path)).be.eql('benchmark-results.json');
      //TODO add more tests here
      cb();
    }
    catch (err) {
      cb(err);
    }
  });

  stream.write(new File({path: './test-data/benchmark-suite.js'}));
  stream.end();
});

it('grunt-benchmark - single function', function (cb) {
  this.timeout(20000);

  var stream = bench({
    options: { maxTime: 0.1 },
    reporters: bench.reporters.json()
  });

  stream.on('data', function (output) {
    try {
      expect(path.basename(output.path)).be.eql('benchmark-results.json');
      //TODO add more tests here
      cb();
    }
    catch (err) {
      cb(err);
    }
  });

  stream.write(new File({path: './test-data/grunt-benchmark-single-function.js'}));
  stream.end();
});

it('grunt-benchmark - single test with options', function (cb) {
  this.timeout(20000);

  var stream = bench({reporters: bench.reporters.json()});

  stream.on('data', function (output) {
    try {
      expect(path.basename(output.path)).be.eql('benchmark-results.json');
      //TODO add more tests here
      cb();
    }
    catch (err) {
      cb(err);
    }
  });

  stream.write(new File({path: './test-data/grunt-benchmark-single-test-with-options.js'}));
  stream.end();
});

it('grunt-benchmark - test suite with array of functions', function (cb) {
  this.timeout(20000);

  var stream = bench({reporters: bench.reporters.json()});

  stream.on('data', function (output) {
    try {
      expect(path.basename(output.path)).be.eql('benchmark-results.json');
      //TODO add more tests here
      cb();
    }
    catch (err) {
      cb(err);
    }
  });

  stream.write(new File({path: './test-data/grunt-benchmark-test-suite-with-array-of-functions.js'}));
  stream.end();
});

it('grunt-benchmark - test suite with array of objects', function (cb) {
  this.timeout(20000);

  var stream = bench({reporters: bench.reporters.json()});

  stream.on('data', function (output) {
    try {
      expect(path.basename(output.path)).be.eql('benchmark-results.json');
      //TODO add more tests here
      cb();
    }
    catch (err) {
      cb(err);
    }
  });

  stream.write(new File({path: './test-data/grunt-benchmark-test-suite-with-array-of-objects.js'}));
  stream.end();
});

it('grunt-benchmark - test suite with object', function (cb) {
  this.timeout(20000);

  var stream = bench({reporters: bench.reporters.json()});

  stream.on('data', function (output) {
    try {
      expect(path.basename(output.path)).be.eql('benchmark-results.json');
      //TODO add more tests here
      cb();
    }
    catch (err) {
      cb(err);
    }
  });

  stream.write(new File({path: './test-data/grunt-benchmark-test-suite-with-object.js'}));
  stream.end();
});

it('custom loader', function (cb) {
  this.timeout(20000);

  var customLoader = function (file) {
    var path = require('path');
    var description = require(path.resolve(process.cwd(), file.path));

    var suite;

    if (description && description.title && description.method) {
      suite = new Benchmark.Suite(description.title);
      suite.add(description.title, description.method, { maxTime: 0.1 });
    }

    return suite;
  };

  var stream = bench({
    loaders: customLoader,
    reporters: bench.reporters.json()
  });

  stream.on('data', function (output) {
    try {
      expect(path.basename(output.path)).be.eql('benchmark-results.json');
      //TODO add more tests here
      cb();
    }
    catch (err) {
      cb(err);
    }
  });

  stream.write(new File({path: './test-data/custom.js'}));
  stream.end();
});

it('loading error', function (cb) {
  this.timeout(20000);

  var stream = bench({reporters: bench.reporters.json()});

  stream.on('error', function () {
    cb();
  });

  stream.write(new File({path: './test-data/custom.js'}));
  stream.end();
});

it('running error', function (cb) {
  this.timeout(20000);

  var stream = bench({reporters: bench.reporters.json()});

  stream.on('error', function () {
    cb();
  });

  stream.write(new File({path: './test-data/grunt-benchmark-test-suite-with-errors.js'}));
  stream.end();
});

it('report - etalon', function (cb) {
  this.timeout(20000);

  var stream = bench({
    reporters: [
      bench.reporters.etalon('RegExp#test'),
      bench.reporters.json()
    ]
  });

  stream.on('data', function (output) {
    try {
      expect(path.basename(output.path)).be.eql('benchmark-results.json');
      //TODO add more tests here
      cb();
    }
    catch (err) {
      cb(err);
    }
  });

  stream.write(new File({path: './test-data/benchmark-suite.js'}));
  stream.end();
});

it('report - etalon errors', function (cb) {
  this.timeout(20000);

  var stream = bench({
    failOnError: false,
    reporters: [
      bench.reporters.etalon(),
      bench.reporters.json()
    ]
  });

  stream.on('data', function (output) {
    try {
      expect(path.basename(output.path)).be.eql('benchmark-results.json');
      //TODO add more tests here
      cb();
    }
    catch (err) {
      cb(err);
    }
  });

  stream.write(new File({path: './test-data/grunt-benchmark-test-suite-with-errors.js'}));
  stream.end();
});

it('report - fastest', function (cb) {
  this.timeout(20000);

  var stream = bench({
    failOnError: false,
    reporters: [
      bench.reporters.fastest(),
      bench.reporters.json()
    ]
  });

  stream.on('data', function (output) {
    try {
      expect(path.basename(output.path)).be.eql('benchmark-results.json');
      //TODO add more tests here
      cb();
    }
    catch (err) {
      cb(err);
    }
  });

  stream.write(new File({path: './test-data/benchmark-suite.js'}));
  stream.end();
});

it('report - fastest no passed', function (cb) {
  this.timeout(20000);

  var stream = bench({
    failOnError: false,
    reporters: [
      bench.reporters.fastest(),
      bench.reporters.json()
    ]
  });

  stream.on('data', function (output) {
    try {
      expect(path.basename(output.path)).be.eql('benchmark-results.json');
      //TODO add more tests here
      cb();
    }
    catch (err) {
      cb(err);
    }
  });

  stream.write(new File({path: './test-data/benchmark-single-errors.js'}));
  stream.end();
});

it('report - fastest only passed', function (cb) {
  this.timeout(20000);

  var stream = bench({
    failOnError: false,
    reporters: [
      bench.reporters.fastest(),
      bench.reporters.json()
    ]
  });

  stream.on('data', function (output) {
    try {
      expect(path.basename(output.path)).be.eql('benchmark-results.json');
      //TODO add more tests here
      cb();
    }
    catch (err) {
      cb(err);
    }
  });

  stream.write(new File({path: './test-data/benchmark-single.js'}));
  stream.end();
});

it('report - csv', function (cb) {
  this.timeout(20000);

  var stream = bench({reporters: bench.reporters.csv()});

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

  stream.write(new File({path: './test-data/benchmark-suite.js'}));
  stream.end();
});
