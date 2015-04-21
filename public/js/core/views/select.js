'use strict';

(function (dime, m, _) {

  dime.core.views.select = function (type, activity) {

    var items = dime.resources[type].findAll() || [];

    var model = dime.model[type.charAt(0).toUpperCase() + type.substr(1)];

    var options = items.map(function(item) {
      if ((activity.hasCustomer() && activity.customer.alias === item.alias)
        || (false === activity.hasCustomer() && '' === item.alias)
      ) {
        return undefined;
      }
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
      return dime.core.views.form(item, type, model.properties, allowDelete, onSave, onCancel);
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

    var currentAction = null;
    if ('project' === type && false === activity.hasProject() && false === activity.hasCustomer()) {
      currentAction = m('a',
        dime.translate('Please select a customer before creating a new project!')
      );
    } else if (isEditable()) {
      currentAction = inlineForm(activity[type]);
    } else {
      currentAction = editButton;
    }
    options.unshift(m("li.current", [currentAction]));

    return m("ul.dropdown-menu", options);
  }

})(dime, m, _);
