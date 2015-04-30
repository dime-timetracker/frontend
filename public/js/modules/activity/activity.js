'use strict';

(function (dime, _, moment, m) {

  dime.modules.activity = {
    controller: function () {
      var scope = {
        activities: [],
        filter: {
          help: false,
          suggestions: []
        }
      };

      dime.modules.activity.fetch = function(addUrl) {
        dime.resources.activity.fetch(addUrl).then(function (result) {
          dime.authorized = true;
          var activities = new dime.Collection({
            model: dime.model.Activity
          }, dime.resources.activity.findAll() || []);
          dime.events.emit('activity-view-collection-load', {
            collection: activities,
            scope: scope
          });

          // filter activities
          _.forEach(dime.modules.activity.filters, function(filter) {
            activities.filter(filter);
          });

          scope.activities = activities.findAll();
        });
      }

      dime.modules.activity.fetch();

      return scope;
    },
    view: function (scope) {

      var addActivity = function addActivity () {
        dime.resources.activity.persist({
          description: t('(Click here to enter a description!)'),
          timeslices: []
        });
      }

      var list = scope.activities.map(dime.modules.activity.views.item);

      if (dime.modules.setting.local.activityShowLoadMore) {
        list.push(m('div', m('a[href=#].btn.btn-block.margin-top', {
          onclick: function () {
            dime.modules.activity.fetch(dime.modules.setting.local.activityPager.next);
            return false;
          }
        }, t('Show more'))));
      }

      var addButton = m('.fbtn-container',
        m('.fbtn-inner',
          m('a[href=#].fbtn.fbtn-red', {
            onclick: addActivity
          }, [
            m('span.fbtn-text', t('Add Activity')),
            m('span.icon.icon-add'),
          ])
        )
      );

      return [ m(".tile-wrap", [ list, addButton ]), ];
    },
    views: {}
  };

  dime.modules.activity.filters = {
    'default': function (activity) { return true; }
  };

  var getLatestUpdate = function (activity) {
    var latestUpdate = 0;
    if (false === _.isEmpty(activity.timeslices)) {
      return activity.timeslices.reduce(function (prevMax, item) {
        return prevMax < item.updatedAt ? item.updatedAt : prevMax;
      }, activity.updatedAt);
    }
    return activity.updatedAt;
  };

  // register route
  dime.routes['/'] = dime.modules.activity;

  // register resource
  dime.resources.activity = new Resource({
    url: dime.apiUrl + "activity",
    model: dime.model.Activity,
    fail: dime.modules.login.redirect,
    success: dime.modules.login.success,
    sort: function (activityA, activityB) {
      var a = getLatestUpdate(activityA);
      var b = getLatestUpdate(activityB);

      if (a > b) {
        return -1;
      }
      if (a < b) {
        return 1;
      }
      return 0;
    }
  }, function handleHeader (xhr, options) {
    if ('GET' === options.method) {
      dime.modules.setting.local.activityPager = {};
      var links = xhr.getResponseHeader('X-Dime-Link').split(', ');
      links.forEach(function (link) {
        var url = link.split('; ')[0];
        var rel = link.match(/ rel="?(.+)"?$/)[1];
        dime.modules.setting.local.activityPager[rel] = url;
      });
      var pagerUrls = dime.modules.setting.local.activityPager;
      dime.modules.setting.local.activityShowLoadMore = (pagerUrls.next == pagerUrls.next);
    }
  });

  // add settings section
  dime.settings.activity = {
    title: t('Activity'),
    description: t('Activity settings'),
    children: {
      display: {
        title: t('Display settings'),
        children: {}
      }
    }
  }

})(dime, _, moment, m)
