'use strict';

var m = require('mithril');
var isUndefined = require('lodash/lang/isUndefined');

/**
 * Card is mithril virtual element that generate a card design.
 * @param {mixed} content String or VirtualElement
 * @param {string} title optional card title
 * @returns {VirtualElement}
 */
module.exports = function(content, title) {
  var inner = [];
  if (!isUndefined(title)) {
    inner.push(m('.card-header', m('.card-inner', m('h1.card-heading', title))));
  }

  inner.push(m('.card-inner', content || []));

  return m('.card', m('.card-main', inner));
};
