var Q = require('q');
var _ = require('lodash');
var gutil = require('gulp-util');

module.exports = {
  prepare: function (suite, context) {
    _.forEach(context.reporters, function (reporter, index) {
      var storageRef = context.outputs[index] = context.outputs[index] || { storage: null };

      reporter(suite, storageRef);
    });

    return Q.resolve();
  },

  flush: function (stream, context) {
    _.forEach(context.outputs, function (storageRef) {
      var storage = storageRef.storage;

      if (storage) {
        stream.push(new gutil.File ({
          cwd: process.cwd(),
          path: storage.path,
          contents: new Buffer(storage.contents())
        }));
      }
    });

    return Q.resolve();
  }
};
