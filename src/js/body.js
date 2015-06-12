'use strict';

var m = require('mithril');
var header = require('./modules/header');

module.exports = function (content, scope) {
  return m('div', [
    m('#app-header', m.component(header, scope)),
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
