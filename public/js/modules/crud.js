;(function (dime, m) {
  'use strict';

  var module = dime.modules.crud = {};

  module.allowed = ['customer', 'project', 'service'];

  module.controller = function () {
    var scope = {};

    var type = m.route.param('name');
    if (module.allowed.indexOf(type) > -1) {
      scope.type = type;
      scope.modelName = dime.helper.format.ucFirst(type);
      scope.properties = dime.model[scope.modelName].properties;
      scope.resource = dime.resources[type];
      scope.add = function (e) {
         scope.resource.persist(scope.resource.create());
         return false;
      };
    } else {
      m.route('/');
    }

    return scope;
  };

  module.view = function(scope) {
    return [ dime.core.views.list(scope.type, scope.properties), dime.core.views.button('Add ' + scope.type, '/' + scope.type, scope.add)];
  };

  dime.routes["/:name"] = dime.modules.crud;

  // register customer
  dime.resources.customer = new dime.Collection({
    url: "customer",
    model: dime.model.Customer
  });
  dime.menu.push({
    id: "customers",
    route: "/customer",
    name: "Customers",
    icon: 'icon-people',
    weight: 0
  });

  // register project
  dime.resources.project = new dime.Collection({
    url: "project",
    model: dime.model.Project
  });
  dime.menu.push({
    id: "projects",
    route: "/project",
    name: "Projects",
    icon: 'icon-poll',
    weight: 0
  });

  // register service
  dime.resources.service = new dime.Collection({
    url: "service",
    model: dime.model.Service
  });
  dime.menu.push({
    id: "services",
    route: "/service",
    name: "Services",
    icon: 'icon-work',
    weight: 0
  });
  
  // resource fetch
  dime.resources.customer.fetch();
  dime.resources.project.fetch();
  dime.resources.service.fetch();

})(dime, m);
