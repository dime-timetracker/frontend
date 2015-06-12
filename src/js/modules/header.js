'use strict';

var m = require('mithril');
var menu = require('./header/menu');
var menuButton = require('./header/menuButton');

function logoView (scope) {
  return m('a[href="#/"].header-logo', [
    m('span.icon.' + scope.icon), ' ', scope.name]
  );
}

module.exports = {
  controller: function (appScope) {
    var scope = {
      menu: {
        state: 'closed',
      },
      config: appScope.config,
      icon: 'icon-access-time',
      name: 'Dime Timetracker'
    };
    scope.menu.toggle = menu.toggle(scope.menu);
    // TODO
    //scope.icon = scope.config.get(scope.config.general.children.customize.children.icon);
    //scope.name = scope.config.get(scope.config.general.children.customize.children.name);
    return scope;
  },
  view: function (scope) {
    var content = [
      m.component(menuButton, scope.menu),
      logoView(scope)
    ];
    var color = 'green';
    // TODO
    //var color = scope.config.get(scope.config.general.children.customize.children.color);
    if (color) {
      color = '.' + color.split(' ').join('.');
    }

    return m('div', [
      m('header.header.fixed' + color, content),
      m('#app-menu', m.component(menu, scope.menu))
    ]);
  }
};
