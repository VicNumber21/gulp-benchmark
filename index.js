'use strict';

var through = require('through2');
var path = require('path');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;
var log = gutil.log;


var pluginName = 'gulp-benchmark';

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

  run: function () {
    return through.obj(function (suite, enc, cb) {
      var name = suite.name || suite.id;
      var caption = name? name + ' from ' + suite.path: suite.path;

      log('Running ' + caption + '...');

      var onError = function (err) {
        var pluginError = new PluginError(pluginName, err, {showStack: true});
        log(pluginError.toString());
        cb(err);
      };

      suite.on('cycle', function(event) {
        var target = event.target || this;
        log('  ' + target);
      });

      suite.on('complete', function() {
        if (this.error) {
          onError(this.error);
        }
        else {
          cb(null, this);
        }
      });

      suite.on('error', function(event) {
        onError(event.target.error);
      });

      suite.run();
    });
  }
};


module.exports = Bench;
