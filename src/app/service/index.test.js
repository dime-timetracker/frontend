'use strict'

const list = require('./index')
const mq = require('mithril-query')
const t = require('../../lib/translation')

describe('services', () => {
  beforeEach(() => {
    global.document = {
      body: {},
      attachEvent: () => {}
    }
    global.navigator = { language: 'en' }
  })
  describe('add', () => {
    it('button is shown', () => {
      const out = mq(list.view({}))
      out.should.have(1, '.fbtn', t('service.add'))
    })
  })
})
