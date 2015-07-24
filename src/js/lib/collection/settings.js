'use strict';

var Collection = require('../Collection');
var Model = require('../model/Setting');

var settings = new Collection({
  resourceUrl: "setting",
  model: Model
});

module.exports = settings;