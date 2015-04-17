'use strict';

(function (dime, m, _) {

  if (false === _.isObject(dime.views)) {
    dime.inputs = {};
  }
  dime.inputs.boolean = function (current, value, onchange) {
    var t = dime.translate || function (s) { return s; };
    var options = [
      {
        value: 1,
        label: t('yes'),
        selected: value==true
      },
      {
        value: 0,
        label: t('no'),
        selected: value==false
      }
    ];
    return m("select", {
        onchange: function (e) { onchange(e.target.value); }
    }, options.map(function (option) {
      return m("option", { value: option.value, selected: option.selected }, option.label);
    }));
  }

})(dime, m, _);
