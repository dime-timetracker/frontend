'use strict';

(function (dime, m) {

  dime.modules.project = {
    controller: function () {
      var scope = {};

      return scope;
    },
    view: function (scope) {
      return dime.modules.crud.views.list('project', [
        {
          key: 'name',
          title: 'name',
          type: 'text'
        },
        {
          key: 'alias',
          title: 'alias',
          type: 'text'
        },
        {
          key: 'rate',
          title: 'rate',
          type: 'number'
        },
        {
          key: 'enabled',
          title: 'enabled',
          type: 'boolean'
        }
      ]);
    },
    views: {}
  }

  // register route
  dime.routes["/project"] = dime.modules.project;

  // register resource
  dime.resources.project = new Resource({
    url: dime.apiUrl + "project",
    model: dime.modules.project.model,
    empty: { name: "", alias: "", enabled: true }
  });
  dime.resources.project.fetch();

  // add menu item
  dime.menu.filter(function(item) { return item.id=="administration" })[0].children.push({
    id: "projects",
    route: "/project",
    name: "Projects",
  });
})(dime, m)
