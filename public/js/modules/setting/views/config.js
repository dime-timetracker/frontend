'use strict';

(function (dime, m) {

  dime.modules.setting.views.config = function (current) {
    if (_.isFunction(current.onRender) && false === current.onRender()) {
      return null;
    }
    var type = current.type ? current.type : 'text';
    var onchange = function(value) {
      if (_.isFunction(current.onWrite)) {
        value = current.onWrite(value);
      }
      dime.modules.setting.set(current.namespace, current.name, value);
    };
    var value = dime.modules.setting.get(current.namespace, current.name, current.defaultValue);
    if (_.isFunction(current.onRead)) {
      value = current.onRead(value);
    }
    var input = m("input", {
      type: type,
      value: value,
      onchange: function (e) { onchange(e.target.value); }
    });
    if (dime.inputs[type]) {
      input = dime.inputs[type](current, value, onchange);
    }

    return m("div.setting#setting-" + current.namespace + '/' + current.name, [
      m("div.title", current.title),
      m("div.value", input),
      m("div.description", current.description)
    ]);
  }

})(dime, m);
