'use strict';

var _ = require('lodash');
var Model = require('../Model');

var Tag = function (data) {
  if (!(this instanceof Tag)) {
    return new Tag(data);
  }
  _.extend(this, {}, data);
};

Tag.prototype = new Model();
Tag.prototype.constructor = Tag;

Tag.shortcut = '#';

Tag.properties = function (model) {
  var context = {
    model: model,
    properties: [
      {
        key: 'name',
        title: 'name',
        type: 'text'
      },
      {
        key: 'alias',
        title: 'alias',
        type: 'text'
      },
      {
        key: 'enabled',
        title: 'enabled',
        type: 'boolean'
      }
    ]
  };
  return context.properties;
};

module.exports = Tag;