'use strict';

(function (dime, m) {

  dime.modules.setting.views.section = function (current) {
    var items = [];
    Object.keys(current.children).map(function (key) {
      items.push(dime.modules.setting.views.config(current.children[key]))
    });

    var sectionParts = [];
    sectionParts.push(m("div.section-title.title", current.title));
    if (current.description) {
      sectionParts.push(m("div.description", current.description));
    }
    if (items.length) {
      sectionParts.push(m("div.items", items));
    }

    return m("div#config-section", sectionParts);
  }

})(dime, m);