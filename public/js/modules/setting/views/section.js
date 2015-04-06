'use strict';

(function (dime, m) {

  dime.modules.setting.views.section = function (current) {
    var items = [];
    Object.keys(current.children).map(function (key) {
      items.push(dime.modules.setting.views.config(current.children[key]))
    });

    return m("div#config-section", [
      m("div.title", current.title),
      m("div.description", current.description),
      m("div.items", items)
    ]);
  }

})(dime, m);
