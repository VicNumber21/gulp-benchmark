export default {
    name: 'Timeout Showdown',
    tests: {
        'Return immediately (synchronous)': {
            maxTime: 0.1,
            fn: function () {
                throw new Error('Test exception');
            }
        },
        'Timeout: 50ms (asynchronous)': {
            maxTime: 0.1,
            defer: true,
            fn: (deferred) => setTimeout(() => deferred.resolve(), 50)
        },
        'Timeout: 100ms (asynchronous)': {
            maxTime: 0.1,
            defer: true,
            fn: (deferred) => setTimeout(() => deferred.resolve(), 100)
        }
    }
};
