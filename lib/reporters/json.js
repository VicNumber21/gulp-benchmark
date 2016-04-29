import compact from 'lodash/compact';

/**
 * A json Reporter
 * @param {String} [output]
 * @returns {ReporterHandler}
 */
export default function (output = './benchmark-results.json') {
    const records = [];
    return (suite, path, storageRef) => {
        if (!storageRef.storage) {
            storageRef.storage = { // eslint-disable-line no-param-reassign
                path: output,
                contents: () => JSON.stringify(records)
            };
        }
        records.push({
            name: suite.name,
            results: compact(suite).map(test => ({
                name: test.name,
                times: test.times,
                stats: test.stats,
                error: test.error,
                count: test.count,
                cycles: test.cycles,
                hz: test.hz
            }))
        });
    };
}
