'use strict';

var m = require('mithril');
var buildForm = require('../../lib/helper/build/form');
var formView = require('../utils/views/form');
var tile = require('../utils/views/tile');
var toggleButton = require('../utils/components/toggleButton');

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

  options.actions.push(m.component(toggleButton, '.icon-edit', form.show, function (state) {
    form.show = state;
  }));

  if (form.show) {
    options.subs.push(form.items.map(formView));

    var subActions = [];
    options.subs.push(subActions);

    subActions.push(
      m('a.btn.btn-flat', {
        config: m.route,
        href: m.route(),
        onclick: form.remove
      }, m('span.icon.icon-lg.icon-delete'))
    );

    if (form.changed) {
      subActions.push(
        m('a.btn.btn-green.pull-right', {
          config: m.route,
          href: m.route(),
          onclick: form.save
        }, m('span.icon.icon-lg.icon-done'))
      );
    }
  }

  return tile(inner, options);
};

module.exports = component;
