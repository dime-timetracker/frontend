'use strict';

(function (dime, m, _) {

  if (false === _.isObject(dime.inputs)) {
    dime.inputs = {};
  }
  dime.inputs.input = function (type, value, update) {
    return m('input.form-control', {
      type: type,
      value: value,
      oninput: function(e) {
        update(e.target.value);
      }
    });
  }

})(dime, m, _);
