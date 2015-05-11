'use strict';

var grunt = require('grunt');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.jade = {
  setUp: function(done) {
    // setup here if necessary
    done();
  },
  use_modifier: function(test) {
    test.expect(1);

    var actual = grunt.file.read('tmp/jsptest.jsp');
    var expected = grunt.file.read('test/expected/jsptest.jsp');
    test.equal(actual, expected, 'should describe what the default behavior is.');

    test.done();
  },
  nouse_modifiers: function(test) {
    test.expect(1);

    var actual = grunt.file.read('tmp/jade1.html');
    var expected = grunt.file.read('test/expected/jade1.html');
    test.equal(actual, expected, 'should describe what the custom option(s) behavior is.');

    test.done();
  },
};
