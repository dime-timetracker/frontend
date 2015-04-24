'use strict';

(function (dime, m, moment) {

  dime.modules.timeslice = {
    views: {}
  };

  // register resource
  dime.resources.timeslice = new Resource({
    url: dime.apiUrl + "timeslice",
    model: dime.model.Timeslice,
    fail: dime.modules.login.redirect,
    success: dime.modules.login.success,
    empty: {
      activity: null,
      startedAt: null,
      stoppedAt: null,
      duration: 0
    }
  });

})(dime, m, moment);
