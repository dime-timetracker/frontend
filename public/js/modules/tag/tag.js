'use strict';

(function (dime, m, _) {
  
  dime.modules.tag = {
    views: {}
  };
  
  // register schema
  dime.resources.tag = new dime.Collection({
    url: 'tag',
    model: dime.model.Tag,
    fail: dime.modules.login.redirect,
    success: dime.modules.login.success
  });

})(dime, m, _);
