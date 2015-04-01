'use strict';

(function (dime, _, m) {

  dime.modules.setting = {
    controller: function () {
      var scope = {};

      return scope;
    },
    view: function() {
      var settings = dime.resources.setting.findAll() || [];
      var list = [m('h2', 'Settings')].concat(
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
    views: {},
  }

  var getSetting = function (namespace, name) {
    var filter = { namespace: namespace, name: name };
    return dime.resources.setting.find(filter) || filter;
  }

  dime.modules.setting.get = function (namespace, name, defaultValue) {
    var setting = getSetting(namespace, name);
    if (false === _.isUndefined(setting.value)) {
      return setting.value;
    }
    return (_.isUndefined(defaultValue)) ? null : defaultValue;
  };

  dime.modules.setting.setLocally = function (namespace, name, value) {
    getSetting(namespace, name).value = value;
  };

  dime.modules.setting.set = function (namespace, name, value) {
    var setting = getSetting(namespace, name);
    setting.value = value;
    dime.resources.setting.persist(setting);
  };

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
})(dime, _, m)
