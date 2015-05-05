;(function (dime, m, _) {
  'use strict';
  dime.modules.prompt.autocompletions.push(function(e, scope) {
    return dime.modules.prompt.autocompletion.alias(e, scope, dime.resources.customer, '@');
  });
})(dime, m, _);
