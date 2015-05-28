/*
 * Menu items consist of an id and a name.
 * Additionally, they may have an array of children.
 * Specifying a route turns the item into a link.
 * To manipulate sorting of children, items may specify a weight,
 * otherwise, they'll be sorted alphabetically by name.
 *
 * example item:
 *
 * {
 *   id: example,
 *   name: 'This is an example item',
 *   route: '/example'
 * }
 *
 * Order of children will be: bar, foo, baz.
 */

;(function (dime, m, _) {
  'use strict';
  
  dime.menu = [{
    id: 'home',
    route: '/',
    name: 'Activities',
    icon: 'icon-access-time',
    weight: 0
  }];

  var module = dime.modules.menu = {};
  var sort = function (a, b) {
    var weightA = _.isNumber(a.weight) ? a.weight : 0;
    var weightB = _.isNumber(b.weight) ? b.weight : 0;
    if (weightA === weightB) {
      weightA = a.name;
      weightB = b.name;
    }
    if (weightA > weightB) {
      return 1;
    }
    if (weightA < weightB) {
      return -1;
    }
    return 0;
  };
  
  module.controller = function () {
    var scope = {};
    
    scope.items = dime.menu.sort(sort);
    dime.configuration.getLocal('menu/visibility', false);

    dime.events.emit('menu-before-view', scope);

    return scope;
  };

  module.view = function (scope) {
    var open = '';
    if (dime.configuration.getLocal('menu/visibility')) {
      open = '.open';
    }
    return m('nav.menu' + open, m('.menu-scroll', m('.menu-wrap', m('.menu-content', module.views.list(scope.items)))));
  };

  module.views = {
    menuBtn: function (scope) {
      return m('ul.nav.nav-list.pull-left', m('li', m('a[href=#].menu-toggle', { onclick: function (e) {
          e.preventDefault();
          dime.configuration.setLocal('menu/visibility', !dime.configuration.getLocal('menu/visibility', false));
     }}, [
        m('span.access-hide', 'Menu'),
        m('span.icon.icon-menu'),
        m('span.icon.icon-close.header-close')
      ])));
    },
    list: function (items) {
      return m('ul.nav', items.map(this.item));
    },
    item: function (item) {
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
        menuItem.push(m('a[href="' + item.route + '"]', {config: m.route}, text));
      } else if (_.isFunction(item.onclick)) {
        menuItem.push(m('a[href=""]', {config: m.route, onclick: item.onclick}, text));
      }

      return m('li' + active, menuItem);
    }
  };

  dime.events.on('header-before-view', function (scope) {
    scope.views.unshift(module.views.menuBtn);
  });
  
})(dime, m, _);
