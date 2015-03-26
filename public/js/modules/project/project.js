'use strict';

(function (dime, m) {

  dime.modules.project = {
    controller: function () {
      var scope = {};

      return scope;
    },
    view: function (scope) {
    }
  }
  /*
  var project = {
    controller: function () {
      dime.store.get('projects').done(function(projects) {
        m.redraw();
      })
    },
    getUrl: function (id) {
      return dime.apiUrl + dime.schema.projects.url + '/'
        + (_.isObject(id) ? id.id : id);
    },
    create: function() {
      var item = {
        name: document.getElementById("name").value,
        alias: document.getElementById("alias").value,
        rate: document.getElementById("rate").value,
      };
      dime.store.add('projects', item);
      dime.store.get('projects').done(function(projects) {
        m.redraw();
      })
    },
    update: function (id) {
      var item = {
        id: id,
        name: document.getElementById("name-" + id).textContent,
        alias: document.getElementById("alias-" + id).textContent,
        rate: document.getElementById("rate-" + id).textContent,
        url: project.getUrl(id)
      };
      dime.store.update('projects', item);
    },
    remove: function (item) {
      var msg = "Do you really want to delete your project '" + item.name + "'?";
      if (confirm(msg)) {
        dime.store.remove('projects', {url: project.getUrl(item)})
          .done(function() {
            document.getElementById('project-' + item.id).remove();
          });
      }
    },
    viewOne: function (item) {
      var disabled = item.enabled ? '' : '.disabled';
      return m("dl#project-" + item.id + disabled, [
        m("dt.name", "Name"),
        m("dd.name#name-" + item.id, {
          contenteditable: true,
          "data-field": "name",
          oninput: function() { project.update(item.id) },
        }, item.name),
        m("dt.alias", "Alias"),
        m("dd.alias#alias-" + item.id, {
          contenteditable: true,
          oninput: function() { project.update(item.id) }
        }, item.alias),
        m("dt.rate", "Rate"),
        m("dd.rate#rate-" + item.id, {
          contenteditable: true,
          oninput: function() { project.update(item.id) }
        }, item.rate),
        m("dt.enabled", "enabled"),
        m("dd.enabled", [
          m("input[type=checkbox]#enabled-" + item.id, {
            checked: item.enabled,
            onchange: function() { customer.update(item.id) }
          })
        ]),
        m("input[type=submit].delete", {
          onclick: function() { project.remove(item) },
          value: 'Delete'
        })
      ]);
    },
    viewAddForm: function() {
      return m("div#new-project", [
        m("label[for=name]", 'Name'),
        m("input#name[type='text'][name='name']"),
        m("label[for=alias]", 'Alias'),
        m("input#alias[type='text'][name='alias']"),
        m("label[for=rate]", 'Rate'),
        m("input#rate[type='text'][name='rate']"),
        m("input#add[type='button']", {
          onclick: function () { project.create() },
          value: "Add"
        }),
      ])
    },
    view: function() {
      var projects = dime.store.findAll('projects') || []
      var list = projects.map(project.viewOne);
      list.push(project.viewAddForm());
      return m("div", list);
    }
  }
  */

  // register route
  dime.routes["/project"] = dime.modules.project;

  // register resource
  dime.resources.project = new Resource({
    url: dime.apiUrl + "project",
    model: dime.modules.project.model
  });

  // add menu item
  dime.menu.filter(function(item) { return item.id=="administration" })[0].children.push({
    id: "projects",
    route: "/project",
    name: "Projects",
  });
})(dime, m)
