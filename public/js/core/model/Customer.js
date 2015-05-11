;(function (dime, _) {
  'use strict';

  var Customer = function (data) {
    if (!(this instanceof Customer)) {
      return new Customer(data);
    }
    _.extend(this, data || {});
  };
  Customer.prototype = new dime.Model();
  Customer.prototype.constructor = dime.model.Customer;

  dime.model.Customer =  Customer;

  Customer.shortcut = '@';
  Customer.properties = function (model) {
    var context = {
      model: model,
      properties: [
        {
          key: 'name',
          title: 'name',
          type: 'text'
        },
        {
          key: 'alias',
          title: 'alias',
          type: 'text'
        },
        {
          key: 'enabled',
          title: 'enabled',
          type: 'boolean'
        }
      ]
    };
    dime.events.emit('model-customer-properties', context);
    return context.properties;
  };

})(dime, _);
