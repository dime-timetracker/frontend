'use strict';

(function (dime, m, _) {

  dime.modules.customer.views.item = function (current) {
    var disabled = current.enabled ? '' : '.disabled';
    return m('tr' + disabled, [
      m("td.name", {
        contenteditable: true,
        oninput: function() { current.updateName(e.target.value) },
      }, current.name),
      m("td.alias", {
        contenteditable: true,
        oninput: function() { current.updateAlias(e.target.value) },
      }, current.alias),
      m("td.enabled.text-center", [
        m("input[type=checkbox]", {
          checked: current.enabled,
          oninput: function() { current.updateEnabled(e.target.checked) },
        })
      ]),
      m("td.actions.text-right", [
        m("a.btn.btn-flat", { href: "#" }, m("span.icon.icon-create")),
        m("a.btn.btn-flat", { href: "#" }, m("span.icon.icon-clear"))
      ])
    ]);
  }

})(dime, m, _);
