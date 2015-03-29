'use strict';

(function (dime, m) {

  dime.modules.service = {
    controller: function () {
      var scope = {};

      return scope;
    },
    view: function (scope) {
    },
    views: {}
  }
  /*
  var service = {
    controller: function () {
      dime.store.get('services').done(function(services) {
        m.redraw();
      })
    },
    getUrl: function (id) {
      return dime.apiUrl + dime.schema.services.url + '/'
        + (_.isObject(id) ? id.id : id);
    },
    create: function() {
      var item = {
        name: document.getElementById("name").value,
        alias: document.getElementById("alias").value,
        rate: document.getElementById("rate").value,
      };
      dime.store.add('services', item);
      dime.store.get('services').done(function(services) {
        m.redraw();
      })
    },
    update: function (id) {
      var item = {
        id: id,
        name: document.getElementById("name-" + id).textContent,
        alias: document.getElementById("alias-" + id).textContent,
        rate: document.getElementById("rate-" + id).textContent,
        url: service.getUrl(id)
      };
      dime.store.update('services', item);
    },
    remove: function (item) {
      var msg = "Do you really want to delete your service '" + item.name + "'?";
      if (confirm(msg)) {
        dime.store.remove('services', {url: service.getUrl(item)})
          .done(function() {
            document.getElementById('service-' + item.id).remove();
          });
      }
    },
    viewOne: function (item) {
      return m("dl#service-" + item.id, [
        m("dt.name", "Name"),
        m("dd.name#name-" + item.id, {
          contenteditable: true,
          "data-field": "name",
          oninput: function() { service.update(item.id) },
        }, item.name),
        m("dt.alias", "Alias"),
        m("dd.alias#alias-" + item.id, {
          contenteditable: true,
          oninput: function() { service.update(item.id) }
        }, item.alias),
        m("dt.rate", "Rate"),
        m("dd.rate#rate-" + item.id, {
          contenteditable: true,
          oninput: function() { service.update(item.id) }
        }, item.rate),
        m("input[type=submit].delete", {
          onclick: function() { service.remove(item) },
          value: 'Delete'
        })
      ]);
    },
    viewAddForm: function() {
      return m("div#new-service", [
        m("label[for=name]", 'Name'),
        m("input#name[type='text'][name='name']"),
        m("label[for=alias]", 'Alias'),
        m("input#alias[type='text'][name='alias']"),
        m("label[for=rate]", 'Rate'),
        m("input#rate[type='text'][name='rate']"),
        m("input#add[type='button']", {
          onclick: function () { service.create() },
          value: "Add"
        }),
      ])
    },
    view: function() {
      var services = dime.store.findAll('services') || []
      var list = services.map(service.viewOne);
      list.push(service.viewAddForm());
      return m("div", list);
    }
  }

  // register module
  dime.modules.service = service;
  */

  // register route
  dime.routes["/service"] = dime.modules.service;

  // register schema
  dime.resources.service = new Resource({
    url: dime.apiUrl + "service",
    model: dime.modules.service.model
  });

  // add menu item
  dime.menu.filter(function(item) { return item.id=="administration" })[0].children.push({
    id: "services",
    route: "/service",
    name: "Services",
  });
})(dime, m)
