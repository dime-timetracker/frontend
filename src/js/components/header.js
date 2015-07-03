'use strict';

var m = require('mithril');
var menu = require('./menu');

var configuration = require('../core/configuration');
configuration.general.children.header = require('./header/config');

function logoView (scope) {
  return m('a[href="#/"].header-logo', [
    m('span.icon.' + scope.icon), ' ', scope.name]
  );
}

var component = {};

component.controller = function () {
  var scope = {
    icon: 'icon-access-time',
    name: 'Dime Timetracker'
  };
  // TODO
  //scope.icon = scope.config.get(scope.config.general.children.customize.children.icon);
  //scope.name = scope.config.get(scope.config.general.children.customize.children.name);
  return scope;
};

component.view = function (scope) {
  var content = [
    m('ul.nav.nav-list.pull-left',
      m('li', m('a[href=#]', {
        onclick: menu.toggle
      }, [
        m('span.access-hide', 'Menu'),
        m('span.icon.icon-menu.icon-lg')
      ]))
    ),
    logoView(scope)
  ];
  var color = 'green';
  // TODO
  //var color = scope.config.get(scope.config.general.children.customize.children.color);
  if (color) {
    color = '.' + color.split(' ').join('.');
  }

  return m('header.header.fixed' + color, content);
};

module.exports = component;
