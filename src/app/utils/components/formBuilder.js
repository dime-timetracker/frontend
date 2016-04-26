'use strict';

/**
 * FormBuilder
 *
 * m.component(formBuilder, {
 *   key: UNIQUE,
 *   model: model,
 *   onSubmit: func,
 *   onCancel: func,
 *   onDelete: func
 * });
 */

var m = require('src/lib/mithril');
var isFunction = require('lodash/lang/isFunction');
var forOwn = require('lodash/object/forOwn');
var t = require('../../../lib/translation');
var propertyModel = require('../../../lib/helper/propertyModel');

var formGroup = require('../views/formfields/group');
var inputField = require('../views/formfields/input');
var selectField = require('../views/formfields/select');
var selectBooleanField = require('../views/formfields/selectBoolean');

function propertyField(property) {
  var input;
  var options = {
    update: property.update
  };

  switch (property.type) {
    case 'boolean':
      input = selectBooleanField(property.value(), options);
      break;
    case 'select':
      options.selected = property.value();
      input = selectField(property.values(), options);
      break;
    case 'relation':
      options.selected = (property.value()) ? property.value().alias: '';
      input = selectField(property.values(), options);
      break;
    default:
      options.type = property.type;
      input = inputField(property.value(), options);
  }

  return formGroup(input, t(property.key));
}

function controller(args) {
  var scope = {
    model: args.model,
    properties: [],
  };

  if (isFunction(args.onSubmit)) {
    scope.onSubmit = args.onSubmit;
  }

  if (isFunction(args.onDelete)) {
    scope.onDelete = args.onDelete;
  }

  if (isFunction(args.onCancel)) {
    scope.onCancel = args.onCancel;
  }

  forOwn(args.model.properties, function (value, key) {
    scope.properties.push(propertyModel.call(args.model, key, value));
  });

  return scope;
}

function view(scope) {
  var content = [];

  content.push(scope.properties.map(propertyField));

  var actions = [
    m('button.btn.btn-green.pull-right', {
      type: 'button',
      title: t('Save'),
      onclick: scope.onSubmit
    }, m('span.icon.icon-lg.icon-done'))
  ];

  if (scope.onDelete) {
    actions.push(m('button.btn.btn-red', {
      type: 'button',
      title: t('Delete'),
      onclick: scope.onDelete
    }, m('span.icon.icon-lg.icon-delete')));
  }

  content.push(m('.form-group-btn', actions));

  return m('.form', content);
}

module.exports = {
  controller: controller,
  view: view
};
