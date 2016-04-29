'use strict'

const m = require('mithril')
global.document = {
  body: {},
  attachEvent: () => {}
}
global.navigator = {}
global.window = m.deps({
  dimeDebug: () => {},
  navigator: global.navigator,
  document: global.document
})

const expect = require('expect.js')
const getFilterOptions = require('./').getFilterOptions

describe('turning filters into fetch options', () => {
  let customers, projects, services
  beforeEach(() => {
    customers = [{ id: 14, alias: 'foo' }]
    projects = [{ id: 234, alias: 'bar' }]
    services = [{ id: 98723, alias: 'baz' }]
  })

  it('should add customer', () => {
    const query = '@foo'
    expect(getFilterOptions(query, customers, projects, services)).to.eql({
      parameters: {
        'by[customer]': 14
      }
    })
  })

  it('should add project', () => {
    const query = '/bar'
    expect(getFilterOptions(query, customers, projects, services)).to.eql({
      parameters: {
        'by[project]': 234
      }
    })
  })

  it('should add customer', () => {
    const query = ':baz'
    expect(getFilterOptions(query, customers, projects, services)).to.eql({
      parameters: {
        'by[service]': 98723
      }
    })
  })

  describe('add dates', () => {
    it('should add a start date', () => {
      const query = 'current week'
      let result = getFilterOptions(query, customers, projects, services)
      expect(result.parameters['by[date]']).to.match(/^[^;]+;$/)
    })
    it('should add a start and an end date', () => {
      const query = 'last month'
      let result = getFilterOptions(query, customers, projects, services)
      expect(result.parameters['by[date]']).to.match(/^[^;]+;[^;]+$/)
    })
  })
})
