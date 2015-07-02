'use strict';

var m = require('mithril');
var mq = require('mithril-query');

global.window = m.deps({
  dimeDebug: function () {}
});

var expect = require('expect.js');
var filter = require('./filter');

describe('filter', function() {
  var scope;

  beforeEach(function () {
    var parentScope = {};
    scope = filter.controller(parentScope);
  });

  it('should have an update function', function () {
    expect(scope).to.have.property('onUpdateFilter');
    expect(scope.onUpdateFilter).to.be.a('function');
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
});
