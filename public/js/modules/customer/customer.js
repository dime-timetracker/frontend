'use strict';

(function (dime, document, m) {

  dime.modules.customer = {
    controller: function () {
      var scope = {};

      return scope;
    },
    view: function() {
      var customers = dime.resources.customer.findAll() || [];
      var list = [m('h2', 'Customers')].concat(
        m('table.bordered.responsive-table', [
          m("thead",
            m("tr", [
              m("th", "Name"),
              m("th", "Alias"),
              m("th.text-center", "Enabled"),
              m("th.text-right", m(
                "a.btn.btn-flat", {
                  href: "#",
                  onclick: function() {
                    console.log('not yet implemented');
                    return false;
                  }
                }, m("span.icon.icon-add")
              ))
            ])
          ),
          customers.map(dime.modules.customer.views.item)
        ])
      );
      return m("div", list);
    },
    views: {}
    /*
    getUrl: function (id) {
      return dime.apiUrl + dime.schema.customers.url + '/'
        + (_.isObject(id) ? id.id : id);
    },
    create: function() {
      var item = {
        name: document.getElementById("name").value,
        alias: document.getElementById("alias").value,
      };
      dime.store.add('customers', item);
      dime.store.get('customers').done(function(customers) {
        m.redraw();
      })
    },
    update: function (id) {
      var item = {
        id: id,
        name: document.getElementById("name-" + id).textContent,
        alias: document.getElementById("alias-" + id).textContent,
        url: customer.getUrl(id)
      };
      dime.store.update('customers', item);
    },
    remove: function (item) {
      var msg = "Do you really want to delete your customer '" + item.name + "'?";
      if (confirm(msg)) {
        dime.store.remove('customers', {url: customer.getUrl(item)})
          .done(function() {
            document.getElementById('customer-' + item.id).remove();
          });
      }
    },
    viewAddForm: function() {
      return m("div#new-customer", [
        m("label[for=name]", 'Name'),
        m("input#name[type='text'][name='name']"),
        m("label[for=alias]", 'Alias'),
        m("input#alias[type='text'][name='alias']"),
        m("input#add[type='button']", {
          onclick: function () { customer.create() },
          value: "Add"
        }),
      ])
    },
    */
  }

  // register route
  dime.routes["/customer"] = dime.modules.customer;

  // register schema
  dime.resources.customer = new Resource({
    url: dime.apiUrl + "customer",
    model: dime.modules.customer.model
  });

  // add menu item
  dime.menu.filter(function(item) { return item.id=="administration" })[0].children.push({
    id: "customers",
    route: "/customer",
    name: "Customers",
  });
})(dime, document, m)
