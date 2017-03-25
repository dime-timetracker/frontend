'use strict'

const button = require('./button')
const mq = require('mithril-query')

describe('button', () => {
  describe('add', () => {
    it('is rendered without options', () => {
      const out = mq(button({}))
      out.should.have(1, 'a.fbtn-red')
      out.should.have(1, 'a.fbtn-red span.icon.icon-add')
    })
    it('is rendered with title', () => {
      const out = mq(button({ title: 'foobar' }))
      out.should.have(1, 'a.fbtn-red[title="foobar"]')
      out.should.have(1, 'a.fbtn-red span.icon.icon-add')
    })
    it('is rendered with button classes', () => {
      const out = mq(button({ title: 'foobar', buttonOptions: { class: 'knopf' } }))
      out.log('a')
      out.should.have(1, 'a.fbtn-red.knopf[title="foobar"]')
      out.should.have(1, 'a.fbtn-red span.icon.icon-add')
    })
    it('is rendered with different icon', () => {
      const out = mq(button({ title: 'foobar', buttonOptions: { class: 'knopf' }, icon: 'icon-delete' }))
      out.log('a')
      out.should.have(1, 'a.fbtn-red.knopf[title="foobar"]')
      out.should.have(1, 'a.fbtn-red.knopf[title="foobar"] span.icon.icon-delete')
    })
    it('is rendered with icon classes', () => {
      const out = mq(button({ title: 'foobar', buttonOptions: { class: 'knopf' }, iconOptions: { class: 'symbol' } }))
      out.log('a')
      out.should.have(1, 'a.fbtn-red.knopf[title="foobar"]')
      out.should.have(1, 'a.fbtn-red.knopf[title="foobar"] span.icon.icon-add.symbol')
    })
  })
})
