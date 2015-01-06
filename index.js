'use strict';

var through = require('through2');
var path = require('path');
var gutil = require('gulp-util');
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

    var etalonIndex = results.map(function (test) { return test.name; }).indexOf(etalonName);
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


var Bench = {
  from_benchmark: function () {
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
          logger.onComplete(this);
          cb(null, this);
        }
      });

      suite.run();
    });
  },

  consoleReporter: consoleReporter,
  report: function (reporter) {
    reporter = reporter || consoleReporter();
    return through.obj(function (suite, enc, cb) {
      reporter(suite);
      cb(null, suite);
    });
  }
};


module.exports = Bench;
