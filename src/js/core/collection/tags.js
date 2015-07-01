'use strict';

var Collection = require('../Collection');
var Model = require('../model/Tag');

var tags = new Collection({
  resourceUrl: "tag",
  model: Model
});

module.exports = tags;