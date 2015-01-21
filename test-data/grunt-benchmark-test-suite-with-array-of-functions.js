module.exports = {
  name: 'Search',
  maxTime: 0.1,
  tests: [
    function() {
      /o/.test('Hello World!');
    },
    function() {
      'Hello World!'.indexOf('o') > -1;
    },
    function() {
      !!'Hello World!'.match(/o/);
    }
  ]
};
