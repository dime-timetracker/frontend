'use strict';

(function (dime, m, _) {

  dime.modules.project.views.select = function (activity) {

    var projects = dime.resources.project.findAll() || [];

    var inlineForm = function (project) {
      var allowDelete = false;
      return dime.modules.project.views.form(project, allowDelete);
    }

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

    var project = activity.project || {};
    var alias = 'activity-' + activity.id;
    var isEditable = function () {
      return dime.modules.setting.local['project/edit-inline/' + alias] || false;
    }
    var setEditable = function (value) {
      dime.modules.setting.local['project/edit-inline/' + alias] = value;
    }

    options.unshift(
      m("li.current", [
        m("a[href=#]", {
          onclick: function() { setEditable(!isEditable()); return false; }
        }, [
          m("span.icon.icon-edit"),
          isEditable() ? '' : project.name
        ]),
        isEditable() ? inlineForm(project) : ''
      ])
    );

    return m("ul.context-menu", options);
  }

})(dime, m, _);
