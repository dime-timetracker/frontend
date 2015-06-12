'use strict';

var m = require('mithril');
var t = require('../../translation');

var items = [
  {
    id: 'home',
    route: '/',
    name: 'Activities',
    icon: 'icon-access-time'
  }
];

function itemView (item) {
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
  } else if ('function' === typeof(item.onclick)) {
    menuItem.push(m('a[href=""]', {
      config: m.route,
      onclick: function (e) { dime.states.menu.cycle(); return item.onclick(e); }
    }, text));
  }

  return m('li' + active, menuItem);
}

module.exports = {
  controller: function (scope) {
    console.log('RENDER MENU');
    return scope;
  },
  view: function (scope) {
    return m('nav.menu.' + scope.state, {
      onclick: scope.toggle
    }, m('.menu-scroll', m('.menu-wrap', m('.menu-content',
      m('ul.nav', items.map(itemView))
    ))));
  },
  toggle: function (menu) {
    return function () {
      menu.state = ('open' === menu.state) ? 'closed' : 'open';
      console.log('MENU:', menu);
    };
  }
};
