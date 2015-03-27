'use strict';

(function (dime, moment, m) {

  dime.modules.prompt = {
    controller: function () {
      var scope = {
        help: false
      };

      return scope;
    },
    view: function (scope) {
      var showHelp = ".hide";
      if (scope.help) {
        showHelp = "";
      }
      
      return m(".card", 
        m(".card-main", 
          m(".card-inner", [
            m("input.form-control", {
              placeholder: "Add an activity",
              onfocus: function() { scope.help = true },
              onblur: function() { scope.help = false },
              onchange: submit
            }),
            m("div.form-help.form-help-msg" + showHelp, [
              m("span.basics", 'Enter a description to start an activity.'),
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
          ])
        )
      );
    }
  };

  var submit = function (e) {
    var newActivity = dime.parser.parse(e.target.value);
    var timeslice = {
      startedAt: _.isEmpty(newActivity.startedAt) ? moment().format('YYYY-MM-DD HH:mm:ss') : newActivity.startedAt,
    };

    if (false == _.isEmpty(newActivity.stoppedAt)) {
      timeslice.stoppedAt = newActivity.stoppedAt;
    }

    if (newActivity.customer && newActivity.customer.alias) {
      var customer = dime.resources.customer.find({
        alias: newActivity.customer.alias
      });
      if (false === _.isUndefined(customer)) {
        newActivity.customer = customer.id;
      }
    }

    if (newActivity.project && newActivity.project.alias) {
      var project = dime.resources.project.find({
        alias: newActivity.project.alias
      });
      if (false === _.isUndefined(project)) {
        newActivity.project = project.id;
      }
    }
    if (false === _.isNumber(newActivity.customer)
      && false === _.isUndefined(project)
    ) {
      newActivity.customer = project.customer.id;
    }

    if (newActivity.service && newActivity.service.alias) {
      var service = dime.resources.service.find({
        alias: newActivity.service.alias
      });
      if (false === _.isUndefined(service)) {
        newActivity.service = service.id;
      }
    }

    if (_.isArray(newActivity.tags)) {
      newActivity.tags = newActivity.tags.map(function (tag) {
        return {'name': tag};
      })
    }

    dime.resources.activity.persist(newActivity).then(function (newActivity) {
      timeslice.activity = newActivity.id;
      newActivity.timeslices.push(timeslice);
      dime.resources.timeslice.persist(timeslice);
      e.target.value = '';
    });
  };

}) (dime, moment, m)
