;(function (dime, m) {
  'use strict';

  var module = dime.modules.crud = {};

  module.allowed = ['customer', 'project', 'service'];

  module.controller = function () {
    var scope = {};

    var type = m.route.param('name');
    if (-1 === module.allowed.indexOf(type)) {
      m.route('/');
    }

    scope.type = type;
    scope.modelName = dime.helper.format.ucFirst(type);
    scope.properties = dime.model[scope.modelName].properties;
    scope.resource = dime.resources[type];
    scope.add = function (e) {
       scope.resource.add({});
       return false;
    };

    return scope;
  };
  
  module.view = function(scope) {
    var items = dime.resources[scope.type] || [];

    var headers = scope.properties().map(function(property) {
      var options = property.options || {};
      return m('th', options, t(property.title));
    });
    headers.push(
      m('th.empty')
    );

    var header = m('thead', m('tr', headers));
    dime.events.emit('core-' + scope.type + '-list-header-view-after', {
      properties: scope.properties(),
      type: scope.type,
      view: header
    });

    var rows = m('tbody', items.map(function (item) {
      return module.views.tableItem(item, scope.type, scope.properties(item));
    }));

    var list = [
      m('h2', t(scope.type + 's')),
      m('table.table.table-stripe.table-hover', [header, rows])
    ];
    dime.events.emit('core-' + scope.type + '-list-view-after', {
      properties: scope.properties(),
      type: scope.type,
      view: list
    });

    return m('div.list-' + scope.type, [list, dime.core.views.button('Add ' + scope.type, '/' + scope.type, scope.add)]);
  };

  module.views = {};

  dime.routes["/:name"] = dime.modules.crud;

  var naturalSort = function (a, b) {
    var a = a.name || a.alias || a.id;
    var b = b.name || b.alias || b.id;

    for (var x = 0, aa, bb; (aa = a[x]) && (bb = b[x]); x++) {
        aa = aa.toLowerCase();
        bb = bb.toLowerCase();
        if (aa !== bb) {
          var c = Number(aa), d = Number(bb);
          if (c == aa && d == bb) {
            return c - d;
          } else {
            return (aa > bb) ? 1 : -1;
          }
      }
    }
    return a.length - b.length;
  };

  // register customer
  dime.resources.customer = new dime.Collection({
    resourceUrl: "customer",
    model: dime.model.Customer,
    sort: naturalSort
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
    resourceUrl: "project",
    model: dime.model.Project,
    sort: naturalSort
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
    resourceUrl: "service",
    model: dime.model.Service,
    sort: naturalSort
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
