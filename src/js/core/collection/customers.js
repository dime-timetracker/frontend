'use strict';

var Collection = require('../Collection');
var Model = require('../model/Customer');

var customers = new Collection({
  resourceUrl: "customer",
  model: Model
});

module.exports = customers;