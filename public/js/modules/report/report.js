;(function (dime) {
  'use strict';

  var module = dime.modules.report = {};

  module.controller = function () {
    var scope = {};

    return scope;
  };

  module.view = function (scope) {

    return m('div.list-' + scope.type, [ dime.core.views.button('Add ' + scope.type, '/' + scope.type, scope.add)]);
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