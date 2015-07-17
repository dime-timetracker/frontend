'use strict';

var create = require('lodash/object/create');
var Model = require('../Model');

var Tag = function (data) {
  if (!(this instanceof Tag)) {
    return new Tag(data);
  }

  Model.call(this, data);
};

Tag.prototype = create(Model.prototype, {
  constructor: Tag,
  shortcut: '#',
  properties: {
    name: {
      type: 'text'
    },
    enabled: {
      type: 'boolean'
    }
  }
});

module.exports = Tag;
