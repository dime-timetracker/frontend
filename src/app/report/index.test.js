'use strict'

const m = require('mithril')
const mq = require('mithril-query')

const expect = require('expect.js')
const columnSelectionView = require('./').columnSelectionView
const getFilterOptions = require('./').getFilterOptions
const prepareCollection = require('./').prepareCollection
const getInvoiceParams = require('./').getInvoiceParams

describe('turning filters into fetch options', () => {
  let customers, projects, services
  beforeEach(() => {
    global.document = {
      body: {},
      attachEvent: () => {}
    }
    global.navigator = { language: 'en' }
    global.window = m.deps({
      dimeDebug: () => {},
      navigator: global.navigator,
      document: global.document
    })

    customers = [{ id: 14, alias: 'foo' }]
    projects = [{ id: 234, alias: 'bar' }]
    services = [{ id: 98723, alias: 'baz' }]
  })

  it('should allow to pick columns to be rendered', () => {
    const out = mq(columnSelectionView(m.prop(['description', 'project', 'duration'])))
    out.should.have(1, '.columns-selection')
    out.should.have(8, '.columns-selection input')
    out.should.have(8, '.columns-selection label')

    out.should.have(1, '.columns-selection input#enable_column_description[type=checkbox][checked]')
    out.should.have(1, '.columns-selection input#enable_column_customer[type=checkbox]:not([checked])')
    out.should.have(1, '.columns-selection input#enable_column_project[type=checkbox][checked]')
    out.should.have(1, '.columns-selection input#enable_column_service[type=checkbox]:not([checked])')
    out.should.have(1, '.columns-selection input#enable_column_tags[type=checkbox]:not([checked])')
    out.should.have(1, '.columns-selection input#enable_column_started_at[type=checkbox]:not([checked])')
    out.should.have(1, '.columns-selection input#enable_column_stopped_at[type=checkbox]:not([checked])')
    out.should.have(1, '.columns-selection input#enable_column_duration[type=checkbox][checked]')
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

  describe('invoice params', () => {
    let columns, config, rows
    beforeEach(() => {
      columns = [ 'project', 'tags', 'description', 'duration' ]
      rows = [
        {
          activity: {
            description: 'brainstorming',
            customer: { name: 'world', address: 'somewhere over the rainbow' },
            project: { name: 'save the world', rate: 100 },
            tags: [  { name: 'peace' }, { name: 'nature' } ]
          },
          duration: 7 * 24 * 3600
        },
        {
          activity: {
            description: 'delete everything that is not nemo',
            project: { name: 'find nemo', rate: 30 }
          },
          duration: 9000
        }
      ]
      config = {
        incrementNo: 2222,
        sender: 'Winnetouch, Puderrosa Ranch',
        taxRate: 19
      }
    })

    it('should throw an error, if there are different customers', () => {
      rows[1].activity.customer = { name: 'Marvin', address: "plastic bag\n\nSidney, Australia" }
      expect(function () { getInvoiceParams(config, columns, rows) }).to.throwException(
        /report.invoice.error.altering-customers/
      )
    })

    it('should convert report into invoice params', () => {
      expect(getInvoiceParams(config, columns, rows)).to.eql({
        columns: [ 'project', 'tags', 'description', 'duration' ],
        increment_no: 2222,
        receiver: 'somewhere over the rainbow',
        sender: 'Winnetouch, Puderrosa Ranch',
        totals: {
          subtotal: 7 * 24 * 100 + 2.5 * 30,
          tax: (7 * 24 * 100 + 2.5 * 30) * 0.19,
          grand_total: (7 * 24 * 100 + 2.5 * 30) * 1.19
        }
      })
    })
  })
})
