import bench from './../../index';
import {expect} from 'chai';
import {File} from 'gulp-util';
import Benchmark from 'benchmark';
import path from 'path';

function test (name, benchOptions, assert, input) {
    it(name, function (cb) {
        this.timeout(20000);
        let stream = bench(benchOptions);
        stream.on('data', function (output) {
            try {
                assert(output);
                cb();
            } catch (err) {
                cb(err);
            }
        });
        stream.write(new File({path: input}));
        stream.end();
    });
}

function testError (name, benchOptions, input) {
    it(name, function (cb) {
        this.timeout(20000);
        let stream = bench(benchOptions);
        stream.on('error', function () {
            cb();
        });
        stream.write(new File({path: input}));
        stream.end();
    });
}

function jsonAssert (output) {
    expect(path.basename(output.path)).be.eql('benchmark-results.json');
}

function csvAssert (output) {
    expect(output).to.be.instanceof(File);
    expect(output.path).to.be.equal('./benchmark-results.csv');
}

function customLoader (file) {
    let path = require('path');
    let description = require(path.resolve(process.cwd(), file.path));
    let suite;
    if (description && description.title && description.method) {
        suite = new Benchmark.Suite(description.title);
        suite.add(description.title, description.method, {maxTime: 0.1});
    }
    return suite;
}

test('single benchmark', {reporters: bench.reporters.json()}, jsonAssert, '../data/benchmark-single.js');
test('benchmark suite', {reporters: bench.reporters.json()}, jsonAssert, '../data/benchmark-suite.js');
test('grunt-benchmark - single function', {options: {maxTime: 0.1}, reporters: bench.reporters.json()},
    jsonAssert, '../data/grunt-benchmark-single-function.js');
test('grunt-benchmark - single test with options', {reporters: bench.reporters.json()},
    jsonAssert, '../data/grunt-benchmark-single-test-with-options.js');
test('grunt-benchmark - test suite with array of functions', {reporters: bench.reporters.json()},
    jsonAssert, '../data/grunt-benchmark-test-suite-with-array-of-functions.js');
test('grunt-benchmark - test suite with array of objects', {reporters: bench.reporters.json()},
    jsonAssert, '../data/grunt-benchmark-test-suite-with-array-of-objects.js');
test('grunt-benchmark - test suite with object', {reporters: bench.reporters.json()},
    jsonAssert, '../data/grunt-benchmark-test-suite-with-object.js');
test('report - etalon', {reporters: [bench.reporters.etalon('RegExp#test'), bench.reporters.json()]},
    jsonAssert, '../data/benchmark-suite.js');
test('report - etalon errors', {failOnError: false, reporters: [bench.reporters.etalon('RegExp#test'), bench.reporters.json()]},
    jsonAssert, '../data/grunt-benchmark-test-suite-with-errors.js');
test('report - fastest', {reporters: [bench.reporters.fastest(), bench.reporters.json()]},
    jsonAssert, '../data/benchmark-suite.js');
test('report - fastest no passed', {failOnError: false, reporters: [bench.reporters.fastest(), bench.reporters.json()]},
    jsonAssert, '../data/benchmark-single-errors.js');
test('report - fastest only passed', {failOnError: false, reporters: [bench.reporters.fastest(), bench.reporters.json()]},
    jsonAssert, '../data/benchmark-single.js');
test('report - csv', {reporters: bench.reporters.csv()}, csvAssert, '../data/benchmark-suite.js');
test('custom loader', {loaders: customLoader, reporters: bench.reporters.json()},
    jsonAssert, '../data/custom.js');
testError('loading error', {reporters: bench.reporters.json()}, '../data/custom.js');
testError('running error', {reporters: bench.reporters.json()}, '../data/grunt-benchmark-test-suite-with-errors.js');
