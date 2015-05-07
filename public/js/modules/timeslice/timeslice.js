'use strict';

(function (dime, t, m, moment) {

  dime.modules.timeslice = {
    controller: function () {
      var scope = {};

      scope.columns = {
        'duration': {
          getter: function(timeslice) { return dime.helper.duration.format(timeslice.totalDuration()); },
          weight: 10,
          width: 2
        },
        'description': {
          getter: function(timeslice) { return timeslice.activity.description; },
          weight: 10,
          width: 5
        },
        'startedAt': {
          getter: function(timeslice) { return timeslice.startedAt; },
          weight: 10,
          width: 2
        },
        'stoppedAt': {
          getter: function(timeslice) { return timeslice.stoppedAt; },
          weight: 10,
          width: 2
        }
      };

      dime.modules.timeslice.fetch = function (addUrl) {
        dime.resources.timeslice.fetch({ url: addUrl }).then(function (result) {
          dime.authorized = true;
          dime.modules.timeslice.applyFilter();
        });
      };

      dime.modules.timeslice.applyFilter = function () {
        scope.timeslices = dime.resources.timeslice;

        dime.events.emit('timeslice-view-collection-load', {
          collection: dime.resources.timeslice,
          scope: scope
        });
        _.forEach(dime.modules.timeslice.filters, function(filter) {
          dime.resources.timeslice.filter(filter);
        });
      };

      dime.modules.timeslice.fetch();

      return scope;
    },
    view: function(scope) {

      var list = scope.timeslices.map(function (timeslice, idx) {
        return dime.modules.timeslice.views.item(timeslice, idx, scope.columns)
      });

      return m(".tile-wrap", list);
    },
    views: {}
  };

  // register route
  dime.routes['/report'] = dime.modules.timeslice;

  // register resource
  dime.resources.timeslice = new dime.Collection({
    url: 'timeslice',
    model: dime.model.Timeslice,
    fail: dime.modules.login.redirect,
    success: dime.modules.login.success
  });

  // add menu item
  dime.menu.push({
    id: 'report',
    route: '/report',
    name: 'Report',
    icon: 'icon-assignment',
    weight: 200
  });
 
})(dime, t, m, moment);
