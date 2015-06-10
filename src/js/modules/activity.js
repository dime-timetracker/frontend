'use strict';

var m = require('mithril');
var body = require('../body');

module.exports = {
  controller: function () {
    var scope = {};
    return scope;
  },
  view: function (scope) {
    return body(m('.foo', 'bar'), scope);
  }
}
