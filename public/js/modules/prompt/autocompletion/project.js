'use strict';

(function (dime, m, _) {
  dime.modules.prompt.autocompletions.push(function(e) {
    var projects = dime.resources.project.findAll() || [];
    return dime.modules.prompt.autocompletion.alias(e, projects, '/');
  });
})(dime, m, _)
