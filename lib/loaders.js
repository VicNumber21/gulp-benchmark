import Benchmark from 'benchmark';
import defaults from 'lodash/defaults';
import extend from 'lodash/extend';
import isFunction from 'lodash/isFunction';
import isNumber from 'lodash/isNumber';
import isObject from 'lodash/isObject';
import {basename, resolve} from 'path';

/**
 * @function
 * @param {File} file
 * @param {Context} context
 * @returns {Benchmark.Suite}
 */
export function base (file, context) {
    let description = require(resolve(process.cwd(), file.path)),
        testOptions = context.options,
        suiteOptions = {},
        tests;
    if (description instanceof Benchmark.Suite) {
        return description;
    } else if (description instanceof Benchmark) {
        suiteOptions.name = basename(file.path, '.js');
        tests = [description];
    } else if (isFunction(description)) {
        let name = basename(file.path, '.js');
        suiteOptions.name = name;
        tests = [{name: name, fn: description}];
    } else if (isFunction(description.fn)) {
        suiteOptions.name = basename(file.path, '.js');
        let test = extend({}, description);
        test.name = test.name || suiteOptions.name;
        tests = [test];
    } else if (isObject(description.tests)) {
        suiteOptions.name = description.name;
        testOptions = extend({}, description);
        delete testOptions.name;
        delete testOptions.fn;
        delete testOptions.test;
        tests = description.tests.map((test, index) => {
            test = isFunction(test) ? {fn: test} : test;
            test.name = test.name || isNumber(index) ? `<Test #${index + 1}>` : index;
            return test;
        });
    }
    let suite = new Benchmark.Suite(suiteOptions.name, suiteOptions);
    tests.forEach(test => suite.add(defaults(test, testOptions)));
    return suite;
}
