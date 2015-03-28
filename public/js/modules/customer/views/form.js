'use strict';

(function (dime, m, _) {

  var create = function() {
    var item = {
      name: document.getElementById("name").value,
      alias: document.getElementById("alias").value,
    };
    dime.store.add('customers', item);
    dime.store.get('customers').done(function(customers) {
      m.redraw();
    })
  };

  dime.modules.customer.views.item = function (current) {
    var disabled = current.enabled ? '' : '.disabled';
    return m('dl' + disabled, [
      m("dt.name", "Name"),
      m("dd.name", {
        contenteditable: true,
        oninput: function() { current.updateName(e.target.value) },
      }, current.name),
      m("dt.alias", "Alias"),
      m("dd.alias", {
        contenteditable: true,
        oninput: function() { current.updateAlias(e.target.value) },
      }, current.alias),
      m("dt.enabled", "enabled"),
      m("dd.enabled", [
        m("input[type=checkbox]", {
          checked: current.enabled,
          oninput: function() { current.updateEnabled(e.target.checked) },
        })
      ]),
      m("input[type=submit].delete", {
        onclick: function() { confirm('Really?') && current.delete(current.id) },
        value: 'Delete'
      })
    ]);
  }

})(dime, m, _);
