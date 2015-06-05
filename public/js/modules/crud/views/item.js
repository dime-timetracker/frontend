;(function (dime, m, _) {
  'use strict';
  
  dime.modules.crud.views.tableItem = function (item, type, properties) {

    var columns = properties.map(function (property) {
      if (_.isUndefined(property.type)) {
        property.type = 'text';
      }
      var value = item[property.key];
      if (_.isFunction(property.get)) {
        value = property.get(item);
      }
      var input;
      switch (property.type) {
        case 'boolean':
          input = dime.core.views.inputs.boolean(value, function update(value) {
            item[property.key] = value;
            dime.resources[type].persist(item);
          });
          break;
        case 'relation':
          input = dime.core.views.inputs.select(property.resource, item, item[property.key], function update(related) {
            item[property.key] = related;
            dime.resources[type].persist(item);
          });
          break;
        default:
          input = dime.core.views.inputs.input(value, function update(value) {
            item[property.key] = value;
            dime.resources[type].persist(item);
          }, property.type);
      }

      return m('td.' + property.key, input);
    });
    dime.events.emit('core-' + type + '-list-item-view-after', {
      item: item,
      properties: properties,
      type: type,
      view: columns,
    });

    var btnDelete = m("a.btn.btn-flat[href=#]", {
        onclick: function (e) {
          var question = t('Do you really want to delete "[name]"?').replace('[name]', item.name);
          if (confirm(question)) {
            dime.resources[type].remove(item);
          }
          return false;
        }
      }, m("span.icon.icon-delete"));

    return m('tr', columns.concat(m("td.empty", btnDelete)));
  };

})(dime, m, _);
