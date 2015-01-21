var Benchmark = require('benchmark');


var suite = new Benchmark.Suite('Search');
var options = { maxTime: 0.1 };

suite.add('RegExp#test', function() {
    /o/.test('Hello World!');
  }, options)
  .add('String#indexOf', function() {
    'Hello World!'.indexOf('o') > -1;
  }, options)
  .add('String#match', function() {
    !!'Hello World!'.match(/o/);
  }, options);


module.exports = suite;
