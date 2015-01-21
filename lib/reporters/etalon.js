'use strict';

var _ = require('lodash');
var util = require('../util');
var gutil = require('gulp-util');

module.exports = function (etalonName) {
  return function (data) {
    var total = util.total(data);
    var split = util.split(total);
    var passed = util.sortFastestFirst(split.passed);
    var failed = split.failed;

    var etalonIndex = _.isString(etalonName)? _.pluck(passed, 'name').indexOf(etalonName): 0;
    var etalon = (etalonIndex < 0)? passed[0]: passed[etalonIndex];
    var etalonHz = etalon? etalon.hz: 0;

    gutil.log(util.indent(1) + util.caption(data) + ' (' + gutil.colors.green('passed') + ': ' + passed.length + ', ' +
                                                           gutil.colors.red('failed') + ': ' + failed.length + ')');

    if (passed.length > 0) {
      gutil.log(util.indent(2) + gutil.colors.green('Passed') + ':');

      passed.forEach(function (test, index) {
        var output = util.indent(3) + '\'' + test.name + '\'';

        if (index < etalonIndex) {
          output += ' at ' + (test.hz / etalonHz).toFixed(2) + 'x faster';
        }
        else if (index > etalonIndex) {
          output += ' at ' + (etalonHz / test.hz).toFixed(2) + 'x slower';
        }
        else {
          output += ' is etalon';
          output = gutil.colors.yellow(output);
        }

        gutil.log(output);
      });
    }

    if (failed.length > 0) {
      gutil.log(util.indent(2) + gutil.colors.red('Failed') + ':');

      failed.forEach(function (test) {
        gutil.log(util.indent(3) + test.name + ': ' + test.error);
      });
    }
  };
};
