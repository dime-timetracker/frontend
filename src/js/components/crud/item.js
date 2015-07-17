'use strict';

var m = require('mithril');
var buildForm = require('../../core/helper/build/form');

var form = {
  input: require('../../core/views/form/input'),
  select: require('../../core/views/form/select'),
  selectBoolean: require('../../core/views/form/selectBoolean')
};

var component = {};

component.controller = function(item, collection) {
  var scope = {
    form: buildForm(item, collection)
  };
  return scope;
};

component.view = function(scope) {
  var columns = scope.form.items.map(function(model) {
    var input;

    switch (model.type) {
      case 'boolean':
        input = form.selectBoolean(model.value(), model.action);
        break;
      case 'relation':
        input = form.select(model.values(), model.action, model.value().alias);
        break;
      default:
        input = form.input(model.value(), model.action, model.type);
    }

    return m('td.' + model.key, input);
  });

  var actions = [
    m('a.btn.btn-flat', {
      config: m.route,
      href: m.route(),
      onclick: scope.form.remove
    }, m('span.icon.icon-delete'))
  ];

  if (scope.changed) {
    actions.push(m('a.btn.btn-yellow', {
      config: m.route,
      href: m.route(),
      onclick: scope.form.save
    }, m('span.icon.icon-done')));
  }
  columns.push(m('td.empty', actions));

  return m('tr', columns);
};

module.exports = component;
