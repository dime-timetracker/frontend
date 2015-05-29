;(function (dime, moment, m, Mousetrap) {
  'use strict';

  var module = dime.modules.prompt = {};

  module.components = {};

  module.view = function (scope) {
    var inner = [dime.core.views.grid(
      m.component(module.components.activity, module),
      m.component(module.components.filter, module)
    )];

    if (module.suggestions.length) {
      inner.push(module.views.suggestionList(module.suggestions));
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
    Mousetrap.pause();

    Mousetrap(e.target).bind(shortcuts.blurPrompt, function () {
      e.target.value = '';
      scope.blur(e, scope);
    });

    Mousetrap(e.target).bind(shortcuts.triggerAutocompletion, function (triggerEvent) {
      scope.module.autocomplete(triggerEvent, scope);
      return false;
    });
    Mousetrap(e.target).bind(shortcuts.cycleSuggestionsLeft, function () {
      scope.module.cycleSuggestions('left', e, scope);
      return false;
    });
    Mousetrap(e.target).bind(shortcuts.cycleSuggestionsRight, function () {
      scope.module.cycleSuggestions('right', e, scope);
      return false;
    });
    Mousetrap(e.target).bind('space', function () {
      scope.module.clearSuggestions(e, scope);
    });
    Mousetrap(e.target).bind(shortcuts.submitPrompt, function () {
      scope.submit(e);
    });
  };

  module.resetShortcuts = function (e, scope) {
    Mousetrap(e.target).reset();
    Mousetrap.unpause();
    e.target.blur();
  };

  // Autocomplete and Suggesstions
  module.suggestions = [];
  module.autocompletions = [];

  module.autocomplete = function (e, scope) {
    _.forEach(scope.module.autocompletions, function (autocomplete) {
      autocomplete(e, scope);
      if (scope.module.suggestions.length) {
        scope.module.applySuggestion(e, scope.module.suggestions[0]);
      }
      if (1 === scope.module.suggestions.length) {
        scope.module.clearSuggestions(e, scope);
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
    if (scope.module.suggestions.length) {
      loop(scope.module.suggestions, function (suggestion, key) {
        if (_.isUndefined(prevKey)) {
          if (_.isBoolean(suggestion.selected) && suggestion.selected) {
            prevKey = key;
            suggestion.selected = false;
          }
        } else if (false === cycled) {
          scope.module.applySuggestion(e, suggestion);
          cycled = true;
          return;
        }
      });
      if (false === cycled) {
        scope.module.applySuggestion(e, reloop(scope.module.suggestions));
      }
    }
  };

  module.clearSuggestions = function (e, scope) {
    scope.module.suggestions = [];
    m.redraw();
  };

  module.updateSuggestions = function (e, scope) {
    // some char added
    if ((e.keyCode && 1 === e.keyCode.length) || (e.which && 1 === e.which.length)) {
      if (scope.module.suggestions.length) {
        scope.module.autocomplete(e, scope);
      }
    }
  };


})(dime, moment, m, Mousetrap);
