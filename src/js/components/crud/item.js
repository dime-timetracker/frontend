'use strict';

var m = require('mithril');
var t = require('../../translation');
var buildForm = require('../../core/helper/build/form');

var tile = require('../../core/views/tile');
var formViews = {
  group: require('../../core/views/form/group'),
  input: require('../../core/views/form/input'),
  select: require('../../core/views/form/select'),
  selectBoolean: require('../../core/views/form/selectBoolean')
};

var component = {};

component.controller = function(item, collection) {
  return buildForm(item, collection);
};

component.view = function(form) {
  var inner = [
    form.model.name
  ];
  if (form.model.alias) {
    inner.push(m('span.badge', form.model.shortcut + form.model.alias));
  }

  var options = {
    active: (form.show) ? true : false,
    actions: [],
    subs: []
  };

  options.actions.push(m('a.btn.btn-flat', {
    onclick: function (e) {
      if (e) {
        e.preventDefault();
      }
      form.show = (form.show) ? false : true;
    }
  }, m('span.icon.icon-edit.icon-lg')));

  if (form.show) {
    options.subs.push(form.items.map(function(model) {
      var input;

      switch (model.type) {
        case 'boolean':
          input = formViews.selectBoolean(model.value(), model.action);
          break;
        case 'relation':
          input = formViews.select(model.values(), model.action, model.value().alias);
          break;
        default:
          input = formViews.input(model.value(), model.action, model.type);
      }

      return formViews.group(input, t(model.key));
    }));

    var subActions = [];
    options.subs.push(subActions);

    subActions.push(
      m('a.btn.btn-flat', {
        config: m.route,
        href: m.route(),
        onclick: form.remove
      }, m('span.icon.icon-delete'))
    );

    if (form.changed) {
      subActions.push(
        m('a.btn.btn-green.pull-right', {
          config: m.route,
          href: m.route(),
          onclick: form.save
        }, m('span.icon.icon-done'))
      );
    }
  }

  return tile(inner, options);
};

module.exports = component;
