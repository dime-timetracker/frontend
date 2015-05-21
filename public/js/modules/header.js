;(function (dime) {
  'use strict';

  var module = dime.modules.header = {};

  module.controller = function () {
    var scope = {};

    scope.icon = dime.env.icon || 'icon-access-time';
    scope.name = dime.env.name || 'Dime Timetracker';
    scope.views = [ dime.modules.header.views.logo ];

    dime.events.emit('header-before-view', scope);

    return scope;
  };
  
  module.view = function (scope) {
    var content = [], 
        i = 0;
    for (; i < scope.views.length; i++) {
      if (_.isFunction(scope.views[i])) {
        content.push(scope.views[i](scope));
      }
    }
    
    var color = dime.configuration.get(dime.configuration.general.children.customize.children.color);
    if (color) {
      color = '.' + color.split(' ').join('.');
    }

    return m('header.header' + color, content);
  };

  module.views = {
    logo: function (scope) {
      return m('a[href="#/"].header-logo', [m('span.icon.' + scope.icon), ' ', scope.name]);
    }
  };

  dime.configuration.general.children.customize = {
    title: "Pimp my dime",
    children: {
      name: {
        title: 'Application name',
        namespace: 'general',
        name: 'customize/header/name',
        type: 'text',
        defaultValue: dime.env.name || 'Dime Timetracker'
      },
      icon: {
        title: 'Application icon',
        namespace: 'general',
        name: 'customize/header/icon',
        type: 'text',
        defaultValue: dime.env.icon || 'icon-access-time'
      },
      color: {
        title: 'Header color',
        description: 'Change header color (red)',
        namespace: 'general',
        name: 'customize/header/color',
        type: 'text',
        defaultValue: 'green'
      }
    }
  };

})(dime);