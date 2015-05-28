;(function (dime, moment, m, Mousetrap) {
  'use strict';
  
  var module = dime.modules.prompt = {};

  module.controller = function () {
    var scope = {
      suggestions: []
    };

    scope.submit = function (e) {
      var data = dime.helper.parser.parse(e.target.value);
      var activity = dime.resources.activity.create(data);

      if (_.isUndefined(data.timeslices) || 0 === data.timeslices.length) {
        activity.timeslices.add({});
      }
      
      dime.resources.activity.persist(activity);
      dime.helper.prompt.blur(e, scope);
    };

    scope.filter = function (e) {
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

    return scope;
  };

  var humanReadableShortcut = function (key) {
    var shortcuts = dime.helper.prompt.shortcuts();
    return dime.helper.format.mousetrapCommand(shortcuts[key], t);
  };
    
  module.view = function (scope) {
    var cardContent = [
      dime.core.views.grid(
        m('input#prompt.form-control.mousetrap.activity-icon', {
          placeholder: t('Add an activity') + ' (' + humanReadableShortcut('focusPrompt') + ')',
          onfocus: function (e) { dime.helper.prompt.init(e, scope, scope.submit); },
          onblur: function (e) { dime.helper.prompt.blur(e, scope); },
          onkeydown: function (e) { dime.helper.prompt.updateSuggestions(e, scope); }
        }),
        m('input#filter.form-control.mousetrap.text-right.filter-icon', {
          placeholder: t('Filter activities') + ' (' + humanReadableShortcut('focusFilter') + ')',
          onfocus: function (e) { dime.helper.prompt.init(e, scope, scope.filter); },
          onblur: function (e) { dime.helper.prompt.blur(e, scope); },
          onkeydown: function (e) { dime.helper.prompt.updateSuggestions(e, scope); }
        })
      )
    ];

    if (scope.suggestions.length > 0) {
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
    }

    return dime.core.views.card(cardContent);
  };

  module.autocompletion = {};
  module.autocompletions = [];

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
