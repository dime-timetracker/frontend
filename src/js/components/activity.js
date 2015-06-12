'use strict';

var m = require('mithril');

module.exports = {
  controller: function () {
    var scope = {};
    return scope;
  },
  view: function (scope) {
    return m('.foo', 'bar');
  }
}
