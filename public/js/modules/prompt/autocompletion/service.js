'use strict';

(function (dime, m, _) {
  dime.modules.prompt.autocompletions.push(function(e) {
    var services = dime.resources.service.findAll() || [];
    return dime.modules.prompt.autocompletion.alias(e, services, ':');
  });
})(dime, m, _)
