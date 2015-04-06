'use strict';

(function (dime, m) {

  dime.modules.setting.views.config = function (current) {
    return m("div#setting-" + current.path, [
      m("div.title", current.title),
      m("div.description", current.description),
      m("div.value",
        m("input", {
          type: current.type,
          value: dime.modules.setting.get('config', current.path, current.default)
        })
      )
    ]);
  }

})(dime, m);
