(function (dime, m, _) {
  'use strict';

  var inputs = dime.core.views.inputs = {};

  inputs.boolean = function (value, update) {
    var options = [
      m('option', { selected: (value == true),  value: 1 }, t('yes')),
      m('option', { selected: (value == false),  value: 0 }, t('no'))
    ];
    
    return m("select.form-control", { onchange: function (e) { update(e.target.value); } }, options);
  };

  inputs.input = function (type, value, update) {
    var attr = {
      type: 'text'
    };

    if (!_.isUndefined(type)) {
      attr.type = type;
    }

    if (!_.isUndefined(value)) {
      attr.value = value;
    }

    if (_.isFunction(update)) {
      attr.oninput = function(e) {
        update(e.target.value);
      };
    }

    return m('input.form-control', attr);
  };

  inputs.select = function (type, related, relationType, onchange) {
    relationType = relationType || 'activity';
    var model = dime.model[dime.helper.format.ucFirst(type)];

    related[type] = related[type] || dime.resources[type].create({});
    var items = _.sortBy(dime.resources[type], 'name') || [];
    var options = items.map(function (item, key) {
      return m('option', {
        value: key,
        selected: (related[type].alias === item.alias)
      }, (item.name || '(' + model.shortcut + item.alias + ')'));
    });

    return m('select.form-control', {
      onchange: function (e) {
        onchange(items[e.target.options[e.target.selectedIndex].value]);
      }
    }, options);
  };

  inputs.text = function (current, value, update) {
    return m('span.form-control', {
      contenteditable: true,
      oninput: function(e) {
        update(e.target.textContent);
      }
    }, value);
  };

})(dime, m, _);