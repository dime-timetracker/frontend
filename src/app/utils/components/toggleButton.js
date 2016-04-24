'use strict';

var m = require('mithril');

function controller(args) {
  var scope = {
    currentState: args.currentState,
    iconName: args.iconName
  };

  scope.onclick = function(e) {
    if (e) {
      e.preventDefault();
    }
    args.changeState(!args.currentState());
  };
  return scope;
}

function view(scope) {
  var icon = scope.iconName;
  if (scope.currentState()) {
    icon = '.icon-close';
  }
  return m('a.btn.btn-flat', { onclick: scope.onclick }, m('span.icon.icon-lg' + icon));
}

module.exports = {
  controller: controller,
  view: view
};
