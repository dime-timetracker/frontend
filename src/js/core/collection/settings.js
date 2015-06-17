'use strict';

var Collection = require('../Collection');
var Model = require('../model/Setting');

module.exports = new Collection({
  resourceUrl: "setting",
  model: Model
});