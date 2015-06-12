  'use strict';

var m = require('mithril');
var _ = require('lodash');

module.exports = function (item, type, properties, allowDelete, onSave, onCancel) {
  allowDelete = _.isUndefined(allowDelete) ? true : allowDelete;

  var saveForm = function (e) {
    dime.resources[type].persist(item);
    if (_.isFunction(onSave)) {
      onSave(item);
    }
  };

  var columns = properties(item).map(function(property) {
    if (_.isUndefined(property.type)) {
      property.type = 'text';
    }
    var value = item[property.key];
    if (_.isFunction(property.get)) {
      value = property.get(item);
    }
    var setValue = function (value) {
      if (_.isFunction(property.get)) {
        property.set(value);
      } else {
        item[property.key] = value;
      }
    };

    var input = undefined;
    switch (property.type) {
      case 'boolean':
        input = dime.core.views.inputs.boolean(value, setValue);
        break;
      case 'relation':
        input = dime.inputs.select(property.resource, item, item[property.key], function update(related) {
          item[property.key] = related;
          dime.resources[type].persist(item);
        });
        break;
      default:
        input = dime.core.views.inputs.input(value, setValue, property.type);
    }
    return m('.form-group', [ m('label', t(property.title)), input ] );
  });

  columns.unshift(
    m(".form-group", m("input[type=button].btn.btn-block.cancel", {
      onclick: onCancel,
      value: t('Cancel')
    }))
  );

  if (allowDelete) {
    columns.push(
      m("input[type=submit].btn.btn-block.delete", {
        onclick: function() { confirm('Really?') && item.delete(item.id); },
        value: 'Delete'
      })
    );
  }

  columns.push(
    m(".form-group.push-down", m("button[type=submit].btn.btn-block.save", {
      onclick: saveForm
    }, t('Save')))
  );


  return m('form.form-inline', columns);
};
