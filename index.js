'use strict';

var Benchmark = require('benchmark');
var through = require('through2');
var path = require('path');
var gutil = require('gulp-util');
var _ = require('lodash');
var PluginError = gutil.PluginError;
var log = gutil.log;
var green = gutil.colors.green;
var red = gutil.colors.red;
var yellow = gutil.colors.yellow;
var File = gutil.File;


var pluginName = 'gulp-benchmark';

var caption = function (suite) {
  var name = suite.name || suite.id;
  return name? '"' + name + '" from ' + suite.path: suite.path;
};

var consoleLogger = {
  onStart: function (suite) {
    log('Running ' + caption(suite) + ' ...');
  },

  onCycle: function (event) {
    var target = event.target || this;
    var suffix = target.error? red(' error'): '';
    log('  ' + target + suffix);
  },

  onComplete: function (suite) {

  }
};

//TODO create gruntBenchmarkReporter
var etalonReporter = function (etalonName) {
  return function (data) {

    var total = _.toArray(data);
    var split = _.groupBy(total, function (test) {
      return _.isUndefined(test.error)? 'passed': 'failed';
    });

    var passed = split['passed'] || [];
    var failed = split['failed'] || [];

    var results = passed.sort(function (a, b) {
      return b.hz - a.hz;
    });

    var etalonIndex = _.isString(etalonName)? _.pluck(results, 'name').indexOf(etalonName): 0;
    var etalon = (etalonIndex < 0)? results[0]: results[etalonIndex];
    var etalonHz = etalon? etalon.hz: 0;

    log(caption(data) + ' (' + green('passed') + ': ' + passed.length + ' ,'
                          + red('failed') + ': ' + failed.length + ')');

    if (passed.length > 0) {
      log(green(' Passed') + ':');

      results.forEach(function (test, index) {
        var output = '  "' + test.name + '"';

        if (index < etalonIndex) {
          output += ' at ' + (test.hz / etalonHz).toFixed(2) + 'x faster';
        }
        else if (index > etalonIndex) {
          output += ' at ' + (etalonHz / test.hz).toFixed(2) + 'x slower';
        }
        else {
          output += ' is etalon';
          output = yellow(output);
        }

        log(output);
      });
    }

    if (failed.length > 0) {
      log(red(' Failed') + ':');

      failed.forEach(function (test) {
        log('  ' + test.name + ': ' + test.error);
      });
    }

    return null;
  };
};


//TODO split into several files
var Bench = {
  load: function () {
    return through.obj(function (file, enc, cb) {
      try {
        var description = require(path.resolve(process.cwd(), file.path));
        var suite;
        var options = {};
        var tests = [];

        if (description instanceof Benchmark.Suite) {
          suite = description;
        }
        else if (description instanceof Benchmark) {
          options.name = path.basename(file.path, '.js');
          tests.push(description);
        }
        else if (_.isFunction(description)) {
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

        suite = suite || new Benchmark.Suite(options);
        suite.path = file.path;

        tests.forEach(function (test) {
          suite.add(test);
        });

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
      try {
        logger.onStart(suite);

        suite.on('cycle', function (event) {
          logger.onCycle(event);
        });

        suite.on('complete', function () {
          if (this.error) {
            var pluginError = new PluginError(pluginName, this.error, {showStack: true});
            log(pluginError.toString());
            cb(err);
          }
          else {
            logger.onComplete(this);
            cb(null, this);
          }
        });

        suite.run();
      }
      catch (err) {
        cb(err);
      }
    });
  },

  //TODO add reporters for csv and json (and yaml?)
  reporters: {
    etalon: etalonReporter
  },

  report: function (reporters) {
    reporters = reporters || [Bench.reporters.etalon()];
    reporters = _.isArray(reporters)? reporters: [reporters];

    return through.obj(function (data, enc, cb) {
      try {
        var files = _.map(reporters, function (reporter) {
          return reporter(data);
        });

        var stream = this;

        _.forEach(files, function (file) {
          if (file instanceof File) {
            stream.push(file);
          }
        });

        cb(null);
      }
      catch (err) {
        cb(err);
      }
    });
  }
};


module.exports = Bench;
