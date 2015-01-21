var Q = require('q');
var _ = require('lodash');

module.exports = function (suite, context) {
  var deferred = Q.defer();
  var logger = context.logger;

  logger.onStart(suite);

  suite.on('cycle', function (event) {
    logger.onCycle(event);
  });

  suite.on('complete', function () {
    var error = _(this.pluck('error')).compact().value().length > 0;

    if (error) {
      logger.onError(this);
    }
    else {
      logger.onComplete(this);
    }

    if (error && context.failOnError) {
      deferred.reject(new Error('Benchmark test(s) failure'));
    }
    else {
      deferred.resolve(this);
    }
  });

  suite.run();

  return deferred.promise;
};
