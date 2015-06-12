'use strict';

var m = require('mithril');
var t = require('../../../translation');

module.exports = function (scope, item) {
  return m("a.btn.btn-flat[href=#]", {
      onclick: function (e) {
        var question = t('Do you really want to delete "[name]"?').replace('[name]', item.name);
        if (confirm(question)) {
          scope.resource.remove(item);
        }
        return false;
      }
    }, m("span.icon.icon-delete"));
};