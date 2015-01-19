module.exports = {
  name: 'Timeout Showdown',
  tests: {
    'Return immediately (synchronous)': {
      maxTime: 0.1,
      fn: function() {
        throw new Error('Test exception');
      }
    },
    'Timeout: 50ms (asynchronous)': {
      maxTime: 0.1,
      defer: true,
      fn: function(deferred) {
        setTimeout(function() {
          deferred.resolve();
        }, 50);
      }
    },
    'Timeout: 100ms (asynchronous)': {
      maxTime: 0.1,
      defer: true,
      fn: function(deferred) {
        setTimeout(function() {
          deferred.resolve();
        }, 100);
      }
    }
  }
};
