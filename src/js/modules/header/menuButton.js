'use strict';

var m = require('mithril');

module.exports = {
  controller: function (scope) {
    console.log('RENDER MENU BUTTON');
    return scope;
  },
  view: function (scope) {
    return m('ul.nav.nav-list.pull-left',
      m('li.' + scope.state, m('a[href=#].menu-toggle', {
        onclick: scope.toggle
      }, [
        m('span.access-hide', 'Menu'),
        m('span.icon.icon-lg.icon-menu'),
        m('span.header-close.icon.icon-lg.icon-close')
      ]))
    );
  }
};
