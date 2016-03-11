import Benchmark from 'benchmark';
import {expect} from 'chai';
import {File} from 'gulp-util';
import {basename, resolve} from 'path';
import gulpBenchmark from './../../index';

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
        const stream = gulpBenchmark(benchOptions);
        stream.on('data', (output) => {
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
        const stream = gulpBenchmark(benchOptions);
        stream.on('error', () => {
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
    expect(output).to.be.instanceof(File);
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
    const description = require(resolve(process.cwd(), file.path));
    let suite;
    if (description && description.title && description.method) {
        suite = new Benchmark.Suite(description.title);
        suite.add(description.title, description.method, {maxTime: 0.1});
    }
    return suite;
}

test('single benchmark', {reporters: gulpBenchmark.reporters.json()}, jsonAssert, '../data/benchmark-single.js');
test('benchmark suite', {reporters: gulpBenchmark.reporters.json()}, jsonAssert, '../data/benchmark-suite.js');
test('grunt-benchmark - single function', {options: {maxTime: 0.1}, reporters: gulpBenchmark.reporters.json()},
    jsonAssert, '../data/grunt-benchmark-single-function.js');
test('grunt-benchmark - single test with options', {reporters: gulpBenchmark.reporters.json()},
    jsonAssert, '../data/grunt-benchmark-single-test-with-options.js');
test('grunt-benchmark - test suite with array of functions', {reporters: gulpBenchmark.reporters.json()},
    jsonAssert, '../data/grunt-benchmark-test-suite-with-array-of-functions.js');
test('grunt-benchmark - test suite with array of objects', {reporters: gulpBenchmark.reporters.json()},
    jsonAssert, '../data/grunt-benchmark-test-suite-with-array-of-objects.js');
test('grunt-benchmark - test suite with object', {reporters: gulpBenchmark.reporters.json()},
    jsonAssert, '../data/grunt-benchmark-test-suite-with-object.js');
test('report - etalon', {reporters: [gulpBenchmark.reporters.etalon('RegExp#test'), gulpBenchmark.reporters.json()]},
    jsonAssert, '../data/benchmark-suite.js');
test('report - etalon errors',
    {failOnError: false, reporters: [gulpBenchmark.reporters.etalon('RegExp#test'), gulpBenchmark.reporters.json()]},
    jsonAssert, '../data/grunt-benchmark-test-suite-with-errors.js');
test('report - fastest', {reporters: [gulpBenchmark.reporters.fastest(), gulpBenchmark.reporters.json()]},
    jsonAssert, '../data/benchmark-suite.js');
test('report - fastest no passed', {failOnError: false, reporters: [gulpBenchmark.reporters.fastest(), gulpBenchmark.reporters.json()]},
    jsonAssert, '../data/benchmark-single-errors.js');
test('report - fastest only passed', {failOnError: false, reporters: [gulpBenchmark.reporters.fastest(), gulpBenchmark.reporters.json()]},
    jsonAssert, '../data/benchmark-single.js');
test('report - csv', {reporters: gulpBenchmark.reporters.csv()}, csvAssert, '../data/benchmark-suite.js');
test('custom loader', {loaders: customLoader, reporters: gulpBenchmark.reporters.json()},
    jsonAssert, '../data/custom.js');
testError('loading error', {reporters: gulpBenchmark.reporters.json()}, '../data/custom.js');
testError('running error', {reporters: gulpBenchmark.reporters.json()}, '../data/grunt-benchmark-test-suite-with-errors.js');
