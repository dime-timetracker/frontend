'use strict';

var m = require('mithril');
var _ = require('lodash');

/**
 * Button is mithril virtual element that will generate a float button
 * with a text, an optional action and a optional onclick.
 *
 * @param {string} text Text is displayed as title.
 * @param {string} action
 * @param {function} onclick
 * @returns {VirtualElement}
 */
module.exports = function (text, action, onclick) {
  var attr = {
    config: m.route,
    title: text
  };

  if (_.isFunction(onclick)) {
    attr.onclick = onclick;
  }

  if (_.isString(action)) {
    attr.href = action;
  }

  return m('.fbtn-container', m('.fbtn-inner', 
    m('a[href=""].fbtn.fbtn-red', attr, [ m('span.fbtn-text', text), m('span.icon.icon-add') ])
  ));
};
