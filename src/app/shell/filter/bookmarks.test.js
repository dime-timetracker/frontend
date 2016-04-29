'use strict'

const m = require('src/lib/mithril')
global.window = m.deps({
  dimeDebug: function () {
    return function () {}
  }
})

const bookmarks = require('./bookmarks')
const expect = require('expect.js')

describe('bookmarks', () => {
  beforeEach(() => {
    bookmarks.init([
      {name: 'foo', query: 'foo'},
      {name: 'foobar', query: 'foo /bar'}
    ])
  })

  describe('should recognize saved queries', () => {
    it('should reject unknown queries', () => {
      expect(bookmarks.isKnownQuery('bar')).to.be(false)
    })
    it('should confirm known queries', () => {
      expect(bookmarks.isKnownQuery('foo')).to.be(true)
      expect(bookmarks.isKnownQuery('foo ')).to.be(true)
      expect(bookmarks.isKnownQuery('foo   /bar')).to.be(true)
      expect(bookmarks.isKnownQuery('foo /bar')).to.be(true)
      expect(bookmarks.isKnownQuery(' /bar foo')).to.be(true)
    })
  })
})
