'use strict';

var m = require('mithril');
var removeButton = require('./removeButton');
var inputs = {
  boolean: require('../../../core/views/inputs/boolean'),
  input: require('../../../core/views/inputs/input'),
  select: require('../../../core/views/inputs/select')
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
          scope.resource.persist(item);
        });
        break;
      case 'relation':
        input = inputs.select(property.resource, item, item[property.key], function update(related) {
          item[property.key] = related;
          scope.resource.persist(item);
        });
        break;
      default:
        input = inputs.input(value, function update(value) {
          item[property.key] = value;
          scope.resource.persist(item);
        }, property.type);
    }

    return m('td.' + property.key, input);
  });

  return m('tr', columns.concat(m("td.empty", removeButton(scope, item))));
};