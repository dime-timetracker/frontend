'use strict';

var m = require('mithril');
var forOwn = require('lodash/object/forOwn');
var cardView = require('../../core/views/card');
var headerWithDescription = require('./headerWithDescription');
var form = require('./form');

var card = function (section) {
  var content = [];

  // sections
  var children = [];
  forOwn(section.children, function (value, ckey) {
    children.push(m('p.card-heading', headerWithDescription(value)));

    forOwn(value.children, function (v) {
      children.push(form(v));
    });
  });
  if (children.length > 0) {
    content.push(m('h2.content-sub-heading', headerWithDescription(section)));
    content.push(cardView(children));
  }
  return content;
};

module.exports = card;