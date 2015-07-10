'use strict';

var m = require('mithril');
var mq = require('mithril-query');

global.window = m.deps({
  dimeDebug: function () {
    return function () {};
  },
});

var expect = require('expect.js');
var filter = require('./filter');

describe('filter', function() {
  var scope;

  // Mousetrap makes use of these
  global.navigator = {};
  global.document = { attachEvent: function () {} };

  beforeEach(function () {
    var parentScope = {};
    scope = filter.controller(parentScope);
  });

  it('should render icon views', function() {
    var localScope = scope;
    var renderedViewsCount = 0;
    localScope.iconViews = [
      function () { ++renderedViewsCount; },
      function () { ++renderedViewsCount; },
      function () { ++renderedViewsCount; },
      function () { ++renderedViewsCount; },
    ];
    localScope.inputView = function () {};

    var out = mq(filter.view(localScope));
    expect(out.has('.icon')).to.be.ok();
    expect(renderedViewsCount).to.be(4);
  });

  it('should register a shortcut', function () {
    var registeredEvents = 0;
    // Mousetrap binds 3 events per shortcut
    global.document.attachEvent = function (e, handler) {
      if (-1 < ['onkeypress', 'onkeydown', 'onkeyup'].indexOf(e) && 'function' === typeof handler) {
        ++registeredEvents;
      }
    };
    scope = filter.controller({});
    expect(registeredEvents).to.be(3);
  });
});
