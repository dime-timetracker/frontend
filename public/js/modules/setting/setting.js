'use strict';

(function (dime, m) {

  dime.modules.setting = {
    controller: function () {
      var scope = {};

      return scope;
    },
    view: function() {
      var settings = dime.resources.setting.findAll() || [];
      var list = [m('h2', 'settings')].concat(
        m('table.bordered.responsive-table', [
          m("thead",
            m("tr", [
              m("th", "Namespace"),
              m("th", "Name"),
              m("th", "Value")
            ])
          ),
          settings.map(dime.modules.setting.views.item)
        ]),
        dime.modules.setting.view.form
      );
      return m("div", list);
    },
    views: {}
  }

  // register route
  dime.routes["/setting"] = dime.modules.setting;

  // register schema
  dime.resources.setting = new Resource({
    url: dime.apiUrl + "setting",
    model: dime.modules.setting.model
  });

  // add menu item
  dime.menu.filter(function(item) { return item.id=="administration" })[0].children.push({
    id: "settings",
    route: "/setting",
    name: "Settings",
    weight: 100
  });
})(dime, m)