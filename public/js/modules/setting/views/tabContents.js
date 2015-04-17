'use strict';

(function (dime, m) {

  var t = dime.translate;

  dime.modules.setting.views.tabContents = function (current) {
    var sections = [];
    Object.keys(current.children).map(function (key) {
      sections.push(dime.modules.setting.views.section(current.children[key]))
    });

    return m("div#config-tab-content", [
      m("div.description", t(current.description)),
      m("div.sections", sections)
    ]);
  }

})(dime, m);
