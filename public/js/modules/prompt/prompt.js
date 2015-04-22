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

        dime.helper.prompt.blur(e, scope);
      };

      Mousetrap.bind(dime.helper.prompt.shortcuts().focusPrompt, function(e) {
        document.getElementById('prompt').focus();
        return false;
      });

      return m(".card", 
        m(".card-main", 
          m(".card-inner", [
            m("input#prompt.form-control.mousetrap", {
              placeholder: t('Add an activity'),
              onfocus: function (e) { dime.helper.prompt.init(e, scope, submit) },
              onblur: function (e) { dime.helper.prompt.blur(e, scope) },
              onkeydown: function (e) { dime.helper.prompt.updateSuggestions(e, scope) }
            }),
            m("div.row.suggestions" + showHelp, [
              scope.suggestions.map(function (suggestion) {
                return m('div.col-lg-2.col-md-3.col-sm-4',
                  m('div.card.suggestion.' + (suggestion.selected ? '.card-blue-bg' : ''),
                    m('div.card-main',
                      m('div.card-inner', [
                        m('p.card-heading.alias', suggestion.alias),
                        m('p.name', suggestion.name || t('(Please edit details!)')),
                      ])
                    )
                  )
                );
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
            title: 'Focus prompt',
            description: 'Press this key to focus prompt',
            namespace: "prompt",
            name: "shortcuts/focusPrompt",
            type: "text",
            defaultValue: 'mod+a'
          },
          submitPrompt: {
            title: 'Submit prompt',
            description: 'Press this key to submit prompt',
            namespace: "prompt",
            name: "shortcuts/submitPrompt",
            type: "text",
            defaultValue: 'enter'
          },
          blurPrompt: {
            title: 'Blur prompt',
            description: 'Press this key to blur prompt',
            namespace: "prompt",
            name: "shortcuts/blurPrompt",
            type: "text",
            defaultValue: 'esc'
          },
          triggerAutocompletion: {
            title: 'Trigger autocompletion',
            description: 'Press this key to trigger prompt autocompletion',
            namespace: "prompt",
            name: "shortcuts/triggerAutocompletion",
            type: "text",
            defaultValue: 'tab'
          },
          cycleSuggestionsLeft: {
            title: 'Cycle suggestions',
            description: 'Press this key to cycle suggestions of prompt autocompletion',
            namespace: "prompt",
            name: "shortcuts/cycleSuggestionsLeft",
            type: "text",
            defaultValue: 'left'
          },
          cycleSuggestionsRight: {
            title: 'Cycle suggestions',
            description: 'Press this key to cycle suggestions of prompt autocompletion',
            namespace: "prompt",
            name: "shortcuts/cycleSuggestionsRight",
            type: "text",
            defaultValue: 'right'
          }
        }
      }
    }
  };

}) (dime, moment, m, Mousetrap)
