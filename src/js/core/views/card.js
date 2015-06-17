'use strict';

var m = require('mithril');
var _ = require('lodash');

/**
 * Card is mithril virtual element that generate a card design.
 * @param {mixed} content String or VirtualElement
 * @param {string} title Card title.
 * @returns {VirtualElement}
 */
module.exports = function(content, title) {
  content = content || [];

  var inner = [];
  if (!_.isUndefined(title)) {
    inner.push(m('.card-header', m('.card-inner', m('h1.card-heading', title))));
  }

  inner.push(m('.card-inner', content));

  return m('.card', m('.card-main', inner));
};