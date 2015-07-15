'use strict';

var m = require('mithril');
var t = require('../../translation');

var headerWithDescription = function (configPath) {
  var header = [t('config.' + configPath + '.title')];
  var description = t('config.' + configPath + '.description');
  if (0 !== description.indexOf('@@')) {
    header.push(m('span.help', description));
  }
  return header;
};

module.exports = headerWithDescription;