import pkg from './package';
import isArray from 'lodash/isArray';
import merge from 'lodash/merge';
import template from 'lodash/template';
import {readFileSync} from 'fs';
import {optimize, BannerPlugin} from 'webpack';

const banner = template(readFileSync(__dirname + '/LICENSE_BANNER', 'utf8'))({
    pkg: pkg,
    date: new Date()
});

const base = {
    externals: /^[a-z\/\-0-9]+$/i,
    target: 'node',
    output: {
        libraryTarget: 'commonjs2',
        devtoolModuleFilenameTemplate: 'webpack:///sort/[resource-path]'
    },
    module: {
        preLoaders: [{test: /\.js$/, loader: 'source-map-loader'}],
        loaders: [{
            test: /\.js$/,
            exclude: /(node_modules)/,
            loader: 'babel-loader'
        }]
    },
    devtool: 'source-map'
};

export const build = merge({}, base, {
    entry: './index.js',
    output: {
        filename: 'gulp-benchmark.js'
    },
    plugins: [
        new BannerPlugin(banner, {raw: true})
    ]
});

export const uglify = merge({}, base, {
    entry: './index.js',
    output: {
        filename: 'gulp-benchmark.min.js'
    },
    plugins: [
        new optimize.UglifyJsPlugin(),
        new BannerPlugin(banner, {raw: true})
    ]
});

export const test = merge({}, base, {
    output: {
        filename: 'test.js'
    }
}, (a, b) => isArray(a) ? a.concat(b) : void 0);
