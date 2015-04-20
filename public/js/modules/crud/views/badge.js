"use strict";

(function (dime, m) {

  var t = dime.translate;

  dime.modules.crud.views.badge = function (type, activity) {
    var item = activity[type],
        model = dime.model[type.charAt(0).toUpperCase() + type.substr(1)],
        cssClass = ".empty",
        title = t('No ' + type + ' selected'),
        visibility = dime.configuration.get({name: activity.id, namespace: 'activity/' + type + '/visibility', defaultValue: 0});

    if (item && item.alias && item.alias.length) {
      cssClass = ".incomplete";
      title = t('Please edit ' + type + ' details');

      if (item.name && item.name.length) {
        cssClass = "";
        title = item.name;
      }
    }

    if (visibility && 1 === visibility) {
      cssClass += '.open';
    }

    return m("li.dropdown" + cssClass, [
      m("a", {title: title, href: "#", onclick: function() {
            visibility = Math.abs(visibility - 1);
            dime.configuration.set({name: activity.id, namespace: 'activity/' + type + '/visibility', value: visibility});
            return false;
          } }, model.shortcut + (item && item.alias ? item.alias : "")),
      dime.modules.crud.views.select(type, activity)
    ]);
  };

})(dime, m);
