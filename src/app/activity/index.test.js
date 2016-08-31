'use strict'

const m = require('src/lib/mithril')

global.document = {
  body: {},
  attachEvent: () => {}
}
global.navigator = {}
global.window = m.deps({
  localStorage: {},
  dimeDebug: () => {},
  navigator: global.navigator,
  document: global.document
})

const expect = require('expect.js')
const running = require('./').running

describe('activity', () => {
  let activity

  beforeEach(() => {
    activity = { timeslices: [
      { stopped_at: '2015-06-22 14:23:35' },
      { stopped_at: '2015-06-22 14:23:35' },
      { stopped_at: '2015-06-22 14:23:35' }
    ]}
  })

  it('should not be running', () => {
    expect(running(activity)).to.be(false)
  })

  it('should be running', () => {
    activity.timeslices.push({})
    expect(running(activity)).to.be(true)
  })
})
