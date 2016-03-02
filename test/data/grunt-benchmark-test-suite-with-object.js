export default {
    name: 'Timeout Showdown',
    maxTime: 0.1,
    tests: {
        'Return immediately (synchronous)': () => null,
        'Timeout: 50ms (asynchronous)': {
            defer: true,
            fn: (deferred) => setTimeout(() => deferred.resolve(), 50)
        },
        'Timeout: 100ms (asynchronous)': {
            defer: true,
            fn: (deferred) => setTimeout(() => deferred.resolve(), 100)
        }
    }
};
