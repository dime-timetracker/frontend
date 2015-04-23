;(function (dime, m, _) {
  'use strict';

  dime.core.views.form = function (item, type, properties, allowDelete, onSave, onCancel) {
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
          input = dime.inputs.boolean(item, value, setValue);
          break;
        default:
          input = dime.inputs.input(property.type, value, setValue);
      }
      return m('.form-group', [ m('label', t(property.title)), input ] );
    });
    
    dime.events.emit('core-' + type + '-form-item-view-after', {
      item: item,
      properties: properties,
      type: type,
      view: columns
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
  
})(dime, m, _)
