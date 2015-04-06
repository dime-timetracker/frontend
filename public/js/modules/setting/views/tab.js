'use strict';

(function (dime, m) {

  dime.modules.setting.views.tab = function (current) {
    var items = [];
    Object.keys(current.children).map(function (key) {
      items.push(dime.modules.setting.views.section(current.children[key]))
    });

    return m("div#config-tab", [
      m("div.title", current.title),
      m("div.description", current.description),
      m("div.items", items)
    ]);
  }

})(dime, m);
