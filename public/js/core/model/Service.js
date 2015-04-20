'use strict';

dime.model.Service = function(data) {
  if (!(this instanceof dime.model.Service)) {
      return new dime.model.Service(data);
  }
  _.extend(this, data || {});
}

dime.model.Service.shortcut = ':';

dime.model.Service.properties = function properties (model) {
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
  dime.events.emit('model-service-properties', context);
  return context.properties;
}

dime.model.Service.prototype = new dime.Model();
dime.model.Service.prototype.constructor = dime.model.Service;
