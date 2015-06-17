'use strict';

var Collection = require('../Collection');
var Model = require('../model/Customer');

module.exports = new Collection({
  resourceUrl: "customer",
  model: Model
});