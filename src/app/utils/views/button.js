'use strict';

var m = require('src/lib/mithril');
var t = require('../../../lib/translation');
var isFunction = require('lodash/isFunction');
var isString = require('lodash/isString');

/**
 * Button is mithril virtual element that will generate a float button
 * with a text, an optional action and a optional onclick.
 *
 * @param {string} text Text is displayed as title.
 * @param {string} action
 * @param {function} onclick
 * @param {string} icon
 * @param {string} color
 * @returns {VirtualElement}
 */
module.exports = function (text, action, onclick, icon, color) {
  text = t(text);
  icon = icon || '.icon-add';
  color = color || '.fbtn-red';
  
  var attr = {
    config: m.route,
    title: text
  };

  if (isFunction(onclick)) {
    attr.onclick = onclick;
  }

  if (isString(action)) {
    attr.href = action;
  }

  return m('.fbtn-container', m('.fbtn-inner', 
    m('a[href=""].fbtn' + color, attr, [ m('span.fbtn-text', text), m('span.icon' + icon) ])
  ));
};
