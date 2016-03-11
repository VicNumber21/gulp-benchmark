import {colors, log} from 'gulp-util';
import {caption, indent} from './util';

/**
 * The base logger
 * @type {Logger}
 */
export const base = {
    onStart: (suite, path) => log(`${indent(1)}Running ${caption(suite, path)} ...`),
    onCycle: event => {
        const target = event.target;
        log(`${indent(2)}${target}${target.error ? colors.red(' error') : ''}`);
    },
    onError: (suite, path) => {
        log(`${indent(1)}${colors.red('Errors')} in ${caption(suite, path)}:`);
        suite.forEach(test => {
            if (test.error) {
                log(`${indent(2)}${test.name}: ${test.error}`);
            }
        });
    },
    onComplete: undefined
};

/**
 * A silent logger
 * @type {Logger}
 */
export const silent = {
    onStart: () => null,
    onCycle: () => null,
    onError: () => null,
    onComplete: () => null
};
