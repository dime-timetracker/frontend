;(function (dime) {
  'use strict';

  var module = dime.modules.header = {};

  module.controller = function () {
    var scope = {};

    scope.icon = dime.icon || 'icon-access-time';
    scope.name = dime.name || 'Dime Timetracker';
    scope.views = [ dime.modules.header.views.logo ];

    dime.events.emit('header-before-view', scope);

    return scope;
  };
  
  module.view = function (scope) {
    var content = [], 
        i = 0;
    for (; i < scope.views.length; i++) {
      if (_.isFunction(scope.views[i])) {
        content.push(scope.views[i](scope));
      }
    }
    return content;
  };

  module.views = {
    logo: function (scope) {
      return m('a[href="#/"].header-logo', [m('span.icon.' + scope.icon), ' ', scope.name]);
    }
  };

})(dime);