'use strict';

var m = require('src/lib/mithril');
var isUndefined = require('lodash/isUndefined');

/**
 * Card is mithril virtual element that generate a card design.
 * @param {mixed} content String or VirtualElement
 * @param {string} title optional card title
 * @returns {VirtualElement}
 */
module.exports  = function(content, action, title) {
  var inner = [];
  if (!isUndefined(title)) {
    inner.push(m('.card-header', m('.card-inner', m('h1.card-heading', title))));
  }

  inner.push(m('.card-inner', content || []));

  if (!isUndefined(action)) {
    inner.push(m('.card-action', action));
  }

  return m('.card', m('.card-main', inner));
};
