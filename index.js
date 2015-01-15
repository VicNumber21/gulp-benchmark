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

  onComplete: function () {
  }
};

var etalonReporter = function (etalonName) {
  return function (data) {
    var total = _(data).toArray().compact().value();
    var split = _.groupBy(total, function (test) {
      return _.isUndefined(test.error)? 'passed': 'failed';
    });

    var passed = split.passed || [];
    var failed = split.failed || [];

    var results = passed.sort(function (a, b) {
      return b.hz - a.hz;
    });

    var etalonIndex = _.isString(etalonName)? _.pluck(results, 'name').indexOf(etalonName): 0;
    var etalon = (etalonIndex < 0)? results[0]: results[etalonIndex];
    var etalonHz = etalon? etalon.hz: 0;

    log(caption(data) + ' (' + green('passed') + ': ' + passed.length + ' ,' +
                               red('failed') + ': ' + failed.length + ')');

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
  };
};

var fastestReporter = function () {
  return function (data) {
    var total = _(data).toArray().compact().value();
    var split = _.groupBy(total, function (test) {
      return _.isUndefined(test.error) ? 'passed' : 'failed';
    });

    var passed = split.passed || [];

    var results = passed.sort(function (a, b) {
      return b.hz - a.hz;
    });

    if (results.length === 0) {
      log('No passed tests');
    }
    else if (results.length === 1) {
      log('Only test passed: ' + Benchmark.prototype.toString.call(results[0]));
    }
    else {
      var first = results[0];
      var second = results[1];
      var times = first.hz / second.hz;
      var timesStr = Benchmark.formatNumber(times.toFixed(times < 2 ? 2 : 1));
      log('Fastest test is ' + first.name + ' at ' + timesStr + 'x faster than ' + second.name);
    }
  };
};

var jsonReporter = function (options) {
  options = options || {};

  return function (data, storageRef) {
    if (!storageRef.storage) {
      storageRef.storage = {
        records: [],
        path: options.path || './benchmark-results.json',
        contents: function () {
          return JSON.stringify(this.records, null, '  ');
        }
      };
    }

    var total = _(data).toArray().compact().value();

    var record = {
      name: data.name,
      results: _.map(total, function (test) {
        return {
          name : test.name,
          times: test.times,
          stats: test.stats,
          error : test.error,
          count : test.count,
          cycles: test.cycles,
          hz : test.hz
        };
      })
    };

    storageRef.storage.records.push(record);
  };
};

//TODO improve csv reporter - add multiple suite support as it was done for json
var csvReporter = function (options) {
  options = options || {};

  return function (data, storageRef) {
    if (!storageRef.storage) {
      storageRef.storage = {
        records: 'name,date,error,count,cycles,hz\n',
        path: options.path || './benchmark-results.csv',
        contents: function () {
          return this.records;
        }
      };
    }

    var total = _(data).toArray().compact().value();

    storageRef.storage.records += data.name + '\n' + _.map(total, function (test) {
      return [
          '"' + test.name + '"',
          test.times.timeStamp,
          '"' + test.error + '"',
          test.count,
          test.cycles,
          test.hz
        ].join(',') + '\n';
    });
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
    logger = logger || Bench.consoleLogger;

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
            cb(this.error);
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

  reporters: {
    etalon: etalonReporter,
    fastest: fastestReporter,
    json: jsonReporter,
    csv: csvReporter
  },

  report: function (reporters) {
    reporters = reporters || [Bench.reporters.etalon()];
    reporters = _.isArray(reporters)? reporters: [reporters];
    var outputs = [];

    return through.obj(function (data, enc, cb) {
      try {
        _.forEach(reporters, function (reporter, index) {
          var storageRef = outputs[index] = outputs[index] || { storage: null };

          reporter(data, storageRef);
        });

        cb();
      }
      catch (err) {
        cb(err);
      }
    }, function (cb) {
      try {
        var stream = this;

        _.forEach(outputs, function (storageRef) {
          var storage = storageRef.storage;

          if (storage) {
            stream.push(new File ({
              cwd: process.cwd(),
              path: storage.path,
              contents: new Buffer(storage.contents())
            }));
          }
        });

        cb();
      }
      catch (err) {
        cb(err);
      }
    });
  }
};


module.exports = Bench;
