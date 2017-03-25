'use strict'

const mq = require('mithril-query')
const expect = require('expect.js')
const nbsp = '\u00a0'

const itemComponent = require('./item')

describe('render report item', () => {
  const item = {}
  const columns = ['description', 'customer', 'project', 'service', 'duration']
  beforeEach(() => {
    item.id = 123
    item.activity = {
      description: 'Something I did'
    }
  })
  it('should create a table row', () => {
    const out = mq(itemComponent.view({ item: item, columns: columns }))
    out.should.have(1, 'tr')
  })
  it('should create empty columns for unset relations', () => {
    const out = mq(itemComponent.view({ item: item, columns: columns }))
    out.should.have(1, 'tr')
    out.should.have(1, 'td.description')
    out.should.have(1, 'td.customer')
    out.should.have(1, 'td.project')
    out.should.have(1, 'td.service')
    expect(out.first('td.description').children).to.eql(['Something I did'])
    expect(out.first('td.customer').children).to.eql([''])
    expect(out.first('td.project').children).to.eql([''])
    expect(out.first('td.service').children).to.eql([''])
  })
  it('should print related names', () => {
    item.activity.customer = { name: 'My Cash Cow' }
    item.activity.project = { name: 'World Domination' }
    item.activity.service = { name: 'Cleanup' }
    const out = mq(itemComponent.view({ item: item, columns: columns }))
    expect(out.first('td.description').children).to.eql(['Something I did'])
    expect(out.first('td.customer').children).to.eql(['My Cash Cow'])
    expect(out.first('td.project').children).to.eql(['World Domination'])
    expect(out.first('td.service').children).to.eql(['Cleanup'])
  })
  describe('should print duration as hours in format "0.00 h"', () => {
    it('when no rounding is required', () => {
      item.duration = 3600
      let out = mq(itemComponent.view({ item: item, columns: columns }))
      out.should.have(1, 'td.duration')
      expect(out.first('td.duration').children).to.eql(['1.00' + nbsp + 'h'])
    })
    it('when we need to round up', () => {
      item.duration = 1797
      let out = mq(itemComponent.view({ item: item, columns: columns }))
      out.should.have(1, 'td.duration')
      expect(out.first('td.duration').children).to.eql(['0.50' + nbsp + 'h'])
    })
    it('when we need to round down', () => {
      item.duration = 7203
      let out = mq(itemComponent.view({ item: item, columns: columns }))
      out.should.have(1, 'td.duration')
      expect(out.first('td.duration').children).to.eql(['2.00' + nbsp + 'h'])
    })
  })
})
