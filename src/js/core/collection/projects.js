'use strict';

var Collection = require('../Collection');
var Model = require('../model/Project');

var projects = new Collection({
  resourceUrl: "project",
  model: Model
});

module.exports = projects;