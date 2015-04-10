'use strict';

(function (dime, m) {

  dime.modules.setting.views.tab = function (current, active) {
    var items = [];
    Object.keys(current.children).map(function (key) {
      items.push(dime.modules.setting.views.section(current.children[key]))
    });

    return m('li' + (active ? '.active' : ''), m("a[href=#]", current.title));
  }

})(dime, m);
