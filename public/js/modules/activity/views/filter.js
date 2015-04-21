'use strict';

(function (dime, m, moment, _) {

  dime.modules.activity.views.filter = function filterView (scope) {

    var tile = function(property, filter) {
      return m('.tile', [
        m('.pull-left.tile-side', property.title),
        m('.tile-inner', filter)
      ]);
    };

    var properties = dime.model.Activity.properties();

    return m('.tile-wrap.filter',
      properties.map(function renderPropertyFilter(property) {
        switch (property.type) {
          /*
          case 'boolean':
            return tile(property, dime.inputs.boolean(item, 0, onchange));
            */
          case 'relation':
            return tile(property, dime.inputs.input(
              'text',
              dime.modules.activity.filters[property.key] ? dime.modules.activity.filters[property.key].value : '',
              function (value) {
                dime.modules.activity.filters[property.key] = {
                  value: value,
                  by: function (activity) {
                    var nameAndAlias = activity[property.key].name + ' ' + activity[property.key].alias;
                    return _.isObject(activity[property.key]) && (_.contains(nameAndAlias, value));
                  }
                };
              }
            ));
          case 'tags':
            return tile(property, 'Tags filter not yet implemented');
          default:
            return tile(property, dime.inputs.input(
              property.type,
              dime.modules.activity.filters[property.key] ? dime.modules.activity.filters[property.key].value : '',
              function (value) {
                dime.modules.activity.filters[property.key] = {
                  value: value,
                  by: function (activity) {
                    return _.contains(activity.description, value);
                  }
                };
              }
            ));
        }
      })
    );
  };

})(dime, m, moment, _);
