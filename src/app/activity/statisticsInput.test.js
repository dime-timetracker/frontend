'use strict'

const input = require('./statisticsInput')
const m = require('src/lib/mithril')
const mq = require('mithril-query')

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

describe('statisticsInput', () => {
  const exampleStatistics = [
    {
      aggregator: 'timeslices.reduce((result, row) => result + row.duration, 0)',
      filter: 'today',
      formatValue: '"" + (Math.round(value/360)/10) + " h"',
      label: 'my today\'s work',
      target: 8 * 3600
    }, {
      aggregator: 'timeslices.reduce((result, row) => result + row.duration, 0)',
      filter: 'current month',
      formatValue: '"" + Math.round(value/3600) + " h"',
      label: 'my current month\'s work',
      target: 120 * 3600
    }
  ]

  beforeEach(() => {
  })

  describe('provides an Add action', () => {
    it('if it is empty', () => {
      const out = mq(input({}))
      out.should.have('button.item-add')
    })
    it('if there are some statistics', () => {
      const out = mq(input({}, exampleStatistics))
      out.should.have(2, '.statisticsItem')
      out.should.have('button.item-add')
    })
  })

  describe('renders all fields', () => {
    it('renders filter', () => {
      const out = mq(input({}, [exampleStatistics[0]]))
      out.should.have(1, '.statisticsItem')
      out.should.have(1, '.statisticsItem label.item-filter input')
      out.should.have(1, '.statisticsItem label.item-filter input[value="today"]')
    })
    it('renders target', () => {
      const out = mq(input({}, [exampleStatistics[0]]))
      out.should.have(1, '.statisticsItem')
      out.should.have(1, '.statisticsItem label.item-target input')
      out.should.have(1, '.statisticsItem label.item-target input[value="28800"]')
    })
    it('renders label', () => {
      const out = mq(input({}, [exampleStatistics[0]]))
      out.should.have(1, '.statisticsItem')
      out.should.have(1, '.statisticsItem label.item-label input')
      out.should.have(1, '.statisticsItem label.item-label input[value="my today\'s work"]')
    })
    it('renders aggregator as a code editor', () => {
      const out = mq(input({}, [exampleStatistics[0]]))
      out.should.have(1, '.statisticsItem')
      out.should.have(1, '.statisticsItem label.item-aggregator textarea')
    })
    it('renders formatter as a code editor', () => {
      const out = mq(input({}, [exampleStatistics[0]]))
      out.should.have(1, '.statisticsItem')
      out.should.have(1, '.statisticsItem label.item-formatter textarea')
    })
    it('provides a Remove action for every item', () => {
      const out = mq(input({}, [exampleStatistics[0]]))
      out.should.have(1, '.statisticsItem button.item-remove')
    })
  })

})
