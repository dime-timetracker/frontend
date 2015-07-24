'use strict';

var m = require('mithril');
var forOwn = require('lodash/object/forOwn');
var configuration = require('../lib/configuration');
var form = require('./setting/form');
var headerWithDescription = require('./setting/headerWithDescription');

// views
var buttonView = require('../app/utils/views/button');
var cardView = require('../app/utils/views/card/default');


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

  forOwn(configuration.sections, function (section, key) {
    var children = [];
    forOwn(section, function (values, ckey) {
      var path = key + '/' + ckey;
      children.push(m('p.card-heading', headerWithDescription(path)));

      forOwn(values, function (value, valueKey) {
        children.push(m.component(form, {configItem: value, path: path + '/' + valueKey} ));
      });
    });
    if (children.length > 0) {
      content.push(m('h2.content-sub-heading', headerWithDescription(key)));
      content.push(cardView(children));
    }
  });

  if (scope.dirty.length > 0) {
    content.push(buttonView('button.save', '/settings', undefined, '.icon-done', '.fbtn-green'));
  }

  return m('div', content);
};

module.exports = component;
