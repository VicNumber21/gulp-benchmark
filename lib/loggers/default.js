'use strict';

var util = require('../util');
var gutil = require('gulp-util');

module.exports = {
  onStart: function (suite) {
    gutil.log('Running ' + util.caption(suite) + ' ...');
  },

  onCycle: function (event) {
    var target = event.target;
    var suffix = target.error? gutil.colors.red(' error'): '';
    gutil.log('  ' + target + suffix);
  },

  onError: function (suite) {
    gutil.log(gutil.colors.red('Errors') + ' in ' + util.caption(suite) + ':');

    suite.forEach(function (test) {
      if (test.error) {
        gutil.log('  ' + test.name + ': ' + test.error);
      }
    });
  }
};
