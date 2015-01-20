'use strict';

var _ = require('lodash');

module.exports = {
  pluginName: 'gulp-benchmark',

  caption: function (suite) {
    var name = suite.name || suite.id;
    return name ? '"' + name + '" from ' + suite.path : suite.path;
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
  }
};


