import Benchmark from 'benchmark';

export default new Benchmark({
    name: 'RegExp#test',
    maxTime: 0.1,
    fn: () => {
        throw new Error('Wrong code!');
    }
});
