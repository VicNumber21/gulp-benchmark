export default {
    name: 'Timeout Showdown',
    maxTime: 0.1,
    tests: [
        {
            name: 'Return immediately (synchronous)',
            fn: () => null
        }, {
            name: 'Timeout 50ms (asynchronous)',
            defer: true,
            fn: (deferred) => setTimeout(() => deferred.resolve(), 50)
        }, {
            name: 'Timeout 100ms (asynchronous)',
            defer: true,
            fn: (deferred) => setTimeout(() => deferred.resolve(), 100)
        }
    ]
};
