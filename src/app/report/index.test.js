'use strict'

const m = require('mithril')

const expect = require('expect.js')
const getFilterOptions = require('./').getFilterOptions
const prepareCollection = require('./').prepareCollection

describe('turning filters into fetch options', () => {
  let customers, projects, services
  beforeEach(() => {
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

    customers = [{ id: 14, alias: 'foo' }]
    projects = [{ id: 234, alias: 'bar' }]
    services = [{ id: 98723, alias: 'baz' }]
  })

  it('should add customer', () => {
    const query = '@foo'
    expect(getFilterOptions(customers, projects, services)(query)).to.eql({
      parameters: {
        'by[customer]': 14
      }
    })
  })

  it('should add project', () => {
    const query = '/bar'
    expect(getFilterOptions(customers, projects, services)(query)).to.eql({
      parameters: {
        'by[project]': 234
      }
    })
  })

  it('should add customer', () => {
    const query = ':baz'
    expect(getFilterOptions(customers, projects, services)(query)).to.eql({
      parameters: {
        'by[service]': 98723
      }
    })
  })

  describe('add dates', () => {
    it('should add a start date', () => {
      const query = 'current week'
      let result = getFilterOptions(customers, projects, services)(query)
      expect(result.parameters['by[date]']).to.match(/^[^;]+;$/)
    })
    it('should add a start and an end date', () => {
      const query = 'last month'
      let result = getFilterOptions(customers, projects, services)(query)
      expect(result.parameters['by[date]']).to.match(/^[^;]+;[^;]+$/)
    })
  })

  describe('custom merge', () => {
    it('should apply a custom merge function', () => {
      const scope = {
        collection: m.prop([
          { activity: { name: 'a' }, started_at: '2016-01-01 00:00', stopped_at: '2016-01-01 01:00' },
          { activity: { name: 'b' }, started_at: '2016-01-01 00:00', stopped_at: '2016-01-01 01:00' },
          { activity: { name: 'c' }, started_at: '2016-01-01 00:00', stopped_at: '2016-01-01 01:00' },
          { activity: { name: 'd' }, started_at: '2016-01-01 00:00', stopped_at: '2016-01-01 01:00' }
        ]),
        customMergeCode: m.prop('rows.filter(row => row.activity.name !== "c")'),
        rows: m.prop([])
      }
      m.redraw = () => {}
      prepareCollection(scope)
      expect(scope.rows()).to.eql([
        { activity: { name: 'a' }, duration: 3600, started_at: '2016-01-01 00:00', stopped_at: '2016-01-01 01:00' },
        { activity: { name: 'b' }, duration: 3600, started_at: '2016-01-01 00:00', stopped_at: '2016-01-01 01:00' },
        { activity: { name: 'd' }, duration: 3600, started_at: '2016-01-01 00:00', stopped_at: '2016-01-01 01:00' }
      ])
    })
  })
})
