'use strict';

(function (dime, m) {
  var menu = {
    viewItem: function (item) {
      return m("ul", [
        m("li#" + item.id + (m.route() == item.route ? ".active" : ""),
          item.route
            ? m("a[href='" + item.route + "']", {config: m.route}, item.name)
            : item.name
        ),
        (item.children || []).map(menu.viewItem),
      ]);
    },
    view: function (items) {
      return dime.menu.map(this.viewItem);
    }
  }

  dime.modules.menu = menu;
  dime.menu = [{id: "administration", name: "Administration", children: []}];
})(dime, m)
