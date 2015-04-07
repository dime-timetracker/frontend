'use strict';

(function (dime, m, _) {

  dime.modules.customer.views.item = function (current) {
    var disabled = current.enabled ? '' : '.disabled';
    return m('tr' + disabled, [
      m("td.name", {
        contenteditable: true,
        oninput: function(e) { current.updateName(e.target.value); }
      }, current.name),
      m("td.alias", {
        contenteditable: true,
        oninput: function(e) { current.updateAlias(e.target.value); }
      }, current.alias),
      m("td.enabled.text-center", [
        m("input[type=checkbox]", {
          checked: current.enabled,
          oninput: function(e) { current.updateEnabled(e.target.checked); }
        })
      ]),
      m("td.text-right", [
        m("a.btn.btn-flat[href=#]", { onclick: function(e) { dime.resources.customer.remove(current); return false; } }, m("span.icon.icon-delete"))
      ])
    ]);
  };

})(dime, m, _);
