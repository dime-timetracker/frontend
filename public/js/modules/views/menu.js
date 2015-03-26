'use strict';

/**
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
 *   name: "This is an example item",
 *   route: "/example",
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
      var children = (item.children || []).sort(sort);
      var menuItem = [];

      if (item.route) {
        menuItem.push(m("a[href='" + item.route + "']", {config: m.route}, item.name));
      } else {
        menuItem.push(m("a[href='#']", item.name));
      }

      if (children.length) {
        menuItem.push(m("ul", children.map(dime.views.menu.item)));
      }

      return m("li", menuItem);
    },
    list: function (items) {
      return m("ul.nav.nav-list", items.map(this.item));
    }
  };

  dime.menu = [{id: "administration", name: "Administration", children: []}];
})(dime, m, _);
