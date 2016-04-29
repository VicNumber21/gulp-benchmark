import 'babel-polyfill';
import Benchmark from 'benchmark';
import through from 'through2';
import compact from 'lodash/compact';
import defaults from 'lodash/defaults';
import find from 'lodash/find';
import {log, File, PluginError} from 'gulp-util';

import {base as baseLoader} from './lib/loaders';
import {base as baseLogger, silent} from './lib/loggers';
import csv from './lib/reporters/csv';
import etalon from './lib/reporters/etalon';
import fastest from './lib/reporters/fastest';
import json from './lib/reporters/json';
import {toArray} from './lib/util';

const pluginName = 'gulp-benchmark';

/**
 * The gulp-benchmark task
 * @param {Options} options
 * @returns {*}
 */
function gulpBenchmark (options = {}) {
    const defaultOptions = {
        options: {},
        loaders: [],
        logger: baseLogger,
        failOnError: true,
        reporters: [etalon()]
    };
    /**
     * @type Context
     */
    const context = defaults(options, defaultOptions);
    context.loaders = toArray(context.loaders).concat(baseLoader);
    context.logger = defaults(context.logger, silent);
    context.reporters = toArray(context.reporters);
    context.outputs = [];
    return through.obj(function (file, encoding, callback) {
        const stream = this,
            run = new Promise((resolve, reject) => {
                const suite = find(context.loaders.map(loader => {
                    try {
                        return loader(file, context);
                    } catch (err) { // Fail silently
                    }
                    return null;
                }), s => s instanceof Benchmark.Suite);
                return !suite ?
                    reject(new Error('Benchmark failed on loading')) :
                    resolve(suite);
            });
        run.then(suite => new Promise((resolve, reject) => {
            const logger = context.logger;
            logger.onStart(suite, file.path);
            suite.on('cycle', event => logger.onCycle(event));
            suite.on('complete', function () {
                const hasError = compact(this.map(benchmark => benchmark.error)).length > 0;
                if (hasError) {
                    logger.onError(this, file.path);
                    if (context.failOnError) {
                        return reject(new Error('Benchmark failed to run'));
                    }
                }
                logger.onComplete(this, file.path);
                context.reporters.forEach((reporter, index) =>
                    reporter(this, file.path, context.outputs[index] = context.outputs[index] || {storage: null}));
                return resolve();
            });
            suite.run();
        })).then(callback, error => {
            const pluginError = new PluginError(pluginName, error, {showStack: true});
            log(pluginError.toString());
            stream.emit('error', pluginError);
            callback();
        });
    }, function (callback) {
        try {
            context.outputs.forEach(storageRef => {
                const storage = storageRef.storage;
                if (storage) {
                    this.push(new File({
                        cwd: process.cwd(),
                        path: storage.path,
                        contents: new Buffer(storage.contents())
                    }));
                }
            });
        } catch (err) {
            this.emit('error', new PluginError(pluginName, err, {showStack: true}));
        }
        callback();
    });
}


/**
 * The available reporters
 * @type {{csv: Reporter, etalon: Reporter, fastest: Reporter, json: Reporter}}
 */
gulpBenchmark.reporters = {
    csv,
    etalon,
    fastest,
    json
};

/**
 * The available loggers
 * @type {{default: Logger, silent: Logger}}
 */
gulpBenchmark.loggers = {
    default: baseLogger,
    silent
};

export default gulpBenchmark;

/**
 * A loader callback
 * @callback Loader
 * @param {File} file
 * @param {context} context
 * @returns {Benchmark.Suite}
 */

/**
 * An object that handles all the basic phases of a Benchmark.
 * @typedef {{
 *     onStart: function(Benchmark.Suite, String),
 *     onCycle: function(Benchmark.Event),
 *     onError: function(Benchmark.Suite, String),
 *     onComplete: function(Benchmark.Suite, String)
 * }} Logger
 */

/**
 * @typedef {{path: String, content: (function(): String)}} Storage
 */

/**
 * @typedef {{storage: Storage}} StorageRef
 */

/**
 * @callback ReporterHandler
 * @param {Benchmark.Suite} suite
 * @param {String} path
 * @param {StorageRef} [storageRef]
 */

/**
 * @callback Reporter
 * @param {*} [options]
 * @returns {ReporterHandler}
 */

/**
 * @typedef {{
 *      options: {},
 *      loaders: Array<Loader>|Loader,
 *      logger: Logger,
 *      failOnError: Boolean,
 *      reporters: Array<Reporter>|Reporter
 * }} Options
 */

/**
 * @typedef {{
 *      options: {},
 *      loaders: Array<Loader>,
 *      logger: Logger,
 *      failOnError: Boolean,
 *      reporters: Array<Reporter>,
 *      outputs: Array<StorageRef>
 * }} Context
 */
