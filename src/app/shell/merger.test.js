'use strict'

const expect = require('expect.js')
const m = require('src/lib/mithril')
const mq = require('mithril-query')
const merger = require('./merger')

function settingsMock (context) {
  if (typeof context.onSuccess !== 'function') {
    context.onSuccess = item => item
  }
  if (typeof context.onFail !== 'function') {
    context.onFail = () => {}
  }
  return {
    find: name => context.result,
    persistConfig: (name, item) => {
      return new Promise((resolve, reject) => {
        context.willSucceed !== false ? resolve(context.onSuccess(item)) : reject(context.onFail())
      })
    }
  }
}

describe('merger', function () {
  let scope = {}
  beforeEach(function () {
    global.window.navigator = { language: 'en' }
    scope = {
      current: '',
      examples: m.prop([]),
      query: m.prop(''),
      update: () => {}
    }
  })

  it('should render no examples, if there is none', function () {
    const out = mq(merger.examplesView(scope))
    out.should.not.have('.examples')
  })

  describe('merge code editor', () => {
    it('should be empty by default', () => {
      const out = mq(merger.inputView(scope))
      out.should.have(1, '.mergebox')
      out.should.have(0, '.mergebox .codebox')
    })
    describe('should be visible', () => {
      beforeEach(() => { scope.showDetails = true })
      it('should contain a codebox', () => {
        const out = mq(merger.inputView(scope))
        out.should.have(1, '.mergebox .codebox')
      })
      it('should request a name', () => {
        const out = mq(merger.inputView(scope))
        out.should.have(1, '.mergebox #codename')
      })
    })
  })

  it('should render a dropdown with examples, if there are some', function () {
    scope.examples = m.prop({
      testingFoo: 'foo',
      testingAdditionalStaticRow: 'rows.map(row => { row.context = "test"; return row })'
    })
    const out = mq(merger.examplesView(scope))
    out.should.have(1, '.examples')
    out.should.have(1, '.examples select')
    out.should.have(4, '.examples select option')
    out.should.have(1, '.examples select option[value="–"]')
    out.should.have(1, '.examples select option[value="custom code"]')
    out.should.have(1, '.examples select option[value="testingFoo"]')
    out.should.have('1, .examples select option[value="testingAdditionalStaticRow"]')
  })

  it('should preselect current option', function () {
    scope.examples = m.prop({
      testingAdditionalStaticRow: 'rows.map(row => { row.context = "test"; return row })'
    })
    scope.name = 'testingAdditionalStaticRow'
    scope.query('rows.map(row => { row.context = "test"; return row })')
    const out = mq(merger.examplesView(scope))
    out.should.have(1, '.examples select option[selected]')
    expect(out.first('.examples select option[selected]').attrs.value).to.eql('testingAdditionalStaticRow')
  })

  describe('methods to manage mergers', () => {
    let methods
    beforeEach(() => {
      let config = [{ name: 'empty', code: '' }]
      methods = merger.methods({
        find: name => JSON.stringify(config)
      }, {
        persistConfig: (name, value) => {
          if (name !== 'report.customMergers') {
            throw { msg: 'Expected config key "report.customMergers".' }
          }
          return value
        }
      })
      global.window.atob = string => string.substr(8)
      global.window.btoa = string => 'encoded_' + string
    })
    it('should get saved mergers', () => {
      expect(methods.get()).to.eql({ empty: '' })
    })
    it('should add merger', () => {
      expect(methods.add('zwo', 'second')).to.eql(
        JSON.stringify([
          { name: 'empty', code: 'encoded_' },
          { name: 'zwo', code: 'encoded_second' }
        ])
      )
    })
    it('should update merger', () => {
      expect(methods.update('empty', 'leer', 'updatedCode')).to.eql(
        JSON.stringify([
          { name: 'leer', code: 'encoded_updatedCode' }
        ])
      )
    })
    it('should remove merger', () => {
      expect(methods.remove('empty')).to.eql('[]')
    })
  })
})
