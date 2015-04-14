'use strict';

dime.model.Tag = function(data) {
  if (!(this instanceof dime.model.Tag)) {
      return new dime.model.Tag(data);
  }
  _.extend(this, data || {});
};

dime.model.Tag.prototype = new dime.Model();
dime.model.Tag.prototype.constructor = dime.model.Tag;