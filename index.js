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
      log('Running ' + caption(suite) + ' ...');

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
  },

  total: function (etalonName) {
    return through.obj(function (suite, enc, cb) {
      var results = suite.sort(function (a, b) {
        return b.hz - a.hz;
      });

      var etalonIndex = results.pluck('name').indexOf(etalonName);
      var etalon = etalonIndex < 0? null: results[etalonIndex];
      //TODO throw error if etalon not found?

      log('Total for ' + caption(suite));

      results.forEach(function (test, index) {
        var output = '  ';

        if (index < etalonIndex) {
          output += test.name + ' ' + (test.hz / etalon.hz).toFixed(3) + 'x times faster';
        }
        else if (index > etalonIndex) {
          output += test.name + ' ' + (etalon.hz / test.hz).toFixed(3) + 'x times slower';
        }
        else {
          output += gutil.colors.green(etalon.name);
        }

        log(output);
      });

      cb(null, suite);
    });
  }
};


module.exports = Bench;
