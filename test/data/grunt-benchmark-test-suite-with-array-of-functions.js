export default {
    name: 'Search',
    maxTime: 0.1,
    tests: [
        () => /o/.test('Hello World!'),
        () => 'Hello World!'.indexOf('o') > -1,
        () => !!'Hello World!'.match(/o/)
    ]
};
