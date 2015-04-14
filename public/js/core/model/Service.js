'use strict';

dime.model.Service = function(data) {
  if (!(this instanceof dime.model.Service)) {
      return new dime.model.Service(data);
  }
  _.extend(this, data || {});
};

dime.model.Service.prototype = new dime.Model();
dime.model.Service.prototype.constructor = dime.model.Service;