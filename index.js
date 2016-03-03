import Benchmark from 'benchmark';
import through from 'through2';
import compact from 'lodash/compact';
import defaults from 'lodash/defaults';
import {log, File, PluginError} from 'gulp-util';

import {base as baseLoader} from './lib/loaders';
import {base as baseLogger, silent} from './lib/loggers';
import csvReporter from './lib/reporters/csv';
import etalonReporter from './lib/reporters/etalon';
import fastestReporter from './lib/reporters/fastest';
import jsonReporter from './lib/reporters/json';
import {toArray} from './lib/util';

const pluginName = 'gulp-benchmark';

/**
 * The available reporters
 * @type {{csv: Reporter, etalon: Reporter, fastest: Reporter, json: Reporter}}
 */
export const reporters = {
    csv: csvReporter,
    etalon: etalonReporter,
    fastest: fastestReporter,
    json: jsonReporter
};

/**
 * The available loggers
 * @type {{base: Logger, silent: Logger}}
 */
export const loggers = {
    base: baseLogger,
    silent: silent
};

/**
 * The gulp-benchmark task
 * @param {Options} options
 * @returns {*}
 */
export default function (options = {}) {
    let defaultOptions = {
        options: {},
        loaders: [],
        logger: loggers.base,
        failOnError: true,
        reporters: [reporters.etalon()]
    };
    /**
     * @type Context
     */
    let context = defaults(options, defaultOptions);
    context.loaders = toArray(context.loaders).concat(baseLoader);
    context.logger = defaults(context.logger, loggers.silent);
    context.reporters = toArray(context.reporters);
    context.outputs = [];
    return through.obj(function (file, encoding, callback) {
        let stream = this;
        function error (message) {
            if (context.failOnError) {
                let pluginError = new PluginError(pluginName, new Error(message), {showStack: true});
                log(pluginError.toString());
                stream.emit('error', pluginError);
            }
        }
        let suites = context.loaders
                .map(loader => loader(file, context))
                .filter(suite => suite instanceof Benchmark.Suite);
        if (!suites.length) {
            error('Benchmark failed on loading');
        }
        let suite = suites[0],
            logger = context.logger;
        logger.onStart(suite, file.path);
        suite.on('cycle', event => logger.onCycle(event));
        suite.on('complete', function () {
            let hasError = compact(this.map(benchmark => benchmark.error)).length > 0;
            if (hasError) {
                logger.onError(this, file.path);
                error('Benchmark failed on loading');
            } else {
                logger.onComplete(this, file.path);
                context.reporters.forEach((reporter, index) =>
                    reporter(this, file.path, context.outputs[index] = context.outputs[index] || {storage: null}));
            }
            callback();
        });
        suite.run();
    }, function (callback) {
        try {
            context.outputs.forEach(storageRef => {
                let storage = storageRef.storage;
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
 *      outputs: Array<Storage>
 * }} Context
 */
