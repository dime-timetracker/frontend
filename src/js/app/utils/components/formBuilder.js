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

var m = require('mithril');
var isFunction = require('lodash/lang/isFunction');
var forOwn = require('lodash/object/forOwn');
var t = require('../../../lib/translation');
var propertyModel = require('../../../lib/helper/propertyModel');

var formGroup = require('../views/form/group');
var inputField = require('../views/form/input');
var selectField = require('../views/form/select');
var selectBooleanField = require('../views/form/selectBoolean');

function viewItem(property) {
  var input;

  switch (property.type) {
    case 'boolean':
      input = selectBooleanField(property.value(), property.update);
      break;
    case 'select':
      input = selectField(property.values(), property.update, property.value());
      break;
    case 'relation':
      input = selectField(
        property.values(),
        property.update,
        (property.value()) ? property.value().alias: ''
      );
      break;
    default:
      input = inputField(property.value(), property.update, property.type);
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

  content.push(scope.properties.map(viewItem));

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
