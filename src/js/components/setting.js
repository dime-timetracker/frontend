'use strict';

var m = require('mithril');
var forOwn = require('lodash/object/forOwn');
var configuration = require('../core/configuration');

// views
var card = require('./setting/card');
var buttonView = require('../core/views/button');

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

  return m('div', [content, buttonView('Save', '/settings', undefined, '.icon-done', '.fbtn-green')]);
};

module.exports = component;