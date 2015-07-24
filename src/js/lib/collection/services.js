'use strict';

var Collection = require('../Collection');
var Model = require('../model/Service');

var services = new Collection({
  resourceUrl: "service",
  model: Model
});

module.exports = services;