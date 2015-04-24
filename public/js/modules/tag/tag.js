'use strict';

(function (dime, m, _) {
  
  dime.modules.tag = {
    views: {}
  };
  
  // register schema
  dime.resources.tag = new Resource({
    url: dime.apiUrl + "tag",
    model: dime.modules.tag.model,
    fail: dime.modules.login.redirect,
    success: dime.modules.login.success
  });

})(dime, m, _);
