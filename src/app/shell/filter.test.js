'use strict'

const m = require('src/lib/mithril')
const mq = require('mithril-query')
const filter = require('./filter')

const fakeWindow = {
  dimeDebug: function () {
    return function () {}
  },
  attachEvent: function () {
    return function () {}
  }
}
global.window = m.deps(fakeWindow)

const expect = require('expect.js')

describe('filter', function () {
  let scope

  // Mousetrap makes use of these
  global.navigator = {}
  global.document = { attachEvent: fakeWindow.attachEvent }

  beforeEach(function () {
    global.window = m.deps(fakeWindow)
    scope = filter.controller({})
  })

  it('should render icon views', function () {
    const localScope = scope
    let renderedViewsCount = 0
    localScope.iconViews = [
      function () { ++renderedViewsCount },
      function () { ++renderedViewsCount },
      function () { ++renderedViewsCount },
      function () { ++renderedViewsCount }
    ]
    localScope.inputView = function () {}

    const out = mq(filter.view(localScope))
    expect(out.has('.icon')).to.be.ok()
    expect(renderedViewsCount).to.be(4)
  })

  it('should register a shortcut', function () {
    let registeredEvents = 0
    // Mousetrap binds 3 events per shortcut
    fakeWindow.attachEvent = function (e, handler) {
      if (['onkeypress', 'onkeydown', 'onkeyup'].indexOf(e) > -1 && typeof handler === 'function') {
        ++registeredEvents
      }
    }
    scope = filter.controller({})
    expect(registeredEvents).to.be(3)
  })

  it('should be able to match an activity\'s description', function () {
    expect(filter.matchesFilter({ description: "test" })({ description: "write test for Dime" })).to.be.ok()
    expect(filter.matchesFilter({ description: "dime" })({ description: "write test for Dime" })).to.be.ok()
    expect(filter.matchesFilter({ description: "Test" })({ description: "write test for Dime" })).to.be.ok()
    expect(filter.matchesFilter({ description: "Dime" })({ description: "write test for Dime" })).to.be.ok()
  })
})
