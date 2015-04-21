'use strict';

(function (dime, m, _) {
  dime.modules.prompt.autocompletions.push(function(e, scope) {
    var customers = dime.resources.customer.findAll() || [];
    return dime.modules.prompt.autocompletion.alias(e, scope, customers, '@');
  });
})(dime, m, _)
