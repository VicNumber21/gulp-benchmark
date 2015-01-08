module.exports = {
  name: 'Timeout (asynchronous)',
  maxTime: 2, /* test should run for max. this no. of seconds */
  defer: true, /* indicates that test is asynchronous */
  onComplete: function() {
    console.log('Hooray!');
  },
  fn: function(deferred) {
    setTimeout(function() {
      deferred.resolve();
    }, 500);
  }
};
