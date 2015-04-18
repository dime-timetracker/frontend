'use strict';

(function (dime, m, _) {

  if (false === _.isObject(dime.inputs)) {
    dime.inputs = {};
  }
  dime.inputs.text = function (current, value, update) {
    return m('span', {
      contenteditable: true,
      oninput: function(e) {
        update(e.target.textContent);
      }
    }, value);
  }

})(dime, m, _);
