'use strict';

(function (dime, m, _) {

  dime.modules.project.views.select = function (activity) {
    var projects = dime.resources.project.findAll() || [];
    var options = projects.map(function(project) {
      return m("li", m("a", {
        href: "#",
        onclick: function() {
          activity.project = project;
          activity.customer = project.customer;
          dime.resources.activity.persist(activity);
        }
      }, project.name ? project.name : "(/" + project.alias + ")"))
    });
    if (activity.project) {
      options.unshift(
        m("li.current", [
          m("a", {
            href: '#',
            onclick: function() {
              console.log('Editing projects is not yet implemented');
            }
          }, [
            m("span.icon.icon-edit"),
            activity.project.name
          ])
        ])
      );
    }
    return m("ul.context-menu", options);
  }

})(dime, m, _);
