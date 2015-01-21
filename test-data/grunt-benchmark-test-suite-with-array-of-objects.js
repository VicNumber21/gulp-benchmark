module.exports = {
  name: 'Timeout Showdown',
  maxTime: 0.1,
  tests: [
    {
      name: 'Return immediately (synchronous)',
      fn: function() {
          return;
      }
    }, {
      name: 'Timeout 50ms (asynchronous)',
      defer: true,
      fn: function(deferred) {
        setTimeout(function() {
          deferred.resolve();
        }, 50);
      }
    }, {
      name: 'Timeout 100ms (asynchronous)',
      defer: true,
      fn: function(deferred) {
        setTimeout(function() {
          deferred.resolve();
        }, 50);
      }
    }
  ]
};
