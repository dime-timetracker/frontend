'use strict';

var create = require('lodash/object/create');
var Model = require('../Model');

var Setting = function (data) {
  if (!(this instanceof Setting)) {
    return new Setting(data);
  }

  Model.call(this, data);
};

Setting.prototype = create(Model.prototype, {
  constructor: Setting
});

module.exports = Setting;
