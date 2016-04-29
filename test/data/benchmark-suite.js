import Benchmark from 'benchmark';

const suite = new Benchmark.Suite('Search'),
    options = {maxTime: 0.1};

// TODO: Seems these are being duplicated by the module loader....
suite
    .add('RegExp#test', () => /o/.test('Hello World!'), options)
    .add('String#indexOf', () => 'Hello World!'.indexOf('o') > -1, options)
    .add('String#match', () => Boolean('Hello World!'.match(/o/)), options);

export default suite;
