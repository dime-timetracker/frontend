'use strict';

var m = require('mithril');
var _ = require('lodash');
var removeButton = require('./removeButton');
var form = {
  input: require('../../../core/views/form/input'),
  select: require('../../../core/views/form/select'),
  selectBoolean: require('../../../core/views/form/selectBoolean')
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

var item = function (scope, item) {
  var columns = [];
  return m('tr', columns.concat(m("td.empty", removeButton(scope, item))));
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
      input = form.selectBoolean(value, function update(e) {
        var idx = e.target.selectedIndex;
        var value = e.target.options[idx].value;
        
        item[property.key] =  value;
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

      input = form.select(values, function update(e) {
        var idx = e.target.selectedIndex;
        var key = e.target.options[idx].value;

        item[property.key] = collection.find({
          'alias': key
        });
        scope.collection.persist(item);
      }, value.alias);
      break;
    default:
      input = form.input(value, function update(value) {
        item[property.key] = value;
        scope.collection.persist(item);
      }, property.type);
    }

    return m('td.' + property.key, input);
  });

  return m('tr', columns.concat(m("td.empty", removeButton(scope, item))));
};
