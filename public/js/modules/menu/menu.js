'use strict';

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
 *   route: '/example',
 *   children: [
 *     {id: foo, name: foo},
 *     {id: bar, name: bar},
 *     {id: baz, name: baz, weight: 1},
 *   ]
 * }
 *
 * Order of children will be: bar, foo, baz.
 */

(function (dime, m, _) {

  var t = dime.translate;

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

  dime.modules.menu = {
    controller: function () {

    },
    view: function () {
      return dime.modules.menu.views.list(dime.menu.sort(sort));
    }
  };

  dime.modules.menu.views = {
    item: function (item) {
      var
      t = dime.translate,
      menuItem = [],
      children = (item.children || []).sort(sort),
      visibility = dime.modules.setting.local['menu/visibility/' + item.id] || 0,
      active = (1 === visibility || m.route() === item.route) ? '.active' : '',
      dropdown = '';

      if (item.route) {
        menuItem.push(m('a[href="' + item.route + '"]', {config: m.route}, t(item.name)));
      } else {
        menuItem.push(m('a[href=#].dropdown-toggle', {
          onclick: function() {
            visibility = Math.abs(visibility - 1);
            dime.modules.setting.local['menu/visibility/' + item.id] = visibility;
            return false;
          }
        }, t(item.name)));
      }

      if (children.length > 0) {
        menuItem.push(m('ul.dropdown-menu.white', children.map(dime.modules.menu.views.item)));
        dropdown = '.dropdown';
        if (visibility && 1 === visibility) {
          dropdown += '.open';
        }
      }

      return m('li' + active + dropdown, menuItem);
    },
    list: function (items) {
      return m('ul.nav.nav-list', items.map(this.item));
    }
  };

  dime.menu = [{id: 'administration', name: 'Administration', children: []}];
})(dime, m, _);
