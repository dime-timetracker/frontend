;(function (dime, _) {
  'use strict';

  var Setting = function (data) {
    if (!(this instanceof Setting)) {
      return new Setting(data);
    }
    _.extend(this, data || {});
  };

  Setting.prototype = new dime.Model();
  Setting.prototype.constructor = Setting;

  dime.model.Setting = Setting;
  
})(dime, _);