'use strict';

var _ = require('lodash');
var Model = require('../Model');

var Setting = function (data) {
  if (!(this instanceof Setting)) {
    return new Setting(data);
  }
  _.extend(this, {}, data);
};

Setting.prototype = new Model();
Setting.prototype.constructor = Setting;

module.exports = Setting;