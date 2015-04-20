'use strict';

(function (dime, m, _) {

  dime.modules.crud.views.select = function (type, activity) {

    var items = dime.resources[type].findAll() || [];

    var model = dime.model[type.charAt(0).toUpperCase() + type.substr(1)];

    var options = items.map(function(item) {
      return m("li", m("a", {
        href: "#",
        onclick: function() { activity.onSwitchRelation(type, item); }
      }, item.name ? item.name : "(" + model.shortcut + item.alias + ")"));
    });

    var onSave = function (item) {
      setEditable(false);
      activity[type] = item;
      dime.resources.activity.persist(activity);
    };

    var onCancel = function (item) {
      setEditable(false);
    }

    var inlineForm = function (item) {
      var allowDelete = false;
      return dime.modules.crud.views.form(item, type, model.properties, allowDelete, onSave, onCancel);
    };

    activity[type] = activity[type] || dime.resources[type].empty();
    var alias = 'activity-' + activity.id;
    var isEditable = function () {
      return dime.modules.setting.local[type + '/edit-inline/' + alias] || false;
    };
    
    var setEditable = function (value) {
      dime.modules.setting.local[type + '/edit-inline/' + alias] = value;
    }

    var editButton = m("a[href=#]", {
      onclick: function() { setEditable(true); return false; }
    }, [ m("span.icon.icon-edit"), activity[type].name ]);

    options.unshift(
      m("li.current", [
        isEditable() ? inlineForm(activity[type]) : editButton
      ])
    );

    return m("ul.dropdown-menu", options);
  }

})(dime, m, _);
