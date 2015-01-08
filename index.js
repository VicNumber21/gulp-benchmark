'use strict';

var Benchmark = require('benchmark');
var through = require('through2');
var path = require('path');
var gutil = require('gulp-util');
var _ = require('lodash');
var PluginError = gutil.PluginError;
var log = gutil.log;


var pluginName = 'gulp-benchmark';

var caption = function (suite) {
  var name = suite.name || suite.id;
  return name? name + ' from ' + suite.path: suite.path;
};

var consoleLogger = {
  onStart: function (suite) {
    log('Running ' + caption(suite) + ' ...');
  },

  onCycle: function (event) {
    var target = event.target || this;
    var suffix = target.error? gutil.colors.red(' error'): '';
    log('  ' + target + suffix);
  },

  onComplete: function (suite) {

  }
};

//TODO rename to etalonReporter
//TODO create gruntBenchmarkReporter
var consoleReporter = function (etalonName) {
  return function (suite) {
    var passed = [], failed = [];

    suite.forEach(function (test) {
      var container = test.error? failed: passed;
      container.push(test);
    });

    var results = passed.sort(function (a, b) {
      return b.hz - a.hz;
    });

    var etalonIndex = _.isString(etalonName)? results.map(function (test) { return test.name; }).indexOf(etalonName): 0;
    var etalon = (etalonIndex < 0)? results[0]: results[etalonIndex];
    var etalonHz = etalon? etalon.hz: 0;

    log(caption(suite) + ' (' + gutil.colors.green('passed') + ': ' + passed.length + ' ,'
                       + gutil.colors.red('failed') + ': ' + failed.length + ')');

    if (passed.length > 0) {
      log(gutil.colors.green(' Passed') + ':');

      results.forEach(function (test, index) {
        var output = '  ' + test.name;

        if (index < etalonIndex) {
          output += ' ' + (test.hz / etalonHz).toFixed(2) + 'x times faster';
        }
        else if (index > etalonIndex) {
          output += ' ' + (etalonHz / test.hz).toFixed(2) + 'x times slower';
        }
        else {
          output = gutil.colors.yellow(output);
        }

        log(output);
      });
    }

    if (failed.length > 0) {
      log(gutil.colors.red(' Failed') + ':');

      failed.forEach(function (test) {
        log('  ' + test.name + ': ' + test.error);
      });
    }
  };
};


//TODO split into several files
var Bench = {
  from_benchmark: function () {
    //TODO add support of single benchmark
    //     either convert it into suite or support single benchmark in run
    return through.obj(function (file, enc, cb) {
      try {
        var suite = require(path.resolve(process.cwd(), file.path));
        suite.path = file.path;
        cb(null, suite);
      }
      catch (err) {
        cb(err);
      }
    });
  },

  consoleLogger: consoleLogger,
  run: function (logger) {
    var logger = logger || Bench.consoleLogger;

    return through.obj(function (suite, enc, cb) {
      logger.onStart(suite);

      suite.on('cycle', function(event) {
        logger.onCycle(event);
      });

      suite.on('complete', function() {
        if (this.error) {
          var pluginError = new PluginError(pluginName, this.error, {showStack: true});
          log(pluginError.toString());
          cb(err);
        }
        else {
          //TODO copy required fields (name, hs, cycles, count, error, stats, times) into object passed to the rest
          logger.onComplete(this);
          cb(null, this);
        }
      });

      suite.run();
    });
  },

  //TODO rename and create field of reporters object
  //TODO add reporters for csv and json (and yaml?)
  consoleReporter: consoleReporter,
  report: function (reporter) {
    //TODO take array of reporters, map and push results (if not null / undefined) into stream
    reporter = reporter || consoleReporter();
    return through.obj(function (suite, enc, cb) {
      reporter(suite);
      cb(null, suite);
    });
  },

  from_grunt_benchmark: function () {
    return through.obj(function (file, enc, cb) {
      try {
        var description = require(path.resolve(process.cwd(), file.path));
        var options = {};
        var tests = [];

        if (_.isFunction(description)) {
          var name = path.basename(file.path, '.js');
          options.name = name;

          tests.push({
            name: name,
            fn: description
          });
        }
        else if (_.isFunction(description.fn)) {
          options.name = path.basename(file.path, '.js');
          var test = _.extend({}, description);
          test.name = test.name || options.name;
          tests.push(test);
        }
        else if (_.isObject(description.tests)) {
          options = _.extend({}, description);
          delete options.tests;

          tests = _.map(description.tests, function (test, index) {
            test = _.isFunction(test)? {fn: test}: test;
            var name = _.isNumber(index)? '<Test #' + (index + 1) + '>': index;
            test.name = test.name || name;
            return test;
          });
        }

        var suite = new Benchmark.Suite(options);
        suite.path = file.path;

        tests.forEach(function (test) {
          suite.add(test);
        });

        cb(null, suite);
      }
      catch (err) {
        cb(err);
      }
    });
  }
};


module.exports = Bench;
