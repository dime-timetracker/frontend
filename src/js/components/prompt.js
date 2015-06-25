'use strict';

var m = require('mithril');

module.exports = {
  controller: function (parentScope) {
    var scope = {
      htmlId: parentScope.htmlId,
      icon: parentScope.icon,
      iconViews: parentScope.iconViews || [],
      inputView: parentScope.inputView,
      shortcut: parentScope.shortcut,
    };
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
