'use strict';

(function (dime, document, m) {
  var customer = {
    controller: function () {
      dime.store.get('customers').done(function(customers) {
        m.redraw();
      })
    },
    getUrl: function (id) {
      return dime.apiUrl + dime.schema.customers.url + '/'
        + (_.isObject(id) ? id.id : id);
    },
    create: function() {
      var item = {
        name: document.getElementById("name").value,
        alias: document.getElementById("alias").value,
      };
      dime.store.add('customers', item);
      dime.store.get('customers').done(function(customers) {
        m.redraw();
      })
    },
    update: function (id) {
      var item = {
        id: id,
        name: document.getElementById("name-" + id).textContent,
        alias: document.getElementById("alias-" + id).textContent,
        url: customer.getUrl(id)
      };
      dime.store.update('customers', item);
    },
    remove: function (item) {
      var msg = "Do you really want to delete your customer '" + item.name + "'?";
      if (confirm(msg)) {
        dime.store.remove('customers', {url: customer.getUrl(item)})
          .done(function() {
            document.getElementById('customer-' + item.id).remove();
          });
      }
    },
    viewOne: function (item) {
      var disabled = item.enabled ? '' : '.disabled';
      return m("dl#customer-" + item.id + disabled, [
        m("dt.name", "Name"),
        m("dd.name#name-" + item.id, {
          contenteditable: true,
          "data-field": "name",
          oninput: function() { customer.update(item.id) },
        }, item.name),
        m("dt.alias", "Alias"),
        m("dd.alias#alias-" + item.id, {
          contenteditable: true,
          oninput: function() { customer.update(item.id) }
        }, item.alias),
        m("dt.enabled", "enabled"),
        m("dd.enabled", [
          m("input[type=checkbox]#enabled-" + item.id, {
            checked: item.enabled,
            onchange: function() { customer.update(item.id) }
          })
        ]),
        m("input[type=submit].delete", {
          onclick: function() { customer.remove(item) },
          value: 'Delete'
        })
      ]);
    },
    viewAddForm: function() {
      return m("div#new-customer", [
        m("label[for=name]", 'Name'),
        m("input#name[type='text'][name='name']"),
        m("label[for=alias]", 'Alias'),
        m("input#alias[type='text'][name='alias']"),
        m("input#add[type='button']", {
          onclick: function () { customer.create() },
          value: "Add"
        }),
      ])
    },
    view: function() {
      var customers = dime.store.findAll('customers') || []
      var list = customers.map(customer.viewOne);
      list.push(customer.viewAddForm());
      return m("div", list);
    }
  }

  // register module
  dime.modules.customer = customer;

  // register route
  dime.routes["/customer"] = customer;

  // register schema
  dime.schema.customers = {url: 'customer'};

  // add menu item
  dime.menu.filter(function(item) { return item.id=="administration" })[0].children.push({
    id: "customers",
    route: "/customer",
    name: "Customers",
  });
})(dime, document, m)
