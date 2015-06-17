'use strict';

var m = require('mithril');
var _ = require('lodash');
var helper = require('../../helper');

// TODO Resource as parameter

module.exports = function (type, related, relationType, onchange) {
  relationType = relationType || 'activity';
  var model = dime.model[helper.ucFirst(type)];

  related[type] = related[type] || dime.resources[type].create({});
  var items = _.sortBy(dime.resources[type], 'name') || [];
  var options = items.map(function (item, key) {
    return m('option', {
      value: key,
      selected: (related[type].alias === item.alias)
    }, (item.name || '(' + model.shortcut + item.alias + ')'));
  });

  return m('select.form-control', {
    onchange: function (e) {
      onchange(items[e.target.options[e.target.selectedIndex].value]);
    }
  }, options);
};
