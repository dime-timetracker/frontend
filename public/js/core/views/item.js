'use strict';

(function (dime, m, _) {

  dime.core.views.item = function (item, type, properties) {

    var textColumn = function (property) {
      var value = item[property.key];
      if (_.isFunction(property.get)) {
        value = property.get(item);
      }
      return m('td.' + property.key, {
        contenteditable: true,
        oninput: function(e) {
          item[property.key] = e.target.textContent;
          dime.resources[type].persist(item);
        }
      }, value);
    }

    var columns = properties.map(function(property) {
      if (_.isUndefined(property.type)) {
        property.type = text;
      }
      var value = item[property.key];
      if (_.isFunction(property.get)) {
        value = property.get(item);
      }
      switch (property.type) {
        case 'boolean':
          return m('td.' + property.key,
            dime.core.views.inputs.boolean(item, value, function update (value) {
              item[property.key] = value;
              dime.resources[type].persist(item);
            })
          );
        case 'relation':
          return m('td.' + property.key,
            dime.core.views.inputs.select(property.resource, item, item[property.key], function update(related) {
              item[property.key] = related;
              dime.resources[type].persist(item);
            })
          );
        default:
          return m('td.' + property.key,
            dime.core.views.inputs.text(item, value, function update (value) {
              item[property.key] = value;
              dime.resources[type].persist(item);
            })
          );
      }
    });
    dime.events.emit('core-' + type + '-list-item-view-after', {
      item: item,
      properties: properties,
      type: type,
      view: columns,
    });

    return m('tr', columns.concat(
      m("td.text-right", [
        m("a.btn.btn-flat[href=#]", {
          onclick: function(e) {
            var question = t('Do you really want to delete "[name]"?').replace('[name]', item.name);
            if (confirm(question)) dime.resources[type].remove(item);
            return false;
          }
        }, m("span.icon.icon-delete"))
      ])
    ));
  }

})(dime, m, _);
