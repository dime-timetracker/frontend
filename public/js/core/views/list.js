'use strict';

(function (dime, m) {

  dime.core.views.list = function(type, properties) {
    var items = dime.resources[type] || [];

    var headers = properties().map(function(property) {
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
    dime.events.emit('core-' + type + '-list-header-view-after', {
      properties: properties(),
      type: type,
      view: header,
    });

    var rows = m('tbody', items.map(function (item) {
      return dime.core.views.item(item, type, properties(item))
    }));

    var list = [
      m('h2', t(type + 's')),
      m('table.table.table-responsive', [header, rows])
    ];
    dime.events.emit('core-' + type + '-list-view-after', {
      properties: properties(),
      type: type,
      view: list,
    });

    return m('div.list-' + type, list);
  }

})(dime, m)
