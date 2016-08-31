'use strict'

const m = require('src/lib/mithril')
const mq = require('mithril-query')
const expect = require('expect.js')

const totals = require('./totals')

const fakeWindow = {
  localStorage: {},
  dimeDebug: () => {},
  document: global.document,
  navigator: { language: 'de-DE' }
}

describe('render totals', () => {
  let rows
  beforeEach(() => {
    global.window = m.deps(fakeWindow)
    rows = [
      { duration: 3600 * 50 },
      { duration: 3600 * 10 },
      { duration: 3600 * 20 },
      { duration: 3600 * 15 },
      { duration: 3600 * 15.50 },
      { duration: 3600 * 13 }
    ]
  })
  it('should create a table row', () => {
    const out = mq(totals.view(totals.controller({ rows: rows })))
    out.should.have(1, 'tr')
  })
  it('should create empty columns for unset relations', () => {
    const out = mq(totals.view(totals.controller({ rows: rows })))
    out.should.have(1, 'tr')
    out.should.have(1, 'th[colspan=4]')
    out.should.have(1, 'td.duration.total')
    expect(out.first('td').children[0]).to.match(/123[,.]50 h/)
  })
})
