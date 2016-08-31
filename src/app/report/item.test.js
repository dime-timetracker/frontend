'use strict'

const m = require('mithril')
const mq = require('mithril-query')
const expect = require('expect.js')

const itemComponent = require('./item')

describe('render report item', () => {
  const item = {}
  beforeEach(() => {
    item.id = 123
    item.activity = {
      description: 'Something I did'
    }
  })
  it('should create a table row', () => {
    const out = mq(itemComponent.view(itemComponent.controller({ item: item })))
    out.should.have(1, 'tr')
  })
  it('should create empty columns for unset relations', () => {
    const out = mq(itemComponent.view(itemComponent.controller({ item: item })))
    out.should.have(1, 'tr')
    out.should.have(1, 'td.activity.description')
    out.should.have(1, 'td.activity.customer')
    out.should.have(1, 'td.activity.project')
    out.should.have(1, 'td.activity.service')
    expect(out.first('td.activity.description').children).to.eql(['Something I did'])
    expect(out.first('td.activity.customer').children).to.eql([''])
    expect(out.first('td.activity.project').children).to.eql([''])
    expect(out.first('td.activity.service').children).to.eql([''])
  })
  it('should print related names', () => {
    item.activity.customer = { name: 'My Cash Cow' }
    item.activity.project = { name: 'World Domination' }
    item.activity.service = { name: 'Cleanup' }
    const out = mq(itemComponent.view(itemComponent.controller({ item: item })))
    expect(out.first('td.activity.description').children).to.eql(['Something I did'])
    expect(out.first('td.activity.customer').children).to.eql(['My Cash Cow'])
    expect(out.first('td.activity.project').children).to.eql(['World Domination'])
    expect(out.first('td.activity.service').children).to.eql(['Cleanup'])
  })
  describe('should print duration as hours in format "0.00 h"', () => {
    it('when no rounding is required', () => {
      item.duration = 3600
      let out = mq(itemComponent.view(itemComponent.controller({ item: item })))
      out.should.have(1, 'td.duration')
      expect(out.first('td.duration').children).to.eql(['1.00 h'])
    })
    it('when we need to round up', () => {
      item.duration = 1797
      let out = mq(itemComponent.view(itemComponent.controller({ item: item })))
      out.should.have(1, 'td.duration')
      expect(out.first('td.duration').children).to.eql(['0.50 h'])
    })
    it('when we need to round down', () => {
      item.duration = 7203
      let out = mq(itemComponent.view(itemComponent.controller({ item: item })))
      out.should.have(1, 'td.duration')
      expect(out.first('td.duration').children).to.eql(['2.00 h'])
    })
  })
})
