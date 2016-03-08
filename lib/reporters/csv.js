import compact from 'lodash/compact';

/**
 * A CSV Reporter
 * @param {String} [output]
 * @returns {ReporterHandler}
 */
export default function (output = './benchmark-results.csv') {
    let records = ['name,date,error,count,cycles,hz'];
    return (suite, path, storageRef) => {
        if (!storageRef.storage) {
            storageRef.storage = {
                path: output,
                contents: () => records.join('\n')
            };
        }
        records = records.concat(compact(suite).map(test =>
            `"${test.name}",${test.times.timestamp},"${test.error}",${test.count},${test.cycles},${test.hz}`));
    };
}
