'use strict';

var through = require('through2');
var gutil = require('gulp-util');
var util = require('./lib/util');
var _ = require('lodash');
var defaultLoaders = require('./lib/loaders');

//TODO move load, run and report into lib and create only benchmark function with combined options
var Bench = {
  load: function (options) {
    var defaultOptions = {
      loaders: []
    };

    options = _.defaults(options || {}, defaultOptions);
    options.loaders = _.isArray(options.loaders)? options.loaders: [options.loaders];

    return through.obj(function (file, enc, cb) {
      var stream = this;

      try {
        var suite;
        var loaders = options.loaders.concat(defaultLoaders);

        for(var index = 0; !util.isBenchmarkSuite(suite) && index < loaders.length; ++index) {
          suite = loaders[index](file);
        };

        if (util.isBenchmarkSuite(suite) && suite.length > 0) {
          suite.path = file.path;
          cb(null, suite);
        }
        else {
          stream.emit('error', new gutil.PluginError({
            plugin: util.pluginName,
            message:'Benchmark failed on loading',
            showStack: false
          }));
          cb();
        }
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
