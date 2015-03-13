'use strict';

(function (dime, document, m) {
  var setting = {
    controller: function () {
      dime.store.get('settings').done(function(settings) {
        m.redraw();
      })
    },
    getUrl: function (id) {
      return dime.apiUrl + dime.schema.settings.url + '/'
        + (_.isObject(id) ? id.id : id);
    },
    create: function() {
      var item = {
        namespace: document.getElementById("namespace").value,
        name: document.getElementById("name").value,
        value: document.getElementById("value").value,
      };
      dime.store.add('settings', item);
      dime.store.get('settings').done(function(settings) {
        m.redraw();
      })
    },
    update: function (id) {
      var item = {
        id: id,
        namespace: document.getElementById("namespace-" + id).textContent,
        name: document.getElementById("name-" + id).textContent,
        value: document.getElementById("value-" + id).textContent,
        url: setting.getUrl(id)
      };
      dime.store.update('settings', item);
    },
    remove: function (item) {
      var msg = "Do you really want to delete your setting '" + item.name + "'?";
      if (confirm(msg)) {
        dime.store.remove('settings', {url: setting.getUrl(item)})
          .done(function() {
            document.getElementById('setting-' + item.id).remove();
          });
      }
    },
    viewOne: function (item) {
      return m("dl.editable#setting-" + item.id, [
        m("dt.namespace", "Namespace"),
        m("dd.namespace#namespace-" + item.id, {
          contenteditable: true,
          oninput: function() { setting.update(item.id) },
        }, item.namespace),
        m("dt.name", "Name"),
        m("dd.name#name-" + item.id, {
          contenteditable: true,
          oninput: function() { setting.update(item.id) },
        }, item.name),
        m("dt.value", "Value"),
        m("dd.value#value-" + item.id, {
          contenteditable: true,
          oninput: function() { setting.update(item.id) }
        }, item.value),
        m("input[type=submit].delete", {
          onclick: function() { setting.remove(item) },
          value: 'Delete'
        })
      ]);
    },
    viewAddForm: function() {
      return m("div#new-setting.form", [
        m("label[for=namespace]", 'Namespace'),
        m("input#namespace[type='text'][name='namespace']"),
        m("label[for=name]", 'Name'),
        m("input#name[type='text'][name='name']"),
        m("label[for=value]", 'Value'),
        m("input#value[type='text'][name='value']"),
        m("input#add[type='button']", {
          onclick: function () { setting.create() },
          value: "Add"
        }),
      ])
    },
    view: function() {
      var settings = dime.store.findAll('settings') || []
      var list = settings.map(setting.viewOne);
      list.push(setting.viewAddForm());
      return m("div", list);
    }
  }

  // register module
  dime.modules.setting = setting;

  // register route
  dime.routes["/setting"] = setting;

  // register schema
  dime.schema.settings = {url: 'setting'};

  // add menu item
  dime.menu.filter(function(item) { return item.id=="administration" })[0].children.push({
    id: "settings",
    route: "/setting",
    name: "Settings",
    weight: 100
  });
})(dime, document, m)
