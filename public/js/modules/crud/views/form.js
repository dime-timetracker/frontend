'use strict';

(function (dime, m, _) {

  var t = dime.translate;

  dime.modules.crud.views.form = function (item, type, properties, allowDelete, onSave, onCancel) {
    allowDelete = _.isUndefined(allowDelete) ? true : allowDelete;
    var disabled = item.enabled ? '' : '.disabled';

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
      var row = function (field) {
        return m('.form-row.' + property.key, [
          m('label', [
            t(property.title),
            field
          ]),
        ]);
      }
      switch (property.type) {
        case 'boolean':
          return row(
            dime.inputs.boolean(item, value, function update (value) {
              item[property.key] = value;
              dime.resources[type].persist(item);
            })
          );
        default:
          return row(
            dime.inputs.input(property.type, value, function update (value) {
              item[property.key] = value;
              dime.resources[type].persist(item);
            })
          );
      }
    });
    dime.events.emit('crud-' + type + '-form-item-view-after', {
      item: item,
      properties: properties,
      type: type,
      view: columns,
    });

    if (allowDelete) {
      columns.push(
        m("input[type=submit].delete", {
          onclick: function() { confirm('Really?') && current.delete(current.id) },
          value: 'Delete'
        })
      );
    }

    columns.push(
      m("input[type=button].cancel", {
        onclick: onCancel,
        value: t('Cancel')
      })
    );

    columns.push(
      m("input[type=submit].save", {
        onclick: saveForm,
        value: t('Save')
      })
    );

    return m('form' + disabled, columns);
  }
})(dime, m, _)
