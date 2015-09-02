'use strict';

var expect = require('expect.js');

var Timeslices = require('./Timeslices');

describe('Timeslice collection', function () {
  var running = {
    uuid: '630fc563-1937-4c9b-8334-1a4199027282',
    startedAt: '2015-07-28 18:30:00',
    duration: 0,
    stoppedAt: null
  };
  var ts = new Timeslices([
    {startedAt: '2015-07-28 18:15:00', stoppedAt: '2015-07-28 18:20:00'},
    running
  ]);

  it('should have 2 timeslices', function () {
    expect(ts.length).to.be(2);
  });

  it('should have running timeslice', function () {
    expect(ts.hasRunning()).to.be(true);
  });

  it('should have running timeslice equal with defined one', function () {
    expect(ts.findRunningTimeslice().uuid).to.be(running.uuid);
  });
});
