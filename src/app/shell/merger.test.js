'use strict'

const expect = require('expect.js')
const m = require('src/lib/mithril')
const mq = require('mithril-query')
const merger = require('./merger')

describe('merger', function () {
  let scope = {}
  beforeEach(function () {
    global.window.navigator = { language: 'en' }
    scope = {
      current: '',
      examples: [],
      query: m.prop(''),
      update: () => {}
    }
  })

  it('should render no examples, if there is none', function () {
    const out = mq(merger.examplesView(scope))
    out.should.not.have('.examples')
  })

  it('should render a dropdown with examples, if there are some', function () {
    scope.examples = {
      testingFoo: 'foo',
      testingAdditionalStaticRow: 'rows.map(row => { row.context = "test"; return row })'
    }
    const out = mq(merger.examplesView(scope))
    out.should.have(1, '.examples')
    out.should.have(1, '.examples select')
    out.should.have(3, '.examples select option')
    out.should.have(1, '.examples select option[value="none"]')
    out.should.have(1, '.examples select option[value="testingFoo"]')
    out.should.have('1, .examples select option[value="testingAdditionalStaticRow"]')
  })

  it('should preselect current option', function () {
    scope.examples = {
      testingAdditionalStaticRow: 'rows.map(row => { row.context = "test"; return row })'
    }
    scope.query('rows.map(row => { row.context = "test"; return row })')
    const out = mq(merger.examplesView(scope))
    out.should.have(1, '.examples select option[selected]')
    expect(out.first('.examples select option[selected]').attrs.value).to.eql('testingAdditionalStaticRow')
  })
})
