'use strict';

var Collection = require('../Collection');
var Model = require('../model/Tag');

module.exports = new Collection({
  resourceUrl: "tag",
  model: Model
});