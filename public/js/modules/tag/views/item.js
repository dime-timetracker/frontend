'use strict';

(function (dime, m, _) {
  
  dime.modules.tag.views.item = function (tag, onclick, remove) {
    var tagname = _.isString(tag) ? tag : tag.name;
    return m("span.badge.tag", [
      m("span.hash", "#"),
      m("span.tagname", {
        onclick: function () { onclick(tag); return false; },
      }, tagname),
      m("a[href=#].remove", {
        onclick: function () { remove(tag); return false; },
        title: "Remove tag"
      }, "×")
    ]);
  };

})(dime, m, _);

