'use strict';

var Benchmark = require('benchmark');
var through = require('through2');
var path = require('path');
var gutil = require('gulp-util');
var util = require('./lib/util');
var _ = require('lodash');

//TODO move load, run and report into lib and create only benchmark function with combined options
var Bench = {
  //TODO add custom loaders via options
  load: function () {
    return through.obj(function (file, enc, cb) {
      var stream = this;

      try {
        var description = require(path.resolve(process.cwd(), file.path));
        var suite;
        var options = {};
        var tests = [];

        if (_.isObject(description) && _.isFunction(description.on) && _.isFunction(description.run) && _.isNumber(description.length)) {
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
        stream.emit('error', new gutil.PluginError(util.pluginName, err, {showStack: true}));
        cb();
      }
    });
  },

  loggers: require('./lib/loggers'),

  run: function (options) {
    var defaultOptions = {
      logger: Bench.loggers.default,
      failOnError: true
    };

    options = _.defaults(options || {}, defaultOptions);
    options.logger = _.defaults(options.logger, Bench.loggers.silent);

    return through.obj(function (suite, enc, cb) {
      var stream = this;

      try {
        var logger = options.logger;

        logger.onStart(suite);

        suite.on('cycle', function (event) {
          logger.onCycle(event);
        });

        suite.on('complete', function () {
          var data = this;

          if (_(this.pluck('error')).compact().value().length > 0) {
            logger.onError(this);

            var pluginError = new gutil.PluginError({
              plugin: util.pluginName,
              message:'Benchmark test(s) failure',
              showStack: false
            });

            gutil.log(pluginError.toString());

            if (options.failOnError) {
              stream.emit('error', pluginError);
              data = undefined;
            }
          }
          else {
            logger.onComplete(this);
          }

          cb(null, data);
        });

        suite.run();
      }
      catch (err) {
        stream.emit('error', new gutil.PluginError(util.pluginName, err, {showStack: true}));
        cb();
      }
    });
  },

  reporters: require('./lib/reporters'),

  report: function (reporters) {
    reporters = reporters || [Bench.reporters.etalon()];
    reporters = _.isArray(reporters)? reporters: [reporters];
    var outputs = [];

    return through.obj(function (data, enc, cb) {
      var stream = this;

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
            stream.push(new gutil.File ({
              cwd: process.cwd(),
              path: storage.path,
              contents: new Buffer(storage.contents())
            }));
          }
        });

        cb();
      }
      catch (err) {
        stream.emit('error', new gutil.PluginError(util.pluginName, err, {showStack: true}));
        cb();
      }
    });
  }
};

module.exports = Bench;
