'use strict';

(function (dime, m) {

  dime.modules.customer = {
    controller: function () {
      var scope = {};

      return scope;
    },
    view: function() {
      return dime.core.views.list('customer', dime.model.Customer.properties);
    },
    views: {}
  }

  // register route
  dime.routes["/customer"] = dime.modules.customer;

  // register schema
  dime.resources.customer = new Resource({
    url: dime.apiUrl + "customer",
    model: dime.modules.customer.model,
    empty: { name: "", alias: "", enabled: true }
  });
  dime.resources.customer.fetch();

  // add menu item
  dime.menu.filter(function(item) { return item.id=="administration" })[0].children.push({
    id: "customers",
    route: "/customer",
    name: "Customers",
  });
})(dime, m)
