'use strict';

dime.model.Customer = function(data) {
  if (!(this instanceof dime.model.Customer)) {
      return new dime.model.Customer(data);
  }
  _.extend(this, data || {});
};

dime.model.Customer.shortcut = '@';

dime.model.Customer.properties = function properties (model) {
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
}

dime.model.Customer.prototype = new dime.Model();
dime.model.Customer.prototype.constructor = dime.model.Customer;
