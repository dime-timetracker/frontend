'use strict';

(function (dime, document, m) {
  var tag = {
    controller: function () {
      dime.store.get('tags').done(function(tags) {
        m.redraw();
      })
    },
    getUrl: function (id) {
      return dime.apiUrl + dime.schema.tags.url + '/'
        + (_.isObject(id) ? id.id : id);
    },
    create: function() {
      var item = {
        name: document.getElementById("name").value,
        system: document.getElementById("system").value,
      };
      dime.store.add('tags', item);
      dime.store.get('tags').done(function(tags) {
        m.redraw();
      })
    },
    update: function (id) {
      var item = {
        id: id,
        name: document.getElementById("name-" + id).textContent,
        system: document.getElementById("system-" + id).textContent,
        url: tag.getUrl(id)
      };
      dime.store.update('tags', item);
    },
    remove: function (item) {
      var msg = "Do you really want to delete your tag '" + item.name + "'?";
      if (confirm(msg)) {
        dime.store.remove('tags', {url: tag.getUrl(item)})
          .done(function() {
            document.getElementById('tag-' + item.id).remove();
          });
      }
    },
    viewOne: function (item) {
      return m("dl.editable#tag-" + item.id, [
        m("dt.name", "Name"),
        m("dd.name#name-" + item.id, {
          contenteditable: true,
          oninput: function() { tag.update(item.id) },
        }, item.name),
        m("dt.system", "System Tag"),
        m("dd.system#system-" + item.id, {
          contenteditable: true,
          oninput: function() { tag.update(item.id) }
        }, item.value),
        m("input[type=submit].delete", {
          onclick: function() { tag.remove(item) },
          value: 'Delete'
        })
      ]);
    },
    viewAddForm: function() {
      return m("div#new-tag.form", [
        m("label[for=namespace]", 'Namespace'),
        m("input#namespace[type='text'][name='namespace']"),
        m("label[for=name]", 'Name'),
        m("input#name[type='text'][name='name']"),
        m("label[for=system]", 'System Tag'),
        m("select#system[name='system']", [
          m("option[value=0]", "no"),
          m("option[value=1]", "yes")
        ]),
        m("input#add[type='button']", {
          onclick: function () { tag.create() },
          value: "Add"
        }),
      ])
    },
    view: function() {
      var tags = dime.store.findAll('tags') || []
      var list = tags.map(tag.viewOne);
      list.push(tag.viewAddForm());
      return m("div", list);
    }
  }

  // register module
  dime.modules.tag = tag;

  // register route
  dime.routes["/tag"] = tag;

  // register schema
  dime.schema.tags = {url: 'tag'};

  // add menu item
  dime.menu.filter(function(item) { return item.id=="administration" })[0].children.push({
    id: "tags",
    route: "/tag",
    name: "Tags",
    weight: 100
  });
})(dime, document, m)
