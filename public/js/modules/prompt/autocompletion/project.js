'use strict';

(function (dime, m, _) {
  dime.modules.prompt.autocompletions.push(function(e, scope) {
    var projects = dime.resources.project.findAll() || [];
    return dime.modules.prompt.autocompletion.alias(e, scope, projects, '/');
  });
})(dime, m, _)
