(function (dime, m, _) {
  'use strict';

  dime.inputs.select = function (type, related, relationType, onchange) {
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

    return m('select.form-input', {
      onchange: function (e) {
        onchange(items[e.target.options[e.target.selectedIndex].value]);
      }
    }, options);
  };

})(dime, m, _);
