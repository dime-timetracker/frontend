'use strict';

(function (dime, m, _) {

  dime.modules.customer.views.select = function (activity) {

    var customers = dime.resources.customer.findAll() || [];

    var options = customers.map(function(customer) {
      return m("li", m("a", {
        href: "#",
        onclick: function() {
          activity.customer = customer;
          if (activity.project) {
            // reset project after selecting a different customer
            if (activity.project.customer
              && activity.project.customer.alias
              && activity.project.customer.alias !== customer.alias
            ) {
              activity.project = null;
            }
            // assign customer to project, if it has none
            if (activity.customer && "" == activity.project.customer.alias) {
              activity.project.customer = activity.customer;
            }
          }
          dime.resources.activity.persist(activity);
        }
      }, customer.name ? customer.name : "(@" + customer.alias + ")"));
    });

    var onSave = function (customer) {
      setEditable(false);
      activity.customer = customer;
      dime.resources.activity.persist(activity);
    };

    var onCancel = function (customer) {
      setEditable(false);
    }

    var inlineForm = function (customer) {
      var allowDelete = false;
      return dime.modules.crud.views.form(customer, 'customer', dime.model.Customer.properties, allowDelete, onSave, onCancel);
    };

    activity.customer = activity.customer || dime.resources.customer.empty();
    var alias = 'activity-' + activity.id;
    var isEditable = function () {
      return dime.modules.setting.local['customer/edit-inline/' + alias] || false;
    };
    
    var setEditable = function (value) {
      dime.modules.setting.local['customer/edit-inline/' + alias] = value;
    }

    var editButton = m("a[href=#]", {
      onclick: function() { setEditable(true); return false; }
    }, [ m("span.icon.icon-edit"), activity.customer.name ]);

    options.unshift(
      m("li.current", [
        isEditable() ? inlineForm(activity.customer) : editButton
      ])
    );

    return m("ul.dropdown-menu", options);
  }

})(dime, m, _);
