;
(function (dime, m, _) {
  'use strict';

  dime.core.views.select = function (type, activity) {    
    var model = dime.model[type.charAt(0).toUpperCase() + type.substr(1)];

    var onSave = function (item) {
      setEditable(false);
      activity[type] = item;
      dime.resources.activity.persist(activity);
    };

    var onCancel = function (item) {
      setEditable(false);
    };

    var inlineForm = function (item) {
      var allowDelete = false;
      return dime.core.views.form(item, type, model.properties, allowDelete, onSave, onCancel);
    };

    var isEditable = function () {
      return dime.modules.setting.local[type + '/edit-inline/' + alias] || false;
    };

    var setEditable = function (value) {
      dime.modules.setting.local[type + '/edit-inline/' + alias] = value;
    };

    activity[type] = activity[type] || dime.resources[type].empty();
    var alias = 'activity-' + activity.id;

    var editButton = m('button.btn.btn-flat', {
      onclick: function () {
        setEditable(true);
        return false;
      }
    }, [m('span.icon.icon-edit.margin-right-half'), activity[type].name]);

    var currentAction = undefined;
    if ('project' === type && false === activity.hasProject() && false === activity.hasCustomer()) {
      currentAction = m('a',
              dime.translate('Please select a customer before creating a new project!')
              );
    } else if (isEditable()) {
      currentAction = inlineForm(activity[type]);
    } else {
      currentAction = editButton;
    }

    var items = _.sortBy(dime.resources[type].findAll(), 'name') || [];
    var options = items.map(function (item) {
//      var result = undefined;
//
//      if ((activity.hasCustomer() && activity.customer.alias === item.alias)
//              || (false === activity.hasCustomer() && '' === item.alias))
//      {
//        result =
//      }
      var result = undefined;

      if (activity[type].alias !== item.alias) {
        result = m('li', m('a[href=#]', {
          onclick: function () {
            activity.onSwitchRelation(type, item);
          }
        }, item.name ? item.name : '(' + model.shortcut + item.alias + ')'));
      }
      
      return result;
    });
    options.unshift(m('li.current', [currentAction]));

    return m('ul.dropdown-menu', options);
  }

})(dime, m, _);
