'use strict';

var m = require('mithril');
var _ = require('lodash');

module.exports = function(content, title) {
  content = content || [];

  var inner = [];
  if (!_.isUndefined(title)) {
    inner.push(m('.card-header', m('.card-inner', m('h1.card-heading', title))));
  }

  inner.push(m('.card-inner', content));


  return m('.card', m('.card-main', inner));
};