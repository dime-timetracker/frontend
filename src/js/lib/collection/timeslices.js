'use strict';

var Collection = require('../Collection');
var Model = require('../model/Timeslice');

var timelices = new Collection({
  resourceUrl: "timeslice",
  model: Model
});

module.exports = timelices;