import compact from 'lodash/compact';

export default function (path = './benchmark-results.json') {
    return (data, storageRef) => {
        if (!storageRef.storage) {
            storageRef.storage = {
                records: [],
                path: path,
                contents: function () {
                    return JSON.stringify(this.records, null, '  ');
                }
            };
        }
        storageRef.storage.records.push({
            name: data.name,
            results: compact(data).map(test => {
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
