'use strict';

(function (dime, m, _) {
  dime.modules.prompt.autocompletions.push(function(e) {
    var customers = dime.resources.customer.findAll() || [];
    return dime.modules.prompt.autocompletion.alias(e, customers, '@');
  });
})(dime, m, _)
