;(function (dime, m) {
  'use strict';

  dime.core.views.badge = function (type, activity) {
    var item = activity[type],
        model = dime.model[dime.helper.format.ucFirst(type)],
        cssClass = '.empty',
        title = t('No ' + type + ' selected'),
        visibility = dime.configuration.getLocal('activity/' + type + '/visibility/' + activity.id, 0);

    if (item && item.alias && item.alias.length) {
      cssClass = '.incomplete';
      title = t('Please edit ' + type + ' details');

      if (item.name && item.name.length) {
        cssClass = '';
        title = item.name;
      }
    }

    var content = [
      m('a', {title: title, href: '#', onclick: function (e) {
          e.preventDefault();
          visibility = Math.abs(visibility - 1);
          dime.configuration.setLocal('activity/' + type + '/visibility/' + activity.id, visibility);
        }}, model.shortcut + (item && item.alias ? item.alias : ''))
    ];

    if (visibility && 1 === visibility) {
      cssClass += '.open';
      content.push(dime.core.views.select(type, activity));
    }

    return m('li.dropdown' + cssClass, content);
  };

})(dime, m);
