import tildify from 'tildify';
import {colors} from 'gulp-util';
import compact from 'lodash/compact';
import defaults from 'lodash/defaults';
import groupBy from 'lodash/groupBy';
import isArray from 'lodash/isArray';
import isFunction from 'lodash/isFunction';
import isNumber from 'lodash/isNumber';
import isObject from 'lodash/isObject';
import isUndefined from 'lodash/isUndefined';

export function caption (suite) {
    let name = suite.name || suite.id,
        path = colors.magenta(tildify(suite.path));
    return name ?
        '\'' + colors.cyan(name) + '\' from ' + path :
        path;
}

export function indent (level) {
    return new Array(2 * level + 1).join(' ');
}

export function total (data) {
    return compact(data);
}

export function split (total) {
    return defaults(
        groupBy(total, test => isUndefined(test.error) ? 'passed' : 'failed'),
        {passed: [], failed: []});
}

export function sortFastestFirst (passed) {
    return passed.sort((a, b) => b.hz - a.hz);
}

export function isBenchmarkSuite (x) {
    return isObject(x) && isFunction(x.on) && isFunction(x.run) && isNumber(x.length);
}

export function toArray (x) {
    return isArray(x) ? x : [x];
}
