'use strict';

(function (dime, _, m, Mousetrap) {
  dime.helper.prompt = {

    shortcuts: function shortcuts() {
      var shortcuts = {};
      _.map(dime.configuration.prompt.children.shortcuts.children, function (setting, key) {
        shortcuts[key] = dime.configuration.get(setting);
      });
      return shortcuts;
    },

    init: function init (e, scope, submit) {
      var shortcuts = dime.helper.prompt.shortcuts();

      Mousetrap(e.target).bind(shortcuts.blurPrompt, function () {
        e.target.value = '';
        e.target.blur();
        dime.helper.prompt.blur(e, scope);
      });

      Mousetrap(e.target).bind(shortcuts.triggerAutocompletion, function(triggerEvent) {
        dime.helper.prompt.autocomplete(triggerEvent, scope); return false;
      });
      Mousetrap(e.target).bind(shortcuts.cycleSuggestionsLeft, function () {
        dime.helper.prompt.cycleSuggestions('left', e, scope); return false;
      });
      Mousetrap(e.target).bind(shortcuts.cycleSuggestionsRight, function () {
        dime.helper.prompt.cycleSuggestions('right', e, scope); return false;
      });
      Mousetrap(e.target).bind('space', function () {
        dime.helper.prompt.clearSuggestions(e, scope);
      });
      Mousetrap(e.target).bind(shortcuts.submitPrompt, function() {
        submit(e);
      });
      scope.help = true;
      return true;
    },

    blur: function blur (e, scope) {
      dime.helper.prompt.clearSuggestions(e, scope);
      scope.help = false;
      Mousetrap(e.target).reset();
      e.target.blur();
    },

    cycleSuggestions: function cycleSuggestions (direction, e, scope) {
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
            dime.helper.prompt.applySuggestion(e, suggestion);
            cycled = true;
            return;
          }
        });
        if (false === cycled) {
          dime.helper.prompt.applySuggestion(e, reloop(scope.suggestions));
        }
      }
    },
      
    applySuggestion: function applySuggestion (e, suggestion) {
      var words = e.target.value.split(' ');
      if (words.length) {
        words[words.length - 1] = words[words.length - 1].substr(0, 1) + suggestion.alias;
        e.target.value = words.join(' ');
        suggestion.selected = true;
        m.redraw();
      }
    },

    autocomplete: function autocomplete(e, scope) {
      _.forEach(dime.modules.prompt.autocompletions, function (autocomplete) {
        autocomplete(e, scope);
        if (scope.suggestions.length) {
          dime.helper.prompt.applySuggestion(e, scope.suggestions[0]);
        }
        if (1 == scope.suggestions.length) {
          dime.helper.prompt.clearSuggestions(e, scope);
        }
      });
      return false;
    },

    updateSuggestions: function updateSuggestions(e, scope) {
      // some char added
      if ((e.keyCode && 1 == e.keyCode.length) || (e.which && 1 == e.which.length)) {
        if (scope.suggestions.length) {
          dime.helper.prompt.autocomplete(e, scope);
          return;
        }
      }
    },

    clearSuggestions: function clearSuggestions(e, scope) {
      scope.suggestions = [];
      m.redraw();
    }

  }
})(dime, _, m, Mousetrap);
