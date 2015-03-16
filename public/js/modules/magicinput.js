'use strict';

(function (document, dime, moment, m) {
  var magicInput = {
    controller: function () {
      dime.store.get('customers');
      dime.store.get('projects');
      dime.store.get('services');
      dime.store.get('tags');
    },
    submit: function (e) {
      var newActivity = dime.parser.parse(e.target.value);
      var timeslice = {
        startedAt: _.isEmpty(newActivity.startedAt) ? moment().format('YYYY-MM-DD HH:mm:ss') : newActivity.startedAt,
      };
      if (false == _.isEmpty(newActivity.stoppedAt)) {
        timeslice.stoppedAt = newActivity.stoppedAt;
      }
      var customer = dime.store.find('customers', {
        alias: newActivity.customer.alias
      });
      var project = dime.store.find('projects', {
        alias: newActivity.project.alias
      });
      var service = dime.store.find('services', {
        alias: newActivity.service.alias
      });
      if (_.isUndefined(customer)
        && false === _.isUndefined(project)
      ) {
        customer = project.customer;
      }
      if (false === _.isUndefined(customer)) {
        newActivity.customer = customer.id;
      }
      if (false === _.isUndefined(project)) {
        newActivity.project = project.id;
      }
      if (false === _.isUndefined(service)) {
        newActivity.service = service.id;
      }
      if (_.isArray(newActivity.tags)) {
        newActivity.tags = newActivity.tags.map(function (tag) {
          return {'name': tag};
        })
      }

      dime.store.add('activities', newActivity).done(function (newActivity) {
        timeslice.activity = newActivity.id;
        newActivity.timeslices.push(timeslice);
        dime.store.add('timeslices', timeslice);
        dime.store.get('activities').done(function(activities) {
          e.target.value = '';
          m.redraw();
        });
      });
    },
    view: function (items) {
      return [
        m("input", {
          placeholder: "Add an activity",
          onchange: magicInput.submit
        }),
        m("div.help", [
          m("div.basics", 'Enter a description to start an activity.'),
          m("ul", [
            m("li.dates.duration", 'You may specify a duration by entering something like 1h 10m or 1:10.'),
            m("li.dates.start", 'You may specify a start by entering something like 13:50-'),
            m("li.dates.end", 'You may specify an end by entering something like -15:10'),
            m("li.dates.start-and-end", 'You may specify start and end by entering something like 13:50-15:10'),
            m("li.customer", 'Use "@" to specify a customer.'),
            m("li.project", 'Use "/" to specify a project.'),
            m("li.service", 'Use ":" to specify a service.'),
            m("li.tags", 'Use "#" to add tags.'),
          ])
        ])
      ];
    }
  }

  dime.modules.magicInput = magicInput;
})(document, dime, moment, m)
