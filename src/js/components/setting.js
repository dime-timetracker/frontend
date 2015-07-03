'use strict';

var m = require('mithril');
var forOwn = require('lodash/object/forOwn');
var configuration = require('../core/configuration');

var card = require('./setting/card');

var component = {};

component.controller = function () {
  var scope = {};

  return scope;
};

component.view = function (scope) {
  var content = [];

  forOwn(configuration, function (value) {
    content.push(card(value));
  });

  return m('div', content);
};

module.exports = component;