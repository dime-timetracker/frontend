'use strict'

const expect = require('expect.js')
const parseFilterTimes = require('./filterTimes')
const moment = require('moment')

describe('time filter parser', function() {

  it('should ignore text without filter times', function () {
    const input = 'foo ba-r baz'
    const result = parseFilterTimes({ _text: input })
    expect(result).not.to.have.property('filter')
    expect(result).to.have.property('_text')
    expect(result._text).to.eql(input)
  })

  describe('should extract filter times', function () {

    it ('should handle "today" keyword', function () {
      const input = 'foo today baz'
      const result = parseFilterTimes({ _text: input })
      expect(result).to.have.property('filterStart')
      expect(result).not.to.have.property('filterStop')
      expect(result.filterStart).to.eql(moment().startOf('day'))
      expect(result.filterStop).to.be(undefined)
      expect(result).to.have.property('_text')
      expect(result._text).to.eql('foo  baz')
    })

    it ('should handle "yesterday" keyword', function () {
      const input = 'foo yesterday baz'
      const result = parseFilterTimes({ _text: input })
      expect(result).to.have.property('filterStart')
      expect(result).to.have.property('filterStop')
      expect(result.filterStart).to.eql(moment().subtract(1, 'day').startOf('day'))
      expect(result.filterStop).to.eql(moment().subtract(1, 'day').endOf('day'))
      expect(result).to.have.property('_text')
      expect(result._text).to.eql('foo  baz')
    })

    it ('should handle "current week" keyword', function () {
      const input = 'foo current week baz'
      const result = parseFilterTimes({ _text: input })
      expect(result).to.have.property('filterStart')
      expect(result).not.to.have.property('filterStop')
      expect(result.filterStart).to.eql(moment().startOf('week'))
      expect(result).to.have.property('_text')
      expect(result._text).to.eql('foo  baz')
    })

    it ('should handle "last week" keyword', function () {
      const input = 'foo last week baz'
      const result = parseFilterTimes({ _text: input })
      expect(result).to.have.property('filterStart')
      expect(result).to.have.property('filterStop')
      expect(result.filterStart).to.eql(moment().subtract(1, 'week').startOf('week'))
      expect(result.filterStop).to.eql(moment().subtract(1, 'week').endOf('week'))
      expect(result).to.have.property('_text')
      expect(result._text).to.eql('foo  baz')
    })

    it ('should handle "last 4 weeks" keyword', function () {
      const input = 'foo last 4 weeks baz'
      const result = parseFilterTimes({ _text: input })
      expect(result).to.have.property('filterStart')
      expect(result).not.to.have.property('filterStop')
      expect(result.filterStart).to.eql(moment().subtract(4, 'weeks').startOf('day'))
      expect(result).to.have.property('_text')
      expect(result._text).to.eql('foo  baz')
    })

    it ('should handle "current month" keyword', function () {
      const input = 'foo current month baz'
      const result = parseFilterTimes({ _text: input })
      expect(result).to.have.property('filterStart')
      expect(result).not.to.have.property('filterStop')
      expect(result.filterStart).to.eql(moment().startOf('month'))
      expect(result).to.have.property('_text')
      expect(result._text).to.eql('foo  baz')
    })

    it ('should handle "last month" keyword', function () {
      const input = 'foo last month baz'
      const result = parseFilterTimes({ _text: input })
      expect(result).to.have.property('filterStart')
      expect(result).to.have.property('filterStop')
      expect(result.filterStart).to.eql(moment().subtract(1, 'month').startOf('month'))
      expect(result.filterStop).to.eql(moment().subtract(1, 'month').endOf('month'))
      expect(result).to.have.property('_text')
      expect(result._text).to.eql('foo  baz')
    })

    it ('should handle "last 12 months" keyword', function () {
      const input = 'foo last 12 months baz'
      const result = parseFilterTimes({ _text: input })
      expect(result).to.have.property('filterStart')
      expect(result).to.have.property('filterStop')
      expect(result.filterStart).to.eql(moment().subtract(12, 'month').startOf('month'))
      expect(result.filterStop).to.eql(moment().subtract(1, 'month').endOf('month'))
      expect(result).to.have.property('_text')
      expect(result._text).to.eql('foo  baz')
    })

  })

})
