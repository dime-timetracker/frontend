'use strict';

var expect = require('expect.js');

var Timeslice = require('./Timeslice');

describe('Timeslice model', function () {
  var ts = new Timeslice({startedAt: '2015-07-28 18:30:00', stoppedAt: '2015-07-28 18:40:00' });

  it('should has a start and an end ', function() {
    expect(ts.getStart().format('YYYY-MM-DD HH:mm:ss')).to.be('2015-07-28 18:30:00');
    expect(ts.getEnd().format('YYYY-MM-DD HH:mm:ss')).to.be('2015-07-28 18:40:00');
  });

  it('should be the same day', function () {
    expect(ts.isSameDay()).to.be(true);
  });

  it('should not running', function () {
    expect(ts.isRunning()).to.be(false);
  });

  it('should have a duration', function () {
    expect(ts.calculateDuration()).to.be(600);
  });
});

describe('Running timeslice model', function () {
  var running = {startedAt: '2015-07-28 18:30:00', stoppedAt: null };
  var ts = new Timeslice(running);

  it('should isRunning be true', function () {
    expect(ts.getStart().format('YYYY-MM-DD HH:mm:ss')).to.be('2015-07-28 18:30:00');
    expect(ts.isRunning()).to.be(true);
  });
});
