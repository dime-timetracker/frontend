'use strict';

(function (dime, m, _) {

  var create = function() {
    var item = {
      name: document.getElementById("name").value,
      alias: document.getElementById("alias").value,
    };
    dime.store.add('customers', item);
    dime.store.get('customers').done(function(customers) {
      m.redraw();
    })
  };

  dime.modules.customer.views.select = function (activity) {
    return m("ul.context-menu.hide", [
      m("li", [
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
    ]);
  }
})(dime, m, _);
