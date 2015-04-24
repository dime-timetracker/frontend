;(function (dime, m) {
  'use strict';

  var module = dime.modules.crud = {};

  module.allowed = ['customer', 'project', 'service'];

  module.controller = function () {
    var scope = {};

    var type = m.route.param('name');
    if (module.allowed.indexOf(type) > -1) {
      scope.type = type;
      scope.properties = dime.model[dime.helper.format.ucFirst(type)].properties;
    } else {
      m.route('/');
    }
    
    return scope;
  };
  
  module.view = function(scope) {
    return dime.core.views.list(scope.type, scope.properties);
  };

  dime.routes["/:name"] = dime.modules.crud;

  // register customer
  dime.resources.customer = new Resource({
    url: dime.apiUrl + "customer",
    model: dime.model.Customer
  });
  dime.menu.push({
    id: "customers",
    route: "/customer",
    name: "Customers",
    weight: 0
  });

  // register project
  dime.resources.project = new Resource({
    url: dime.apiUrl + "project",
    model: dime.model.Project,
    fail: dime.modules.login.redirect,
    success: dime.modules.login.success
  });
  dime.menu.push({
    id: "projects",
    route: "/project",
    name: "Projects",
    weight: 0
  });

  // register service
  dime.resources.service = new Resource({
    url: dime.apiUrl + "service",
    model: dime.model.Service
  });
  dime.menu.push({
    id: "services",
    route: "/service",
    name: "Services",
    weight: 0
  });
  
  // resource fetch
  dime.resources.customer.fetch();
  dime.resources.project.fetch();
  dime.resources.service.fetch();

})(dime, m);
