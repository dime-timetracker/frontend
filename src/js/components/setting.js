'use strict';

var m = require('mithril');
var forOwn = require('lodash/object/forOwn');
var configuration = require('../core/configuration');
var form = require('./setting/form');
var headerWithDescription = require('./setting/headerWithDescription');

// views
var buttonView = require('../core/views/button');
var cardView = require('../core/views/card');


var component = {};

component.controller = function () {
  var scope = {};

  scope.dirty = [];
  scope.save = function (e) {
    scope.dirty.forEach(function (config) {

    });
  };

  return scope;
};

component.view = function (scope) {
  var content = [];

  forOwn(configuration, function (section) {
    // sections
    var children = [];
    forOwn(section.children, function (value, ckey) {
      children.push(m('p.card-heading', headerWithDescription(value)));

      forOwn(value.children, function (v) {
        children.push(m.component(form, v));
      });
    });
    if (children.length > 0) {
      content.push(m('h2.content-sub-heading', headerWithDescription(section)));
      content.push(cardView(children));
    }
  });

  if (scope.dirty.length > 0) {
    content.push(buttonView('Save', '/settings', undefined, '.icon-done', '.fbtn-green'));
  }

  return m('div', content);
};

module.exports = component;