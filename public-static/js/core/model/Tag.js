(function (dime, _) {
  'use strict';

  var Tag = function (data) {
    if (!(this instanceof Tag)) {
      return new Tag(data);
    }
    _.extend(this, data || {});
  };

  Tag.prototype = new dime.Model();
  Tag.prototype.constructor = Tag;

  dime.model.Tag = Tag;

  Tag.shortcut = '#';

  Tag.properties = function (model) {
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
          key: 'enabled',
          title: 'enabled',
          type: 'boolean'
        }
      ]
    };
    dime.events.emit('model-tag-properties', context);
    return context.properties;
  };


})(dime, _, moment);