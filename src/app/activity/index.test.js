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
const assignRelated = require('./').assignRelated

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

  describe('should assign related items', () => {
    let savedItem
    const api = {
      persist: (item) => {
        return new Promise(function (resolve) {
          savedItem = item
          resolve(item)
        })
      }
    }
    function ask (question) {
      return true
    }
    it('and create new ones', (done) => {
      activity.foo = { alias: 'new' }
      const collection = [{ alias: 'old' }]
      assignRelated('foo', api, collection, ask)(activity).then(() => {
        try {
          expect(collection).to.eql([
            { alias: 'old' },
            { alias: 'new' }
          ])
          expect(savedItem).to.eql({ alias: 'new' })
          done()
        } catch (e) {
          done(e)
        }
      })
    })
    it('without re-creating existing ones', (done) => {
      savedItem = undefined
      activity.foo = { alias: 'old' }
      const collection = [{ alias: 'old' }]
      assignRelated('foo', api, collection, ask)(activity).then(() => {
        try {
          expect(collection).to.eql([
            { alias: 'old' }
          ])
          expect(savedItem).to.be(undefined)
          done()
        } catch (e) {
          done(e)
        }
      })
    })
  })
})
