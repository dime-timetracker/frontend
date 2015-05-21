;(function (dime, m, _) {
  'use strict';

  /**
   * Create a form-group.
   *
   * Call:
   *   dime.core.views.formGroup(m('input#test'), 'label');
   *
   * Output:
   *   <div class="form-group">
   *     <label class="form-label" for="test">label</label>
   *     <input type="text" id="test">
   *   </div>
   *
   * @param {m-Object} input
   * @param {mixed} label
   * @returns {m-Object}
   */
  dime.core.views.formGroup = function (input, label) {
    var content = [];

    if (!_.isUndefined(label)) {
      if (_.isString(label)) {
        var attr = {};
        if (input && input.attrs && input.attrs.id) {
          attr['for'] = input.attrs.id;
        }
        content.push(m('label.form-label', attr, label));
      } else {
        content.push(label);
      }
    }

    if (!_.isUndefined(input)) {
      content.push(input);
    }

    return m('.form-group', content);
  };

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
