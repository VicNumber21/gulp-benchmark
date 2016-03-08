/*!
 *  gulp-benchmark - v2.0.0 - Tue Mar 08 2016 09:31:02 GMT-0500 (EST)
 *  git://github.com/mtraynham/gulp-benchmark.git
 *  Copyright 2016-2016 Matt Traynham <skitch920@gmail.com>
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
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
	exports.loggers = exports.reporters = undefined;
	
	exports.default = function () {
	    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	
	    var defaultOptions = {
	        options: {},
	        loaders: [],
	        logger: loggers.base,
	        failOnError: true,
	        reporters: [reporters.etalon()]
	    };
	    /**
	     * @type Context
	     */
	    var context = (0, _defaults2.default)(options, defaultOptions);
	    context.loaders = (0, _util.toArray)(context.loaders).concat(_loaders.base);
	    context.logger = (0, _defaults2.default)(context.logger, loggers.silent);
	    context.reporters = (0, _util.toArray)(context.reporters);
	    context.outputs = [];
	    return _through2.default.obj(function (file, encoding, callback) {
	        var stream = this;
	        function error(message) {
	            if (context.failOnError) {
	                var pluginError = new _gulpUtil.PluginError(pluginName, new Error(message), { showStack: true });
	                (0, _gulpUtil.log)(pluginError.toString());
	                stream.emit('error', pluginError);
	            }
	        }
	        var suites = context.loaders.map(function (loader) {
	            return loader(file, context);
	        }).filter(function (suite) {
	            return suite instanceof _benchmark2.default.Suite;
	        });
	        if (!suites.length) {
	            error('Benchmark failed on loading');
	        }
	        var suite = suites[0],
	            logger = context.logger;
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
	                error('Benchmark failed on loading');
	            } else {
	                logger.onComplete(this, file.path);
	                context.reporters.forEach(function (reporter, index) {
	                    return reporter(_this, file.path, context.outputs[index] = context.outputs[index] || { storage: null });
	                });
	            }
	            callback();
	        });
	        suite.run();
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
	};
	
	var _benchmark = __webpack_require__(1);
	
	var _benchmark2 = _interopRequireDefault(_benchmark);
	
	var _through = __webpack_require__(2);
	
	var _through2 = _interopRequireDefault(_through);
	
	var _compact = __webpack_require__(3);
	
	var _compact2 = _interopRequireDefault(_compact);
	
	var _defaults = __webpack_require__(4);
	
	var _defaults2 = _interopRequireDefault(_defaults);
	
	var _gulpUtil = __webpack_require__(5);
	
	var _loaders = __webpack_require__(6);
	
	var _loggers = __webpack_require__(13);
	
	var _csv = __webpack_require__(19);
	
	var _csv2 = _interopRequireDefault(_csv);
	
	var _etalon = __webpack_require__(20);
	
	var _etalon2 = _interopRequireDefault(_etalon);
	
	var _fastest = __webpack_require__(22);
	
	var _fastest2 = _interopRequireDefault(_fastest);
	
	var _json = __webpack_require__(23);
	
	var _json2 = _interopRequireDefault(_json);
	
	var _util = __webpack_require__(14);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var pluginName = 'gulp-benchmark';
	
	/**
	 * The available reporters
	 * @type {{csv: Reporter, etalon: Reporter, fastest: Reporter, json: Reporter}}
	 */
	var reporters = exports.reporters = {
	    csv: _csv2.default,
	    etalon: _etalon2.default,
	    fastest: _fastest2.default,
	    json: _json2.default
	};
	
	/**
	 * The available loggers
	 * @type {{base: Logger, silent: Logger}}
	 */
	
	
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
	var loggers = exports.loggers = {
	    base: _loggers.base,
	    silent: _loggers.silent
	};
	
	/**
	 * The gulp-benchmark task
	 * @param {Options} options
	 * @returns {*}
	 */

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = require("benchmark");

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = require("through2");

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = require("lodash/compact");

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = require("lodash/defaults");

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = require("gulp-util");

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.base = base;
	
	var _benchmark = __webpack_require__(1);
	
	var _benchmark2 = _interopRequireDefault(_benchmark);
	
	var _defaults = __webpack_require__(4);
	
	var _defaults2 = _interopRequireDefault(_defaults);
	
	var _extend = __webpack_require__(7);
	
	var _extend2 = _interopRequireDefault(_extend);
	
	var _isFunction = __webpack_require__(8);
	
	var _isFunction2 = _interopRequireDefault(_isFunction);
	
	var _isNumber = __webpack_require__(9);
	
	var _isNumber2 = _interopRequireDefault(_isNumber);
	
	var _isObject = __webpack_require__(10);
	
	var _isObject2 = _interopRequireDefault(_isObject);
	
	var _path = __webpack_require__(11);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/**
	 * @function
	 * @param {File} file
	 * @param {Context} context
	 * @returns {Benchmark.Suite}
	 */
	function base(file, context) {
	    var description = __webpack_require__(12)((0, _path.resolve)(process.cwd(), file.path)),
	        testOptions = context.options,
	        suiteOptions = {},
	        tests = void 0;
	    if (description instanceof _benchmark2.default.Suite) {
	        return description;
	    } else if (description instanceof _benchmark2.default) {
	        suiteOptions.name = (0, _path.basename)(file.path, '.js');
	        tests = [description];
	    } else if ((0, _isFunction2.default)(description)) {
	        var name = (0, _path.basename)(file.path, '.js');
	        suiteOptions.name = name;
	        tests = [{ name: name, fn: description }];
	    } else if ((0, _isFunction2.default)(description.fn)) {
	        suiteOptions.name = (0, _path.basename)(file.path, '.js');
	        var test = (0, _extend2.default)({}, description);
	        test.name = test.name || suiteOptions.name;
	        tests = [test];
	    } else if ((0, _isObject2.default)(description.tests)) {
	        suiteOptions.name = description.name;
	        testOptions = (0, _extend2.default)({}, description);
	        delete testOptions.name;
	        delete testOptions.fn;
	        delete testOptions.test;
	        tests = description.tests.map(function (test, index) {
	            test = (0, _isFunction2.default)(test) ? { fn: test } : test;
	            test.name = test.name || (0, _isNumber2.default)(index) ? '<Test #' + (index + 1) + '>' : index;
	            return test;
	        });
	    }
	    var suite = new _benchmark2.default.Suite(suiteOptions.name, suiteOptions);
	    tests.forEach(function (test) {
	        return suite.add((0, _defaults2.default)(test, testOptions));
	    });
	    return suite;
	}

/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = require("lodash/extend");

/***/ },
/* 8 */
/***/ function(module, exports) {

	module.exports = require("lodash/isFunction");

/***/ },
/* 9 */
/***/ function(module, exports) {

	module.exports = require("lodash/isNumber");

/***/ },
/* 10 */
/***/ function(module, exports) {

	module.exports = require("lodash/isObject");

/***/ },
/* 11 */
/***/ function(module, exports) {

	module.exports = require("path");

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./loaders": 6,
		"./loaders.js": 6,
		"./loggers": 13,
		"./loggers.js": 13,
		"./reporters/csv": 19,
		"./reporters/csv.js": 19,
		"./reporters/etalon": 20,
		"./reporters/etalon.js": 20,
		"./reporters/fastest": 22,
		"./reporters/fastest.js": 22,
		"./reporters/json": 23,
		"./reporters/json.js": 23,
		"./util": 14,
		"./util.js": 14
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 12;


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.silent = exports.base = undefined;
	
	var _gulpUtil = __webpack_require__(5);
	
	var _util = __webpack_require__(14);
	
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
	    onComplete: void 0
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
/* 14 */
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
	
	var _tildify = __webpack_require__(15);
	
	var _tildify2 = _interopRequireDefault(_tildify);
	
	var _defaults = __webpack_require__(4);
	
	var _defaults2 = _interopRequireDefault(_defaults);
	
	var _groupBy = __webpack_require__(16);
	
	var _groupBy2 = _interopRequireDefault(_groupBy);
	
	var _isArray = __webpack_require__(17);
	
	var _isArray2 = _interopRequireDefault(_isArray);
	
	var _isUndefined = __webpack_require__(18);
	
	var _isUndefined2 = _interopRequireDefault(_isUndefined);
	
	var _gulpUtil = __webpack_require__(5);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/**
	 * Return a caption string for a benchmark suite
	 * @param {Benchmark.Suite} suite
	 * @param {String} path
	 * @returns {String}
	 */
	function caption(suite, path) {
	  var name = suite.name;
	  path = _gulpUtil.colors.magenta((0, _tildify2.default)(path));
	  return name ? '\'' + _gulpUtil.colors.cyan(name) + '\' from ' + path : path;
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
	 * @param {Array<Benchmark>}passed
	 */
	function sortFastestFirst(passed) {
	  passed.sort(function (a, b) {
	    return b.hz - a.hz;
	  });
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
/* 15 */
/***/ function(module, exports) {

	module.exports = require("tildify");

/***/ },
/* 16 */
/***/ function(module, exports) {

	module.exports = require("lodash/groupBy");

/***/ },
/* 17 */
/***/ function(module, exports) {

	module.exports = require("lodash/isArray");

/***/ },
/* 18 */
/***/ function(module, exports) {

	module.exports = require("lodash/isUndefined");

/***/ },
/* 19 */
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
	            storageRef.storage = {
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
	
	var _compact = __webpack_require__(3);

	var _compact2 = _interopRequireDefault(_compact);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	module.exports = exports['default'];

	/**
	 * A CSV Reporter
	 * @param {String} [output]
	 * @returns {ReporterHandler}
	 */

/***/ },
/* 20 */
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
	            etalonIndex = (0, _isString2.default)(etalonName) ? passed.name.indexOf(etalonName) : 0,
	            etalon = etalonIndex < 0 ? passed[0] : passed[etalonIndex],
	            etalonHz = etalon ? etalon.hz : 0;
	        (0, _gulpUtil.log)('' + (0, _util.indent)(1) + (0, _util.caption)(suite, path) + ' (' + _gulpUtil.colors.green('passed') + ': ' + passed.length + ', ' + _gulpUtil.colors.red('failed') + ': ' + failed.length + ')');
	        if (passed.length > 0) {
	            (0, _gulpUtil.log)('' + (0, _util.indent)(2) + _gulpUtil.colors.green('Passed') + ':');
	            passed.forEach(function (test, index) {
	                var output = (0, _util.indent)(3) + '\'test.name\'';
	                if (index < etalonIndex) {
	                    output += ' at ' + (test.hz / etalonHz).toFixed(2) + 'x faster';
	                } else if (index < etalonIndex) {
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
	
	var _compact = __webpack_require__(3);

	var _compact2 = _interopRequireDefault(_compact);

	var _isString = __webpack_require__(21);

	var _isString2 = _interopRequireDefault(_isString);

	var _gulpUtil = __webpack_require__(5);

	var _util = __webpack_require__(14);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	module.exports = exports['default'];

	/**
	 * An etalon Reporter
	 * @param {String} etalonName
	 * @returns {ReporterHandler}
	 */

/***/ },
/* 21 */
/***/ function(module, exports) {

	module.exports = require("lodash/isString");

/***/ },
/* 22 */
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
	                timesStr = _benchmark2.default.formatNumber(+times.toFixed(times < 2 ? 2 : 1));
	            (0, _gulpUtil.log)((0, _util.indent)(1) + 'Fastest test is \'' + first.name + '\' at ' + timesStr + 'x faster than \'' + second.name + '\'');
	        }
	    };
	};
	
	var _benchmark = __webpack_require__(1);

	var _benchmark2 = _interopRequireDefault(_benchmark);

	var _compact = __webpack_require__(3);

	var _compact2 = _interopRequireDefault(_compact);

	var _gulpUtil = __webpack_require__(5);

	var _util = __webpack_require__(14);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	module.exports = exports['default'];

	/**
	 * An etalon Reporter
	 * @returns {ReporterHandler}
	 */

/***/ },
/* 23 */
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
	            storageRef.storage = {
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
	
	var _compact = __webpack_require__(3);

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