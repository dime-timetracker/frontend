'use strict';

(function (dime, m, _) {


  dime.modules.customer.views.select = function (activity) {
    var customers = dime.resources.customer.findAll() || [];
    var options = customers.map(function(customer) {
      return m("li", m("a", {
        href: "#",
        onclick: function() {
          activity.customer = customer;
          if (activity.project.customer.alias !== customer.alias) {
            activity.project = null;
          }
          dime.resources.activity.persist(activity);
        }
      }, customer.name ? customer.name : "(@" + customer.alias + ")"))
    });
    if (activity.customer) {
      options.unshift(
        m("li.current", [
          m("a", {
            href: '#',
            onclick: function() {
              console.log('Editing customers is not yet implemented');
            }
          }, [
            m("span.icon.icon-edit"),
            activity.customer.name
          ])
        ])
      );
    }
    return m("ul.context-menu", options);
  }

})(dime, m, _);
