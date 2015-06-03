;(function (dime, m) {
  'use strict';

  var visibilityPath = function (type, activity) {
    return 'activity/' + type + '/visibility/' + activity.id;
  };

  var isDropdownVisible = function (type, activity) {
    return dime.configuration.getLocal(visibilityPath(type, activity), false);
  };

  var toggleVisibility = function (type, activity) {
    var visible = isDropdownVisible(type, activity);
    dime.configuration.setLocal(visibilityPath(type, activity), !visible);
    m.redraw();
  };

  dime.core.views.badge = function (type, activity) {
    var item = activity[type],
        model = dime.model[dime.helper.format.ucFirst(type)],
        cssClass = '.empty',
        title = t('No ' + type + ' selected');

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
          toggleVisibility(type, activity);
        }}, model.shortcut + (item && item.alias ? item.alias : ''))
    ];

    if (isDropdownVisible(type, activity)) {
      cssClass += '.open';
      content.push(dime.core.views.dropdown(type, activity, function () {
        toggleVisibility(type, activity);
      }));
    }

    return m('li.dropdown' + cssClass, content);
  };

})(dime, m);
