'use strict';

(function (dime, m) {

  dime.modules.project.views.badge = function (activity) {
    var project = activity.project;
    var cssClass = '.empty';
    var title = 'No project selected';

    if (project) {
      cssClass = project.name && project.name.length ? "" : ".incomplete";
      title = project.name && project.name.length ? project.name : "Please edit project details";
    }

    return m("span.badge.project" + cssClass, {
      title: title
    }, [
      "/" + (project && project.alias ? project.alias : ""),
      dime.modules.project.views.select(activity)
    ]);
  }

})(dime, m);
