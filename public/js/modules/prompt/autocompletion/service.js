'use strict';

(function (dime, m, _) {
  dime.modules.prompt.autocompletions.push(function(e, scope) {
    var services = dime.resources.service.findAll() || [];
    return dime.modules.prompt.autocompletion.alias(e, scope, services, ':');
  });
})(dime, m, _)
