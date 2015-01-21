'use strict';

var through = require('through2');
var gutil = require('gulp-util');
var util = require('./lib/util');
var _ = require('lodash');

var load = require('./lib/load');
var run = require('./lib/run');
var report = require('./lib/report');

var pluginName = 'gulp-benchmark';


var gbenchmark = function (options) {
  var defaultOptions = {
    options: {},
    loaders: [],
    logger: gbenchmark.loggers.default,
    failOnError: true,
    reporters: [gbenchmark.reporters.etalon()]
  };

  var context = _.defaults(options || {}, defaultOptions);
  context.loaders = util.toArray(context.loaders);
  context.logger = _.defaults(context.logger, gbenchmark.loggers.silent);
  context.reporters = util.toArray(context.reporters);
  context.outputs = [];

  return through.obj(function (file, enc, cb) {
    var stream = this;

    load(file, context)
      .then(function (suite) {
        return run(suite, context);
      })
      .then(function (suite) {
        return report.prepare(suite, context);
      })
      .fail(function (err) {
        var pluginError = new gutil.PluginError(pluginName, err, {showStack: true});
        gutil.log(pluginError.toString());
        stream.emit('error', pluginError);
      })
      .finally(function () {
        cb();
      });
  }, function (cb) {
    var stream = this;

    try {
      report.flush(stream, context);
    }
    catch (err) {
      stream.emit('error', new gutil.PluginError(pluginName, err, {showStack: true}));
    }

    cb();
  });
};

gbenchmark.loggers = require('./lib/loggers');
gbenchmark.reporters = require('./lib/reporters');

module.exports = gbenchmark;
