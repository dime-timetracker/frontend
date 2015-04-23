;(function (dime, m) {
  'use strict';

  dime.core.views.badge = function (type, activity) {
    var item = activity[type],
            model = dime.model[type.charAt(0).toUpperCase() + type.substr(1)],
            cssClass = '.empty',
            title = t('No ' + type + ' selected'),
            visibility = dime.modules.setting.local['activity/' + type + '/visibility/' + activity.id] || 0;

    if (item && item.alias && item.alias.length) {
      cssClass = '.incomplete';
      title = t('Please edit ' + type + ' details');

      if (item.name && item.name.length) {
        cssClass = '';
        title = item.name;
      }
    }

    if (visibility && 1 === visibility) {
      cssClass += '.open';
    }

    return m('li.dropdown' + cssClass, [
      m('a', {title: title, href: '#', onclick: function (e) {
          e.preventDefault();
          visibility = Math.abs(visibility - 1);
          dime.modules.setting.local['activity/' + type + '/visibility/' + activity.id] = visibility;
        }}, model.shortcut + (item && item.alias ? item.alias : '')),
      dime.core.views.select(type, activity)
    ]);
  };

})(dime, m);
