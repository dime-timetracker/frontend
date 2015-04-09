'use strict';

(function (dime, m) {

  dime.modules.setting.views.tab = function (current, active) {
    var items = [];
    Object.keys(current.children).map(function (key) {
      items.push(dime.modules.setting.views.section(current.children[key]))
    });

    return m("a[href=#]" + (active ? '.active' : ''), current.title);
  }

})(dime, m);
