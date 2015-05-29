;
(function (dime, _) {
  'use strict';

  var alias = function (e, scope, relation, trigger) {
    var match = e.target.value.match(new RegExp('.*(' + trigger + '[a-zA-z0-9]+)$'));
    if (match && 2 === match.length) {
      scope.module.suggestions = [];
      var alias = match[1].substr(1);
      var matching = _.filter(relation, function (item) {
        return item.alias.startsWith(alias);
      });
      _.forEach(matching, function (item) {
        scope.module.suggestions.push(item);
      });
    }
  };

  // customer
  dime.modules.prompt.autocompletions.push(function completeCustomer (e, scope) {
    return alias(e, scope, dime.resources.customer, '@');
  });

  // project
  dime.modules.prompt.autocompletions.push(function completeProject (e, scope) {
    return alias(e, scope, dime.resources.project, '/');
  });

  // service
  dime.modules.prompt.autocompletions.push(function completeService (e, scope) {
    return alias(e, scope, dime.resources.service, ':');
  });

})(dime, _);