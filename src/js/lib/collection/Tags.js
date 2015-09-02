'use strict';

var create = require('lodash/object/create');

var Collection = require('../Collection');
var Tag = require('../model/Tag');

var Tags = function (data) {
  if (!(this instanceof Tags)) {
    return new Tags(data);
  }

  Collection.call(this, {
    resourceUrl: 'tag',
    model: Tag
  }, data);
};

Tags.prototype = create(Collection.prototype, {
  constructor: Tags
});

Tags.prototype.hasRunning = function () {
  return this.some(function (timeslice) {
    return timeslice.isRunning();
  });
};

Tags.prototype.findRunningTimeslice = function () {
  return this.find(function (timeslice) {
    return timeslice.isRunning();
  });
};

module.exports = Tags;
