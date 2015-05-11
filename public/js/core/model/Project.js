;(function (dime, _) {
  'use strict';

  var Project = function (data) {
    if (!(this instanceof Project)) {
      return new Project(data);
    }
    _.extend(this, data || {});
  };
  Project.prototype = new dime.Model();
  Project.prototype.constructor = Project;

  dime.model.Project = Project;

  Project.shortcut = '/';

  Project.properties = function (model) {
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
  };

})(dime, _);