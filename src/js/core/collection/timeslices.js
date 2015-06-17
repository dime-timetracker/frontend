'use strict';

var Collection = require('../Collection');
var Model = require('../model/Timeslice');

module.exports = new Collection({
  resourceUrl: "timeslice",
  model: Model
});