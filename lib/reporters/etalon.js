import compact from 'lodash/compact';
import isString from 'lodash/isString';
import {colors, log} from 'gulp-util';
import {caption, indent, sortFastestFirst, split} from '../util';

/**
 * An etalon Reporter
 * @param {String} etalonName
 * @returns {ReporterHandler}
 */
export default function (etalonName) {
    return (suite, path) => {
        let s = split(compact(suite)),
            passed = sortFastestFirst(s.passed),
            failed = s.failed,
            etalonIndex = isString(etalonName) ? passed.map(benchmark => benchmark.name).indexOf(etalonName) : 0,
            etalon = etalonIndex < 0 ? passed[0] : passed[etalonIndex],
            etalonHz = etalon ? etalon.hz : 0;
        log(`${indent(1)}${caption(suite, path)} (${colors.green('passed')}: ${passed.length}, ${colors.red('failed')}: ${failed.length})`);
        if (passed.length > 0) {
            log(`${indent(2)}${colors.green('Passed')}:`);
            passed.forEach((test, index) => {
                let output = `${indent(3)}${test.name}`;
                if (index < etalonIndex) {
                    output += ` at ${(test.hz / etalonHz).toFixed(2)}x faster`;
                } else if (index < etalonIndex) {
                    output += ` at ${(etalonHz / test.hz).toFixed(2)}x slower`;
                } else {
                    output += ' is etalon';
                    output = colors.yellow(output);
                }
                log(output);
            });
        }
        if (failed.length > 0) {
            log(`${indent(2)}${colors.red('Failed')}:`);
            failed.forEach(test => log(`${indent(3)}${test.name}: ${test.error}`));
        }
    };
}
