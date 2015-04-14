'use strict';

dime.model.Setting = function(data) {
  if (!(this instanceof dime.model.Setting)) {
      return new dime.model.Setting(data);
  }
  _.extend(this, data || {});
};

dime.model.Setting.prototype = new dime.Model();
dime.model.Setting.prototype.constructor = dime.model.Setting;