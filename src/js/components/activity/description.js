'use strict';

var m = require('mithril');
var _ = require('lodash');

var relations = ['customer', 'project', 'service'];

var component = {};

/**
 * Split text on space and readd spaces to array
 */
var splitDescription = function (description) {
  description = description.split(' ');
  var result = [];

  // re-add spaces
  for (var i = 0; i < description.length; i++) {
    if (i > 0) {
      result.push(' ');
    }
    result.push(description[i]);
  }
  return result;
}

component.controller = function (model) {
  var scope = {};

  scope.description = function () {
    var description = splitDescription(model.description);

    // replace alias
    var added = [];
    for (var i = 0; i < relations.length; i++) {
      var relation = relations[i];
      if (model[relation]) {
        var alias = model[relation].shortcut + model[relation].alias;
        var idx = description.indexOf(alias);
        if (idx > -1) {
          description[idx] = m('a[href=#]', alias);
          added.push(relation);
        }
      }
    }

    // add missing aliases at the end
    var diff = _.difference(relations, added);
    for (var i = 0; i < diff.length; i++) {
      var relation = diff[i];
      if (model[relation]) {
        description.push(' ');
        description.push(m('a[href=#]', model[relation].shortcut + model[relation].alias));
      }
    }

    return description;
  };

  return scope;
};

component.view = function (scope) {
  return m('span', { contenteditable: true }, scope.description());
};

module.exports = component;
