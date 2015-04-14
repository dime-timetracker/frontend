'use strict';

dime.model.Project = function(data) {
  if (!(this instanceof dime.model.Project)) {
      return new dime.model.Project(data);
  }
  _.extend(this, data || {});
};

dime.model.Project.prototype = new dime.Model();
dime.model.Project.prototype.constructor = dime.model.Project;