'use strict';

var m = require('mithril');

module.exports = function (activitiy) {
  return m('span.text-overflow pull-left', {
    contenteditable: true,
    oninput: function (e) {
      activitiy.updateDescription(e.target.textContent);
      return false;
    }
  }, activitiy.description);
};