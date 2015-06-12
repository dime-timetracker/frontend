'use strict';

var m = require('mithril');

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
    m('a[href=""].fbtn.fbtn-red', attr, [ m('span.fbtn-text', t(text)), m('span.icon.icon-add') ])
  ));
};
