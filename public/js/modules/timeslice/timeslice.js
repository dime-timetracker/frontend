'use strict';

(function (dime, m, moment) {

  dime.modules.timeslice = {
    views: {}
  };

  // register resource
  dime.resources.timeslice = new dime.Collection({
    url: 'timeslice',
    model: dime.model.Timeslice,
    fail: dime.modules.login.redirect,
    success: dime.modules.login.success
  });

})(dime, m, moment);
