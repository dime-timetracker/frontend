"use strict";

(function (dime, m) {

  var t = dime.translate;

  dime.modules.service.views.badge = function (activity) {
    var service = activity.service,
        cssClass = ".empty",
        title = t('No service selected'),
        visibility = dime.configuration.get({name: activity.id, namespace: 'activity/service/visibility', defaultValue: 0});

    if (service && service.alias && service.alias.length) {
      cssClass = ".incomplete";
      title = t('Please edit service details');

      if (service && service.name && service.name.length) {
        cssClass = "";
        title = service.name;
      }
    }

    if (visibility && 1 === visibility) {
      cssClass += '.open';
    }

    return m("li.dropdown" + cssClass, [
      m("a", {title: title, href: "#", onclick: function() {
            visibility = Math.abs(visibility - 1);
            dime.configuration.set({name: activity.id, namespace: 'activity/service/visibility', value: visibility});
            return false;
          } }, ":" + (service && service.alias ? service.alias : "")),
      dime.modules.service.views.select(activity)
    ]);
  };

})(dime, m);
