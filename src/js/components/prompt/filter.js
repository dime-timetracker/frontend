'use strict';

var m = require('mithril');
var t = require('../../translation');
var formatShortcut = require('../../core/helper').mousetrapCommand;

function buttonReportView (scope) {
  return m('.media-object.pull-right',
    m('a[href="/report"].form-icon-label', {
      config: m.route
    }, m('span.icon.icon-print'))
  );
}

function buttonBookmarkView (scope) {
  return m('.media-object.pull-right',
    m('span.form-icon-label', {
      onclick: function () {
        console.error('TODO: bookmark');
      }
    }, m('span.icon.icon-bookmark' + (scope.isBookmarked ? '' : '-outline')))
  );
}

function inputView (scope) {
  return m('input.form-control.mousetrap', {
    id: scope.htmlId,
    placeholder: t('prompt.filter.placeholder', {
      shortcut: formatShortcut(scope.shortcut)
    }),
    onfocus: scope.focus,
    onblur: scope.blur,
    onkeydown: scope.keydown,
    onkeyup: function(e) {
      console.log('FIXME: update bookmark icon');
    }
  });
}

module.exports = {
  controller: function (parentScope) {
    var scope = {
      shortcut: 'mod-f',
      inputView: inputView,
      icon: 'icon-filter-list',
      htmlId: 'filter'
    };
    scope.iconViews = [
      function () { return buttonReportView(scope); },
      function () { return buttonBookmarkView(scope); }
    ];
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
