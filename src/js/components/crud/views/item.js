'use strict';

var m = require('mithril');
var _ = require('lodash');
var removeButton = require('./removeButton');
var inputs = {
  boolean: require('../../../core/views/inputs/boolean'),
  input: require('../../../core/views/inputs/input'),
  select: require('../../../core/views/inputs/select')
};
var models = {
  customer: require('../../../core/model/Customer'),
  project: require('../../../core/model/Project'),
  service: require('../../../core/model/Service')
};
var collections = {
  customer: require('../../../core/collection/customers'),
  project: require('../../../core/collection/projects'),
  service: require('../../../core/collection/services')
};

module.exports = function (scope, item) {

  var columns = scope.properties.map(function (property) {
    if (_.isUndefined(property.type)) {
      property.type = 'text';
    }
    var value = item[property.key];
    if (_.isFunction(property.get)) {
      value = property.get(item);
    }
    var input;
    switch (property.type) {
    case 'boolean':
      input = inputs.boolean(value, function update(value) {
        item[property.key] = value;
        scope.collection.persist(item);
      });
      break;
    case 'relation':
      var values = [];

      var collection = collections[property.resource];
      _.forOwn(collection, function (value, key) {
        values.push({
          'key': value.alias,
          'value': value.name || value.alias
        });
      });

      input = inputs.select(values, function update(e) {
        var idx = e.target.selectedIndex;
        var key = e.target.options[idx].value;

        item[property.key] = collection.find({
          'alias': key
        });
        scope.collection.persist(item);
      }, value.alias);
      break;
    default:
      input = inputs.input(value, function update(value) {
        item[property.key] = value;
        scope.collection.persist(item);
      }, property.type);
    }

    return m('td.' + property.key, input);
  });

  return m('tr', columns.concat(m("td.empty", removeButton(scope, item))));
};
