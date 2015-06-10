'use strict';

var m = require('mithril');

var items = [
  {
    id: 'home',
    route: '/',
    name: 'Activities',
    icon: 'icon-access-time'
  }
];

var renderItem = function (item) {
  var menuItem = [];
  var text = [];
  var active = (m.route() === item.route) ? '.active' : '';

  if (item.icon) {
    text.push(m('span.icon.' + item.icon));
  }
  if (item.name) {
    text.push(t(item.name));
  }
  if (item.route) {
    menuItem.push(m('a[href="' + item.route + '"]', {
      onclick: function (e) { dime.states.menu.cycle(); },
      config: m.route
    }, text));
  } else if (_.isFunction(item.onclick)) {
    menuItem.push(m('a[href=""]', {
      config: m.route,
      onclick: function (e) { dime.states.menu.cycle(); return item.onclick(e); }
    }, text));
  }

  return m('li' + active, menuItem);
};

module.exports = {
  controller: function (appScope) {
    var scope = {};
    scope.state = appScope.menuState || 'closed';
    scope.toggleState = function () {
      scope.state = 'open' === scope.state ? 'closed' : 'open';
    }
    return scope;
  },
  view: function (scope) {
    return m('nav.menu.' + scope.state, {
      onclick: scope.toggleState,
      onmouseleave: function(e) { scope.state = 'closed' },
      onmouseenter: function(e) { scope.state = 'open' }
    }, m('.menu-scroll', m('.menu-wrap', m('.menu-content',
      m('ul.nav', items.map(renderItem))
    ))));
  }
}
