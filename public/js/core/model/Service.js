;(function (dime, _) {
  'use strict';

  var Service = function (data) {
    if (!(this instanceof Service)) {
      return new Service(data);
    }
    _.extend(this, data || {});
  };

  Service.prototype = new dime.Model();
  Service.prototype.constructor = Service;

  dime.model.Service =  Service;

  Service.shortcut = ':';

  Service.properties = function (model) {
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
  };

})(dime, _);