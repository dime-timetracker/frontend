'use strict';

/**
 * Generate a property model, which contain a binding between model and its properties.
 *
 * propertyModel.call(model-instance, propertyKey, propertyOptions) => {
 *   key: propertyKey,
 *   type: propertyType,
 *   value: func, // return the value of model[propertyKey]
 *   action: func, // updates the value of model[propertyKey]
 *   values: func // returns an array of values for a select field
 * }
 *
 * @param  {String} property
 * @param  {Obejct} options
 * @return {Object}
 */
function propertyModel(property, options) {
   /*jshint validthis:true */
  var model = this;
  options = options || {};

  var item = {
    key: property,
    type: options.type || 'text',
    value: function() {
      return model[property];
    },
    update: function(value) {
      model[property] = value;
    }
  };

  switch (item.type) {
    case 'select':
      item.values = function() {
        return options.values;
      };
      break;
    case 'relation':
      item.values = function() {
        var result = [{ 'key': '', 'value': '' }];
        options.collection.forEach(function(value) {
          result.push({
            'key': value.alias,
            'value': value.name || value.alias
          });
        });
        return result;
      };
      item.update = function(value) {
        model[property] = options.collection.find({
          'alias': value
        });
      };
      break;
  }
  return item;
}

module.exports = propertyModel;
