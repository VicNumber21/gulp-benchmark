import Benchmark from 'benchmark';
import compact from 'lodash/compact';
import {log} from 'gulp-util';
import {indent, split, sortFastestFirst} from '../util';

/**
 * An etalon Reporter
 * @returns {ReporterHandler}
 */
export default function () {
    return (suite) => {
        let passed = sortFastestFirst(split(compact(suite)).passed);
        if (passed.length === 0) {
            log(`${indent(1)}No passed tests`);
        } else if (passed.length === 1) {
            log(`${indent(1)}Only test passed: ${passed[0]}`);
        } else {
            let first = passed[0],
                second = passed[1],
                times = first.hz / second.hz,
                timesStr = Benchmark.formatNumber(+times.toFixed(times < 2 ? 2 : 1));
            log(`${indent(1)}Fastest test is '${first.name}' at ${timesStr}x faster than '${second.name}'`);
        }
    };
}
