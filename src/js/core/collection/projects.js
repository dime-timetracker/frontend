'use strict';

var Collection = require('../Collection');
var Model = require('../model/Project');

module.exports = new Collection({
  resourceUrl: "project",
  model: Model
});