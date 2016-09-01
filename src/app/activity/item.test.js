'use strict'

const expect = require('expect.js')
const item = require('./item')

describe('activity item', () => {
  let activity = { timeslices: [] }
  function mockApi (willSucceed, onSuccess, onFail) {
    if (typeof onSuccess !== 'function') {
      onSuccess = item => item
    }
    if (typeof onFail !== 'function') {
      onFail = () => {}
    }
    return {
      persist: (item) => {
        const newItem = Object.assign(item, {id: 123456})
        return new Promise((resolve, reject) => {
          willSucceed !== false ? resolve(onSuccess(newItem)) : reject(onFail())
        })
      }
    }
  }

  beforeEach(() => {
    activity.description = 'Testing'
  })

  describe('can be submitted', () => {
    it('if it only has a description', (done) => {
      activity.id = undefined
      item.submit({
        activity: activity,
        activityApi: mockApi(),
        tags: [],
        tagApi: mockApi()
      }).then((savedActivity) => {
        expect(savedActivity).to.eql({
          description: 'Testing',
          id: 123456,
          tags: [],
          timeslices: []
        })
      }).then(() => done(), done)
    })
    it('if it has tags', (done) => {
      activity.id = undefined
      activity.tags = [
        { name: 'newTag' },
        { name: 'existingTag', id: 777 }
      ]
      item.submit({
        activity: activity,
        activityApi: mockApi(),
        tags: [],
        tagApi: mockApi()
      }).then((savedActivity) => {
        expect(savedActivity).to.eql({
          description: 'Testing',
          id: 123456,
          tags: [ 123456, 777 ],
          timeslices: []
        })
      }).then(() => done(), done)
    })
  })
  /*
    activity = { timeslices: [
      { stopped_at: '2015-06-22 14:23:35' },
      { stopped_at: '2015-06-22 14:23:35' },
      { stopped_at: '2015-06-22 14:23:35' }
    ]}
    */
})
