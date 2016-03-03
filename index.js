import Q from 'q';
import through from 'through2';
import compact from 'lodash/compact';
import defaults from 'lodash/defaults';
import forEach from 'lodash/forEach';
import {log, File, PluginError} from 'gulp-util';

import {base} from './lib/loaders';
import {base as baseLogger, silent} from './lib/loggers';
import csvReporter from './lib/reporters/csv';
import etalonReporter from './lib/reporters/etalon';
import fastestReporter from './lib/reporters/fastest';
import jsonReporter from './lib/reporters/json';
import {isBenchmarkSuite, toArray} from './lib/util';

const pluginName = 'gulp-benchmark';

export const reporters = {
    csv: csvReporter,
    etalon: etalonReporter,
    fastest: fastestReporter,
    json: jsonReporter
};

export const loggers = {
    base: baseLogger,
    silent: silent
};

function load (file, context) {
    let loaders = context.loaders,
        suites = loaders.map(loader => loader(file, context))
            .filter(suite => isBenchmarkSuite(suite));
    if (!suites.length) {
        throw new Error('Benchmark failed on loading');
    }
    let suite = suites[0];
    suite.path = file.path;
    return suite;
}

function run (suite, context) {
    let deferred = Q.defer(),
        logger = context.logger;
    logger.onStart(suite);
    suite.on('cycle', (event) => logger.onCycle(event));
    suite.on('complete', () => {
        let error = compact(this.error).length > 0;
        if (error) {
            logger.onError(this);
        } else {
            logger.onComplete(this);
        }
        if (error && context.failOnError) {
            deferred.reject(new Error('Benchmark test(s) failure'));
        } else {
            deferred.resolve(this);
        }
    });
    suite.run();
    return deferred.promise();
}

function prepare (suite, context) {
    forEach(context.reporters, (reporter, index) =>
        reporter(suite, context.outputs[index] = context.outputs[index] || {storage: null}));
    return Q.resolve();
}

function flush (stream, context) {
    forEach(context.outputs, (storageRef) => {
        let storage = storageRef.storage;
        if (storage) {
            stream.push(new File({
                cwd: process.cwd(),
                path: storage.path,
                contents: new Buffer(storage.contents())
            }));
        }
    });
    return Q.resolve();
}

export default function (options = {}) {
    let defaultOptions = {
        options: {},
        loaders: [],
        logger: loggers.base,
        failOnError: true,
        reporters: [reporters.etalon()]
    };
    let context = defaults(options, defaultOptions);
    context.loaders = toArray(context.loaders).concat(base);
    context.logger = defaults(context.logger, loggers.silent);
    context.reporters = toArray(context.reporters);
    context.outputs = [];
    return through.obj((file, enc, cb) => {
        let stream = this;
        run(load(file, context), context)
            .then(suite => prepare(suite, context))
            .fail(error => {
                let pluginError = new PluginError(pluginName, error, {showStack: true});
                log(pluginError.toString());
                stream.emit('error', pluginError);
            })
            .finally(cb);
    }, (cb) => {
        let stream = this;
        try {
            flush(stream, context);
        } catch (err) {
            stream.emit('error', new PluginError(pluginName, err, {showStack: true}));
        }
        cb();
    });
}
