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
      
      var applySuggestion = function (e, suggestion) {
        var words = e.target.value.split(' ');
        if (words.length) {
          words[words.length - 1] = words[words.length - 1].substr(0, 1) + suggestion.alias;
          e.target.value = words.join(' ');
          suggestion.selected = true;
          m.redraw();
        }
      }

      var autocomplete = function (keyEvent) {
        _.forEach(dime.modules.prompt.autocompletions, function (autocomplete) {
          autocomplete(keyEvent, scope);
          if (scope.suggestions.length) {
            applySuggestion(keyEvent, scope.suggestions[0]);
          }
        });
        return false;
      };

      var initPrompt = function initPrompt (e) {
        Mousetrap(e.target).bind(shortcuts.blurPrompt, function () {
          e.target.value = '';
          e.target.blur();
        });

        Mousetrap(e.target).bind(shortcuts.triggerAutocompletion, autocomplete);
        Mousetrap(e.target).bind(shortcuts.cycleSuggestionsLeft, function () {
          cycleSuggestions('left', e); return false;
        });
        Mousetrap(e.target).bind(shortcuts.cycleSuggestionsRight, function () {
          cycleSuggestions('right', e); return false;
        });
        Mousetrap(e.target).bind(shortcuts.submitPrompt, submit);
        scope.help = true;
        return true;
      }

      var cycleSuggestions = function cycleSuggestions (direction, e) {
        var loop = ('left' === direction) ? _.forEachRight : _.forEach;
        var reloop = ('left' === direction) ? _.last : _.first;
        var prevKey = undefined;
        var cycled = false;
        if (scope.suggestions.length) {
          loop(scope.suggestions, function (suggestion, key) {
            if (_.isUndefined(prevKey)) {
              if (_.isBoolean(suggestion.selected) && suggestion.selected) {
                prevKey = key;
                suggestion.selected = false;
              }
            } else if (false === cycled) {
              applySuggestion(e, suggestion);
              cycled = true;
              return;
            }
          });
          if (false === cycled) {
            applySuggestion(e, reloop(scope.suggestions));
          }
        }
      }

      var blurPrompt = function blurPrompt (e) {
        scope.help = false;
        e.target.blur();
        Mousetrap(e.target).reset();
        return;
      }

      var updateSuggestions = function updateSuggestions(e) {
        // some char added
        if ((e.keyCode && 1 == e.keyCode.length) || (e.which && 1 == e.which.length)) {
          if (scope.suggestions.length) {
            autocomplete(e);
            return;
          }
        }
      }

      var clearSuggestions = function clearSuggestions(e) {
        scope.suggestions = [];
        m.redraw();
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

        blurPrompt(e);
      };

      Mousetrap.bind('space', clearSuggestions);

      Mousetrap.bind(shortcuts.focusPrompt, function(e) {
        document.getElementById('prompt').focus()
      });

      return m(".card", 
        m(".card-main", 
          m(".card-inner", [
            m("input#prompt.form-control.mousetrap", {
              placeholder: t('Add an activity'),
              onfocus: initPrompt,
              onblur: blurPrompt,
              onkeydown: updateSuggestions
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
            defaultValue: '+'
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
