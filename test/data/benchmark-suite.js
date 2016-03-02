import Benchmark from 'benchmark';

let suite = new Benchmark.Suite('Search'),
    options = {maxTime: 0.1};

suite
    .add('RegExp#test', () => /o/.test('Hello World!'), options)
    .add('String#indexOf', () => 'Hello World!'.indexOf('o') > -1, options)
    .add('String#match', () => !!'Hello World!'.match(/o/), options);

export default suite;
