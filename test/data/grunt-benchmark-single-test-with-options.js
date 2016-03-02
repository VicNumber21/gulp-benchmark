export default {
    name: 'Timeout (asynchronous)',
    maxTime: 0.1,
    defer: true,
    onComplete: () => console.log('Hooray!'),
    fn: (deferred) => setTimeout(() => deferred.resolve(), 1)
};
