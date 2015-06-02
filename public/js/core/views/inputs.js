(function (dime, m, _) {
  'use strict';

  var inputs = dime.core.views.inputs = {};

  inputs.boolean = function (current, value, update) {
    var options = [
      {
        value: 1,
        label: t('yes'),
        selected: value == true
      },
      {
        value: 0,
        label: t('no'),
        selected: value == false
      }
    ];
    return m("select.form-control", {
        onchange: function (e) { update(e.target.value); }
    }, options.map(function (option) {
      return m("option", { value: option.value, selected: option.selected }, option.label);
    }));
  };

  inputs.input = function (type, value, update) {
    return m('input.form-control', {
      type: type,
      value: value,
      oninput: function(e) {
        update(e.target.value);
      }
    });
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