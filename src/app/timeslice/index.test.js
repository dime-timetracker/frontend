'use strict'

const expect = require('expect.js')
const moment = require('moment')
const timeslice = require('./')

describe('timeslice', () => {
  let item

  beforeEach(() => {
    item = {
      started_at: '2015-06-22 14:23:35'
    }
  })

  it('should not be running', () => {
    expect(timeslice.running(item)).to.be(true)
  })

  it('should be running', () => {
    item.stopped_at = '2015-06-22 16:43:11'
    expect(timeslice.running(item)).to.be(false)
  })

  describe('should calculate timeslice durations', () => {
    it('of stopped timeslice', () => {
      item.stopped_at = '2015-06-22 16:43:10'
      expect(timeslice.duration(item)).to.be(
        2 * 60 * 60 + 20 * 60 - 25
      )
    })

    it('of running timeslice', () => {
      item.stopped_at = undefined
      timeslice.now(moment('2015-06-22 18:43:10'))
      expect(timeslice.duration(item)).to.be(
        4 * 60 * 60 + 20 * 60 - 25
      )
    })
  })
})
