var Benchmark = require('benchmark');


var bench = new Benchmark({
  name: 'RegExp#test',
  maxTime: 0.1,
  fn: function() {
    throw new Error('Wrong code!');
  }
});


module.exports = bench;
