'use strict';

(function (dime, m, _) {

  if (false === _.isObject(dime.inputs)) {
    dime.inputs = {};
  }
  dime.inputs.boolean = function (current, value, update) {
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
        onchange: function (e) { update(e.target.value); }
    }, options.map(function (option) {
      return m("option", { value: option.value, selected: option.selected }, option.label);
    }));
  }

})(dime, m, _);
