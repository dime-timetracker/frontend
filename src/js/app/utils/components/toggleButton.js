'use strict';

var m = require('mithril');
var isFunction = require('lodash/lang/isFunction');

var toggleButton = {
  controller: function(iconName, startState, action) {
    var scope = {
      state: startState,
      iconName: iconName
    };

    scope.onclick = function(e) {
      if (e) {
        e.preventDefault();
      }
      scope.state = !scope.state;
      if (isFunction(action)) {
        action(scope.state);
      }
    };
    return scope;
  },
  view: function(scope) {
    var attr = {};
    var icon = scope.iconName;
    if (scope.state) {
      icon = '.icon-close';
    }
    attr.onclick = scope.onclick;

    return m('a.btn.btn-flat', attr, m('span.icon.icon-lg' + icon));
  }
};

module.exports = toggleButton;
