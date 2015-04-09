'use strict';

(function (dime, _, m) {

  dime.modules.setting = {
    controller: function () {
      var scope = {};

      return scope;
    },
    view: function() {

      var list = [m('h2', 'Settings')];

      /**
       * Configuration object pattern:
       *
       * {
       *   foo: {
       *     title: "Tab Foo",
       *     weight: 0
       *     children: {
       *       bar: {
       *         title: "Section Bar",
       *         weight: 0
       *         children: {
       *           baz: {
       *             title: "Item Baz",
       *             description: "Foo bar baz",
       *             onRead: function(value, namespace, name) {},
       *             onWrite: function(value, oldValue, namespace, name) {},
       *             default: "Default value",
       *             display: function(namespace, name) { return true; },
       *             type: "number"
       *           }
       *         }
       *       }
       *     }
       *   },
       *   boo: {...}
       * }
       */

      var tabs = Object.keys(dime.settings);

      var tabList = [];
      tabs.map(function (key) {
        tabList.push(dime.modules.setting.views.tab(
          dime.settings[key],
          key===tabs[0]
        ))
      });
      list.push(m('div.tabs', tabList));

      list.push(dime.modules.setting.views.tabContents(dime.settings[tabs[0]]));

      if ('1' == getSetting('config', 'settings/view/all')) {
        var settings = dime.resources.setting.findAll() || [];
        list.concat(
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
      }
      return m("div", list);

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

  dime.settings = {};

  dime.modules.setting.set = function (namespace, name, value) {
    var setting = getSetting(namespace, name);
    setting.value = value;
    dime.resources.setting.persist(setting);
  };

  // transient store for temporary settings
  dime.modules.setting.local = {};

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
