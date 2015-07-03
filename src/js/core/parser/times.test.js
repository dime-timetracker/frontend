'use strict';

var expect = require('expect.js');
var parseTimes = require('./times');
var moment = require('moment');

var now = moment('2015-07-03T09:12:00');

describe('time parser', function() {

  it('should ignore text without times', function () {
    var input = 'foo ba-r baz';
    var result = parseTimes({ _text: input }, now);
    expect(result).not.to.have.property('timeslices');
    expect(result).to.have.property('_text');
    expect(result._text).to.eql(input);
  });

  describe('should extract times by given start/stop', function () {

    it ('should handle given start and stop', function () {
      var input = 'foo 11:20-17:59 baz';
      var result = parseTimes({ _text: input }, now);
      expect(result).to.have.property('timeslices');
      expect(result.timeslices[0]).to.have.property('startedAt');
      expect(result.timeslices[0]).to.have.property('stoppedAt');
      expect(moment(result.timeslices[0].startedAt)).to.eql(moment('2015-07-03 11:20'));
      expect(moment(result.timeslices[0].stoppedAt)).to.eql(moment('2015-07-03 17:59'));
      expect(result).to.have.property('_text');
      expect(result._text).to.eql('foo  baz');
    });

    it ('should handle given start and stop with overlapping day', function () {
      var input = 'foo 17:20-11:59 baz';
      var result = parseTimes({ _text: input }, now);
      expect(result).to.have.property('timeslices');
      expect(result.timeslices[0]).to.have.property('startedAt');
      expect(result.timeslices[0]).to.have.property('stoppedAt');
      expect(moment(result.timeslices[0].startedAt)).to.eql(moment('2015-07-02 17:20'));
      expect(moment(result.timeslices[0].stoppedAt)).to.eql(moment('2015-07-03 11:59'));
      expect(result).to.have.property('_text');
      expect(result._text).to.eql('foo  baz');
    });

    it ('should handle given stop only', function () {
      var input = 'foo -17:59 baz';
      var result = parseTimes({ _text: input }, now);
      expect(result).to.have.property('timeslices');
      expect(result.timeslices[0]).to.have.property('startedAt');
      expect(result.timeslices[0]).to.have.property('stoppedAt');
      expect(moment(result.timeslices[0].startedAt)).to.eql(moment('2015-07-03 09:12'));
      expect(moment(result.timeslices[0].stoppedAt)).to.eql(moment('2015-07-03 17:59'));
      expect(result).to.have.property('_text');
      expect(result._text).to.eql('foo  baz');
    });

    it ('should handle given stop only with overlapping day', function () {
      var input = 'foo -08:59 baz';
      var result = parseTimes({ _text: input }, now);
      expect(result).to.have.property('timeslices');
      expect(result.timeslices[0]).to.have.property('startedAt');
      expect(result.timeslices[0]).to.have.property('stoppedAt');
      expect(moment(result.timeslices[0].startedAt)).to.eql(moment('2015-07-03 09:12'));
      expect(moment(result.timeslices[0].stoppedAt)).to.eql(moment('2015-07-04 08:59'));
      expect(result).to.have.property('_text');
      expect(result._text).to.eql('foo  baz');
    });

    it ('should handle given start only', function () {
      var input = 'foo 09:09- baz';
      var result = parseTimes({ _text: input }, now);
      expect(result).to.have.property('timeslices');
      expect(result.timeslices[0]).to.have.property('startedAt');
      expect(result.timeslices[0]).to.have.property('stoppedAt');

      expect(moment(result.timeslices[0].startedAt)).to.eql(moment('2015-07-03 09:09'));
      expect(moment(result.timeslices[0].stoppedAt)).to.eql(moment('2015-07-03 09:12'));

      expect(result).to.have.property('_text');
      expect(result._text).to.eql('foo  baz');
    });

    it ('should handle given start only with overlapping day', function () {
      var input = 'foo 09:59- baz';
      var result = parseTimes({ _text: input }, now);
      expect(result).to.have.property('timeslices');
      expect(result.timeslices[0]).to.have.property('startedAt');
      expect(result.timeslices[0]).to.have.property('stoppedAt');

      expect(moment(result.timeslices[0].startedAt)).to.eql(moment('2015-07-02 09:59'));
      expect(moment(result.timeslices[0].stoppedAt)).to.eql(moment('2015-07-03 09:12'));

      expect(result).to.have.property('_text');
      expect(result._text).to.eql('foo  baz');
    });

  });

  describe('should extract times by given duration', function () {
    ['01:30h', '1h 30m', '1,5h'].forEach(function (time) {
      it ('should handle given duration given in format ' + time, function () {
        var input = time + 'foo baz';
        var result = parseTimes({ _text: input }, now);
        expect(result).to.have.property('timeslices');

        expect(moment(result.timeslices[0].startedAt)).to.eql(moment('2015-07-03 07:42'));
        expect(moment(result.timeslices[0].stoppedAt)).to.eql(moment('2015-07-03 09:12'));

        expect(result).to.have.property('_text');
        expect(result._text).to.eql('foo baz');
      });
    });

  });

});
