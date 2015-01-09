var Benchmark = require('benchmark');


var bench = new Benchmark({
  name: 'RegExp#test',
  fn: function() {
    /o/.test('Hello World!');
  }
});


module.exports = bench;
