'use strict';

var _ = require('lodash');
var Model = require('../Model');

var Tag = function (data) {
  if (!(this instanceof Tag)) {
    return new Tag(data);
  }

  Model.call(this, data);
};

Tag.prototype = _.create(Model.prototype, {
  constructor: Tag,
  shortcut: '#',
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
});

module.exports = Tag;