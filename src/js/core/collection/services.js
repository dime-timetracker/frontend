'use strict';

var Collection = require('../Collection');
var Model = require('../model/Service');

module.exports = new Collection({
  resourceUrl: "service",
  model: Model
});