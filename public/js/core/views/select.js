;
(function (dime, m, _) {
  'use strict';

  dime.core.views.select = function (type, activity, onchange) {
    var model = dime.model[dime.helper.format.ucFirst(type)];

    var onSave = function (item) {
      setEditable(false);
      activity[type] = item;
      dime.resources.activity.persist(activity);
      if (_.isFunction(onchange)) {
        onchange();
      }
    };

    var onCancel = function (item) {
      setEditable(false);
    };

    var inlineForm = function (item) {
      var allowDelete = false;
      return dime.core.views.form(item, type, model.properties, allowDelete, onSave, onCancel);
    };

    var isEditable = function () {
      return dime.configuration.getLocal(type + '/edit-inline/' + alias, false);
    };

    var setEditable = function (value) {
      dime.configuration.setLocal(type + '/edit-inline/' + alias, value);
    };

    activity[type] = activity[type] || dime.resources[type].create({});
    var alias = 'activity-' + activity.id;

    var editButton = m('button.btn.btn-flat', {
      onclick: function () {
        setEditable(true);
        return false;
      }
    }, [m('span.icon.icon-edit.margin-right-half'), activity[type].name]);

    var currentAction = undefined;
    if ('project' === type && false === activity.hasProject() && false === activity.hasCustomer()) {
      currentAction = m('a', t('Please select a customer before creating a new project!'));
    } else if (isEditable()) {
      currentAction = inlineForm(activity[type]);
    } else {
      currentAction = editButton;
    }

    var items = _.sortBy(dime.resources[type], 'name') || [];
    var options = items.map(function (item) {
      var result = undefined,
          generate = true;
      if ('project' === type
              && activity.hasCustomer()
              && item.customer
              && item.customer.id !== activity.customer.id) {
        generate = false;
      }

      if (generate && activity[type].alias !== item.alias) {
        result = m('li', m('a[href=#]', {
          onclick: function () {
            activity.onSwitchRelation(type, item);
            if (_.isFunction(onchange)) {
              onchange();
            }
          }
        }, item.name ? item.name : '(' + model.shortcut + item.alias + ')'));
      }
      
      return result;
    });
    options.unshift(m('li.current', [currentAction]));

    return m('ul.dropdown-menu', options);
  }

})(dime, m, _);
