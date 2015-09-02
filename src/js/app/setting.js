'use strict';

var m = require('mithril');
var forOwn = require('lodash/object/forOwn');
var configuration = require('../lib/configuration');
var form = require('./setting/form');
var headerWithDescription = require('./setting/headerWithDescription');

// views
var buttonView = require('../app/utils/views/button');
var cardView = require('../app/utils/views/card/default');

function controller () {
  var scope = {};

  scope.save = function (e) {

  };

  return scope;
}

function view (scope) {
  var content = [];

  // collection of sections
  forOwn(configuration, function (sections, key) {
    var children = [];

    // section
    forOwn(sections, function (properties, ckey) {
      var path = key + '/' + ckey;
      children.push(m('p.card-heading', headerWithDescription(path)));

      // properties in sections
      forOwn(properties, function (property, propertyKey) {
        children.push(m.component(form, {
          key: 'form-' + path,
          path: path + '/' + propertyKey,
          property: property
        }));
      });
    });
    if (children.length > 0) {
      content.push(m('h2.content-sub-heading', headerWithDescription(key)));
      content.push(cardView(children));
    }
  });

  if (configuration.isDirty()) {
    content.push(buttonView('button.save', '/settings', scope.save, '.icon-done', '.fbtn-green'));
  }

  return m('div', content);
}

module.exports = {
  controller: controller,
  view: view
};
