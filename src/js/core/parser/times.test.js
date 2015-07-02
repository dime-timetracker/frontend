'use strict';

var expect = require('expect.js');
var parseTimes = require('./times');
var moment = require('moment');

describe('time parser', function() {

  it('should ignore text without times', function () {
    var input = 'foo ba-r baz';
    var result = parseTimes({ _text: input });
    expect(result).not.to.have.property('timeslices');
    expect(result).to.have.property('_text');
    expect(result._text).to.eql(input);
  });

  describe('should extract times by given start/stop', function () {

    it ('should handle given start and stop', function () {
      var input = 'foo 11:20-17:59 baz';
      var result = parseTimes({ _text: input });
      expect(result).to.have.property('timeslices');
      expect(result.timeslices[0]).to.have.property('startedAt');
      expect(result.timeslices[0]).to.have.property('stoppedAt');
      expect(moment(result.timeslices[0].startedAt).hour()).to.eql(11);
      expect(moment(result.timeslices[0].startedAt).minute()).to.eql(20);
      expect(moment(result.timeslices[0].stoppedAt).hour()).to.eql(17);
      expect(moment(result.timeslices[0].stoppedAt).minute()).to.eql(59);
      expect(result).to.have.property('_text');
      expect(result._text).to.eql('foo  baz');
    });

    it ('should handle given stop only', function () {
      var input = 'foo -17:59 baz';
      var result = parseTimes({ _text: input });
      expect(result).to.have.property('timeslices');
      expect(result.timeslices[0]).to.have.property('startedAt');
      expect(result.timeslices[0]).to.have.property('stoppedAt');
      expect(moment(result.timeslices[0].startedAt).hour()).to.eql(moment().hour());
      expect(moment(result.timeslices[0].startedAt).minute()).to.eql(moment().minute());
      expect(moment(result.timeslices[0].stoppedAt).hour()).to.eql(17);
      expect(moment(result.timeslices[0].stoppedAt).minute()).to.eql(59);
      expect(result).to.have.property('_text');
      expect(result._text).to.eql('foo  baz');
    });

    it ('should handle given start only', function () {
      var input = 'foo 09:59- baz';
      var result = parseTimes({ _text: input });
      expect(result).to.have.property('timeslices');
      expect(result.timeslices[0]).to.have.property('startedAt');
      expect(result.timeslices[0]).to.have.property('stoppedAt');
      expect(moment(result.timeslices[0].startedAt).hour()).to.eql(9);
      expect(moment(result.timeslices[0].startedAt).minute()).to.eql(59);
      expect(moment(result.timeslices[0].stoppedAt).hour()).to.eql(moment().hour());
      expect(moment(result.timeslices[0].stoppedAt).minute()).to.eql(moment().minute());
      expect(result).to.have.property('_text');
      expect(result._text).to.eql('foo  baz');
    });

  });

  describe('should extract times by given duration', function () {
    ['01:30h', '1h 30m', '1,5h'].forEach(function (time) {
      it ('should handle given duration given in format ' + time, function () {
        var input = time + 'foo baz';
        var result = parseTimes({ _text: input });
        expect(result).to.have.property('timeslices');
        expect(result.timeslices[0]).to.have.property('startedAt');
        expect(result.timeslices[0]).to.have.property('stoppedAt');
        var startedAt = moment(result.timeslices[0].startedAt);
        expect(startedAt.hour()).to.eql(moment().subtract(1, 'hours').hour());
        expect(startedAt.minute()).to.eql(moment().subtract(30, 'minutes').minute());
        var stoppedAt = moment(result.timeslices[0].stoppedAt);
        expect(stoppedAt.hour()).to.eql(moment().hour());
        expect(stoppedAt.minute()).to.eql(moment().minute());

        expect(result).to.have.property('_text');
        expect(result._text).to.eql('foo baz');
      });
    });


  });

});
