'use strict';

(function (dime, m) {

  dime.modules.service.views.badge = function (activity) {
    var service = activity.service;
    var cssClass = '.empty';
    var title = 'No service selected';

    if (service && service.alias && service.alias.length) {
      cssClass = '.incomplete';
      title = 'Please edit service details';

      if (service && service.name && service.name.length) {
        cssClass = '';
        title = service.name;
      }

    }

    return m("span.badge.service" + cssClass, {
      title: title
    }, [
      ":" + (service && service.alias ? service.alias : ""),
      dime.modules.service.views.select(activity)
    ]);
  }

})(dime, m);
