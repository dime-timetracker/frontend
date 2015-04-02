'use strict';

(function (dime, m, _) {


  dime.modules.customer.views.select = function (activity) {

    var customers = dime.resources.customer.findAll() || [];

    var inlineForm = function (customer) {
      var allowDelete = false;
      return dime.modules.customer.views.form(customer, allowDelete);
    }

    var options = customers.map(function(customer) {
      return m("li", m("a", {
        href: "#",
        onclick: function() {
          activity.customer = customer;
          if (activity.project && activity.project.customer.alias !== customer.alias) {
            activity.project = null;
          }
          dime.resources.activity.persist(activity);
        }
      }, customer.name ? customer.name : "(@" + customer.alias + ")"))
    });

    var customer = activity.customer || {};
    var alias = 'activity-' + activity.id;
    var isEditable = function () {
      return dime.modules.setting.local['customer/edit-inline/' + alias] || false;
    }
    var setEditable = function (value) {
      dime.modules.setting.local['customer/edit-inline/' + alias] = value;
    }

    options.unshift(
      m("li.current", [
        m("a[href=#]", {
          onclick: function() { setEditable(!isEditable()); return false; }
        }, [
          m("span.icon.icon-edit"),
          isEditable() ? '' : customer.name
        ]),
        isEditable() ? inlineForm(customer) : ''
      ])
    );

    return m("ul.context-menu", options);
  }

})(dime, m, _);
