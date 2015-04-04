"use strict";

(function (dime, m, _) {

  dime.modules.project.views.select = function (activity) {

    var projects = dime.resources.project.findAll() || [];

    var options = projects.map(function(project) {
      return m("li", m("a", {
        href: "#",
        onclick: function() {
          activity.project = project;
          if (project.customer && project.customer.alias) {
            activity.customer = project.customer;
          }
          if (!project.customer || "" == project.customer.alias) {
            activity.project.customer = activity.customer;
          }
          dime.resources.activity.persist(activity);
        }
      }, project.name ? project.name : "(/" + project.alias + ")"))
    });

    var onSave = function (project) {
      setEditable(false);
      activity.project = project;
      dime.resources.activity.persist(activity);
    }

    var inlineForm = function (project) {
      var allowDelete = false;
      return dime.modules.project.views.form(project, allowDelete, onSave);
    }

    activity.project = activity.project || { customer: activity.customer, name: "", alias: "", enabled: true };
    var alias = "activity-" + activity.id;
    var isEditable = function () {
      return dime.modules.setting.local["project/edit-inline/" + alias] || false;
    }
    var setEditable = function (value) {
      dime.modules.setting.local["project/edit-inline/" + alias] = value;
    }

    options.unshift(
      m("li.current", [
        m("a[href=#]", {
          onclick: function() { setEditable(!isEditable()); return false; }
        }, [
          m("span.icon.icon-edit"),
          isEditable() ? "" : activity.project.name
        ]),
        isEditable() ? inlineForm(activity.project) : ""
      ])
    );

    return m("ul.dropdown-menu", options);
  }

})(dime, m, _);
