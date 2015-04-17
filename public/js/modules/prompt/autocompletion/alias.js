'use strict';

(function (dime, m, _) {
  dime.modules.prompt.autocompletion.alias = function(e, relation, trigger) {
    if (e.key.length > 1) { // no character added
      return;
    }
    var match = e.target.value.match(new RegExp('.*(' + trigger + '[a-zA-z0-9]+)$'));
    if (match && 2===match.length) {
      var alias = match[1].substr(1);
      var matching = _.filter(relation, function(item) {
        return item.alias.startsWith(alias);
      });
      if (1 === matching.length) {
        e.target.value = e.target.value.replace(trigger + alias, trigger + matching[0].alias);
      }
    }
  }
})(dime, m, _)
