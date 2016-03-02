import map from 'lodash/map';
import {total} from '../utils';

export default function (options = {}) {
    return (data, storageRef) => {
        if (!storageRef.storage) {
            storageRef.storage = {
                records: [],
                path: options.path || './benchmark-results.json',
                contents: function () {
                    return JSON.stringify(this.records, null, '  ');
                }
            };
        }
        storageRef.storage.records.push({
            name: data.name,
            results: map(total(data), test => {
                return {
                    name: test.name,
                    times: test.times,
                    stats: test.stats,
                    error: test.error,
                    count: test.count,
                    cycles: test.cycles,
                    hz: test.hz
                };
            })
        });
    };
}
