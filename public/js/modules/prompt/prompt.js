'use strict';

(function (dime, moment, m) {

  var t = dime.translate;

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
              placeholder: t('Add an activity'),
              onfocus: function() { scope.help = true },
              onblur: function() { scope.help = false },
              onkeyup: function(e) {
                if (13 === e.keyCode) { //ENTER
                  return submit(e);
                }
                _.forEach(dime.modules.prompt.autocompletions, function (autocomplete) {
                  autocomplete(e);
                });
              }
            }),
            m("div.form-help.form-help-msg" + showHelp, [
              m("span.basics", t('Enter a description to start an activity.')),
              m("ul", [
                m('li.dates.duration', t('You may specify a duration by entering something like 1h 10m or 1:10.')),
                m('li.dates.start', t('You may specify a start by entering something like 13:50-')),
                m('li.dates.end', t('You may specify an end by entering something like -15:10')),
                m('li.dates.start-and-end', t('You may specify start and end by entering something like 13:50-15:10')),
                m('li.customer', t('Use "@" to specify a customer.')),
                m('li.project', t('Use "/" to specify a project.')),
                m('li.service', t('Use ":" to specify a service.')),
                m('li.tags', t('Use "#" to add tags.')),
              ])
            ])
          ])
        )
      );
    }
  };

  dime.modules.prompt.autocompletion = {};
  dime.modules.prompt.autocompletions = [];

  var submit = function (e) {
    var newActivity = dime.parser.parse(e.target.value);
    var timeslice = {
      startedAt: _.isEmpty(newActivity.startedAt) ? moment().format('YYYY-MM-DD HH:mm:ss') : newActivity.startedAt,
    };

    if (false == _.isEmpty(newActivity.stoppedAt)) {
      timeslice.stoppedAt = newActivity.stoppedAt;
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
