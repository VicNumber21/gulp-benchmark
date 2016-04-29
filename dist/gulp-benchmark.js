/*!
 * The MIT License (MIT)
 *
 * gulp-benchmark - v2.0.0 - Thu Apr 28 2016 21:08:32 GMT-0400 (EDT)
 * git://github.com/VicNumber21/gulp-benchmark.git
 * Original work Copyright (c) 2015-2016 Victor Portnov
 * Modified work Copyright (c) 2016 Matt Traynham <skitch920@gmail.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	__webpack_require__(1);
	
	var _benchmark = __webpack_require__(2);
	
	var _benchmark2 = _interopRequireDefault(_benchmark);
	
	var _through = __webpack_require__(3);
	
	var _through2 = _interopRequireDefault(_through);
	
	var _compact = __webpack_require__(4);
	
	var _compact2 = _interopRequireDefault(_compact);
	
	var _defaults = __webpack_require__(5);
	
	var _defaults2 = _interopRequireDefault(_defaults);
	
	var _find = __webpack_require__(6);
	
	var _find2 = _interopRequireDefault(_find);
	
	var _gulpUtil = __webpack_require__(7);
	
	var _loaders = __webpack_require__(8);
	
	var _loggers = __webpack_require__(16);
	
	var _csv = __webpack_require__(22);
	
	var _csv2 = _interopRequireDefault(_csv);
	
	var _etalon = __webpack_require__(23);
	
	var _etalon2 = _interopRequireDefault(_etalon);
	
	var _fastest = __webpack_require__(25);
	
	var _fastest2 = _interopRequireDefault(_fastest);
	
	var _json = __webpack_require__(26);
	
	var _json2 = _interopRequireDefault(_json);
	
	var _util = __webpack_require__(17);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var pluginName = 'gulp-benchmark';
	
	/**
	 * The gulp-benchmark task
	 * @param {Options} options
	 * @returns {*}
	 */
	function gulpBenchmark() {
	    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	
	    var defaultOptions = {
	        options: {},
	        loaders: [],
	        logger: _loggers.base,
	        failOnError: true,
	        reporters: [(0, _etalon2.default)()]
	    };
	    /**
	     * @type Context
	     */
	    var context = (0, _defaults2.default)(options, defaultOptions);
	    context.loaders = (0, _util.toArray)(context.loaders).concat(_loaders.base);
	    context.logger = (0, _defaults2.default)(context.logger, _loggers.silent);
	    context.reporters = (0, _util.toArray)(context.reporters);
	    context.outputs = [];
	    return _through2.default.obj(function (file, encoding, callback) {
	        var stream = this,
	            run = new Promise(function (resolve, reject) {
	            var suite = (0, _find2.default)(context.loaders.map(function (loader) {
	                try {
	                    return loader(file, context);
	                } catch (err) {// Fail silently
	                }
	                return null;
	            }), function (s) {
	                return s instanceof _benchmark2.default.Suite;
	            });
	            return !suite ? reject(new Error('Benchmark failed on loading')) : resolve(suite);
	        });
	        run.then(function (suite) {
	            return new Promise(function (resolve, reject) {
	                var logger = context.logger;
	                logger.onStart(suite, file.path);
	                suite.on('cycle', function (event) {
	                    return logger.onCycle(event);
	                });
	                suite.on('complete', function () {
	                    var _this = this;
	
	                    var hasError = (0, _compact2.default)(this.map(function (benchmark) {
	                        return benchmark.error;
	                    })).length > 0;
	                    if (hasError) {
	                        logger.onError(this, file.path);
	                        if (context.failOnError) {
	                            return reject(new Error('Benchmark failed to run'));
	                        }
	                    }
	                    logger.onComplete(this, file.path);
	                    context.reporters.forEach(function (reporter, index) {
	                        return reporter(_this, file.path, context.outputs[index] = context.outputs[index] || { storage: null });
	                    });
	                    return resolve();
	                });
	                suite.run();
	            });
	        }).then(callback, function (error) {
	            var pluginError = new _gulpUtil.PluginError(pluginName, error, { showStack: true });
	            (0, _gulpUtil.log)(pluginError.toString());
	            stream.emit('error', pluginError);
	            callback();
	        });
	    }, function (callback) {
	        var _this2 = this;
	
	        try {
	            context.outputs.forEach(function (storageRef) {
	                var storage = storageRef.storage;
	                if (storage) {
	                    _this2.push(new _gulpUtil.File({
	                        cwd: process.cwd(),
	                        path: storage.path,
	                        contents: new Buffer(storage.contents())
	                    }));
	                }
	            });
	        } catch (err) {
	            this.emit('error', new _gulpUtil.PluginError(pluginName, err, { showStack: true }));
	        }
	        callback();
	    });
	}
	
	/**
	 * The available reporters
	 * @type {{csv: Reporter, etalon: Reporter, fastest: Reporter, json: Reporter}}
	 */
	gulpBenchmark.reporters = {
	    csv: _csv2.default,
	    etalon: _etalon2.default,
	    fastest: _fastest2.default,
	    json: _json2.default
	};
	
	/**
	 * The available loggers
	 * @type {{default: Logger, silent: Logger}}
	 */
	gulpBenchmark.loggers = {
	    default: _loggers.base,
	    silent: _loggers.silent
	};
	
	exports.default = gulpBenchmark;
	
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

	module.exports = exports['default'];

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = require("babel-polyfill");

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = require("benchmark");

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = require("through2");

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = require("lodash/compact");

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = require("lodash/defaults");

/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = require("lodash/find");

/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = require("gulp-util");

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.base = base;
	
	var _benchmark = __webpack_require__(2);
	
	var _benchmark2 = _interopRequireDefault(_benchmark);
	
	var _defaults = __webpack_require__(5);
	
	var _defaults2 = _interopRequireDefault(_defaults);
	
	var _clone = __webpack_require__(9);
	
	var _clone2 = _interopRequireDefault(_clone);
	
	var _isFunction = __webpack_require__(10);
	
	var _isFunction2 = _interopRequireDefault(_isFunction);
	
	var _isNumber = __webpack_require__(11);
	
	var _isNumber2 = _interopRequireDefault(_isNumber);
	
	var _isObject = __webpack_require__(12);
	
	var _isObject2 = _interopRequireDefault(_isObject);
	
	var _map = __webpack_require__(13);
	
	var _map2 = _interopRequireDefault(_map);
	
	var _path = __webpack_require__(14);
	
	var _module = __webpack_require__(15);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/**
	 * @function
	 * @param {File} file
	 * @param {Context} context
	 * @returns {Benchmark.Suite}
	 */
	function base(file, context) {
	    var description = (0, _module._load)((0, _path.resolve)(process.cwd(), file.path));
	    var testOptions = context.options,
	        suiteName = void 0,
	        tests = void 0;
	
	    if (description instanceof _benchmark2.default.Suite) {
	        return description;
	    } else if (description instanceof _benchmark2.default) {
	        suiteName = description.name || (0, _path.basename)(file.path, '.js');
	        var test = description.options;
	        test.name = suiteName;
	        test.fn = description.fn;
	        tests = [test];
	    } else if ((0, _isFunction2.default)(description.fn)) {
	        suiteName = description.name || (0, _path.basename)(file.path, '.js');
	        description.name = description.name || suiteName;
	        tests = [description];
	    } else if ((0, _isObject2.default)(description.tests)) {
	        suiteName = description.name || (0, _path.basename)(file.path, '.js');
	        testOptions = (0, _clone2.default)(description);
	        delete testOptions.name;
	        delete testOptions.fn;
	        delete testOptions.tests;
	        tests = (0, _map2.default)(description.tests, function (test, index) {
	            var builtTest = (0, _isFunction2.default)(test) ? { fn: test } : test;
	            builtTest.name = builtTest.name || ((0, _isNumber2.default)(index) ? '<Test #' + (index + 1) + '>' : index);
	            return builtTest;
	        });
	    } else if ((0, _isFunction2.default)(description)) {
	        suiteName = (0, _path.basename)(file.path, '.js');
	        tests = [{ name: suiteName, fn: description }];
	    } else {
	        return null;
	    }
	    var suite = new _benchmark2.default.Suite(suiteName);
	    tests.forEach(function (test) {
	        return suite.add((0, _defaults2.default)(test, testOptions));
	    });
	    return suite;
	}

/***/ },
/* 9 */
/***/ function(module, exports) {

	module.exports = require("lodash/clone");

/***/ },
/* 10 */
/***/ function(module, exports) {

	module.exports = require("lodash/isFunction");

/***/ },
/* 11 */
/***/ function(module, exports) {

	module.exports = require("lodash/isNumber");

/***/ },
/* 12 */
/***/ function(module, exports) {

	module.exports = require("lodash/isObject");

/***/ },
/* 13 */
/***/ function(module, exports) {

	module.exports = require("lodash/map");

/***/ },
/* 14 */
/***/ function(module, exports) {

	module.exports = require("path");

/***/ },
/* 15 */
/***/ function(module, exports) {

	module.exports = require("module");

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.silent = exports.base = undefined;
	
	var _gulpUtil = __webpack_require__(7);
	
	var _util = __webpack_require__(17);
	
	/**
	 * The base logger
	 * @type {Logger}
	 */
	var base = exports.base = {
	    onStart: function onStart(suite, path) {
	        return (0, _gulpUtil.log)((0, _util.indent)(1) + 'Running ' + (0, _util.caption)(suite, path) + ' ...');
	    },
	    onCycle: function onCycle(event) {
	        var target = event.target;
	        (0, _gulpUtil.log)('' + (0, _util.indent)(2) + target + (target.error ? _gulpUtil.colors.red(' error') : ''));
	    },
	    onError: function onError(suite, path) {
	        (0, _gulpUtil.log)('' + (0, _util.indent)(1) + _gulpUtil.colors.red('Errors') + ' in ' + (0, _util.caption)(suite, path) + ':');
	        suite.forEach(function (test) {
	            if (test.error) {
	                (0, _gulpUtil.log)('' + (0, _util.indent)(2) + test.name + ': ' + test.error);
	            }
	        });
	    },
	    onComplete: undefined
	};
	
	/**
	 * A silent logger
	 * @type {Logger}
	 */
	var silent = exports.silent = {
	    onStart: function onStart() {
	        return null;
	    },
	    onCycle: function onCycle() {
	        return null;
	    },
	    onError: function onError() {
	        return null;
	    },
	    onComplete: function onComplete() {
	        return null;
	    }
	};

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.caption = caption;
	exports.indent = indent;
	exports.split = split;
	exports.sortFastestFirst = sortFastestFirst;
	exports.toArray = toArray;
	
	var _tildify = __webpack_require__(18);
	
	var _tildify2 = _interopRequireDefault(_tildify);
	
	var _defaults = __webpack_require__(5);
	
	var _defaults2 = _interopRequireDefault(_defaults);
	
	var _groupBy = __webpack_require__(19);
	
	var _groupBy2 = _interopRequireDefault(_groupBy);
	
	var _isArray = __webpack_require__(20);
	
	var _isArray2 = _interopRequireDefault(_isArray);
	
	var _isUndefined = __webpack_require__(21);
	
	var _isUndefined2 = _interopRequireDefault(_isUndefined);
	
	var _gulpUtil = __webpack_require__(7);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/**
	 * Return a caption string for a benchmark suite
	 * @param {Benchmark.Suite} suite
	 * @param {String} path
	 * @returns {String}
	 */
	function caption(suite, path) {
	    var name = suite.name,
	        tildePath = _gulpUtil.colors.magenta((0, _tildify2.default)(path));
	    return name ? '\'' + _gulpUtil.colors.cyan(name) + '\' from ' + tildePath : tildePath;
	}
	
	/**
	 * Return an indented string based on a particular numeric level
	 * @param {Number} level
	 * @returns {String}
	 */
	function indent(level) {
	    return new Array(2 * level + 1).join(' ');
	}
	
	/**
	 * Group a suite benchmarks into passed/failed arrays
	 * @param {Array<Benchmark>} total
	 * @returns {{passed: Array<Benchmark>, failed: Array<Benchmark>}}
	 */
	function split(total) {
	    return (0, _defaults2.default)((0, _groupBy2.default)(total, function (test) {
	        return (0, _isUndefined2.default)(test.error) ? 'passed' : 'failed';
	    }), { passed: [], failed: [] });
	}
	
	/**
	 * Sort the benchmarks by fastest time
	 * @param {Array<Benchmark>} passed
	 * @return {Array<Benchmark>}
	 */
	function sortFastestFirst(passed) {
	    passed.sort(function (a, b) {
	        return b.hz - a.hz;
	    });
	    return passed;
	}
	
	/**
	 * Convert an object o list if it is not one already.
	 * @param {*} x
	 * @returns {*[]}
	 */
	function toArray(x) {
	    return (0, _isArray2.default)(x) ? x : [x];
	}

/***/ },
/* 18 */
/***/ function(module, exports) {

	module.exports = require("tildify");

/***/ },
/* 19 */
/***/ function(module, exports) {

	module.exports = require("lodash/groupBy");

/***/ },
/* 20 */
/***/ function(module, exports) {

	module.exports = require("lodash/isArray");

/***/ },
/* 21 */
/***/ function(module, exports) {

	module.exports = require("lodash/isUndefined");

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	exports.default = function () {
	    var output = arguments.length <= 0 || arguments[0] === undefined ? './benchmark-results.csv' : arguments[0];
	
	    var records = ['name,date,error,count,cycles,hz'];
	    return function (suite, path, storageRef) {
	        if (!storageRef.storage) {
	            storageRef.storage = { // eslint-disable-line no-param-reassign
	                path: output,
	                contents: function contents() {
	                    return records.join('\n');
	                }
	            };
	        }
	        records = records.concat((0, _compact2.default)(suite).map(function (test) {
	            return '"' + test.name + '",' + test.times.timestamp + ',"' + test.error + '",' + test.count + ',' + test.cycles + ',' + test.hz;
	        }));
	    };
	};
	
	var _compact = __webpack_require__(4);
	
	var _compact2 = _interopRequireDefault(_compact);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	module.exports = exports['default'];

	/**
	 * A CSV Reporter
	 * @param {String} [output]
	 * @returns {ReporterHandler}
	 */

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	exports.default = function (etalonName) {
	    return function (suite, path) {
	        var s = (0, _util.split)((0, _compact2.default)(suite)),
	            passed = (0, _util.sortFastestFirst)(s.passed),
	            failed = s.failed,
	            etalonIndex = (0, _isString2.default)(etalonName) ? passed.map(function (benchmark) {
	            return benchmark.name;
	        }).indexOf(etalonName) : 0,
	            etalon = etalonIndex < 0 ? passed[0] : passed[etalonIndex],
	            etalonHz = etalon ? etalon.hz : 0;
	        (0, _gulpUtil.log)('' + (0, _util.indent)(1) + (0, _util.caption)(suite, path) + ' (' + _gulpUtil.colors.green('passed') + ': ' + passed.length + ', ' + _gulpUtil.colors.red('failed') + ': ' + failed.length + ')');
	        if (passed.length > 0) {
	            (0, _gulpUtil.log)('' + (0, _util.indent)(2) + _gulpUtil.colors.green('Passed') + ':');
	            passed.forEach(function (test, index) {
	                var output = '' + (0, _util.indent)(3) + test.name;
	                if (index < etalonIndex) {
	                    output += ' at ' + (test.hz / etalonHz).toFixed(2) + 'x faster';
	                } else if (index > etalonIndex) {
	                    output += ' at ' + (etalonHz / test.hz).toFixed(2) + 'x slower';
	                } else {
	                    output += ' is etalon';
	                    output = _gulpUtil.colors.yellow(output);
	                }
	                (0, _gulpUtil.log)(output);
	            });
	        }
	        if (failed.length > 0) {
	            (0, _gulpUtil.log)('' + (0, _util.indent)(2) + _gulpUtil.colors.red('Failed') + ':');
	            failed.forEach(function (test) {
	                return (0, _gulpUtil.log)('' + (0, _util.indent)(3) + test.name + ': ' + test.error);
	            });
	        }
	    };
	};
	
	var _compact = __webpack_require__(4);
	
	var _compact2 = _interopRequireDefault(_compact);
	
	var _isString = __webpack_require__(24);
	
	var _isString2 = _interopRequireDefault(_isString);
	
	var _gulpUtil = __webpack_require__(7);
	
	var _util = __webpack_require__(17);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	module.exports = exports['default'];

	/**
	 * An etalon Reporter
	 * @param {String} etalonName
	 * @returns {ReporterHandler}
	 */

/***/ },
/* 24 */
/***/ function(module, exports) {

	module.exports = require("lodash/isString");

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	exports.default = function () {
	    return function (suite) {
	        var passed = (0, _util.sortFastestFirst)((0, _util.split)((0, _compact2.default)(suite)).passed);
	        if (passed.length === 0) {
	            (0, _gulpUtil.log)((0, _util.indent)(1) + 'No passed tests');
	        } else if (passed.length === 1) {
	            (0, _gulpUtil.log)((0, _util.indent)(1) + 'Only test passed: ' + passed[0]);
	        } else {
	            var first = passed[0],
	                second = passed[1],
	                times = first.hz / second.hz,
	                timesStr = _benchmark2.default.formatNumber(Number(times.toFixed(times < 2 ? 2 : 1)));
	            (0, _gulpUtil.log)((0, _util.indent)(1) + 'Fastest test is \'' + first.name + '\' at ' + timesStr + 'x faster than \'' + second.name + '\'');
	        }
	    };
	};
	
	var _benchmark = __webpack_require__(2);
	
	var _benchmark2 = _interopRequireDefault(_benchmark);
	
	var _compact = __webpack_require__(4);
	
	var _compact2 = _interopRequireDefault(_compact);
	
	var _gulpUtil = __webpack_require__(7);
	
	var _util = __webpack_require__(17);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	module.exports = exports['default'];

	/**
	 * An etalon Reporter
	 * @returns {ReporterHandler}
	 */

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	exports.default = function () {
	    var output = arguments.length <= 0 || arguments[0] === undefined ? './benchmark-results.json' : arguments[0];
	
	    var records = [];
	    return function (suite, path, storageRef) {
	        if (!storageRef.storage) {
	            storageRef.storage = { // eslint-disable-line no-param-reassign
	                path: output,
	                contents: function contents() {
	                    return JSON.stringify(records);
	                }
	            };
	        }
	        records.push({
	            name: suite.name,
	            results: (0, _compact2.default)(suite).map(function (test) {
	                return {
	                    name: test.name,
	                    times: test.times,
	                    stats: test.stats,
	                    error: test.error,
	                    count: test.count,
	                    cycles: test.cycles,
	                    hz: test.hz
	                };
	            })
	        });
	    };
	};
	
	var _compact = __webpack_require__(4);
	
	var _compact2 = _interopRequireDefault(_compact);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	module.exports = exports['default'];

	/**
	 * A json Reporter
	 * @param {String} [output]
	 * @returns {ReporterHandler}
	 */

/***/ }
/******/ ]);
//# sourceMappingURL=gulp-benchmark.js.map