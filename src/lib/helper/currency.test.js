'use strict'

const expect = require('expect.js')
const m = require('src/lib/mithril')

const fakeWindow = {
  localStorage: {},
  dimeDebug: () => {},
  document: global.document,
  navigator: { language: 'de-DE' }
}
global.window = m.deps(fakeWindow)

const currency = require('./currency')

describe('currency', () => {
  const nbsp = '\u00A0'

  beforeEach(() => { global.window = m.deps(fakeWindow) })
  it('should convert number (3.22) into formated string 3,22 €, if locale and currency are given', () => {
    let result = currency(3.22, { currency: 'EUR' }, 'de-DE')
    expect(result).to.be('3,22' + nbsp + '€')
  })

  it('should convert number (3.22) into formated string 3,22 €, if locale is given', () => {
    let result = currency(3.22, {}, 'de-DE')
    expect(result).to.be('3,22' + nbsp + '€')

    result = currency(3.22, undefined, 'de-DE')
    expect(result).to.be('3,22' + nbsp + '€')
  })

  it('should convert number (3.22) into formated string 3,22 €, using browser locale', () => {
    global.window.navigator.language = 'de-DE'
    let result = currency(3.22)
    expect(result).to.be('3,22' + nbsp + '€')
  })

  it('should convert number (3.22) into formated string $ 3.22 in US locale', () => {
    let result = currency(3.22, {currency: 'USD'}, 'en-US')
    expect(result).to.be('$3.22')
  })
})
