'use strict';

var debug = global.window.dimeDebug('shell.filter');
var m = require('mithril');
var t = require('../../translation');
var formatShortcut = require('../../core/helper').mousetrapCommand;
var mousetrap = require('mousetrap');
var bookmarks = require('./filter/bookmarks');
var shell = require('../shell');

var configuration = require('../../core/configuration');

function onSubmitFilter (e, scope) {
  scope.query = e.target.value;
  scope.collection.fetch({
    requestAttributes: {
      filter: scope.query
    },
    reset: true
  });
}

function onKeyUp (e, scope) {
  var keyCode = e.which || e.keyCode;
  scope.query = e.target.value.trim();
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
  var isBookmarked = bookmarks.isKnownQuery(scope.query);
  return m('.media-object.pull-right',
    m('span.form-icon-label', {
      onclick: function () {
        bookmarks.add('', scope.query);
      }
    }, m('span.icon.icon-bookmark' + (isBookmarked ? '' : '-outline')))
  );
}

function inputView (scope) {
  return m('input.form-control.mousetrap', {
    id: scope.htmlId,
    placeholder: t('shell.filter.placeholder', {
      shortcut: formatShortcut(scope.shortcut)
    }),
    onfocus: scope.focus,
    onblur: scope.blur,
    onkeydown: scope.keydown,
    onkeyup: function(e) {
      onKeyUp(e, scope);
    },
    value: scope.query
  });
}

function registerMouseEvents (scope) {
  mousetrap(global.window).bind(scope.shortcut, function() {
    global.window.document.getElementById('filter').focus();
    return false;
  });
}

function controller (listScope) {
  var scope = {
    collection: listScope.collection,
    shortcut: configuration.get('shell/shortcuts/focusFilter', 'd f'),
    inputView: inputView,
    icon: 'icon-filter-list',
    htmlId: 'filter',
    query: null,
  };
  scope.focus = function (e) {shell.focus(e, scope);};
  scope.blur = function (e) {shell.blur(e, scope);};
  scope.iconViews = [
    function () { return buttonReportView(scope); },
    function () { return buttonBookmarkView(scope); }
  ];
  scope.inputView = function () {
    return inputView(scope);
  };
  registerMouseEvents(scope);

  return scope;
}

function view (scope) {
  return m.component(shell, scope);
}

module.exports = {
  controller: controller,
  view: view
};
