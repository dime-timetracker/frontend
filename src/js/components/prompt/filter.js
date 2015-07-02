'use strict';

var debug = global.window.dimeDebug('prompt.filter');
var m = require('mithril');
var t = require('../../translation');
var formatShortcut = require('../../core/helper').mousetrapCommand;

function onUpdateFilter (e, scope) {
  debug('Update filter: ', e.target.value);
}

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
        debug('Clicked bookmark icon');
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
      scope.onUpdateFilter(e, scope);
    }
  });
}

module.exports = {
  controller: function (parentScope) {
    var scope = {
      collection: parentScope.collection,
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
    scope.onUpdateFilter = onUpdateFilter;
    //TODO trigger Mousetrap

    return scope;
  },
  view: function (scope) {
    return m.component(require('../prompt'), scope);
  }
};
