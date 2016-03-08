import Benchmark from 'benchmark';
import {expect} from 'chai';
import {File} from 'gulp-util';
import {basename, resolve} from 'path';
import gulpBenchmark from './../../index';
import {reporters} from './../../index';

/**
 * Test a passing function
 * @param {String} name
 * @param {Object} benchOptions
 * @param {Function} assert
 * @param {String} input
 * @return {undefined}
 */
function test (name, benchOptions, assert, input) {
    it(name, function (cb) {
        this.timeout(20000);
        let stream = gulpBenchmark(benchOptions);
        stream.on('data', function (output) {
            try {
                assert(output);
                cb();
            } catch (err) {
                cb(err);
            }
        });
        stream.write(new File({path: resolve(__dirname, input)}));
        stream.end();
    });
}

/**
 * Test a failing function
 * @param {String} name
 * @param {Object} benchOptions
 * @param {String} input
 * @return {undefined}
 */
function testError (name, benchOptions, input) {
    it(name, function (cb) {
        this.timeout(20000);
        let stream = gulpBenchmark(benchOptions);
        stream.on('error', function () {
            cb();
        });
        stream.write(new File({path: resolve(__dirname, input)}));
        stream.end();
    });
}

/**
 * Assert output path is json
 * @param {File} output
 * @return {undefined}
 */
function jsonAssert (output) {
    expect(basename(output.path)).be.eql('benchmark-results.json');
}

/**
 * Assert output path is csv
 * @param {File} output
 * @return {undefined}
 */
function csvAssert (output) {
    expect(output).to.be.instanceof(File);
    expect(output.path).to.be.equal('./benchmark-results.csv');
}

/**
 * A custom benchmark loader
 * @param {File} file
 * @return {Benchmark.Suite}
 */
function customLoader (file) {
    let description = require(resolve(process.cwd(), file.path));
    let suite;
    if (description && description.title && description.method) {
        suite = new Benchmark.Suite(description.title);
        suite.add(description.title, description.method, {maxTime: 0.1});
    }
    return suite;
}

test('single benchmark', {reporters: reporters.json()}, jsonAssert, '../data/benchmark-single.js');
test('benchmark suite', {reporters: reporters.json()}, jsonAssert, '../data/benchmark-suite.js');
test('grunt-benchmark - single function', {options: {maxTime: 0.1}, reporters: reporters.json()},
    jsonAssert, '../data/grunt-benchmark-single-function.js');
test('grunt-benchmark - single test with options', {reporters: reporters.json()},
    jsonAssert, '../data/grunt-benchmark-single-test-with-options.js');
test('grunt-benchmark - test suite with array of functions', {reporters: reporters.json()},
    jsonAssert, '../data/grunt-benchmark-test-suite-with-array-of-functions.js');
test('grunt-benchmark - test suite with array of objects', {reporters: reporters.json()},
    jsonAssert, '../data/grunt-benchmark-test-suite-with-array-of-objects.js');
test('grunt-benchmark - test suite with object', {reporters: reporters.json()},
    jsonAssert, '../data/grunt-benchmark-test-suite-with-object.js');
test('report - etalon', {reporters: [reporters.etalon('RegExp#test'), reporters.json()]},
    jsonAssert, '../data/benchmark-suite.js');
test('report - etalon errors', {failOnError: false, reporters: [reporters.etalon('RegExp#test'), reporters.json()]},
    jsonAssert, '../data/grunt-benchmark-test-suite-with-errors.js');
test('report - fastest', {reporters: [reporters.fastest(), reporters.json()]},
    jsonAssert, '../data/benchmark-suite.js');
test('report - fastest no passed', {failOnError: false, reporters: [reporters.fastest(), reporters.json()]},
    jsonAssert, '../data/benchmark-single-errors.js');
test('report - fastest only passed', {failOnError: false, reporters: [reporters.fastest(), reporters.json()]},
    jsonAssert, '../data/benchmark-single.js');
test('report - csv', {reporters: reporters.csv()}, csvAssert, '../data/benchmark-suite.js');
test('custom loader', {loaders: customLoader, reporters: reporters.json()},
    jsonAssert, '../data/custom.js');
testError('loading error', {reporters: reporters.json()}, '../data/custom.js');
testError('running error', {reporters: reporters.json()}, '../data/grunt-benchmark-test-suite-with-errors.js');
