'use strict';

(function (dime, m) {

  dime.modules.setting.views.item = function (current) {
    return m("tr", [
      m("td.namespace", current.namespace),
      m("td.name", current.name),
      m("td.value", {
        contenteditable: true,
        oninput: function(e) {
          current.value = e.target.value;
          dime.resources.setting.persist(current);
        },
      }, current.value)
    ]);
  }

})(dime, m);
