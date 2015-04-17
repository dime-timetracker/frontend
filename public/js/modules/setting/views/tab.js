'use strict';

(function (dime, m) {

  var t = dime.translate;

  dime.modules.setting.views.tab = function (key, activeKey) {
    var current = dime.settings[key];
    var items = [];
    Object.keys(current.children).map(function (key) {
      items.push(dime.modules.setting.views.section(current.children[key]))
    });

    return m('li' + (activeKey===key ? '.active' : ''), m("a[href=#]", {
      onclick: function () {
        dime.configuration.set({namespace: 'settings', name: 'tab/selected', value: key});
        return false;
      }
    }, t(current.title)));
  }

})(dime, m);
