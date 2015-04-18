'use strict';

(function (dime, m) {

  dime.modules.service = {
    controller: function () {
      var scope = {};

      return scope;
    },
    view: function (scope) {
      return dime.modules.crud.views.list('service', dime.model.Service.properties);
    },
    views: {}
  }

  // register route
  dime.routes["/service"] = dime.modules.service;

  // register schema
  dime.resources.service = new Resource({
    url: dime.apiUrl + "service",
    model: dime.modules.service.model,
    empty: { name: "", alias: "", enabled: true }
  });
  dime.resources.service.fetch();

  // add menu item
  dime.menu.filter(function(item) { return item.id=="administration" })[0].children.push({
    id: "services",
    route: "/service",
    name: "Services",
  });
})(dime, m)
