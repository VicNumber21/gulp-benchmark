import compact from 'lodash/compact';

export default function (options = {}) {
    return (data, storageRef) => {
        if (!storageRef.storage) {
            storageRef.storage = {
                records: ['name,date,error,count,cycles,hz'],
                path: options.path || './benchmark-results.csv',
                contents: () => this.records.join('\n')
            };
        }
        storageRef.records = storageRef.records
            .concat(compact(data).map(test =>
                `"${test.name}",${test.times.timestamp},"${test.error}",${test.count},${test.cycles},${test.hz}`));

    };
}
