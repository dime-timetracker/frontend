'use strict';

dime.model.Customer = function(data) {
  if (!(this instanceof dime.model.Customer)) {
      return new dime.model.Customer(data);
  }
  _.extend(this, data || {});
};

dime.model.Customer.prototype = new dime.Model();
dime.model.Customer.prototype.constructor = dime.model.Customer;
