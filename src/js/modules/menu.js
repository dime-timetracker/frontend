'use strict';

var m = require('mithril');
var t = require('../translation');

var state = 'close';
var items = [
  {
    id: 'home',
    route: '/',
    name: 'Activities',
    icon: 'icon-access-time'
  }
];

function itemView(item) {
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
      onclick: function (e) {
        component.toggle();
      },
      config: m.route
    }, text));
  } else if ('function' === typeof (item.onclick)) {
    menuItem.push(m('a[href=""]', {
      config: m.route,
      onclick: function (e) {
        component.toggle();
        return item.onclick(e);
      }
    }, text));
  }

  return m('li' + active, menuItem);
}

var component = {};

component.view = function (scope) {
  return m('nav.menu.' + state, {
    onclick: scope.toggle
  }, m('.menu-scroll', m('.menu-wrap', m('.menu-content', m('ul.nav', items.map(itemView))))));
};

component.toggle = function () {
  state = ('open' === state) ? 'close' : 'open';
};

module.exports = component;
