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

  it('should be running', () => {
    expect(timeslice.running(item)).to.be(true)
  })

  it('should not be running', () => {
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

  describe('should calculate start and end depending on precision', () => {
    let item
    beforeEach(() => {
      item = {
        started_at: '2015-06-22 14:14:35',
        stopped_at: '2015-06-22 14:53:11'
      }
    })
    it('by starting earlier', () => {
      expect(timeslice.duration(item, 10 * 60)).to.eql(40 * 60)
      expect(
        timeslice.startedAt(item, 10 * 60).format('YYYY-MM-DD HH:mm:ss')
      ).to.eql('2015-06-22 14:10:00')
      expect(
        timeslice.stoppedAt(item, 10 * 60).format('YYYY-MM-DD HH:mm:ss')
      ).to.eql('2015-06-22 14:50:00')
    })
    it('by starting later', () => {
      item = {
        started_at: '2015-06-22 14:15:35',
        stopped_at: '2015-06-22 14:54:11'
      }
      expect(timeslice.duration(item, 10 * 60)).to.eql(40 * 60)
      expect(
        timeslice.startedAt(item, 10 * 60).format('YYYY-MM-DD HH:mm:ss')
      ).to.eql('2015-06-22 14:20:00')
      expect(
        timeslice.stoppedAt(item, 10 * 60).format('YYYY-MM-DD HH:mm:ss')
      ).to.eql('2015-06-22 15:00:00')
    })
  })
})
