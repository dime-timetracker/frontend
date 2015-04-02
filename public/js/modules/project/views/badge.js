'use strict';

(function (dime, m) {

  dime.modules.project.views.badge = function (activity) {
    var project = activity.project;
    var cssClass = '.empty';
    var title = 'No project selected';

    if (project && project.alias && project.alias.length) {
      cssClass = '.incomplete';
      title = 'Please edit project details';

      if (project && project.name && project.name.length) {
        cssClass = '';
        title = project.name;
      }
    }

    return m("span.badge.project" + cssClass, {
      title: title
    }, [
      "/" + (project && project.alias ? project.alias : ""),
      dime.modules.project.views.select(activity)
    ]);
  }

})(dime, m);
