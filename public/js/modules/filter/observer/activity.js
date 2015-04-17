'use strict';

(function (dime, m, _) {

  dime.events.on('activity-view-collection-load', function(context) {
    _.forEach(context.scope.filters, function(filter) {
      context.collection.filter(filter);
    });
      
  });

})(dime, m, _);
