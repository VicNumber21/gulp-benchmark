'use strict';

var _ = require('lodash');
var util = require('../util');

module.exports = function (options) {
  options = options || {};

  return function (data, storageRef) {
    if (!storageRef.storage) {
      storageRef.storage = {
        records: [],
        path: options.path || './benchmark-results.json',
        contents: function () {
          return JSON.stringify(this.records, null, '  ');
        }
      };
    }

    var total = util.total(data);

    var record = {
      name: data.name,
      results: _.map(total, function (test) {
        return {
          name : test.name,
          times: test.times,
          stats: test.stats,
          error : test.error,
          count : test.count,
          cycles: test.cycles,
          hz : test.hz
        };
      })
    };

    storageRef.storage.records.push(record);
  };
};
