import Benchmark from 'benchmark';
import defaults from 'lodash/defaults';
import clone from 'lodash/clone';
import isFunction from 'lodash/isFunction';
import isNumber from 'lodash/isNumber';
import isObject from 'lodash/isObject';
import map from 'lodash/map';
import {basename, resolve} from 'path';

/**
 * @function
 * @param {File} file
 * @param {Context} context
 * @returns {Benchmark.Suite}
 */
export function base (file, context) {
    let description = require(resolve(process.cwd(), file.path)), // eslint-disable-line no-mixed-requires
        testOptions = context.options,
        suiteName,
        tests;

    if (description instanceof Benchmark.Suite) {
        return description;
    } else if (description instanceof Benchmark) {
        suiteName = description.name || basename(file.path, '.js');
        let test = description.options;
        test.name = suiteName;
        test.fn = description.fn;
        tests = [test];
    } else if (isFunction(description.fn)) {
        suiteName = description.name || basename(file.path, '.js');
        description.name = description.name || suiteName;
        tests = [description];
    } else if (isObject(description.tests)) {
        suiteName = description.name || basename(file.path, '.js');
        testOptions = clone(description);
        delete testOptions.name;
        delete testOptions.fn;
        delete testOptions.tests;
        tests = map(description.tests, (test, index) => {
            test = isFunction(test) ? {fn: test} : test;
            test.name = test.name || isNumber(index) ? `<Test #${index + 1}>` : index;
            return test;
        });
    } else if (isFunction(description)) {
        suiteName = basename(file.path, '.js');
        tests = [{name: suiteName, fn: description}];
    }
    let suite = new Benchmark.Suite(suiteName);
    tests.forEach(test => suite.add(defaults(test, testOptions)));
    return suite;
}
