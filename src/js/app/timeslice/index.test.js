'use strict'

const expect = require('expect.js')
const timeslice = require('./')

describe('timeslice', () => {
  let item

  beforeEach(() => {
    item = {
      startedAt: '2015-06-22 14:23:35'
    }
  })

  it('should not be running', () => {
    expect(timeslice.running(item)).to.be(true)
  })

  it('should be running', () => {
    item.stoppedAt = '2015-06-22 16:43:11'
    expect(timeslice.running(item)).to.be(false)
  })
})
