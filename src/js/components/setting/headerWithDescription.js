'use strict';

var m = require('mithril');
var t = require('../../translation');

var headerWithDescription = function (config) {
  var header = [t(config.title)];
  if (config.description) {
    header.push(m('span.help', t(config.description)));
  }
  return header;
};

module.exports = headerWithDescription;