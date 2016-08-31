'use strict'

const m = require('src/lib/mithril')
const mq = require('mithril-query')

const expect = require('expect.js')
const view = require('./').view
const sections = require('./').sections

describe('settings view', () => {
  beforeEach(() => {
    global.window = {
      navigator: {
        language: 'en'
      }
    }
  })
  it('contains nothing for an empty section', () => {
    sections.global = {}
    let out = mq(view, { settings: {} })
    out.should.have(1, '.settings')
    out.should.have(0, '.section.global')
    out.should.have(0, '.section.global .item')
  })
  it('renders a text input, if no type is given', () => {
    sections.global = { foo: { value: 'bla' } }
    let out = mq(view, { settings: {} })
    out.should.have(1, '.settings')
    out.should.have(1, '.section.global')
    out.should.have(1, '.section.global .item')
    out.should.have(1, '.section.global .item input[name="foo"][type="text"]')
  })
  it('renders a text input, if type "text" is given; using default value', () => {
    sections.global = { foo: { value: 'bla', type: 'text' } }
    let out = mq(view, { settings: {} })
    out.should.have(1, '.item input[name="foo"][type="text"][value="bla"]')
  })
  it('renders a number input, if type "number" is given; using configured value', () => {
    sections.global = { foo: { value: 'bla', type: 'number' } }
    let out = mq(view, { settings: { foo: 123 } })
    out.should.have(1, '.item input[name="foo"][type="number"][value="123"]')
  })
  describe('renders a checkbox, if type "checkbox" is given', () => {
    it('checkbox will not be checked, if it was neither configured to be checked nor checked by default', () => {
      sections.global = { foo: { value: 0, type: 'checkbox' } }
      let out = mq(view, { settings: {} })
      out.should.have(1, '.item input[name="foo"][type="checkbox"]')
      out.should.have(0, '.item input[name="foo"][type="checkbox"][checked]')
    })

    it('checkbox will be checked, if it was not configured to be checked, but checked by default', () => {
      sections.global = { foo: { value: 1, type: 'checkbox' } }
      let out = mq(view, { settings: {} })
      out.should.have(1, '.item input[name="foo"][type="checkbox"]')
      out.should.have(1, '.item input[name="foo"][type="checkbox"][checked]')
    })

    it('checkbox will be checked, if it was configured to be checked', () => {
      sections.global = { foo: { value: 0, type: 'checkbox' } }
      let out = mq(view, { settings: { foo: 1 } })
      out.should.have(1, '.item input[name="foo"][type="checkbox"]')
      out.should.have(1, '.item input[name="foo"][type="checkbox"][checked]')
    })

    it('checkbox will be checked, if it was configured to be checked, but not checked by default', () => {
      sections.global = { foo: { value: 1, type: 'checkbox' } }
      let out = mq(view, { settings: { foo: 0 } })
      out.should.have(1, '.item input[name="foo"][type="checkbox"]')
      out.should.have(0, '.item input[name="foo"][type="checkbox"][checked]')
    })
  })
  it('renders a dropdown, if type "select" is given; preselecting configured value', () => {
    sections.global = { foo: { value: 'bla', type: 'select', options: [ { value: 'one', label: 'eense' } ] } }
    let out = mq(view, { settings: { foo: 'one' } })
    out.should.have(1, '.item select[name="foo"] option[value="one"][selected]:contains("eense")')
  })
})
