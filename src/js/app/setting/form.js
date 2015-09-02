'use strict';

var m = require('mithril');
var _ = require('lodash');
var t = require('../../lib/translation');
var configuration = require('../../lib/configuration');
var fields = {
  input: require('../utils/views/formfields/input'),
  select: require('../utils/views/formfields/select'),
  boolean: require('../utils/views/formfields/selectBoolean')
};

function controller(args) {
  var scope = {
    type: args.property.type || 'text',
    path: args.path
  };

  scope.value = function () {
    var value = configuration.get(args.path, args.property.value);
    if (_.isFunction(args.property.onRead)) {
      value = args.property.onRead(value);
    }
    return value;
  };

  scope.update = function (value, e) {
    if (e) {
      e.preventDefault();
    }
    if (_.isFunction(args.property.onWrite)) {
      value = args.property.onWrite(value);
    }

    // FIXME Runs on render
    // configuration.set(args.path, value);
  };

  return scope;
}

function view (scope) {
  var input = [];
  if (fields[scope.type]) {
    input.push(fields[scope.type](scope.value(), { update: scope.update() }));
  } else {
    input.push(fields.input(scope.value(), {
      update: scope.update,
      type: scope.type
    }));
  }

  var description = t('config.' + scope.path + '.description');
  if (0 !== description.indexOf('@@')) {
    input.push(m('span.form-help', description));
  }

  return m('p.row.form-group', [
    m('.col-md-3', t('config.' + scope.path + '.title')),
    m('.col-md-9', input)
  ]);
}

module.exports = {
  controller: controller,
  view: view
};
