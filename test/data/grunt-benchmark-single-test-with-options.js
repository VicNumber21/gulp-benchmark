export default {
    name: 'Timeout (asynchronous)',
    maxTime: 0.1,
    defer: true,
    onComplete: () => console.log('Hooray!'),  // eslint-disable-line no-console
    fn: deferred => setTimeout(() => deferred.resolve(), 1)
};
