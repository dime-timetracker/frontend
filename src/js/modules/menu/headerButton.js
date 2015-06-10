'use strict';

var m = require('mithril');

module.exports = {
  controller: function (parentScope) {
    var scope = {};
    scope.state = parentScope.menuState || 'closed';
    scope.toggleState = function () {
      scope.state = 'open' === scope.state ? 'closed' : 'open';
      return false;
    }
    scope.active = scope.state === 'open' ? '.active' : '';
    return scope;
  },
  view: function (scope) {
    return m('ul.nav.nav-list.pull-left',
      m('li.' + scope.active, m('a[href=#].menu-toggle', {
         onclick: scope.toggleState,
         onmouseleave: function(e) { scope.state = 'closed' },
         onmouseenter: function(e) { scope.state = 'open' }
      }, [
        m('span.access-hide', 'Menu'),
        m('span.icon.icon-lg.icon-menu'),
        m('span.header-close.icon.icon-lg.icon-close')
      ]))
    );
  }
};
