import Benchmark from 'benchmark';
import {basename, resolve} from 'path';
import defaults from 'lodash/defaults';
import extend from 'lodash/extend';
import isFunction from 'lodash/isFunction';
import isNumber from 'lodash/isNumber';
import isObject from 'lodash/isObject';
import map from 'lodash/map';
import {isBenchmark} from '../utils';

export function base (file, context) {
    let description = require(resolve(process.cwd(), file.path)),
        suiteOptions = {},
        testOptions = context.options,
        tests = [];
    if (isBenchmark(description)) {
        suiteOptions.name = description.name;
        tests = description;
    } else if (description instanceof Benchmark) {
        suiteOptions.name = basename(file.path, '.js');
        tests.push(description);
    } else if (isFunction(description)) {
        let name = basename(file.path, '.js');
        suiteOptions.name = name;
        tests.push({name: name, fn: description});
    } else if (isFunction(description.fn)) {
        suiteOptions.name = basename(file.path, '.js');
        let test = extend({}, description);
        test.name = test.name || suiteOptions.name;
        tests.push(test);
    } else if (isObject(description.tests)) {
        suiteOptions.name = description.name;
        testOptions = extend({}, description);
        delete testOptions.name;
        delete testOptions.fn;
        delete testOptions.test;
        tests = map(description.tests, (test, index) => {
            test = isFunction(test) ? {fn: test} : test;
            test.name = test.name || isNumber(index) ? `<Test #${index + 1}>` : index;
            return test;
        });
    }
    let suite = new Benchmark.Suite(suiteOptions);
    tests.forEach(test => suite.add(defaults(test, testOptions)));
    return suite;
}
