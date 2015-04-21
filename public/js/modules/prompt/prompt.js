'use strict';

(function (dime, moment, m, Mousetrap) {

  var t = dime.translate;

  dime.modules.prompt = {
    controller: function () {
      var scope = {
        help: false,
        suggestions: []
      };

      return scope;
    },
    view: function (scope) {
      var showHelp = ".hide";
      if (scope.help) {
        showHelp = "";
      }

      var shortcuts = {};
      _.map(dime.settings.prompt.children.shortcuts.children, function (setting, key) {
        shortcuts[key] = dime.modules.setting.get(setting);
      });
      
      var initPrompt = function initPrompt (e) {
        Mousetrap(e.target).bind(shortcuts.blurPrompt, function () {
          e.target.value = '';
          e.target.blur();
        });
        Mousetrap(e.target).bind(shortcuts.cycleSuggestions, function () {
          console.log('Not yet implemented.');
          // TODO cycle through autocompletion suggestions
          return false;
        });
        scope.help = true;
        return true;
      }

      var blurPrompt = function blurPrompt (e) {
        scope.help = false;
        Mousetrap(e.target).reset();
        return;
      }

      Mousetrap.bind(shortcuts.focusPrompt, function(e) {
        document.getElementById('prompt').focus()
      });

      return m(".card", 
        m(".card-main", 
          m(".card-inner", [
            m("input#prompt.form-control.mousetrap", {
              placeholder: t('Add an activity'),
              onfocus: initPrompt,
              onblur: blurPrompt
            }),
            m("div.form-help.form-help-msg.suggestions" + showHelp, [
              scope.suggestions.map(function (suggestion) {
                return m('div.suggestion' + (suggestion.selected ? '.selected' : ''), [
                  m('.alias', suggestion.alias),
                  m('.name', suggestion.name),
                ]);
              })
            ]),
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

  dime.settings.prompt = {
    title: t('Prompt'),
    description: t('Prompt settings'),
    children: {
      shortcuts: {
        title: t('Shortcuts'),
        description: t('Keyboard shortcuts'),
        children: {
          focusPrompt: {
            title: 'Add new activity',
            description: 'Press this key to focus prompt',
            namespace: "prompt",
            name: "shortcuts/focusPrompt",
            type: "text",
            defaultValue: '+'
          },
          blurPrompt: {
            title: 'Blur prompt',
            description: 'Press this key to blur prompt',
            namespace: "prompt",
            name: "shortcuts/blurPrompt",
            type: "text",
            defaultValue: 'esc'
          },
          cycleSuggestions: {
            title: 'Cycle suggestions',
            description: 'Press this key to cycle suggestions of prompt autocompletion',
            namespace: "prompt",
            name: "shortcuts/cycleSuggestions",
            type: "text",
            defaultValue: 'tab'
          }
        }
      }
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

    if (_.isArray(newActivity.tags)) {
      newActivity.tags = newActivity.tags.map(function (tag) {
        return {'name': tag};
      })
    }

    dime.resources.activity.persist(newActivity).then(function (newActivity) {
      timeslice.activity = newActivity.id;
      newActivity.timeslices.push(dime.resources.timeslice.config.model(timeslice));
      dime.resources.timeslice.persist(timeslice);
      e.target.value = '';
    });
  };

}) (dime, moment, m, Mousetrap)
