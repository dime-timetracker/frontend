'use strict';

var expect = require('expect.js');
var parseFilterTimes = require('./filterTimes');
var moment = require('moment');

describe('time filter parser', function() {

  it('should ignore text without filter times', function () {
    var input = 'foo ba-r baz';
    var result = parseFilterTimes({ _text: input });
    expect(result).not.to.have.property('filter');
    expect(result).to.have.property('_text');
    expect(result._text).to.eql(input);
  });

  describe('should extract filter times', function () {

    it ('should handle "today" keyword', function () {
      var input = 'foo today baz';
      var result = parseFilterTimes({ _text: input });
      expect(result).to.have.property('filter');
      expect(result.filter).to.have.property('start');
      expect(result.filter).to.have.property('stop');
      expect(result.filter.start).to.eql(moment().startOf('day'));
      expect(result.filter.stop).to.be(undefined);
      expect(result).to.have.property('_text');
      expect(result._text).to.eql('foo  baz');
    });

    it ('should handle "yesterday" keyword', function () {
      var input = 'foo yesterday baz';
      var result = parseFilterTimes({ _text: input });
      expect(result).to.have.property('filter');
      expect(result.filter).to.have.property('start');
      expect(result.filter).to.have.property('stop');
      expect(result.filter.start).to.eql(moment().subtract(1, 'day').startOf('day'));
      expect(result.filter.stop).to.eql(moment().subtract(1, 'day').endOf('day'));
      expect(result).to.have.property('_text');
      expect(result._text).to.eql('foo  baz');
    });

    it ('should handle "current week" keyword', function () {
      var input = 'foo current week baz';
      var result = parseFilterTimes({ _text: input });
      expect(result).to.have.property('filter');
      expect(result.filter).to.have.property('start');
      expect(result.filter).to.have.property('stop');
      expect(result.filter.start).to.eql(moment().startOf('week'));
      expect(result.filter.stop).to.be(undefined);
      expect(result).to.have.property('_text');
      expect(result._text).to.eql('foo  baz');
    });

    it ('should handle "last week" keyword', function () {
      var input = 'foo last week baz';
      var result = parseFilterTimes({ _text: input });
      expect(result).to.have.property('filter');
      expect(result.filter).to.have.property('start');
      expect(result.filter).to.have.property('stop');
      expect(result.filter.start).to.eql(moment().subtract(1, 'week').startOf('week'));
      expect(result.filter.stop).to.eql(moment().subtract(1, 'week').endOf('week'));
      expect(result).to.have.property('_text');
      expect(result._text).to.eql('foo  baz');
    });

    it ('should handle "last 4 weeks" keyword', function () {
      var input = 'foo last 4 weeks baz';
      var result = parseFilterTimes({ _text: input });
      expect(result).to.have.property('filter');
      expect(result.filter).to.have.property('start');
      expect(result.filter).to.have.property('stop');
      expect(result.filter.start).to.eql(moment().subtract(4, 'weeks').startOf('day'));
      expect(result.filter.stop).to.be(undefined);
      expect(result).to.have.property('_text');
      expect(result._text).to.eql('foo  baz');
    });

    it ('should handle "current month" keyword', function () {
      var input = 'foo current month baz';
      var result = parseFilterTimes({ _text: input });
      expect(result).to.have.property('filter');
      expect(result.filter).to.have.property('start');
      expect(result.filter).to.have.property('stop');
      expect(result.filter.start).to.eql(moment().startOf('month'));
      expect(result.filter.stop).to.be(undefined);
      expect(result).to.have.property('_text');
      expect(result._text).to.eql('foo  baz');
    });

    it ('should handle "last month" keyword', function () {
      var input = 'foo last month baz';
      var result = parseFilterTimes({ _text: input });
      expect(result).to.have.property('filter');
      expect(result.filter).to.have.property('start');
      expect(result.filter).to.have.property('stop');
      expect(result.filter.start).to.eql(moment().subtract(1, 'month').startOf('month'));
      expect(result.filter.stop).to.eql(moment().subtract(1, 'month').endOf('month'));
      expect(result).to.have.property('_text');
      expect(result._text).to.eql('foo  baz');
    });

  });

});
