'use strict'

const m = require('mithril')

global.document = {
  body: {},
  attachEvent: () => {}
}
global.navigator = {}
global.window = m.deps({
  localStorage: {},
  dimeDebug: () => {},
  navigator: global.navigator,
  document: global.document,
})

const expect = require('expect.js')
const running = require('./').running

describe('activity', () => {
  let item

  beforeEach(() => {
    item = { timeslices: [
      { stoppedAt: '2015-06-22 14:23:35' },
      { stoppedAt: '2015-06-22 14:23:35' },
      { stoppedAt: '2015-06-22 14:23:35' }
    ]}
  })

  it('should not be running', () => {
    expect(running(item)).to.be(false)
  })

  it('should be running', () => {
    item.timeslices.push({})
    expect(running(item)).to.be(true)
  })
})
