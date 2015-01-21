var Benchmark = require('benchmark');
var path = require('path');
var _ = require('lodash');
var util = require('../util');

module.exports = function (file, context) {
  var description = require(path.resolve(process.cwd(), file.path));

  var suiteOptions = {};
  var testOptions = context.options;
  var tests = [];


  if (util.isBenchmarkSuite(description)) {
    suiteOptions.name = description.name;
    tests = _.toArray(description);
  }
  else if (description instanceof Benchmark) {
    suiteOptions.name = path.basename(file.path, '.js');
    tests.push(description);
  }
  else if (_.isFunction(description)) {
    var name = path.basename(file.path, '.js');
    suiteOptions.name = name;

    tests.push({
      name: name,
      fn: description
    });
  }
  else if (_.isFunction(description.fn)) {
    suiteOptions.name = path.basename(file.path, '.js');
    var test = _.extend({}, description);
    test.name = test.name || suiteOptions.name;
    tests.push(test);
  }
  else if (_.isObject(description.tests)) {
    suiteOptions.name = description.name;
    testOptions = _.defaults({}, description);
    delete testOptions.name;
    delete testOptions.fn;
    delete testOptions.tests;

    tests = _.map(description.tests, function (test, index) {
      test = _.isFunction(test)? {fn: test}: test;
      var name = _.isNumber(index)? '<Test #' + (index + 1) + '>': index;
      test.name = test.name || name;
      return test;
    });
  }

  var suite = new Benchmark.Suite(suiteOptions);

  tests.forEach(function (test) {
    suite.add(_.defaults(test, testOptions));
  });

  return suite;
};
