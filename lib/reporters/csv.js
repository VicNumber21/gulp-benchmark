import {total} from '../util';
import map from 'lodash/map';

export default function (options = {}) {
    return (data, storageRef) => {
        storageRef.storage = {
            records: 'name,date,error,count,cycles,hz\n',
            path: options.path || './benchmark-results.csv',
            contents: function () {
                return this.records;
            }
        };
        storageRef.storage.records +=
            [data.name].concat(
                map(total(data), test => {
                    return `"${test.name}",${test.times.timestamp},"${test.error}",${test.count},${test.cycles},${test.hz}`;
                }))
                .join('\n');
    };
}
