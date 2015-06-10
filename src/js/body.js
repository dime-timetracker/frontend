'use strict';

var m = require('mithril');
var header = require('./modules/header');
var menu = require('./modules/menu');

module.exports = function (content, scope) {
  return m('div', [
    m('#app-header', m.component(header, scope)),
    m('#app-menu', m.component(menu, scope)),
    m('.content', [
      m('.content-heading'),
      m('.content-inner', [
//        m('#prompt-container.container', prompts),
        content
      ])
    ]),
    m('#modal'),
  ]);
}
