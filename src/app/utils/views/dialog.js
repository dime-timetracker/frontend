'use strict';

var m = require('src/lib/mithril');

module.exports = function(content, footer, title) {
  var inner = [];

  if (title) {
    inner.push(m('.modal-heading', m('h2.modal-title', title)));
  }

  if (content) {
    inner.push(m('.modal-inner', content));
  }

  if (footer) {
    inner.push(m('.modal-footer', footer));
  }

  return m('.modal.fade.in', { style: "display: block;" }, m('.modal-dialog', m('.modal-content', inner)));
};