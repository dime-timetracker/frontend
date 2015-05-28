;(function (dime, moment, m, Mousetrap) {
  'use strict';

  dime.modules.prompt = {
    controller: function () {
      var scope = {
        help: false,
        suggestions: []
      };

      return scope;
    },
    view: function (scope) {
      var submit = function (e) {
        var newActivity = new dime.resources.activity.create(dime.parser.parse(e.target.value));

        var timeslice = newActivity.timeslices.add({
          startedAt: _.isEmpty(newActivity.startedAt) ? moment().format('YYYY-MM-DD HH:mm:ss') : newActivity.startedAt
        });

        if (false === _.isEmpty(newActivity.stoppedAt)) {
          timeslice.stoppedAt = newActivity.stoppedAt;
        }

        if (_.isArray(newActivity.tags)) {
          newActivity.tags = newActivity.tags.map(function (tag) {
            return {'name': tag};
          });
        }

        dime.resources.activity.persist(newActivity);

        dime.helper.prompt.blur(e, scope);
      };

      var updateFilter = function (e) {
        dime.modules.activity.filters = {
          'default': function (activity) { return true; }
        };
        var filter = dime.parser.parseFilter(e.target.value);
        _.forIn(filter, function(value, key) {
          if (_.isObject(value) && _.isString(value.alias)) {
            dime.modules.activity.filters[key] = function(activity) {
              return activity[key].alias === value.alias;
            };
          }
        });
        if (filter.description.length) {
          dime.modules.activity.filters.description = function(activity) {
            return _.contains(activity.description, filter.description);
          };
        }
        if (filter.startedAt) {
          dime.modules.activity.filters.startedAt = function (activity) {
            return activity.timeslices.some(function (timeslice) {
              return moment(timeslice.startedAt).isAfter(filter.startedAt);
            });
          };
        }
        if (filter.stoppedAt) {
          dime.modules.activity.filters.stoppedAt = function (activity) {
            return activity.timeslices.some(function (timeslice) {
              return moment(timeslice.stoppedAt).isBefore(filter.stoppedAt);
            });
          };
        }
        dime.modules.activity.applyFilter();

        dime.helper.prompt.blur(e, scope);
      };

      var humanReadableShortcut = function (key) {
        var shortcuts = dime.helper.prompt.shortcuts();
        return dime.helper.format.mousetrapCommand(shortcuts[key], t);
      };

      var cardContent = [
        dime.core.views.grid(
          m('input#prompt.form-control.mousetrap.activity-icon', {
            placeholder: t('Add an activity') + ' (' + humanReadableShortcut('focusPrompt') + ')',
            onfocus: function (e) { dime.helper.prompt.init(e, scope, submit); },
            onblur: function (e) { dime.helper.prompt.blur(e, scope); },
            onkeydown: function (e) { dime.helper.prompt.updateSuggestions(e, scope); }
          }),
          m('input#filter.form-control.mousetrap.text-right.filter-icon', {
            placeholder: t('Filter activities') + ' (' + humanReadableShortcut('focusFilter') + ')',
            onfocus: function (e) { dime.helper.prompt.init(e, scope, updateFilter); },
            onblur: function (e) { dime.helper.prompt.blur(e, scope); },
            onkeydown: function (e) { dime.helper.prompt.updateSuggestions(e, scope); }
          })
        )
      ];

      if (scope.help) {
        cardContent.push(m('div.row.suggestions', [
          scope.suggestions.map(function (suggestion) {
            return m('div.col-lg-2.col-md-3.col-sm-4',
              m('div.card.suggestion.' + (suggestion.selected ? '.card-blue-bg' : ''),
                m('div.card-main',
                  m('div.card-inner', [
                    m('p.card-heading.alias', suggestion.alias),
                    m('p.name', suggestion.name || t('(Please edit details!)'))
                  ])
                )
              )
            );
          })
        ]));
        
        cardContent.push(m('div.form-help.form-help-msg', [
          m('span.basics', t('Enter a description to start an activity.')),
          m('ul', [
            m('li.dates.duration', t('You may specify a duration by entering something like 1h 10m or 1:10.')),
            m('li.dates.start', t('You may specify a start by entering something like 13:50-')),
            m('li.dates.end', t('You may specify an end by entering something like -15:10')),
            m('li.dates.start-and-end', t('You may specify start and end by entering something like 13:50-15:10')),
            m('li.customer', t('Use "@" to specify a customer.')),
            m('li.project', t('Use "/" to specify a project.')),
            m('li.service', t('Use ":" to specify a service.')),
            m('li.tags', t('Use "#" to add tags.'))
          ])
        ]));
      }

      return dime.core.views.card(cardContent);
    }
  };

  dime.modules.prompt.autocompletion = {};
  dime.modules.prompt.autocompletions = [];

  dime.configuration.prompt = {
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
            namespace: 'prompt',
            name: 'shortcuts/focusPrompt',
            type: 'text',
            defaultValue: 'mod+a'
          },
          submitPrompt: {
            title: 'Submit prompt',
            description: 'Press this key to submit prompt',
            namespace: 'prompt',
            name: 'shortcuts/submitPrompt',
            type: 'text',
            defaultValue: 'enter'
          },
          blurPrompt: {
            title: 'Blur prompt',
            description: 'Press this key to blur prompt',
            namespace: 'prompt',
            name: 'shortcuts/blurPrompt',
            type: 'text',
            defaultValue: 'esc'
          },
          triggerAutocompletion: {
            title: 'Trigger autocompletion',
            description: 'Press this key to trigger prompt autocompletion',
            namespace: 'prompt',
            name: 'shortcuts/triggerAutocompletion',
            type: 'text',
            defaultValue: 'tab'
          },
          cycleSuggestionsLeft: {
            title: 'Cycle suggestions',
            description: 'Press this key to cycle suggestions of prompt autocompletion',
            namespace: 'prompt',
            name: 'shortcuts/cycleSuggestionsLeft',
            type: 'text',
            defaultValue: 'left'
          },
          cycleSuggestionsRight: {
            title: 'Cycle suggestions',
            description: 'Press this key to cycle suggestions of prompt autocompletion',
            namespace: 'prompt',
            name: 'shortcuts/cycleSuggestionsRight',
            type: 'text',
            defaultValue: 'right'
          },
          focusFilter: {
            title: 'Focus filter',
            description: 'Press this key to focus filter',
            namespace: 'prompt',
            name: 'shortcuts/focusFilter',
            type: 'text',
            defaultValue: 'mod+f'
          }
        }
      }
    }
  };



  Mousetrap.bind(dime.helper.prompt.shortcuts().focusPrompt, function(e) {
    document.getElementById('prompt').focus();
    return false;
  });

  Mousetrap.bind(dime.helper.prompt.shortcuts().focusFilter, function(e) {
    document.getElementById('filter').focus();
    return false;
  });
  
}) (dime, moment, m, Mousetrap)
