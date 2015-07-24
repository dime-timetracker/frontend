'use strict';

var m = require('mithril');
global.window = m.deps({
  dimeDebug: function () {
    return function () {};
  },
});

var bookmarks = require('./bookmarks');
var expect = require('expect.js');

describe('bookmarks', function() {
  beforeEach(function () {
    bookmarks.injectList([
      {name: 'foo', query: 'foo'},
      {name: 'foobar', query: 'foo /bar'}
    ]);
  });

  describe('should recognize saved queries', function() {
    it('should reject unknown queries', function() {
      expect(bookmarks.isKnownQuery('bar')).to.be(false);
    });
    it('should confirm known queries', function() {
      expect(bookmarks.isKnownQuery('foo')).to.be(true);
      expect(bookmarks.isKnownQuery('foo ')).to.be(true);
      expect(bookmarks.isKnownQuery('foo   /bar')).to.be(true);
      expect(bookmarks.isKnownQuery('foo /bar')).to.be(true);
      expect(bookmarks.isKnownQuery(' /bar foo')).to.be(true);
    });
  });
});
