'use strict';

(function (dime, m, _) {

  dime.modules.crud.views.item = function (item, type, properties) {

    var textColumn = function (property) {
      return m('td.' + property.key, {
        contenteditable: true,
        oninput: function(e) {
          item[property.key] = e.target.textContent;
          dime.resources[type].persist(item);
        }
      }, item[property.key]);
    }

    var columns = properties.map(function(property) {
      if (false === _.isUndefined(property.type)) {
        if ('boolean' === property.type) {
          return dime.inputs.boolean(item, property.key, function(value) {
            item[property.key] = value;
            dime.resources[type].persist(item);
          });
        }
      }
      return textColumn(property);
    });
    dime.events.emit('crud-' + type + '-list-item-view-after', {
      item: item,
      properties: properties,
      type: type,
      view: columns,
    });

    return m('tr', columns.concat(
      m("td.text-right", [
        m("a.btn.btn-flat[href=#]", {
          onclick: function(e) {
            dime.resources[type].remove(item);
            return false;
          }
        }, m("span.icon.icon-delete"))
      ])
    ));
  }

})(dime, m, _);
