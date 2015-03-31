'use strict';

(function (dime, m) {

  dime.modules.service.views.badge = function (activity) {
    var service = activity.service;
    var cssClass = '.empty';
    var title = 'No service selected';

    if (service) {
      cssClass = service.name && service.name.length ? "" : ".incomplete";
      title = service.name && service.name.length ? service.name : "Please edit service details";
    }

    return m("span.badge.service" + cssClass, {
      title: title
    }, [
      ":" + (service && service.alias ? service.alias : ""),
      dime.modules.service.views.select(activity)
    ]);
  }

})(dime, m);
