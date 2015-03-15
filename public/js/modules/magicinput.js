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
      return m("input#magic", {
        placeholder: "Add an activity",
        onchange: magicInput.submit
      });
    }
  }

  dime.modules.magicInput = magicInput;
})(document, dime, moment, m)
