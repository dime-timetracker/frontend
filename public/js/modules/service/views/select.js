'use strict';

(function (dime, m, _) {

  dime.modules.service.views.select = function (activity) {

    var services = dime.resources.service.findAll() || [];

    var options = services.map(function (service) {
      return m("li", m("a", {
        href: "#",
        onclick: function() {
          activity.service = service;
          dime.resources.activity.persist(activity);
        }
      }, service.name ? service.name : "(:" + service.alias + ")"))
    });

    activity.service = activity.service || { name: "", alias: "", enabled: true };
    var alias = 'activity-' + activity.id;
    var isEditable = function () {
      return dime.modules.setting.local['service/edit-inline/' + alias] || false;
    }
    var setEditable = function (value) {
      dime.modules.setting.local['service/edit-inline/' + alias] = value;
    }

    var onSave = function (service) {
      setEditable(false);
      activity.service = service;
      dime.resources.activity.persist(activity);
    }

    var inlineForm = function (service) {
      var allowDelete = false;
      return dime.modules.service.views.form(service, allowDelete, onSave);
    }

    options.unshift(
      m("li.current", [
        m("a[href=#]", {
          onclick: function() { setEditable(!isEditable()); return false; }
        }, [
          m("span.icon.icon-edit"),
          isEditable() ? '' : activity.service.name
        ]),
        isEditable() ? inlineForm(activity.service) : ''
      ])
    );

    return m("ul.dropdown-menu", options);
  }

})(dime, m, _);
