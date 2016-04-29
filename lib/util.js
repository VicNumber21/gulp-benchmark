import tildify from 'tildify';
import defaults from 'lodash/defaults';
import groupBy from 'lodash/groupBy';
import isArray from 'lodash/isArray';
import isUndefined from 'lodash/isUndefined';
import {colors} from 'gulp-util';

/**
 * Return a caption string for a benchmark suite
 * @param {Benchmark.Suite} suite
 * @param {String} path
 * @returns {String}
 */
export function caption (suite, path) {
    const name = suite.name,
        tildePath = colors.magenta(tildify(path));
    return name ?
        `'${colors.cyan(name)}' from ${tildePath}` :
        tildePath;
}

/**
 * Return an indented string based on a particular numeric level
 * @param {Number} level
 * @returns {String}
 */
export function indent (level) {
    return new Array(2 * level + 1).join(' ');
}

/**
 * Group a suite benchmarks into passed/failed arrays
 * @param {Array<Benchmark>} total
 * @returns {{passed: Array<Benchmark>, failed: Array<Benchmark>}}
 */
export function split (total) {
    return defaults(
        groupBy(total, test => (isUndefined(test.error) ? 'passed' : 'failed')),
        {passed: [], failed: []});
}

/**
 * Sort the benchmarks by fastest time
 * @param {Array<Benchmark>} passed
 * @return {Array<Benchmark>}
 */
export function sortFastestFirst (passed) {
    passed.sort((a, b) => b.hz - a.hz);
    return passed;
}

/**
 * Convert an object o list if it is not one already.
 * @param {*} x
 * @returns {*[]}
 */
export function toArray (x) {
    return isArray(x) ? x : [x];
}
