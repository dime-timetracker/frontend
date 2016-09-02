'use strict'

const expect = require('expect.js')
const item = require('./item')
const mq = require('mithril-query')

describe('customer item', () => {
  beforeEach(() => {
    global.document = {
      body: {},
      attachEvent: () => {}
    }
    global.navigator = { language: 'en' }
  })
  describe('property value', () => {
    it('returns a warning, if empty', () => {
      const out = mq(item.propertyValue({}, { name: 'foo' }))
      out.should.have(1, 'em')
    })
    it('returns an existing simple property', () => {
      const out = mq(item.propertyValue({foo: 'bar'}, { name: 'foo' }))
      out.should.contain('bar')
    })
    it('returns an existing simple property with prefix', () => {
      const out = mq(item.propertyValue({foo: 'bar'}, { name: 'foo', prefix: '~' }))
      expect(out.first('.value').children[0]).to.eql('~bar')
    })
    it('returns an existing simple property with postfix', () => {
      const out = mq(item.propertyValue({foo: 'bar'}, { name: 'foo', postfix: '~' }))
      expect(out.first('.value').children[0]).to.eql('bar~')
    })
    it('returns an existing address property formatted', () => {
      const out = mq(item.propertyValue({address: "bar\nfoo"}, { name: 'address' }))
      out.should.have(1, 'br')
      expect(out.first('.value').children[0]).to.eql('bar')
      expect(out.first('.value').children[2]).to.eql('foo')
    })
  })
})
