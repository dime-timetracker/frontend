'use strict';

(function (dime, document, m) {
  var customer = {
    controller: function () {
      dime.store.get('customers').done(function(customers) {
        m.redraw()
      })
    },
    update: function(id) {
      var item = {
        id: id,
        name: document.getElementById("name-" + id).textContent,
        alias: document.getElementById("alias-" + id).textContent,
        url: dime.apiUrl + dime.schema.customers.url + '/' + id
      };
      dime.store.update('customers', item);
    },
    viewOne: function (item) {
      return m("dl#customer-" + item.id, [
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
      ]);
    },
    view: function() {
      var customers = dime.store.findAll('customers') || []
      return m("div", customers.map(customer.viewOne))
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
