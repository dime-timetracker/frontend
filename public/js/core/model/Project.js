'use strict';

dime.model.Project = function(data) {
  if (!(this instanceof dime.model.Project)) {
      return new dime.model.Project(data);
  }
  _.extend(this, data || {});
};

dime.model.Project.properties = function properties(model) {
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
        key: 'rate',
        title: 'rate',
        type: 'number'
      },
      {
        key: 'enabled',
        title: 'enabled',
        type: 'boolean'
      }
    ]
  };
  dime.events.emit('model-project-properties', context);
  return context.properties;
}

dime.model.Project.prototype = new dime.Model();
dime.model.Project.prototype.constructor = dime.model.Project;
