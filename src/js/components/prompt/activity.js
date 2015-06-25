'use strict';

var m = require('mithril');
var t = require('../../translation');
var formatShortcut = require('../../core/helper').mousetrapCommand;

function inputView (scope) {
  return m('input.form-control.mousetrap', {
    id: scope.htmlId,
    placeholder: t('prompt.activity.placeholder', {
      shortcut: formatShortcut(scope.shortcut)
    }),
    onfocus: scope.focus,
    onblur: scope.blur,
    onkeydown: scope.keydown
  });
}

module.exports = {
  controller: function (parentScope) {
    var scope = {
      shortcut: 'mod-a',
      icon: 'icon-access-time',
      htmlId: 'prompt'
    };
    scope.inputView = function () {
      return inputView(scope);
    };
    //TODO trigger Mousetrap

    return scope;
  },
  view: function (scope) {
    return m.component(require('../prompt'), scope);
  }
};
