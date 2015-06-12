'use strict';

var m = require('mithril');
var _ = require('lodash');

module.exports  = function(content, action, title) {
  content = content || [];

  var inner = [];
  if (!_.isUndefined(title)) {
    inner.push(m('.card-header', m('.card-inner', m('h1.card-heading', title))));
  }

  inner.push(m('.card-inner', content));

  if (!_.isUndefined(action)) {
    inner.push(m('.card-action', action));
  }

  return m('.card', m('.card-main', inner));
};

