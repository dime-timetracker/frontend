'use strict';

var debug = global.window.dimeDebug('shell.filter');
var m = require('mithril');
var t = require('../../lib/translation');
var formatShortcut = require('../../lib/helper/mousetrapCommand');
var bookmarks = require('./filter/bookmarks');
var shell = require('../shell');
var configuration = require('../../lib/configuration');
configuration.addSection(require('./config'));

function onSubmitFilter (e, scope) {
  scope.query = e.target.value;
  scope.collection.fetch({
    requestAttributes: {
      filter: scope.query
    },
    reset: true
  });
  scope.blur(e, scope);
}

function buttonReportView (scope) {
  return m('.media-object.pull-right',
    m('a[href="/report/' + encodeURIComponent(scope.query) + '"].form-icon-label', {
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
    value: scope.query
  });
}

function controller (listScope) {
  var scope = {
    collection: listScope.collection,
    shortcut: configuration.get('shell/shortcuts/focusFilter'),
    inputView: inputView,
    icon: 'icon-filter-list',
    htmlId: 'filter',
    query: listScope.query || null,
  };
  scope.onSubmit = function (e) {onSubmitFilter(e, scope);};
  scope.blur = function (e) {shell.blur(e, scope);};
  scope.focus = function (e) {shell.focus(e, scope);};
  scope.iconViews = [
    function () { return buttonReportView(scope); },
    function () { return buttonBookmarkView(scope); }
  ];
  scope.inputView = function () {
    return inputView(scope);
  };
  shell.registerMouseEvents(scope);

  return scope;
}

function view (scope) {
  return m.component(shell, scope);
}

module.exports = {
  controller: controller,
  view: view
};
