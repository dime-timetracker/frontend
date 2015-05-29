;
(function (dime, moment, m, Mousetrap) {
  'use strict';

  var module = dime.modules.prompt = {};

  module.controller = function () {
    var scope = {
      suggestions: []
    };

    scope.focus = function (e) {
      Mousetrap.pause();
      module.clearSuggestions(e, scope);
      module.installShortcuts(e, scope);
    };

    scope.blur = function (e) {
      Mousetrap.unpause();
      module.resetShortcuts(e, scope);
      module.clearSuggestions(e, scope);
    };

    scope.keydown = function (e) {
      module.updateSuggestions(e, scope);
    };

    scope.submit = function (e) {
      var data = dime.helper.parser.parse(e.target.value, ['customer', 'project', 'service', 'tags', 'times', 'description']);

      var activity = dime.resources.activity.create(data);

      if (_.isUndefined(data.timeslices) || 0 === data.timeslices.length) {
        activity.timeslices.add({});
      }

      if (_.isEmpty(data.description)) {
        activity.description = t('(Click here to enter a description!)');
      }

      dime.resources.activity.persist(activity);
      module.blur(e, scope);
    };

    return scope;
  };

  module.view = function (scope) {
    var input = m('input#prompt.form-control.mousetrap', {
      placeholder: t('Add an activity') + ' (' + dime.helper.format.mousetrapCommand(module.shortcuts()['focusPrompt'], t) + ')',
      onfocus: scope.focus,
      onblur: scope.blur,
      onkeydown: scope.keydown
    });
    var inner = [
      m('.media', [m('.media-object.pull-left', m('label.form-icon-label', {for : 'prompt'}, m('span.icon.icon-access-time'))), m('.media-inner', input)])
    ];

    if (scope.suggestions.length) {
      inner.push(module.views.suggestionList(scope.suggestions));
    }

    return dime.core.views.card(inner);
  };

  module.views = {
    suggestionList: function (suggestions) {
      return m('ul.nav.nav-list', suggestions.map(module.views.suggestionItem));
    },
    suggestionItem: function (suggestion) {
      var bg = suggestion.selected ? '.blue.white-text' : '';
      return m('li', m('a[href=#].tile' + bg, suggestion.name || suggestion.alias ));
    }
  };

  // Shortcuts

  module.shortcuts = function () {
    var shortcuts = {};
    _.map(dime.configuration.prompt.children.shortcuts.children, function (setting, key) {
      shortcuts[key] = dime.configuration.get(setting);
    });
    return shortcuts;
  };

  module.installShortcuts = function (e, scope) {
    var shortcuts = module.shortcuts();
    Mousetrap(e.target).bind(shortcuts.blurPrompt, function () {
      e.target.value = '';
      scope.blur(e, scope);
    });

    Mousetrap(e.target).bind(shortcuts.triggerAutocompletion, function (triggerEvent) {
      module.autocomplete(triggerEvent, scope);
      return false;
    });
    Mousetrap(e.target).bind(shortcuts.cycleSuggestionsLeft, function () {
      module.cycleSuggestions('left', e, scope);
      return false;
    });
    Mousetrap(e.target).bind(shortcuts.cycleSuggestionsRight, function () {
      module.cycleSuggestions('right', e, scope);
      return false;
    });
    Mousetrap(e.target).bind('space', function () {
      module.clearSuggestions(e, scope);
    });
    Mousetrap(e.target).bind(shortcuts.submitPrompt, function () {
      scope.submit(e);
    });
  };

  module.resetShortcuts = function (e, scope) {
    Mousetrap(e.target).reset();
    e.target.blur();
  };

  // Globale key bindings

  Mousetrap.bind(module.shortcuts().focusPrompt, function(e) {
    document.getElementById('prompt').focus();
    return false;
  });

  // Autocomplete and Suggesstions

  module.autocompletions = [];

  module.autocomplete = function (e, scope) {
    _.forEach(module.autocompletions, function (autocomplete) {
      autocomplete(e, scope);
      if (scope.suggestions.length) {
        module.applySuggestion(e, scope.suggestions[0]);
      }
      if (1 === scope.suggestions.length) {
        module.clearSuggestions(e, scope);
      }
    });
    return false;
  };

  module.applySuggestion = function (e, suggestion) {
    var words = e.target.value.split(' ');
    if (words.length) {
      words[words.length - 1] = words[words.length - 1].substr(0, 1) + suggestion.alias;
      e.target.value = words.join(' ');
      suggestion.selected = true;
      m.redraw();
    }
  };

  module.cycleSuggestions = function (direction, e, scope) {
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
          module.applySuggestion(e, suggestion);
          cycled = true;
          return;
        }
      });
      if (false === cycled) {
        module.applySuggestion(e, reloop(scope.suggestions));
      }
    }
  };

  module.clearSuggestions = function (e, scope) {
    scope.suggestions = [];
    m.redraw();
  };

  module.updateSuggestions = function (e, scope) {
    // some char added
    if ((e.keyCode && 1 === e.keyCode.length) || (e.which && 1 === e.which.length)) {
      if (scope.suggestions.length) {
        module.autocomplete(e, scope);
      }
    }
  };


})(dime, moment, m, Mousetrap)
