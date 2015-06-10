;(function (dime) {
  'use strict';

  var module = dime.modules.report = {};

  module.controller = function () {
    var scope = {};

    return scope;
  };

  module.view = function (scope) {

    return m('div', [
      m('h2', t('Reports'))
    ]);
  };

  module.views = {};


  dime.routes["/report"] = dime.modules.report;

  dime.menu.push({
    id: "reports",
    route: "/report",
    name: "Report",
    icon: 'icon-print',
    weight: -10
  });


})(dime);