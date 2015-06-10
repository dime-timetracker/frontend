'use strict';

var m = require('mithril');
var menuButton = require('./menu/headerButton');

var logo = function (scope) {
  return m('a[href="#/"].header-logo', [
    m('span.icon.' + scope.icon), ' ', scope.name]
  );
};

module.exports = {
  controller: function (appScope) {
    var scope = {
      appScope: appScope,
      config: appScope.config,
      icon: 'icon-access-time',
      name: 'Dime Timetracker'
    };
    // TODO
    //scope.icon = scope.config.get(scope.config.general.children.customize.children.icon);
    //scope.name = scope.config.get(scope.config.general.children.customize.children.name);
    return scope;
  },
  view: function (scope) {
    var content = [
      m.component(menuButton, scope.appScope),
      logo(scope)
    ];
    var color = 'green';
    // TODO
    //var color = scope.config.get(scope.config.general.children.customize.children.color);
    if (color) {
      color = '.' + color.split(' ').join('.');
    }

    return m('header.header.fixed' + color, content);
  }
};
