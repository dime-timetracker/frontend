'use strict'

const button = require('./button')
const m = require('mithril')
const mq = require('mithril-query')

describe('button', () => {
  describe('add', () => {
    it('is rendered without options', () => {
      const out = mq(button({}))
      out.should.have(1, 'span.fbtn-red')
      out.should.have(1, 'span.fbtn-red span.icon.icon-add')
    })
    it('is rendered with title', () => {
      const out = mq(button({ title: 'foobar' }))
      out.should.have(1, 'span.fbtn-red[title="foobar"]')
      out.should.have(1, 'span.fbtn-red span.icon.icon-add')
    })
    it('is rendered with button classes', () => {
      const out = mq(button({ title: 'foobar', buttonOptions: { class: 'knopf' } }))
      out.should.have(1, 'span.fbtn-red.knopf[title="foobar"]')
      out.should.have(1, 'span.fbtn-red span.icon.icon-add')
    })
    it('is rendered with different icon', () => {
      const out = mq(button({ title: 'foobar', buttonOptions: { class: 'knopf' }, icon: 'icon-delete' }))
      out.should.have(1, 'span.fbtn-red.knopf[title="foobar"]')
      out.should.have(1, 'span.fbtn-red.knopf[title="foobar"] span.icon.icon-delete')
    })
    it('is rendered with icon classes', () => {
      const out = mq(button({ title: 'foobar', buttonOptions: { class: 'knopf' }, iconOptions: { class: 'symbol' } }))
      out.should.have(1, 'span.fbtn-red.knopf[title="foobar"]')
      out.should.have(1, 'span.fbtn-red.knopf[title="foobar"] span.icon.icon-add.symbol')
    })
    it('is rendered with some item before', () => {
      const out = mq(button({ title: 'foobar', before: m('a.something-before', 'prepending') }))
      out.should.have(1, '.fbtn-inner .fbtn.fbtn-red[title="foobar"]')
      out.should.have(2, '.fbtn-inner > .')
      out.should.have(1, '.fbtn-inner a.something-before:first-child')
      out.should.have(1, '.fbtn-inner a:first-child:contains("prepending")')
    })
    it('is rendered with some item after', () => {
      const out = mq(button({ title: 'foobar', after: m('a.something-after', 'trailing') }))
      out.should.have(1, '.fbtn-inner .fbtn.fbtn-red[title="foobar"]')
      out.should.have(2, '.fbtn-inner > .')
      out.should.have(1, '.fbtn-inner span.fbtn-red[title="foobar"]')
      out.should.have(1, '.fbtn-inner a.something-after')
      out.should.have(1, '.fbtn-inner a:last-child:contains("trailing")')
    })
  })
})
