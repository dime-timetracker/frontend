'use strict';

var dime = {};

var test = require('tape').test;
var moment = require('../moment.js');
var parser = require('./parser.js');

test('Parse string', function(t) {
  test('Parse relations', function(t) {
    var input = 'some @foo /bar :baz description';
    var result = parser.parse(input);
    t.equal(result.customer.alias, 'foo', 'Found customer "foo"');
    t.equal(result.project.alias, 'bar', 'Found project "bar"');
    t.equal(result.service.alias, 'baz', 'Found service "baz"');
    t.equal(result.description, 'some description', 'Resulting description');
    t.end();
  });
  test('Parse dates and durations', function(t) {
    [
      {
        input: 'some description 12:30-17:23',
        from: moment().format('YYYY-MM-DD ') + '12:30',
        to: moment().format('YYYY-MM-DD ') + '17:23',
      },
      {
        input: 'some description 02:30',
        from: moment().subtract(150, 'minutes').format('YYYY-MM-DD HH:mm'),
        to: moment().format('YYYY-MM-DD HH:mm')
      },
      {
        input: 'some description -00:03',
        from: moment().format('YYYY-MM-DD HH:mm'),
        to: moment().add(1, 'day').hours(0).minutes(3).format('YYYY-MM-DD HH:mm'),
      },
      {
        input: 'some description 02:30h',
        from: moment().subtract(150, 'minutes').format('YYYY-MM-DD HH:mm'),
        to: moment().format('YYYY-MM-DD HH:mm')
      },
      {
        input: 'some description -00:03h',
        from: moment().format('YYYY-MM-DD HH:mm'),
        to: moment().add(1, 'day').hours(0).minutes(3).format('YYYY-MM-DD HH:mm'),
      },
      {
        input: 'some description 02h 30m',
        from: moment().subtract(150, 'minutes').format('YYYY-MM-DD HH:mm'),
        to: moment().format('YYYY-MM-DD HH:mm')
      },
      {
        input: 'some description 2,5h',
        from: moment().subtract(150, 'minutes').format('YYYY-MM-DD HH:mm'),
        to: moment().format('YYYY-MM-DD HH:mm')
      },
    /*
      {
        input: 'some description -2.5h',
        from: moment().subtract(150, 'minutes').format('YYYY-MM-DD HH:mm'),
        to: null
      },
      {
        input: 'some description -30m',
        from: moment().subtract(30, 'minutes').format('YYYY-MM-DD HH:mm:ss'),
        to: null
      },
      // */
    ].forEach(function (expectation) {
      test('Parsing "' + expectation.input + '"', function(t) {
        var result = parser.parse(expectation.input);
        t.equal(
          result.startedAt,
          expectation.from,
          'Resulting start ' + expectation.from
        );
        t.equal(
          result.stoppedAt,
          expectation.to,
          'Resulting end ' + expectation.to
        );
        t.equal(result.description, 'some description', 'Resulting description');
        t.end();
      });
    });
    t.end();
  });
  t.end();
})
