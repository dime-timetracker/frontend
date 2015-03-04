'use strict';

(function (dime, moment, m) {
  var customer = {
    controller: function () {
      dime.store.get('customers').done(function(customers) {
        m.redraw()
      })
    },
    viewOne: function (item) {
      return m("dl", [
        m("dt.name", "Name"),
        m("dd.name", item.name),
        m("dt.alias", "Alias"),
        m("dd.alias", item.alias),
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
})(dime, moment, m)
