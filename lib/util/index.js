'use strict';

var _ = require('lodash');
var tildify = require('tildify');
var gutil = require('gulp-util');

module.exports = {
  caption: function (suite) {
    var name = suite.name || suite.id;
    var path = gutil.colors.magenta(tildify(suite.path));
    return name ? '\'' + gutil.colors.cyan(name) + '\' from ' + path : path;
  },

  indent: function (level) {
    return new Array(2 * level + 1).join(' ');
  },

  total: function (data) {
    return _(data).toArray().compact().value();
  },

  split: function (total) {
    var split = _.groupBy(total, function (test) {
      return _.isUndefined(test.error) ? 'passed' : 'failed';
    });

    return _.defaults(split, {passed: [], failed: []});
  },

  sortFastestFirst: function (passed) {
    return passed.sort(function (a, b) {
      return b.hz - a.hz;
    });
  },

  isBenchmarkSuite: function (x) {
    return _.isObject(x) && _.isFunction(x.on) && _.isFunction(x.run) && _.isNumber(x.length);
  },

  toArray: function (x) {
    return _.isArray(x)? x: [x];
  }
};


