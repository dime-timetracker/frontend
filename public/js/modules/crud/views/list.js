'use strict';

(function (dime, m) {

  var t = dime.translate;

  dime.modules.crud.views.list = function(type, properties) {
    var items = dime.resources[type].findAll() || [];

    var headers = properties.map(function(property) {
      var options = property.options || {};
      return m('th', options, t(property.title));
    });
    headers.push(
      m('th.text-right', m(
        'a.btn.btn-flat', {
          href: '#',
          onclick: function() {
            console.log('not yet implemented');
            return false;
          }
        }, m('span.icon.icon-add')
      ))
    );

    var header = m('thead', m('tr', headers));
    dime.events.emit('crud-' + type + '-list-header-view-after', {
      properties: properties,
      type: type,
      view: header,
    });

    var rows = m('tbody', items.map(function (item) {
      return dime.modules.crud.views.item(item, type, properties)
    }));

    var list = [
      m('h2', t(type)),
      m('table.bordered.responsive-table', [header, rows])
    ];
    dime.events.emit('crud-' + type + '-list-view-after', {
      properties: properties,
      type: type,
      view: list,
    });

    return m('div.list-' + type, list);
  }

})(dime, m)
