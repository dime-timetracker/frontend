'use strict';

var m = require('mithril');

function collections () {
  return [
    require('../../core/collection/customers'),
    require('../../core/collection/projects'),
    require('../../core/collection/services'),
    require('../../core/collection/tags')
  ];
}

function suggestions (scope) {
  collections().forEach(function (collection) {
    var prefix = collection.model.prototype.shortcut;
    var match = scope.value.match(new RegExp('\\B' + prefix + '([a-z0-9\\-\\/\\_+]+)$', 'i'));
    if (match && 2 === match.length) {
      var alias = match[1].substr(1);
      scope.suggestions = collection.filter(function (item) {
        return item.alias.startsWith(alias);
      });
    }
  });

function suggestionView (suggestion) {
  return m('.suggestion', suggestion.name);
}

function controller (shellScope) {
  return {
    value: shellScope.value,
    suggestions: []
  };
}

function view (scope) {
  return m('.suggestions', scope.suggestions.map(suggestionView));
}

module.exports = {
  controller: controller,
  view: view
};
