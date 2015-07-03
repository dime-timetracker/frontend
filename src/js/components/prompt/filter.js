'use strict';

var debug = global.window.dimeDebug('prompt.filter');
var m = require('mithril');
var t = require('../../translation');
var formatShortcut = require('../../core/helper').mousetrapCommand;
var parser = require('../../core/parser');

function onSubmitFilter (e, scope) {
  debug('Filtering by ' + e.target.value);
  scope.collection.fetch({
    requestAttributes: {
      filter: e.target.value
    },
    reset: true
  });
}

function onKeyUp (e, scope) {
  var keyCode = e.which || e.keyCode;
  if (13 === keyCode) {
    onSubmitFilter(e, scope);
    e.target.blur();
  }
}

function buttonReportView () {
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
      onKeyUp(e, scope);
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
    //TODO trigger Mousetrap

    return scope;
  },
  view: function (scope) {
    return m.component(require('../prompt'), scope);
  }
};
