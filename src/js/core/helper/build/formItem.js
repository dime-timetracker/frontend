'use strict';

/**
 * Create a view model of a model property.
 *
 * formItem.call(form, 'name', model.properties.name) =>
 * { key: '', type: 'text', action: func, value: func, values: func }
 *
 * @param {String} property property name
 * @param  {Object} options property options
 * @return {Object}          view model
 */
var formItem = function(property, options) {
  var form = this;
  options = options || {};
  var item = {
    key: property,
    type: options.type || 'text',
    value: function() {
      return form.model[property];
    }
  };

  switch (item.type) {
    case 'relation':
      item.values = function() {
        var result = [];
        options.collection.forEach(function(value) {
          result.push({
            'key': value.alias,
            'value': value.name || value.alias
          });
        });
        return result;
      };

      item.action = function(value) {
        form.model[property] = options.collection.find({
          'alias': value
        });
        form.changed = true;
      };
      break;
    default:
      item.action = function(value) {
        form.model[property] = value;
        form.changed = true;
      };
  }
  return item;
};

module.exports = formItem;
