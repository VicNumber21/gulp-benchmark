module.exports = {
  name: 'Timeout (asynchronous)',
  maxTime: 0.1,
  defer: true,
  onComplete: function() {
    console.log('Hooray!');
  },
  fn: function(deferred) {
    setTimeout(function() {
      deferred.resolve();
    }, 1);
  }
};
