'use strict';

(function (dime, m, _) {

  dime.modules.project.views.select = function (activity) {
    var projects = dime.resources.project.findAll() || [];
    return m("ul.context-menu", [
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
      ]),
      projects.map(function(project) {
        return m("li", m("a", {
          href: "#",
          onclick: function() {
            activity.project = project;
            dime.resources.activity.persist(activity);
          }
        }, project.name ? project.name : "(/" + project.alias + ")"))
      })
    ]);
  }

})(dime, m, _);
