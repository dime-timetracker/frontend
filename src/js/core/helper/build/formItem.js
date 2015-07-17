'use strict';

/**
 * Create a view model of a model property.
 *
 * formItem.call(form, model.proerties[0]) =>
 * { key: '', type: 'text', action: func, value: func, values: func }
 *
 * @param  {Object} property model property
 * @return {Object}          view model
 */
var formItem = function(property) {
  var form = this;
  var item = {
    key: property.key,
    type: property.type || 'text',
    value: function() {
      return form.model[property.key];
    }
  };
  
  switch (item.type) {
    case 'relation':
      item.values = function() {
        var result = [];
        property.collection.forEach(function(value) {
          result.push({
            'key': value.alias,
            'value': value.name || value.alias
          });
        });
        return result;
      };

      item.action = function(value) {
        form.model[property.key] = property.collection.find({
          'alias': value
        });
        form.changed = true;
      };
      break;
    default:
      item.action = function(value) {
        form.model[property.key] = value;
        form.changed = true;
      };
  }
  return item;
};

module.exports = formItem;
