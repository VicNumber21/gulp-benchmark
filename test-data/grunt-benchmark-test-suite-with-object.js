module.exports = {
  name: 'Timeout Showdown',
  maxTime: 0.1,
  tests: {
    'Return immediately (synchronous)': function() {
      return;
    },
    'Timeout: 50ms (asynchronous)': {
      defer: true,
      fn: function(deferred) {
        setTimeout(function() {
          deferred.resolve();
        }, 50);
      }
    },
    'Timeout: 100ms (asynchronous)': {
      defer: true,
      fn: function(deferred) {
        setTimeout(function() {
          deferred.resolve();
        }, 100);
      }
    }
  }
};
