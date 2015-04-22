'use strict';

(function (dime, m, _) {

  dime.events.on('activity-view-collection-load', function(context) {
    _.forEach(dime.modules.activity.filters, function(filter) {
      context.collection.filter(filter);
    });
      
  });

})(dime, m, _);
