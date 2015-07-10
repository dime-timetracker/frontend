'use strict';

var m = require('mithril');
var mousetrap = require('mousetrap-pause')(require('mousetrap'));
var configuration = require('../core/configuration');

function blur (e) {
  mousetrap.unpause();
  e.target.value = '';
  e.target.blur();
}

function focus (e, scope) {
  mousetrap.pause();

  mousetrap(e.target).bind(configuration.get('shell/shortcuts/blurShell'), function () {
    blur(e, scope);
  });

  /*
  mousetrap(e.target).bind(configuration.get('shell/shortcuts/triggerAutocompletion'), function (triggerEvent) {
    scope.module.autocomplete(triggerEvent, scope);
    return false;
  });
  mousetrap(e.target).bind(configuration.get('shell/shortcuts/cycleSuggestionsLeft'), function () {
    scope.module.cycleSuggestions('left', e, scope);
    return false;
  });
  mousetrap(e.target).bind(configuration.get('shell/shortcuts/cycleSuggestionsRight'), function () {
    scope.module.cycleSuggestions('right', e, scope);
    return false;
  });
  mousetrap(e.target).bind('space', function () {
    scope.module.clearSuggestions(e, scope);
  });
  */

  mousetrap(e.target).bind(configuration.get('shell/shortcuts/submitShell'), function () {
    scope.onSubmit(e, scope);
  });
}

module.exports = {
  controller: function (parentScope) {
    var scope = {
      htmlId: parentScope.htmlId,
      icon: parentScope.icon,
      iconViews: parentScope.iconViews || [],
      inputView: parentScope.inputView,
      shortcut: parentScope.shortcut,
    };
    scope.focus = function (e) {focus(e, scope);};
    scope.blur = function (e) {blur(e, scope);};
    return scope;
  },
  view: function (scope) {
    var parts = scope.iconViews.map(function (view) {
      return view();
    });
    parts.unshift(
      m('.media-object.pull-left',
        m('label.form-icon-label', {
          for: scope.htmlId
        }, m('span.icon.' + scope.icon))
      )
    );
    parts.push(m('.media-inner', scope.inputView()));
    return m('.media', parts);
  }
};
