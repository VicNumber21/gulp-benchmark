import {colors, log} from 'gulp-util';
import {caption, indent} from './util';

export const base = {
    onStart: (suite) => log(`${indent(1)}Running ${caption(suite)} ...`),
    onCycle: (event) => {
        let target = event.target;
        log(`${indent(2)}${target}${target.error ? colors.red(' error') : ''}`);
    },
    onError: (suite) => {
        log(`${indent(1)}${colors.red('Errors')} in ${caption(suite)}:`);
        suite.filter(test => test.error)
            .forEach(test => log(`${indent(2)}${test.name}: ${test.error}`));
    }
};

export const silent = {
    onStart: () => null,
    onCycle: () => null,
    onError: () => null,
    onComplete: () => null
};
