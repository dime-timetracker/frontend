'use strict';

(function (dime, m, _) {
  dime.modules.prompt.autocompletion.alias = function(e, scope, relation, trigger) {
    if (e.key.length > 1) { // no character added
      return;
    }
    var match = e.target.value.match(new RegExp('.*(' + trigger + '[a-zA-z0-9]+)$'));
    if (match && 2===match.length) {
      var alias = match[1].substr(1);
      var matching = _.filter(relation, function(item) {
        return item.alias.startsWith(alias);
      });
      _.forEach(matching, function(item) {
        scope.suggestions.push(item);
      });
    }
  }
})(dime, m, _)
