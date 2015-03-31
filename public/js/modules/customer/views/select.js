'use strict';

(function (dime, m, _) {


  dime.modules.customer.views.select = function (activity) {
    var customers = dime.resources.customer.findAll() || [];
    return m("ul.context-menu", [
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
      ]),
      customers.map(function(customer) {
        return m("li", m("a", {
          href: "#",
          onclick: function() {
            console.log('Changing customers is not yet implemented');
          }
        }, customer.name ? customer.name : "(@" + customer.alias + ")"))
      })
    ]);
  }

})(dime, m, _);
