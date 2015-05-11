'use strict';

var dime = {};

var test = require('tape').test;
var moment = require('../vendor/moment.js');
var parser = require('./parser.js');

test('Parse string', function(t) {
  test('Parse relations', function(t) {
    var input = 'some @foo /bar :baz description #tag-1 #just_another-tag';
    var result = parser.parse(input);
    t.equal(result.customer.alias, 'foo', 'Found customer "foo"');
    t.equal(result.project.alias, 'bar', 'Found project "bar"');
    t.equal(result.service.alias, 'baz', 'Found service "baz"');
    t.equal(result.tags.toString(), ['tag-1', 'just_another-tag'].toString(), 'Found tags');
    t.equal(result.description, 'some description', 'Resulting description');
    t.end();
  });
  test('Parse relations containing uppercase characters', function(t) {
    var input = 'some @FoO /bAr :baZ description #tAg-1 #just_anoTher-tag';
    var result = parser.parse(input);
    t.equal(result.customer.alias, 'FoO', 'Found customer "FoO"');
    t.equal(result.project.alias, 'bAr', 'Found project "bAr"');
    t.equal(result.service.alias, 'baZ', 'Found service "baZ"');
    t.equal(result.tags.toString(), ['tAg-1', 'just_anoTher-tag'].toString(), 'Found tags');
    t.equal(result.description, 'some description', 'Resulting description');
    t.end();
  });
  test('Parse relations containing aliases with numbers', function(t) {
    var input = 'some @14u /u4me :qa2 14:20-15:05 description #tag-1 #just_another-tag';
    var result = parser.parse(input);
    t.equal(result.customer.alias, '14u', 'Found customer "14u"');
    t.equal(result.project.alias, 'u4me', 'Found project "u4me"');
    t.equal(result.service.alias, 'qa2', 'Found service "qa2"');
    t.equal(result.tags.toString(), ['tag-1', 'just_another-tag'].toString(), 'Found tags');
    t.equal(result.description, 'some description', 'Resulting description');
    t.end();
  });
  test('Parse relations containing aliases with dashes', function(t) {
    var input = 'some @open-source /dime-frontend :open-source description #tag-1 #just_another-tag';
    var result = parser.parse(input);
    t.equal(result.customer.alias, 'open-source', 'Found customer "open-source"');
    t.equal(result.project.alias, 'dime-frontend', 'Found project "dime-frontend"');
    t.equal(result.service.alias, 'open-source', 'Found service "open-source"');
    t.equal(result.tags.toString(), ['tag-1', 'just_another-tag'].toString(), 'Found tags');
    t.equal(result.description, 'some description', 'Resulting description');
    t.end();
  });
  test('Parse relations containing aliases with plus', function(t) {
    var input = 'some @u+me /foo+BAR :test+deploy description #tag+1 #just_another-tag';
    var result = parser.parse(input);
    t.equal(result.customer.alias, 'u+me', 'Found customer "u+me"');
    t.equal(result.project.alias, 'foo+BAR', 'Found project "foo+BAR"');
    t.equal(result.service.alias, 'test+deploy', 'Found service "test+deploy"');
    t.equal(result.tags.toString(), ['tag+1', 'just_another-tag'].toString(), 'Found tags');
    t.equal(result.description, 'some description', 'Resulting description');
    t.end();
  });
  test('Parse relations containing aliases with slash', function(t) {
    var input = 'some @me/private /dime/frontend :js/mithril description #tag/1 #just_another-tag';
    var result = parser.parse(input);
    t.equal(result.customer.alias, 'me/private', 'Found customer "me/private"');
    t.equal(result.project.alias, 'dime/frontend', 'Found project "dime/frontend"');
    t.equal(result.service.alias, 'js/mithril', 'Found service "js/mithril"');
    t.equal(result.tags.toString(), ['tag/1', 'just_another-tag'].toString(), 'Found tags');
    t.equal(result.description, 'some description', 'Resulting description');
    t.end();
  });
  test('Parse relations containing aliases with underscore', function(t) {
    var input = 'some @open_source /dime_frontend :open_source description #tag-1 #just_another-tag';
    var result = parser.parse(input);
    t.equal(result.customer.alias, 'open_source', 'Found customer "open_source"');
    t.equal(result.project.alias, 'dime_frontend', 'Found project "dime_frontend"');
    t.equal(result.service.alias, 'open_source', 'Found service "open_source"');
    t.equal(result.tags.toString(), ['tag-1', 'just_another-tag'].toString(), 'Found tags');
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
