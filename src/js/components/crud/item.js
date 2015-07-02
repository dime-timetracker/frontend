'use strict';

var m = require('mithril');
var _ = require('lodash');
var t = require('../../translation');
var form = {
  input: require('../../core/views/form/input'),
  select: require('../../core/views/form/select'),
  selectBoolean: require('../../core/views/form/selectBoolean')
};

var component = {};

component.controller = function (collection, properties, item) {
  var scope = {};

  scope.collection = collection;
  scope.item = item;
  scope.changed = false;
  scope.columns = properties.map(function (property) {
    var model = {};
    var type = property.type || 'text';

    model.key = property.key;
    model.value = function() {
      return item[property.key];
    };
    model.type = type;
    switch (type) {
      case 'boolean': 
        model.action = function (e) {
          var idx = e.target.selectedIndex;
          var value = e.target.options[idx].value;

          item[property.key] = value;
          scope.changed = true;
        };
        break;
      case 'relation':
        model.values = function () {
          var result = [];
          _.forOwn(property.collection, function (value, key) {
            result.push({
              'key': value.alias,
              'value': value.name || value.alias
            });
          });
          return result;
        };

        model.action = function (e) {
          var idx = e.target.selectedIndex;
          var key = e.target.options[idx].value;

          item[property.key] = property.collection.find({
            'alias': key
          });
          scope.changed = true;
        };
        break;
      default:
        model.action = function (e) {
          item[property.key] = e.target.value;
          scope.changed = true;
        };
    }

    return model;
  });

  scope.save = function (e) {
    if (e) e.preventDefault();
    scope.changed = false;
    collection.persist(item);
  };

  scope.remove = function (e) {
    var question = t('Do you really want to delete "[name]"?').replace('[name]', item.name);
    if (global.window.confirm(question)) {
      collection.remove(item);
      scope.changed = false;
    }
  };

  return scope;
};

component.view = function (scope) {
  var columns = scope.columns.map(function (model) {
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
    m("a.btn.btn-flat[href=#]", { onclick: scope.remove }, m("span.icon.icon-delete"))
  ];
  
  if (scope.changed) {
    actions.push(m("a.btn.btn-yellow[href=#]", { onclick: scope.save }, m("span.icon.icon-done")));
  }
  columns.push( m("td.empty", actions));

  return m('tr', columns);
};

module.exports = component;