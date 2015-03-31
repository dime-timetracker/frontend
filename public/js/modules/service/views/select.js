'use strict';

(function (dime, m, _) {

  dime.modules.service.views.select = function (activity) {
    var services = dime.resources.service.findAll() || [];
    var options = services.map(function(service) {
      return m("li", m("a", {
        href: "#",
        onclick: function() {
          activity.service = service;
          dime.resources.activity.persist(activity);
        }
      }, service.name ? service.name : "(:" + service.alias + ")"))
    });
    if (activity.service) {
      options.unshift(
        m("li.current", [
          m("a", {
            href: '#',
            onclick: function() {
              console.log('Editing services is not yet implemented');
            }
          }, [
            m("span.icon.icon-edit"),
            activity.service.name
          ])
        ])
      );
    }
    return m("ul.context-menu", options);
  }

})(dime, m, _);
