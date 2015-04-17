"use strict";

(function (dime, m) {

  var t = dime.translate;

  dime.modules.project.views.badge = function (activity) {
    var project = activity.project,
        cssClass = ".empty",
        title = t('No project selected'),
        visibility = dime.configuration.get({name: activity.id, namespace: 'activity/project/visibility', defaultValue: 0});

    if (project && project.alias && project.alias.length) {
      cssClass = ".incomplete";
      title = t('Please edit project details');

      if (project && project.name && project.name.length) {
        cssClass = "";
        title = project.name;
      }
    }

    if (visibility && 1 === visibility) {
      cssClass += '.open';
    }

    return m("li.dropdown" + cssClass, [
      m("a", {title: title, href: "#", onclick: function() {
            visibility = Math.abs(visibility - 1);
            dime.configuration.set({name: activity.id, namespace: 'activity/project/visibility', value: visibility});
            return false;
          } }, "/" + (project && project.alias ? project.alias : "")),
      dime.modules.project.views.select(activity)
    ]);
  };

})(dime, m);
