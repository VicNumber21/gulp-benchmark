var Q = require('q');
var util = require('./util');
var defaultLoaders = require('./loaders');

module.exports = function (file, context) {
  var deferred = Q.defer();
  var suite;
  var loaders = context.loaders.concat(defaultLoaders);

  for(var index = 0; !util.isBenchmarkSuite(suite) && index < loaders.length; ++index) {
    suite = loaders[index](file, context);
  }

  if (util.isBenchmarkSuite(suite) && suite.length > 0) {
    suite.path = file.path;
    deferred.resolve(suite);
  }
  else {
    deferred.reject(new Error('Benchmark failed on loading'));
  }

  return deferred.promise;
};
