var Benchmark = require('benchmark');
var path = require('path');
var _ = require('lodash');
var util = require('../util');

module.exports = function (file) {
  var description = require(path.resolve(process.cwd(), file.path));

  var suite;
  var options = {};
  var tests = [];

  if (util.isBenchmarkSuite(description)) {
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

  tests.forEach(function (test) {
    suite.add(test);
  });

  return suite;
};
