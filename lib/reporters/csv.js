'use strict';

var _ = require('lodash');
var util = require('../util');

//TODO improve csv reporter - add multiple suite support as it was done for json
module.exports = function (options) {
  options = options || {};

  return function (data, storageRef) {
    if (!storageRef.storage) {
      storageRef.storage = {
        records: 'name,date,error,count,cycles,hz\n',
        path: options.path || './benchmark-results.csv',
        contents: function () {
          return this.records;
        }
      };
    }

    var total = util.total(data);

    storageRef.storage.records += data.name + '\n' + _.map(total, function (test) {
      return [
          '"' + test.name + '"',
          test.times.timeStamp,
          '"' + test.error + '"',
          test.count,
          test.cycles,
          test.hz
        ].join(',') + '\n';
    });
  };
};
