import {caption, indent} from '../util';
import {colors, log} from 'gulp-util';

export function base () {
    return {
        onStart: (suite) => log(`${indent(1)}Running ${caption(suite)} ...`),
        onCycle: (event) => {
            let target = event.target;
            log(`${indent(2)}${target}${target.error ? colors.red(' error') : ''}`);
        },
        onError: (suite) => {
            log(`${indent(1)}${colors.red('Errors')} in ${caption(suite)}:`);
            suite.forEach((test) => {
                if (test.error) {
                    log(`${indent(2)}${test.name}: ${test.error}`);
                }
            });
        }
    };
}

export function silent () {
    return {
        onStart: () => null,
        onCycle: () => null,
        onError: () => null,
        onComplete: () => null
    };
}

