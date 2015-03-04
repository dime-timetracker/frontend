'use strict';

/**
 * Menu items consist of an id and a name.
 * Additionally, they may have an array of children.
 * To manipulate sorting of children, items may specify a weight,
 * otherwise, they'll be sorted alphabetically by name.
 *
 * example item:
 *
 * {
 *   id: example,
 *   name: "This is an example item",
 *   children: [
 *     {id: foo, name: foo},
 *     {id: bar, name: bar},
 *     {id: baz, name: baz, weight: 1},
 *   ]
 * }
 *
 * Order of children will be: bar, foo, baz.
 */

(function (dime, m) {
  var menu = {
    viewItem: function (item) {
      return m("ul", [
        m("li#" + item.id + (m.route() == item.route ? ".active" : ""),
          item.route
            ? m("a[href='" + item.route + "']", {config: m.route}, item.name)
            : item.name
        ),
        (item.children || []).sort(menu.sort).map(menu.viewItem),
      ]);
    },
    sort: function (a, b) {
      var weightA = _.isNumber(a.weight) ? a.weight : 0;
      var weightB = _.isNumber(b.weight) ? b.weight : 0;
      if (weightA == weightB) {
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
    },
    view: function (items) {
      return dime.menu.map(this.viewItem);
    }
  }

  dime.modules.menu = menu;
  dime.menu = [{id: "administration", name: "Administration", children: []}];
})(dime, m)
