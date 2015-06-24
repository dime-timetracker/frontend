'use strict';

var m = require('mithril');
var t = require('../../translation');
var formatShortcut = require('../../core/helper').mousetrapCommand;

module.exports = {
  controller: function (parentScope) {
    var scope = {
      shortcut: 'mod-a',
    };
    //TODO trigger Mousetrap

    return scope;
  },
  view: function (scope) {
    var input = m('input#prompt.form-control.mousetrap', {
      placeholder: t('prompt.activity.placeholder', {
        shortcut: formatShortcut(scope.shortcut)
      }),
      onfocus: scope.focus,
      onblur: scope.blur,
      onkeydown: scope.keydown
    });
    
    return m('.media', [
      m('.media-object.pull-left',
        m('label.form-icon-label', {
          for: 'prompt'
        }, m('span.icon.icon-access-time'))
      ), m('.media-inner', input)
    ]);
  }
};
