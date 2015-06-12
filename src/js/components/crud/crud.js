'use strict';

var m = require('mithril');
var helper = require('../../core/helper');
var views = {
  button: require('../../core/views/button'),
  item: require('./views/item')
};

var component = {};

component.allowed = ['customer', 'project', 'service'];

component.controller = function () {
  var scope = {};

  var type = m.route.param('name');
  if (-1 === component.allowed.indexOf(type)) {
    m.route('/');
  }

  scope.type = type;
  scope.modelName = helper.ucFirst(type);
  scope.properties = dime.model[scope.modelName].properties;
  scope.resource = dime.resources[type];
  scope.add = function (e) {
     scope.resource.add({});
     return false;
  };

  return scope;
};

component.view = function(scope) {
  var items = scope.resource || [];

  var headers = scope.properties().map(function(property) {
    var options = property.options || {};
    return m('th', options, t(property.title));
  });
  headers.push(
    m('th.empty')
  );

  var header = m('thead', m('tr', headers));
  
  var rows = m('tbody', items.map(function (item) {
    return views.item(item, scope.type, scope.properties(item));
  }));

  var list = [
    m('h2', t(scope.type + 's')),
    m('table.table.table-stripe.table-hover', [header, rows])
  ];
  
  return m('div.list-' + scope.type, [list, views.button('Add ' + scope.type, '/' + scope.type, scope.add)]);
};
//
//
//// register customer
//dime.resources.customer = new dime.Collection({
//  resourceUrl: "customer",
//  model: dime.model.Customer
//});
//
//// register project
//dime.resources.project = new dime.Collection({
//  resourceUrl: "project",
//  model: dime.model.Project
//});
//
//// register service
//dime.resources.service = new dime.Collection({
//  resourceUrl: "service",
//  model: dime.model.Service
//});
//
//// resource fetch
//dime.resources.customer.fetch();
//dime.resources.project.fetch();
//dime.resources.service.fetch();

module.exports = component;